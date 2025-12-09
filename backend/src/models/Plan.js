import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: String,
    amount: String,
    category: String
  },
  { _id: false }
);

const macrosSchema = new mongoose.Schema(
  {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
    mealType: String,   // 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
    prepTime: Number,
    healthBenefit: String,
    ingredients: [ingredientSchema],
    instructions: [String],
    macros: macrosSchema,
    image: String,
    source: String      // 'gemini' | 'mealdb' | 'ninjas'
  },
  { _id: false }
);

const dayPlanSchema = new mongoose.Schema(
  {
    day: String, // 'Monday', 'Tuesday',...
    meals: {
      Breakfast: recipeSchema,
      Lunch: recipeSchema,
      Dinner: recipeSchema,
      Snack: recipeSchema
    }
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, default: Date.now },
    days: [dayPlanSchema]
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
