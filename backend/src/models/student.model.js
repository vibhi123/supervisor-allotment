import jwt from "jsonwebtoken";
import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcrypt";

const studentSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        index: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true, 
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    course: {
        type: String,
        enum: ["M.Tech.", "MCA"]
    },
    cpi: {
        type: Number,
        default: 0.0
    },
    profileImage: {
        type: String
    },
    branch: {
        type: String,
        enum: ["Computer Science", "Information Security", "Artificial Intelligence and Data Science"]
    },
    filledDetails: {
        type: Boolean,
        default: false
    },
    filledPreferences: {
        type: Boolean,
        default: false
    },
    dateOfBirth: {
        type: Date
    },
    gateScore: {
        type: Number,
        min: 0,
        max: 1000
    },
    interest: {
        type: String,
        enum: ["Research", "Internship"]
    },
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    areasOfResearch: [
        {
            type: String
        }
    ],
    gateScoreCard: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rank: {
        type: Number,
        default: 0
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    facultyPreferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }],
    supervisor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }],
    role: {
        type: String,
        default: "Student"
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true});

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            registrationNumber: this.registrationNumber,
            fullName: this.fullName,
            role: "Student"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const Student = mongoose.model("Student", studentSchema);

export default Student;