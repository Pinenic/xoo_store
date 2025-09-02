import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // if not logged in → send to login
  if (!user) return <Navigate to="/auth" replace />;

  // if logged in → render nested routes
  return <Outlet />;
}
