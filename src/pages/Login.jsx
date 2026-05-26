import { useEffect } from "react"
import { signInWithRedirect, getRedirectResult } from "firebase/auth"
import { Navigate } from "react-router-dom"
import toast from "react-hot-toast"
import { LogIn } from "lucide-react"
import { auth, googleProvider } from "@/services/firebase"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const { user } = useAuth()

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        await getRedirectResult(auth)
      } catch (error) {
        console.error("Redirect result error:", error)
        toast.error("Sign-in after redirect failed. Try again.")
      }
    }
    handleRedirectResult()
  }, [])

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider)
    } catch (error) {
      console.error("Login failed:", error)
      toast.error("Could not start Google sign-in. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white">💡 Idea Keeper</h1>
        <p className="text-gray-400 text-sm text-center">
          Capture your ideas before they disappear.
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl w-full justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <LogIn size={18} aria-hidden />
          Continue with Google
        </button>
      </div>
    </div>
  )
}
