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

    // create embeddings for the user question and assistant answer
    try {
      const userEmb = await client.embeddings.create({ model: "text-embedding-3-small", input: question });
      const assistantEmb = await client.embeddings.create({ model: "text-embedding-3-small", input: answer });

      const userVec = userEmb.data?.[0]?.embedding || [];
      const assistantVec = assistantEmb.data?.[0]?.embedding || [];

      await Chat.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: question, embedding: userVec },
                { role: "assistant", content: answer, embedding: assistantVec },
              ],
              $slice: -200,
            },
          },
        },
        { upsert: true }
      );
    } catch (e) {
      console.warn("Embeddings error:", e.message);
      // fallback to saving without embeddings
      await Chat.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: question },
                { role: "assistant", content: answer },
              ],
              $slice: -200,
            },
          },
        },
        { upsert: true }
      );
    }

    res.json({ answer });
  } catch (err) {
    console.error("❌ Chat error:", err.message);
    res.status(500).json({ message: "Chat failed" });
  }
};

export const searchChat = async (req, res) => {
  try {
    const { q, top = 5 } = req.body;
    const userId = req.user._id;

    if (!q) return res.status(400).json({ message: "Query required" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });
    const emb = await client.embeddings.create({ model: "text-embedding-3-small", input: q });
    const qVec = emb.data?.[0]?.embedding || [];

    const chat = await Chat.findOne({ user: userId });
    if (!chat?.messages?.length) return res.json({ results: [] });

    function cosine(a, b) {
      const dot = a.reduce((s, v, i) => s + (v * (b[i] || 0)), 0);
      const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
      const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
      if (!normA || !normB) return 0;
      return dot / (normA * normB);
    }

    const scored = chat.messages
      .map((m) => ({ ...m.toObject(), score: m.embedding?.length ? cosine(qVec, m.embedding) : 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, top);

    res.json({ results: scored });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ message: "Search failed" });
  }
};
