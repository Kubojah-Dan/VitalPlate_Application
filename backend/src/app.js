import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  if (
    req.headers["content-type"] &&
    !req.headers["content-type"].includes("application/json")
  ) {
    req.headers["content-type"] = "application/json";
  }
  next();
});

app.use(express.json({ limit: "2mb", strict: false }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("📩 Incoming Request:", req.method, req.url);
  console.log("📦 Body:", req.body || "No body");
  next();
});

app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: "🟢 VitalPlate backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/recipes", recipeRoutes);

export default app;
