import { aiRequest } from "../utils/openRouterClient.js";

export async function analyzeContent(text) {
  return aiRequest(
    "حلّل هذا المحتوى للطلاب وقدم معلومات مهمة:",
    text
  );
}
