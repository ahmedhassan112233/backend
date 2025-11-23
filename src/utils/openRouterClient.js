// src/utils/openRouterClient.js
import fetch from "node-fetch";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // موديل خفيف وقوي

// للردود العادية (نص)
export async function callOpenRouter({ systemPrompt, userPrompt }) {
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("OpenRouter error:", data);
      throw new Error("OpenRouter request failed");
    }

    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("AI error:", err);
    throw new Error("AI error");
  }
}

// للردود اللي راجعة JSON (زي أسئلة الكويز)
export async function openRouterJson({ systemPrompt, userPrompt }) {
  const raw = await callOpenRouter({ systemPrompt, userPrompt });

  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return cleaned;
}
