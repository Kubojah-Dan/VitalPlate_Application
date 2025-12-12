import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import GroceryList from "../components/GroceryList.jsx";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const GroceryListPage = () => {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || !token) return;
    const load = async () => {
      try {
        const data = await apiFetch("/api/plan", { token });
        const weeklyPlan =
          data?.plan || data?.weeklyPlan || data || null;
        setPlan(weeklyPlan);
      } catch (e) {
        console.error("Grocery load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, token]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-vp-secondary">
        Loading grocery list...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col">
        <Navbar
          onToggleSidebar={() =>
            setSidebarOpen((v) => !v)
          }
        />
        <GroceryList plan={plan} />
      </main>
    </div>
  );
};

export default GroceryListPage;

