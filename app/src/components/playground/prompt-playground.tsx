"use client";

import * as React from "react";
import { Play, Loader2, DollarSign } from "lucide-react";
import { CLAUDE_MODELS } from "@/lib/simulators/pricing";
import { estimateCallCost } from "@/lib/simulators/pricing";

export interface PromptPlaygroundProps {
  /** מוצג ככותרת קטנה מעל המעבדה — מאפשר להתאים את ההקשר לכל שיעור. */
  label?: string;
  defaultSystemPrompt?: string;
  defaultUserMessage?: string;
  /** האם לאפשר לתלמיד לערוך את ה-system prompt (בחלק מהשיעורים נועל אותו כדי למקד בנושא אחר). */
  editableSystemPrompt?: boolean;
  defaultModel?: (typeof CLAUDE_MODELS)[number]["id"];
}

/**
 * Prompt Playground — רכיב כללי לשימוש חוזר בכל שיעורי הנדסת ה-Prompt וה-AI.
 * מבצע קריאה אמיתית ל-Claude API (דרך /api/ai/chat) ומציג עלות/טוקנים אמיתיים מהתשובה,
 * לא הערכה — כדי לחבר תיאוריה (שיעורי טוקניזציה/עלויות) לפרקטיקה.
 */
export function PromptPlayground({
  label = "Prompt Playground",
  defaultSystemPrompt = "",
  defaultUserMessage = "",
  editableSystemPrompt = true,
  defaultModel = "sonnet",
}: PromptPlaygroundProps) {
  const [systemPrompt, setSystemPrompt] = React.useState(defaultSystemPrompt);
  const [userMessage, setUserMessage] = React.useState(defaultUserMessage);
  const [modelId, setModelId] = React.useState(defaultModel);
  const [response, setResponse] = React.useState<string | null>(null);
  const [usage, setUsage] = React.useState<{ inputTokens: number; outputTokens: number } | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [connected, setConnected] = React.useState(true);

  async function run() {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt || undefined,
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.content !== "string") {
        setResponse("שגיאה בקריאה ל-API. נסה שוב.");
        setUsage(null); // מונע הצגת עלות מיושנת מריצה קודמת
        return;
      }
      setResponse(data.content);
      setUsage(data.usage ?? null);
      setConnected(data.connected !== false);
    } catch (e) {
      setResponse(`שגיאת רשת: ${(e as Error).message}`);
      setUsage(null);
    } finally {
      setLoading(false);
    }
  }

  const cost = usage ? estimateCallCost(usage.inputTokens, usage.outputTokens, modelId) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 text-xs font-semibold text-muted">{label}</p>

      {editableSystemPrompt && (
        <div className="mb-3">
          <label className="mb-1 block text-xs font-semibold text-muted">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={3}
            placeholder="הגדר את התפקיד/הטון/הכללים של ה-AI..."
            className="w-full rounded-lg border border-border bg-background p-2 text-sm"
          />
        </div>
      )}

      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-muted">הודעת משתמש</label>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background p-2 text-sm"
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select
          value={modelId}
          onChange={(e) => setModelId(e.target.value as typeof modelId)}
          aria-label="בחירת מודל"
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
        >
          {CLAUDE_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <button
          onClick={run}
          disabled={loading || !userMessage.trim()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} הרץ
        </button>
      </div>

      {response && (
        <div className="rounded-lg bg-background p-3 text-sm">
          <p className="whitespace-pre-wrap">{response}</p>
          {usage && cost !== null && connected && (
            <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 text-xs text-muted">
              <DollarSign size={12} />
              {usage.inputTokens} טוקני קלט + {usage.outputTokens} טוקני פלט (אמיתי) · עלות משוערת: $
              {cost.toFixed(5)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
