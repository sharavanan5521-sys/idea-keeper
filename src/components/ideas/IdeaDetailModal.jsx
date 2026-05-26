import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { expandIdea, AI_ERRORS } from "@/services/aiService"
import { getKey } from "@/services/keyStore"
import { CATEGORIES } from "@/constants/categories"
import { MATURITY_STYLES } from "@/constants/maturity"

function ExpansionSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" aria-label="Generating insights…" aria-busy="true">
      <div className="h-2.5 bg-gray-800 rounded w-1/3" />
      <div className="flex flex-col gap-2">
        <div className="h-2 bg-gray-800 rounded w-full" />
        <div className="h-2 bg-gray-800 rounded w-5/6" />
        <div className="h-2 bg-gray-800 rounded w-4/6" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-2 bg-gray-800 rounded w-1/4" />
        <div className="h-2 bg-gray-800 rounded w-full" />
        <div className="h-2 bg-gray-800 rounded w-5/6" />
        <div className="h-2 bg-gray-800 rounded w-4/6" />
        <div className="h-2 bg-gray-800 rounded w-3/6" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-2 bg-gray-800 rounded w-1/4" />
        <div className="h-2 bg-gray-800 rounded w-full" />
        <div className="h-2 bg-gray-800 rounded w-5/6" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-2 bg-gray-800 rounded w-1/4" />
        <div className="h-2 bg-gray-800 rounded w-5/6" />
        <div className="h-2 bg-gray-800 rounded w-4/6" />
      </div>
    </div>
  )
}

function Section({ icon, title, children }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
        <span aria-hidden>{icon}</span>
        {title}
      </h4>
      {children}
    </section>
  )
}

function ExpansionView({ expansion }) {
  const { content, angleLabel, generatedAt } = expansion
  const date = new Date(generatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-purple-400 font-medium">
        {angleLabel} &middot; {date}
      </p>

      <Section icon="💡" title="Overview">
        <p className="text-gray-300 text-sm leading-relaxed">{content.overview}</p>
      </Section>

      <Section icon="📋" title="Execution Steps">
        <ol className="flex flex-col gap-2 list-none p-0 m-0">
          {content.steps.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-gray-300">
              <span className="text-purple-500 font-semibold shrink-0 w-4 tabular-nums">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section icon="⚠️" title="Challenges">
        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {content.challenges.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-yellow-500 shrink-0">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon="🛠️" title="Tools & Resources">
        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {content.resources.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-blue-400 shrink-0">→</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon="🎯" title="Verdict">
        <p className="text-gray-300 text-sm leading-relaxed italic border-l-2 border-purple-700 pl-3">
          {content.verdict}
        </p>
      </Section>
    </div>
  )
}

const ERROR_MESSAGES = {
  [AI_ERRORS.NO_KEY]: "Add an API key in Settings to get AI insights.",
  [AI_ERRORS.RATE_LIMIT]: "Rate limit reached. Try again later.",
  [AI_ERRORS.INVALID_KEY]: "Invalid API key. Check your Settings.",
}

export function IdeaDetailModal({ idea, onClose, onAddExpansion }) {
  const expansions = idea.expansions || []
  const [currentIndex, setCurrentIndex] = useState(() => Math.max(0, expansions.length - 1))
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)
  const hasKey = !!getKey()
  const autoGenRef = useRef(false)

  const category = idea.category ? CATEGORIES[idea.category] : null
  const maturity = MATURITY_STYLES[idea.maturity] || MATURITY_STYLES.raw

  const generate = useCallback(async () => {
    setGenerating(true)
    setGenError(null)
    try {
      const expansion = await expandIdea(idea, expansions.length)
      await onAddExpansion(idea.id, expansion)
    } catch (err) {
      setGenError(ERROR_MESSAGES[err.message] || "Could not generate insights. Try again.")
    } finally {
      setGenerating(false)
    }
  }, [idea, expansions.length, onAddExpansion])

  // Auto-generate on first open when no expansions exist and user has a key
  useEffect(() => {
    if (autoGenRef.current) return
    autoGenRef.current = true
    if (expansions.length === 0 && hasKey) generate()
  }, []) // mount-only: generate is stable for the initial state we care about

  // Jump to the newest expansion after it's added
  useEffect(() => {
    if (expansions.length > 0) setCurrentIndex(expansions.length - 1)
  }, [expansions.length])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const currentExpansion = expansions[currentIndex]
  const hasMultiple = expansions.length > 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="idea-modal-title"
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start gap-3 p-5 pb-4 border-b border-gray-800 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 id="idea-modal-title" className="text-white font-semibold text-lg leading-snug">
              {idea.title}
            </h2>
            {idea.description && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2 leading-relaxed">
                {idea.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
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
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* AI Insights */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={13} className="text-purple-400" aria-hidden />
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-wider">
              AI Insights
            </span>
          </div>

          {generating && <ExpansionSkeleton />}

          {!generating && genError && (
            <p className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-xl p-4">
              {genError}
            </p>
          )}

          {!generating && !genError && !currentExpansion && !hasKey && (
            <p className="text-gray-500 text-sm text-center py-10">
              Add an API key in Settings to unlock AI insights for this idea.
            </p>
          )}

          {!generating && currentExpansion && (
            <ExpansionView expansion={currentExpansion} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800 shrink-0">
          {hasMultiple ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Previous insight"
              >
                <ChevronLeft size={16} aria-hidden />
              </button>
              <span className="text-gray-500 text-xs tabular-nums select-none">
                {currentIndex + 1} of {expansions.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.min(expansions.length - 1, i + 1))}
                disabled={currentIndex === expansions.length - 1}
                className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Next insight"
              >
                <ChevronRight size={16} aria-hidden />
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={generate}
            disabled={generating || !hasKey}
            className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <Sparkles size={12} aria-hidden />
            {expansions.length === 0 ? "Get AI Insights" : "Get More Insights"}
          </button>
        </div>
      </div>
    </div>
  )
}
