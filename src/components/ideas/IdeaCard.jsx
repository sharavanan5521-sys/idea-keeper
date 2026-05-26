import { useState } from "react"
import { Trash2 } from "lucide-react"
import { MATURITY_STYLES } from "@/constants/maturity"
import { formatIdeaDate } from "@/utils/format"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

export default function IdeaCard({ idea, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const maturity = MATURITY_STYLES[idea.maturity] || MATURITY_STYLES.raw
  const formattedDate = formatIdeaDate(idea.createdAt)

  const handleConfirmDelete = () => {
    setConfirmOpen(false)
    onDelete(idea.id)
  }

  return (
    <>
      <article className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-base leading-snug">
            {idea.title}
          </h3>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="text-gray-600 hover:text-red-400 transition-colors shrink-0 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label={`Delete idea: ${idea.title}`}
          >
            <Trash2 size={16} aria-hidden />
          </button>
        </div>

        {idea.description && (
          <p className="text-gray-400 text-sm leading-relaxed">{idea.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span className="text-xs bg-gray-800 px-2.5 py-1 rounded-full text-gray-300">
            {idea.moodEmoji} {idea.mood}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full ${maturity.color}`}>
            {maturity.label}
          </span>
          <span className="text-xs text-gray-600 ml-auto">{formattedDate}</span>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this idea?"
        description="This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
