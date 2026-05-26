import { Sparkles, X } from "lucide-react"
import { getKey } from "@/services/keyStore"

// Shown once — dismissed state persists in localStorage
const DISMISSED_KEY = "idea_keeper_ai_banner_dismissed"

export const isBannerVisible = () =>
  !getKey() && localStorage.getItem(DISMISSED_KEY) !== "true"

export const dismissBanner = () =>
  localStorage.setItem(DISMISSED_KEY, "true")

/**
 * One-time onboarding banner that introduces the AI tagging feature.
 * Disappears permanently once the user dismisses it or adds a key.
 */
export function AIBanner({ onAddKey, onDismiss }) {
  return (
    <div className="bg-gradient-to-r from-purple-950 to-gray-900 border border-purple-800/50 rounded-2xl px-5 py-4 flex items-center gap-4">
      <div className="flex-shrink-0 w-9 h-9 bg-purple-900/60 rounded-xl flex items-center justify-center">
        <Sparkles size={18} className="text-purple-300" aria-hidden />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium leading-snug">
          Auto-tag your ideas with AI
        </p>
        <p className="text-gray-400 text-xs mt-0.5">
          Add your own API key — Gemini and Groq are free.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onAddKey}
          className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 whitespace-nowrap"
        >
          Add key →
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Dismiss"
        >
          <X size={15} aria-hidden />
        </button>
      </div>
    </div>
  )
}
