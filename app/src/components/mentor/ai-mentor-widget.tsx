"use client";

import * as React from "react";
import { Bot, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AIMentorWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "היי! אני המנטור שלך באקדמיה. אני כאן לעזור לך לחשוב, לא לפתור בשבילך — שאל אותי כל דבר על השיעור הנוכחי.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            typeof data.content === "string" && data.content
              ? data.content
              : "לא התקבלה תשובה. נסה שוב.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "משהו השתבש בחיבור למנטור. נסה שוב." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 font-semibold">
              <Bot size={18} className="text-primary" /> AI Mentor
            </div>
            <button onClick={() => setOpen(false)} aria-label="סגור">
              <X size={16} />
            </button>
          </div>
          <div
            className="flex-1 space-y-3 overflow-y-auto p-3 text-sm"
            role="log"
            aria-live="polite"
            aria-label="שיחה עם המנטור"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2",
                  m.role === "assistant"
                    ? "bg-background"
                    : "mr-auto bg-primary text-primary-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-muted" role="status">
                המנטור חושב…
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="שאל את המנטור…"
              aria-label="שאלה למנטור"
              className="flex-1 rounded-lg bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              onClick={send}
              className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              aria-label="שלח"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-105"
        aria-label={open ? "סגור את המנטור" : "פתח את המנטור"}
        aria-expanded={open}
      >
        <Bot size={24} />
      </button>
    </div>
  );
}
