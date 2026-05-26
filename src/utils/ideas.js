/**
 * Client-side filter for the ideas list (search + mood).
 * Pure — safe to unit test or reuse in exports later.
 */
export function filterIdeas(ideas, { searchTerm, selectedMood }) {
  const q = (searchTerm ?? "").trim().toLowerCase()

  return ideas.filter((idea) => {
    const matchesSearch =
      !q ||
      idea.title.toLowerCase().includes(q) ||
      (idea.description && idea.description.toLowerCase().includes(q))

    const matchesMood =
      selectedMood === "All" || idea.mood === selectedMood

    return matchesSearch && matchesMood
  })
}
