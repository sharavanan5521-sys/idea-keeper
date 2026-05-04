/**
 * Format Firestore Timestamp (or missing) for idea cards.
 */
export function formatIdeaDate(createdAt, locale = "en-MY") {
  if (!createdAt?.toDate) return "Just now"

  return new Date(createdAt.toDate()).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
