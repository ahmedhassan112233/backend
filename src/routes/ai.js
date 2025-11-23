// src/routes/ai.js
import express from "express";
import { authRequired } from "../middleware/auth.js";
import { callOpenRouter, openRouterJson } from "../utils/openRouterClient.js";

const router = express.Router();

/**
 * POST /ai/chat
 * دردشة عادية مع المساعد
 */
router.post("/chat", authRequired, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const reply = await callOpenRouter({
      systemPrompt:
        "أنت مساعد ذكي لطلاب الجامعة. جاوب بالعربية بشكل واضح ومختصر، واستخدم مصطلحات إنجليزية تقنية عند الحاجة.",
      userPrompt: message
    });

    res.json({ reply });
  } catch (err) {
    console.error("ai chat error:", err);
    res.status(500).json({ message: "AI error" });
  }
});

/**
 * POST /ai/summarize
 * تلخيص نص
 * body: { text }
 */
router.post("/summarize", authRequired, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const summary = await callOpenRouter({
      systemPrompt:
        "أنت متخصص في تلخيص النصوص الجامعية. لخص النص التالي في نقاط واضحة ومختصرة بالعربية:",
      userPrompt: text
    });

    res.json({ summary });
  } catch (err) {
    console.error("ai summarize error:", err);
    res.status(500).json({ message: "AI error" });
  }
});

/**
 * POST /ai/explain
 * شرح موضوع
 * body: { text }
 */
router.post("/explain", authRequired, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const explanation = await callOpenRouter({
      systemPrompt:
        "اشرح هذا المحتوى لطلاب الجامعة بأسلوب بسيط، وبالعربية، مع أمثلة ونقاط خطوة بخطوة:",
      userPrompt: text
    });

    res.json({ explanation });
  } catch (err) {
    console.error("ai explain error:", err);
    res.status(500).json({ message: "AI error" });
  }
});

/**
 * POST /ai/quiz
 * توليد أسئلة كويز (MCQ) فقط بدون تخزين
 * body: { topic }
 */
router.post("/quiz", authRequired, async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "topic is required" });
    }

    const systemPrompt = `
      انت مولّد أسئلة MCQ لطلاب الجامعة.
      أرجع ONLY JSON بدون أي نص زائد.
      كل عنصر يجب أن يكون بالصورة التالية:
      {"question":"...","choices":["A","B","C","D"],"correctIndex":0}
    `;

    const userPrompt = `أنشئ 5 أسئلة اختيار من متعدد عن: ${topic}`;

    const jsonText = await openRouterJson({
      systemPrompt,
      userPrompt
    });

    let questions = [];
    try {
      questions = JSON.parse(jsonText);
    } catch (e) {
      console.error("ai quiz parse error:", e, jsonText);
      return res
        .status(500)
        .json({ message: "AI returned invalid JSON", raw: jsonText });
    }

    res.json({ questions });
  } catch (err) {
    console.error("ai quiz error:", err);
    res.status(500).json({ message: "AI error" });
  }
});

/**
 * POST /ai/analyze-upload
 * تحليل نص مستخرج من ملف (PDF / صورة / Word)
 * body: { text }
 */
router.post("/analyze-upload", authRequired, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const analysis = await callOpenRouter({
      systemPrompt: `
        أنت أداة تحليل لمحتوى المحاضرات الجامعية.
        المطلوب:
        - استخراج أهم النقاط.
        - تلخيص المحتوى.
        - اقتراح أسئلة امتحان محتملة.
        - توضيح أي مفاهيم صعبة.
        أجب بالعربية بشكل منظم وبنقاط.
      `,
      userPrompt: text
    });

    res.json({ analysis });
  } catch (err) {
    console.error("ai analyze-upload error:", err);
    res.status(500).json({ message: "AI error" });
  }
});

export default router;
