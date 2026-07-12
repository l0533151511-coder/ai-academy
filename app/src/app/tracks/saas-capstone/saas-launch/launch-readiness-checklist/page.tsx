"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-launch",
  lessonSlug: "launch-readiness-checklist",
  title: "רשימת מוכנות להשקה",
  objectives: [
    "לבנות checklist השקה מלא: טכני, אבטחה, עסקי, תיעוד",
    "להבין את ההבדל בין 'עובד' ל'מוכן להשקה ציבורית'",
    "לזהות את 3 הפערים הקריטיים ביותר שנותרו ב-AtlasDesk",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["onboarding-and-activation"],
};

const SLIDES: Slide[] = [
  {
    title: "המודול האחרון: לפני שלוחצים 'launch'",
    bullets: [
      "לאורך כל האקדמיה, AtlasDesk נבנה עם משמעת הנדסית — כל תכונה אומתה ב-build, typecheck, ובדיקה חיה. אבל 'מוכן טכנית' ו'מוכן להשקה ציבורית' הם עדיין שני דברים שונים.",
      "checklist השקה מכסה 4 תחומים: טכני (יציבות, ביצועים), אבטחה (הגנות שנבנו), עסקי (תמחור, billing), ותיעוד (מה משתמש חדש צריך לדעת).",
    ],
  },
  {
    title: "מה כבר קיים, מה עדיין חסר",
    bullets: [
      "קיים: ניטור (Production AI), הגנת prompt injection, הגנת webhook, MVP מוגדר, אסטרטגיית תמחור.",
      "חסר: auth מלא (users/orgs), monitoring persistent ב-DB (לא in-memory), billing מחובר בפועל (לא רק תכנון).",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'עובד ב-build ו-typecheck' לא מספיק כדי להגיד ש-AtlasDesk 'מוכן להשקה'?",
    options: [
      "זה כן מספיק, אין שום דבר נוסף לבדוק",
      "כי מוכנות להשקה כוללת גם תחומים שbuild/typecheck לא בודקים בכלל: אבטחה בפועל, יעדי SLA ריאליים, מודל עסקי (תמחור/billing), ותיעוד למשתמש חדש",
      "כי build תמיד נכשל בסביבת production",
      "כי typecheck לא רלוונטי לקוד JavaScript"
    ],
    correctIndex: 1,
    explanation: "build/typecheck בודקים תקינות קוד — לא בודקים אם המערכת מאובטחת, אם יש מודל עסקי בר-קיימא, או אם משתמש חדש יודע איך להתחיל.",
    optionNotes: [
      "לא נכון: יש הרבה מעבר לזה — build ירוק הוא תנאי הכרחי אבל לא מספיק.",
      "התשובה הנכונה: מוכנות להשקה היא רב-ממדית — טכני הוא רק מימד אחד מתוך כמה.",
      "לא נכון: build לא 'נכשל תמיד' בפרודקשן — זו לא הסיבה שהוא לא מספיק כמדד יחיד.",
      "לא נכון: typecheck רלוונטי ל-TypeScript (מה שהפרויקט משתמש בו) — זו לא הסיבה שהוא לא מספיק לבד.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: 4 תחומי מוכנות להשקה", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="checklist השקה מקיף קיים כי אף תחום בודד (טכני/עסקי/אבטחה/תיעוד) לא מספיק לבד — מוצר יכול להיות מושלם טכנית ועדיין להיכשל בגלל תיעוד גרוע או מודל עסקי לא בר-קיימא."
        alternatives="להשיק 'כשזה עובד' בלי checklist מסודר — עובד לפעמים, אבל מסתכן בפספוס פער קריטי (כמו auth חסר) שמתגלה רק אחרי שכבר יש לקוחות אמיתיים."
        whenNotTo="—"
        commonMistakes="להתמקד רק בתחום אחד (למשל טכני) ולהזניח את השאר (עסקי, תיעוד) — כל מודל האקדמיה מלמד שכל תחום דורש תשומת לב משלו."
        cost="checklist מקיף עולה זמן בדיקה לפני השקה — הרבה יותר זול מגילוי פער קריטי אחרי שלקוחות אמיתיים כבר תלויים במוצר."
        realWorld="זה בדיוק התהליך שכל startup עובר לפני launch — לא רק 'הקוד עובד', אלא בדיקה הוליסטית של כל מה שצריך כדי לשרת לקוחות אמיתיים."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="saas-launch-launch-readiness-checklist"
        title="בנה checklist השקה מלא ל-AtlasDesk וזהה 3 הפערים הקריטיים"
        context="עבוד עם Claude Code על סמך כל מה שנבנה לאורך האקדמיה כולה."
        steps={[
          "בנו checklist עם 4 קטגוריות (טכני, אבטחה, עסקי, תיעוד), ולכל אחת רשמו מה כבר קיים (✅) ומה חסר (⬜) מ-AtlasDesk.",
          "דרגו כל פריט חסר לפי חומרה: קריטי (לא ניתן להשיק בלעדיו) מול נחמד-שיהיה.",
          "זהו את 3 הפערים הקריטיים ביותר — אלו שחייבים להיסגר לפני השקה אמיתית.",
        ]}
        successCriteria={[
          "יש לך checklist מלא עם סטטוס אמיתי לכל פריט (לא ניחוש)",
          "יש לך 3 פערים קריטיים מדורגים ומנומקים",
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
          חפש checklist השקה פומבי של חברת SaaS (יש כמה בלוגים טכניים מוכרים). כמה מהקטגוריות
          חופפות למה שבנית כאן?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
