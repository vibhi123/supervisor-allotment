import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    branch: {
        type: String
    },
    cpi: {
        type: Number,
        default: 0
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
    areaOfResearch: [
        {
            type: String
        }
    ],
    photo: {
        type: String
    },
    gateScoreCard: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    facultyPreferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }
}, {timestamps: true});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;