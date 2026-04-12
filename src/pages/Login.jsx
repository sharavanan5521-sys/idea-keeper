// Change this import — add signInWithRedirect and getRedirectResult
import { signInWithRedirect, getRedirectResult } from "firebase/auth"
import { auth, googleProvider } from "../services/firebase"
import { useEffect } from "react"
import { LogIn } from "lucide-react"

function Login() {
  useEffect(() => {
    // Check if user just came back from Google redirect
    // getRedirectResult reads the auth result after redirect returns
    const handleRedirectResult = async () => {
      try {
        await getRedirectResult(auth)
        // AuthContext onAuthStateChanged fires automatically after this
        // No manual redirect needed — PrivateRoute handles it
      } catch (error) {
        console.error("Redirect result error:", error)
      }
    }
    handleRedirectResult()
  }, [])

  const handleGoogleLogin = async () => {
    try {
      // signInWithRedirect sends user to Google login page
      // Then Google redirects back to our app automatically
      await signInWithRedirect(auth, googleProvider)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-sm">

        {/* App branding */}
        <h1 className="text-3xl font-bold text-white">
          💡 Idea Keeper
        </h1>
        <p className="text-gray-400 text-sm text-center">
          Capture your ideas before they disappear.
        </p>

        {/* Google Sign-in button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 
                     text-white font-medium px-6 py-3 rounded-xl w-full 
                     justify-center transition-colors duration-200"
        >
          <LogIn size={18} />
          Continue with Google
        </button>

      </div>
    </div>
  )
}

export default Login