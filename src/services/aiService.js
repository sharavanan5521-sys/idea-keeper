import { GoogleGenerativeAI } from "@google/generative-ai"
import { AI_PROVIDERS, detectProvider } from "@/constants/aiProviders"
import { getKey } from "@/services/keyStore"

export const AI_ERRORS = {
  NO_KEY: "NO_KEY",
  INVALID_KEY: "INVALID_KEY",
  RATE_LIMIT: "RATE_LIMIT",
  UNKNOWN: "UNKNOWN",
}

const classifyError = (status, message = "") => {
  const msg = message.toLowerCase()
  if (status === 401 || msg.includes("invalid") || msg.includes("unauthorized") || msg.includes("api key")) {
    return AI_ERRORS.INVALID_KEY
  }
  if (status === 429 || msg.includes("rate limit") || msg.includes("quota") || msg.includes("exceeded")) {
    return AI_ERRORS.RATE_LIMIT
  }
  return AI_ERRORS.UNKNOWN
}

// Routes to the correct provider. temperature 0.1 = consistent, 0.7 = creative.
const callAI = async (key, provider, prompt, temperature) => {
  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({
      model: AI_PROVIDERS.gemini.model,
      generationConfig: { temperature },
    })
    try {
      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (err) {
      const status = err?.status || (err?.message?.includes("API key") ? 401 : 0)
      throw new Error(classifyError(status, err?.message))
    }
  }

  const baseUrl =
    provider === "groq"
      ? "https://api.groq.com/openai/v1"
      : "https://api.openai.com/v1"

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: AI_PROVIDERS[provider].model,
      messages: [{ role: "user", content: prompt }],
      temperature,
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(classifyError(response.status, body?.error?.message))
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

const stripFences = (text) =>
  text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()

const resolveKey = () => {
  const key = getKey()
  if (!key) throw new Error(AI_ERRORS.NO_KEY)
  const provider = detectProvider(key)
  if (!provider) throw new Error(AI_ERRORS.INVALID_KEY)
  return { key, provider }
}

/**
 * Tags an idea with a category and keywords.
 * Low temperature — we want consistent, deterministic classification.
 * Returns { category, tags }.
 */
export const tagIdea = async ({ title, description }) => {
  const { key, provider } = resolveKey()

  const prompt = `
You are a concise idea classifier. Analyze the idea and respond with a single JSON object — no markdown, no explanation.

Rules:
- "category" must be exactly one of: Project, Creative, Life, Business
- "tags" must be an array of 2 to 3 short lowercase strings (max 2 words each)

Idea title: ${title}
Idea description: ${description || "none"}

Respond with JSON only:
{ "category": "...", "tags": ["...", "..."] }
`.trim()

  const text = await callAI(key, provider, prompt, 0.1)
  const parsed = JSON.parse(stripFences(text))

  const allowed = ["Project", "Creative", "Life", "Business"]
  if (!allowed.includes(parsed.category)) throw new Error(AI_ERRORS.UNKNOWN)

  return {
    category: parsed.category,
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3) : [],
  }
}

// Each expansion request uses a different angle so successive insights stay fresh.
const EXPANSION_ANGLES = [
  {
    angle: "overview",
    label: "General Overview",
    focus:
      "Give a balanced overview: what the idea fundamentally is and why it matters, a clear execution path, key obstacles, useful tools or resources, and an honest verdict on its potential.",
  },
  {
    angle: "risks",
    label: "Risk Analysis",
    focus:
      "Act as a critical thinker. Focus on what could go wrong: execution risks, common failure modes, external threats, and concrete mitigation actions. For 'steps', list mitigation steps. For 'resources', suggest risk frameworks or tools.",
  },
  {
    angle: "market",
    label: "Market & Impact",
    focus:
      "Act as a market analyst. Focus on the real-world opportunity: target audience, market size, competitive landscape, and potential impact. For 'steps', outline how to validate or enter the market. For 'resources', suggest research tools or communities.",
  },
  {
    angle: "creative",
    label: "Creative Angles",
    focus:
      "Think unconventionally. Explore surprising creative pivots, bold experiments, and connections to other domains. For 'steps', suggest creative experiments. For 'resources', inspire with unexpected references or examples.",
  },
]

/**
 * Generates a structured insight expansion for an idea.
 * Higher temperature — we want varied, creative responses across multiple calls.
 * Returns a serialisable expansion object ready to be stored in Firestore.
 */
export const expandIdea = async (idea, expansionCount) => {
  const { key, provider } = resolveKey()

  // Cycle through angles; after all 4, keep generating "creative" variants
  const angleIndex = Math.min(expansionCount, EXPANSION_ANGLES.length - 1)
  const { angle, label, focus } = EXPANSION_ANGLES[angleIndex]

  const prompt = `
You are an idea development coach. ${focus}

Respond with a single JSON object only — no markdown, no explanation.

Idea title: ${idea.title}
Idea description: ${idea.description || "none"}

Return exactly:
{
  "overview": "2–3 sentences",
  "steps": ["step 1", "step 2", "step 3", "step 4"],
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "resources": ["resource or tool 1", "resource or tool 2", "resource or tool 3"],
  "verdict": "1–2 honest, direct sentences"
}
`.trim()

  const text = await callAI(key, provider, prompt, 0.7)
  const parsed = JSON.parse(stripFences(text))

  // serverTimestamp() cannot be nested inside arrayUnion, so we use Date.now()
  const now = Date.now()
  return {
    id: now,
    angle,
    angleLabel: label,
    generatedAt: now,
    content: {
      overview: parsed.overview || "",
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
      resources: Array.isArray(parsed.resources) ? parsed.resources : [],
      verdict: parsed.verdict || "",
    },
  }
}
