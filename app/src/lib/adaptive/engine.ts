// האורקסטרטור המרכזי של מנוע הלמידה האדפטיבי.
//
// מקבל תמונת-מצב של הלומד (נגזרת מ-progress store) ומחזיר "דו"ח אדפטיבי" מלא:
// שליטה לכל כישור, המלצות המשך, זיהוי חולשות, חזרות שבשלו, ואנליטיקת למידה מצרפית.
// טהור לחלוטין — אפשר להריץ בשרת, בבדיקות, או בדפדפן.

import { getSkills, type Skill } from "./skills";
import { estimateSkillMastery, type LearnerSignal, type SkillMastery, type QuizRecord } from "./mastery";
import { recommendNext, detectWeaknesses, dueReviews, type LessonRecommendation, type WeaknessItem, type ReviewItem } from "./recommend";
import type { SRState } from "./spaced-repetition";

/** קלט המנוע — בדיוק מה שנשמר ב-progress store (הרחבה של ProgressState). */
export interface AdaptiveInput {
  completedLessons: string[];
  completedAt: Record<string, string>;
  quizzes: Record<string, QuizRecord>;
  reviews: Record<string, SRState>;
  now: number;
}

export interface LearningAnalytics {
  totalSkills: number;
  skillsStarted: number;
  skillsMastered: number;
  skillsProficient: number;
  skillsNeedingReview: number;
  /** שליטה ממוצעת על פני כישורים שהתחילו (0..1) */
  averageMastery: number;
  /** אחוז הקוריקולום שהושלם (שיעורים) */
  overallCompletion: number;
  /** דיוק ממוצע בכל הבחנים (0..1) או null */
  overallQuizAccuracy: number | null;
  /** התפלגות סטטוסים לגרף */
  statusBreakdown: Record<SkillMastery["status"], number>;
}

export interface AdaptiveReport {
  masteryById: Map<string, SkillMastery>;
  masteryList: { skill: Skill; mastery: SkillMastery }[];
  recommendations: LessonRecommendation[];
  weaknesses: WeaknessItem[];
  reviews: ReviewItem[];
  analytics: LearningAnalytics;
}

function computeAnalytics(
  masteryList: { skill: Skill; mastery: SkillMastery }[],
  input: AdaptiveInput
): LearningAnalytics {
  const statusBreakdown: Record<SkillMastery["status"], number> = {
    "not-started": 0,
    learning: 0,
    proficient: 0,
    mastered: 0,
    "needs-review": 0,
  };
  let masterySum = 0;
  let started = 0;
  for (const { mastery } of masteryList) {
    statusBreakdown[mastery.status]++;
    if (mastery.lessonsDone > 0) {
      masterySum += mastery.mastery;
      started++;
    }
  }

  const totalLessons = masteryList.reduce((s, m) => s + m.mastery.lessonsTotal, 0);
  const doneLessons = input.completedLessons.length;

  let qCorrect = 0;
  let qTotal = 0;
  for (const q of Object.values(input.quizzes)) {
    qCorrect += q.correct;
    qTotal += q.total;
  }

  return {
    totalSkills: masteryList.length,
    skillsStarted: started,
    skillsMastered: statusBreakdown.mastered,
    skillsProficient: statusBreakdown.proficient,
    skillsNeedingReview: statusBreakdown["needs-review"],
    averageMastery: started === 0 ? 0 : masterySum / started,
    overallCompletion: totalLessons === 0 ? 0 : doneLessons / totalLessons,
    overallQuizAccuracy: qTotal === 0 ? null : qCorrect / qTotal,
    statusBreakdown,
  };
}

/** מחשב את הדו"ח האדפטיבי המלא. זו נקודת הכניסה היחידה שה-UI צריך. */
export function buildAdaptiveReport(input: AdaptiveInput): AdaptiveReport {
  const skills = getSkills();
  const signal: LearnerSignal = {
    completedLessons: new Set(input.completedLessons),
    completedAt: input.completedAt,
    quizzes: input.quizzes,
    now: input.now,
  };

  const masteryList = skills.map((skill) => ({
    skill,
    mastery: estimateSkillMastery(skill, signal),
  }));
  const masteryById = new Map(masteryList.map((m) => [m.skill.id, m.mastery]));

  return {
    masteryById,
    masteryList,
    recommendations: recommendNext(masteryById, signal.completedLessons, 3),
    weaknesses: detectWeaknesses(masteryById, 5),
    reviews: dueReviews(input.reviews, input.now, 10),
    analytics: computeAnalytics(masteryList, input),
  };
}
