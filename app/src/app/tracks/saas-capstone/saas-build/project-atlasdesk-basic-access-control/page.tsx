"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-build",
  lessonSlug: "project-atlasdesk-basic-access-control",
  title: "פרויקט מודול: AtlasDesk מקבל שכבת הרשאות בסיסית",
  objectives: [
    "לממש הגנת API key בסיסית ל-endpoint הסטטיסטיקות הציבורי הקיים",
    "להבין את הפער בין 'הגנה בסיסית' לבין auth מלא (משתמשים, הרשאות, ארגונים)",
    "לתעד מה עוד חסר לפני ש-AtlasDesk יהיה מוכן ל-multi-tenancy אמיתי",
  ],
  estMinutes: 40,
  difficulty: "מתקדם",
  prerequisites: ["multi-tenancy-fundamentals"],
};

const SLIDES: Slide[] = [
  {
    title: "פער אבטחה אמיתי שנמצא ותוקן: /api/atlasdesk/stats",
    bullets: [
      "endpoint הסטטיסטיקות (מודול Monitoring) חשף עלות/שימוש לכל אחד שידע את הכתובת — בלי שום הגנה. זה בדיוק סוג הפער שסקירת ארכיטקטורה (persona: מנהל טכני, לא כולם) הייתה אמורה לתפוס.",
      "התיקון: הגנת API key בסיסית — בלי ATLASDESK_ADMIN_KEY מוגדר, ה-endpoint עדיין פתוח (עם הודעה מפורשת שאין הגנה), אבל ברגע שהמפתח מוגדר, גישה דורשת header מתאים.",
    ],
  },
  {
    title: "מה זה כן, ומה זה לא",
    bullets: [
      "זו הגנה בסיסית (מפתח משותף אחד לכל 'מנהלים') — לא auth מלא עם משתמשים, תפקידים, וארגונים נפרדים.",
      "auth מלא (multi-tenancy אמיתי) היה דורש: טבלת users, טבלת organizations, session management, ו-RLS (Row Level Security) ב-DB — הרבה מעבר לתיקון קטן הזה.",
    ],
  },
  {
    title: "למה זה הפרויקט הנכון לסיים בו את המודול",
    bullets: [
      "הוא סוגר פער אבטחה אמיתי בקוד אמיתי — לא תרגיל-צעצוע. אתה חווה את המסלול המלא: זיהוי חשיפה, תיקון ממוקד, ותיעוד מה עוד חסר.",
      "הוא מלמד את השיעור החשוב ביותר בהנדסת SaaS: 'המידה הנכונה'. לא כל endpoint צריך auth מלא היום — אבל כל endpoint שחושף מידע רגיש חייב משהו, לא כלום.",
      "trade-off מרכזי שתחווה: מפתח-משותף אחד נותן 80% מההגנה ב-5% מהמאמץ. auth מלא (users/roles/orgs/RLS) הוא ה-20% הנותרים — במחיר תשתית פי כמה. הפרויקט מכריח אותך לנמק היכן על העקומה הזו נכון לעצור עכשיו.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה ההגנה שנוספה ל-/api/atlasdesk/stats נחשבת 'בסיסית' ולא 'auth מלא'?",
    options: [
      "אין הבדל, זו בדיוק אותה רמת הגנה",
      "מפתח API משותף אחד מבחין בין 'יש הרשאה' ל'אין הרשאה' בכלל, אבל לא בין משתמשים שונים, תפקידים שונים, או ארגונים שונים — auth מלא דורש את כל זה",
      "כי ATLASDESK_ADMIN_KEY לא עובד בפועל",
      "כי Vercel לא תומך בהגנת API key"
    ],
    correctIndex: 1,
    explanation: "הגנה בסיסית עונה על שאלה בינארית (מורשה/לא) — auth מלא דורש לדעת *מי* מבקש גישה ולאיזה הרשאות ספציפיות הוא זכאי, מה שדורש תשתית הרבה יותר גדולה.",
    optionNotes: [
      "לא נכון: יש הבדל עצום ברמת הפירוט וההרשאות בין השתיים.",
      "התשובה הנכונה: מפתח משותף הוא הגנה גסה (יש/אין), auth מלא מבדיל בין משתמשים/תפקידים/ארגונים שונים — הרבה יותר מורכב.",
      "לא נכון: ATLASDESK_ADMIN_KEY עובד בדיוק כמתוכנן — זו לא הסיבה שההגנה נחשבת בסיסית.",
      "לא נכון: Vercel תומך לחלוטין בהגנת API key ברמת הקוד — זו לא מגבלת הפלטפורמה.",
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
        why="הגנה בסיסית קיימת כי לפעמים היא בדיוק המידה הנכונה ביחס לצורך — לא כל endpoint צריך מיד auth מלא, אבל כל endpoint שחושף מידע רגיש צריך משהו, לא כלום."
        alternatives="לדלג על הגנה עד שיהיה auth מלא — מסוכן; חשיפת נתונים בינתיים היא סיכון אמיתי, לא היפותטי."
        whenNotTo="לנתונים שאינם רגישים בכלל (כמו רשימת תכונות ציבורית) — הגנה שם היא overhead מיותר."
        commonMistakes="להניח ש'אף אחד לא ימצא את ה-URL' כהגנה — security through obscurity אינה הגנה אמיתית."
        cost="הגנה בסיסית עולה מעט קוד (בדיקת header) — חוסכת חשיפת מידע עסקי רגיש (עלויות, שימוש) לכל מי שמנחש/מוצא את ה-URL."
        realWorld="זו בדיוק אבן הדרך שכל סטארטאפ SaaS עובר: התחלה עם הגנה בסיסית, שדרוג ל-auth מלא כשיש משתמשים אמיתיים ולקוחות משלמים."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="saas-build-project-atlasdesk-basic-access-control"
        title="בדוק את הגנת ה-API key ותעד את הפער ל-auth מלא"
        context="עבוד מול הריפו האמיתי של AtlasDesk. ההגנה כבר קיימת ב-/api/atlasdesk/stats/route.ts."
        steps={[
          "עם Claude Code, קרא את הקוד של ההגנה החדשה. נסה לגשת ל-/api/atlasdesk/stats בלי header, ואז עם header שגוי, ואז (אם הגדרת ATLASDESK_ADMIN_KEY מקומית) עם header נכון.",
          "דון: אילו עוד endpoints ב-AtlasDesk (אם בכלל) חושפים מידע שצריך הגנה דומה?",
          "כתבו מסמך קצר: מה עוד חסר בדיוק כדי לעבור מ'הגנה בסיסית' ל-'auth מלא' (users table, sessions, RLS) — זה יהיה הבסיס לעבודה עתידית מעבר לאקדמיה.",
        ]}
        successCriteria={[
          "בדקת את שלושת מצבי הגישה (בלי header/header שגוי/header נכון) בפועל",
          "זיהית אם יש עוד endpoints שצריכים הגנה דומה",
          "יש לך מסמך פער ברור לעבודה עתידית, לא רק 'צריך auth'",
        ]}
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "success-bar",
    label: "מה נחשב הצלחה בפרויקט הזה",
    content: (
      <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
        <p className="mb-2 font-bold text-success">סיימת את הפרויקט כשורה אם:</p>
        <ul className="list-disc space-y-1.5 pr-5 text-muted">
          <li>הרצת את שלושת מצבי הגישה בפועל (בלי header / header שגוי / header נכון) וראית שכל אחד מתנהג כצפוי — לא רק ”הקוד נראה נכון”.</li>
          <li>יש לך רשימה קונקרטית של endpoints נוספים שצריכים הגנה דומה (או נימוק מדוע אין כאלה) — לא הנחה גורפת.</li>
          <li>יש לך מסמך-פער ברור: אילו רכיבים בדיוק חסרים ל-auth מלא (users, sessions, roles, RLS) ובאיזה סדר תוסיף אותם — לא ”צריך auth יום אחד”.</li>
          <li>אתה יכול לנמק את החלטת ה-trade-off: למה מפתח-משותף הוא המידה הנכונה עכשיו, ומה הטריגר העסקי שיצדיק את המעבר ל-auth מלא.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "homework",
    label: "סיכום מודול",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">סיימת את מודול הבנייה המלאה!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו כולל הגנת גישה בסיסית לנתונים רגישים. במודול הבא (עסקי: billing
          ואונבורדינג) נסכם את הצד העסקי — איך לקוח חדש נרשם, משלם, ומתחיל להשתמש.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
