// backend/server.js
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { students, admin } from "./models/users.js"; // import dummy DB

// -------------------- INIT --------------------
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Setup dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- REGISTER --------------------
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Already exists?
  const exists = students.find((s) => s.email === email);
  if (exists) {
    return res.status(400).json({ message: "Student already registered" });
  }

  students.push({ name, email, password });
  return res.status(201).json({ message: "Student registered successfully" });
});

// -------------------- LOGIN --------------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // ✅ Admin login
  if (email === admin.email && password === admin.password) {
    return res.json({ role: "admin", message: "Admin login successful" });
  }

  // ✅ Student login - must already exist
  const student = students.find(
    (s) => s.email === email && s.password === password
  );

  if (!student) {
    return res.status(401).json({
      message:
        "Invalid credentials. Please register first or check your password.",
    });
  }

  return res.json({
    role: "student",
    message: "Student login successful",
    student,
  });
});

// -------------------- DASHBOARDS --------------------
app.get("/api/admin/dashboard", (req, res) => {
  res.json({
    message: "Welcome Admin! Here are all registered students:",
    students,
  });
});

app.get("/api/student/dashboard/:email", (req, res) => {
  const student = students.find((s) => s.email === req.params.email);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ message: `Welcome ${student.name}!`, student });
});

// -------------------- SERVE FRONTEND --------------------
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ Fix for Express 5 (use regex instead of "*")
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
