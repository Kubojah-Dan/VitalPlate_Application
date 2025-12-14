import express from "express";
import {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettings);

export default router;
