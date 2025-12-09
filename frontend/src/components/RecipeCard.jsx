import React from "react";
import { Flame } from "lucide-react";

const RecipeCard = ({ recipe, onClick, onDragStart }) => {
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-vp-card rounded-lg p-3 border border-slate-700 shadow-md cursor-pointer hover:border-vp-secondary hover:shadow-lg transition"
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className="h-32 w-full object-cover rounded-md mb-2"
      />

      <p className="text-sm font-semibold truncate text-slate-200">{recipe.name}</p>

      {recipe.macros && (
        <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
          <Flame size={12} /> {recipe.macros.calories} kcal
        </span>
      )}
    </div>
  );
};

export default RecipeCard;
