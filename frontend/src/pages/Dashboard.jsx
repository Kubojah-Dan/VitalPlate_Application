import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import DashboardComponent from "../components/Dashboard.jsx";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || !token) return;

    const loadDashboard = async () => {
      try {
        const data = await apiFetch("/plan", { token });

        const weeklyPlan =
          data?.plan || data?.weeklyPlan || data || null;
        const profileFromApi =
          data?.profile || user.profile || {
            name: user.email?.split("@")[0] || "Friend",
            goal: "Maintain Health",
          };

        setPlan(weeklyPlan);
        setProfile(profileFromApi);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, token]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-vp-secondary">
        Loading your dashboard...
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
        <DashboardComponent plan={plan} profile={profile} />
      </main>
    </div>
  );
};

export default Dashboard;
