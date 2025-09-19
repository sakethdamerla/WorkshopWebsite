import express from "express";

const router = express.Router();

// Fake in-memory "database"
let users = [];

// Register
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  // check if exists
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: "User already exists" });

  const newUser = { id: Date.now(), name, email, password, role };
  users.push(newUser);

  res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Login
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const user = users.find((u) => u.email === email && u.role === role);
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});

// Student Dashboard (dummy)
router.get("/student-dashboard", (req, res) => {
  res.json({
    message: "Welcome Student!",
    workshops: ["React Basics", "NodeJS Crash Course", "Tailwind Workshop"],
  });
});

// Admin Dashboard (dummy)
router.get("/admin-dashboard", (req, res) => {
  res.json({
    message: "Welcome Admin!",
    stats: { registeredStudents: users.length, workshops: 3 },
  });
});

export default router;
