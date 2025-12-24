import React from "react";
import { Info, Flame, Clock } from "lucide-react";

const RecipeCard = ({
  recipe,
  day,
  mealType,
  onClick,
}) => {
  if (!recipe) return null;

  const seed = recipe.id || `${day}-${mealType}`;
  let imageUrl =
    recipe.image ||
    `https://picsum.photos/seed/${encodeURIComponent(
      seed
    )}/300/200`;

  if (imageUrl?.startsWith("http:")) imageUrl = imageUrl.replace(/^http:/, "https:");

  return (
    <button
      draggable="true"
      onClick={onClick}
      className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm hover:border-emerald-500/50 hover:shadow-emerald-900/20 transition flex flex-col text-left"
    >
      <div className="h-32 w-full overflow-hidden bg-slate-800">
        <img
          src={imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-slate-100 text-sm leading-tight line-clamp-2">
            {recipe.name}
          </h3>
          <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-900 whitespace-nowrap">
            {mealType}
          </span>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">
          {recipe.healthBenefit}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Flame
              size={12}
              className="text-orange-500"
            />
            {recipe.macros?.calories} kcal
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {recipe.prepTime}m
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Info size={12} /> Details
          </span>
        </div>
      </div>
    </button>
  );
};

export default RecipeCard;
