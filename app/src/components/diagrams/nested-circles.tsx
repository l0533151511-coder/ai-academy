"use client";

import * as React from "react";
import { motion } from "framer-motion";

export interface CircleLevel {
  label: string;
  detail: string;
  color: string;
}

export function NestedCircles({ levels }: { levels: CircleLevel[] }) {
  const [active, setActive] = React.useState(0);
  const n = levels.length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex justify-center">
        <svg viewBox="0 0 320 320" width="280" height="280" role="img" aria-label="מעגלים מקוננים — בחר רמה">
          {levels.map((level, i) => {
            const radius = ((n - i) / n) * 150;
            return (
              <motion.circle
                key={level.label}
                cx={160}
                cy={160}
                r={radius}
                fill={active === i ? level.color + "33" : "transparent"}
                stroke={level.color}
                strokeWidth={active === i ? 3 : 1.5}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={level.label}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
          {levels.map((level, i) => {
            const radius = ((n - i) / n) * 150;
            return (
              <text
                key={level.label + "-text"}
                x={160}
                y={160 - radius + 16}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill={level.color}
                className="cursor-pointer select-none"
                tabIndex={0}
                role="button"
                aria-label={level.label}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
              >
                {level.label}
              </text>
            );
          })}
        </svg>
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-xl bg-background p-4 text-sm"
      >
        <span className="font-bold" style={{ color: levels[active].color }}>
          {levels[active].label}:{" "}
        </span>
        {levels[active].detail}
      </motion.div>
    </div>
  );
}
