// גרף הידע (Knowledge Graph) של האקדמיה.
//
// אנחנו לא מתייגים ידנית 269 שיעורים. במקום זה, כל *מודול* בקוריקולום = "כישור" (Skill)
// יחיד, וקשתות הדרישות-קדם נגזרות אוטומטית משני מקורות:
//   1. סדר הלימוד — כל מודול תלוי במודול שלפניו באותו טראק; המודול הראשון בטראק תלוי
//      במודול האחרון של הטראק הקודם (לפי order). זה יוצר עמוד-שדרה לינארי של ה-DAG.
//   2. דרישות-קדם מפורשות ברמת השיעור — אם שיעור מציין prerequisites ששייכים למודול אחר,
//      נוספת קשת חוצת-מודולים. זה מה שהופך את הגרף לרשת אמיתית ולא לשרשרת בלבד.
//
// הכל נגזר פעם אחת מ-TRACKS (מקור אמת יחיד) — אין כפילות נתונים.

import { TRACKS } from "@/lib/curriculum/data";
import type { Difficulty } from "@/lib/curriculum/types";

export interface Skill {
  /** מזהה ייחודי בכל הקוריקולום: `${trackSlug}/${moduleSlug}` */
  id: string;
  title: string;
  description: string;
  trackSlug: string;
  trackTitle: string;
  trackColor: string;
  trackOrder: number;
  moduleSlug: string;
  /** מיקום המודול בתוך הטראק (0-based) */
  moduleIndex: number;
  /** מיקום גלובלי בסדר הלימוד — לשימוש במיון והמלצות */
  globalOrder: number;
  lessonSlugs: string[];
  /** רמת הקושי הדומיננטית של שיעורי המודול */
  difficulty: Difficulty;
  isCapstone: boolean;
  /** מזהי כישורים שיש לשלוט בהם לפני כישור זה (DAG, ללא כפילויות) */
  prerequisiteSkillIds: string[];
}

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  מתחיל: 1,
  בינוני: 2,
  מתקדם: 3,
};

function dominantDifficulty(diffs: Difficulty[]): Difficulty {
  if (diffs.length === 0) return "בינוני";
  // ממוצע משוקלל -> העיגול הקרוב ביותר לאחת מ-3 הרמות
  const avg = diffs.reduce((s, d) => s + DIFFICULTY_WEIGHT[d], 0) / diffs.length;
  if (avg < 1.5) return "מתחיל";
  if (avg < 2.5) return "בינוני";
  return "מתקדם";
}

// ---- בנייה חד-פעמית וממוזכרת של הגרף ----

let cachedSkills: Skill[] | null = null;
let cachedBySlug: Map<string, Skill> | null = null; // lessonSlug -> Skill המכיל אותו

function build(): Skill[] {
  const orderedTracks = [...TRACKS].sort((a, b) => a.order - b.order);

  const skills: Skill[] = [];
  const lessonToSkillId = new Map<string, string>();
  let globalOrder = 0;

  for (const track of orderedTracks) {
    track.modules.forEach((module, moduleIndex) => {
      const id = `${track.slug}/${module.slug}`;
      const lessonSlugs = module.lessons.map((l) => l.slug);
      for (const slug of lessonSlugs) lessonToSkillId.set(slug, id);

      skills.push({
        id,
        title: module.title,
        description: module.description,
        trackSlug: track.slug,
        trackTitle: track.title,
        trackColor: track.color,
        trackOrder: track.order,
        moduleSlug: module.slug,
        moduleIndex,
        globalOrder: globalOrder++,
        lessonSlugs,
        difficulty: dominantDifficulty(module.lessons.map((l) => l.difficulty)),
        isCapstone: Boolean(module.isCapstone),
        prerequisiteSkillIds: [], // ממולא בשלב שני
      });
    });
  }

  const byId = new Map(skills.map((s) => [s.id, s]));

  // שלב שני: קשתות דרישות-קדם
  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const prereqs = new Set<string>();

    // 1. עמוד-שדרה: המודול הקודם בסדר הלימוד הגלובלי
    if (i > 0) prereqs.add(skills[i - 1].id);

    // 2. דרישות-קדם מפורשות ברמת השיעור -> המודול שמכיל אותן
    const track = orderedTracks.find((t) => t.slug === skill.trackSlug);
    const module = track?.modules.find((m) => m.slug === skill.moduleSlug);
    for (const lesson of module?.lessons ?? []) {
      for (const prereqLessonSlug of lesson.prerequisites) {
        const targetSkillId = lessonToSkillId.get(prereqLessonSlug);
        if (targetSkillId && targetSkillId !== skill.id) prereqs.add(targetSkillId);
      }
    }

    // מסננים דרישות שמצביעות "קדימה" (מונע מעגלים) — כישור יכול לתלות רק במה שקודם לו
    skill.prerequisiteSkillIds = [...prereqs].filter(
      (pid) => (byId.get(pid)?.globalOrder ?? Infinity) < skill.globalOrder
    );
  }

  return skills;
}

/** כל הכישורים (מודולים) בסדר הלימוד. ממוזכר — נבנה פעם אחת. */
export function getSkills(): Skill[] {
  if (!cachedSkills) cachedSkills = build();
  return cachedSkills;
}

/** מפה: lessonSlug -> הכישור (המודול) שמכיל אותו. */
export function skillForLesson(lessonSlug: string): Skill | undefined {
  if (!cachedBySlug) {
    const skills = getSkills();
    const map = new Map<string, Skill>();
    for (const s of skills) for (const slug of s.lessonSlugs) map.set(slug, s);
    cachedBySlug = map;
  }
  return cachedBySlug.get(lessonSlug);
}

/** מספר הכישורים שתלויים (ישירות) בכישור נתון — מדד "חשיבות" בגרף. */
export function dependentCount(skillId: string): number {
  return getSkills().filter((s) => s.prerequisiteSkillIds.includes(skillId)).length;
}

export function getSkillById(id: string): Skill | undefined {
  return getSkills().find((s) => s.id === id);
}
