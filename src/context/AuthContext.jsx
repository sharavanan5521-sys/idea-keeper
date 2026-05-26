import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/services/firebase"
import { LoadingScreen } from "@/components/ui/LoadingScreen"

const AuthContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <LoadingScreen message="Signing you in..." />
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
