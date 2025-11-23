import { aiRequest } from "../utils/openRouterClient.js";

export async function explainTopic(topic) {
  return aiRequest(
    "اشرح هذا الموضوع للطلاب بشكل سهل وخطوة بخطوة:",
    topic
  );
}
