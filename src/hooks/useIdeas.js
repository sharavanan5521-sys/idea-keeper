import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import {
  addIdea as createIdeaInFirestore,
  getIdeas,
  updateIdea as updateIdeaInFirestore,
  deleteIdea as deleteIdeaFromFirestore,
} from "@/services/ideasService"

/**
 * Loads and mutates the current user's ideas in Firestore.
 * Scoped by userId — remount parent with key={user.uid} when account changes.
 */
export function useIdeas(userId) {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    const fetchIdeas = async () => {
      try {
        const data = await getIdeas(userId)
        if (!cancelled) setIdeas(data)
      } catch {
        if (!cancelled) toast.error("Failed to load ideas")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchIdeas()
    return () => {
      cancelled = true
    }
  }, [userId])

  const addIdea = useCallback(
    async (ideaData) => {
      const newId = await createIdeaInFirestore(userId, ideaData)
      setIdeas((prev) => [
        {
          id: newId,
          ...ideaData,
          userId,
          maturity: "raw",
          createdAt: null,
        },
        ...prev,
      ])
      return newId
    },
    [userId],
  )

  const updateIdea = useCallback(async (ideaId, updates) => {
    try {
      await updateIdeaInFirestore(ideaId, updates)
      setIdeas((prev) =>
        prev.map((idea) => (idea.id === ideaId ? { ...idea, ...updates } : idea)),
      )
      toast.success("Idea updated")
    } catch {
      toast.error("Failed to update idea")
    }
  }, [])

  const deleteIdea = useCallback(async (ideaId) => {
    try {
      await deleteIdeaFromFirestore(ideaId)
      setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId))
      toast.success("Idea deleted")
    } catch {
      toast.error("Failed to delete idea")
    }
  }, [])

  return { ideas, loading, addIdea, updateIdea, deleteIdea }
}
