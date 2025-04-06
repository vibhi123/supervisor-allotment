import User from "../models/userModel.js";

export const generateRankList = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      filledDetails: true,
    }).select(
      "registrationNumber fullName cpi gateScore dateOfBirth gender"
    );

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found with filled details.",
      });
    }


    const sortedStudents = students.sort((a, b) => {
      // 1. check cpi
      if (b.cpi !== a.cpi) return b.cpi - a.cpi;

      // 2. check gate score
      if (b.gateScore !== a.gateScore) return b.gateScore - a.gateScore;

      // 3. check dob (older has higher preference)
      const dateA = new Date(a.dateOfBirth);
      const dateB = new Date(b.dateOfBirth);
      if (dateA !== dateB) return dateA - dateB;

      // 4. check Gender (female before male)
    //   if (a.gender !== b.gender) return a.gender === "female" ? -1 : 1;

      return 0;
    });

    
    const rankList = sortedStudents.map((student, index) => ({
      rank: index + 1,
      registrationNumber: student.registrationNumber,
      fullName: student.fullName,
      cpi: student.cpi,
      gateScore: student.gateScore,
      dateOfBirth: student.dateOfBirth.toISOString().split("T")[0],
      gender: student.gender,
    }));


    return res.status(200).json({
      message: "Rank list generated successfully",
      rankList,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error generating rank list",
      error: err.message,
    });
  }
};
