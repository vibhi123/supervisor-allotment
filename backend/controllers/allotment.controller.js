import User from "../models/userModel.js";
import mongoose from "mongoose";

export const allotProfessors = async (req, res) => {
  try {
    // Start a session for transactional consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    // Step 1: Fetch students who filled preferences but haven't been allotted
    const students = await User.find({
      role: "student",
      filledPreferences: true,
      allottedFaculty: { $exists: false }
    });

    // Step 2: Fetch faculties with their current capacities
    const faculties = await User.find({ role: "faculty" });

    // Create a mapping of facultyId -> faculty object
    const facultyMap = {};
    faculties.forEach((faculty) => {
      facultyMap[faculty._id.toString()] = faculty;
    });

    // Step 3: Iterate through each student's preferences
    for (let student of students) {
      const { preferences } = student;

      // Try to allot faculty based on preferences
      let isAllotted = false;
      for (let facultyId of preferences) {
        const faculty = facultyMap[facultyId.toString()];

        // Check if faculty exists and has capacity
        if (
          faculty &&
          (faculty.allocatedStudents?.length || 0) < faculty.facultyCapacity
        ) {
          // Allot this faculty to the student
          student.allottedFaculty = faculty._id;
          await student.save({ session });

          // Update faculty's allocated students
          faculty.allocatedStudents = faculty.allocatedStudents || [];
          faculty.allocatedStudents.push(student._id);
          await faculty.save({ session });

          console.log(
            `Student ${student.registrationNumber} allotted to Faculty ${faculty.fullName}`
          );
          isAllotted = true;
          break; // Break after successful allotment
        }
      }

      if (!isAllotted) {
        console.log(
          `No faculty with capacity found for Student ${student.registrationNumber}`
        );
      }
    }

    // Step 4: Commit the transaction if all goes well
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Allotment process completed successfully",
    });
  } catch (err) {
    // Abort transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({
      message: "Error during faculty allotment",
      error: err.message,
    });
  }
};
