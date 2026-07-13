"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "existing-large-codebases",
  lessonSlug: "project-atlasdesk-safe-extension",
  title: "פרויקט מודול: הרחבת AtlasDesk תוך שמירה על ארכיטקטורה",
  objectives: [
    "להוסיף יכולת משמעותית ל-AtlasDesk בלי לשבור מוסכמות קיימות",
    "לבצע code review עצמי (עם Claude Code) לפני commit",
    "לתעד את ההרחבה בהתאם למוסכמות התיעוד הקיימות בפרויקט",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["ai-assisted-code-review"],
};

const SLIDES: Slide[] = [
  {
    title: "פרויקט המודול: לשלב הכל על AtlasDesk האמיתי",
    bullets: [
      "המשימה: להוסיף יכולת בחירתך ל-AtlasDesk (למשל: ייצוא שיחה כקובץ, חיפוש בהיסטוריית שיחות, או שיפור אחר) — תוך יישום כל מה שנלמד במודול: סיור היכרות, שינויים אינקרמנטליים, מודולריות, וביקורת קוד עצמית.",
    ],
  },
  {
    title: "למה הפרויקט הזה קיים (הנימוק ההנדסי)",
    bullets: [
      "הפרויקט מדמה את המצב הנפוץ ביותר בעבודת מהנדס: לא לבנות מאפס, אלא להרחיב מערכת חיה בלי לשבור אותה. כאן מתאמנים על המשמעת, לא רק על הפיצ'ר.",
      "trade-off מרכזי: התהליך המלא (סיור → פירוק → מודולריות → ביקורת) איטי יותר מ'לזרוק קוד שעובד'. הוא משתלם כשהקוד ימשיך לחיות ולהיתחזק — וכמעט תמיד הוא כן. אם היה זה prototype חד-פעמי לזריקה, המהירות הייתה גוברת; כאן, על מערכת production, העקביות גוברת.",
      "מה נחשב הצלחה: לא 'הפיצ'ר עובד', אלא 'הפיצ'ר עובד ונראה כאילו מהנדס הצוות המקורי כתב אותו' — אותן מוסכמות, אותו מבנה, בלי תבנית מתחרה חדשה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין הפרויקט הזה לפרויקטי המודולים הקודמים בטראק?",
    options: [
      "אין הבדל, זה עוד תרגיל זהה",
      "כאן הדגש הוא לא רק 'להוסיף יכולת' אלא לעשות זאת תוך שמירה מפורשת על מוסכמות קיימות ועם ביקורת קוד עצמית לפני commit",
      "כאן לא צריך להשתמש ב-Claude Code בכלל",
      "כאן אסור להוסיף קבצים חדשים",
    ],
    correctIndex: 1,
    explanation: "הפרויקט משלב 4 כישורים ספציפיים של המודול הזה: היכרות עם קוד קיים, שינויים קטנים, מודולריות, וביקורת עצמית — לא רק 'להוסיף עוד פיצ'ר'.",
    optionNotes: [
      "לא נכון: יש דגש שונה ומפורש — שמירה על ארכיטקטורה קיימת וביקורת עצמית, לא רק תוספת פיצ'ר.",
      "התשובה הנכונה: זה בדיוק המיקוד — לא 'מה נוסף' אלא 'איך זה נוסף' בהתאם לכל מה שהמודול לימד.",
      "לא נכון: Claude Code הוא כלי העבודה המרכזי כאן, בדיוק כמו בכל שיעור אחר בטראק.",
      "לא נכון: הוספת קבצים חדשים לפי מודולריות טובה (שיעור 3) היא בדיוק מה שרצוי, לא אסור.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הפרויקט המסכם של המודול", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="פרויקט זה קיים כדי לתרגל עבודה על קוד production אמיתי (לא דוגמה מבודדת) עם כל המשמעת שהמודול לימד — סיור, שינויים קטנים, מודולריות, ביקורת."
        alternatives="אפשר להוסיף את היכולת בלי שום אחד מהכישורים האלו — יהיה מהיר יותר, אבל בדיוק מפספס את התרגול."
        whenNotTo="—"
        commonMistakes="לדלג על ביקורת הקוד העצמית 'כי אין זמן' — זה בדיוק השלב שהכי משתלם על השקעה קטנה."
        cost="השקעת הזמן בתהליך המלא (סיור+פירוק+ביקורת) גדולה יותר מ'לזרוק קוד' — אבל מייצרת הרחבה שמתאימה למוסכמות הקיימות ולא תדרוש תיקון מאוחר יותר."
        realWorld="זו בדיוק העבודה היומיומית של מהנדס AI בצוות אמיתי — תוספות קטנות, בטוחות, עקביות עם מה שכבר קיים."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="existing-code-project-atlasdesk-safe-extension"
        title="הוסף יכולת ל-AtlasDesk תוך שמירה על ארכיטקטורה"
        context="עבוד מול הריפו האמיתי של AtlasDesk."
        steps={[
          "בחר יכולת (ייצוא שיחה, חיפוש בהיסטוריה, או רעיון משלך) ובצע סיור היכרות קצר במבנה הקיים הרלוונטי.",
          "פרק את המימוש לסדרת שינויים קטנים ועצמאיים (כמו בשיעור 2).",
          "ודא שכל קובץ חדש ממוקם לפי מוסכמות המודולריות הקיימות (lib/atlasdesk/ ללוגיקה, components/ ל-UI).",
          "לפני commit סופי, בקש מ-Claude Code ביקורת קוד מלאה לפי checklist (שיעור 4).",
        ]}
        successCriteria={[
          "היכולת החדשה עובדת ומשולבת בפועל ב-AtlasDesk",
          "המבנה עוקב אחר המוסכמות הקיימות, לא יוצר תבנית חדשה סותרת",
          "עברת ביקורת קוד עצמית מפורשת לפני ה-commit הסופי",
        ]}
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "homework",
    label: "סיכום מודול",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">סיימת את מודול העבודה עם קוד קיים ופרויקטים גדולים!</p>
        <p className="mt-1 text-muted">
          למדת: סיור היכרות, שינויים אינקרמנטליים, מודולריות, וביקורת קוד — ותרגלת הכל על
          AtlasDesk האמיתי. במודול הבא (האחרון בטראק) נעבור למשמעת הנדסית: Git workflows, תיעוד,
          וניהול סשן ארוך-טווח.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
