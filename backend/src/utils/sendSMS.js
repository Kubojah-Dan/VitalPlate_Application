import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

await client.messages.create({
  body: "🍽️ Time for your meal!",
  from: process.env.TWILIO_PHONE,
  to: user.phone,
});
