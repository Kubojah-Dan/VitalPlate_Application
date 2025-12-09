import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Calendar, Droplets, Target } from "lucide-react";
import RecipeModal from "./RecipeModal.jsx";

const DashboardComponent = ({ plan, profile }) => {
  if (!plan || !profile) return <p className="text-center text-slate-400">No plan found.</p>;

  // ----------------------------
  // ✅ Add Modal State + Handlers
  // ----------------------------
  const [modalRecipe, setModalRecipe] = React.useState(null);

  const openRecipeModal = (recipe) => setModalRecipe(recipe);
  const closeRecipeModal = () => setModalRecipe(null);

  // Convert MongoDB stored weekly plan into chart data
  const chartData = Object.entries(plan).map(([day, dayPlan]) => {
    if (!dayPlan?.meals) return { name: day.substring(0, 3), calories: 0 };

    let calories = 0;
    Object.values(dayPlan.meals).forEach(meal => {
      if (meal?.macros) calories += meal.macros.calories;
    });

    return {
      name: day.substring(0, 3),
      calories
    };
  });

  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  const todaysPlan = plan[today] || Object.values(plan)[0];

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto animate-fade-in-up">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Hello, {profile.name || "Friend"} 👋</h1>
          <p className="text-slate-400">{profile.goal || "Healthy Living"} Journey Continues!</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-vp-card px-4 py-2 rounded-lg shadow-sm border border-slate-700 flex items-center gap-3">
            <Target className="text-vp-secondary" size={20} />
            <div>
              <p className="text-xs text-slate-400">Daily Goal</p>
              <p className="font-bold text-slate-100">2000 kcal</p>
            </div>
          </div>

          <div className="bg-vp-card px-4 py-2 rounded-lg shadow-sm border border-slate-700 flex items-center gap-3">
            <Droplets className="text-blue-400" size={20} />
            <div>
              <p className="text-xs text-slate-400">Water</p>
              <p className="font-bold text-slate-100">1.5 L / 2L</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Today's Plan */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-vp-secondary" />
            <h2 className="text-lg font-bold">Today's Menu ({today})</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todaysPlan &&
              Object.values(todaysPlan.meals).map((meal, idx) =>
                meal && (
                  <div
                    key={idx}
                    className="bg-vp-card p-5 rounded-xl border border-slate-700 shadow-md hover:border-vp-secondary cursor-pointer transition flex gap-4"
                    onClick={() => openRecipeModal(meal)} // ✅ added click handler
                  >
                    <div className="h-20 w-20 rounded-lg overflow-hidden">
                      <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col justify-between">
                      <h3 className="font-bold text-slate-100">{meal.name}</h3>
                      <p className="text-xs text-slate-400">{meal.macros.calories} kcal</p>
                    </div>
                  </div>
                )
              )}
          </div>
        </section>

        {/* Weekly Chart */}
        <section className="bg-vp-card p-6 rounded-xl border border-slate-700 shadow-md">
          <h3 className="text-lg font-bold mb-6">Weekly Calories</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip wrapperStyle={{ backgroundColor: "#0f172a", borderRadius: "8px" }} />
                <Bar dataKey="calories" fill="#10b981" barSize={26} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ------------------------------ */}
      {/* ✅ Recipe Modal (Appears on Click) */}
      {/* ------------------------------ */}
      {modalRecipe && (
        <RecipeModal recipe={modalRecipe} onClose={closeRecipeModal} />
      )}
    </div>
  );
};

export default DashboardComponent;

