import OpenAI from "openai";
import Chat from "../models/Chat.js";

function summarizePlan(plan) {
  const summary = {};

  for (const [day, data] of Object.entries(plan || {})) {
    summary[day] = {};

    for (const [mealType, meal] of Object.entries(data.meals || {})) {
      if (!meal) continue;

      summary[day][mealType] = meal.name;
    }
  }

  return summary;
}


export const mealChat = async (req, res) => {
  try {
    const { question, plan } = req.body;
    const userId = req.user._id;

    if (!question || !plan) {
      return res.status(400).json({ message: "Question and plan required" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL, 
    });
    const compactPlan = summarizePlan(plan);

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      max_tokens: 800,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
You are a professional nutrition assistant.

RULES:
- Use ONLY meals from the provided plan
- Respond in clean Markdown
- Use bullet points and short sections
- Be concise and practical
- If asked about a specific day, answer ONLY for that day
          `.trim(),
        },
        {
          role: "user",
          content: `
Meal Plan Summary (names only):
${JSON.stringify(compactPlan, null, 2)}

Question:
${question}
          `.trim(),
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    await Chat.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: question },
              { role: "assistant", content: answer },
            ],
            $slice: -20, 
          },
        },
      },
      { upsert: true }
    );

    res.json({ answer });
  } catch (err) {
    console.error("❌ Chat error:", err.message);
    res.status(500).json({ message: "Chat failed" });
  }
};
