import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../services/firebase"

// Create the context object
// This is the "global container" that holds auth state
const AuthContext = createContext()

// Custom hook — any component can call useAuth() to get the current user
// Much cleaner than importing AuthContext and useContext everywhere
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  // user = the logged in Firebase user object, null if not logged in
  const [user, setUser] = useState(null)

  // loading = true while Firebase is checking if user is logged in
  // Prevents the app from flashing the login page before Firebase responds
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChanged is a Firebase listener
    // It fires automatically whenever the user logs in or logs out
    // This keeps our app in sync with Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Cleanup — unsubscribe the listener when the component unmounts
    // Prevents memory leaks
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* Only render children once Firebase has responded */}
      {/* Prevents flickering between logged-in and logged-out state */}
      {!loading && children}
    </AuthContext.Provider>
  )
}