import express from "express";
import Assignment from "../models/Assignment.js";
import AssignmentSolution from "../models/AssignmentSolution.js";
import { authRequired, adminRequired } from "../middleware/auth.js";
import { upload } from "../config/upload.js";

const router = express.Router();

// POST /assignments/:subjectId (admin)
router.post("/:subjectId", authRequired, adminRequired, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const subjectId = req.params.subjectId;
    const assignment = await Assignment.create({
      title,
      description,
      subjectId,
      dueDate
    });
    res.json({ assignment });
  } catch (err) {
    console.error("create assignment error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /assignments/subject/:id
router.get("/subject/:id", authRequired, async (req, res) => {
  const subjectId = req.params.id;
  const assignments = await Assignment.find({ subjectId }).sort({ createdAt: -1 });
  res.json({ assignments });
});

// POST /assignments/:id/submit
router.post("/:id/submit", authRequired, upload.single("file"), async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const textAnswer = req.body.textAnswer;
    const fileUrl = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : null;
    let solution = await AssignmentSolution.findOne({
      assignmentId,
      studentId: req.user._id
    });
    if (!solution) {
      solution = await AssignmentSolution.create({
        assignmentId,
        studentId: req.user._id,
        textAnswer,
        fileUrl
      });
    } else {
      solution.textAnswer = textAnswer || solution.textAnswer;
      solution.fileUrl = fileUrl || solution.fileUrl;
      solution.status = "pending";
      await solution.save();
    }
    res.json({ solution });
  } catch (err) {
    console.error("submit assignment error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /assignments/:id/my-submission
router.get("/:id/my-submission", authRequired, async (req, res) => {
  const assignmentId = req.params.id;
  const solution = await AssignmentSolution.findOne({
    assignmentId,
    studentId: req.user._id
  });
  res.json({ solution });
});

export default router;
