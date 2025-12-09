import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchMealByName = async (name) => {
  try {
    const res = await axios.get(`${API_URL}/search.php?s=${encodeURIComponent(name)}`);
    return res.data?.meals?.[0] || null;
  } catch (err) {
    console.error('MealDB error:', err.message);
    return null;
  }
};

export const attachMealDBImage = async (recipe) => {
  const meal = await searchMealByName(recipe.name);
  if (meal && meal.strMealThumb) {
    return {
      ...recipe,
      image: `${meal.strMealThumb}/medium`,
      source: recipe.source || 'mealdb'
    };
  }
  // fallback – seeded image
  return {
    ...recipe,
    image: recipe.image || `https://picsum.photos/seed/${encodeURIComponent(recipe.id || recipe.name)}/400/400`,
    source: recipe.source || 'gemini'
  };
};
