"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "advanced-production",
  lessonSlug: "capstone-atlasdesk-production-ready",
  title: "קפסטון: AtlasDesk מגיע ל-production-ready אמיתי",
  objectives: [
    "לבצע audit מלא על AtlasDesk: ביצועים, יציבות, תיעוד, אבטחה",
    "לתקן את הפערים המשמעותיים ביותר שנמצאו",
    "לסכם את כל הטראק כ'סיפור הנדסי' אחד שלם",
  ],
  estMinutes: 50,
  difficulty: "מתקדם",
  prerequisites: ["common-mistakes-anti-patterns"],
};

const SLIDES: Slide[] = [
  {
    title: "קפסטון הטראק כולו: מ-'עובד' ל-'production-ready'",
    bullets: [
      "AtlasDesk עבר דרך ארוכה: מנוע שיחה בסיסי → זיכרון → Tool Calling → חיפוש סמנטי → RAG → סוכן אוטונומי. כל יכולת עבדה בבדיקה, אבל 'עובד בבדיקה' ו'מוכן ל-production' הם שני דברים שונים.",
      "למה דווקא audit ולא עוד יכולת? כי הערך ההנדסי כאן אינו להוסיף — אלא לאחד: לראות את המערכת כמכלול ולתפוס פערים שנוצרים דווקא בין היכולות, במקומות שבדיקת-כל-תכונה-לחוד מפספסת.",
      "המשימה: audit הוליסטי אחד שבודק את כל המערכת דרך העדשות שנלמדו במודול הזה — ביצועים, התאוששות משגיאות, דיפלוי, ואנטי-פטרנים.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין 'תכונה שעובדת בבדיקה' לבין 'תכונה production-ready', לפי הטראק כולו?",
    options: [
      "אין הבדל, אם זה עובד בבדיקה זה מוכן",
      "production-ready דורש גם ביצועים נמדדים, הגנות מפני כשלים (כמו הגנת הסוכן), תיעוד מעודכן, ואימות בסביבת production אמיתית — לא רק שהתכונה 'עובדת פעם אחת'",
      "production-ready אומר רק שהקוד עבר code review",
      "אין באמת הבדל מעשי, זה רק ניסוח שיווקי"
    ],
    correctIndex: 1,
    explanation: "זה בדיוק מה שהמודול הזה לימד: מדידת ביצועים, הגנות מפני כשלים, תיעוד עדכני, ואימות production — כל אחד תנאי נחוץ בפני עצמו.",
    optionNotes: [
      "לא נכון: יש הבדל משמעותי — 'עובד פעם אחת בבדיקה' לא מבטיח יציבות/ביצועים/אבטחה ב-production.",
      "התשובה הנכונה: זו בדיוק הרשימה מהמודול — ביצועים, הגנות, תיעוד, ואימות production הם כולם תנאים נחוצים.",
      "לא נכון: code review הוא חלק אחד (ממודול קודם) אבל לא מספיק לבדו — יש עוד ממדים (ביצועים, הגנות).",
      "לא נכון: יש הבדל מעשי ומדיד — בדיוק מה שהאקדמיה עצמה עברה כדי לתקן פערים אמיתיים.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הקפסטון של הטראק כולו", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="audit הוליסטי קיים כי תכונות שנבנו לאורך זמן (מודול אחר מודול) עלולות להצטבר לפערים שלא נראים כשבודקים כל תכונה בנפרד — צריך מבט מלא על המערכת כולה."
        alternatives="להסתפק בכך שכל תכונה 'עבדה כשנבנתה' — עובד לפרויקט לימודי; לא מספיק למוצר שבאמת ישרת משתמשים אמיתיים."
        whenNotTo="—"
        commonMistakes="לבצע audit רק על נייר (רשימת בדיקה שלא נבדקת בפועל) — ה-audit האמיתי דורש להריץ ולבדוק כל נקודה, לא רק לסמן וי."
        maintenance="Trade-off מרכזי של הקפסטון: כמה 'לתקן עכשיו' מול 'לתעד כחוב מוכר'. לא כל פער חייב תיקון מיידי — מהנדס בכיר מתקן את המשמעותי, ומתעד במודע את השאר (עם נימוק) במקום להעמיד פנים שהכל מושלם."
        cost="audit מלא עולה זמן משמעותי (השיעור הזה מוקצה 50 דקות) — אבל זהו בדיוק הרגע שבו פערים שהצטברו בשקט מתגלים ומתוקנים."
        realWorld="זו העבודה שכל צוות הנדסה עושה לפני 'launch' אמיתי — audit מסודר, לא רק תחושת בטן שהכל טוב."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית: Audit מלא של AtlasDesk",
    content: (
      <RealWorldTask
        id="advanced-production-capstone-atlasdesk-production-ready"
        title="בצע audit production מלא על AtlasDesk וסגור את הפערים המשמעותיים"
        context="עבוד מול הריפו האמיתי של AtlasDesk — זהו סיכום כל הטראק."
        steps={[
          "ביצועים: עם Claude Code, בדוק אילו קריאות API אפשר להריץ במקביל (Promise.all) במקום טוריות.",
          "התאוששות משגיאות: ודא שלכל נתיב API (chat/tool-chat/rag-chat/agent-chat/semantic-search) יש טיפול שגיאות עקבי (בעזרת anthropic-helpers.ts שכבר קיים).",
          "תיעוד: ודא ש-docs/13-atlasdesk-features.md ו-CLAUDE.md מעודכנים למצב הנוכחי של הפרויקט.",
          "אנטי-פטרנים: עבור על 5 האנטי-פטרנים מהשיעור הקודם ובדוק שאף אחד מהם לא קיים בקוד הנוכחי.",
          "תעד את כל הממצאים והתיקונים במסמך סיכום קצר — הסיפור ההנדסי של איך AtlasDesk הפך ל-production-ready.",
        ]}
        successCriteria={[
          "ביצעת audit אמיתי על קוד קיים ורץ, לא רק סימון-וי על נייר",
          "תיקנת לפחות פער אחד משמעותי שמצאת — ואימתת את התיקון (build+preview+production)",
          "לכל פער שבחרת *לא* לתקן — יש נימוק מודע (trade-off), לא התעלמות",
          "יש לך מסמך סיכום שמתעד את התהליך: מה נמצא, מה תוקן, מה נדחה ולמה — הסיפור ההנדסי של הטראק כולו",
        ]}
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "homework",
    label: "סיכום הטראק כולו",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">🎓 סיימת את כל טראק Claude Code Mastery — 6 מודולים, 33 שיעורים!</p>
        <p className="mt-1 text-muted">
          מ-”התקנה ראשונית” ועד ”audit production מלא” — למדת בדיוק איך מהנדס AI
          בכיר עובד עם Claude Code על מוצר אמיתי שממשיך לגדול. AtlasDesk הוא ההוכחה: מנוע שיחה
          בסיסי שהפך למערכת עם זיכרון, כלים, RAG, וסוכן אוטונומי — כולם נבנו עם המשמעת ההנדסית
          שהטראק הזה לימד. הטראקים הבאים (AI Agents, Production AI, SaaS) ימשיכו להרחיב את
          AtlasDesk תוך שימוש מתמיד בכל מה שלמדת כאן.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
