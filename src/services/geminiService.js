import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// gemini-1.5-flash is fast and cheap — ideal for lightweight classification tasks
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Asks Gemini to classify an idea into a category and generate tags.
 *
 * Returns { category, tags } on success.
 * Throws on API failure so the caller can decide how to handle it.
 */
export const tagIdea = async ({ title, description }) => {
  const prompt = `
You are a concise idea classifier. Analyze the idea below and respond with a single JSON object — no markdown, no explanation.

Rules:
- "category" must be exactly one of: Project, Creative, Life, Business
- "tags" must be an array of 2 to 3 short lowercase strings (max 2 words each)

Idea title: ${title}
Idea description: ${description || "none"}

Respond with JSON only:
{ "category": "...", "tags": ["...", "..."] }
`.trim()

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  // Strip markdown code fences if Gemini wraps the JSON
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()

  const parsed = JSON.parse(cleaned)

  // Validate category is one of the allowed values
  const allowed = ["Project", "Creative", "Life", "Business"]
  if (!allowed.includes(parsed.category)) {
    throw new Error(`Unexpected category: ${parsed.category}`)
  }

  return {
    category: parsed.category,
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3) : [],
  }
}
