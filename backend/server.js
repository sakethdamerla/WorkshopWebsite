// backend/server.js
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ✅ Setup dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Initialize app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// -------------------- DB CONNECTION --------------------
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// -------------------- API ROUTES --------------------
// Example routes (you can replace with your real ones)
import authRoutes from "./routes/authRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";

// -------------------- API ROUTES --------------------
app.use("/api/auth", authRoutes);
app.use("/api/workshops", workshopRoutes);

// -------------------- SERVE FRONTEND --------------------
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
