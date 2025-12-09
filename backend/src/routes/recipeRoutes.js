import express from 'express';
import axios from 'axios';

const router = express.Router();
const MEALDB_URL = 'https://www.themealdb.com/api/json/v1/1';

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const response = await axios.get(`${MEALDB_URL}/search.php?s=${encodeURIComponent(q)}`);
    const meals = response.data?.meals || [];

    const mapped = meals.map((m) => ({
      id: m.idMeal,
      name: m.strMeal,
      description: m.strCategory || '',
      mealType: 'Dinner',
      prepTime: 30,
      healthBenefit: m.strArea ? `Inspired by ${m.strArea} cuisine` : '',
      ingredients: Object.keys(m)
        .filter((k) => k.startsWith('strIngredient') && m[k])
        .map((k) => {
          const idx = k.replace('strIngredient', '');
          return {
            name: m[k],
            amount: m[`strMeasure${idx}`] || '',
            category: 'Other'
          };
        }),
      instructions: (m.strInstructions || '').split('\r\n').filter(Boolean),
      macros: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      },
      image: m.strMealThumb,
      source: 'mealdb'
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Recipe search error:', err.message);
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

export default router;
