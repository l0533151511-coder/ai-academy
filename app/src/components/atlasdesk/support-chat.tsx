"use client";

import * as React from "react";
import { Send, Loader2, Code2, Bot, User } from "lucide-react";
import { ATLASDESK_SYSTEM_PROMPT } from "@/lib/atlasdesk/config";
import { estimateCallCost } from "@/lib/simulators/pricing";

interface Msg {
  role: "user" | "assistant";
  content: string;
  usage?: { inputTokens: number; outputTokens: number };
}

/**
 * מנוע השיחה של AtlasDesk — הרכיב הראשון בפלטפורמה המסחרית המתמשכת.
 * מודולים עתידיים (Tool Calling, RAG, Agents) יעטפו/ירחיבו רכיב זה, לא יחליפו אותו מאפס.
 */
export function SupportChat() {
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: "assistant",
      content: "שלום! אני נציג התמיכה של AtlasDesk. איך אפשר לעזור לך היום?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [devMode, setDevMode] = React.useState(false);

  const totalCost = messages.reduce(
    (sum, m) => sum + (m.usage ? estimateCallCost(m.usage.inputTokens, m.usage.outputTokens) : 0),
    0
  );

  async function send() {
    if (!input.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: ATLASDESK_SYSTEM_PROMPT,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.content, usage: data.usage }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "שגיאת רשת — נסה שוב." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[70vh] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 font-bold">
          <Bot size={18} className="text-primary" /> AtlasDesk Support
        </div>
        <button
          onClick={() => setDevMode((d) => !d)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
            devMode ? "border-primary bg-primary/10 text-primary" : "border-border text-muted"
          }`}
        >
          <Code2 size={12} /> מצב מפתח
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-background">
              {m.role === "user" ? <User size={14} /> : <Bot size={14} className="text-primary" />}
            </span>
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              {devMode && m.usage && (
                <p className="mt-1 border-t border-border/30 pt-1 text-[10px] opacity-70">
                  {m.usage.inputTokens}+{m.usage.outputTokens} טוקנים · $
                  {estimateCallCost(m.usage.inputTokens, m.usage.outputTokens).toFixed(5)}
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-muted">AtlasDesk מקליד...</div>}
      </div>

      {devMode && (
        <div className="border-t border-border bg-background/50 px-4 py-1.5 text-xs text-muted">
          עלות שיחה מצטברת: ${totalCost.toFixed(5)}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="כתוב הודעה..."
          className="flex-1 rounded-lg bg-background px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={send}
          disabled={loading}
          className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
          aria-label="שלח"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
