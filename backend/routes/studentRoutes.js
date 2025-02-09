import authMiddleware from '../middleware/authMiddleware.js'
import express from 'express'
import User from '../models/User.js'

const router = express.Router();

router.put("/complete-profile", authMiddleware, async (req, res) => {
  const { fullName, department, cpi } = req.body;
  const userId = req.user.id;
  
  try {
    const user = await User.findById(userId);
    
    if (!user || user.role !== "student") {
      return res.status(400).json({ message: "Student not found" });
    }
    
    if (user.filledDetails) {
      return res.status(400).json({ message: "Profile already completed" });
    }
    
    // Update user details
    user.fullName = fullName;
    user.department = department;
    user.cpi = cpi;
    user.filledDetails = true;
    
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/leaderboard", authMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: "student", filledDetails: true })
      .select("fullName department cpi")
      .sort({ cpi: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, department, cpi } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    user.fullName = fullName;
    user.department = department;
    user.cpi = cpi;
    user.filledDetails = true;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
