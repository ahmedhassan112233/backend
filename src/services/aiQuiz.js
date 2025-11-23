import { aiRequest } from "../utils/openRouterClient.js";

export async function generateQuiz(topic) {
  const system = `
    انت مولد اسئلة MCQ للطلاب.
    أرجع JSON فقط بدون أي نص زائد.
    كل عنصر يجب ان يكون بهذه الصيغة:
    {"question":"...","choices":["A","B","C","D"],"correctIndex":0}
  `;

  const raw = await aiRequest(system, `أنشئ 5 أسئلة عن: ${topic}`);

  return raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}
