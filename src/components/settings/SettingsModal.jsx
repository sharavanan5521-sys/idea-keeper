import { useState, useEffect } from "react"
import { X, Eye, EyeOff, ExternalLink, CheckCircle } from "lucide-react"
import { AI_PROVIDERS, detectProvider } from "@/constants/aiProviders"
import { getKey, saveKey, clearKey } from "@/services/keyStore"

export function SettingsModal({ open, onClose }) {
  const [keyInput, setKeyInput] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load the stored key when the modal opens
  useEffect(() => {
    if (open) {
      setKeyInput(getKey())
      setSaved(false)
    }
  }, [open])

  const provider = detectProvider(keyInput)
  const providerInfo = provider ? AI_PROVIDERS[provider] : null

  const handleSave = () => {
    if (!keyInput.trim()) return
    saveKey(keyInput)
    setSaved(true)
  }

  const handleClear = () => {
    clearKey()
    setKeyInput("")
    setSaved(false)
  }

  if (!open) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">AI Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Key input */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-xs font-medium">Your API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={keyInput}
              onChange={(e) => { setKeyInput(e.target.value); setSaved(false) }}
              placeholder="Paste your API key here..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              aria-label={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Auto-detected provider badge */}
          {providerInfo && (
            <span className={`self-start text-xs px-2.5 py-1 rounded-full font-medium ${providerInfo.color}`}>
              {providerInfo.badge} detected
            </span>
          )}
          {keyInput && !providerInfo && (
            <span className="self-start text-xs px-2.5 py-1 rounded-full bg-red-900 text-red-300">
              Unknown provider — check your key
            </span>
          )}
        </div>

        {/* How to get a key — shown for detected provider */}
        {providerInfo && (
          <div className="bg-gray-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-xs font-medium">
                How to get a {providerInfo.name} key
              </span>
              <a
                href={providerInfo.keyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs transition-colors"
              >
                Open <ExternalLink size={11} />
              </a>
            </div>
            <ol className="flex flex-col gap-1.5 list-none p-0 m-0">
              {providerInfo.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="text-purple-500 font-bold shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-xs text-gray-500 mt-1">{providerInfo.note}</p>
          </div>
        )}

        {/* No key yet — show all providers */}
        {!keyInput && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-xs">Supported providers — paste your key above and we'll detect it automatically:</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(AI_PROVIDERS).map((p) => (
                <a
                  key={p.name}
                  href={p.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${p.color} hover:opacity-80 transition-opacity`}
                >
                  {p.name} <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 justify-end pt-1">
          {getKey() && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition-colors"
            >
              Remove key
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!keyInput.trim() || !providerInfo || saved}
            className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {saved && <CheckCircle size={13} />}
            {saved ? "Saved!" : "Save key"}
          </button>
        </div>
      </div>
    </div>
  )
}
