import { Search, X } from "lucide-react"

// All mood options + "All" as default
// Must match the mood labels used in IdeaForm
const MOOD_FILTERS = ["All", "Inspired", "Bored", "Stressed", "Tired", "Curious"]

function SearchFilter({ searchTerm, onSearchChange, selectedMood, onMoodChange }) {
  return (
    <div className="flex flex-col gap-3 mb-6">

      {/* Search input */}
      <div className="relative">
        {/* Search icon inside input on the left */}
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search your ideas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl 
                     pl-9 pr-10 py-2.5 text-white placeholder-gray-500 text-sm
                     focus:outline-none focus:border-purple-500 transition-colors"
        />

        {/* Clear button — only shows when there's text */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Mood filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-gray-500 text-xs">Filter:</span>
        {MOOD_FILTERS.map((mood) => (
          <button
            key={mood}
            onClick={() => onMoodChange(mood)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors
                        ${selectedMood === mood
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
          >
            {mood}
          </button>
        ))}
      </div>

    </div>
  )
}

export default SearchFilter