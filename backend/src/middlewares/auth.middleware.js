import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import Admin from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyJWT = asyncHandler(async(req, res) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodedToken);

        if(decodedToken.role == "Student") {
            const user = await Student.findById(decodedToken?._id).select("-password -refreshToken");
            if(!user) {
                throw new ApiError(401, "Invalid Access Token (S)");
            }
            // console.log(student);
            
            return res
            .status(200)
            .json(new ApiResponse(
                200,
                user,
                "User fetched successfully"
            ))
            // next();
        } else if(decodedToken.role == "Faculty") {
            const user = await Faculty.findById(decodedToken?._id).select("-password -refreshToken");
            if(!user) {
                throw new ApiError(401, "Invalid Access Token (F)");
            }
            return res
            .status(200)
            .json(new ApiResponse(
                200,
                user,
                "User fetched successfully"
            ))
            // next();
        } else if(decodedToken.role == "Admin") {
            const user = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
            if(!user) {
                throw new ApiError(401, "Invalid Access Token (A)");
            }
            return res
            .status(200)
            .json(new ApiResponse(
                200,
                user,
                "User fetched successfully"
            ))
        } else {
            throw new ApiError(401, "Invalid role!");
        }
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})