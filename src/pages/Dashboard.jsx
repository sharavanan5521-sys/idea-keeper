import { useState, useMemo } from "react"
import { signOut } from "firebase/auth"
import toast from "react-hot-toast"
import { auth } from "@/services/firebase"
import { useAuth } from "@/context/AuthContext"
import { useIdeas } from "@/hooks/useIdeas"
import { filterIdeas } from "@/utils/ideas"
import { AppHeader } from "@/components/layout/AppHeader"
import IdeaForm from "@/components/ideas/IdeaForm"
import IdeaCard from "@/components/ideas/IdeaCard"
import SearchFilter from "@/components/ideas/SearchFilter"
import { AIBanner, isBannerVisible, dismissBanner } from "@/components/ai/AIBanner"

/**
 * Keyed by user.uid so a different account remounts with fresh ideas state.
 */
function DashboardMain({ user, onOpenSettings }) {
  const { ideas, loading, addIdea, updateIdea, deleteIdea } = useIdeas(user.uid)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState("All")
  const [showBanner, setShowBanner] = useState(isBannerVisible)

  const handleDismissBanner = () => {
    dismissBanner()
    setShowBanner(false)
  }

  const handleAddKey = () => {
    dismissBanner()
    setShowBanner(false)
    onOpenSettings()
  }

  const filteredIdeas = useMemo(
    () => filterIdeas(ideas, { searchTerm, selectedMood }),
    [ideas, searchTerm, selectedMood],
  )

  const countLabel =
    !loading && ideas.length > 0
      ? `${filteredIdeas.length} of ${ideas.length} ${ideas.length === 1 ? "idea" : "ideas"}`
      : null

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {showBanner && (
        <div className="mb-6">
          <AIBanner onAddKey={handleAddKey} onDismiss={handleDismissBanner} />
        </div>
      )}

      <IdeaForm onIdeaAdded={addIdea} />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedMood={selectedMood}
        onMoodChange={setSelectedMood}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-300 font-medium">Your Ideas</h2>
        {countLabel && (
          <span className="text-gray-600 text-sm">{countLabel}</span>
        )}
      </div>

      {loading && (
        <p className="text-gray-600 text-sm text-center py-10">
          Loading your ideas...
        </p>
      )}

      {!loading && ideas.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3" aria-hidden>
            💭
          </p>
          <p className="text-gray-500 text-sm">
            No ideas yet. Capture your first one above!
          </p>
        </div>
      )}

      {!loading && ideas.length > 0 && filteredIdeas.length === 0 && (
        <div className="text-center py-14">
          <p className="text-4xl mb-3" aria-hidden>
            🔍
          </p>
          <p className="text-gray-500 text-sm">
            No ideas match your search criteria.
          </p>
        </div>
      )}

      {!loading && filteredIdeas.length > 0 && (
        <ul className="flex flex-col gap-4 list-none p-0 m-0">
          {filteredIdeas.map((idea) => (
            <li key={idea.id}>
              <IdeaCard idea={idea} onDelete={deleteIdea} onUpdate={updateIdea} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const greetingName = user?.displayName?.split(" ")[0]

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch {
      toast.error("Could not log out. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AppHeader
        greetingName={greetingName}
        onLogout={handleLogout}
        settingsOpen={settingsOpen}
        onOpenSettings={() => setSettingsOpen(true)}
        onCloseSettings={() => setSettingsOpen(false)}
      />

      {user && (
        <DashboardMain
          key={user.uid}
          user={user}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}
    </div>
  )
}
