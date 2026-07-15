"use client";

import { levelFromXP, xpIntoLevel } from "@/lib/progress/store";

export function XPBar({ xp }: { xp: number }) {
  const level = levelFromXP(xp);
  const into = xpIntoLevel(xp);
  const pct = Math.round((into / 200) * 100);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold">רמה {level}</span>
        <span className="text-muted">{into}/200 XP</span>
      </div>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-background"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`התקדמות ברמה ${level}: ${pct}%`}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
