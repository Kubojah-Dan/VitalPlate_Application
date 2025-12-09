import express from 'express';
import Plan from '../models/Plan.js';
import { auth } from '../middleware/auth.js';
import { generateWeeklyPlanFromGemini } from '../services/geminiService.js';
import { enrichRecipeMacrosWithNinjas } from '../services/ninjasService.js';
import { attachMealDBImage } from '../services/mealdbService.js';

const router = express.Router();

// Helper: normalize Gemini output into Plan.days format
const normalizeWeeklyPlan = (weeklyArray) => {
  // weeklyArray: [{ day: 'Monday', meals: [recipe1, recipe2,...] }]
  // we map to 4 slots: Breakfast, Lunch, Dinner, Snack
  const mealOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  return weeklyArray.map((dayObj) => {
    const mealsByType = {};
    mealOrder.forEach((type) => {
      const found = dayObj.meals.find((m) => m.mealType === type) || dayObj.meals[0];
      if (found) mealsByType[type] = found;
    });

    return {
      day: dayObj.day,
      meals: mealsByType
    };
  });
};

// POST /api/plan/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const profile = req.body.profile || req.user.profile;

    // update user profile if provided
    if (req.body.profile) {
      req.user.profile = profile;
      await req.user.save();
    }

    // 1) Gemini weekly plan
    const weeklyFromGemini = await generateWeeklyPlanFromGemini(profile);

    // 2) Normalize into our day structure
    const normalized = normalizeWeeklyPlan(weeklyFromGemini);

    // 3) Enrich each recipe with API Ninjas + MealDB
    const enrichedDays = await Promise.all(
      normalized.map(async (day) => {
        const meals = {};
        for (const [type, recipe] of Object.entries(day.meals)) {
          if (!recipe) continue;

          let enriched = { ...recipe, source: 'gemini' };
          enriched = await enrichRecipeMacrosWithNinjas(enriched);
          enriched = await attachMealDBImage(enriched);

          meals[type] = enriched;
        }
        return { day: day.day, meals };
      })
    );

    // 4) Save plan
    const plan = await Plan.create({
      user: req.user._id,
      weekStart: new Date(),
      days: enrichedDays
    });

    res.json(plan);
  } catch (err) {
    console.error('Generate plan error:', err.message);
    res.status(500).json({ message: 'Error generating plan' });
  }
});

// GET /api/plan/current
router.get('/current', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!plan) return res.status(404).json({ message: 'No plan found' });
    res.json(plan);
  } catch (err) {
    console.error('Fetch plan error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
