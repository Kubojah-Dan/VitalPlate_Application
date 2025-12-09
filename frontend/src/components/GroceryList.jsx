import React from "react";
import { ShoppingCart, CheckCircle, Circle } from "lucide-react";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const GroceryList = ({ plan }) => {
  const [checkedItems, setCheckedItems] = React.useState(
    new Set()
  );

  const aggregatedIngredients = React.useMemo(() => {
    const map = new Map(); 

    if (!plan) return {};

    Object.values(plan).forEach((dayPlan) => {
      if (!dayPlan?.meals) return;
      MEAL_TYPES.forEach((type) => {
        const recipe = dayPlan.meals[type];
        if (!recipe || !recipe.ingredients) return;

        recipe.ingredients.forEach((ing) => {
          const key = (ing.name || "").toLowerCase();
          if (!key) return;
          if (!map.has(key)) map.set(key, []);
          map
            .get(key)
            .push({
              amount: ing.amount || "",
              category: ing.category || "Other",
            });
        });
      });
    });

    const byCategory = {};
    map.forEach((vals, name) => {
      const cat = vals[0].category || "Other";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(
        name.charAt(0).toUpperCase() + name.slice(1)
      );
    });

    return byCategory;
  }, [plan]);

  const toggleItem = (item) => {
    const copy = new Set(checkedItems);
    if (copy.has(item)) copy.delete(item);
    else copy.add(item);
    setCheckedItems(copy);
  };

  if (!plan || Object.keys(plan).length === 0) {
    return (
      <p className="text-center text-slate-400 mt-10">
        No plan yet. Generate a plan to see your grocery list.
      </p>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-900/50 p-3 rounded-full text-indigo-400 border border-indigo-900">
          <ShoppingCart size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Grocery List
          </h2>
          <p className="text-slate-400">
            Auto-generated from your weekly meal plan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(aggregatedIngredients).map(
          ([category, items]) => (
            <div
              key={category}
              className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden"
            >
              <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 font-semibold text-slate-300">
                {category}
              </div>
              <div className="p-4 space-y-3">
                {items.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
                    className="flex items-center gap-3 w-full text-left group"
                  >
                    <span
                      className={
                        checkedItems.has(item)
                          ? "text-emerald-500"
                          : "text-slate-600 group-hover:text-emerald-500 transition"
                      }
                    >
                      {checkedItems.has(item) ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </span>
                    <span
                      className={`text-sm ${
                        checkedItems.has(item)
                          ? "text-slate-600 line-through"
                          : "text-slate-300"
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GroceryList;
