import { useEffect } from "react";
import { ThemeInit } from "../../.flowbite-react/init";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import { useAuth } from "../context/useAuth";
import { useProfile } from "../context/useProfile";
import AuthPage from "./AuthPage";
import Landing from "./Landing";
import Cart from "./Cart";
import WishListi from "./WishListi";
import ProductDetails from "./ProductDetails";
import Marketplace from "./Marketplace";
import Loader from "../components/global/Loader";
import { useCartStore } from "../context/useCart";
import Features from "./Features";
import CreateStorePage from "./CreateStorePage";
import FlowBiteHeader from "../components/global/FlowBiteHeader";
// ⬇️ dashboard imports
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Overview from "./dashboard/index";
import Products from "./dashboard/Products";
import ProductForm from "./dashboard/ProductForm";
import Orders from "./dashboard/Orders";
import Analytics from "./dashboard/Analytics";
import Settings from "./dashboard/Settings";
// Spinner import
import FullScreenSpinner from "../components/global/spinners/FullSreenSpinner";
import LoadingModal from "../components/global/spinners/LoadingModal";
import StoreFront from "./StoreFront";
import MainFooter from "../components/global/Footer";
import ScrollToTop from "../components/global/ScrollToTop";
import About from "./About";

export default function App() {
  const { init, loading, user } = useAuth();
  const { fetchProfile, profile } = useProfile();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user.id);
      fetchProfile(user.id);
      fetchCart(user.id);
    }
  }, [user, fetchProfile, fetchCart]);

  if (loading) return <FullScreenSpinner show={loading} />;

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeInit />
      <Router>
      {/* Main content grows to fill space */}
      <ScrollToTop />
      <main className="flex-grow">
        {/* your routes / pages here */}
        {user ? <FlowBiteHeader profile={profile} /> : <FlowBiteHeader />}
        <Routes>
          <Route path="/" element={<Landing user={user} profile={profile} />} />
          <Route path="/spina" element={<LoadingModal show={loading} />} />
          <Route
            path="/products/:productId"
            element={<ProductDetails user={user} profile={profile} />}
          ></Route>
          <Route
            path="/marketplace"
            element={<Marketplace user={user} profile={profile} />}
          ></Route>
          <Route
            path="/features"
            element={<Features user={user} profile={profile} />}
          ></Route>
          <Route
            path="/store/:storeId"
            element={<StoreFront user={user} profile={profile} />}
          ></Route>
          <Route path="/about" element={<About />}></Route>

          {/* Auth pages */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart user={user} />} />
          </Route>

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishListi />
              </ProtectedRoute>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/features/start-selling"
              element={<CreateStorePage user={user} />}
            />
          </Route>

          {/* Protected seller dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route path="/store/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="products" element={<Products />} />
              <Route
                path="products/new"
                element={<ProductForm mode="create" />}
              />
              <Route
                path="products/:id/edit"
                element={<ProductForm mode="edit" />}
              />
              <Route path="orders" element={<Orders />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </main>
        <MainFooter />
      </Router>
    </div>
  );
}
