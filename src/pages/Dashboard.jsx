import { useState, useEffect } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { useAuth } from "../context/AuthContext"
import { addIdea, getIdeas, deleteIdea } from "../services/ideasService"
import IdeaForm from "../components/IdeaForm"
import IdeaCard from "../components/IdeaCard"
import { LogOut, Lightbulb } from "lucide-react"
import toast from "react-hot-toast"

function Dashboard() {
  // Get logged in user from AuthContext
  const { user } = useAuth()

  // ideas = array of idea objects fetched from Firestore
  const [ideas, setIdeas] = useState([])

  // loading = true while fetching ideas from Firestore
  const [loading, setLoading] = useState(true)

  // Fetch ideas when Dashboard mounts or user changes
  useEffect(() => {
    if (!user) return

    const fetchIdeas = async () => {
      try {
        const data = await getIdeas(user.uid)
        setIdeas(data)
      } catch (error) {
        toast.error("Failed to load ideas")
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [user])

  // Handle adding a new idea
  // Called by IdeaForm when user submits
  const handleAddIdea = async (ideaData) => {
    const newId = await addIdea(user.uid, ideaData)

    // Optimistically add to local state so UI updates instantly
    // Without this, user would have to wait for a refetch to see their idea
    setIdeas((prev) => [
      {
        id: newId,
        ...ideaData,
        userId: user.uid,
        maturity: "raw",
        createdAt: null, // null until Firestore confirms
      },
      ...prev,
    ])
  }

  // Handle deleting an idea
  // Called by IdeaCard when user clicks delete
  const handleDeleteIdea = async (ideaId) => {
    try {
      await deleteIdea(ideaId)

      // Remove from local state immediately so UI feels instant
      setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId))
      toast.success("Idea deleted")
    } catch (error) {
      toast.error("Failed to delete idea")
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Top navigation bar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb size={22} className="text-purple-400" />
          <span className="text-lg font-bold text-white">Idea Keeper</span>
        </div>

        {/* User info and logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block">
            Hey, {user?.displayName?.split(" ")[0]} 👋
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 
                       hover:text-white transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Idea capture form */}
        <IdeaForm onIdeaAdded={handleAddIdea} />

        {/* Ideas list */}
        <div className="mt-8">

          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-300 font-medium">
              Your Ideas
            </h2>
            <span className="text-gray-600 text-sm">
              {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
            </span>
          </div>

          {/* Loading state */}
          {loading && (
            <p className="text-gray-600 text-sm text-center py-10">
              Loading your ideas...
            </p>
          )}

          {/* Empty state — shown when user has no ideas yet */}
          {!loading && ideas.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">💭</p>
              <p className="text-gray-500 text-sm">
                No ideas yet. Capture your first one above!
              </p>
            </div>
          )}

          {/* Idea cards list */}
          <div className="flex flex-col gap-4">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={handleDeleteIdea}
              />
            ))}
          </div>

        </div>
      </main>

    </div>
  )
}

export default Dashboard