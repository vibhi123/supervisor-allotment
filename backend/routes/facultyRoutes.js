import express from "express";
// import { updateFacultyDetails } from "../controllers/faculty.controller";
import Faculty from "../models/Faculty.Model.js";

const router = express.Router();

router.get("/showAll", async (req, res) => {
    try {
        const facultyData = await Faculty.find({}, {
            fullName: 1,
            designation: 1,
            numberOfStudent: 1,
            interest: 1,
            areaOfResearch: 1,
            _id: 1
        });

        res.status(200).json(facultyData);
    } catch (error) {
        console.error("Error retrieving faculty summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/name/:id", async (req, res) => {
    try {
        // console.log(req.params.id);
        const faculty = await Faculty.findById(req.params.id)
        .select("fullName");
        if (!faculty) return res.status(404).json({ message: "Faculty not found" });
        res.status(200).json(faculty);
    } catch (error) {
        console.error("Error fetching faculty:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) return res.status(404).json({ message: "Faculty not found" });
        res.status(200).json(faculty);
    } catch (error) {
        console.error("Error fetching faculty:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/update", async (req, res) => {
    console.log("hehe");
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required to update faculty details." });
        }

        const updatedData = {
            ...req.body
        };

        delete updatedData.email;

        const updatedFaculty = await Faculty.findOneAndUpdate(
            { email },
            { $set: updatedData },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            message: "Faculty details updated successfully.",
            faculty: updatedFaculty
        });
    } catch (error) {
        console.error("Error updating faculty details:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;
