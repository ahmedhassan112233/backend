import express from "express";
import Notification from "../models/Notification.js";
import { authRequired, adminRequired } from "../middleware/auth.js";

const router = express.Router();

// GET /notifications
router.get("/", authRequired, async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ notifications });
});

// POST /notifications/read/:id
router.post("/read/:id", authRequired, async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { seen: true },
    { new: true }
  );
  res.json({ notification });
});

// POST /notifications/read-all
router.post("/read-all", authRequired, async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, seen: false },
    { $set: { seen: true } }
  );
  res.json({ success: true });
});

// POST /notifications/send (admin)
router.post("/send", authRequired, adminRequired, async (req, res) => {
  try {
    const { userId, title, body } = req.body;
    const notification = await Notification.create({ userId, title, body });
    res.json({ notification });
  } catch (err) {
    console.error("send notification error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
