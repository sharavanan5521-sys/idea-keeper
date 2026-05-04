import { useId } from "react"
import { Search, X } from "lucide-react"
import { MOOD_FILTER_CHOICES } from "@/constants/moods"

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedMood,
  onMoodChange,
}) {
  const searchId = useId()

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          aria-hidden
        />
        <label htmlFor={searchId} className="sr-only">
          Search ideas
        </label>
        <input
          id={searchId}
          type="search"
          placeholder="Search your ideas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            aria-label="Clear search"
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-gray-500 text-xs">Filter:</span>
        <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter by mood">
          {MOOD_FILTER_CHOICES.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => onMoodChange(mood)}
              aria-pressed={selectedMood === mood}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                selectedMood === mood
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
