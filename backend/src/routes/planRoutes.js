import express from "express";
import { generatePlan, getCurrentPlan } from "../controllers/planController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", protect, generatePlan);
router.get("/", protect, getCurrentPlan);

export default router;

