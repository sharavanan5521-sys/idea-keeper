import { Sparkles } from "lucide-react"
import { AI_PROVIDERS, detectProvider } from "@/constants/aiProviders"
import { getKey } from "@/services/keyStore"

/**
 * Persistent header chip showing AI status at a glance.
 * Clicking it always opens Settings so users can add or update their key.
 */
export function AIStatusChip({ onOpenSettings }) {
  const key = getKey()
  const provider = detectProvider(key)
  const providerInfo = provider ? AI_PROVIDERS[provider] : null

  if (providerInfo) {
    // Active state — shows provider name with a live dot
    return (
      <button
        type="button"
        onClick={onOpenSettings}
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-500 ${providerInfo.color}`}
        aria-label={`AI active — ${providerInfo.name}. Click to manage.`}
      >
        <Sparkles size={12} aria-hidden />
        {providerInfo.badge}
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" aria-hidden />
      </button>
    )
  }

  // Inactive state — nudges user to enable AI
  return (
    <button
      type="button"
      onClick={onOpenSettings}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
      aria-label="Enable AI tagging"
    >
      <Sparkles size={12} aria-hidden />
      Enable AI
    </button>
  )
}
