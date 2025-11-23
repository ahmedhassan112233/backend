import { aiRequest } from "../utils/openRouterClient.js";

export async function summarizeText(text) {
  return aiRequest(
    "لخص النص التالي للطلاب بشكل دقيق ومنسق:",
    text
  );
}
