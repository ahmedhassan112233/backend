import mongoose from "mongoose";

const assignmentSolutionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    fileUrl: { type: String },
    textAnswer: { type: String },
    grade: { type: Number },
    feedback: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("AssignmentSolution", assignmentSolutionSchema);
