import express from "express";
import { protect } from "../middleware/auth.js";
import {
  subscribePush,
  testNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/subscribe", protect, subscribePush);
router.post("/test", protect, testNotification);

export default router;
