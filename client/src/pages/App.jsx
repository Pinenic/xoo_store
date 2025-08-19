import { useEffect } from 'react'
import { ThemeInit } from '../../.flowbite-react/init';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from '../context/useAuth'
import { useProfile } from '../context/useProfile'
import AuthPage from './AuthPage'
import Landing from './Landing'
import Cart from './Cart';
import WishListi from './WishListi';

export default function App() {
  const { init, loading, user } = useAuth()
  const { fetchProfile, profile } = useProfile()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (user) {
      console.log(user.id)
      fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  if (loading) return <p>Loading app...</p>

  return (
    <div>
      <ThemeInit />
      <Router>
      <Routes>
        <Route path="/" element={<Landing user={user} profile={profile}  />} />

        {/* Auth pages */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected pages */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishListi />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </div>
  )
}
