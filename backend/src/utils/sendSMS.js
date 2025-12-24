import twilio from "twilio";

const client = process.env.TWILIO_SID && process.env.TWILIO_TOKEN ? twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN) : null;

export async function sendSMS(to, body) {
  if (!client) throw new Error("Twilio client not configured");
  return client.messages.create({ body, from: process.env.TWILIO_PHONE, to });
}

export default sendSMS;
