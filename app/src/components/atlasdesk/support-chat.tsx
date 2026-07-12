"use client";

import * as React from "react";
import { Send, Loader2, Code2, Bot, User, Trash2 } from "lucide-react";
import { ATLASDESK_SYSTEM_PROMPT, ATLASDESK_TOOL_SYSTEM_PROMPT } from "@/lib/atlasdesk/config";
import { estimateCallCost } from "@/lib/simulators/pricing";

interface ToolLogEntry {
  tool: string;
  input: Record<string, unknown>;
  result: string;
}

interface SourceEntry {
  title: string;
  similarity: number;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  usage?: { inputTokens: number; outputTokens: number };
  toolLog?: ToolLogEntry[];
  sources?: SourceEntry[];
}

type ChatMode = "plain" | "tools" | "rag";

const MODE_ENDPOINT: Record<ChatMode, string> = {
  plain: "/api/ai/chat",
  tools: "/api/ai/tool-chat",
  rag: "/api/ai/rag-chat",
};

const STORAGE_KEY = "atlasdesk:conversation:v1";
const WELCOME_MSG: Msg = {
  role: "assistant",
  content: "שלום! אני נציג התמיכה של AtlasDesk. איך אפשר לעזור לך היום?",
};

/**
 * מנוע השיחה של AtlasDesk — הרכיב הראשון בפלטפורמה המסחרית המתמשכת.
 * מודולים עתידיים (Tool Calling, RAG, Agents) יעטפו/ירחיבו רכיב זה, לא יחליפו אותו מאפס.
 *
 * שיחה נשמרת ב-localStorage (מודול 6.2 — תכנון וארכיטקטורה): רענון דף לא מוחק את ההיסטוריה.
 * חוזה הנתונים (Msg[]) הוגדר לפני המימוש, architecture-first, בדיוק כפי שהשיעור מלמד.
 */
export function SupportChat() {
  const [messages, setMessages] = React.useState<Msg[]>([WELCOME_MSG]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [devMode, setDevMode] = React.useState(false);
  const [mode, setMode] = React.useState<ChatMode>("plain");

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Msg[];
        if (Array.isArray(saved) && saved.length > 0) setMessages(saved);
      }
    } catch {
      /* התעלמות מקאש פגום — פשוט מתחילים משיחה חדשה */
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  function clearConversation() {
    setMessages([WELCOME_MSG]);
    window.localStorage.removeItem(STORAGE_KEY);
  }

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
      const res = await fetch(MODE_ENDPOINT[mode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: mode === "tools" ? ATLASDESK_TOOL_SYSTEM_PROMPT : ATLASDESK_SYSTEM_PROMPT,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.content,
          usage: data.usage,
          toolLog: data.toolLog,
          sources: data.sources,
        },
      ]);
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode((m) => (m === "tools" ? "plain" : "tools"))}
            title="מפעיל כלי 'בדוק סטטוס פנייה' אמיתי (נסה: AD-1042, AD-2087, AD-3311)"
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              mode === "tools" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted"
            }`}
          >
            🔧 כלים מחוברים
          </button>
          <button
            onClick={() => setMode((m) => (m === "rag" ? "plain" : "rag"))}
            title="מפעיל RAG אמיתי — תשובות מבוססות מאמרי העזרה של AtlasDesk"
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              mode === "rag" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted"
            }`}
          >
            📚 RAG מופעל
          </button>
          <button
            onClick={() => setDevMode((d) => !d)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
              devMode ? "border-primary bg-primary/10 text-primary" : "border-border text-muted"
            }`}
          >
            <Code2 size={12} /> מצב מפתח
          </button>
          <button
            onClick={clearConversation}
            title="נקה שיחה"
            className="rounded-full border border-border p-1.5 text-muted transition hover:border-danger hover:text-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
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
              {devMode && m.toolLog && m.toolLog.length > 0 && (
                <div className="mt-1.5 space-y-1 border-t border-border/30 pt-1.5">
                  {m.toolLog.map((t, ti) => (
                    <p key={ti} className="rounded bg-warning/10 px-1.5 py-1 text-[10px] text-warning">
                      🔧 {t.tool}({JSON.stringify(t.input)}) → {t.result}
                    </p>
                  ))}
                </div>
              )}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-1.5 space-y-1 border-t border-border/30 pt-1.5">
                  <p className="text-[10px] font-semibold opacity-70">📚 מקורות:</p>
                  {m.sources.map((s, si) => (
                    <p key={si} className="text-[10px] opacity-70">
                      {s.title} {devMode && `(similarity: ${s.similarity.toFixed(2)})`}
                    </p>
                  ))}
                </div>
              )}
              {Array.isArray(m.sources) && m.sources.length === 0 && (
                <p className="mt-1.5 border-t border-border/30 pt-1.5 text-[10px] italic opacity-60">
                  לא נמצאו מאמרי עזרה רלוונטיים — התשובה לא מבוססת על מקור
                </p>
              )}
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
