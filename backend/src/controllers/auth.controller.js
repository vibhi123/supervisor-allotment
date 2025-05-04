import Admin from "../models/admin.model.js";
import Faculty from "../models/faculty.model.js";
import Student from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const generateAccessAndRefereshTokens = async (userId, userType) => {
    try {
        let user;

        switch (userType) {
            case "Admin":
                user = await Admin.findById(userId);
                break;
            case "Faculty":
                user = await Faculty.findById(userId);
                break;
            case "Student":
                user = await Student.findById(userId);
                break;
            default:
                throw new ApiError(400, "Invalid user type");
        }
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        // console.log(accessToken);
        // console.log(refreshToken);
        
        return { accessToken, refreshToken };
        
    } catch (error) {
        console.log(error);
        
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};


const loginUser = asyncHandler(async (req, res) => {
    const { email, registrationNumber, password } = req.body;
    
    // console.log(req.body);
    if (!registrationNumber && !email) {
        throw new ApiError(400, "Registration number or email is required");
    }

    let user = null;
    let userType = "";

    if (email) {
        user = await Admin.findOne({ email });
        if (user) userType = "Admin";
    }

    if (!user && email) {
        user = await Faculty.findOne({ email });
        if (user) userType = "Faculty";
    }

    if (!user) {
        user = await Student.findOne({
            $or: [
                ...(email ? [{ email }] : []),
                ...(registrationNumber ? [{ registrationNumber }] : [])
            ]
        });
        if (user) userType = "Student";
    }

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id, userType); 

    const loggedInUser = await (userType === "Admin" ? Admin :
                                userType === "Faculty" ? Faculty : Student)
                                .findById(user._id)
                                .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});


const logoutUser = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;

    let Model;

    switch (role) {
        case "Admin":
            Model = Admin;
            break;
        case "Faculty":
            Model = Faculty;
            break;
        case "Student":
            Model = Student;
            break;
        default:
            throw new ApiError(400, "Invalid user role");
    }

    await Model.findByIdAndUpdate(
        _id,
        {
            $unset: {
                refreshToken: 1 // remove refreshToken field
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

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

        const { _id, role } = decodedToken;

        let Model;

        switch (role) {
            case "Admin":
                Model = Admin;
                break;
            case "Faculty":
                Model = Faculty;
                break;
            case "Student":
                Model = Student;
                break;
            default:
                throw new ApiError(400, "Invalid user role");
        }
    
        const user = await Model.findById(_id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export {
    loginUser,
    logoutUser,
    refreshAccessToken
}