import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Calendar, Droplets, Target, Flame, Check, Utensils } from "lucide-react"; // Added Utensils and Check for completeness
// Removed external import for RecipeModal.jsx, now defined locally for compilation.

// --- MOCK COMPONENT TO FIX COMPILATION ERROR ---
const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    // Simple modal UI styled to match the futuristic theme
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-900 border border-emerald-500 rounded-xl p-8 max-w-lg w-full shadow-2xl shadow-emerald-900/40" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-emerald-400 mb-3">{recipe.name || 'Recipe Details'}</h3>
                <p className="text-slate-400 mb-6 border-b border-gray-700 pb-4">
                    <span className="font-semibold text-white mr-2">Meal Type:</span> {recipe.type || 'N/A'}
                </p>
                <div className="text-sm text-slate-300 space-y-2">
                    <p>This is a mock-up of the full recipe detail view.</p>
                    <p>Calories: <span className="text-orange-400">{recipe.macros?.calories || 'N/A'} kcal</span></p>
                    <p>Protein: <span className="text-teal-400">{recipe.macros?.protein || 'N/A'} g</span></p>
                </div>
                <button
                    onClick={onClose}
                    className="mt-8 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-500 transition shadow-md"
                >
                    Close Viewer
                </button>
            </div>
        </div>
    );
};
// -------------------------------------------------


// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Find protein payload, assuming calories is payload[0]
        const proteinData = payload.find(p => p.dataKey === 'protein');
        const calorieData = payload.find(p => p.dataKey === 'calories');
        
        return (
            <div className="p-3 bg-gray-800/90 border border-emerald-600/50 rounded-lg shadow-xl backdrop-blur-sm">
                <p className="text-xs text-gray-400 font-medium mb-1 uppercase">{label}</p>
                {calorieData && (
                    <p className="text-sm font-semibold text-white">
                        Calories: <span className="text-emerald-400">{calorieData.value} kcal</span>
                    </p>
                )}
                {proteinData && (
                    <p className="text-sm font-semibold text-white">
                        Protein: <span className="text-teal-400">{proteinData.value} g</span>
                    </p>
                )}
            </div>
        );
    }
    return null;
};

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const DashboardComponent = ({ plan, profile }) => {
  const [modalRecipe, setModalRecipe] = React.useState(null);

  if (!plan || Object.keys(plan).length === 0) {
    return (
      <div className="p-10 text-center">
          <p className="text-slate-400 text-lg mt-10 p-8 bg-gray-900/50 border border-gray-800 rounded-xl max-w-lg mx-auto shadow-inner">
            <Utensils size={24} className="mx-auto mb-3 text-emerald-500" />
            Nutrient Protocol Not Found. Please run the Onboarding process to generate your personalized meal plan.
          </p>
      </div>
    );
  }

  const safeProfile = profile || {};
  const displayName = safeProfile.name || "Friend";
  const displayGoal = safeProfile.goal || "Maintain Health";

  // chart data
  const chartData = Object.entries(plan).map(([day, dayPlan]) => {
    let calories = 0;
    let protein = 0;

    if (dayPlan && dayPlan.meals) {
      Object.values(dayPlan.meals).forEach((meal) => {
        if (meal && meal.macros) {
          calories += Number(meal.macros.calories || 0);
          protein += Number(meal.macros.protein || 0);
        }
      });
    }

    return {
      name: day.substring(0, 3),
      calories,
      protein,
    };
  });

  const todayName = new Date().toLocaleString("en-us", {
    weekday: "long",
  });
  const todaysPlan = plan[todayName] || Object.values(plan)[0];

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Hello, <span className="text-emerald-400">{displayName}</span>
          </h1>
          <p className="text-lg text-slate-400 mt-1">
            <Check size={18} className="inline mr-2 text-emerald-500" />
            Protocol Status: On track to {displayGoal.toLowerCase()}.
          </p>
        </div>
        
        {/* Info Cards (Daily Goal & Water) - Updated to Emerald/Teal */}
        <div className="flex flex-wrap gap-4">
          {/* Daily Goal Card (Emerald/Target) */}
          <div className="bg-gray-900/50 px-5 py-3 rounded-xl shadow-xl border border-emerald-800/50 flex items-center gap-3">
            <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-500">
              <Target size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Daily Calorie Target
              </p>
              <p className="font-bold text-xl text-slate-100">
                2000 kcal
              </p>
            </div>
          </div>
          
          {/* Water Card (Teal/Droplets) */}
          <div className="bg-gray-900/50 px-5 py-3 rounded-xl shadow-xl border border-teal-800/50 flex items-center gap-3">
            <div className="bg-teal-500/10 p-3 rounded-full text-teal-500">
              <Droplets size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Hydration Level
              </p>
              <p className="font-bold text-xl text-slate-100">
                1.2 / 2.5 L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      {/* Ensures the layout is responsive, using lg:grid-cols-3 for desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Meals (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-emerald-500" />
            <h2 className="text-2xl font-bold text-slate-200">
              Today&apos;s Protocol ({todaysPlan?.day || todayName})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MEAL_TYPES.map((type) => {
              // Ensure we pass the meal type to the recipe object for the mock modal
              const meal = todaysPlan?.meals?.[type] ? { ...todaysPlan.meals[type], type: type } : null;
              if (!meal) return null;

              const seed = meal.id || `${todaysPlan.day || todayName}-${type}`;
              const imageUrl = meal.image || `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;

              return (
                <button
                  key={type}
                  onClick={() => setModalRecipe(meal)}
                  // Futuristic Meal Card Styling with hover effect
                  className="text-left bg-gray-900/70 p-5 rounded-2xl border border-gray-800 shadow-xl shadow-black/30 flex gap-4 hover:border-emerald-500 transition group hover:scale-[1.01]"
                >
                  <div className="h-20 w-20 bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden border border-emerald-900/50">
                    <img
                      src={imageUrl}
                      alt={meal.name}
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        // Placeholder fallback for missing image
                        e.target.src = `https://placehold.co/200x200/0f172a/10b981?text=${type}`;
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
                      {type}
                    </span>
                    <h3 className="font-bold text-slate-100 text-lg leading-tight mb-1 group-hover:text-white transition">
                      {meal.name}
                    </h3>
                    {meal.macros && (
                      <div className="mt-1 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 text-orange-400">
                          <Flame size={12} className="text-orange-500" />
                          {meal.macros.calories} kcal
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-teal-400">
                          <Droplets size={12} />
                          {meal.macros.protein}g protein
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart (lg:col-span-1) */}
        <div className="bg-gray-900/70 p-6 rounded-2xl shadow-xl shadow-black/30 border border-emerald-800/50 flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-6">
            Weekly Macro Distribution
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  // Dark grid line color
                  stroke="#1e293b"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    // Light gray ticks
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    // Light gray ticks
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{ fill: "#1e293b", opacity: 0.5 }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="calories"
                  // Bright emerald fill
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
                <Bar
                  dataKey="protein"
                  // Teal fill for secondary data
                  fill="#14b8a6"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            *Calories (Emerald) and Protein (Teal) tracked daily.
          </p>
        </div>
      </div>

      {modalRecipe && (
        <RecipeModal
          recipe={modalRecipe}
          onClose={() => setModalRecipe(null)}
        />
      )}
    </div>
  );
};

export default DashboardComponent;



