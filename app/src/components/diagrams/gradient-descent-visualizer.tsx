"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { StepForward, RotateCcw } from "lucide-react";

// פונקציית "loss" פשוטה עם מינימום מקומי קטן ומינימום גלובלי — ממחישה גם התקהלות (getting stuck)
function loss(x: number) {
  return 0.15 * (x - 6) ** 2 + Math.sin(x * 1.5) * 0.8 + 3;
}
function gradient(x: number) {
  const h = 0.001;
  return (loss(x + h) - loss(x - h)) / (2 * h);
}

const WIDTH = 560;
const HEIGHT = 240;
const X_MIN = 0;
const X_MAX = 12;

function toScreenX(x: number) {
  return 40 + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - 80);
}
function toScreenY(y: number) {
  return HEIGHT - 30 - (y / 6) * (HEIGHT - 60);
}

export function GradientDescentVisualizer() {
  const [x, setX] = React.useState(1.5);
  const [lr, setLr] = React.useState(0.3);
  const [history, setHistory] = React.useState<number[]>([1.5]);

  const curvePoints = React.useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const px = X_MIN + (i / 100) * (X_MAX - X_MIN);
      pts.push(`${toScreenX(px)},${toScreenY(loss(px))}`);
    }
    return pts.join(" ");
  }, []);

  function step() {
    const grad = gradient(x);
    const next = x - lr * grad;
    const clamped = Math.max(X_MIN, Math.min(X_MAX, next));
    setX(clamped);
    setHistory((h) => [...h, clamped]);
  }

  function reset() {
    setX(1.5);
    setHistory([1.5]);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 text-sm text-muted">
        העקומה מייצגת &quot;loss&quot; (שגיאה) כתלות בפרמטר יחיד. הכדור מתחיל מנקודה אקראית. כל
        &quot;צעד&quot; זז נגד כיוון הגרדיאנט (השיפוע) בקצב שקובע ה-learning rate. נסה learning rate
        גבוה מדי וראה מה קורה (רמז: הכדור &quot;קופץ&quot; במקום לרדת בעדינות).
      </p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height={HEIGHT}
        style={{ direction: "ltr" }}
        role="img"
        aria-label="גרף גרדיאנט descent: עקומת שגיאה (loss) עם כדור היורד לכיוון המינימום צעד אחר צעד לפי קצב הלמידה"
      >
        <polyline points={curvePoints} fill="none" stroke="var(--border)" strokeWidth={2} />
        {history.map((h, i) => (
          <circle key={i} cx={toScreenX(h)} cy={toScreenY(loss(h))} r={3} fill="var(--muted)" opacity={0.4} />
        ))}
        <motion.circle
          cx={toScreenX(x)}
          cy={toScreenY(loss(x))}
          r={9}
          fill="var(--primary)"
          animate={{ cx: toScreenX(x), cy: toScreenY(loss(x)) }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-bold text-primary">Learning Rate</span>
            <span className="text-muted">{lr.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.02}
            max={1.2}
            step={0.02}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={step}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <StepForward size={12} /> צעד גרדיאנט
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted"
          >
            <RotateCcw size={12} /> איפוס
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        צעדים שבוצעו: {history.length - 1} · loss נוכחי: {loss(x).toFixed(2)}
      </p>
    </div>
  );
}
