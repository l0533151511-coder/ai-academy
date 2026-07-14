"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "production-best-practices",
  lessonSlug: "project-atlasdesk-incident-runbook",
  title: "פרויקט מודול: Runbook ו-Playbook תקריות ל-AtlasDesk",
  objectives: [
    "לכתוב runbook תקרית אמיתי (מה עושים כשמפתח API נחסם/נגמר תקציב)",
    "להגדיר יעדי SLA ריאליים ל-AtlasDesk על בסיס מה שנבנה",
    "לסכם את כל טראק Production AI כמסמך מוכנות-לפרודקשן אחד",
  ],
  estMinutes: 40,
  difficulty: "מתקדם",
  prerequisites: ["feature-flags-safe-rollout"],
};

const SLIDES: Slide[] = [
  {
    title: "קפסטון הטראק כולו: מוכנות אמיתית לפרודקשן",
    bullets: [
      "runbook הוא מסמך שמתאר בדיוק מה עושים כשתקרית ספציפית קורית — לא תיאוריה, אלא צעדים קונקרטיים שכל אחד בצוות יכול לעקוב אחריהם תחת לחץ.",
      "המשימה: לכתוב runbook אמיתי ל-3 תרחישי תקרית סבירים ב-AtlasDesk (מפתח API נחסם, עלות קופצת, סוכן נתקע בלולאה) — ולסכם את כל מה שנבנה בטראק (ניטור, אבטחה, feature flags) למסמך מוכנות אחד.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין 'runbook' לבין תיעוד טכני רגיל (כמו README)?",
    options: [
      "אין הבדל, זה אותו סוג מסמך",
      "runbook מתמקד בצעדים קונקרטיים לפעולה תחת לחץ בזמן תקרית ספציפית ('קודם תבדוק X, אם זה קורה תעשה Y') — לא הסבר כללי על המערכת",
      "runbook הוא רק לצוותי DevOps, לא רלוונטי ל-AI",
      "README תמיד ארוך יותר מrunbook"
    ],
    correctIndex: 1,
    explanation: "runbook הוא מדריך פעולה ממוקד-תקרית, לא תיעוד כללי — הוא נכתב כך שמישהו תחת לחץ (תקרית פעילה) יוכל לעקוב אחריו במהירות בלי לחשוב.",
    optionNotes: [
      "לא נכון: יש הבדל ברור במטרה — runbook הוא לפעולה מיידית, לא הסבר כללי.",
      "התשובה הנכונה: זו בדיוק ההבחנה — runbook הוא רצף צעדים ברור לתגובה מהירה, לא תיעוד הסברי.",
      "לא נכון: runbooks רלוונטיים לכל מערכת production, כולל מערכות AI — התקריות שונות אבל העיקרון זהה.",
      "לא נכון: runbook בדרך כלל קצר וממוקד יותר מ-README, בדיוק כדי שיהיה קל לעקוב אחריו במהירות.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הפרויקט המסכם של הטראק", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "rationale",
    label: "למה הפרויקט הזה: מוכנות, לא רק קוד",
    content: (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-2 font-bold text-primary">הנימוק ההנדסי</p>
        <p className="text-muted">
          כל הטראק בנה יכולות — RAG, סוכן, ניטור, אבטחה, יעדי SLA, פריסה בטוחה. אבל ”מוכנות
          לפרודקשן” אינה עוד יכולת: היא היכולת לתפקד כשמשהו משתבש. הפרויקט הזה מאלץ אותך לענות
          על שאלה שכל מוצר אמיתי נבחן בה — ”מה קורה בשעה 3 לפנות בוקר כשה-API נחסם?” — לפני
          שהלקוח שואל אותה. runbook הופך ידע שקיים בראש של מהנדס אחד לצעדים שכל אחד יכול לבצע תחת לחץ.
        </p>
        <p className="mb-2 mt-4 font-bold text-primary">זווית ארכיטקטורה / trade-off אחת</p>
        <p className="text-muted">
          runbook מפורט מדי מתיישן ואף אחד לא קורא אותו; runbook כללי מדי (”בדוק את הלוגים”)
          חסר-תועלת ברגע אמת. האיזון: לכל תקרית — סימן ראשון קונקרטי, בדיקה אחת מדויקת, ופעולה מתקנת
          אחת ברורה. ממוקד מספיק לפעולה עיוורת, כללי מספיק כדי לא להתיישן בכל שינוי קוד. זה בדיוק
          המתח בין <strong>ספציפיות</strong> ל<strong>תחזוקתיות</strong> שמלווה כל תיעוד תפעולי.
        </p>
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="runbook קיים כי בזמן תקרית אמיתית, אין זמן 'לחשוב מהתחלה' — מסמך מוכן מראש עם צעדים ברורים חוסך זמן קריטי ומונע טעויות תחת לחץ."
        alternatives="לאלתר תגובה כשתקרית קורית — עובד לפעמים, אבל מסוכן ואיטי יותר מפעולה לפי תוכנית מוכנה מראש."
        whenNotTo="—"
        commonMistakes="לכתוב runbook תיאורטי בלי לבדוק שהוא באמת עובד (למשל: לוודא שהצעדים המתוארים נכונים בפועל, לא רק נשמעים הגיוניים)."
        cost="כתיבת runbook עולה זמן מראש — חוסכת זמן תגובה קריטי (וכסף/אמון לקוחות) כשתקרית אמיתית קורית."
        realWorld="זה בדיוק המסמך שכל צוות הנדסה שמפעיל מערכת production אמיתית מחזיק — Google, Amazon, וכל חברת SaaS רצינית."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית: Runbook + סיכום הטראק",
    content: (
      <RealWorldTask
        id="production-best-practices-project-atlasdesk-incident-runbook"
        title="כתוב runbook תקריות + סכם את מוכנות AtlasDesk לפרודקשן"
        context="עבוד מול הריפו האמיתי של AtlasDesk — זהו סיכום כל טראק Production AI."
        steps={[
          "עם Claude Code, כתבו runbook ל-3 תקריות: (א) ANTHROPIC_API_KEY נחסם/פג תוקף, (ב) עלות קופצת פתאום (בדקו איך הייתם מזהים זאת דרך /api/atlasdesk/stats), (ג) סוכן נתקע בלולאה (חברו לחזרה על תקרית ה-repeated_tool_call ממודול הסוכנים).",
          "לכל תקרית: מה הסימן הראשון שמשהו לא בסדר, מה בודקים, ומה הפעולה המתקנת.",
          "קבעו 3 יעדי SLO סופיים ל-AtlasDesk (מהשיעור הקודם) על בסיס הנתונים האמיתיים שנאספו.",
          "כתבו מסמך סיכום קצר: מה AtlasDesk כולל היום (8+ יכולות), מה מוכן לפרודקשן, ומה עוד היה צריך (auth אמיתי, DB-backed monitoring/idempotency) — זה יהיה הבסיס לטראק הבא (SaaS).",
        ]}
        successCriteria={[
          "יש לך runbook אמיתי לכל אחד מ-3 התרחישים, לא רק כותרות",
          "יש לך יעדי SLO סופיים מבוססי נתונים",
          "יש לך מסמך סיכום מוכנות-לפרודקשן שמכסה את כל מה שנבנה בטראק",
        ]}
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "homework",
    label: "סיכום טראק Production AI",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">🎓 סיימת את כל טראק Production AI — 3 מודולים, 9 שיעורים!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו כולל ניטור אמיתי, הגנת prompt injection, ו-runbook תקריות מתועד. הטראק
          האחרון (SaaS ומסחור) יסכם הכל למוצר מסחרי שלם — כולל auth, billing, ואונבורדינג.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
