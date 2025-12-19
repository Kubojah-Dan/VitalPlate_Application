import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema(
  {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String,
    },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    weight: Number,
    gender: String,
    phone: String,         
    activityLevel: String,
    conditions: [String],
    allergies: [String],
    cuisinePreferences: [String],
    lifestyle: String,
    goal: String,
    dietaryRestrictions: String,
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    notificationsEnabled: { type: Boolean, default: true },
    units: { type: String, default: "Metric" },
    weekStart: { type: String, default: "Monday" },
    groceryIntegration: { type: Boolean, default: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    provider: String, 
    profile: profileSchema,
    settings: settingsSchema,
    pushSubscription: pushSubscriptionSchema, 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
