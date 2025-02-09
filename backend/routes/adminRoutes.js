import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

const router = express.Router();

router.get("/students", authMiddleware, async (req, res) => {
  try {
    console.log(req.user.role);
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const students = await User.find({ role: "student", filledDetails: true })
      .select("-password")
      .sort({ registrationNumber: 1 });

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/add-student", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const { registrationNumber, password } = req.body;
    
    if (!registrationNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await User.findOne({ registrationNumber });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    
    const newStudent = new User({
      registrationNumber,
      password: hashedPassword,
      role: "student",
    });
    
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
