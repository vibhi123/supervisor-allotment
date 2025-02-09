import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

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

export default router;
