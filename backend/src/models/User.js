import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    weight: Number,
    gender: String,
    conditions: [String],
    goal: String,
    dietaryRestrictions: String
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profile: profileSchema
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
