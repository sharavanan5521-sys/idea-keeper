import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

// PrivateRoute — protects pages that require login
// If user is logged in → show the page
// If not → redirect to /login
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    // AuthProvider wraps everything so all pages can access auth state
    <AuthProvider>
      <BrowserRouter>

        {/* Toaster handles toast notifications globally */}
        {/* position top-right so it doesn't block content */}
        <Toaster position="top-right" />

        <Routes>
          {/* Public route — anyone can see login page */}
          <Route path="/login" element={<Login />} />

          {/* Private route — only logged in users can see dashboard */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Catch all unknown routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App