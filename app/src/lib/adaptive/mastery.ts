// הערכת שליטה (Mastery Estimation) לכל כישור.
//
// מודל מפורש ומוגן, לא "קופסה שחורה": השליטה נגזרת מ-3 אותות מדידים —
//   1. כיסוי (coverage): כמה משיעורי הכישור הושלמו.
//   2. דיוק בבוחן (quiz accuracy): הביצועים בבחנים של שיעורי הכישור.
//   3. שימור (retention): דעיכה אקספוננציאלית לפי הזמן מאז הפעילות האחרונה בכישור.
//
// כל הפונקציות טהורות. הזמן (now) מוזרק כפרמטר -> ניתן לבדיקה דטרמיניסטית.

import type { Skill } from "./skills";

/** רשומת בוחן אחרונה לשיעור (נשמרת ב-progress store). */
export interface QuizRecord {
  correct: number;
  total: number;
  /** ISO timestamp של הניסיון האחרון */
  at: string;
}

/** האות הגולמי על הלומד — נגזר מ-ProgressState. */
export interface LearnerSignal {
  completedLessons: Set<string>;
  /** lessonSlug -> ISO timestamp של ההשלמה */
  completedAt: Record<string, string>;
  /** lessonSlug -> רשומת בוחן אחרונה */
  quizzes: Record<string, QuizRecord>;
  /** Date.now() — מוזרק לצורך בדיקות */
  now: number;
}

export type MasteryStatus =
  | "not-started" // טרם התחיל
  | "learning" // בתהליך למידה
  | "proficient" // שליטה טובה
  | "mastered" // שליטה מלאה
  | "needs-review"; // נשלט בעבר אך דעך — דורש רענון

export interface SkillMastery {
  skillId: string;
  /** שליטה "טרייה" 0..1 — בהתעלם מדעיכה (מה שהושג בפועל) */
  rawMastery: number;
  /** שליטה אפקטיבית 0..1 — אחרי החלת שימור/דעיכה */
  mastery: number;
  /** ביטחון בהערכה 0..1 — נמוך אם אין בחנים / כיסוי חלקי */
  confidence: number;
  status: MasteryStatus;
  lessonsDone: number;
  lessonsTotal: number;
  /** דיוק ממוצע בבחנים 0..1, או null אם לא נבחן */
  quizAccuracy: number | null;
  /** ISO של הפעילות האחרונה בכישור, או null */
  lastActivityAt: string | null;
}

const DAY_MS = 86_400_000;
// חצי-חיים של שימור: אחרי ~45 יום ללא פעילות, גורם הדעיכה יורד לחצי.
const RETENTION_HALF_LIFE_DAYS = 45;
// רצפת שימור: גם ללא פעילות ממושכת לא "שוכחים" הכל — נשאר לפחות 55% מהשליטה.
const RETENTION_FLOOR = 0.55;

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/** עיגול ל-4 ספרות — מונע ארטיפקטים של float שמזיזים ערך מעבר לסף (למשל 0.79999 מול 0.8). */
function round4(x: number): number {
  return Math.round(x * 10000) / 10000;
}

/**
 * גורם השימור: 1 מיד אחרי פעילות, יורד אקספוננציאלית לכיוון RETENTION_FLOOR.
 * דעיכה משמעותית רק לכישורים שנשלטו והוזנחו — בסיס לזיהוי "דורש רענון".
 */
export function retentionFactor(daysSinceActivity: number): number {
  if (daysSinceActivity <= 0) return 1;
  const decay = Math.pow(0.5, daysSinceActivity / RETENTION_HALF_LIFE_DAYS);
  return RETENTION_FLOOR + (1 - RETENTION_FLOOR) * decay;
}

export function estimateSkillMastery(skill: Skill, signal: LearnerSignal): SkillMastery {
  const lessonsTotal = skill.lessonSlugs.length;
  const doneSlugs = skill.lessonSlugs.filter((s) => signal.completedLessons.has(s));
  const lessonsDone = doneSlugs.length;
  const coverage = lessonsTotal === 0 ? 0 : lessonsDone / lessonsTotal;

  // דיוק בבוחן: מאגדים את כל רשומות הבוחן של שיעורי הכישור (סכום נכונות / סכום שאלות)
  let quizCorrect = 0;
  let quizTotal = 0;
  let lastActivityMs = 0;
  for (const slug of skill.lessonSlugs) {
    const q = signal.quizzes[slug];
    if (q && q.total > 0) {
      quizCorrect += q.correct;
      quizTotal += q.total;
      lastActivityMs = Math.max(lastActivityMs, Date.parse(q.at) || 0);
    }
    const doneAt = signal.completedAt[slug];
    if (doneAt) lastActivityMs = Math.max(lastActivityMs, Date.parse(doneAt) || 0);
  }
  const quizAccuracy = quizTotal > 0 ? quizCorrect / quizTotal : null;

  if (lessonsDone === 0) {
    return {
      skillId: skill.id,
      rawMastery: 0,
      mastery: 0,
      confidence: 0,
      status: "not-started",
      lessonsDone: 0,
      lessonsTotal,
      quizAccuracy: null,
      lastActivityAt: null,
    };
  }

  // שליטה גולמית:
  //  - אם נבחן: כיסוי מווסת בדיוק הבוחן (בין 0.4 ל-1.0 מהכיסוי).
  //  - אם לא נבחן: תקרה של 0.75*כיסוי — עשית את השיעורים אך לא אימתת ידע.
  const rawMastery = round4(
    quizAccuracy === null
      ? clamp01(coverage * 0.75)
      : clamp01(coverage * (0.4 + 0.6 * quizAccuracy))
  );

  const daysSince = lastActivityMs > 0 ? (signal.now - lastActivityMs) / DAY_MS : 0;
  const retention = retentionFactor(daysSince);
  const mastery = round4(clamp01(rawMastery * retention));

  // ביטחון: עולה עם הכיסוי ועם נפח הבוחן. נמוך אם אין בחנים.
  const quizVolumeConf = quizTotal === 0 ? 0 : Math.min(1, quizTotal / 8);
  const confidence = clamp01(0.35 * coverage + 0.65 * quizVolumeConf);

  // סטטוס: needs-review גובר אם השליטה הגולמית הייתה גבוהה אך דעכה משמעותית.
  let status: MasteryStatus;
  const decayedSignificantly = rawMastery - mastery >= 0.12;
  if (rawMastery >= 0.7 && decayedSignificantly) {
    status = "needs-review";
  } else if (mastery >= 0.8) {
    status = "mastered";
  } else if (mastery >= 0.5) {
    status = "proficient";
  } else {
    status = "learning";
  }

  return {
    skillId: skill.id,
    rawMastery,
    mastery,
    confidence,
    status,
    lessonsDone,
    lessonsTotal,
    quizAccuracy,
    lastActivityAt: lastActivityMs > 0 ? new Date(lastActivityMs).toISOString() : null,
  };
}

/** האם כישור נחשב "נשלט מספיק" כדי לפתוח כישורים שתלויים בו. */
export function isUnlockedBy(m: SkillMastery): boolean {
  return m.status === "proficient" || m.status === "mastered" || m.status === "needs-review";
}
