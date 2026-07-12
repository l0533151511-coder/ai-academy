"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "monitoring-scale",
  lessonSlug: "observability-fundamentals-for-ai",
  title: "יסודות Observability למערכות AI",
  objectives: [
    "להבין שלושת עמודי ה-observability: logs, metrics, traces",
    "להכיר מדדים ייחודיים ל-AI (טוקנים, עלות, latency, שיעור הצלחת כלים)",
    "לזהות מה חייבים לתעד בכל קריאת API בפרודקשן",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: הערכת מודל מותאם מול RAG/פרומפט"],
};

const SLIDES: Slide[] = [
  {
    title: "מודול חדש: Production AI",
    bullets: [
      "AtlasDesk עכשיו כולל 8+ יכולות אמיתיות. אבל 'עובד' ו'ניתן לניטור/תחזוקה בפרודקשן' הם שני דברים שונים — המודול הזה סוגר את הפער.",
      "Observability = היכולת להבין מה קורה במערכת בלי לצטרך 'לנחש' — דרך שלושה כלים: logs (מה קרה), metrics (כמה/באיזו תדירות), traces (איך בקשה בודדת זרמה דרך המערכת).",
    ],
  },
  {
    title: "מדדים ייחודיים ל-AI",
    bullets: [
      "מעבר למדדי web רגילים (זמן תגובה, שגיאות), מערכות AI צריכות: טוקני קלט/פלט, עלות לקריאה, מספר סיבובי tool-calling, ושיעור אסקלציה/כישלון.",
      "AtlasDesk כבר אוסף חלק מזה (usage בתוך תגובת ה-API), אבל זה לא 'נשמר' לניתוח מצטבר — זה בדיוק מה שהמודול הזה מוסיף.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה שלושת עמודי ה-observability, ולמה כל אחד נחוץ בנפרד?",
    options: [
      "רק logs נחוצים, השאר מיותר",
      "Logs (מה קרה, אירוע ספציפי), Metrics (מגמות מצטברות לאורך זמן), Traces (מסלול בקשה בודדת דרך המערכת) — כל אחד עונה על שאלה שונה",
      "כולם אותו דבר בשם אחר",
      "רק metrics רלוונטי למערכות AI, logs ו-traces רק ל-web רגיל"
    ],
    correctIndex: 1,
    explanation: "כל עמוד עונה על שאלה שונה: logs='מה קרה כרגע', metrics='מה המגמה הכללית', traces='איך בקשה ספציפית זרמה' — יחד הם נותנים תמונה מלאה.",
    optionNotes: [
      "לא נכון: logs לבד לא מראים מגמות (למשל 'עלות עולה בהדרגה') — צריך גם metrics.",
      "התשובה הנכונה: שלושתם משלימים זה את זה — כל אחד עונה על שאלה שהשניים האחרים לא עונים עליה.",
      "לא נכון: יש הבדל ברור בתפקיד של כל אחד — הם לא כפולים זה של זה.",
      "לא נכון: כל שלושת העמודים רלוונטיים גם ל-AI וגם ל-web רגיל — רק המדדים הספציפיים משתנים.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: observability למערכות AI", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: לוגינג מינימלי מול observability מלא",
    content: (
      <PromptComparisonLab
        title="קריאה ל-/api/ai/rag-chat ב-AtlasDesk"
        unitLabel="גישת ניטור"
        bad={{
          label: "בלי שום לוגינג מובנה",
          content: `// אין שום תיעוד של מה קרה בקריאה הזו
const response = await client.messages.create(...)
return NextResponse.json({ content: ... })`,
          outcome: "אם משהו משתבש בפרודקשן (עלות קופצת, שגיאות מצטברות), אין שום נתון היסטורי לחקור — צריך לחכות שזה יקרה שוב כדי לתפוס את זה.",
        }}
        good={{
          label: "לוגינג מובנה לכל קריאה",
          content: `logEvent({ route: "rag-chat", inputTokens, outputTokens,
  costUsd, latencyMs, sourcesFound: relevant.length,
  timestamp: Date.now() })`,
          outcome: "כל קריאה משאירה 'עקבות' — אפשר לנתח מגמות (עלות עולה? latency גדל?) בלי לחכות שהבעיה תקרה שוב ותופתע ממנה.",
        }}
        takeaway="observability הוא לא 'נחמד שיהיה' — הוא ההבדל בין לגלות בעיה תוך דקות (מתוך נתונים) לגלות אותה רק כשמשתמש מתלונן."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="observability קיים כי מערכות production מורכבות מכדי 'לדעת מה קורה' רק מתוך תחושת בטן — צריך נתונים אמיתיים."
        alternatives="להסתמך על דיווחי משתמשים ('זה איטי') — עובד רק בדיעבד, אחרי שהנזק כבר קרה; observability מזהה בעיות לפני שמישהו מתלונן."
        whenNotTo="לפרויקט לימודי קטן (כמו AtlasDesk בשלביו המוקדמים) — observability מלא הוא overhead; מספיק לוג בסיסי."
        commonMistakes="לאסוף נתונים בלי לשאול מה תעשה איתם — לוגינג שאף אחד לא קורא/מנתח הוא בזבוז משאבים."
        cost="לוגינג עצמו כמעט חינמי (כמה מילישניות נוספות) — אבל דורש איפה לשמור ולאחסן את הנתונים (DB, שירות חיצוני)."
        realWorld="בפרויקט המודול הבא תוסיף בדיוק את זה: לוגינג מובנה לכל נתיבי ה-API של AtlasDesk + endpoint סטטיסטיקות."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Logs", "רשומות אירועים בודדים — 'מה קרה' ברגע נתון."],
          ["Metrics", "מדדים מצטברים לאורך זמן — מגמות."],
          ["Traces", "מעקב אחרי בקשה בודדת דרך כל שלבי המערכת."],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg bg-card p-3">
            <dt className="font-bold text-primary">{term}</dt>
            <dd className="text-sm text-muted">{def}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="monitoring-observability-fundamentals-for-ai"
        title="תכנן סכמת לוגינג ל-AtlasDesk"
        context="עבוד עם Claude Code — תכנון, המימוש בפרויקט הבא."
        steps={[
          "עם Claude Code, הציעו רשימת שדות ללוג אירוע (event) לכל קריאת AI ב-AtlasDesk.",
          "דון: אילו מדדים היו הכי חשובים לך לראות בדשבורד ניטור?",
        ]}
        successCriteria={[
          "יש לך סכמת לוג ברורה עם שדות קונקרטיים",
          "יש לך רשימת מדדים מנומקת, לא רק 'לנטר הכל'",
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
          חשוב על תקלה שהייתה לך לאחרונה בכל מערכת (לא רק AI). איזה מדד/לוג היה עוזר לך לזהות
          אותה מהר יותר?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
