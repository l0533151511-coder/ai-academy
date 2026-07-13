"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-agents",
  moduleSlug: "multi-agent",
  lessonSlug: "project-atlasdesk-multi-agent-escalation",
  title: "פרויקט מודול: AtlasDesk מקבל אסקלציה רב-סוכנית",
  objectives: [
    "לממש אסקלציה אמיתית מסוכן תמיכה כללי לסוכן מומחה (חיוב/billing)",
    "להעביר context בצורה נקייה בין הסוכנים בהעברה",
    "לבדוק תרחיש אמיתי שמצריך אסקלציה ולוודא שהיא קורית בזמן הנכון",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["agent-handoff-and-escalation"],
};

const SLIDES: Slide[] = [
  {
    title: "האסקלציה כבר חיה — לחץ '👥 רב-סוכני' ב-/atlasdesk",
    bullets: [
      "נסה: \"אני רוצה זיכוי על חיוב כפול\" — הסוכן הכללי מזהה שזו שאלת חיוב מורכבת, קורא לכלי escalate_to_billing_specialist, ומעביר את השיחה (עם context מלא) לסוכן מומחה נפרד שמנסח את התשובה הסופית.",
      "המימוש חי ב-app/api/ai/multi-agent-chat/route.ts ו-lib/atlasdesk/multi-agent.ts — שני system prompts נפרדים, וזרימת handoff עם סיבת אסקלציה גלויה (במצב מפתח).",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה ה-multi-agent-chat route מריץ שתי קריאות Claude נפרדות (כללי ואז מומחה) במקום קריאה אחת?",
    options: [
      "זו טעות בקוד, הייתה צריכה להיות קריאה אחת בלבד",
      "כי זו בדיוק תבנית orchestrator-worker — הסוכן הכללי מחליט אם להסלים, ורק אם כן, נקראת קריאה שנייה לסוכן המומחה עם system prompt שונה לגמרי",
      "כי Claude API דורש שתי קריאות לכל בקשה",
      "כדי לחסוך טוקנים"
    ],
    correctIndex: 1,
    explanation: "זו בדיוק המימוש של orchestrator-worker: קריאה ראשונה מחליטה (ומטפלת ברוב המקרים), קריאה שנייה (מותנית) מפעילה את המומחה רק כשבאמת נדרש.",
    optionNotes: [
      "לא נכון: זו בדיוק הארכיטקטורה המכוונת — לא טעות אלא תבנית מפורשת מהשיעורים הקודמים.",
      "התשובה הנכונה: קריאה ראשונה = orchestrator (מחליט), קריאה שנייה מותנית = worker (המומחה) — בדיוק כמו שנלמד בשיעור התבניות.",
      "לא נכון: Claude API לא דורש שום מספר קבוע של קריאות — זו בחירת ארכיטקטורה שלנו.",
      "לא נכון: שתי קריאות עולות יותר טוקנים, לא פחות — אבל זה מוצדק כי רק שאלות חיוב מורכבות עוברות את הקריאה השנייה.",
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
        why="הפרויקט הזה קיים כדי לחבר תיאוריה (תבניות ארכיטקטורה, handoff) לקוד production אמיתי שרץ ב-AtlasDesk. הערך ההנדסי: לחוות בעצמך שהמעבר מסוכן-בודד לרב-סוכני הוא לא 'הוספת חוכמה' אלא הוספת מורכבות מכוונת שמשלמים עליה — ולראות מתי היא מוצדקת."
        alternatives="אפשר היה לממש את זה כ-tool calling רגיל (כמו tool-chat) בלי system prompt נפרד לחיוב — אבל זה מפספס את היתרון של סוכן מומחה עם ידע ממוקד. חלופה שנייה: system prompt אחד ענק שמכיל גם את מדיניות החיוב — פשוט יותר, אך יקר ומסורבל לתחזוקה ככל שהתחום גדל."
        whenNotTo="אם רוב הפניות ל-AtlasDesk נענות מצוין בסוכן הכללי, אין הצדקה להפעיל את המסלול הרב-סוכני על כולן — הוא נשמר לשאלות חיוב מורכבות בלבד. פיצול נוסף (עוד מומחים) מוצדק רק כשתחום חדש באמת דורש ידע עמוק שהכללי מכשיל."
        commonMistakes="לשכוח להעביר את מלוא ההיסטוריה לסוכן המומחה (כמו שהשיעור הקודם הזהיר) — בקוד הנוכחי, `messages` המלא מועבר לקריאה השנייה, לא רק ההודעה האחרונה. עוד טעות: אין תקרת אסקלציות, מה שיכול לפתוח לולאת handoff אם יתווסף מומחה שני שמעביר בחזרה."
        cost="Trade-off מרכזי: שאלה שמסלימה עולה כפול (שתי קריאות Claude) ומוסיפה latency של קריאה סדרתית נוספת — אבל זה קורה רק לשאלות חיוב מורכבות, לא לכל שיחה. הבחירה משתלמת רק כי תמהיל הפניות שבו המומחה נדרש הוא מיעוט; אם רוב הפניות היו מסלימות, סוכן בודד עם prompt טוב היה זול ופשוט יותר."
        maintenance="שני system prompts = שני מקומות לתחזק, ולוגיקת הניתוב היא קוד שצריך בדיקות. ודא logging של סיבת האסקלציה (קיים במצב מפתח) כדי שדיבוג של 'למה זה הוסלם/לא הוסלם' יהיה אפשרי בפרודקשן."
        realWorld="זו בדיוק הארכיטקטורה שמערכות תמיכה גדולות (עם 'רמות תמיכה' L1/L2/L3) משתמשות בה — נציג כללי שמסלים למומחה כשצריך, ולאדם כשהסיכון גבוה."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="multi-agent-project-atlasdesk-multi-agent-escalation"
        title="בדוק והרחב את מערכת האסקלציה של AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk."
        steps={[
          "פתח /atlasdesk, הפעל '👥 רב-סוכני' ו'מצב מפתח', ושאל שאלה כללית ואז שאלת חיוב מורכבת — ודא שרואים את המעבר בין 'נציג כללי' ל'מומחה חיוב'.",
          "עם Claude Code, קרא את lib/atlasdesk/multi-agent.ts ו-app/api/ai/multi-agent-chat/route.ts.",
          "הוסף תחום מומחיות שני (למשל: security-specialist לשאלות אבטחת חשבון) — system prompt + כלי אסקלציה נפרד.",
          "בדוק ששני סוגי האסקלציה עובדים נכון ולא מתבלבלים זה בזה.",
        ]}
        successCriteria={[
          "ראית בפועל את המעבר בין הסוכן הכללי למומחה החיוב",
          "הוספת תחום מומחיות שני עובד בפועל",
          "אתה מבין את זרימת ה-handoff המלאה בקוד",
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
        <p className="font-semibold">סיימת את מודול המערכות הרב-סוכניות!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו יודע לזהות מתי הוא לא המומחה הנכון, ולהסלים בצורה חלקה למי שכן. במודול
          הבא (אוטומציה ו-Web Scraping) נוסיף ל-AtlasDesk יכולת לפעול על מקורות מידע חיצוניים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
