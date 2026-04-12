import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { useAuth } from "../context/AuthContext"
import { LogOut } from "lucide-react"

function Dashboard() {
  // Get the current logged-in user from AuthContext
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      // signOut clears the Firebase session
      // AuthContext listener detects this and sets user to null
      // App automatically redirects to Login page
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-purple-400">
          💡 Idea Keeper
        </h1>

        {/* Show user's name and logout button */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {/* user.displayName comes from Google account */}
            Hey, {user?.displayName?.split(" ")[0]} 👋
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white 
                       transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Placeholder — idea cards go here in the next steps */}
      <p className="text-gray-500 text-center mt-20">
        Your ideas will appear here. Let's build it! 🚀
      </p>

    </div>
  )
}

export default Dashboard