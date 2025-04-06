import Faculty from "../models/Faculty.Model";

export const getFacultyOverview = async (req, res) => {
    try {
        const facultyList = await Faculty.find({}, {
            fullName: 1,
            designation: 1,
            numberOfStudent: 1,
            interest: 1,
            areaOfResearch: 1
        });

        res.status(200).json(facultyList);
    } catch (error) {
        console.error("Error fetching faculty overview:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const getAllFacultySummary = async (req, res) => {
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
        console.error("Error retrieving all faculty details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};