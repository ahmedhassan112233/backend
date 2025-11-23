import express from "express";
import Lecture from "../models/Lecture.js";
import { authRequired, adminRequired } from "../middleware/auth.js";
import { upload } from "../config/upload.js";

const router = express.Router();

// POST /lectures/upload
router.post("/upload", authRequired, upload.single("file"), async (req, res) => {
  try {
    const { title, type, subjectId } = req.body;
    const fileUrl = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : null;
    const lecture = await Lecture.create({
      title,
      type,
      subjectId,
      fileUrl,
      uploadedBy: req.user._id,
      approved: req.user.role === "admin" // auto-approve if admin
    });
    res.json({ lecture });
  } catch (err) {
    console.error("upload lecture error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /lectures/subject/:id
router.get("/subject/:id", authRequired, async (req, res) => {
  const subjectId = req.params.id;
  const lectures = await Lecture.find({ subjectId, approved: true }).sort({ createdAt: -1 });
  res.json({ lectures });
});

// GET /lectures/pending (admin)
router.get("/pending", authRequired, adminRequired, async (req, res) => {
  const lectures = await Lecture.find({ approved: false }).sort({ createdAt: 1 });
  res.json({ lectures });
});

// POST /lectures/approve/:id (admin)
router.post("/approve/:id", authRequired, adminRequired, async (req, res) => {
  const lecture = await Lecture.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );
  res.json({ lecture });
});

export default router;
