import ollama from "ollama";

export const generateAIHours = async (signals) => {
  const prompt = `
Respond ONLY in valid JSON.

TASK:
Estimate productive work hours.

INPUT:
${JSON.stringify(signals)}

RULES:
- ai_hours_suggested: number (0–8)
- reasoning: one short sentence
- confidence: number (0–1)
- No extra text outside JSON
  `;

  const response = await ollama.generate({
    model: "llama3.2:1b",
    prompt,
    options: { temperature: 0.2, num_predict: 200 }
  });

  const raw = response.response.trim();
  const match = raw.match(/\{[\s\S]*\}/);

  if (!match) {
    return safeFallback(signals);
  }

  let json = {};
  try {
    json = JSON.parse(match[0]);
  } catch {
    return safeFallback(signals);
  }

  // FIX 1: ai_hours_suggested must be a valid number
  if (typeof json.ai_hours_suggested !== "number" || isNaN(json.ai_hours_suggested)) {
    json.ai_hours_suggested = signals.attendance_hours * (signals.allocation_percentage / 100);
  }

  // FIX 2: clamp hours
  json.ai_hours_suggested = Math.max(0, Math.min(8, json.ai_hours_suggested));

  // FIX 3: Reasoning must exist
  if (!json.reasoning || typeof json.reasoning !== "string") {
    json.reasoning = "Estimated based on available activity signals.";
  }

  // FIX 4: Clamp confidence 0–1
  if (typeof json.confidence !== "number" || isNaN(json.confidence)) {
    json.confidence = 0.5;
  }
  json.confidence = Math.max(0, Math.min(1, json.confidence));

  return json;
};

function safeFallback(signals) {
  return {
    ai_hours_suggested: Math.max(
      0,
      Math.min(8, signals.attendance_hours * (signals.allocation_percentage / 100))
    ),
    reasoning: "Fallback due to invalid AI output.",
    confidence: 0.5
  };
}