import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subjects.js";
import lectureRoutes from "./routes/lectures.js";
import assignmentRoutes from "./routes/assignments.js";
import quizRoutes from "./routes/quizzes.js";
import helperSolutionRoutes from "./routes/helperSolutions.js";
import requestRoutes from "./routes/requests.js";
import notificationRoutes from "./routes/notifications.js";
import aiRoutes from "./routes/ai.js";

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

// Rate limit for auth & ai
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40
});

app.use("/api/auth", limiter);
app.use("/api/ai", limiter);

// static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(`/${uploadDir}`, express.static(path.join(__dirname, "..", uploadDir)));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/helper-solutions", helperSolutionRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Delta University V12 backend running" });
});

export default app;
