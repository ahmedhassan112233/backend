import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    avatarUrl: { type: String },
    level: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
