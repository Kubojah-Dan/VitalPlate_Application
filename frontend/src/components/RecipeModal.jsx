import React from "react";
import { X, Clock, Flame, Utensils, HeartPulse } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  const macroData = [
    {
      name: "Protein",
      value: recipe?.macros?.protein || 0,
      color: "#10b981" // Emerald-500
    },
    {
      name: "Carbs",
      value: recipe?.macros?.carbs || 0,
      color: "#3b82f6" // Blue-500
    },
    {
      name: "Fats",
      value: recipe?.macros?.fats || 0,
      color: "#f59e0b" // Amber-500
    }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-r from-emerald-900 to-slate-900 flex items-end p-8 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/60 p-2 rounded-full text-white transition"
          >
            <X size={22} />
          </button>

          <div className="text-white relative z-10">
            <div className="flex items-center gap-2 text-emerald-300 text-sm mb-2 font-medium">
              {recipe.mealType && (
                <span className="bg-emerald-950/50 border border-emerald-900 px-2 py-1 rounded-md backdrop-blur-sm">
                  {recipe.mealType}
                </span>
              )}
              {recipe.prepTime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {recipe.prepTime} mins
                </span>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">{recipe.name}</h2>
            {recipe.description && (
              <p className="text-slate-300 mt-2 max-w-2xl text-sm md:text-base">
                {recipe.description}
              </p>
            )}
          </div>

          <div className="absolute inset-0 bg-emerald-600/10 mix-blend-overlay" />
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {/* Left - Ingredients & Instructions */}
          <div className="md:col-span-2 space-y-8">
            {/* Health Benefit Banner */}
            {recipe.healthBenefit && (
              <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl flex items-start gap-3">
                <div className="bg-emerald-900/50 p-2 rounded-full text-emerald-400 mt-0.5">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-400">
                    Why this is good for you
                  </h4>
                  <p className="text-emerald-200/80 text-sm mt-1">
                    {recipe.healthBenefit}
                  </p>
                </div>
              </div>
            )}

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Utensils size={20} className="text-slate-500" /> Ingredients
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(recipe.ingredients || []).map((ing, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800"
                  >
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-200 font-medium">
                      {ing.name}
                    </span>
                    <span className="text-slate-500 text-sm ml-auto">
                      {ing.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Instructions</h3>
              <ol className="space-y-6">
                {(recipe.instructions || []).map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-1 text-sm">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right - Nutritional Info */}
          <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Flame size={20} className="text-orange-500" /> Nutritional Info
            </h3>

            {/* Pie Chart */}
            <div className="mb-8 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f9fafb"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Calories</span>
                <span className="font-bold text-white">
                  {recipe?.macros?.calories || 0} kcal
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Protein</span>
                <span className="font-bold text-emerald-400">
                  {recipe?.macros?.protein || 0} g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Carbs</span>
                <span className="font-bold text-blue-400">
                  {recipe?.macros?.carbs || 0} g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Fats</span>
                <span className="font-bold text-amber-400">
                  {recipe?.macros?.fats || 0} g
                </span>
              </div>
            </div>

            {/* Add to Planner Button */}
            <button
              onClick={() => {
                localStorage.setItem("addMealRecipe", JSON.stringify(recipe));
                window.location.href = "/planner";
              }}
              className="w-full mt-6 bg-vp-secondary text-black font-bold py-3 rounded-xl hover:bg-emerald-500 transition"
            >
              ➕ Add to Planner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
