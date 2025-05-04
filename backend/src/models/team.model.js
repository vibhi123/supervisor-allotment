import mongoose from "mongoose";
import Student from "./student.model.js";

const teamSchema = new mongoose.Schema({
    teamNumber: {
        type: Number,
        default: 0,
        index: true,
    },
    course: {
        type: String,
        enum: ["MCA", "M.Tech."]
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Student
    }],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Student
    },
    filledPreferences: {
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
    },
    role: {
        type: String,
        default: "Team"
    },
}, {timestamps: true});

const Team = mongoose.model("Team", teamSchema);

export default Team;