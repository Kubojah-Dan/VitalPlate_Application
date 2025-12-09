import React from "react";
import RecipeCard from "./RecipeCard.jsx";

const MealPlannerGrid = ({ plan, setPlan, openRecipe }) => {
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  let dragSource = { day: null, type: null, recipe: null };

  const onDragStart = (e, day, mealType, recipe) => {
    dragSource = { day, type: mealType, recipe };
  };

  const onDrop = (newDay, newType) => {
    if (!dragSource.recipe) return;
    const updated = { ...plan };

    // Remove from original slot
    updated[dragSource.day].meals[dragSource.type] = null;

    // Place in new slot
    updated[newDay].meals[newType] = dragSource.recipe;

    setPlan(updated);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Weekly Meal Planner</h1>

      <div className="grid grid-cols-7 gap-5">
        {Object.entries(plan).map(([day, dayPlan]) => (
          <div key={day} className="bg-vp-card rounded-xl p-4 border border-slate-700">
            <h3 className="text-center font-semibold text-vp-secondary mb-4">{day}</h3>

            <div className="space-y-4">
              {mealTypes.map(type => (
                <div
                  key={type}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(day, type)}
                  className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 min-h-[100px] transition"
                >
                  <p className="text-xs text-slate-400 mb-1">{type}</p>

                  {dayPlan.meals[type] ? (
                    <RecipeCard
                      recipe={dayPlan.meals[type]}
                      day={day}
                      mealType={type}
                      onClick={() => openRecipe(dayPlan.meals[type])}
                      onDragStart={(e) =>
                        onDragStart(e, day, type, dayPlan.meals[type])
                      }
                    />
                  ) : (
                    <p className="text-xs text-slate-600 italic">+ Add meal</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-sm text-center mt-10">
        Tip: Drag & drop meals to reorganize your week!
      </p>
    </div>
  );
};

export default MealPlannerGrid;
