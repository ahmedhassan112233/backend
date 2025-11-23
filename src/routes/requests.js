import express from "express";
import Request from "../models/Request.js";
import { authRequired, adminRequired } from "../middleware/auth.js";

const router = express.Router();

// POST /requests
router.post("/", authRequired, async (req, res) => {
  try {
    const { type, message } = req.body;
    const request = await Request.create({
      studentId: req.user._id,
      type,
      message
    });
    res.json({ request });
  } catch (err) {
    console.error("create request error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /requests (admin)
router.get("/", authRequired, adminRequired, async (req, res) => {
  const requests = await Request.find().sort({ createdAt: -1 }).populate("studentId", "name email");
  res.json({ requests });
});

// POST /requests/:id/reply
router.post("/:id/reply", authRequired, adminRequired, async (req, res) => {
  const { adminReply } = req.body;
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { adminReply },
    { new: true }
  );
  res.json({ request });
});

// POST /requests/:id/approve
router.post("/:id/approve", authRequired, adminRequired, async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json({ request });
});

// POST /requests/:id/reject
router.post("/:id/reject", authRequired, adminRequired, async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json({ request });
});

export default router;
