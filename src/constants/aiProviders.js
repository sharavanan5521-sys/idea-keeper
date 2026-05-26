/**
 * Supported BYOK providers.
 * To add a new provider: add an entry here and handle it in aiService.js.
 */
export const AI_PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    badge: "Gemini",
    color: "bg-blue-900 text-blue-300",
    keyPrefix: "AIza",
    model: "gemini-1.5-flash",
    keyUrl: "https://aistudio.google.com/app/apikey",
    // Step-by-step shown in SettingsModal when this provider is detected
    steps: [
      "Go to Google AI Studio (aistudio.google.com)",
      "Sign in with your Google account",
      'Click "Get API key" → "Create API key"',
      "Copy the key and paste it above",
    ],
    note: "Free tier — no credit card required.",
  },
  groq: {
    name: "Groq",
    badge: "Groq",
    color: "bg-orange-900 text-orange-300",
    keyPrefix: "gsk_",
    model: "llama-3.1-8b-instant",
    keyUrl: "https://console.groq.com/keys",
    steps: [
      "Go to Groq Console (console.groq.com)",
      "Sign up — free, no credit card needed",
      'Click "Create API Key", give it a name',
      "Copy the key and paste it above",
    ],
    note: "Free tier — very fast inference.",
  },
  openai: {
    name: "OpenAI",
    badge: "OpenAI",
    color: "bg-green-900 text-green-300",
    keyPrefix: "sk-",
    model: "gpt-4o-mini",
    keyUrl: "https://platform.openai.com/api-keys",
    steps: [
      "Go to OpenAI Platform (platform.openai.com)",
      "Sign in and go to API Keys",
      'Click "Create new secret key"',
      "Copy the key immediately — it won't be shown again",
    ],
    note: "Paid — requires a funded account.",
  },
}

/**
 * Detects which provider a key belongs to based on its prefix.
 * Returns null if the key doesn't match any known provider.
 */
export const detectProvider = (key = "") => {
  for (const [id, provider] of Object.entries(AI_PROVIDERS)) {
    if (key.startsWith(provider.keyPrefix)) return id
  }
  return null
}
