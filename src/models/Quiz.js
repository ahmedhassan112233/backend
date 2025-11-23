import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    choices: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    questions: [questionSchema],
    type: { type: String, enum: ["manual", "ai"], default: "manual" }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
