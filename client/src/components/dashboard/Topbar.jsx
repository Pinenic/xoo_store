// src/components/dashboard/Topbar.jsx
import { supabase } from "../../supabase";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings } from "lucide-react";


export default function Topbar({storeName, storeId}) {
  const navigate = useNavigate();
const item = "block rounded-lg px-2 py-1 text-sm font-medium hover:bg-gray-100";
const active = "bg-gray-100 text-gray-900";


  return (
    <header className="flex flex-col h-16 md:h-8 border-b bg-white">
      <div className=" flex items-center justify-between px-4">
      <Link to="/store/dashboard" className="font-semibold">{storeName}</Link>
      <div className="flex items-center gap-2">
      <nav className="flex md:hidden">
        <NavLink end to="/store/dashboard" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><LayoutDashboard  className="w-4"/></NavLink>
        <NavLink to="products" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><Package  className="w-4" /></NavLink>
        <NavLink to="orders" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><ShoppingCart  className="w-4" /></NavLink>
        <NavLink to="analytics" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><BarChart3  className="w-4" /></NavLink>
        <NavLink to="settings" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}><Settings  className="w-4" /></NavLink>
      </nav>
        <Link to={`/store/${storeId}`} className="hidden md:flex text-sm text-gray-600 hover:text-gray-900">Storefront</Link>
      </div>
      </div>
      <Link to={`/store/${storeId}`} className="md:hidden text-sm text-gray-600 hover:text-gray-900 text-right px-6 p-1">Storefront</Link>
    </header>
  );
}
