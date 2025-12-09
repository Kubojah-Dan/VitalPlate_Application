import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import MealPlannerGrid from "../components/MealPlannerGrid.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import { apiFetch } from "../apiClient.js";

const Planner = () => {
  const [plan, setPlan] = useState(null);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = async () => {
    try {
      const res = await apiFetch("/plan");
      setPlan(res.plan);
    } catch (e) {
      console.error("Error loading plan", e);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async (newPlan) => {
    setPlan(newPlan);
    try {
      await apiFetch("/plan", {
        method: "PUT",
        body: { plan: newPlan }
      });
    } catch (e) {
      console.error("Saving failed:", e);
    }
  };

  const openModal = (recipe) => setModalRecipe(recipe);
  const closeModal = () => setModalRecipe(null);

  useEffect(() => {
    loadPlan();
  }, []);

  if (loading) return <div className="text-center text-vp-secondary p-20">Loading Planner...</div>;

  // If Planner opened with a recipe to insert
useEffect(() => {
  const stored = localStorage.getItem("addMealRecipe");
  if (stored) {
    const recipe = JSON.parse(stored);
    setTimeout(() => {
      setPlan((prev) => {
        const newPlan = structuredClone(prev);
        const firstEmpty = Object.entries(newPlan).find(([_, day]) =>
          Object.values(day.meals).includes(null)
        );

        if (firstEmpty) {
          const [day, planDay] = firstEmpty;
          const type = Object.keys(planDay.meals).find(
            (m) => planDay.meals[m] === null
          );
          newPlan[day].meals[type] = recipe;
          return newPlan;
        }
        alert("Weekly plan is full — swap meals!");
        return prev;
      });

      localStorage.removeItem("addMealRecipe");
    }, 300);
  }
}, []);


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Navbar />
        <MealPlannerGrid plan={plan} setPlan={savePlan} openRecipe={openModal} />
      </main>

      {modalRecipe && (
        <RecipeModal recipe={modalRecipe} onClose={closeModal} />
      )}
    </div>
  );
};

export default Planner;
