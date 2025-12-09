import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // More reliable JSON structure

export const generatePlan = async (req, res) => {
  try {
    const profile = req.body;

    const prompt = `
    Generate a 7-day meal plan STRICTLY in this JSON format:
    {
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "name": "Meal Name",
              "calories": 0,
              "protein": 0,
              "carbs": 0,
              "fats": 0
            }
          ]
        }
      ]
    }

    IMPORTANT RULES:
    - ONLY return JSON (no backticks, no markdown, no commentary)
    - 4 meals per day: Breakfast, Lunch, Dinner, Snack
    - Calories per day 1600–2200 depending on user's needs
    - Customize based on this user: ${JSON.stringify(profile)}
    `;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    // Remove any accidental markdown formatting
    const cleaned = aiText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("❌ JSON Parsing Error: ", parseError.message);
      console.log("AI Response:", cleaned);
      return res
        .status(500)
        .json({ error: "Failed to parse AI meal plan JSON" });
    }

    res.json(plan);
  } catch (err) {
    console.error("Plan generation error:", err.message);
    return res.status(500).json({
      error: "Failed to generate meal plan",
      details: err.message,
    });
  }
};
