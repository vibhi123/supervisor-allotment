import Faculty from "../models/faculty.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async (facultyId) => {
    try {
        const faculty = await Faculty.findById(facultyId)
        const accessToken = faculty.generateAccessToken()
        const refreshToken = faculty.generateRefreshToken()

        faculty.refreshToken = refreshToken
        await faculty.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerFaculty = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    // console.log("email: ", email);

    if (
        [email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedFaculty = await Faculty.findOne({ email })

    if (existedFaculty) {
        throw new ApiError(409, "Faculty already registered")
    }

    const faculty = await Faculty.create({
        email,
        password,
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

const loginFaculty = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    // console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const faculty = await Faculty.findOne({ email })

    if (!faculty) {
        throw new ApiError(404, "Faculty does not exist")
    }

    const isPasswordValid = await faculty.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid faculty credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(faculty._id)

    const loggedInFaculty = await Faculty.findById(faculty._id).select("-password -refreshToken")

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
                    user: loggedInFaculty, accessToken, refreshToken
                },
                "Faculty logged In Successfully"
            )
        )
})

const logoutFaculty = asyncHandler(async (req, res) => {
    await Faculty.findByIdAndUpdate(
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
        .json(new ApiResponse(200, {}, "Faculty logged Out"))
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

        const faculty = await Faculty.findById(decodedToken?._id)

        if (!faculty) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== faculty?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(faculty._id)

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



    const faculty = await Faculty.findById(req.user?._id)
    const isPasswordCorrect = await faculty.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    faculty.password = newPassword
    await faculty.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentFaculty = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const completeFacultyProfile = asyncHandler(async (req, res) => {

    const {
        fullName,
        designation,
        numberOfStudent,
        interest,
        areaOfResearch,
    } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                designation: designation,
                numberOfStudent: parseInt(numberOfStudent),
                interest: interest,
                areaOfResearch: areaOfResearch
            }
        },
        { new: true }

    ).select("-password -refreshToken")
    
    return res
        .status(200)
        .json(new ApiResponse(200, faculty, "Faculty details updated successfully"))
});

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

export {
    registerFaculty,
    loginFaculty,
    logoutFaculty,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentFaculty,
    completeFacultyProfile,
    getAllFaculty,
    // getUserChannelProfile,
    // getWatchHistory
}