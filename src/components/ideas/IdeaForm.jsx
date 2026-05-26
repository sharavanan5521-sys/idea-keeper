import { useState, useRef, useEffect, useId } from "react"
import { Mic, MicOff, Lightbulb } from "lucide-react"
import toast from "react-hot-toast"
import { MOOD_OPTIONS } from "@/constants/moods"

export default function IdeaForm({ onIdeaAdded }) {
  const titleId = useId()
  const descriptionId = useId()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [mood, setMood] = useState(MOOD_OPTIONS[0])
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      recognitionRef.current = null
    }
  }, [])

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast.error("Voice input not supported in this browser")
      return
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.continuous = true
    recognition.maxAlternatives = 1

    setIsListening(true)
    recognition.start()

    recognition.onresult = (event) => {
      const latestResult = event.results[event.results.length - 1]
      const transcript = latestResult[0].transcript
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript))
      recognition.stop()
      toast.success("Voice captured!")
    }

    recognition.onspeechend = () => {
      recognition.stop()
    }

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error)
      recognitionRef.current = null
      setIsListening(false)
      toast.error(`Voice failed: ${event.error}`)
    }

    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Give your idea a title!")
      return
    }

    setLoading(true)
    try {
      await onIdeaAdded({
        title: title.trim(),
        description: description.trim(),
        mood: mood.label,
        moodEmoji: mood.emoji,
      })

      setTitle("")
      setDescription("")
      setMood(MOOD_OPTIONS[0])
      toast.success("Idea captured! 💡")
    } catch {
      toast.error("Failed to save idea. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const listeningLabel = isListening ? "Stop voice input" : "Start voice input"

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Lightbulb size={20} className="text-purple-400" aria-hidden />
        Capture an Idea
      </h2>

      <div className="mb-3">
        <label htmlFor={titleId} className="sr-only">
          Idea title (required)
        </label>
        <input
          id={titleId}
          type="text"
          placeholder="What's the idea? (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          autoComplete="off"
        />
      </div>

      <div className="relative mb-4">
        <label htmlFor={descriptionId} className="sr-only">
          Description (optional)
        </label>
        <textarea
          id={descriptionId}
          placeholder="Describe it... (optional, or use voice)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          aria-label={listeningLabel}
          aria-pressed={isListening}
          className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            isListening
              ? "bg-red-500 text-white"
              : "bg-gray-700 text-gray-400 hover:text-white"
          }`}
        >
          {isListening ? <MicOff size={16} aria-hidden /> : <Mic size={16} aria-hidden />}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-gray-500 text-xs w-full sm:w-auto">Mood:</span>
        <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Mood">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setMood(m)}
              title={m.label}
              aria-pressed={mood.label === m.label}
              className={`text-xl p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                mood.label === m.label ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <span className="sr-only">{m.label}</span>
              <span aria-hidden>{m.emoji}</span>
            </button>
          ))}
        </div>
        <span className="text-gray-500 text-xs ml-1" aria-live="polite">
          {mood.label}
        </span>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {loading ? "Saving..." : "Save Idea 💡"}
      </button>
    </section>
  )
}
