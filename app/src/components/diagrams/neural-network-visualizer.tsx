"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

/**
 * Neural Network Visualizer — רכיב כללי לשימוש חוזר בכל שיעור שצריך להמחיש forward pass.
 * מקבל מבנה שכבות (layers) ומאפשר לשלוט בערכי הקלט; משקלים פסאודו-אקראיים אך דטרמיניסטיים (seed),
 * כך שאותה תצורה תמיד מניבה אותה תוצאה — נוח להוראה ולהשוואה.
 */

export interface NeuralNetworkVisualizerProps {
  layers: number[]; // גדלים לכל שכבה, כולל קלט ופלט
  layerLabels?: string[];
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function seededWeight(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1; // -1..1
}

export function NeuralNetworkVisualizer({ layers, layerLabels }: NeuralNetworkVisualizerProps) {
  const [inputs, setInputs] = React.useState<number[]>(() => Array(layers[0]).fill(0.5));
  const [ran, setRan] = React.useState(false);

  const activations = React.useMemo(() => {
    const result: number[][] = [inputs];
    let seedCounter = 0;
    for (let l = 1; l < layers.length; l++) {
      const prev = result[l - 1];
      const layerOut: number[] = [];
      for (let n = 0; n < layers[l]; n++) {
        let sum = 0;
        for (let p = 0; p < prev.length; p++) {
          sum += prev[p] * seededWeight(seedCounter++);
        }
        layerOut.push(sigmoid(sum));
      }
      result.push(layerOut);
    }
    return result;
  }, [inputs, layers]);

  const width = 560;
  const height = 260;
  const colX = (l: number) => 50 + (l * (width - 100)) / (layers.length - 1);
  const nodeY = (n: number, count: number) => height / 2 - ((count - 1) * 34) / 2 + n * 34;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap gap-3">
        {inputs.map((v, i) => (
          <div key={i} className="w-24 text-xs">
            <div className="mb-1 text-muted">קלט {i + 1}</div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={v}
              onChange={(e) => {
                const next = [...inputs];
                next[i] = Number(e.target.value);
                setInputs(next);
                setRan(true);
              }}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ direction: "ltr" }}
        role="img"
        aria-label="דיאגרמת רשת נוירונים: שכבות של נוירונים מחוברים בקווים, עוצמת הצבע של כל נוירון מייצגת את ערך ההפעלה שלו ב-forward pass"
      >
        {layers.slice(0, -1).map((count, l) =>
          Array.from({ length: count }).map((_, n) =>
            Array.from({ length: layers[l + 1] }).map((_, m) => (
              <line
                key={`${l}-${n}-${m}`}
                x1={colX(l)}
                y1={nodeY(n, count)}
                x2={colX(l + 1)}
                y2={nodeY(m, layers[l + 1])}
                stroke="var(--border)"
                strokeWidth={1}
                opacity={0.5}
              />
            ))
          )
        )}
        {activations.map((layer, l) =>
          layer.map((val, n) => (
            <motion.circle
              key={`${l}-${n}`}
              cx={colX(l)}
              cy={nodeY(n, layer.length)}
              r={13}
              fill="var(--primary)"
              opacity={ran ? 0.25 + val * 0.75 : 0.4}
              stroke="var(--primary)"
              strokeWidth={1.5}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ delay: l * 0.15 }}
            />
          ))
        )}
        {layerLabels?.map((label, l) => (
          <text
            key={label}
            x={colX(l)}
            y={height - 15}
            textAnchor="middle"
            fontSize={11}
            fill="var(--muted)"
          >
            {label}
          </text>
        ))}
      </svg>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setRan(true)}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <Play size={12} /> הרץ Forward Pass
          </button>
          <button
            onClick={() => {
              setInputs(Array(layers[0]).fill(0.5));
              setRan(false);
            }}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted"
          >
            <RotateCcw size={12} /> איפוס
          </button>
        </div>
        <div className="text-xs text-muted">
          פלט: {activations[activations.length - 1].map((v) => v.toFixed(2)).join(", ")}
        </div>
      </div>
    </div>
  );
}
