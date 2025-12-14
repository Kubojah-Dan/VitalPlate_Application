import cron from "node-cron";
import User from "../models/User.js";
import { sendWebPush } from "../utils/notifications.js";

export const startMealReminders = () => {
  cron.schedule("*/30 * * * *", async () => {
    const now = new Date();
    const hour = now.getHours();

    const mealMap = {
      8: "Breakfast",
      13: "Lunch",
      16: "Snack",
      19: "Dinner",
    };

    const meal = mealMap[hour];
    if (!meal) return;

    const users = await User.find({
      "settings.notificationsEnabled": true,
    });

    for (const user of users) {
      if (user.pushSubscription) {
        await sendWebPush(user, `Time for ${meal} 🍽️`);
      }

      if (user.phoneNumber) {
        await sendSMS(user.phoneNumber, `VitalPlate: Time for ${meal}`);
      }
    }

    console.log(`🔔 Meal reminder sent for ${meal}`);
  });
};
