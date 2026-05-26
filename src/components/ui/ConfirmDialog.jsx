import { useEffect, useRef } from "react"

/**
 * Accessible modal for destructive or important confirmations.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.()
    }
    window.addEventListener("keydown", onKey)
    const t = window.setTimeout(() => confirmRef.current?.focus(), 0)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.clearTimeout(t)
    }
  }, [open, onCancel])

  if (!open) return null

  const confirmClass = danger
    ? "bg-red-600 hover:bg-red-500 text-white"
    : "bg-purple-600 hover:bg-purple-500 text-white"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-white mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
