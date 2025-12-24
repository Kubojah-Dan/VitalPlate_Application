import { sendWebPush } from "../utils/notifications.js";
import { sendSMS } from "../utils/sendSMS.js";
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

export const testSMS = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user?.profile?.phone) return res.status(400).json({ message: "No phone on profile" });

  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN || !process.env.TWILIO_PHONE) {
    return res.status(400).json({ message: "Twilio not configured. Set TWILIO_SID, TWILIO_TOKEN and TWILIO_PHONE" });
  }

  try {
    await sendSMS(user.profile.phone, "VitalPlate test message: 🍽️ This is a test.");
    res.json({ message: "SMS sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
