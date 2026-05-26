import { GoogleGenerativeAI } from "@google/generative-ai"
import { AI_PROVIDERS, detectProvider } from "@/constants/aiProviders"
import { getKey } from "@/services/keyStore"

// Errors thrown by tagIdea — caught in useIdeas to show the right toast
export const AI_ERRORS = {
  NO_KEY: "NO_KEY",           // user hasn't configured a key yet
  INVALID_KEY: "INVALID_KEY", // key rejected by the provider (401)
  RATE_LIMIT: "RATE_LIMIT",   // quota / rate limit hit (429)
  UNKNOWN: "UNKNOWN",         // anything else
}

/** Maps an HTTP status + message from any provider to a standard AI_ERRORS code. */
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

// GEMINI
// Uses the official @google/generative-ai SDK
const tagWithGemini = async (key, prompt) => {
  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({ model: AI_PROVIDERS.gemini.model })
  try {
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (err) {
    // Gemini SDK wraps HTTP errors — extract the status if available
    const status = err?.status || (err?.message?.includes("API key") ? 401 : 0)
    throw new Error(classifyError(status, err?.message))
  }
}

// OPENAI-COMPATIBLE (OpenAI and Groq share the same request format)
// Groq is OpenAI-compatible so this function handles both providers
const tagWithOpenAICompat = async (key, provider, prompt) => {
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
      temperature: 0.1, // low temperature for consistent classification output
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(classifyError(response.status, body?.error?.message))
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

/**
 * Tags an idea using the user's stored API key.
 *
 * Returns { category, tags } on success.
 * Throws an Error whose message is one of AI_ERRORS.
 */
export const tagIdea = async ({ title, description }) => {
  const key = getKey()
  if (!key) throw new Error(AI_ERRORS.NO_KEY)

  const provider = detectProvider(key)
  if (!provider) throw new Error(AI_ERRORS.INVALID_KEY)

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

  let text
  if (provider === "gemini") {
    text = await tagWithGemini(key, prompt)
  } else {
    text = await tagWithOpenAICompat(key, provider, prompt)
  }

  // Strip markdown code fences some models add around JSON
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
  const parsed = JSON.parse(cleaned)

  const allowed = ["Project", "Creative", "Life", "Business"]
  if (!allowed.includes(parsed.category)) throw new Error(AI_ERRORS.UNKNOWN)

  return {
    category: parsed.category,
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3) : [],
  }
}
