import dotenv from "dotenv";
dotenv.config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
