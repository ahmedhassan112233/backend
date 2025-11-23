import mongoose from "mongoose";

const helperSolutionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
    fileUrl: { type: String },
    text: { type: String },
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("HelperSolution", helperSolutionSchema);
