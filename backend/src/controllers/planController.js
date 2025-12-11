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

async function fetchRecipeImage(query) {
  try {
    const res = await axios.get(
      `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(query)}`,
      {
        headers: { "X-Api-Key": process.env.NINJA_API_KEY },
      }
    );

    if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].image) {
      return res.data[0].image;
    }

    return null;
  } catch (err) {
    console.log("Ninjas API error:", err.message);
    return null;
  }
}

async function fetchGoogleImage(query) {
  try {
    const API_KEY = process.env.GOOGLE_CSE_KEY;
    const CX = process.env.GOOGLE_CSE_ENGINE_ID;

    if (!API_KEY || !CX) {
      console.log("Google CSE key/engine missing.");
      return null;
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query + " food"
    )}&cx=${CX}&key=${API_KEY}&searchType=image&num=1`;

    const res = await axios.get(url);

    const img = res.data?.items?.[0]?.link;
    return img || null;
  } catch (err) {
    console.log("Google CSE image error:", err.message);
    return null;
  }
}

function buildGroceryAndSummary(weeklyPlanObj) {
  const groceryMap = new Map();
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  Object.values(weeklyPlanObj).forEach((dayPlan) => {
    if (!dayPlan?.meals) return;

    Object.values(dayPlan.meals).forEach((meal) => {
      if (!meal) return;

      if (meal.macros) {
        totalCalories += meal.macros.calories || 0;
        totalProtein += meal.macros.protein || 0;
        totalCarbs += meal.macros.carbs || 0;
        totalFats += meal.macros.fats || 0;
      }

      (meal.ingredients || []).forEach((ing) => {
        const key = ing.name?.toLowerCase() || "";
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
    groceryList: Array.from(groceryMap.values()),
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
    });

    const userId = req.user._id;
    const profile = req.body;

    console.log("Generating AI plan for user:", userId.toString());

    const prompt = `
You are a clinical nutritionist creating a 7-day medically tailored meal plan.

User profile:
- Name: ${profile.name}
- Age: ${profile.age}
- Weight: ${profile.weight} kg
- Gender: ${profile.gender}
- Conditions: ${profile.conditions?.join(", ") || "None"}
- Goal: ${profile.goal}
- Dietary Restrictions: ${profile.dietaryRestrictions || "None"}

Return ONLY valid JSON with this exact structure:

{
  "week": [
    {
      "day": "Monday",
      "meals": {
        "Breakfast": {
          "id": "string-id",
          "name": "Oatmeal with Berries",
          "description": "Short tasty description",
          "mealType": "Breakfast",
          "prepTime": 15,
          "healthBenefit": "Explain why this is good",
          "ingredients": [
            { "name": "Oats", "amount": "1/2 cup", "category": "Grains" }
          ],
          "instructions": ["Step 1", "Step 2"],
          "macros": { "calories": 350, "protein": 15, "carbs": 50, "fats": 8 },
          "image": "https://example.com/img.jpg"
        },
        "Lunch": { ... },
        "Dinner": { ... },
        "Snack": { ... }
      }
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert clinical nutritionist. Always return strictly valid JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.choices[0]?.message?.content || "{}";

    let raw;
    try {
      raw = JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON Parse Failed:", err.message);
      return res.status(500).json({ message: "AI returned invalid JSON." });
    }

    const weekArray = raw.week || [];
    const weeklyPlan = {};

    for (const dayName of DAY_NAMES) {
      const fromAI =
        weekArray.find(
          (d) => d.day?.toLowerCase().trim() === dayName.toLowerCase().trim()
        ) || {};

      const aiMeals = fromAI.meals || {};
      const mealsObj = {};

      for (const mealType of MEAL_TYPES) {
        const m = aiMeals[mealType];
        if (!m) {
          mealsObj[mealType] = null;
          continue;
        }

        const image =
          (await fetchRecipeImage(m.name)) ||
          (await fetchGoogleImage(m.name)) || 
          m.image ||
          `https://picsum.photos/seed/${encodeURIComponent(m.name)}/500/400`;

        mealsObj[mealType] = {
          id: m.id || `${dayName}-${mealType}`,
          name: m.name || `${mealType} Meal`,
          description: m.description || "",
          mealType,
          prepTime: m.prepTime || 20,
          healthBenefit: m.healthBenefit || "",
          ingredients: m.ingredients || [],
          instructions: m.instructions || [],
          macros: {
            calories: m.macros?.calories || 0,
            protein: m.macros?.protein || 0,
            carbs: m.macros?.carbs || 0,
            fats: m.macros?.fats || 0,
          },
          image,
        };
      }

      weeklyPlan[dayName] = { day: dayName, meals: mealsObj };
    }
    const { groceryList, nutritionSummary } =
      buildGroceryAndSummary(weeklyPlan);

    const doc = await Plan.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        profileSnapshot: profile,
        weeklyPlan,
        groceryList,
        nutritionSummary,
      },
      { upsert: true, new: true }
    );

    console.log("✅ Plan saved for user:", userId.toString());

    return res.json({
      message: "Plan generated",
      plan: doc.weeklyPlan,
      groceryList: doc.groceryList,
      summary: doc.nutritionSummary,
      profile: doc.profileSnapshot,
    });
  } catch (err) {
    console.error("Plan generation error:", err);
    return res.status(500).json({
      message: "Failed to generate plan",
      error: err.message,
    });
  }
};

export const getCurrentPlan = async (req, res) => {
  try {
    const doc = await Plan.findOne({ user: req.user._id });

    if (!doc) {
      return res.json({
        plan: null,
        groceryList: [],
        summary: null,
        profile: null,
      });
    }

    return res.json({
      plan: doc.weeklyPlan,
      groceryList: doc.groceryList,
      summary: doc.nutritionSummary,
      profile: doc.profileSnapshot,
    });
  } catch (err) {
    console.error("Get plan error:", err);
    res.status(500).json({ message: "Failed to load plan" });
  }
};
