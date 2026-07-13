// חזרה מרווחת (Spaced Repetition) — גרסת SM-2 מותאמת.
//
// אחרי כל בוחן, איכות התשובה (0..5) נגזרת מדיוק הבוחן, ומעדכנת מצב חזרה לכל שיעור:
// מרווח (interval) שגדל אקספוננציאלית עם ההצלחה, וגורם קלות (ease) שמסתגל לביצועים.
// שיעור "בשל לחזרה" כשהגיע תאריך ה-due שלו. הכל טהור ודטרמיניסטי (now מוזרק).

export interface SRState {
  /** מרווח נוכחי בימים עד החזרה הבאה */
  interval: number;
  /** גורם קלות (SM-2), מינימום 1.3 */
  ease: number;
  /** מספר חזרות מוצלחות רצופות */
  reps: number;
  /** ISO date (YYYY-MM-DD) של מועד החזרה הבא */
  due: string;
  /** ISO timestamp של החזרה האחרונה */
  lastReviewed: string;
}

const DAY_MS = 86_400_000;
const MIN_EASE = 1.3;

function isoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** ממפה דיוק בוחן (0..1) לאיכות SM-2 (0..5). */
export function qualityFromAccuracy(accuracy: number): number {
  return Math.round(Math.max(0, Math.min(1, accuracy)) * 5);
}

/**
 * מחשב מצב חזרה חדש אחרי בוחן.
 * quality<3 -> נכשל: איפוס מרווח, חזרה מחר.
 * quality>=3 -> הצלחה: המרווח גדל לפי גורם הקלות.
 */
export function scheduleNext(prev: SRState | undefined, quality: number, now: number): SRState {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  const prevEase = prev?.ease ?? 2.5;

  // עדכון גורם הקלות לפי נוסחת SM-2
  const ease = Math.max(
    MIN_EASE,
    prevEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  let reps: number;
  let interval: number;

  if (q < 3) {
    // כישלון — מתחילים מחדש
    reps = 0;
    interval = 1;
  } else {
    reps = (prev?.reps ?? 0) + 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round((prev?.interval ?? 6) * ease);
  }

  return {
    interval,
    ease,
    reps,
    due: isoDate(now + interval * DAY_MS),
    lastReviewed: new Date(now).toISOString(),
  };
}

/** האם שיעור בשל לחזרה (הגיע/עבר מועד ה-due). */
export function isDue(state: SRState, now: number): boolean {
  return Date.parse(state.due + "T23:59:59") <= now;
}

/** מספר הימים עד/מאז מועד החזרה (שלילי = באיחור). */
export function daysUntilDue(state: SRState, now: number): number {
  return Math.round((Date.parse(state.due + "T00:00:00") - now) / DAY_MS);
}
