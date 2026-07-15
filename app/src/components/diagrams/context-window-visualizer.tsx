"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, AlertTriangle } from "lucide-react";
import { estimateRealTokenCount } from "@/lib/simulators/tokenizer";

interface Msg {
  id: number;
  role: "user" | "assistant";
  text: string;
  tokens: number;
}

const COLORS = { user: "#5b5bf6", assistant: "#22d3ee" };

/** Context Window Visualizer — ממחיש מילוי חלון הקשר וגלישה (truncation) כשעוברים את המגבלה. */
export function ContextWindowVisualizer({ windowLimit = 300 }: { windowLimit?: number }) {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("ספר לי על MCP");
  const [nextId, setNextId] = React.useState(1);

  const totalTokens = messages.reduce((s, m) => s + m.tokens, 0);
  const overflow = totalTokens > windowLimit;

  let running = 0;
  const visibleMessages = [...messages].reverse().filter((m) => {
    running += m.tokens;
    return running <= windowLimit;
  }).reverse();
  const droppedCount = messages.length - visibleMessages.length;

  function send() {
    if (!input.trim()) return;
    const userMsg: Msg = { id: nextId, role: "user", text: input, tokens: estimateRealTokenCount(input) };
    const reply = `תשובה לדוגמה #${nextId} (בהדגמה זו אין קריאה אמיתית ל-AI — רק מדמים תפוסת טוקנים)`;
    const botMsg: Msg = {
      id: nextId + 1,
      role: "assistant",
      text: reply,
      tokens: estimateRealTokenCount(reply),
    };
    setMessages((m) => [...m, userMsg, botMsg]);
    setNextId((n) => n + 2);
    setInput("");
  }

  function reset() {
    setMessages([]);
    setNextId(1);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-semibold">
          חלון הקשר: {totalTokens}/{windowLimit} טוקנים (מוקטן להדגמה — Claude האמיתי תומך ב-200,000+)
        </span>
        {overflow && (
          <span className="flex items-center gap-1 text-danger">
            <AlertTriangle size={13} /> חריגה! {droppedCount} הודעות ישנות "נשכחות"
          </span>
        )}
      </div>

      <div
        className="mb-4 h-6 overflow-hidden rounded-full bg-background"
        style={{ direction: "ltr" }}
        role="img"
        aria-label={`מד תפוסת חלון ההקשר: ${totalTokens} מתוך ${windowLimit} טוקנים בשימוש, כל קטע צבע מייצג הודעה${overflow ? " — חריגה מהמגבלה" : ""}`}
      >
        <div className="flex h-full">
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                width: `${Math.min(100, (m.tokens / windowLimit) * 100)}%`,
                backgroundColor: COLORS[m.role],
              }}
              className="h-full"
            />
          ))}
        </div>
      </div>

      <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
        <AnimatePresence>
          {messages.map((m) => {
            const isDropped = !visibleMessages.includes(m);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: isDropped ? 0.25 : 1 }}
                className={`rounded-lg px-3 py-1.5 text-xs ${
                  m.role === "user" ? "bg-primary/10" : "bg-cyan-500/10"
                }`}
              >
                <span className="font-bold" style={{ color: COLORS[m.role] }}>
                  {m.role === "user" ? "אתה" : "AI"}:{" "}
                </span>
                {m.text} <span className="text-muted">({m.tokens} טוקנים)</span>
                {isDropped && <span className="text-danger"> — מחוץ לחלון!</span>}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="שלח הודעה נוספת..."
        />
        <button
          onClick={send}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Send size={13} /> שלח
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted"
        >
          <RotateCcw size={13} /> איפוס
        </button>
      </div>
    </div>
  );
}
