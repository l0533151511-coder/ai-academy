"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "mcp-tools",
  lessonSlug: "project-atlasdesk-tool-calling",
  title: "פרויקט מודול: AtlasDesk מקבל כלי אמיתי",
  objectives: [
    "לנתח את מימוש ה-Tool Calling האמיתי שכבר קיים ב-AtlasDesk (check_ticket_status)",
    "להרחיב את AtlasDesk בעזרת Claude Code עם כלי שני משלך",
    "להבין את שיקולי האבטחה של הרצת כלים שמודל AI מבקש (validation, אילוצים)",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["building-first-mcp-server"],
};

const SLIDES: Slide[] = [
  {
    title: "פרויקט המודול: לא רק ללמוד — להרחיב מוצר אמיתי",
    bullets: [
      "AtlasDesk כבר כולל כלי אמיתי: check_ticket_status. לחץ \"כלים מחוברים\" ב-/atlasdesk ושאל על AD-1042, AD-2087, או AD-3311 כדי לראות אותו בפעולה.",
      "המימוש חי ב-lib/atlasdesk/tools.ts (הגדרת הכלי + הפונקציה שמבצעת אותו) ו-app/api/ai/tool-chat/route.ts (הלולאה המלאה: קריאה→tool_use→ביצוע→תשובה).",
      "המשימה שלך: להבין את הקוד הקיים לעומק, ואז להוסיף כלי שני משלך — עם Claude Code, לא לבד.",
    ],
  },
  {
    title: "שיקולי אבטחה שחייבים לחשוב עליהם",
    bullets: [
      "המודל 'מבקש' להריץ כלי — אבל הוא לא רואה את הקוד שמריץ אותו. זה אומר שהאפליקציה שלך היא קו ההגנה היחיד.",
      "לדוגמה: אם היינו מוסיפים כלי close_ticket(ticket_id), היינו חייבים לוודא הרשאות (האם המשתמש הנוכחי רשאי לסגור *את הפנייה הזו*), ולא לסמוך על כך שהמודל 'יבקש בצורה הגיונית' בלבד.",
      "כלל אצבע: כל כלי שמשנה משהו (write) דורש בדיקת הרשאות/ולידציה הרבה יותר קפדנית מכלי שרק קורא מידע (read) — בדיוק כמו endpoint רגיל ב-API.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה כלי כמו close_ticket (שמשנה מידע) דורש בדיקות קפדניות יותר מכלי כמו check_ticket_status (שרק קורא)?",
    options: [
      "אין הבדל, שני הסוגים דורשים אותה רמת זהירות",
      "כי כלי write יכול לגרום נזק בלתי הפיך אם המודל 'מבקש' אותו בטעות או בעקבות prompt injection — הקוד שלך הוא קו ההגנה היחיד",
      "כי כלי read תמיד מהיר יותר מכלי write",
      "כי המודל לעולם לא טועה בבחירת כלי read",
    ],
    correctIndex: 1,
    explanation: "פעולות read הן הפיכות (אפשר לקרוא שוב) ולא משנות מצב; פעולות write יכולות לגרום נזק אמיתי — לכן דורשות שכבת ולידציה/הרשאות חזקה יותר בקוד שמבצע אותן בפועל.",
    optionNotes: [
      "לא נכון: יש הבדל משמעותי בסיכון — טעות בקריאה היא לכל היותר תשובה לא מדויקת; טעות בכתיבה יכולה למחוק/לשנות נתונים אמיתיים.",
      "התשובה הנכונה: בדיוק בגלל שהמודל יכול לבקש הרצת כלי מתוך טעות (או ניסיון prompt injection), הקוד שמבצע את הכלי חייב להיות קו ההגנה - במיוחד לפעולות בלתי-הפיכות.",
      "לא נכון: מהירות אינה הגורם הרלוונטי כאן — מדובר בסיכון ולא בביצועים.",
      "לא נכון: מודלים כן יכולים לטעות בבחירת כלי, כולל read — אבל הנזק ממימוש read שגוי קטן בהרבה מנזק ממימוש write שגוי.",
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
        why="פרויקט זה קיים כדי לגשר בין 'הבנתי איך tool calling עובד' ל'אני יודע להוסיף כלי אמיתי למוצר production בזהירות' — הפער בין השניים הוא בדיוק שיקולי האבטחה/ולידציה."
        alternatives="Trade-off מרכזי: כלי צר וספציפי (get_plan_pricing) מול כלי גנרי וחזק (run_query). הגנרי חוסך קוד וגמיש — אבל נותן למודל כוח רחב מדי ומרחיב את משטח-התקיפה. הכלל ההנדסי: כלי צר ומוגבל-לצורך עדיף כברירת מחדל; גנריות משלמים עליה באבטחה."
        whenNotTo="אל תוסיף כלי write אמיתי כפרויקט לימוד על מוצר production חי בלי סביבת בדיקה — טעות במימוש close_ticket יכולה לגעת בנתונים אמיתיים. לפרויקט זה נבחר במכוון כלי read-only."
        commonMistakes="לתת לכלי חדש גישה רחבה מדי 'ליתר ביטחון' (למשל לקרוא/לכתוב לכל הטבלה) במקום להגביל אותו בדיוק לצורך הספציפי — עקרון ההרשאה המינימלית (least privilege) חל גם על כלי AI."
        cost="כלי read נוסף עולה טוקנים נוספים רק כשבאמת נקרא; כלי write דורש גם השקעת זמן בבדיקות/ולידציה — עלות הנדסית לא רק תפעולית."
        realWorld="זו בדיוק אותה עבודה שמהנדס AI עושה כשמרחיב system תמיכה אמיתי עם עוד יכולת — תכנון, מימוש זהיר, ובדיקה שהמודל באמת קורא לכלי הנכון בזמן הנכון."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="mcp-project-atlasdesk-tool-calling"
        title="הוסף כלי שני אמיתי ל-AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk. הכלי הראשון (check_ticket_status) כבר קיים — למד ממנו את התבנית."
        steps={[
          "קרא לעומק את lib/atlasdesk/tools.ts ואת app/api/ai/tool-chat/route.ts עם Claude Code, ובקש הסבר על כל שלב בלולאה.",
          "תכנן כלי שני read-only (לדוגמה: get_plan_pricing(plan_name) שמחזיר מחיר תוכנית) — הגדר name/description/input_schema לפני מימוש.",
          "בקש מ-Claude Code לממש את הכלי, ולהוסיף אותו למערך ATLASDESK_TOOLS ולפונקציית executeTool.",
          "עדכן את ATLASDESK_TOOL_SYSTEM_PROMPT כדי שיזכיר את הכלי החדש (בדיוק כמו שנעשה לכלי הראשון).",
          "בדוק ב-/atlasdesk (מצב \"כלים מחוברים\" + \"מצב מפתח\"): שאל שאלה שדורשת את הכלי החדש, וודא ביומן הכלים שהוא נקרא נכון.",
        ]}
        successCriteria={[
          "יש כלי שני עובד בפועל ב-AtlasDesk, לא רק תוכנית",
          "בדקת בעצמך שהמודל בוחר לקרוא לכלי הנכון (הישן או החדש) בהתאם לשאלה",
          "אתה יכול להסביר למה בחרת בכלי read-only ולא write, בהתאם לשיקולי האבטחה מהשיעור",
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
        <p className="font-semibold">סיימת את מודול MCP ו-Tool/Function Calling!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו יודע לפעול, לא רק לדבר — עם שני כלים אמיתיים. במודול הבא נעבור ל-Embeddings
          ומסדי נתונים וקטוריים — הבסיס ל-RAG, שיאפשר ל-AtlasDesk לענות מתוך בסיס ידע אמיתי.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
