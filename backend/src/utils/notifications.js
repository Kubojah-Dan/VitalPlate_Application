import webpush from "../config/webPush.js";

export const sendWebPush = async (subscription, message) => {
  if (!subscription) return;

  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: "VitalPlate Reminder",
      body: message,
    })
  );
};
