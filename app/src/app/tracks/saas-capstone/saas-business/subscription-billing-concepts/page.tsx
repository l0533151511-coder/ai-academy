"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-business",
  lessonSlug: "subscription-billing-concepts",
  title: "יסודות Subscription Billing",
  objectives: [
    "להבין מחזור חיים של מנוי: trial, active, past_due, cancelled",
    "להכיר webhook-driven billing (כמו Stripe) — עדכון סטטוס לפי אירועים חיצוניים",
    "לחבר בין תמחור usage-based (שיעור קודם) למימוש חיוב בפועל",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: AtlasDesk מקבל שכבת הרשאות בסיסית"],
};

const SLIDES: Slide[] = [
  {
    title: "מחזור חיים של מנוי",
    bullets: [
      "Trial — תקופת ניסיון חינמית, לרוב עם הגבלת זמן/שימוש.",
      "Active — מנוי פעיל ומשלם.",
      "Past due — תשלום נכשל (כרטיס פג תוקף וכו') — לרוב יש תקופת חסד לפני השעיה.",
      "Cancelled — המנוי הופסק (ביוזמת הלקוח או המערכת).",
    ],
  },
  {
    title: "webhook-driven billing — כבר בנית את זה!",
    bullets: [
      "מערכות billing אמיתיות (Stripe, Paddle) שולחות webhooks בדיוק כמו זה שבנית במודול Automation — 'תשלום הצליח', 'מנוי בוטל', 'כרטיס נכשל'. המערכת שלך מעדכנת סטטוס לקוח לפי האירוע.",
      "אותם עקרונות בדיוק: אימות חתימה (לא לסמוך על תוכן), ו-idempotency (אירוע כפול לא יעדכן פעמיים).",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה webhook-driven billing (כמו Stripe) דורש בדיוק את אותן שתי הגנות שכבר בנית ב-/api/webhooks/new-ticket?",
    options: [
      "זה צירוף מקרים, אין קשר אמיתי",
      "כי זה אותו דפוס ארכיטקטוני בדיוק: מערכת חיצונית שולחת אירוע, והאבטחה (חתימה) והנכונות (idempotency) קריטיות באותה מידה — בין אם האירוע הוא 'פנייה חדשה' או 'תשלום הצליח'",
      "כי Stripe דורש קוד שונה לגמרי מ-webhook רגיל",
      "כי billing webhooks לא יכולים להישלח פעמיים"
    ],
    correctIndex: 1,
    explanation: "זה בדיוק אותו דפוס webhook שנלמד במודול Automation — רק שהתוכן שונה (billing event במקום ticket event). העקרונות (אימות + idempotency) זהים.",
    optionNotes: [
      "לא נכון: זה לא צירוף מקרים — זה אותו דפוס ארכיטקטוני שחוזר על עצמו בהקשרים שונים.",
      "התשובה הנכונה: אותה ארכיטקטורה משרתת מקרי שימוש שונים לגמרי — זה בדיוק הכוח של ללמוד את הדפוס, לא רק את היישום הספציפי.",
      "לא נכון: הקוד דומה במבנה (webhook + חתימה + idempotency) — ההבדל הוא רק בתוכן ה-payload ובלוגיקה העסקית.",
      "לא נכון: כמו כל webhook, גם billing webhooks יכולים להישלח פעמיים (retry ברשת) — לכן idempotency נחוץ בדיוק כמו קודם.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: billing כאירועים, לא כמצב סטטי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: בדיקת סטטוס מנוי בכל בקשה מול webhook-driven",
    content: (
      <PromptComparisonLab
        title="עדכון סטטוס מנוי לקוח"
        unitLabel="ארכיטקטורה"
        bad={{
          label: "polling — לבדוק את Stripe בכל בקשה",
          content: `בכל בקשה של המשתמש, קריאה סינכרונית ל-Stripe API:
"מה הסטטוס של המנוי הזה עכשיו?"`,
          outcome: "מוסיף latency לכל בקשה (קריאת API חיצונית נוספת), ותלוי בזמינות Stripe בכל רגע — בדיוק הבעיה שלמדת שwebhooks פותרים (מודול Automation).",
        }}
        good={{
          label: "webhook-driven — עדכון פעם אחת, קריאה מקומית תמיד",
          content: `Stripe שולח webhook כשסטטוס משתנה → מעדכנים
שדה subscription_status ב-DB המקומי → כל בקשה
עתידית קוראת מה-DB המקומי, לא מ-Stripe`,
          outcome: "כל בקשה מהירה (קריאה מקומית בלבד), ועדיין מדויקת כי ה-DB מתעדכן בזמן אמת מ-webhooks — בדיוק העיקרון שכבר תרגלת.",
        }}
        takeaway="webhook-driven billing הוא לא נושא חדש שצריך ללמוד מאפס — הוא אותו דפוס בדיוק (event-driven, לא polling) שכבר תרגלת במודול Automation, רק על תוכן עסקי אחר."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="billing מבוסס webhooks קיים כי סטטוס מנוי הוא בדיוק סוג המידע שמשתנה 'שם' (אצל ספק הסליקה) ולא אצלך — webhook הוא הדרך היעילה לדעת מתי הוא השתנה, בלי לשאול כל הזמן."
        alternatives="polling תדיר ל-Stripe API — עובד, אבל מוסיף latency ותלות בזמינות חיצונית לכל בקשה, בדיוק כמו החיסרון של polling שכבר נלמד."
        whenNotTo="—"
        commonMistakes="לשכוח שגם billing webhooks יכולים להישלח כפול (retry) — צריך אותה הגנת idempotency כמו בכל webhook אחר."
        cost="webhook-driven billing חוסך קריאות API מיותרות (לא צריך לשאול בכל בקשה) — משתלם בדיוק כמו prompt caching (מודול Monitoring)."
        realWorld="Stripe, Paddle, וכל ספק סליקה מוביל עובדים בדיוק כך — /api/webhooks/new-ticket שבנית הוא תרגול ישיר לאותה ארכיטקטורה."
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
          ["Trial", "תקופת ניסיון חינמית לפני תשלום."],
          ["Past due", "תשלום נכשל — לרוב עם תקופת חסד לפני השעיה."],
          ["Webhook-driven billing", "עדכון סטטוס מנוי לפי אירועים מספק הסליקה, לא polling."],
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
        id="saas-business-subscription-billing-concepts"
        title="תכנן webhook billing ל-AtlasDesk בהשראת /api/webhooks/new-ticket"
        context="עבוד עם Claude Code על הריפו האמיתי של AtlasDesk."
        steps={[
          "קראו יחד את app/api/webhooks/new-ticket/route.ts (מודול Automation).",
          "תכננו (בלי לממש) webhook דומה: /api/webhooks/billing-event שהיה מקבל אירועי 'תשלום הצליח'/'תשלום נכשל' מספק סליקה היפותטי.",
          "דון: אילו שדות ב-DB (subscription_status, וכו') היו צריכים להתעדכן לפי כל סוג אירוע?",
        ]}
        successCriteria={[
          "יש לך תכנון webhook billing שמבוסס במפורש על הדפוס הקיים",
          "יש לך מיפוי ברור בין סוג אירוע לעדכון סטטוס",
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
          קרא בקצרה על webhooks של Stripe (stripe.com/docs/webhooks) והשווה למה שבנית ב-
          /api/webhooks/new-ticket — כמה מהעקרונות זהים?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
