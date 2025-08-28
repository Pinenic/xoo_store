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
import ProductDetails from './ProductDetails';
import Marketplace from './Marketplace';
import Loader from '../components/Loader';
import { useCartStore } from '../context/useCart';
import Features from './Features';
import CreateStorePage from './CreateStorePage';
import FlowBiteHeader from '../components/FlowBiteHeader';

export default function App() {
  const { init, loading, user } = useAuth()
  const { fetchProfile, profile } = useProfile()
  const {fetchCart} = useCartStore()

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (user) {
      console.log(user.id)
      fetchProfile(user.id)
      fetchCart(user.id);
    }
  }, [user, fetchProfile, fetchCart])

  if (loading) return <p>Loading app...</p>

  return (
    <div>
      <ThemeInit />
      <Router>
        {user ? <FlowBiteHeader profile={profile} /> : <FlowBiteHeader />}
      <Routes>
        <Route path="/" element={<Landing user={user} profile={profile}  />} />
        <Route path='/products/:productId' element={<ProductDetails  user={user} profile={profile}/>}></Route>
        <Route path='/marketplace' element={<Marketplace  user={user} profile={profile}/>}></Route>
        <Route path='/features' element={<Features user={user} profile={profile}  />}>
          
        </Route>

        {/* Auth pages */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected pages */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart user={user}/>
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
        <Route path='/features/start-selling' element={
            <ProtectedRoute>
              <CreateStorePage />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
    </div>
  )
}
