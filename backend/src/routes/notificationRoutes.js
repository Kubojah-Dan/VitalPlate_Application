import express from "express";
import { protect } from "../middleware/auth.js";
import { sendWebPush } from "../utils/notifications.js";

const router = express.Router();

router.post("/subscribe", protect, sendWebPush);

export default router;
