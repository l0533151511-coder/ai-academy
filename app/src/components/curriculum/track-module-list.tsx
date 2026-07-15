"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import type { TrackSummary } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

/**
 * מציג את מודולי/שיעורי המסלול עם מצב השלמה אמיתי (checkmarks + progress bars).
 * client component נפרד מ-page.tsx (שנשאר server component עם generateStaticParams)
 * כי מצב השלמה תלוי ב-localStorage/Supabase דרך useProgress().
 */
export function TrackModuleList({ track }: { track: TrackSummary }) {
  const { state } = useProgress();
  const completed = new Set(state.completedLessons);

  const builtLessons = track.modules.flatMap((m) => m.lessons);
  const trackCompletedCount = builtLessons.filter((l) => completed.has(l.slug)).length;
  const trackPct =
    builtLessons.length > 0 ? Math.round((trackCompletedCount / builtLessons.length) * 100) : 0;

  return (
    <div className="mt-10 space-y-4">
      {builtLessons.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">התקדמות במסלול</span>
            <span className="text-muted">
              {trackCompletedCount}/{builtLessons.length} שיעורים ({trackPct}%)
            </span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-background"
            role="progressbar"
            aria-valuenow={trackPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`התקדמות במסלול: ${trackPct}%`}
          >
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${trackPct}%` }}
            />
          </div>
        </div>
      )}

      {track.modules.map((module, i) => {
        const moduleCompletedCount = module.lessons.filter((l) => completed.has(l.slug)).length;
        const moduleDone = module.lessons.length > 0 && moduleCompletedCount === module.lessons.length;

        return (
          <div key={module.slug} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold">
                מודול {i + 1}: {module.title}
              </h2>
              {module.lessons.length > 0 && (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                    moduleDone ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                  )}
                >
                  {moduleDone ? "מודול הושלם ✓" : `${moduleCompletedCount}/${module.lessons.length} הושלמו`}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{module.description}</p>
            <p className="mt-2 text-xs text-muted">
              <strong>פרויקט מודול:</strong> {module.projectBrief}
            </p>
            {module.lessons.length > 0 ? (
              <ol className="mt-4 space-y-2">
                {module.lessons.map((lesson, li) => {
                  const done = completed.has(lesson.slug);
                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={`/tracks/${track.slug}/${module.slug}/${lesson.slug}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-background"
                      >
                        {done ? (
                          <CheckCircle2 size={20} className="shrink-0 text-success" />
                        ) : (
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {li + 1}
                          </span>
                        )}
                        <span className={done ? "text-muted line-through" : ""}>{lesson.title}</span>
                        <span className="mr-auto flex shrink-0 items-center gap-1 text-xs text-muted">
                          {lesson.estMinutes} דק&#39;
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-3 flex items-center gap-2 text-xs italic text-muted">
                <Circle size={12} /> שיעורי המודול בתהליך בנייה
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
