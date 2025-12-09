import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import GroceryList from "../components/GroceryList.jsx";
import { apiFetch } from "../apiClient.js";

const GroceryListPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = async () => {
    try {
      const data = await apiFetch("/plan");
      setPlan(data.plan);
    } catch (err) {
      console.error("Grocery load failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlan();
  }, []);

  if (loading)
    return <div className="text-center p-20 text-xl text-vp-secondary">Loading Grocery List...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Navbar />
        <GroceryList plan={plan} />
      </main>
    </div>
  );
};

export default GroceryListPage;
