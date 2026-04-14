import { Trash2 } from "lucide-react"

// Maturity colors — visual indicator of how developed an idea is
// Raw = just captured, Developing = added notes, Ready = fully fleshed out
const MATURITY_STYLES = {
  raw:        { label: "Raw",        color: "bg-gray-700 text-gray-300" },
  developing: { label: "Developing", color: "bg-amber-900 text-amber-300" },
  ready:      { label: "Ready",      color: "bg-green-900 text-green-300" },
}

function IdeaCard({ idea, onDelete }) {
  const maturity = MATURITY_STYLES[idea.maturity] || MATURITY_STYLES.raw

  // Format Firestore timestamp to readable date
  // Firestore returns a Timestamp object — .toDate() converts to JS Date
  const formattedDate = idea.createdAt?.toDate
    ? new Date(idea.createdAt.toDate()).toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Just now"

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 
                    flex flex-col gap-3 hover:border-gray-700 transition-colors">

      {/* Top row — title and delete button */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-base leading-snug">
          {idea.title}
        </h3>
        <button
          onClick={() => onDelete(idea.id)}
          className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Description — only show if it exists */}
      {idea.description && (
        <p className="text-gray-400 text-sm leading-relaxed">
          {idea.description}
        </p>
      )}

      {/* Bottom row — mood, maturity, date */}
      <div className="flex items-center gap-2 flex-wrap mt-1">

        {/* Mood emoji + label */}
        <span className="text-xs bg-gray-800 px-2.5 py-1 rounded-full text-gray-300">
          {idea.moodEmoji} {idea.mood}
        </span>

        {/* Maturity badge */}
        <span className={`text-xs px-2.5 py-1 rounded-full ${maturity.color}`}>
          {maturity.label}
        </span>

        {/* Date pushed to the right */}
        <span className="text-xs text-gray-600 ml-auto">
          {formattedDate}
        </span>

      </div>

    </div>
  )
}

export default IdeaCard