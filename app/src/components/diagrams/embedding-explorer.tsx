"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface WordPoint {
  label: string;
  x: number;
  y: number;
  group: string;
}

const COLORS: Record<string, string> = {
  animals: "#5b5bf6",
  tech: "#22d3ee",
  food: "#f97316",
};

// קואורדינטות 2D מדומות (לא embeddings אמיתיים) שממחישות את העיקרון: מילים קרובות במשמעות -> קרובות במרחב.
const WORDS: WordPoint[] = [
  { label: "כלב", x: 20, y: 30, group: "animals" },
  { label: "חתול", x: 28, y: 22, group: "animals" },
  { label: "אריה", x: 15, y: 42, group: "animals" },
  { label: "מחשב", x: 75, y: 70, group: "tech" },
  { label: "שרת", x: 82, y: 60, group: "tech" },
  { label: "קוד", x: 70, y: 80, group: "tech" },
  { label: "פיצה", x: 45, y: 15, group: "food" },
  { label: "המבורגר", x: 55, y: 10, group: "food" },
  { label: "סלט", x: 40, y: 25, group: "food" },
];

function similarity(a: WordPoint, b: WordPoint) {
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  const maxDist = Math.hypot(100, 100);
  return Math.max(0, 1 - dist / maxDist);
}

/**
 * ממחיש את עקרון ה-embeddings: מילים דומות במשמעות ממופות לנקודות קרובות במרחב וקטורי.
 * הקואורדינטות כאן מדומות (לא embeddings אמיתיים מ-API) לצורך המחשה חזותית ברורה.
 */
export function EmbeddingExplorer() {
  const [selected, setSelected] = React.useState<[string, string]>(["כלב", "חתול"]);
  const a = WORDS.find((w) => w.label === selected[0])!;
  const b = WORDS.find((w) => w.label === selected[1])!;
  const sim = similarity(a, b);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 text-sm text-muted">
        לחץ על שתי מילים כדי לראות את ה-similarity (קרבה סמנטית מדומה) ביניהן. שים לב: מילים
        מאותה קטגוריה נמצאות קרובות זו לזו במרחב — בדיוק כמו embeddings אמיתיים.
      </p>
      <svg
        viewBox="0 0 100 100"
        className="w-full rounded-xl bg-background"
        style={{ height: 260 }}
        role="img"
        aria-label="מפת embeddings: מילים ממופות כנקודות במרחב דו-ממדי, כאשר מילים דומות במשמעות (מאותה קטגוריה) קרובות זו לזו"
      >
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="var(--primary)"
          strokeWidth={0.5}
          strokeDasharray="2 1"
        />
        {WORDS.map((w) => {
          const selectWord = () =>
            setSelected((prev) => (prev[0] === w.label ? prev : [w.label, prev[0]]));
          return (
            <g
              key={w.label}
              role="button"
              tabIndex={0}
              aria-label={`בחר את המילה ${w.label} להשוואת קרבה`}
              aria-pressed={selected.includes(w.label)}
              className="cursor-pointer outline-none"
              onClick={selectWord}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectWord();
                }
              }}
            >
              <motion.circle
                cx={w.x}
                cy={w.y}
                r={selected.includes(w.label) ? 3.2 : 2.2}
                fill={COLORS[w.group]}
              />
              <text x={w.x} y={w.y - 4} fontSize={3.5} textAnchor="middle" fill="currentColor">
                {w.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2 text-sm">
        <span>
          similarity({selected[0]}, {selected[1]}):
        </span>
        <span className="font-bold text-primary">{sim.toFixed(2)}</span>
      </div>
    </div>
  );
}
