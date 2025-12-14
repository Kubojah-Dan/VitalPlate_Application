import { sendWebPush } from "../utils/notifications.js";
import User from "../models/User.js";

export const subscribePush = async (req, res) => {
  const userId = req.user._id;
  const subscription = req.body;

  await User.findByIdAndUpdate(userId, {
    pushSubscription: subscription,
  });

  res.json({ message: "Push subscription saved" });
};

export const testNotification = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user?.pushSubscription) {
    return res.status(400).json({ message: "No subscription found" });
  }

  await sendWebPush(user.pushSubscription, "🍽️ Time for your next meal!");

  res.json({ message: "Notification sent" });
};
