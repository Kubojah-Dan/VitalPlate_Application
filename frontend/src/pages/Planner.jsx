import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import MealPlannerGrid from "../components/MealPlannerGrid.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const Planner = () => {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState(null);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadPlan = async () => {
    try {
      const res = await apiFetch("/plan", { token });

      const weeklyPlan = res?.plan || res?.weeklyPlan || res || null;
      setPlan(weeklyPlan);
    } catch (e) {
      console.error("Error loading plan", e);
    } finally {
      setLoading(false);
    }
  };

  // ----------- Save Plan -------------
  const savePlan = async (newPlan) => {
    setPlan(newPlan);
    try {
      await apiFetch("/plan", {
        method: "PUT",
        token,
        body: { plan: newPlan }
      });
    } catch (e) {
      console.error("Saving failed:", e);
    }
  };

  // ----------- Recipe Modal ----------
  const openModal = (recipe) => setModalRecipe(recipe);
  const closeModal = () => setModalRecipe(null);

  useEffect(() => {
    if (user && token) loadPlan();
  }, [user, token]);

  // ----------- Add imported recipe (from recipes page) ----------
  useEffect(() => {
    const stored = localStorage.getItem("addMealRecipe");
    if (stored) {
      const recipe = JSON.parse(stored);

      setTimeout(() => {
        setPlan((prev) => {
          const newPlan = structuredClone(prev);

          // Find first empty slot
          const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
          for (const [day, dayPlan] of Object.entries(newPlan)) {
            for (const type of mealTypes) {
              if (!dayPlan.meals[type]) {
                newPlan[day].meals[type] = recipe;
                return newPlan;
              }
            }
          }

          alert("Weekly plan is full — swap meals!");
          return prev;
        });

        localStorage.removeItem("addMealRecipe");
      }, 300);
    }
  }, []);

  if (loading)
    return (
      <div className="text-center text-vp-secondary p-20">
        Loading Planner...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <MealPlannerGrid
          plan={plan}
          setPlan={savePlan}
          openRecipe={openModal}
        />
      </main>

      {modalRecipe && (
        <RecipeModal recipe={modalRecipe} onClose={closeModal} />
      )}
    </div>
  );
};

export default Planner;
