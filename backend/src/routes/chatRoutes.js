import express from "express";
import { mealChat, searchChat } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/meal-chat", protect, mealChat);
router.post("/search", protect, searchChat);

export default router;
