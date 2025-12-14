import OpenAI from "openai";
import Chat from "../models/Chat.js";

export const mealChat = async (req, res) => {
  try {
    const { question, plan } = req.body;
    const userId = req.user._id;

    if (!question || !plan) {
      return res.status(400).json({ message: "Question and plan required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OPENAI_API_KEY missing" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const systemPrompt = `
You are a professional nutrition assistant.

RULES:
- Always respond in CLEAN, WELL-FORMATTED MARKDOWN
- Use headings (##), bullet points (-), and tables when useful
- Be concise but helpful
- Use emojis sparingly for clarity 🍽️🥗
- Never return raw paragraphs
`;

    const userPrompt = `
### User Meal Plan
${JSON.stringify(plan, null, 2)}

### User Question
${question}
`;


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
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
      },
    },
  },
  { upsert: true, new: true }
);

    res.json({ answer });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ message: "Chat failed" });
  }
};
