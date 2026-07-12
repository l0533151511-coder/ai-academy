// מחירון לדוגמה (למטרות הוראה) — בדוק תמיד את התמחור העדכני באתר Anthropic הרשמי לפני תכנון תקציב אמיתי.
export const CLAUDE_MODELS = [
  { id: "haiku", name: "Claude Haiku (מהיר וזול)", inputPer1M: 0.8, outputPer1M: 4 },
  { id: "sonnet", name: "Claude Sonnet (מאוזן)", inputPer1M: 3, outputPer1M: 15 },
  { id: "opus", name: "Claude Opus (החזק ביותר)", inputPer1M: 15, outputPer1M: 75 },
] as const;

export function estimateCallCost(
  inputTokens: number,
  outputTokens: number,
  modelId: (typeof CLAUDE_MODELS)[number]["id"] = "sonnet"
): number {
  const model = CLAUDE_MODELS.find((m) => m.id === modelId) ?? CLAUDE_MODELS[1];
  return (inputTokens / 1_000_000) * model.inputPer1M + (outputTokens / 1_000_000) * model.outputPer1M;
}
