/**
 * Single source of truth for capture + filter mood labels.
 * Add new moods here only — IdeaForm and SearchFilter stay in sync.
 */
export const MOOD_OPTIONS = [
  { emoji: "😄", label: "Inspired" },
  { emoji: "🥱", label: "Bored" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤔", label: "Curious" },
]

/** Filter UI: "All" plus every mood label from {@link MOOD_OPTIONS}. */
export const MOOD_FILTER_CHOICES = [
  "All",
  ...MOOD_OPTIONS.map((m) => m.label),
]
