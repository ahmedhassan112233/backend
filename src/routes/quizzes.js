import express from "express";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import { authRequired, adminRequired } from "../middleware/auth.js";
import { openRouterJson } from "../utils/openRouterClient.js";

const router = express.Router();

// ==========================
// 1) إنشاء كويز يدوي Manual
// ==========================
router.post("/manual", authRequired, adminRequired, async (req, res) => {
  try {
    const { title, subjectId, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      subjectId,
      questions,
      type: "manual"
    });

    res.json({ quiz });
  } catch (err) {
    console.error("Manual quiz error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 2) إنشاء كويز عبر الذكاء الاصطناعي AI
// ==========================
router.post("/ai", authRequired, adminRequired, async (req, res) => {
  try {
    const { title, subjectId, topic } = req.body;

    const systemPrompt = `
      انت مولد اسئلة MCQ للطلاب. أرجع JSON فقط.
      بدون كلام إضافي.
      كل عنصر يجب ان يكون بالصيغة التالية:
      {"question":"...","choices":["A","B","C","D"],"correctIndex":0}
    `;

    const userPrompt = `أنشئ 5 أسئلة عن: ${topic}`;

    const json = await openRouterJson({
      systemPrompt,
      userPrompt
    });

    let questions = [];
    try {
      questions = JSON.parse(json);
    } catch (e) {
      console.error("AI JSON parse error:", e, json);
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    const quiz = await Quiz.create({
      title,
      subjectId,
      questions,
      type: "ai"
    });

    res.json({ quiz });
  } catch (err) {
    console.error("Create AI quiz error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 3) جلب كل كويزات مادة معينة
// ==========================
router.get("/:subjectId", authRequired, async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      subjectId: req.params.subjectId
    }).sort({ createdAt: -1 });

    res.json({ quizzes });
  } catch (err) {
    console.error("Get quizzes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 4) حل الكويز - Attempt
// ==========================
router.post("/:id/attempt", authRequired, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const answers = req.body.answers || [];
    let score = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score++;
    });

    const percentage =
      quiz.questions.length > 0 ? (score / quiz.questions.length) * 100 : 0;

    const attempt = await QuizAttempt.create({
      studentId: req.user._id,
      quizId: quiz._id,
      answers,
      score: percentage
    });

    res.json({ attempt });
  } catch (err) {
    console.error("Attempt error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 5) جلب نتائج الكويز - للأدمن
// ==========================
router.get("/:id/results", authRequired, adminRequired, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      quizId: req.params.id
    }).sort({ createdAt: -1 });

    res.json({ attempts });
  } catch (err) {
    console.error("Get results error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
