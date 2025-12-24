import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/passport.js";
import { initWebPush } from "./config/webPush.js";
import { startMealReminders } from "./cron/mealReminders.js";

const PORT = process.env.PORT || 5000;

async function ensurePlanIndexes() {
  try {
    const Plan = (await import("./models/Plan.js")).default;
    const coll = Plan.collection;
    const idxs = await coll.indexes();

    for (const idx of idxs) {
      if (idx.key && idx.key.user === 1 && idx.unique) {
        console.log("⚙️ Dropping old unique index on 'user' for plans:", idx.name);
        try {
          await coll.dropIndex(idx.name);
        } catch (e) {
          console.warn("Failed to drop index:", e.message);
        }
      }
    }

    try {
      await coll.createIndex({ user: 1, isCurrent: 1 }, { unique: true, partialFilterExpression: { isCurrent: true } });
      console.log("✅ Created partial unique index: only one current plan per user");
    } catch (e) {
      console.warn("Index creation warning:", e.message);
    }
  } catch (e) {
    console.warn("Could not ensure plan indexes:", e.message);
  }
}

connectDB().then(async () => {
  initWebPush();
  await ensurePlanIndexes();
  startMealReminders();
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
});
