import axios from 'axios';

const NINJAS_URL = 'https://api.api-ninjas.com/v1/nutrition';

export const enrichRecipeMacrosWithNinjas = async (recipe) => {
  try {
    if (!process.env.NINJA_API_KEY) return recipe;

    const query = recipe.name || 'meal';
    const res = await axios.get(NINJAS_URL, {
      params: { query },
      headers: { 'X-Api-Key': process.env.NINJA_API_KEY }
    });

    const item = Array.isArray(res.data) && res.data[0];
    if (!item) return recipe;

    const macros = {
      calories: Math.round(item.calories || recipe.macros?.calories || 0),
      protein: Math.round(item.protein_g || recipe.macros?.protein || 0),
      carbs: Math.round(item.carbohydrates_total_g || recipe.macros?.carbs || 0),
      fats: Math.round(item.fat_total_g || recipe.macros?.fats || 0)
    };

    return {
      ...recipe,
      macros,
      source: recipe.source || 'ninjas'
    };
  } catch (err) {
    console.error('API Ninjas error:', err.message);
    return recipe;
  }
};
