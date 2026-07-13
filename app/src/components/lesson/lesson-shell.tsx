"use client";

import * as React from "react";
import { Clock, BarChart3, ListChecks, CheckCircle2, Bookmark, StickyNote } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { LessonKeyProvider } from "@/lib/lesson/lesson-context";
import { cn } from "@/lib/utils";

export interface LessonMeta {
  trackSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  objectives: string[];
  estMinutes: number;
  difficulty: string;
  prerequisites: string[];
}

export interface LessonSection {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function LessonShell({
  meta,
  sections,
}: {
  meta: LessonMeta;
  sections: LessonSection[];
}) {
  const lessonKey = `${meta.trackSlug}/${meta.moduleSlug}/${meta.lessonSlug}`;
  const lessonSlug = meta.lessonSlug;
  const { state, completeLesson, toggleBookmark, saveNote } = useProgress();
  const isComplete = state.completedLessons.includes(lessonSlug);
  const isBookmarked = state.bookmarks.includes(lessonSlug);
  const [noteDraft, setNoteDraft] = React.useState("");
  const noteLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (!noteLoadedRef.current) {
      setNoteDraft(state.notes[lessonSlug] ?? "");
      noteLoadedRef.current = true;
    }
  }, [state.notes, lessonSlug]);

  return (
    <LessonKeyProvider lessonKey={lessonKey}>
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <aside className="sticky top-20 hidden h-fit w-56 shrink-0 lg:block">
        <nav className="space-y-1 text-sm">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block rounded-lg px-3 py-1.5 text-muted transition hover:bg-card hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-8 border-b border-border pb-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-extrabold">{meta.title}</h1>
            <button
              onClick={() => toggleBookmark(lessonKey)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                isBookmarked
                  ? "border-warning bg-warning/10 text-warning"
                  : "border-border text-muted hover:bg-card"
              )}
              aria-pressed={isBookmarked}
            >
              <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
              {isBookmarked ? "נשמר במועדפים" : "שמור למועדפים"}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> {meta.estMinutes} דקות
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart3 size={15} /> רמת קושי: {meta.difficulty}
            </span>
            {meta.prerequisites.length > 0 && (
              <span className="flex items-center gap-1.5">
                <ListChecks size={15} /> דרישות קדם: {meta.prerequisites.join(", ")}
              </span>
            )}
          </div>
          <div className="mt-4 rounded-xl bg-primary/5 p-4">
            <p className="mb-2 text-sm font-semibold text-primary">מטרות למידה</p>
            <ul className="space-y-1 text-sm">
              {meta.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="mb-4 text-xl font-bold">{s.label}</h2>
              {s.content}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold">
            <StickyNote size={15} className="text-primary" /> ההערות האישיות שלי לשיעור הזה
          </p>
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            onBlur={() => saveNote(lessonKey, noteDraft)}
            placeholder="כתוב כאן הערות, תובנות, או דברים שרצית לזכור מהשיעור..."
            rows={3}
            className="w-full rounded-lg border border-border bg-background p-3 text-sm"
          />
        </section>

        <div className="mt-8 flex justify-center border-t border-border pt-8">
          <button
            onClick={() => completeLesson(lessonKey)}
            disabled={isComplete}
            className="flex items-center gap-2 rounded-full bg-success px-8 py-3 font-bold text-white disabled:opacity-60"
          >
            <CheckCircle2 size={18} />
            {isComplete ? "השיעור הושלם ✓" : "סמן שיעור כהושלם (+50 XP)"}
          </button>
        </div>
      </div>
    </div>
    </LessonKeyProvider>
  );
}
