"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "monitoring-scale",
  lessonSlug: "project-atlasdesk-monitoring-layer",
  title: "פרויקט מודול: AtlasDesk מקבל שכבת ניטור אמיתית",
  objectives: [
    "לממש לוגינג מובנה לכל קריאות ה-API של AtlasDesk",
    "לבנות endpoint סטטיסטיקות שמסכם עלות/שימוש",
    "לזהות אנומליה (למשל קפיצה בעלות) מתוך הנתונים שנאספו",
  ],
  estMinutes: 40,
  difficulty: "מתקדם",
  prerequisites: ["caching-strategies-for-ai"],
};

const SLIDES: Slide[] = [
  {
    title: "הניטור כבר חי: /api/atlasdesk/stats",
    bullets: [
      "lib/atlasdesk/monitoring.ts מוסיף logEvent() ו-getStats() — כל קריאה מוצלחת ל-/api/ai/chat ו-/api/ai/rag-chat נרשמת (טוקנים, עלות, latency).",
      "בקר ב-/api/atlasdesk/stats כדי לראות סטטיסטיקות מצטברות: סה'כ קריאות, עלות כוללת, latency ממוצע, ופילוח לפי נתיב.",
      "המשימה שלך: להרחיב את הכיסוי (נתיבי tool-chat/agent-chat/multi-agent-chat עדיין לא רושמים) ולבנות תרחיש שמדגים זיהוי אנומליה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה חשוב במיוחד שגם agent-chat ו-multi-agent-chat יתועדו בשכבת הניטור, לא רק chat ו-rag-chat?",
    options: [
      "לא באמת חשוב, כל הנתיבים דומים בעלות שלהם",
      "כי סוכנים (agent/multi-agent) עלולים לבצע כמה סיבובי קריאה לכל בקשת משתמש אחת — צריך לוודא שהעלות המצטברת האמיתית (לא רק קריאה בודדת) נרשמת ומנוטרת",
      "כי רק נתיבים אלו יכולים להיכשל",
      "כי זו דרישה טכנית של Vercel"
    ],
    correctIndex: 1,
    explanation: "כפי שנלמד במודול הסוכנים, כל סיבוב הוא קריאת API נוספת — בלי לתעד את הסה'כ, אפשר לפספס בדיוק את התרחיש היקר ביותר (סוכן שרץ הרבה סיבובים).",
    optionNotes: [
      "לא נכון: נתיבים שעושים כמה קריאות (agent, multi-agent) יכולים לצבור עלות גבוהה משמעותית יותר מקריאה בודדת.",
      "התשובה הנכונה: זה בדיוק הסיכון שהמודול הקודם (AI Agents) לימד — מספר סיבובים משתנה, ולכן צריך לתעד את הסה'כ בפועל.",
      "לא נכון: כל הנתיבים יכולים להיכשל — זו לא הסיבה הספציפית לחשיבות הניטור כאן.",
      "לא נכון: אין דרישה כזו מ-Vercel — זו החלטת ארכיטקטורה משלנו.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הפרויקט המסכם של המודול", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "rationale",
    label: "למה הפרויקט הזה — ומה נחשב הצלחה",
    content: (
      <div className="space-y-4 text-sm">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 font-bold text-primary">הנימוק ההנדסי (why this project)</p>
          <p className="text-muted">
            שני השיעורים הקודמים היו עקרונות; כאן הם הופכים לקוד שרץ. שכבת ניטור אמיתית ב-AtlasDesk
            היא הדבר שיאפשר לך בשיעורים הבאים לקבל החלטות מבוססות-נתונים (עלות, caching, אבטחה)
            במקום ניחושים. בלי מדידה — כל ’אופטימיזציה’ היא תחושת בטן.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 font-bold text-primary">זווית הארכיטקטורה / trade-off אחד</p>
          <p className="text-muted">
            כתיבת הלוג <strong>אסינכרונית</strong> מול <strong>סינכרונית</strong>: כתיבה סינכרונית לפני
            החזרת התשובה מבטיחה שאף אירוע לא יאבד — אך מוסיפה latency לכל משתמש בנתיב הקריטי. כתיבה
            אסינכרונית (fire-and-forget / תור) שומרת על מהירות התגובה אך עלולה לאבד אירוע בקריסה. עבור
            שכבת ניטור, מהירות התגובה למשתמש מנצחת — עדיף לאבד אירוע נדיר מלהאט כל קריאה.
          </p>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-1 font-bold text-success">מה נחשב הצלחה</p>
          <ul className="space-y-1 text-muted list-disc pr-5">
            <li>כל 5 נתיבי ה-AI של AtlasDesk רושמים אירוע (כולל סיכום נכון של סוכנים רב-סיבוביים).</li>
            <li>‎/api/atlasdesk/stats מציג נתונים מצטברים נכונים ומפולחים לפי נתיב.</li>
            <li>יש הגדרת אנומליה אחת מדידה (למשל עלות יומית פי 2 מהחציון) שאפשר להתריע עליה.</li>
            <li>הלוגינג אינו מוסיף latency מורגש לנתיב הקריטי (נכתב אסינכרונית).</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="פרויקט זה קיים כדי לחבר את עקרונות ה-observability (שיעור 1) וה-caching (שיעור 2) לקוד production אמיתי שרץ ב-AtlasDesk."
        alternatives="אפשר להסתמך על לוגי Vercel הגולמיים (בלי שכבת ניטור ייעודית) — עובד לניפוי שגיאות בסיסי, אבל לא נותן תמונה מצטברת (עלות כוללת, מגמות) בלי עיבוד נוסף."
        whenNotTo="—"
        commonMistakes="לבנות שכבת ניטור אבל לא להסתכל בה בפועל — ניטור שאף אחד לא בודק הוא בזבוז זהה לאי-קיומו."
        cost="לוגינג עצמו זול (מילישניות) — הערך האמיתי הוא ביכולת לזהות בעיה (עלות שקופצת, latency שגדל) לפני שהיא הופכת למשבר."
        realWorld="בדיוק ככה מערכות AI production אמיתיות עובדות — Datadog/Grafana/לוגים מובנים שמאפשרים לצוות לזהות בעיה תוך דקות, לא ימים."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="monitoring-project-atlasdesk-monitoring-layer"
        title="הרחב את שכבת הניטור לכל נתיבי ה-AI של AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk. lib/atlasdesk/monitoring.ts ו-/api/atlasdesk/stats כבר קיימים."
        steps={[
          "עם Claude Code, קרא את lib/atlasdesk/monitoring.ts ואת השילוב הקיים ב-/api/ai/chat ו-/api/ai/rag-chat.",
          "הוסף logEvent() דומה לנתיבים tool-chat, agent-chat, ו-multi-agent-chat — שים לב שסוכנים עשויים לבצע כמה קריאות Claude לכל בקשה אחת (סכם את הכל ל-event אחד).",
          "בדוק ב-/atlasdesk: שלח כמה הודעות במצבים שונים, ואז בקר ב-/api/atlasdesk/stats וודא שהנתונים מצטברים נכון.",
          "דון עם Claude Code: איך היית מזהה 'אנומליה' (למשל עלות גבוהה חריגה) מתוך הנתונים האלו?",
        ]}
        successCriteria={[
          "כל נתיבי ה-AI של AtlasDesk (5 נתיבים) רושמים אירועים",
          "/api/atlasdesk/stats מציג נתונים מצטברים נכונים מכמה נתיבים",
          "יש לך הגדרה קונקרטית ל'אנומליה' במונחי הנתונים שנאספים",
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
        <p className="font-semibold">סיימת את מודול ניטור, לוגים וסקייל!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו אוסף נתוני שימוש/עלות אמיתיים. במודול הבא (אופטימיזציית עלויות ואבטחה)
          תשתמש בדיוק בנתונים האלו כדי לקבל החלטות מבוססות-נתונים, לא ניחושים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
