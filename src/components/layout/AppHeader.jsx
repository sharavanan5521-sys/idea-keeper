import { useState } from "react"
import { LogOut, Lightbulb, Settings } from "lucide-react"
import { SettingsModal } from "@/components/settings/SettingsModal"

/**
 * Top bar — reuse on any authenticated layout later (settings, etc.).
 */
export function AppHeader({ greetingName, onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false)

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
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
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

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
