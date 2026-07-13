"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "core-dev-workflows",
  lessonSlug: "project-atlasdesk-tdd-feature",
  title: "פרויקט מודול: פיצ'ר AtlasDesk בגישת TDD מלאה",
  objectives: [
    "לבנות פיצ'ר אמיתי ב-AtlasDesk תוך שימוש בכל 4 ה-workflows שנלמדו",
    "לכתוב טסטים לפני מימוש ולוודא שהם מכוונים את הפיתוח",
    "לתעד את התהליך כתבנית חוזרת לפרויקטים עתידיים",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["tdd-with-claude-code"],
};

const SLIDES: Slide[] = [
  {
    title: "פרויקט המודול: לשלב הכל יחד",
    bullets: [
      "המשימה: להוסיף ל-AtlasDesk ולידציה קפדנית לפורמט מספר פנייה (AD-XXXX) — משמשת גם את הכלי check_ticket_status וגם את הגנת 'ניחוש חוזר' שבנית במודול הסוכנים.",
      "תשתמש בארבעת ה-workflows של המודול: תכנון+שלד (שיעור 1), refactoring בטוח אם תמצא כפילות (שיעור 2), debugging אם משהו לא עובד (שיעור 3), ו-TDD למימוש עצמו (שיעור 4).",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה משתלם לכתוב פונקציית ולידציה נפרדת (isValidTicketId) במקום לבדוק פורמט inline בכל מקום שצריך?",
    options: [
      "אין שום יתרון, זה רק עוד קובץ",
      "לוגיקת הוולידציה מתועדת במקום אחד עם טסטים משלה — כל שימוש עתידי (בכלי, בהגנת הסוכן, בכל מקום אחר) מקבל את אותה התנהגות עקבית ובדוקה",
      "כי TypeScript דורש פונקציות נפרדות לכל בדיקה",
      "זה מהיר יותר בזמן ריצה מבדיקה inline",
    ],
    correctIndex: 1,
    explanation: "פונקציה נפרדת עם טסטים היא בדיוק העיקרון שנלמד ב-TDD — מקום אחד, מתועד ובדוק, ששאר הקוד סומך עליו.",
    optionNotes: [
      "לא נכון: יש יתרון ממשי — עקביות ובדיקות, לא רק 'עוד קובץ'.",
      "התשובה הנכונה: זה בדיוק העיקרון של single source of truth + TDD — מקום אחד שכל שימוש עתידי מסתמך עליו.",
      "לא נכון: TypeScript לא דורש את זה — זו החלטת ארגון קוד, לא דרישת שפה.",
      "לא נכון: אין הבדל ביצועים משמעותי בין פונקציה נפרדת לבדיקה inline — היתרון הוא תחזוקתי, לא ביצועי.",
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
        why="פרויקט זה קיים כדי לתרגל את כל ה-workflows יחד על משימה אחת אמיתית — spec+שלד (שיעור 1), refactoring בטוח (שיעור 2), debugging מונחה-השערה (שיעור 3) ו-TDD (שיעור 4) — בדיוק כמו שפרויקט המודול הקודם (בטראק התכנון) שילב פרומפט מדויק+תכנון+ארכיטקטורה+פירוק. פונקציית ולידציה קטנה עם מקרי-קצה רבים היא המשימה האידיאלית להדגים למה הטסט, ולא הזיכרון שלך, הוא ששומר על החוזה."
        alternatives="אפשר לממש את הולידציה ישירות בלי TDD — מהיר יותר למשימה כזו הקטנה, אבל מפספס בדיוק את התרגול שהמודול נועד לתת."
        whenNotTo="ה-trade-off המרכזי: TDD כאן מוסיף זמן מראש (כתיבת 5-6 טסטים לפני שורת מימוש) תמורת ביטחון וחוזה מתועד. למשימה חד-פעמית שלא תשמש בשני מקומות, ה-overhead הזה לא היה משתלם — כאן הוא כן, כי אותה פונקציה מזינה גם את הכלי check_ticket_status וגם את הגנת הסוכן, וכל שימוש נשען על אותה התנהגות בדוקה."
        commonMistakes="לדלג על שלב הטסטים 'כי המשימה קטנה' — דווקא פונקציות ולידציה עם מקרי-קצה רבים (case sensitivity, אורך, תווים מותרים) נהנות הכי הרבה מ-TDD."
        cost="השקעת זמן בכתיבת טסטים לפונקציה קטנה זו משתלמת כי היא משמשת בכמה מקומות ב-AtlasDesk (הכלי + הגנת הסוכן) — כל תיקון עתידי ייבדק אוטומטית מול כל השימושים."
        realWorld="בדיוק ככה נמנעת אי-עקביות עתידית: אם מישהו ישנה את פורמט מספרי הפנייה, הטסטים יתפסו את זה מיד בכל מקום שמשתמש בפונקציה."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="core-dev-project-atlasdesk-tdd-feature"
        title="בנה isValidTicketId ב-TDD עבור AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk. הפונקציה תשמש הן ב-lib/atlasdesk/tools.ts (check_ticket_status) והן ב-agent-chat (זיהוי קלט לא-תקין)."
        steps={[
          "תכנן: מה בדיוק פורמט תקין (AD- + 4 ספרות, אותיות גדולות בלבד)? מה קריטריון ההצלחה?",
          "כתוב עם Claude Code 5-6 טסטים למקרי קצה (תקין, אותיות קטנות, אורך שגוי, תווים לא-חוקיים, מחרוזת ריקה) לפני מימוש.",
          "ודא שהטסטים נכשלים בלי מימוש (red).",
          "בקש מימוש עד שכולם עוברים (green).",
          "שלב את הפונקציה ב-lib/atlasdesk/tools.ts במקום הבדיקה הקיימת (אם יש כפילות — זה refactoring בטוח, שיעור 2!).",
        ]}
        successCriteria={[
          "יש לך פונקציית ולידציה עם טסטים אמיתיים לכל מקרי הקצה",
          "עברת דרך red→green בפועל, לא רק כתבת קוד ישר",
          "הפונקציה משולבת בפועל בקוד הקיים של AtlasDesk",
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
        <p className="font-semibold">סיימת את מודול תהליכי הפיתוח הליבתיים!</p>
        <p className="mt-1 text-muted">
          למדת: workflow מלא לבניית פיצ'ר, refactoring בטוח, debugging יעיל, ו-TDD — ותרגלת את
          כולם על AtlasDesk. במודול הבא נעבור לעבודה עם קוד קיים ופרויקטים גדולים יותר.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
