import React, { useState, useMemo } from "react";
import { ShoppingCart, CheckCircle, Circle } from "lucide-react";

const GroceryList = ({ plan }) => {
  const [checked, setChecked] = useState(new Set());

  const toggleItem = (item) => {
    const s = new Set(checked);
    s.has(item) ? s.delete(item) : s.add(item);
    setChecked(s);
  };

  const grouped = useMemo(() => {
    const map = new Map();
    
    Object.values(plan).forEach(day => {
      Object.values(day.meals).forEach(recipe => {
        if (!recipe?.ingredients) return;
        recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase();
          const cat = ing.category || "Other";

          if (!map.has(cat)) map.set(cat, new Set());
          map.get(cat).add(key);
        });
      });
    });

    return Array.from(map.entries());
  }, [plan]);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-vp-card p-3 rounded-lg border border-slate-700">
          <ShoppingCart className="text-vp-secondary" size={28} />
        </div>
        <h1 className="text-3xl font-bold">Grocery List</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grouped.map(([category, items]) => (
          <div key={category} className="bg-vp-card p-5 rounded-xl border border-slate-700">
            <h3 className="font-semibold text-slate-300 mb-4 border-b border-slate-600 pb-2">
              {category}
            </h3>

            {[...items].map(item => (
              <button
                key={item}
                onClick={() => toggleItem(item)}
                className="flex items-center gap-3 w-full py-2 group"
              >
                {checked.has(item) ? (
                  <CheckCircle size={18} className="text-vp-secondary" />
                ) : (
                  <Circle size={18} className="text-slate-500 group-hover:text-vp-secondary" />
                )}

                <span className={checked.has(item)
                  ? "text-slate-500 line-through"
                  : "text-slate-200"}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryList;
