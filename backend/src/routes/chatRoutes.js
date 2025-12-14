import express from "express";
import { mealChat } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/meal-chat", protect, mealChat);

export default router;
