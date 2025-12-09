import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    mealType: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
    prepTime: { type: Type.INTEGER },
    healthBenefit: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING },
          category: { type: Type.STRING }
        }
      }
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    macros: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.INTEGER },
        protein: { type: Type.INTEGER },
        carbs: { type: Type.INTEGER },
        fats: { type: Type.INTEGER }
      }
    }
  },
  required: ['id', 'name', 'mealType', 'ingredients', 'instructions', 'macros', 'healthBenefit']
};

const weeklyPlanSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING },
      meals: {
        type: Type.ARRAY,
        items: recipeSchema
      }
    },
    required: ['day', 'meals']
  }
};

export const generateWeeklyPlanFromGemini = async (profile) => {
  const prompt = `
    Generate a 7-day meal plan (Monday to Sunday) for a user with the following profile:
    - Age: ${profile.age}
    - Weight: ${profile.weight}kg
    - Gender: ${profile.gender}
    - Health Conditions: ${profile.conditions?.join(', ') || 'None'}
    - Goal: ${profile.goal}
    - Dietary Restrictions: ${profile.dietaryRestrictions || 'None'}

    The plan must include Breakfast, Lunch, Dinner, and a Snack for each day.
    Ensure recipes are medically tailored to the conditions (e.g., low sodium for hypertension, low carb for diabetes).
    Include specific ingredient amounts and a brief health benefit rationale for each recipe.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: weeklyPlanSchema,
      systemInstruction:
        'You are an expert nutritionist and dietitian specializing in chronic disease management.'
    }
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  return JSON.parse(text);
};
