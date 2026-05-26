import { LogOut, Lightbulb, Settings } from "lucide-react"
import { SettingsModal } from "@/components/settings/SettingsModal"
import { AIStatusChip } from "@/components/ai/AIStatusChip"

/**
 * Top bar — settings state is lifted to Dashboard so the AI banner
 * can also trigger the modal without prop-drilling through AppHeader.
 */
export function AppHeader({ greetingName, onLogout, settingsOpen, onOpenSettings, onCloseSettings }) {
  return (
    <>
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb size={22} className="text-purple-400" aria-hidden />
          <span className="text-lg font-bold text-white">Idea Keeper</span>
        </div>

        <div className="flex items-center gap-3">
          {greetingName && (
            <span className="text-gray-400 text-sm hidden sm:block">
              Hey, {greetingName} 👋
            </span>
          )}
          <AIStatusChip onOpenSettings={onOpenSettings} />
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Open settings"
          >
            <Settings size={17} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <LogOut size={16} aria-hidden />
            Logout
          </button>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onClose={onCloseSettings} />
    </>
  )
}
