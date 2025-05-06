import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        default: "Admin"
    },
    email: {
        type: String,
        unique: [true, "email already used."],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    role: {
        type: String,
        default: "Admin"
    },
    MCARankGenerated: {
        type: Boolean,
        default: false
    },
    MCATeamsCreated: {
        type: Boolean,
        default: false
    },
    MCAFacultyAllotted: {
        type: Boolean,
        default: false
    },
    MTechRankGenerated: {
        type: Boolean,
        default: false
    },
    MTechFacultyAllotted: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true});

adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: "Admin"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
adminSchema.methods.generateRefreshToken = function(){
    // console.log("here");
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

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;