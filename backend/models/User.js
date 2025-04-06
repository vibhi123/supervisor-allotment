import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  registrationNumber: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], required: true },
  fullName: { type: String },
  branch: { type: String },
  cpi: { type: Number, default: 0 },
  filledDetails: { type: Boolean, default: false },
  filledPreferences: { type: Boolean, default: false },
  rank: { type: Number, default: 0 },
  facultyPreferences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty"
  }],
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty"
  },
  dateOfBirth: { type: Date },
  gateScore: { type: Number, min: 0, max: 1000 },
  interest: { type: String, enum: ["Research", "Internship"] },
  gender: { type: String, enum: ["Male", "Female"] },
  areaOfResearch: [{ type: String }],
  photo: { type: String },
  isVerified: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;