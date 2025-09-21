import express from 'express';
import Student from '../models/student.js';
import bcrypt from 'bcryptjs'; // Import bcryptjs

const router = express.Router();

const admin = {
  email: "admin@workshop.com",
  password: "admin123", // This password will be compared directly for admin
};

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }
    // Password hashing is now handled by the pre-save hook in the Student model
    const newStudent = new Student({ name, email, password });
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Failed to register student." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Admin login
  if (email === admin.email && password === admin.password && role === "admin") {
    return res.json({
      user: { email: admin.email, role: "admin" },
      message: "Admin login successful",
    });
  }

  try {
    const student = await Student.findOne({ email }); // Find student by email
    if (!student) {
      return res.status(401).json({
        message: "Invalid credentials. Please register first or check your password.",
      });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials. Please register first or check your password.",
      });
    }

    // Student login
    if (role === "student") {
      return res.json({
        user: { email: student.email, role: "student", _id: student._id, name: student.name },
        message: "Student login successful",
      });
    } else {
      return res.status(401).json({ message: "Invalid role for student login." });
    }
  } catch (error) {
    console.error("Error logging in student:", error);
    res.status(500).json({ message: "Failed to login student." });
  }
});

export default router;