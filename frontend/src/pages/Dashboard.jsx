import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import DashboardComponent from "../components/Dashboard.jsx";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const planData = await apiFetch("/plan");
      const userData = await apiFetch("/auth/me");

      setPlan(planData.plan);
      setProfile(userData.profile);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!user) return null;
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-vp-secondary">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <Navbar />
        <DashboardComponent plan={plan} profile={profile} />
      </main>
    </div>
  );
};

export default Dashboard;
