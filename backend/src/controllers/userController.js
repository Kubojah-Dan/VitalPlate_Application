import User from "../models/User.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("profile");
  res.json(user.profile || {});
};

export const updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profile: req.body },
    { new: true }
  );
  res.json(user.profile);
};

export const getSettings = async (req, res) => {
  const user = await User.findById(req.user._id).select("settings");
  res.json(user.settings || {});
};

export const updateSettings = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { settings: req.body },
    { new: true }
  );
  res.json(user.settings);
};
