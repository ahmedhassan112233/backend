import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [{ type: Number }],
    score: { type: Number }
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);
