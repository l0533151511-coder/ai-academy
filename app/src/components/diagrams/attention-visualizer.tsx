"use client";

import * as React from "react";

/**
 * Attention Visualizer — הדגמה פדגוגית של מנגנון self-attention.
 * המשקלים כאן פסאודו-אקראיים (לא ממודל אמיתי) — המטרה להמחיש את *הרעיון*
 * (כל מילה "מסתכלת" על כל שאר המילים במשפט בעוצמות שונות), לא לשחזר attention אמיתי.
 */

function pseudoWeight(a: string, b: string): number {
  let h = 0;
  const s = a + "|" + b;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return (Math.abs(h) % 100) / 100;
}

export function AttentionVisualizer({ sentence }: { sentence: string }) {
  const words = sentence.split(/\s+/).filter(Boolean);
  const [focus, setFocus] = React.useState(0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 text-sm text-muted">
        לחץ על מילה כדי לראות כמה &quot;תשומת לב&quot; (attention) היא נותנת לכל מילה אחרת במשפט —
        קווים עבים/כהים יותר = משקל גבוה יותר:
      </p>
      <div className="mb-4 flex flex-wrap gap-2" style={{ direction: "rtl" }}>
        {words.map((w, i) => (
          <button
            key={i}
            onClick={() => setFocus(i)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              focus === i ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
            }`}
          >
            {w}
          </button>
        ))}
      </div>
      <div
        className="space-y-1.5"
        role="img"
        aria-label={`מפת תשומת לב (attention): כל שורה מציגה כמה תשומת לב המילה "${words[focus]}" נותנת למילה אחרת במשפט, פס ארוך יותר משמעו משקל גבוה יותר`}
      >
        {words.map((w, i) => {
          const weight = i === focus ? 1 : pseudoWeight(words[focus], w);
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="w-16 shrink-0 truncate text-xs text-muted">{w}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${weight * 100}%`, opacity: 0.4 + weight * 0.6 }}
                />
              </div>
              <span className="w-10 shrink-0 text-left text-xs text-muted">
                {(weight * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
