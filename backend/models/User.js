import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  registrationNumber: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty", "admin"], required: true },
  fullName: { type: String },
  department: { type: String },
  cpi: { type: Number, default: 0 },
  filledDetails: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;