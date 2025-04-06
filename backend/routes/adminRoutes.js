import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import Faculty from "../models/Faculty.Model.js";

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
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const regNo = req.params.regNo;
    const student = await User.findOne({ registrationNumber: regNo });
    if (!student) {
      return res.status(404).json({ message: "Registration number not found" });
    }

    student.filledDetails = false;
    student.filledPreferences = false;
    await student.save();

    res.json({ message: "Student verified successfully" });
  } catch (error) {
    console.error("Error verifying student:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/update-rank", async (req, res) => {
    try {
      const students = await User.find({role: "student"});

      students.sort((a, b) => {
        if (b.cpi !== a.cpi) return b.cpi - a.cpi;
        if (b.gateScore !== a.gateScore) return b.gateScore - a.gateScore;
        return new Date(b.dob) - new Date(a.dob);
      });
      // console.log(students);

      // Assign ranks
      // for (let i = 0; i < students.length; i++) {
      //   students[i].rank = i + 1;
      //   await students[i].save(); // Save updated rank
      // }

      res.status(200).json(students);
      // console.log("Ranking updated successfully.");
    } catch (err) {
      console.error("Error ranking students:", err);
    }
});

router.get("/allot-faculty", async (req, res) => {
  try {
    const faculties = await Faculty.find({});
    const facultyMap = new Map();
    faculties.forEach(faculty => {
      faculty.student = faculty.student || [];
      facultyMap.set(faculty._id.toString(), faculty);
    });

    const students = await User.find({role: "student", filledPreferences: true}).sort({ rank: 1 });

    for (const student of students) {
      for (const prefId of student.facultyPreferences) {
        const faculty = facultyMap.get(prefId.toString());

        if (
          faculty &&
          faculty.student.length < faculty.numberOfStudent
        ) {
          // Assign student to faculty
          student.supervisor = faculty._id;
          await student.save();

          // Update faculty's list
          faculty.student.push(student._id);
          break; // move to next student
        }
      }
    }

    // Save all faculties
    for (const faculty of facultyMap.values()) {
      await faculty.save();
    }

    console.log('Allotment completed.');
  } catch (error) {
    console.error('Error during allotment:', error);
  }
});

router.get('/allotment', async (req, res) => {
  try {
    const students = await User.find({})
      .sort({ rank: 1 })
      .populate('supervisor', 'fullName');

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data.' });
  }
});

export default router;
