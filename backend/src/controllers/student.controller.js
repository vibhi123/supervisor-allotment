import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import Student from "../models/student.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import Team from "../models/team.model.js";


const generateAccessAndRefereshTokens = async (studentId) => {
    try {
        const student = await Student.findById(studentId)
        const accessToken = student.generateAccessToken()
        const refreshToken = student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerStudent = asyncHandler(async (req, res) => {
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

    const profileImageLocalPath = req.files?.profileImage[0]?.path;

    if (!profileImageLocalPath) {
        throw new ApiError(400, "Profile image is required");
    }

    const profileImage = await uploadOnCloudinary(profileImageLocalPath);

    if (!profileImage) {
        throw new ApiError(500, "Profile Image upload failed");
    }

    const student = await Student.create({
        registrationNumber,
        email,
        password,
        fullName,
        course,
        cpi,
        profileImage: profileImage.url,
        filledDetails: (course == "MCA")
    });

    const createdStudent = await Student.findById(student._id).select("-password -refreshToken");

    if (!createdStudent) {
        throw new ApiError(500, "Something went wrong while registering the student");
    }

    return res.status(201).json(
        new ApiResponse(200, createdStudent, "Student registered successfully")
    );
});

const loginStudent = asyncHandler(async (req, res) => {

    const { registrationNumber, password } = req.body
    // console.log(registrationNumber);

    if (!registrationNumber) {
        throw new ApiError(400, "registration number is required")
    }

    const student = await Student.findOne({ registrationNumber })

    if (!student) {
        throw new ApiError(404, "Student does not exist")
    }

    const isPasswordValid = await student.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid student credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(student._id)

    const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken")

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
                    user: loggedInStudent, accessToken, refreshToken
                },
                "Student logged In Successfully"
            )
        )
})

const logoutStudent = asyncHandler(async (req, res) => {
    await Student.findByIdAndUpdate(
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
        .json(new ApiResponse(200, {}, "Student logged Out"))
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

        const student = await Student.findById(decodedToken?._id)

        if (!student) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== student?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(student._id)

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



    const student = await Student.findById(req.user?._id)
    const isPasswordCorrect = await student.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    student.password = newPassword
    await student.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentStudent = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const completeStudentProfile = asyncHandler(async (req, res) => {

    const {
        branch,
        dateOfBirth,
        gateScore,
        interest,
        gender,
    } = req.body;

    const gateScoreCardLocalPath = req.files?.gateScoreCard[0]?.path;

    if (!gateScoreCardLocalPath) {
        throw new ApiError(400, "GATE Score Card is required")
    }

    const gateScoreCard = await uploadOnCloudinary(gateScoreCardLocalPath)

    if (!gateScoreCard) {
        throw new ApiError(500, "Score Card upload failed")
    }

    const areasOfResearch = Array.isArray(req.body.areasOfResearch)
        ? req.body.areasOfResearch
        : req.body.areasOfResearch?.split(',') || [];

    const student = await Student.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                branch: branch,
                dateOfBirth: dateOfBirth,
                gateScore: parseInt(gateScore),
                interest: interest,
                gender: gender,
                areasOfResearch: areasOfResearch,
                filledDetails: true,
                gateScoreCard: gateScoreCard.url
            }
        },
        { new: true }

    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, student, "Profile Completed successfully"))
});

const submitPreferences = asyncHandler(async (req, res) => {

    const { preferenceIds } = req.body;
    // console.log(preferenceIds);

    // console.log(req.body);

    const student = await Student.findByIdAndUpdate(
        req.user?._id,
        {
            facultyPreferences: preferenceIds,
            filledPreferences: true,
        },
        { new: true }

    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, student, "Preferences filled successfully"))
});

const getAllMCAStudent = asyncHandler(async (req, res) => {
    const MCAStudentData = await Student.find({ course: "MCA" }, {
        registrationNumber: 1,
        email: 1,
        fullName: 1,
        course: 1,
        cpi: 1,
        profileImage: 1,
        rank: 1,
        isVerified: 1
        // team: 1
    }).sort({ rank: 1, fullName: 1 });

    return res.status(200)
        .json(new ApiResponse(
            200,
            MCAStudentData,
            "All MCA student data fetched successfully."
        ));
});

const getAllMCAStudentReg = asyncHandler(async (req, res) => {
    const MCAStudentData = await Student.find({ course: "MCA" }, {
        registrationNumber: 1,
        email: 1,
        fullName: 1,
        course: 1,
        cpi: 1,
        profileImage: 1,
        rank: 1,
        // team: 1
    }).sort({ fullName: 1 });

    return res.status(200)
        .json(new ApiResponse(
            200,
            MCAStudentData,
            "All MCA student data fetched successfully."
        ));
});

const getAllMCAStudentVerify = asyncHandler(async (req, res) => {
    const MCAStudentData = await Student.find({ course: "MCA" }, {
        registrationNumber: 1,
        email: 1,
        fullName: 1,
        course: 1,
        cpi: 1,
        profileImage: 1,
        rank: 1,
        isVerified: 1
        // team: 1
    }).sort({ isVerified: 1, fullName: 1 });

    return res.status(200)
        .json(new ApiResponse(
            200,
            MCAStudentData,
            "All MCA student data fetched successfully."
        ));
});

const getAllMTechStudent = asyncHandler(async (req, res) => {
    // console.log("Here");
    
    const MTechStudentData = await Student
    .find({ course: "M.Tech." })
    .select("-password -facultyPreferences -refreshToken")
    .sort({ rank: 1, registrationNumber: 1 })
    .populate({
        path: 'supervisor',
        select: 'fullName'
    });
    // console.log(MTechStudentData);
    

    return res.status(200)
        .json(new ApiResponse(
            200,
            MTechStudentData,
            "All MTech student data fetched successfully."
        ));
});

const getAllMTechStudentReg = asyncHandler(async (req, res) => {
    // console.log("Here");
    
    const MTechStudentData = await Student
    .find({ course: "M.Tech." })
    .select("-password -facultyPreferences -refreshToken")
    .sort({ registrationNumber: 1 })
    .populate({
        path: 'supervisor',
        select: 'fullName'
    });
    // console.log(MTechStudentData);
    

    return res.status(200)
        .json(new ApiResponse(
            200,
            MTechStudentData,
            "All MTech student data fetched successfully."
        ));
});

const getAllMTechStudentVerify = asyncHandler(async (req, res) => {
    // console.log("Here");
    
    const MTechStudentData = await Student
    .find({ course: "M.Tech." })
    .select("-password -facultyPreferences -refreshToken")
    .sort({ isVerified: 1, registrationNumber: 1 })
    .populate({
        path: 'supervisor',
        select: 'fullName'
    });
    // console.log(MTechStudentData);
    

    return res.status(200)
        .json(new ApiResponse(
            200,
            MTechStudentData,
            "All MTech student data fetched successfully."
        ));
});

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
            select: 'teamNumber',
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

export {
    registerStudent,
    loginStudent,
    logoutStudent,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentStudent,
    completeStudentProfile,
    submitPreferences,
    getAllMCAStudent,
    getAllMCAStudentVerify,
    getAllMCAStudentReg,
    getAllMTechStudent,
    getAllMTechStudentVerify,
    getAllMTechStudentReg,
    getStudentProfile
}