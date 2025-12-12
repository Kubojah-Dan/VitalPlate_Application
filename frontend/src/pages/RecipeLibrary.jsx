import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const RecipeLibrary = () => {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
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

        const all = [];
        if (weeklyPlan) {
          Object.entries(weeklyPlan).forEach(
            ([day, dayPlan]) => {
              if (!dayPlan?.meals) return;
              MEAL_TYPES.forEach((type) => {
                const recipe = dayPlan.meals[type];
                if (recipe) {
                  all.push({ day, mealType: type, recipe });
                }
              });
            }
          );
        }
        setRecipes(all);
      } catch (e) {
        console.error("Recipe library load failed:", e);
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
        Loading recipes...
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
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">
            Recipe Library
          </h2>
          <p className="text-slate-400 mb-6">
            All meals from your current weekly plan.
          </p>

          {recipes.length === 0 ? (
            <p className="text-slate-400">
              No recipes yet. Generate a plan first.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map(({ day, mealType, recipe }) => (
                <RecipeCard
                  key={`${day}-${mealType}`}
                  day={day}
                  mealType={mealType}
                  recipe={recipe}
                  onClick={() => setSelected(recipe)}
                />
              ))}
            </div>
          )}
        </div>

        {selected && (
          <RecipeModal
            recipe={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </main>
    </div>
  );
};

export default RecipeLibrary;

