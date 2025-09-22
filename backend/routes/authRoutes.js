import express from 'express';
import Student from '../models/student.js';
import bcrypt from 'bcryptjs'; // Import bcryptjs

const router = express.Router();

// It's highly insecure to store passwords in plaintext.
// You should store a hash of the admin password.
// Generate a hash for your admin password using a script:
// console.log(require('bcryptjs').hashSync('your-secure-password', 10));
// I've generated a hash for the password "123" for you.
const admin = {
  email: "admin@123",
  // This is the bcrypt hash for the password "123"
  password: "$2a$10$zFr5Mo82qu0YQzIHAteOtejb89imE5.E4JH0UzCNT3LmkNDGVS3tO",
};

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingStudent = await Student.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this email or phone number already registered" });
    }
    // Password hashing is now handled by the pre-save hook in the Student model
    const newStudent = new Student({ name, email, password, mobile: phoneNumber });
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
  if ((!email) || !password || !role) {
    return res.status(400).json({ message: "Email/Mobile, password, and role are required" });
  }

  // Admin login check
  if (role === "admin") {
    if (email === admin.email) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        return res.json({
          user: { email: admin.email, role: "admin" },
          message: "Admin login successful",
        });
      }
    }
    // Generic message for admin to prevent email enumeration
    return res.status(401).json({
      message: "Invalid admin credentials.",
    });
  }

  // Student login
  if (role === "student") {
    try {
      const student = await Student.findOne({ $or: [{ email: email }, { mobile: email }] }); // Find student by email or mobile
      if (!student) {
        return res.status(401).json({
          message: "Invalid credentials. Please check your email/mobile and password.",
        });
      }

      // Compare provided password with hashed password
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials. Please check your email/mobile and password.",
        });
      }

      return res.json({
        user: { email: student.email, role: "student", _id: student._id, name: student.name, mobile: student.mobile },
        message: "Student login successful",
      });
    } catch (error) {
      console.error("Error logging in student:", error);
      return res.status(500).json({ message: "Failed to login student." });
    }
  }

  return res.status(400).json({ message: "Invalid role specified." });
});

export default router;
