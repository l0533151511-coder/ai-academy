"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "production-best-practices",
  lessonSlug: "feature-flags-safe-rollout",
  title: "Feature Flags ופריסה בטוחה",
  objectives: [
    "להבין feature flags ככלי לפריסה הדרגתית ובטוחה",
    "להכיר rollback כתגובה מהירה לתקלה בפרודקשן",
    "לתכנן אסטרטגיית פריסה ליכולת AI חדשה",
  ],
  estMinutes: 25,
  difficulty: "מתקדם",
  prerequisites: ["sla-reliability-targets"],
};

const SLIDES: Slide[] = [
  {
    title: "כל 8 היכולות של AtlasDesk נפרסו 'הכל או כלום'",
    bullets: [
      "עד כה, כל יכולת חדשה ב-AtlasDesk (RAG, סוכן, אסקלציה) הופעלה מיידית לכולם ברגע ה-push. זה עבד באקדמיה כי אין משתמשים אמיתיים תלויים — אבל במוצר production אמיתי, זה מסוכן.",
      "Feature flag הוא 'מתג' שמאפשר להפעיל יכולת חדשה רק לחלק מהמשתמשים (5%, למשל), לבדוק שהיא יציבה, ורק אז להרחיב ל-100%.",
    ],
  },
  {
    title: "Rollback — כשמשהו משתבש",
    bullets: [
      "אם יכולת חדשה מתגלה כבעייתית אחרי פריסה, rollback מהיר (חזרה לגרסה הקודמת, או כיבוי ה-feature flag) הוא הרבה יותר מהיר מ'תיקון חירום' בקוד.",
      "feature flag הופך rollback למיידי — פשוט מכבים את המתג, בלי צורך ב-deploy חדש.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה feature flag הופך rollback למהיר יותר מ-git revert רגיל?",
    options: [
      "אין הבדל, שניהם לוקחים אותו זמן",
      "כי כיבוי feature flag הוא שינוי מיידי (toggle) בלי צורך ב-deploy חדש; git revert דורש commit, push, ודיפלוי מחדש — תהליך איטי יותר בזמן משבר",
      "git revert לא עובד על קוד AI",
      "feature flags דורשים שרת נפרד"
    ],
    correctIndex: 1,
    explanation: "feature flag הוא מתג שכבר קיים בקוד הפרוס — כיבויו מיידי; git revert דורש מעבר דרך כל צינור הדיפלוי מחדש, מה שלוקח יותר זמן בדיוק כשהזמן הכי קריטי (תקרית).",
    optionNotes: [
      "לא נכון: יש הבדל משמעותי במהירות — feature flag מיידי, git revert דורש דיפלוי מחדש.",
      "התשובה הנכונה: זה בדיוק היתרון — תגובה מיידית בלי לחכות לצינור דיפלוי שלם.",
      "לא נכון: git revert עובד על כל קוד, כולל קוד AI — זו לא הסיבה.",
      "לא נכון: feature flags יכולים להיות מיושמים גם כמשתני סביבה פשוטים, בלי שרת נפרד.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: פריסה הדרגתית ובטוחה", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: פריסה מיידית מול הדרגתית",
    content: (
      <PromptComparisonLab
        title="פריסת יכולת AI חדשה ל-AtlasDesk"
        unitLabel="אסטרטגיית פריסה"
        bad={{
          label: "'הכל או כלום' (מה שנעשה עד כה באקדמיה)",
          content: `push → deploy → כל המשתמשים מקבלים את היכולת
החדשה מיידית, בלי אפשרות לכבות רק אותה`,
          outcome: "אם היכולת החדשה מתגלה כבעייתית (עלות גבוהה מהצפוי, תשובות שגויות), הפתרון היחיד הוא git revert מלא + דיפלוי מחדש — לוקח דקות יקרות בזמן שמשתמשים חווים בעיה.",
        }}
        good={{
          label: "פריסה הדרגתית עם feature flag",
          content: `const ENABLE_NEW_FEATURE = process.env.FEATURE_X === "true"
if (ENABLE_NEW_FEATURE) { /* קוד היכולת החדשה */ }
// מתחילים עם 5% מהמשתמשים, מרחיבים בהדרגה`,
          outcome: "אם משהו משתבש, כיבוי המשתנה הוא שינוי מיידי (לא דורש deploy) — rollback תוך שניות במקום דקות.",
        }}
        takeaway="פריסה הדרגתית עם feature flags היא בדיוק אותו עיקרון כמו incremental changes (מודול Claude Code Mastery) — שינויים קטנים ומדודים, לא 'הכל בבת אחת', רק ברמת הפריסה במקום ברמת הקוד."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="feature flags קיימים כי פריסה מיידית ל-100% מהמשתמשים היא הימור גדול — אם יש בעיה, כל המשתמשים חווים אותה בו-זמנית."
        alternatives="בלי feature flags (מה שנעשה באקדמיה עד כה) — פשוט יותר למימוש, מקובל לפרויקט לימודי בלי משתמשים אמיתיים תלויים."
        whenNotTo="לפרויקט לימודי/דמו — feature flags הם overhead מיותר בלי משתמשים אמיתיים שתלויים ביציבות."
        commonMistakes="להוסיף feature flag אבל לשכוח להסיר אותו אחרי שהיכולת יציבה לגמרי — flags שנשארים לנצח מצטברים לחוב טכני (קוד מת מותנה)."
        cost="feature flags מוסיפים מורכבות קוד קטנה (תנאי if) — אבל חוסכים נזק גדול בהרבה כשמתגלה בעיה בפריסה."
        realWorld="בפרויקט המודול הבא (הסיכום הסופי) תשקול אילו מיכולות AtlasDesk העתידיות היו ראויות לפריסה הדרגתית עם feature flag."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="production-best-practices-feature-flags-safe-rollout"
        title="עצב feature flag ליכולת AI עתידית ב-AtlasDesk"
        context="עבוד עם Claude Code — תכנון, לא מימוש בפועל."
        steps={[
          "בחר יכולת עתידית שהיית רוצה להוסיף ל-AtlasDesk (למשל: תמיכה בשפה נוספת).",
          "בקש מ-Claude Code להציע מבנה feature flag (משתנה סביבה + תנאי בקוד) לפריסה הדרגתית שלה.",
          "דון: איך היית מודד אם 5% מהמשתמשים הראשונים חווים בעיה, לפני שמרחיבים ל-100%?",
        ]}
        successCriteria={[
          "יש לך מבנה feature flag קונקרטי, לא רק רעיון",
          "יש לך תוכנית מדידה להחלטה מתי להרחיב את הפריסה",
        ]}
      />
    ),
  },
  {
    id: "homework",
    label: "שיעורי בית",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">שיעורי בית:</p>
        <p className="mt-1 text-muted">
          חשוב על פעם שפריסת קוד (בכל פרויקט) גרמה לתקלה שהייתה נמנעת עם feature flag ופריסה
          הדרגתית. מה בדיוק היה קורה אחרת?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
