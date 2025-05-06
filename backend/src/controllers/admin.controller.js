import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import Team from "../models/team.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { preAllotFaculty } from "../../public/tempCode/preAllotFaculty.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    // console.log("email: ", email);

    if (
        [email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedAdmin = await Admin.findOne({ email })

    if (existedAdmin) {
        throw new ApiError(409, "Admin already registered")
    }

    const admin = await Admin.create({
        email,
        password,
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin")
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered Successfully")
    )

})

const loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    // console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const admin = await Admin.findOne({ email })

    if (!admin) {
        throw new ApiError(404, "Admin does not exist")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInAdmin, accessToken, refreshToken
                },
                "Admin logged In Successfully"
            )
        )
})

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const admin = await Admin.findById(decodedToken?._id)

        if (!admin) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== admin?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(admin._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const admin = await Admin.findById(req.user?._id)
    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    admin.password = newPassword
    await admin.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const generateRankMCA = asyncHandler(async (req, res) => {
    const MCAStudents = await Student.find({ course: "MCA" }, { cpi: 1, fullName: 1, rank: 1 });

    MCAStudents.sort((a, b) => {
        if (b.cpi !== a.cpi) return b.cpi - a.cpi;
        return a.fullName - b.fullName;
    });
    // console.log(MCAStudents);

    // Assign ranks
    for (let i = 0; i < MCAStudents.length; i++) {
        MCAStudents[i].rank = i + 1;
        await MCAStudents[i].save();
    }

    const admin = await Admin.findById(req.user?._id)

    admin.MCARankGenerated = true
    await admin.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Rank Assigned to MCA Students"
            )
        )
})

const generateRankMTech = asyncHandler(async (req, res) => {
    const MTechStudents = await Student.find({ course: "M.Tech." }, { cpi: 1, gateScore: 1, dateOfBirth: 1, rank: 1 });

    MTechStudents.sort((a, b) => {
        if (b.cpi !== a.cpi) return b.cpi - a.cpi;
        if (b.gateScore !== a.gateScore) return b.gateScore - a.gateScore;
        return new Date(b.dateOfBirth) - new Date(a.dateOfBirth);
    });
    // console.log(MTechStudents);

    // Assign ranks
    for (let i = 0; i < MTechStudents.length; i++) {
        MTechStudents[i].rank = i + 1;
        await MTechStudents[i].save();
    }

    const admin = await Admin.findById(req.user?._id)

    admin.MTechRankGenerated = true
    await admin.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Rank Assigned to M.Tech. Students"
            )
        )
})

const allotFacultyMTech = asyncHandler(async (req, res) => {
    preAllotFaculty();

    const faculties = await Faculty.find({}, { student: 1, numberOfStudent: 1 });
    const facultyMap = new Map();
    faculties.forEach(faculty => {
        faculty.student = faculty.student || [];
        facultyMap.set(faculty._id.toString(), faculty);
    });

    const students = await Student.find({ course: "M.Tech.", supervisor: [] }, { facultyPreferences: 1, supervisor: 1, rank: 1 }).sort({ rank: 1 });

    for (const student of students) {
        for (const prefId of student.facultyPreferences) {
            const faculty = facultyMap.get(prefId.toString());

            if (
                faculty &&
                faculty.student.length < faculty.numberOfStudent
            ) {
                student.supervisor.push(faculty._id);
                await student.save();

                faculty.student.push(student._id);
                break;
            }
        }
    }

    for (const faculty of facultyMap.values()) {
        await faculty.save();
    }

    const admin = await Admin.findById(req.user?._id)

    admin.MTechFacultyAllotted = true
    await admin.save()

    console.log('Allotment completed.');
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Supervisor Alloted to M.Tech. Students"
            )
        )
})

const getStudentProfile = asyncHandler(async (req, res) => {
    const registrationNumber = req.params.registrationNumber;
    // console.log(registrationNumber);

    const student = await Student
        .findOne({ registrationNumber })
        .select("-password -refreshToken")
        .populate({
            path: 'facultyPreferences',
            select: 'fullName'
        })
        .populate({
            path: 'supervisor',
            select: 'fullName'
        })
        .populate({
            path: 'team',
            select: 'teamNumber filledPreferences',
            populate: [
                {
                    path: 'members',
                    select: 'fullName registrationNumber'
                },
                {
                    path: 'supervisor',
                    select: 'fullName'
                }
            ]
        });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                student,
                "Student found."
            )
        );
});

const verifyStudent = asyncHandler(async (req, res) => {
    
    const registrationNumber = req.params.registrationNumber;
    const isVerified = req.body.isVerified;
    // console.log(registrationNumber);

    const student = await Student
        .findOne({ registrationNumber })
        .select("-password -refreshToken");

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    if(isVerified) {
        student.isVerified = true;
    } else {
        student.filledDetails = false;
        student.filledPreferences = false;
    }

    await student.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                (isVerified) ? "Verified" : "Rejected"
            )
        );
})

const createTeams = asyncHandler(async (course) => {
    const totalFaculty = await Faculty.countDocuments();
    for (let index = 0; index < totalFaculty; index++) {
        const team = await Team.create({
            teamNumber: index + 1,
            members: [],
            course: course
        });
        console.log('Inserted:', team.teamNumber);
    }
    console.log("Teams created successfully!");
})

const createTeamsMCA = asyncHandler(async (req, res) => {
    let totalTeams = await Team.countDocuments();
    if (totalTeams === 0) {
        await createTeams("MCA");
    }

    const totalFaculty = await Faculty.countDocuments();
    const Teams = await Team.find({ course: "MCA" }).sort({ teamNumber: 1 });
    const Students = await Student.find({ course: "MCA" }).select("rank registrationNumber").sort({ rank: 1 });

    for (const student of Students) {
        const teamNum = (student.rank - 1) % totalFaculty;
        await Student.findByIdAndUpdate(
            student._id,
            { team: Teams[teamNum]._id },
            { new: true }
        );
        console.log(student.registrationNumber, ": Success");

        Teams[teamNum].members.push(student._id);
    }

    for (const team of Teams) {
        await team.save();
        console.log("Team: ", team.teamNumber, " : Success");
    }

    const admin = await Admin.findById(req.user?._id)

    admin.MCATeamsCreated = true
    await admin.save()

    console.log("MCA Teams created.");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "MCA Teams created."
            )
        );
});

const getAllMCATeams = asyncHandler(async (req, res) => {
    // console.log("HEHE");

    const MCATeams = await Team
        .find({ course: "MCA" })
        .sort({ teamNumber: 1 })
        .populate({
            path: 'members',
            select: 'fullName'
        })
        .populate({
            path: 'supervisor',
            select: 'fullName'
        });

    return res.status(200)
        .json(new ApiResponse(
            200,
            MCATeams,
            "All MCA student data fetched successfully."
        ));
})

const getMCATeam = asyncHandler(async (req, res) => {
    const teamNumber = req.params.teamNumber;
    const MCATeam = await Team
        .findOne({ course: "MCA", teamNumber: teamNumber })
        .populate({
            path: 'members',
            select: 'fullName registrationNumber'
        })
        .populate({
            path: 'supervisor',
            select: 'fullName'
        })
        .populate({
            path: 'facultyPreferences',
            select: 'fullName'
        });

    // console.log(MCATeam);


    return res.status(200)
        .json(new ApiResponse(
            200,
            MCATeam,
            "MCA Team fetched successfully"
        ));
})

const allotFacultyMCA = asyncHandler(async (req, res) => {
    const faculties = await Faculty.find({}, { team: 1, fullName: 1 });
    const facultyMap = new Map();
    faculties.forEach(faculty => {
        facultyMap.set(faculty._id.toString(), faculty);
    });

    const teams = await Team.find({ supervisor: null }, { facultyPreferences: 1 }).sort({ teamNumber: 1 });

    for (const team of teams) {
        for (const prefId of team.facultyPreferences) {
            const faculty = facultyMap.get(prefId.toString());

            if (faculty && !faculty.team) {
                team.supervisor = faculty._id;
                await team.save();

                faculty.team = team._id;
                console.log(team.teamNumber, faculty.fullName);

                break;
            }
        }
    }

    for (const faculty of facultyMap.values()) {
        await faculty.save();
    }

    const admin = await Admin.findById(req.user?._id)

    admin.MCAFacultyAllotted = true
    await admin.save()

    console.log('MCA Team Allotment completed.');
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Supervisor Alloted to MCA Teams"
            )
        );
});

const getFaculty = asyncHandler(async (req, res) => {
    const facultyId = req.params.id;
    const faculty = await Faculty
        .findById({ facultyId })
        .select("-password -refreshToken")
        .populate({
            path: 'student',
            select: 'fullName registrationNumber'
        })
        .populate({
            path: 'team',
            select: 'teamNumber',
            populate: [
                {
                    path: 'members',
                    select: 'fullName registrationNumber'
                }
            ]
        })

    return res.status(200)
        .json(new ApiResponse(
            200,
            faculty,
            "Faculty data fetched successfully."
        ));
})

const getAllFaculty = asyncHandler(async (req, res) => {
    const facultyData = await Faculty
        .find({})
        .select("-password -refreshToken")
        .populate({
            path: 'student',
            select: 'fullName registrationNumber'
        })
        .populate({
            path: 'team',
            select: 'teamNumber',
            populate: [
                {
                    path: 'members',
                    select: 'fullName registrationNumber'
                }
            ]
        })

    return res.status(200)
        .json(new ApiResponse(
            200,
            facultyData,
            "All faculty data fetched successfully."
        ));
});

const addStudent = asyncHandler(async (req, res) => {
    const { registrationNumber, password, email, fullName, course, cpi } = req.body;

    if (
        [registrationNumber, password, email, fullName, course, cpi].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedStudent = await Student.findOne({ registrationNumber });

    if (existedStudent) {
        throw new ApiError(409, "Student already registered");
    }

    const profileImageurl = "https://res.cloudinary.com/dpkdwu7fl/image/upload/v1746004613/ugk1oopbdd6yozkno5mv.png";

    const student = await Student.create({
        registrationNumber,
        email,
        password,
        fullName,
        course,
        cpi,
        profileImage: profileImageurl,
        filledDetails: (course == "MCA")
    });

    const createdStudent = await Student.findById(student._id).select("-password -refreshToken");

    if (!createdStudent) {
        throw new ApiError(500, "Something went wrong while registering the student");
    }

    return res.status(201).json(
        new ApiResponse(200, createdStudent, "Student registered successfully")
    );
})

const addFaculty = asyncHandler(async (req, res) => {
    const { email, password, fullName, designation, numberOfStudent, interest, areaOfResearch } = req.body
    // console.log("email: ", email);

    const existedFaculty = await Faculty.findOne({ email })

    if (existedFaculty) {
        throw new ApiError(409, "Faculty already registered")
    }

    const faculty = await Faculty.create({
        email,
        password,
        fullName,
        designation,
        numberOfStudent,
        interest,
        areaOfResearch
    })

    const createdFaculty = await Faculty.findById(faculty._id).select(
        "-password -refreshToken"
    )

    if (!createdFaculty) {
        throw new ApiError(500, "Something went wrong while registering the faculty")
    }

    return res.status(201).json(
        new ApiResponse(200, createdFaculty, "Faculty registered Successfully")
    )
})

const addAdmin = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body
    // console.log("email: ", email);
    const currAdmin = req.user;

    if (
        [email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedAdmin = await Admin.findOne({ email })

    if (existedAdmin) {
        throw new ApiError(409, "Admin already registered")
    }

    const admin = await Admin.create({
        email,
        password,
        fullName: fullName || "Admin",
        MCARankGenerated : currAdmin.MCARankGenerated,
        MCATeamsCreated: currAdmin.MCATeamsCreated,
        MCAFacultyAllotted: currAdmin.MCAFacultyAllotted,
        MTechRankGenerated: currAdmin.MTechRankGenerated,
        MTechFacultyAllotted: currAdmin.MTechFacultyAllotted
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin")
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered Successfully")
    )
})

const updateFacultyDetails = asyncHandler(async (req, res) => {
    const id = req.params.facultyId;
    const {
        designation,
        numberOfStudent,
        interest,
        areaOfResearch
    } = req.body;

    if (!designation || !numberOfStudent || !interest || !areaOfResearch) {
        throw new ApiError(400, "All fields are required");
    }

    const faculty = await Faculty.findById(id);
    if (!faculty) {
        throw new ApiError(404, "Faculty not found");
    }

    faculty.designation = designation;
    faculty.numberOfStudent = numberOfStudent;
    faculty.interest = interest;
    faculty.areaOfResearch = Array.isArray(areaOfResearch)
        ? areaOfResearch
        : areaOfResearch.split(',').map((item) => item.trim());

    await faculty.save();

    return res.status(200).json(
        new ApiResponse(200, faculty, "Faculty details updated successfully")
    );
});

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentAdmin,
    generateRankMCA,
    generateRankMTech,
    allotFacultyMTech,
    getStudentProfile,
    verifyStudent,
    createTeamsMCA,
    getAllMCATeams,
    getMCATeam,
    allotFacultyMCA,
    getAllFaculty,
    getFaculty,
    addStudent,
    addFaculty,
    addAdmin,
    updateFacultyDetails
    // getUserChannelProfile,
    // getWatchHistory
}