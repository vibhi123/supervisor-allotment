import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, "email already used."],
        required: [true, "email is required"],
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
        enum: ["Professor", "Assosiate Professor", "Assistant Professor"]
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
        enum: ["Research", "Internship", "Any"]
    },
    areaOfResearch: [
        {
            type: String
        }
    ],
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }]
}, {timestamps: true});

const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);

export default Faculty;