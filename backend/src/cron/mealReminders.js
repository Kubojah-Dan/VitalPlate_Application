import cron from "node-cron";
import User from "../models/User.js";
import { sendWebPush } from "../utils/notifications.js";
import { sendSMS } from "../utils/sendSMS.js";

export const startMealReminders = () => {
  // run on the hour every hour
  cron.schedule("0 * * * *", async () => {
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
        await sendWebPush(user.pushSubscription, `Time for ${meal} 🍽️`);
      }

      if (user.profile?.phone && user.settings?.smsNotificationsEnabled) {
        try {
          await sendSMS(user.profile.phone, `VitalPlate: Time for ${meal}`);
        } catch (err) {
          console.error("SMS send failed:", err.message);
        }
      }
    }

    console.log(`🔔 Meal reminder sent for ${meal}`);
  });
};
