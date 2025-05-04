import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const facultySchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, "email already used."],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    fullName: {
        type: String
    },
    designation: {
        type: String,
        enum: ["Professor", "Assosiate Professor", "Assistant Professor", "Admin"]
    },
    filledPreferences: {
        type: Boolean,
        default: false
    },
    numberOfStudent: {
        type: Number,
        default: 1
    },
    interest: {
        type: String,
        enum: ["Research", "Internship", "Any"],
        default: "Any"
    },
    areaOfResearch: [
        {
            type: String
        }
    ],
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    role: {
        type: String,
        default: "Faculty"
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true});

facultySchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

facultySchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

facultySchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            role: "Faculty"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
facultySchema.methods.generateRefreshToken = function(){
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

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;