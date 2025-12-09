import React, { useRef } from "react";
import RecipeCard from "./RecipeCard.jsx";

const MealPlannerGrid = ({ plan, setPlan, openRecipe }) => {
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const dragData = useRef({ day: null, type: null, recipe: null });

  const onDragStart = (day, mealType, recipe) => {
    dragData.current = { day, type: mealType, recipe };
  };

  const onDrop = (newDay, newType) => {
    const src = dragData.current;
    if (!src.recipe) return;

    const updated = structuredClone(plan);

    updated[src.day].meals[src.type] = null;

    updated[newDay].meals[newType] = src.recipe;

    setPlan(updated);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Weekly Meal Planner</h1>

      <div className="grid grid-cols-7 gap-6">
        {Object.entries(plan).map(([day, dayPlan]) => (
          <div
            key={day}
            className="bg-slate-900 rounded-xl p-4 border border-slate-800"
          >
            <h3 className="text-center font-semibold text-emerald-400 mb-4">
              {day}
            </h3>

            <div className="space-y-4">
              {mealTypes.map((type) => (
                <div
                  key={type}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(day, type)}
                  className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 min-h-[110px]"
                >
                  <p className="text-xs text-slate-400 mb-2">{type}</p>

                  {dayPlan.meals[type] ? (
                    <div
                      draggable
                      onDragStart={() =>
                        onDragStart(day, type, dayPlan.meals[type])
                      }
                    >
                      <RecipeCard
                        recipe={dayPlan.meals[type]}
                        day={day}
                        mealType={type}
                        onClick={() => openRecipe(dayPlan.meals[type])}
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 italic">+ Drop meal here</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-sm text-center mt-10">
        Drag & drop meals to reorganize your week!
      </p>
    </div>
  );
};

export default MealPlannerGrid;

