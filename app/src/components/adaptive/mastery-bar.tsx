"use client";

import { cn } from "@/lib/utils";
import { STATUS_BADGE, STATUS_BAR, STATUS_LABEL } from "@/lib/adaptive/labels";
import type { SkillMastery } from "@/lib/adaptive/mastery";

/** פס שליטה יחיד לכישור: כותרת, תג סטטוס, ופס מילוי לפי אחוז השליטה. */
export function MasteryBar({
  title,
  mastery,
  subtitle,
  className,
}: {
  title: string;
  mastery: SkillMastery;
  subtitle?: string;
  className?: string;
}) {
  const pct = Math.round(mastery.mastery * 100);
  return (
    <div className={cn("rounded-xl border border-border bg-card p-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{title}</span>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            STATUS_BADGE[mastery.status]
          )}
        >
          {STATUS_LABEL[mastery.status]}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
        <div
          className={cn("h-full rounded-full transition-all", STATUS_BAR[mastery.status])}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
        <span>{subtitle ?? `${mastery.lessonsDone}/${mastery.lessonsTotal} שיעורים`}</span>
        <span>
          {pct}% שליטה
          {mastery.quizAccuracy !== null && ` · ${Math.round(mastery.quizAccuracy * 100)}% בבחנים`}
        </span>
      </div>
    </div>
  );
}
