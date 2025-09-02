// src/components/dashboard/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useStoreCtx } from "../../context/useStoreCtx";

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const { store, setStore } = useStoreCtx();
  const navigate = useNavigate();

  console.log("🔍 Initial store from context:", store);

  useEffect(() => {
    (async () => {
      console.log("🔍 Fetching authenticated user...");
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.warn("⚠️ No user found. Redirecting to /auth");
        navigate("/auth");
        return;
      }

      console.log("🔍 Logged in user ID:", user.id);

      // fetch the store owned by this user
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error?.code === "PGRST116") {
        console.warn("⚠️ No store found. Redirecting to /create-store");
        navigate("/features/start-selling");
        return;
      }
      if (error) {
        console.error("❌ Error fetching store:", error);
        return;
      }

      console.log("✅ Store data fetched:", data);
      setStore(data);
      setLoading(false);
    })();
  }, [navigate, setStore]);

  if (loading) {
    console.log("⏳ Still loading dashboard...");
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  console.log("🎉 Store ready, rendering dashboard:", store);

  return (
    <div className="h-screen bg-gray-50">
      <Topbar storeName={store?.store_name || "My Store"} />
      <div className="flex h-full bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-64px)] overflow-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
