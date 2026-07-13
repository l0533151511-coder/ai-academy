"use client";

import Link from "next/link";
import { BookOpen, Trophy, Target, ArrowLeft, Bookmark, PartyPopper } from "lucide-react";
import { useProgress, levelFromXP } from "@/lib/progress/store";
import { XPBar } from "@/components/progress/xp-bar";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { AdaptivePanel } from "@/components/adaptive/adaptive-panel";
import { totalLessons, findNextLesson, allLessonsFlat } from "@/lib/curriculum/data";

export default function DashboardPage() {
  const { state } = useProgress();
  const total = totalLessons();
  const completedCount = state.completedLessons.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const nextLesson = findNextLesson(state.completedLessons);
  const bookmarkedLessons = allLessonsFlat().filter((l) => state.bookmarks.includes(l.lessonSlug));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-extrabold">לוח הבקרה שלך</h1>
      <p className="mt-1 text-muted">התקדמות, הישגים והמשך למידה במקום אחד</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <XPBar xp={state.xp} />
        </div>
        <StreakCalendar streakDays={state.streakDays} />
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <Target size={18} className="text-primary" /> התקדמות כוללת
          </div>
          <div className="text-2xl font-extrabold">{pct}%</div>
          <div className="text-xs text-muted">
            {completedCount} מתוך {total} שיעורים בנויים הושלמו
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {nextLesson ? (
              <BookOpen size={22} className="text-primary" />
            ) : (
              <PartyPopper size={22} className="text-primary" />
            )}
            <div>
              <div className="font-bold">המשך למידה</div>
              <div className="text-sm text-muted">
                {nextLesson ? nextLesson.title : "השלמת את כל השיעורים הבנויים! 🎉"}
              </div>
            </div>
          </div>
          {nextLesson && (
            <Link
              href={nextLesson.href}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
            >
              המשך <ArrowLeft size={16} />
            </Link>
          )}
        </div>
      </div>

      <AdaptivePanel />

      {bookmarkedLessons.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Bookmark size={18} className="text-warning" /> השיעורים השמורים שלי
          </h2>
          <div className="space-y-2">
            {bookmarkedLessons.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm transition hover:border-primary"
              >
                <span>{l.title}</span>
                <ArrowLeft size={14} className="text-muted" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Trophy size={18} className="text-warning" /> רמה נוכחית: {levelFromXP(state.xp)}
        </h2>
        <p className="text-sm text-muted">
          כל שיעור שתשלים מוסיף XP. כל 200 XP = רמה חדשה. השלימו קפסטון כדי לפתוח תעודה.
        </p>
      </div>
    </div>
  );
}
