import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/passport.js";
import { initWebPush } from "./config/webPush.js";
import { startMealReminders } from "./cron/mealReminders.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  initWebPush();
  startMealReminders();
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
});
