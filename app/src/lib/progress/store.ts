"use client";

// שכבת התקדמות: local-first (מהיר, עובד גם ללא חשבון) + סנכרון ל-Supabase כשמחובר.
//
// Store חיצוני *יחיד* (singleton) עם useSyncExternalStore: כל הרכיבים חולקים מצב אחד.
// זה קריטי — יש כמה צרכנים שכותבים (LessonShell, QuizEngine, דשבורד). אילו כל hook היה
// מחזיק state נפרד, כתיבה מ-instance אחד הייתה דורסת עדכון מאחר בעת saveLocal.
import { useEffect, useSyncExternalStore } from "react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useUser } from "@/lib/supabase/use-user";
import type { QuizRecord } from "@/lib/adaptive/mastery";
import { scheduleNext, qualityFromAccuracy, type SRState } from "@/lib/adaptive/spaced-repetition";

const STORAGE_KEY = "ai-academy:progress:v1";

export interface ProgressState {
  xp: number;
  streakDays: number;
  lastActiveDate: string | null;
  completedLessons: string[]; // lesson slug (ייחודי בכל הקוריקולום)
  completedAt: Record<string, string>; // lesson slug -> ISO timestamp של ההשלמה
  exerciseAttempts: Record<string, number>; // exerciseId -> attempts
  quizzes: Record<string, QuizRecord>; // lesson slug -> תוצאת הבוחן האחרונה
  reviews: Record<string, SRState>; // lesson slug -> מצב חזרה מרווחת
  bookmarks: string[]; // lesson slugs
  notes: Record<string, string>; // lesson slug -> תוכן הערה
}

const DEFAULT_STATE: ProgressState = {
  xp: 0,
  streakDays: 0,
  lastActiveDate: null,
  completedLessons: [],
  completedAt: {},
  exerciseAttempts: {},
  quizzes: {},
  reviews: {},
  bookmarks: [],
  notes: {},
};

// ---- Store חיצוני יחיד ----

let memoryState: ProgressState = DEFAULT_STATE;
let hydratedFromLocal = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ProgressState {
  // hydration עצל מ-localStorage בקריאה הראשונה בצד לקוח (getSnapshot חייב להישאר יציב אח"כ)
  if (!hydratedFromLocal && typeof window !== "undefined") {
    memoryState = loadLocal();
    hydratedFromLocal = true;
  }
  return memoryState;
}

function getServerSnapshot(): ProgressState {
  return DEFAULT_STATE;
}

/** מעדכן את המצב המשותף, שומר ל-localStorage, ומודיע לכל המנויים. */
function setState(updater: (prev: ProgressState) => ProgressState) {
  const next = updater(memoryState);
  if (next === memoryState) return;
  memoryState = next;
  saveLocal(next);
  emit();
}

function loadLocal(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveLocal(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function lessonSlugFromKey(lessonKey: string) {
  // lessonKey בפורמט "track/module/lesson" -> Supabase שומר לפי lesson slug בלבד
  return lessonKey.split("/").pop() ?? lessonKey;
}

function touchStreak(s: ProgressState): ProgressState {
  const today = todayISO();
  if (s.lastActiveDate === today) return s;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streakDays = s.lastActiveDate === yesterday ? s.streakDays + 1 : 1;
  return { ...s, streakDays, lastActiveDate: today };
}

// ---- זהות המשתמש המחובר (לסנכרון Supabase מתוך פעולות מודול) ----

let currentUserId: string | null = null;

// ---- פעולות (module-level, פועלות על ה-store המשותף) ----

function completeLesson(lessonKey: string, xpReward = 50) {
  const lessonSlug = lessonSlugFromKey(lessonKey);
  let didComplete = false;
  let snapshot: ProgressState = memoryState;

  setState((prev) => {
    if (prev.completedLessons.includes(lessonSlug)) return prev;
    didComplete = true;
    const next = touchStreak({
      ...prev,
      xp: prev.xp + xpReward,
      completedLessons: [...prev.completedLessons, lessonSlug],
      completedAt: { ...prev.completedAt, [lessonSlug]: new Date().toISOString() },
    });
    snapshot = next;
    return next;
  });

  if (didComplete && isSupabaseConfigured && currentUserId) {
    const supabase = createSupabaseBrowserClient();
    supabase.from("lesson_progress").upsert({ user_id: currentUserId, lesson_slug: lessonSlug }).then();
    supabase
      .from("profiles")
      .update({ xp: snapshot.xp, streak_days: snapshot.streakDays, last_active_date: snapshot.lastActiveDate })
      .eq("id", currentUserId)
      .then();
  }
}

function recordAttempt(exerciseId: string, passed = false) {
  setState((prev) => ({
    ...prev,
    exerciseAttempts: {
      ...prev.exerciseAttempts,
      [exerciseId]: (prev.exerciseAttempts[exerciseId] ?? 0) + 1,
    },
  }));

  if (isSupabaseConfigured && currentUserId) {
    const supabase = createSupabaseBrowserClient();
    supabase.from("exercise_attempts").insert({ user_id: currentUserId, exercise_id: exerciseId, passed }).then();
  }
}

function recordQuiz(lessonKey: string, correct: number, total: number) {
  if (total <= 0) return;
  const lessonSlug = lessonSlugFromKey(lessonKey);
  const nowMs = Date.now();
  const at = new Date(nowMs).toISOString();

  setState((prev) => {
    const quality = qualityFromAccuracy(correct / total);
    const nextReview = scheduleNext(prev.reviews[lessonSlug], quality, nowMs);
    return {
      ...prev,
      quizzes: { ...prev.quizzes, [lessonSlug]: { correct, total, at } },
      reviews: { ...prev.reviews, [lessonSlug]: nextReview },
    };
  });

  if (isSupabaseConfigured && currentUserId) {
    const supabase = createSupabaseBrowserClient();
    supabase.from("quiz_results").insert({ user_id: currentUserId, quiz_id: lessonSlug, score: correct, total }).then();
  }
}

function toggleBookmark(lessonKey: string) {
  const lessonSlug = lessonSlugFromKey(lessonKey);
  let wasBookmarked = false;

  setState((prev) => {
    wasBookmarked = prev.bookmarks.includes(lessonSlug);
    return {
      ...prev,
      bookmarks: wasBookmarked
        ? prev.bookmarks.filter((b) => b !== lessonSlug)
        : [...prev.bookmarks, lessonSlug],
    };
  });

  if (isSupabaseConfigured && currentUserId) {
    const supabase = createSupabaseBrowserClient();
    if (wasBookmarked) {
      supabase.from("bookmarks").delete().eq("user_id", currentUserId).eq("lesson_slug", lessonSlug).then();
    } else {
      supabase.from("bookmarks").upsert({ user_id: currentUserId, lesson_slug: lessonSlug }).then();
    }
  }
}

function saveNote(lessonKey: string, content: string) {
  const lessonSlug = lessonSlugFromKey(lessonKey);
  setState((prev) => ({ ...prev, notes: { ...prev.notes, [lessonSlug]: content } }));

  if (isSupabaseConfigured && currentUserId) {
    const supabase = createSupabaseBrowserClient();
    supabase.from("notes").upsert({ user_id: currentUserId, lesson_slug: lessonSlug, content }).then();
  }
}

// ---- הידרציה מ-Supabase (חד-פעמית פר-משתמש) ----

let hydratedForUser: string | null = null;

async function hydrateFromSupabase(userId: string) {
  if (hydratedForUser === userId) return;
  hydratedForUser = userId;
  const supabase = createSupabaseBrowserClient();

  const [{ data: profile }, { data: progress }, { data: bookmarkRows }, { data: noteRows }] =
    await Promise.all([
      supabase.from("profiles").select("xp, streak_days, last_active_date").eq("id", userId).single(),
      supabase.from("lesson_progress").select("lesson_slug, completed_at"),
      supabase.from("bookmarks").select("lesson_slug"),
      supabase.from("notes").select("lesson_slug, content"),
    ]);

  if (!profile) return;

  setState((local) => ({
    // quizzes/reviews/exerciseAttempts מקומיים (אין טבלה ייעודית) — נשמרים מ-local
    xp: profile.xp ?? 0,
    streakDays: profile.streak_days ?? 0,
    lastActiveDate: profile.last_active_date,
    completedLessons: (progress ?? []).map((p) => p.lesson_slug),
    completedAt: Object.fromEntries(
      (progress ?? []).filter((p) => p.completed_at).map((p) => [p.lesson_slug, p.completed_at as string])
    ),
    exerciseAttempts: local.exerciseAttempts,
    quizzes: local.quizzes,
    reviews: local.reviews,
    bookmarks: (bookmarkRows ?? []).map((b) => b.lesson_slug),
    notes: Object.fromEntries((noteRows ?? []).map((n) => [n.lesson_slug, n.content])),
  }));
}

// ---- ה-hook הציבורי (API זהה לקודם) ----

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { user } = useUser();

  useEffect(() => {
    currentUserId = user?.id ?? null;
    if (isSupabaseConfigured && user) hydrateFromSupabase(user.id);
  }, [user]);

  return { state, completeLesson, recordAttempt, recordQuiz, toggleBookmark, saveNote };
}

export function levelFromXP(xp: number) {
  return Math.floor(xp / 200) + 1;
}

export function xpIntoLevel(xp: number) {
  return xp % 200;
}
