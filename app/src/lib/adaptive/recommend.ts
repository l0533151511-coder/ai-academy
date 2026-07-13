// מנוע המלצות: מהו הצעד הבא הטוב ביותר עבור הלומד.
//
// שלושה סוגי המלצות, כולן נגזרות מגרף הכישורים + הערכת השליטה:
//   1. next        — השיעור/ים הבאים ללמידה (מכבד דרישות-קדם, מעדיף להשלים מה שהתחיל).
//   2. weaknesses  — כישורים חלשים שכדאי לחזק, ממוינים לפי חשיבותם בגרף.
//   3. reviews     — שיעורים שבשלים לחזרה מרווחת.
//
// טהור: מקבל את הכישורים, מפת השליטה, ומצבי החזרה — ומחזיר רשימות ממוינות.

import { allLessonsFlat, type FlatLesson } from "@/lib/curriculum/data";
import { getSkills, dependentCount, type Skill } from "./skills";
import { isUnlockedBy, type SkillMastery } from "./mastery";
import { isDue, daysUntilDue, type SRState } from "./spaced-repetition";

export interface LessonRecommendation {
  lesson: FlatLesson;
  skill: Skill;
  /** נימוק קצר בעברית — למה זה הצעד הבא */
  reason: string;
  /** ציון עדיפות (גבוה = דחוף/רלוונטי יותר) */
  priority: number;
}

export interface WeaknessItem {
  skill: Skill;
  mastery: SkillMastery;
  /** כמה כישורים תלויים בכישור זה — מדד לחשיבות חיזוקו */
  importance: number;
  reason: string;
}

export interface ReviewItem {
  lessonSlug: string;
  lesson: FlatLesson | null;
  skill: Skill | undefined;
  state: SRState;
  overdueDays: number; // חיובי = באיחור
}

function lessonIndex(): Map<string, FlatLesson> {
  const map = new Map<string, FlatLesson>();
  for (const l of allLessonsFlat()) map.set(l.lessonSlug, l);
  return map;
}

/**
 * השיעורים הבאים המומלצים.
 * עדיפות: השלמת כישור שכבר התחלת > כישור חדש שנפתח > חיזוק כישור חלש.
 */
export function recommendNext(
  masteryById: Map<string, SkillMastery>,
  completed: Set<string>,
  limit = 3
): LessonRecommendation[] {
  const skills = getSkills();
  const byId = new Map(skills.map((s) => [s.id, s]));
  const lessons = lessonIndex();
  const recs: LessonRecommendation[] = [];

  for (const skill of skills) {
    const m = masteryById.get(skill.id);
    if (!m) continue;

    // דרישות-קדם: כל כישור-אב חייב להיות "נפתח" (proficient+) כדי להמליץ על כישור חדש.
    const prereqsMet = skill.prerequisiteSkillIds.every((pid) => {
      const pm = masteryById.get(pid);
      return pm ? isUnlockedBy(pm) : false;
    });

    const firstIncomplete = skill.lessonSlugs.find((s) => !completed.has(s));
    if (!firstIncomplete) continue; // הכישור הושלם — אין מה להמליץ
    const lesson = lessons.get(firstIncomplete);
    if (!lesson) continue;

    const started = m.lessonsDone > 0;
    if (!prereqsMet && !started) continue; // עדיין נעול

    let priority: number;
    let reason: string;
    if (started && m.status === "needs-review") {
      priority = 100 + dependentCount(skill.id);
      reason = "שליטה שדעכה — כדאי לחזור ולהשלים כדי לרענן";
    } else if (started) {
      priority = 80 - skill.globalOrder * 0.01;
      reason = `המשך הכישור שכבר התחלת (${m.lessonsDone}/${m.lessonsTotal} הושלמו)`;
    } else {
      // כישור חדש שנפתח — ככל שקודם בסדר הלימוד, עדיפות גבוהה יותר
      priority = 60 - skill.globalOrder * 0.05;
      reason = "הצעד הבא במסלול — כל דרישות-הקדם הושלמו";
    }

    recs.push({ lesson, skill, reason, priority });
  }

  return recs.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

/** כישורים חלשים שכדאי לחזק, ממוינים לפי חשיבות בגרף ואז לפי חולשה. */
export function detectWeaknesses(
  masteryById: Map<string, SkillMastery>,
  limit = 5
): WeaknessItem[] {
  const skills = getSkills();
  const items: WeaknessItem[] = [];

  for (const skill of skills) {
    const m = masteryById.get(skill.id);
    if (!m || m.lessonsDone === 0) continue; // רק כישורים שהתחילו
    if (m.status !== "learning" && m.status !== "needs-review") continue;

    const importance = dependentCount(skill.id);
    const reason =
      m.status === "needs-review"
        ? "נשלט בעבר אך דעך — מומלץ רענון"
        : m.quizAccuracy !== null && m.quizAccuracy < 0.6
          ? `דיוק נמוך בבחנים (${Math.round(m.quizAccuracy * 100)}%)`
          : "שליטה חלקית — כדאי להעמיק";

    items.push({ skill, mastery: m, importance, reason });
  }

  return items
    .sort((a, b) => b.importance - a.importance || a.mastery.mastery - b.mastery.mastery)
    .slice(0, limit);
}

/** שיעורים שבשלים לחזרה מרווחת, הדחופים (הכי באיחור) ראשונים. */
export function dueReviews(
  reviews: Record<string, SRState>,
  now: number,
  limit = 10
): ReviewItem[] {
  const skills = getSkills();
  const skillForLesson = new Map<string, Skill>();
  for (const s of skills) for (const slug of s.lessonSlugs) skillForLesson.set(slug, s);
  const lessons = lessonIndex();

  return Object.entries(reviews)
    .filter(([, state]) => isDue(state, now))
    .map(([lessonSlug, state]) => ({
      lessonSlug,
      lesson: lessons.get(lessonSlug) ?? null,
      skill: skillForLesson.get(lessonSlug),
      state,
      overdueDays: -daysUntilDue(state, now),
    }))
    .sort((a, b) => b.overdueDays - a.overdueDays)
    .slice(0, limit);
}
