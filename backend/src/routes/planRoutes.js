import express from "express";
import { generatePlan, getCurrentPlan, listPlans, getPlanById, selectPlan, updateCurrentPlan, swapMeal } from "../controllers/planController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", protect, generatePlan);
router.get("/", protect, getCurrentPlan);
router.put("/", protect, updateCurrentPlan);
router.get("/plans", protect, listPlans);
router.get("/:id", protect, getPlanById);
router.post("/:id/select", protect, selectPlan);
router.post("/swap", protect, swapMeal);

export default router;

