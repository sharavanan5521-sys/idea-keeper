import { useState } from "react"
import { Mic, MicOff, Lightbulb } from "lucide-react"
import toast from "react-hot-toast"

// Mood options — user picks how they feel when capturing the idea
// This data becomes interesting over time (when do you get best ideas?)
const MOODS = [
  { emoji: "😄", label: "Inspired" },
  { emoji: "🥱", label: "Bored" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤔", label: "Curious" },
]

function IdeaForm({ onIdeaAdded }) {
  // Form state
  const [title, setTitle]           = useState("")
  const [description, setDescription] = useState("")
  const [mood, setMood]             = useState(MOODS[0])
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading]       = useState(false)

  // Voice input using Web Speech API
  // Built into Chrome/Edge — no library needed
  const handleVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    toast.error("Voice input not supported in this browser")
    return
  }

  // If already listening, stop
  if (isListening) {
    setIsListening(false)
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = "en-US"
  recognition.interimResults = false
  // continuous = true keeps listening until user stops manually
  // instead of stopping after first pause
  recognition.continuous = true
  // maxAlternatives = 1 means just give us the best guess
  recognition.maxAlternatives = 1

  setIsListening(true)
  recognition.start()

  recognition.onresult = (event) => {
    // event.results is an array of results
    // [0][0].transcript is the most confident transcription
    const latestResult = event.results[event.results.length -1]
    const transcript = latestResult[0].transcript
    console.log("Heard:", transcript) // debug — check console
    setDescription((prev) => 
      prev ? prev + " " + transcript : transcript
    )
    setIsListening(false)
    toast.success("Voice captured!")
  }

  recognition.onspeechend = () => {
    // Stop recognition when speech ends
    recognition.stop()
  }

  recognition.onerror = (event) => {
    console.error("Speech error:", event.error)
    setIsListening(false)
    toast.error(`Voice failed: ${event.error}`)
  }

  recognition.onend = () => {
    setIsListening(false)
  }
}

  const handleSubmit = async () => {
    // Basic validation — title is required
    if (!title.trim()) {
      toast.error("Give your idea a title!")
      return
    }

    setLoading(true)
    try {
      // Call onIdeaAdded passed from parent (Dashboard)
      // Parent handles the actual Firestore call
      await onIdeaAdded({
        title: title.trim(),
        description: description.trim(),
        mood: mood.label,
        moodEmoji: mood.emoji,
      })

      // Reset form after successful save
      setTitle("")
      setDescription("")
      setMood(MOODS[0])
      toast.success("Idea captured! 💡")
    } catch (error) {
      toast.error("Failed to save idea. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full">

      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Lightbulb size={20} className="text-purple-400" />
        Capture an Idea
      </h2>

      {/* Title input */}
      <input
        type="text"
        placeholder="What's the idea? (required)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 
                   text-white placeholder-gray-500 text-sm mb-3
                   focus:outline-none focus:border-purple-500 transition-colors"
      />

      {/* Description input with voice button */}
      <div className="relative mb-4">
        <textarea
          placeholder="Describe it... (optional, or use voice)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
                     text-white placeholder-gray-500 text-sm resize-none
                     focus:outline-none focus:border-purple-500 transition-colors"
        />
        {/* Voice input button — sits inside the textarea area */}
        <button
          onClick={handleVoiceInput}
          className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-colors
                      ${isListening
                        ? "bg-red-500 text-white"
                        : "bg-gray-700 text-gray-400 hover:text-white"
                      }`}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      </div>

      {/* Mood selector */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-gray-500 text-xs">Mood:</span>
        {MOODS.map((m) => (
          <button
            key={m.label}
            onClick={() => setMood(m)}
            title={m.label}
            className={`text-xl p-1.5 rounded-lg transition-colors
                        ${mood.label === m.label
                          ? "bg-purple-600"
                          : "bg-gray-800 hover:bg-gray-700"
                        }`}
          >
            {m.emoji}
          </button>
        ))}
        <span className="text-gray-500 text-xs ml-1">{mood.label}</span>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50
                   text-white font-medium py-3 rounded-xl transition-colors"
      >
        {loading ? "Saving..." : "Save Idea 💡"}
      </button>

    </div>
  )
}

export default IdeaForm