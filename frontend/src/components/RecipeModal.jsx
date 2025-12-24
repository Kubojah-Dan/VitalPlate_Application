import React from "react";
import {
  X,
  Clock,
  Flame,
  Utensils,
  HeartPulse,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";

import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const RecipeModal = ({ recipe, onClose, day: currentDay, mealType: currentMealType }) => {
  const { token } = useAuth();
  const [days, setDays] = useState([]);
  const [swapDay, setSwapDay] = useState(currentDay || "Monday");
  const [swapType, setSwapType] = useState(currentMealType || "Dinner");
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/plan", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        const daysList = data.plan ? Object.keys(data.plan) : ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        setDays(daysList);
      } catch (e) {
        setDays(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]);
      }
    })();
  }, [token]);

  if (!recipe) return null;

  const macroData = [
    {
      name: "Protein",
      value: recipe.macros?.protein || 0,
      color: "#10b981",
    },
    {
      name: "Carbs",
      value: recipe.macros?.carbs || 0,
      color: "#3b82f6",
    },
    {
      name: "Fats",
      value: recipe.macros?.fats || 0,
      color: "#f59e0b",
    },
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
        <div className="relative h-48 bg-gradient-to-r from-emerald-900 to-slate-900 flex items-end p-8 border-b border-slate-800">
          <button
            type="button"
            aria-label="Close recipe"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white transition"
          >
            <X size={24} />
          </button>
          <div className="text-white relative z-10">
            <div className="flex items-center gap-2 text-emerald-300 text-sm mb-2 font-medium">
              {recipe.mealType && (
                <span className="bg-emerald-950/50 border border-emerald-900 px-2 py-1 rounded-md backdrop-blur-sm">
                  {recipe.mealType}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={14} /> {recipe.prepTime} mins
              </span>
            </div>
            <h2 className="text-4xl font-bold">
              {recipe.name}
            </h2>
            <p className="text-slate-300 mt-2 max-w-2xl">
              {recipe.description}
            </p>
          </div>
          <div className="absolute inset-0 bg-emerald-600/10 mix-blend-overlay"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {/* Left: ingredients + instructions */}
          <div className="md:col-span-2 space-y-8">
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

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Utensils
                  size={20}
                  className="text-slate-500"
                />{" "}
                Ingredients
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(recipe.ingredients || []).map(
                  (ing, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800"
                    >
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-200 font-medium">
                        {ing.name}
                      </span>
                      <span className="text-slate-500 text-sm ml-auto">
                        {ing.amount}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Instructions
              </h3>
              <ol className="space-y-6">
                {(recipe.instructions || []).map(
                  (step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-slate-300 leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  )
                )}
              </ol>
            </div>

            <div className="mt-6 bg-slate-900/40 border border-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Replace another meal with this one</h4>
              <div className="flex gap-2 mb-3">
                <select value={swapDay} onChange={(e)=>setSwapDay(e.target.value)} className="bg-slate-950 border border-slate-800 px-3 py-2 rounded">
                  {days.map(d => <option key={d}>{d}</option>)}
                </select>
                <select value={swapType} onChange={(e)=>setSwapType(e.target.value)} className="bg-slate-950 border border-slate-800 px-3 py-2 rounded">
                  {['Breakfast','Lunch','Dinner','Snack'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async ()=>{
                    setIsSwapping(true);
                    try {
                      await fetch('/api/plan/swap', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ day: swapDay, mealType: swapType, newRecipe: recipe }) });
                      window.location.reload();
                    } catch (e) {
                      alert('Swap failed');
                    } finally { setIsSwapping(false); }
                  }}
                  className="bg-emerald-600 px-4 py-2 rounded text-black"
                  disabled={isSwapping}
                >
                  {isSwapping ? 'Swapping...' : `Replace ${swapType} on ${swapDay}`}
                </button>
                <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </div>
          </div>

          {/* Right: nutrition */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Flame
                size={20}
                className="text-orange-500"
              />{" "}
              Nutritional Info
            </h3>

            <div className="mb-8 h-48">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-xs font-medium text-slate-400 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>{" "}
                  Protein
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>{" "}
                  Carbs
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>{" "}
                  Fats
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg shadow-sm border border-slate-800">
                <span className="text-slate-400">
                  Calories
                </span>
                <span className="font-bold text-white">
                  {recipe.macros?.calories} kcal
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg shadow-sm border border-slate-800">
                <span className="text-slate-400">
                  Protein
                </span>
                <span className="font-bold text-emerald-500">
                  {recipe.macros?.protein}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg shadow-sm border border-slate-800">
                <span className="text-slate-400">
                  Carbs
                </span>
                <span className="font-bold text-blue-500">
                  {recipe.macros?.carbs}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg shadow-sm border border-slate-800">
                <span className="text-slate-400">
                  Fats
                </span>
                <span className="font-bold text-amber-500">
                  {recipe.macros?.fats}g
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
