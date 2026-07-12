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
  lessonSlug: "sla-reliability-targets",
  title: "SLA ויעדי אמינות",
  objectives: [
    "להבין SLA/SLO/SLI כשפה משותפת לתיאור אמינות",
    "לקבוע יעדי אמינות ריאליים למערכת AI (זמינות, latency, שיעור הצלחה)",
    "להבין את הפשרה בין אמינות גבוהה לעלות/מורכבות",
  ],
  estMinutes: 25,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: הקשחת AtlasDesk מפני Prompt Injection"],
};

const SLIDES: Slide[] = [
  {
    title: "מודול אחרון: לסכם הכל למוצר production אמיתי",
    bullets: [
      "SLI (Service Level Indicator) — מדד בפועל (למשל: אחוז הבקשות שהצליחו).",
      "SLO (Service Level Objective) — יעד פנימי (למשל: 99% מהבקשות מצליחות).",
      "SLA (Service Level Agreement) — הבטחה חוזית ללקוח (למשל: 'נחזיר כסף אם הזמינות נופלת מ-99.5%').",
    ],
  },
  {
    title: "יעדים ייחודיים למערכות AI",
    bullets: [
      "לא רק זמינות (uptime) — גם: latency (זמן תגובה סביר), שיעור הצלחת כלים (tool calls שמצליחים), ושיעור 'תשובות ללא grounding' (מודל שממציא במקום להודות שאין לו מידע).",
      "AtlasDesk כבר אוסף חלק מהמדדים האלו (מודול Monitoring) — עכשיו צריך לקבוע יעדים ריאליים לכל אחד.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין SLI, SLO, ו-SLA?",
    options: [
      "אין הבדל, שלושתם מתארים את אותו דבר",
      "SLI הוא המדד בפועל (מה שקורה), SLO הוא היעד הפנימי (מה שרוצים שיקרה), SLA הוא ההבטחה החוזית ללקוח (מה שמובטח שיקרה)",
      "SLA הוא היחיד שרלוונטי למערכות AI",
      "SLI נמדד רק פעם בשנה"
    ],
    correctIndex: 1,
    explanation: "שלושת המונחים בונים זה על זה: מודדים (SLI), קובעים יעד פנימי (SLO), ולפעמים מתחייבים כלפי חוץ (SLA) — כל אחד ברמה אחרת.",
    optionNotes: [
      "לא נכון: יש הבדל מהותי בין מדידה, יעד פנימי, והתחייבות חיצונית.",
      "התשובה הנכונה: זו בדיוק ההיררכיה — SLI מודד, SLO מכוון, SLA מתחייב כלפי חוץ.",
      "לא נכון: כל שלושת המונחים רלוונטיים למערכות AI, לא רק SLA.",
      "לא נכון: SLI נמדד ברציפות (בזמן אמת או תדיר), לא רק פעם בשנה.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: שפת האמינות המשותפת", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: יעד אמינות לא-ריאלי מול ריאלי",
    content: (
      <PromptComparisonLab
        title="קביעת SLO ל-AtlasDesk"
        unitLabel="גישת יעד"
        bad={{
          label: "יעד לא-ריאלי ('100% תמיד')",
          content: `SLO: "100% מהבקשות מצליחות, תמיד, ללא יוצא מהכלל"`,
          outcome: "בלתי אפשרי בפועל — Claude API עצמו יכול להיות איטי/לא-זמין מדי פעם (תלות חיצונית), ולא בשליטתך המלאה. יעד כזה מבטיח כישלון תמידי במדידה.",
        }}
        good={{
          label: "יעד ריאלי מבוסס נתונים",
          content: `SLO: "99% מהבקשות מסתיימות תוך 5 שניות, 95% מהתשובות
עם RAG כוללות ציטוט מקור תקף" — מבוסס נתוני
/api/atlasdesk/stats בפועל`,
          outcome: "יעד מדיד, ריאלי, ומבוסס נתונים אמיתיים — אפשר לדעת אם עומדים בו או לא, ולשפר בהדרגה.",
        }}
        takeaway="SLO טוב הוא ריאלי ומדיד — לא שאיפה מושלמת שאי אפשר לעמוד בה. תלות בשירות חיצוני (Claude API) אומרת שאתה לא יכול להבטיח 100%, רק לשאוף ליעד גבוה וסביר."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="SLA/SLO/SLI קיימים כי 'אמינות' היא מושג מעורפל בלי הגדרה מדויקת ומדידה — השפה הזו הופכת אותו למשהו שאפשר לתכנן ולעקוב אחריו."
        alternatives="לעבוד בלי יעדים מוגדרים ('נעשה כמה שיותר טוב') — עובד לפרויקט קטן, אבל אין דרך לדעת אם המערכת 'מספיק אמינה' בלי יעד מוגדר להשוואה."
        whenNotTo="לפרויקט לימודי/דמו (כמו AtlasDesk הנוכחי) — SLA פורמלי הוא overhead; מספיק SLO פנימי לא-פורמלי."
        commonMistakes="לקבוע יעד לא-ריאלי (100%) שמבטיח כישלון תמידי במדידה, במקום יעד גבוה אך ברור-שהוא-בר-השגה."
        cost="אמינות גבוהה יותר (99.9% לעומת 99%) עולה משמעותית יותר במורכבות הנדסית (redundancy, retries, fallbacks) — יעד AMBITIOUS מדי בלי הצדקה עסקית הוא בזבוז."
        realWorld="בפרויקט המודול הבא תסכם את כל הטראק במסמך אחד: runbook תקריות + יעדי SLA ריאליים ל-AtlasDesk."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="production-best-practices-sla-reliability-targets"
        title="קבע SLO ריאלי ל-AtlasDesk"
        context="עבוד עם /api/atlasdesk/stats (מודול Monitoring) על AtlasDesk האמיתי."
        steps={[
          "בדוק את הנתונים הקיימים ב-/api/atlasdesk/stats (latency ממוצע, עלות).",
          "עם Claude Code, קבע 3 יעדי SLO ריאליים (latency, שיעור הצלחה, שיעור grounding) מבוססים על מה שנמדד בפועל.",
          "דון: מה היה קורה אם היית מגדיר יעד שאפתני מדי (99.99%)? מה זה היה דורש הנדסית?",
        ]}
        successCriteria={[
          "יש לך 3 יעדי SLO מבוססי נתונים אמיתיים, לא ניחוש",
          "אתה מבין את הפשרה בין רמת אמינות למורכבות/עלות הנדסית",
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
          חפש SLA פומבי של שירות ענן שאתה מכיר (AWS, Vercel, OpenAI). מה היעד המדויק, ומה
          הפיצוי שמובטח אם לא עומדים בו?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
