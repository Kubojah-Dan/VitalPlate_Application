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
import { Calendar, Droplets, Target, Flame } from "lucide-react";
import RecipeModal from "./RecipeModal.jsx";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const DashboardComponent = ({ plan, profile }) => {
  const [modalRecipe, setModalRecipe] = React.useState(null);

  if (!plan || Object.keys(plan).length === 0) {
    return (
      <p className="text-center text-slate-400 mt-10">
        No plan available. Generate one!
      </p>
    );
  }

  const safeProfile = profile || {};
  const displayName = safeProfile.name || "Friend";
  const displayGoal =
    safeProfile.goal || "Maintain Health";

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
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hello, {displayName}
          </h1>
          <p className="text-slate-400">
            You&apos;re on track to{" "}
            {displayGoal.toLowerCase()}.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-800 flex items-center gap-3">
            <div className="bg-orange-500/10 p-2 rounded-full text-orange-500">
              <Target size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Daily Goal
              </p>
              <p className="font-bold text-slate-200">
                2000 kcal
              </p>
            </div>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-800 flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-full text-blue-500">
              <Droplets size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Water
              </p>
              <p className="font-bold text-slate-200">
                1.2 / 2L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-200">
              Today&apos;s Menu (
              {todaysPlan?.day || todayName})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MEAL_TYPES.map((type) => {
              const meal =
                todaysPlan?.meals?.[type] || null;
              if (!meal) return null;

              const seed =
                meal.id ||
                `${todaysPlan.day || todayName}-${type}`;
              const imageUrl =
                meal.image ||
                `https://picsum.photos/seed/${encodeURIComponent(
                  seed
                )}/200/200`;

              return (
                <button
                  key={type}
                  onClick={() => setModalRecipe(meal)}
                  className="text-left bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex gap-4 hover:border-emerald-500/30 transition group"
                >
                  <div className="h-20 w-20 bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={meal.name}
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide mb-1">
                      {type}
                    </span>
                    <h3 className="font-bold text-slate-100 leading-tight mb-1">
                      {meal.name}
                    </h3>
                    {meal.macros && (
                      <div className="mt-auto text-xs text-slate-500 flex gap-3">
                        <span className="flex items-center gap-1">
                          <Flame
                            size={12}
                            className="text-orange-500"
                          />
                          {meal.macros.calories} kcal
                        </span>
                        <span className="text-emerald-600 font-medium">
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

        {/* Chart */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col">
          <h3 className="text-lg font-bold text-slate-200 mb-6">
            Weekly Calorie Intake
          </h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{ fill: "#1e293b" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.5)",
                    color: "#f1f5f9",
                  }}
                />
                <Bar
                  dataKey="calories"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
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



