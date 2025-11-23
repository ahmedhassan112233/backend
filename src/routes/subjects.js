import express from "express";
import Subject from "../models/Subject.js";
import { authRequired, adminRequired } from "../middleware/auth.js";

const router = express.Router();

// GET /subjects
router.get("/", authRequired, async (req, res) => {
  const subjects = await Subject.find().sort({ createdAt: -1 });
  res.json({ subjects });
});

// POST /subjects (admin)
router.post("/", authRequired, adminRequired, async (req, res) => {
  try {
    const { name, code, level, description } = req.body;
    const subject = await Subject.create({ name, code, level, description });
    res.json({ subject });
  } catch (err) {
    console.error("create subject error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
