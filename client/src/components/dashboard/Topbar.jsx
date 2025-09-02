// src/components/dashboard/Topbar.jsx
import { supabase } from "../../supabase";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings } from "lucide-react";


export default function Topbar({storeName}) {
  const navigate = useNavigate();
const item = "block rounded-lg px-2 py-1 text-sm font-medium hover:bg-gray-100";
const active = "bg-gray-100 text-gray-900";

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4">
      <Link to="/" className="font-semibold">{storeName}</Link>
      <div className="flex items-center gap-2">
      <nav className="flex md:hidden px-2">
        <NavLink end to="/store/dashboard" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><LayoutDashboard  className="w-4"/></NavLink>
        <NavLink to="products" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><Package  className="w-4" /></NavLink>
        <NavLink to="orders" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><ShoppingCart  className="w-4" /></NavLink>
        <NavLink to="analytics" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><BarChart3  className="w-4" /></NavLink>
        <NavLink to="settings" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><Settings  className="w-4" /></NavLink>
      </nav>
        <Link to="/marketplace" className="hidden md:flex text-sm text-gray-600 hover:text-gray-900">Marketplace</Link>
      </div>
    </header>
  );
}
