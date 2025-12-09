import mongoose from "mongoose";

const MacroSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
  { _id: false }
);

const IngredientSchema = new mongoose.Schema(
  {
    name: String,
    amount: String,
    category: String,
  },
  { _id: false }
);

const RecipeSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
    mealType: String,
    prepTime: Number,
    healthBenefit: String,
    ingredients: [IngredientSchema],
    instructions: [String],
    macros: MacroSchema,
    image: String,
  },
  { _id: false }
);

const DayPlanSchema = new mongoose.Schema(
  {
    day: String,
    meals: {
      Breakfast: { type: RecipeSchema, default: null },
      Lunch: { type: RecipeSchema, default: null },
      Dinner: { type: RecipeSchema, default: null },
      Snack: { type: RecipeSchema, default: null },
    },
  },
  { _id: false }
);

const PlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    profileSnapshot: { type: Object },

    // Option 2: weekly plan + grocery + summary
    weeklyPlan: {
      type: Map,
      of: DayPlanSchema,
      default: {},
    },

    groceryList: [
      {
        name: String,
        amount: String,
        category: String,
      },
    ],

    nutritionSummary: {
      totalCalories: { type: Number, default: 0 },
      totalProtein: { type: Number, default: 0 },
      totalCarbs: { type: Number, default: 0 },
      totalFats: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", PlanSchema);
export default Plan;
