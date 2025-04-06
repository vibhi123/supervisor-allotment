import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

const router = express.Router();

router.get("/students", async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Admins only." });
    // }
    
    const students = await User.find({ role: "student" })
    .select("-password")
    // .sort({ registrationNumber: 1 });
    .sort({ cpi: -1, gateScore: -1 });
    
    // console.log(students);
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/add-student", async (req, res) => {
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

router.put("/verify/:regNo", async (req, res) => {
  try {
    // Uncomment this if you want to restrict to admin users
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const regNo = req.params.regNo;
    const student = await User.findOne({ registrationNumber: regNo });
    if (!student) {
      return res.status(404).json({ message: "Registration number not found" });
    }

    student.isVerified = true;
    await student.save();

    res.json({ message: "Student verified successfully" });
  } catch (error) {
    console.error("Error verifying student:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/reject/:regNo", async (req, res) => {
  try {
    // Uncomment this if you want to restrict to admin users
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const regNo = req.params.regNo;
    const student = await User.findOne({ registrationNumber: regNo });
    if (!student) {
      return res.status(404).json({ message: "Registration number not found" });
    }

    student.filledDetails = false;
    await student.save();

    res.json({ message: "Student verified successfully" });
  } catch (error) {
    console.error("Error verifying student:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
