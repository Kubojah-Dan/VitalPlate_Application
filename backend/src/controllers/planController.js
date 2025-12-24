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
Use digits for numeric values (e.g., 50) — do not spell out numbers.

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

    const aiContent = completion.choices[0].message.content;

    let raw = null;
    try {
      raw = JSON.parse(aiContent);
    } catch (parseErr) {
      console.warn("AI produced invalid JSON, attempting to extract JSON block and repair...");

      // Try to extract JSON substring between first '{' and last '}'
      const first = aiContent.indexOf("{");
      const last = aiContent.lastIndexOf("}");
      if (first !== -1 && last !== -1 && last > first) {
        const sub = aiContent.substring(first, last + 1);
        try {
          raw = JSON.parse(sub);
        } catch (e) {
          // continue to repair
        }
      }

      // If still not parsed, ask the model to return corrected JSON only
      if (!raw) {
        try {
          const repair = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b",
            temperature: 0,
            messages: [
              {
                role: "system",
                content:
                  "You are a JSON fixer. The user expects a single valid JSON object that conforms to the schema in the earlier prompt. Respond with ONLY the corrected JSON. Convert any spelled-out numbers (e.g., 'fifty') to numeric digits.",
              },
              { role: "user", content: `Please fix this invalid JSON and return only the corrected JSON:\n\n${aiContent}` },
            ],
          });

          const fixed = repair.choices[0].message.content;
          try {
            raw = JSON.parse(fixed);
          } catch (e) {
            const f = fixed.indexOf("{");
            const l = fixed.lastIndexOf("}");
            if (f !== -1 && l !== -1 && l > f) {
              raw = JSON.parse(fixed.substring(f, l + 1));
            }
          }
        } catch (e) {
          console.error("Repair attempt failed:", e.message);
        }
      }

      if (!raw) {
        console.error("Failed to parse AI response as JSON. Raw content:\n", aiContent);
        throw new Error("AI returned invalid JSON and repair attempt failed");
      }
    }

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

    // mark existing plans as not current
    await Plan.updateMany({ user: userId, isCurrent: true }, { isCurrent: false });

    const doc = await Plan.create({
      user: userId,
      name: profile.name ? `${profile.name}'s Plan` : undefined,
      isCurrent: true,
      profileSnapshot: profile,
      weeklyPlan,
      groceryList,
      nutritionSummary,
    });

    console.log("✅ Plan created and set as current");

    res.json({
      id: doc._id,
      plan: weeklyPlan,
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
  let doc = await Plan.findOne({ user: req.user._id, isCurrent: true });

  if (!doc) {
    // fallback to most recent
    doc = await Plan.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  }

  if (!doc) {
    return res.json({
      plan: null,
      groceryList: [],
      summary: null,
      profile: null,
    });
  }

  res.json({
    id: doc._id,
    plan: doc.weeklyPlan,
    groceryList: doc.groceryList,
    summary: doc.nutritionSummary,
    profile: doc.profileSnapshot,
  });
};

export const listPlans = async (req, res) => {
  const docs = await Plan.find({ user: req.user._id }).sort({ createdAt: -1 });
  const plans = docs.map((d) => ({ id: d._id, name: d.name, isCurrent: d.isCurrent, createdAt: d.createdAt }));
  res.json({ plans });
};

export const updateCurrentPlan = async (req, res) => {
  const userId = req.user._id;
  const { plan } = req.body;

  const doc = await Plan.findOne({ user: userId, isCurrent: true });
  if (!doc) return res.status(404).json({ message: "No current plan" });

  doc.weeklyPlan = plan;

  const { groceryList, nutritionSummary } = buildGroceryAndSummary(plan);
  doc.groceryList = groceryList;
  doc.nutritionSummary = nutritionSummary;

  await doc.save();

  res.json({ message: "Saved", plan: doc.weeklyPlan });
};

export const getPlanById = async (req, res) => {
  const doc = await Plan.findOne({ _id: req.params.id, user: req.user._id });

  if (!doc) return res.status(404).json({ message: "Plan not found" });

  res.json({
    id: doc._id,
    plan: doc.weeklyPlan,
    groceryList: doc.groceryList,
    summary: doc.nutritionSummary,
    profile: doc.profileSnapshot,
  });
};

export const selectPlan = async (req, res) => {
  const planId = req.params.id;
  const userId = req.user._id;

  const doc = await Plan.findOne({ _id: planId, user: userId });
  if (!doc) return res.status(404).json({ message: "Plan not found" });

  await Plan.updateMany({ user: userId, isCurrent: true }, { isCurrent: false });

  doc.isCurrent = true;
  await doc.save();

  res.json({ message: "Plan selected", id: doc._id });
};

export const swapMeal = async (req, res) => {
  const { day, mealType, newRecipe } = req.body;
  const userId = req.user._id;

  if (!day || !mealType || !newRecipe) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const plan = await Plan.findOne({ user: userId, isCurrent: true });
  if (!plan) return res.status(404).json({ message: "No current plan" });

  if (!plan.weeklyPlan?.[day]) {
    return res.status(400).json({ message: "Invalid day" });
  }

  plan.weeklyPlan[day].meals[mealType] = newRecipe;

  const { groceryList, nutritionSummary } = buildGroceryAndSummary(plan.weeklyPlan);

  plan.groceryList = groceryList;
  plan.nutritionSummary = nutritionSummary;

  await plan.save();

  res.json({ message: "Meal swapped", plan: plan.weeklyPlan });
};
