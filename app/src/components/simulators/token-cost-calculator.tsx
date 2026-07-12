"use client";

import * as React from "react";
import { estimateRealTokenCount } from "@/lib/simulators/tokenizer";
import { CLAUDE_MODELS as MODELS } from "@/lib/simulators/pricing";

/** Token Cost Calculator — רכיב כללי לשימוש חוזר בכל שיעור שנוגע בעלויות API. */
export function TokenCostCalculator() {
  const [prompt, setPrompt] = React.useState(
    "אתה עוזר AI מקצועי. ענה על שאלות המשתמש בעברית בצורה ברורה ומדויקת."
  );
  const [expectedOutputTokens, setExpectedOutputTokens] = React.useState(500);
  const [requestsPerDay, setRequestsPerDay] = React.useState(1000);
  const [modelId, setModelId] = React.useState("sonnet");

  const model = MODELS.find((m) => m.id === modelId)!;
  const inputTokens = estimateRealTokenCount(prompt);

  const costPerRequest =
    (inputTokens / 1_000_000) * model.inputPer1M + (expectedOutputTokens / 1_000_000) * model.outputPer1M;
  const costPerDay = costPerRequest * requestsPerDay;
  const costPerMonth = costPerDay * 30;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-muted">Prompt לדוגמה</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-background p-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted">~{inputTokens} טוקני קלט מוערכים</p>
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">מודל</label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">טוקני פלט צפויים</label>
          <input
            type="number"
            value={expectedOutputTokens}
            onChange={(e) => setExpectedOutputTokens(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">בקשות ליום</label>
          <input
            type="number"
            value={requestsPerDay}
            onChange={(e) => setRequestsPerDay(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-background p-3">
          <div className="text-lg font-extrabold text-primary">${costPerRequest.toFixed(4)}</div>
          <div className="text-xs text-muted">לכל בקשה</div>
        </div>
        <div className="rounded-xl bg-background p-3">
          <div className="text-lg font-extrabold text-primary">${costPerDay.toFixed(2)}</div>
          <div className="text-xs text-muted">ליום</div>
        </div>
        <div className="rounded-xl bg-background p-3">
          <div className="text-lg font-extrabold text-primary">${costPerMonth.toFixed(0)}</div>
          <div className="text-xs text-muted">לחודש</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        מחירים לצורך הדגמה בלבד (מבנה תמחור אמיתי) — בדוק תמיד את התמחור העדכני באתר Anthropic הרשמי
        לפני תכנון תקציב אמיתי.
      </p>
    </div>
  );
}
