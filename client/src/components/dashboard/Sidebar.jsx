// src/components/dashboard/Sidebar.jsx
import { NavLink } from "react-router-dom";

const item = "block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100";
const active = "bg-gray-100 text-gray-900";

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 border-r bg-white min-h-[calc(100vh-64px)]">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Store Dashboard</h2>
      </div>
      <nav className="px-2 space-y-1">
        <NavLink end to="/store/dashboard" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}>Overview</NavLink>
        <NavLink to="products" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}>Products</NavLink>
        <NavLink to="orders" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}>Orders</NavLink>
        <NavLink to="analytics" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}>Analytics</NavLink>
        <NavLink to="settings" className={({isActive}) => `${item} ${isActive?active:"text-gray-600"}`}>Settings</NavLink>
      </nav>
    </aside>
  );
}
