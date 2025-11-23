import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["lecture", "summary", "sheet", "resource"],
      default: "lecture"
    },
    fileUrl: { type: String },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Lecture", lectureSchema);
