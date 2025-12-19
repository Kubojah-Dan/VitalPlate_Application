import Plan from "../models/Plan.js";
import OpenAI from "openai";
import axios from "axios";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

function toNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;

  const cleaned = String(val).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

async function fetchRecipeImage(query) {
  try {
    const res = await axios.get(
      `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(query)}`,
      { headers: { "X-Api-Key": process.env.NINJA_API_KEY } }
    );
    return res.data?.[0]?.image || null;
  } catch {
    return null;
  }
}

async function fetchGoogleImage(query) {
  try {
    if (!process.env.GOOGLE_CSE_KEY || !process.env.GOOGLE_CSE_ENGINE_ID)
      return null;

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query + " food"
    )}&cx=${process.env.GOOGLE_CSE_ENGINE_ID}&key=${process.env.GOOGLE_CSE_KEY}&searchType=image&num=1`;

    const res = await axios.get(url);
    return res.data?.items?.[0]?.link || null;
  } catch {
    return null;
  }
}

function buildGroceryAndSummary(weeklyPlan) {
  const groceryMap = new Map();
  let totalCalories = 0,
    totalProtein = 0,
    totalCarbs = 0,
    totalFats = 0;

  Object.values(weeklyPlan).forEach(({ meals }) => {
    Object.values(meals).forEach((meal) => {
      if (!meal) return;

      totalCalories += toNumber(meal.macros.calories);
      totalProtein += toNumber(meal.macros.protein);
      totalCarbs += toNumber(meal.macros.carbs);
      totalFats += toNumber(meal.macros.fats);

      (meal.ingredients || []).forEach((ing) => {
        const key = ing.name?.toLowerCase();
        if (!key) return;

        if (!groceryMap.has(key)) {
          groceryMap.set(key, {
            name: ing.name,
            amount: ing.amount || "",
            category: ing.category || "Other",
          });
        }
      });
    });
  });

  return {
    groceryList: [...groceryMap.values()],
    nutritionSummary: {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
    },
  };
}

export const generatePlan = async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL, 
    });

    const userId = req.user._id;
    const profile = req.body;

    console.log("🧠 Generating AI plan for user:", userId.toString());

    const prompt = `
Return ONLY valid JSON.
NO text, NO markdown.

Schema:
{
  "week": [
    {
      "day": "Monday",
      "meals": {
        "Breakfast": {
          "name": "string",
          "description": "string",
          "prepTime": 15,
          "healthBenefit": "string",
          "ingredients": [{ "name": "string", "amount": "string", "category": "string" }],
          "instructions": ["string"],
          "macros": { "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }
        },
        "Lunch": { ... },
        "Dinner": { ... },
        "Snack": { ... }
      }
    }
  ]
}

User:
${JSON.stringify(profile)}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = JSON.parse(completion.choices[0].message.content);

    const weeklyPlan = {};

    for (const day of DAY_NAMES) {
      const aiDay =
        raw.week?.find((d) => d.day?.toLowerCase() === day.toLowerCase()) || {};

      const meals = {};

      for (const type of MEAL_TYPES) {
        const m = aiDay.meals?.[type] || {};

        meals[type] = {
          id: `${day}-${type}`,
          name: m.name || `${type} Meal`,
          description: m.description || "",
          mealType: type,
          prepTime: toNumber(m.prepTime),
          healthBenefit: m.healthBenefit || "",
          ingredients: m.ingredients || [],
          instructions: m.instructions || [],
          macros: {
            calories: toNumber(m.macros?.calories),
            protein: toNumber(m.macros?.protein),
            carbs: toNumber(m.macros?.carbs),
            fats: toNumber(m.macros?.fats),
          },
          image:
            (await fetchRecipeImage(m.name)) ||
            (await fetchGoogleImage(m.name)) ||
            `https://picsum.photos/seed/${encodeURIComponent(
              `${day}-${type}`
            )}/500/400`,
        };
      }

      weeklyPlan[day] = { day, meals };
    }

    const { groceryList, nutritionSummary } =
      buildGroceryAndSummary(weeklyPlan);

    const doc = await Plan.findOneAndUpdate(
      { user: userId },
      { user: userId, profileSnapshot: profile, weeklyPlan, groceryList, nutritionSummary },
      { upsert: true, new: true }
    );

    console.log("✅ Plan saved");

    res.json({
      plan: Object.fromEntries(doc.weeklyPlan),
      groceryList,
      summary: nutritionSummary,
      profile,
    });
  } catch (err) {
    console.error("❌ Plan generation error:", err.message);
    res.status(500).json({ message: "Failed to generate plan" });
  }
};

export const getCurrentPlan = async (req, res) => {
  const doc = await Plan.findOne({ user: req.user._id });

  if (!doc) {
    return res.json({
      plan: null,
      groceryList: [],
      summary: null,
      profile: null,
    });
  }

  res.json({
    plan: doc.weeklyPlan,
    groceryList: doc.groceryList,
    summary: doc.nutritionSummary,
    profile: doc.profileSnapshot,
  });
};
