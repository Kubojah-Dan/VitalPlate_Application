import Plan from "../models/Plan.js";

export const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ user: req.user.id });

    if (!plan) {
      return res.status(404).json({ message: "No plan found" });
    }

    return res.json(plan.data);

  } catch (err) {
    console.error("Error loading plan:", err);
    return res.status(500).json({ error: "Failed to fetch plan" });
  }
};

