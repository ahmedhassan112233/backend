import express from "express";
import HelperSolution from "../models/HelperSolution.js";
import { authRequired, adminRequired } from "../middleware/auth.js";
import { upload } from "../config/upload.js";

const router = express.Router();

// POST /helper-solutions
router.post("/", authRequired, upload.single("file"), async (req, res) => {
  try {
    const { subjectId, assignmentId, lectureId, text } = req.body;
    const fileUrl = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : null;
    const solution = await HelperSolution.create({
      studentId: req.user._id,
      subjectId,
      assignmentId,
      lectureId,
      text,
      fileUrl,
      approved: false
    });
    res.json({ solution });
  } catch (err) {
    console.error("create helper solution error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /helper-solutions/subject/:id
router.get("/subject/:id", authRequired, async (req, res) => {
  const subjectId = req.params.id;
  const solutions = await HelperSolution.find({ subjectId, approved: true }).sort({ createdAt: -1 });
  res.json({ solutions });
});

// GET /helper-solutions/pending (admin)
router.get("/pending", authRequired, adminRequired, async (req, res) => {
  const solutions = await HelperSolution.find({ approved: false }).sort({ createdAt: 1 });
  res.json({ solutions });
});

// POST /helper-solutions/approve/:id (admin)
router.post("/approve/:id", authRequired, adminRequired, async (req, res) => {
  const solution = await HelperSolution.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );
  res.json({ solution });
});

export default router;
