import { useState } from "react"
import { Trash2, Pencil, X, Check, Maximize2 } from "lucide-react"
import { MATURITY_STYLES } from "@/constants/maturity"
import { MOOD_OPTIONS } from "@/constants/moods"
import { CATEGORIES } from "@/constants/categories"
import { formatIdeaDate } from "@/utils/format"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

function EditForm({ idea, onSave, onCancel }) {
  const [title, setTitle] = useState(idea.title)
  const [description, setDescription] = useState(idea.description || "")
  const [mood, setMood] = useState(idea.mood)
  const [moodEmoji, setMoodEmoji] = useState(idea.moodEmoji)
  const [maturity, setMaturity] = useState(idea.maturity || "raw")

  const handleMoodChange = (e) => {
    const selected = MOOD_OPTIONS.find((m) => m.label === e.target.value)
    if (selected) {
      setMood(selected.label)
      setMoodEmoji(selected.emoji)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim(), mood, moodEmoji, maturity })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Idea title"
        className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />
      <div className="flex gap-2">
        <select
          value={mood}
          onChange={handleMoodChange}
          className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {MOOD_OPTIONS.map((m) => (
            <option key={m.label} value={m.label}>
              {m.emoji} {m.label}
            </option>
          ))}
        </select>
        <select
          value={maturity}
          onChange={(e) => setMaturity(e.target.value)}
          className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {Object.entries(MATURITY_STYLES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <X size={13} /> Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Check size={13} /> Save
        </button>
      </div>
    </form>
  )
}

export default function IdeaCard({ idea, onDelete, onUpdate, onExpand }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const maturity = MATURITY_STYLES[idea.maturity] || MATURITY_STYLES.raw
  const category = idea.category ? CATEGORIES[idea.category] : null
  const formattedDate = formatIdeaDate(idea.createdAt)

  const handleSave = (updates) => {
    onUpdate(idea.id, updates)
    setEditing(false)
  }

  const handleConfirmDelete = () => {
    setConfirmOpen(false)
    onDelete(idea.id)
  }

  return (
    <>
      <article className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
        {editing ? (
          <EditForm idea={idea} onSave={handleSave} onCancel={() => setEditing(false)} />
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-white font-semibold text-base leading-snug">
                {idea.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onExpand(idea)}
                  className="text-gray-600 hover:text-purple-400 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={`Expand idea: ${idea.title}`}
                >
                  <Maximize2 size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-gray-600 hover:text-purple-400 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={`Edit idea: ${idea.title}`}
                >
                  <Pencil size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={`Delete idea: ${idea.title}`}
                >
                  <Trash2 size={15} aria-hidden />
                </button>
              </div>
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
              {category && (
                <span className={`text-xs px-2.5 py-1 rounded-full ${category.color}`}>
                  {category.label}
                </span>
              )}
              {idea.tags?.map((tag) => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
              <span className="text-xs text-gray-600 ml-auto">{formattedDate}</span>
            </div>
          </>
        )}
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
