"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "advanced-production",
  lessonSlug: "performance-optimization-workflows",
  title: "אופטימיזציית ביצועים עם Claude Code",
  objectives: [
    "לזהות צווארי בקבוק אמיתיים (לא ניחושים) לפני אופטימיזציה",
    "לתרגל מדידה לפני ואחרי כל שינוי ביצועים",
    "להבין את הפשרה בין קריאות מקבילות למקורות מוגבלים",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: prompt-library מתועד ל-AtlasDesk"],
};

const SLIDES: Slide[] = [
  {
    title: "מודול אחרון: מכל מה שלמדת, ל-production אמיתי",
    bullets: [
      "AtlasDesk כבר עובד עם 7 יכולות אמיתיות. השאלה עכשיו: האם הוא באמת מוכן ל-production — מהיר, יציב, בטוח?",
      "כלל יסוד: לא לבצע אופטימיזציה על בסיס ניחוש — למדוד קודם. ב-RAG שבנית, כל שאלה מחשבת embedding לכל מאמרי העזרה מחדש (למדת את זה בפרויקט embeddings) — זה צוואר בקבוק אמיתי, לא היפותטי.",
    ],
  },
  {
    title: "קריאות מקבילות מול טוריות",
    bullets: [
      "אם יש כמה קריאות API עצמאיות (לא תלויות זו בזו), הרצתן במקביל (Promise.all) יכולה לחסוך זמן משמעותי לעומת טוריות.",
      "אבל: מקביליות לא חינמית — יותר קריאות בו-זמנית = יותר עומס על ה-API (rate limits) ויותר עלות בו-זמנית.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'לא לבצע אופטימיזציה על בסיס ניחוש' הוא כלל יסוד?",
    options: [
      "כי אופטימיזציה תמיד מסוכנת ולא כדאי לבצע אותה בכלל",
      "כי בלי מדידה, אתה עלול להשקיע זמן בשיפור חלק שלא באמת איטי, בעוד צוואר הבקבוק האמיתי נשאר בלתי-מטופל",
      "כי Claude Code לא יודע למדוד ביצועים",
      "כי מדידה תמיד מגלה שהקוד כבר מהיר מספיק",
    ],
    correctIndex: 1,
    explanation: "אופטימיזציה בלי מדידה היא הימור — ייתכן שהיא משפרת חלק לא-קריטי בזמן שהבעיה האמיתית (למשל חישוב embeddings חוזר) נשארת.",
    optionNotes: [
      "לא נכון: אופטימיזציה חשובה ולגיטימית — הבעיה היא לעשות אותה בלי בסיס מדוד, לא האופטימיזציה עצמה.",
      "התשובה הנכונה: בלי מדידה, מבזבזים מאמץ במקום הלא-נכון בעוד הבעיה האמיתית ממשיכה לפגוע בביצועים.",
      "לא נכון: Claude Code יכול למדוד ביצועים (זמני תגובה, כמות קריאות) בהחלט — זו לא מגבלה טכנית.",
      "לא נכון: לפעמים מדידה מגלה בדיוק ההפך — צוואר בקבוק אמיתי וקריטי.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מדוד לפני שאתה משפר", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: אופטימיזציה על בסיס ניחוש מול מדידה",
    content: (
      <PromptComparisonLab
        title="שיפור ביצועי RAG ב-AtlasDesk"
        unitLabel="גישה"
        bad={{
          label: "ניחוש: 'המודל איטי'",
          content: `"תשדרג את המודל של Claude ל-מהיר יותר כי RAG
איטי"`,
          outcome: "אם צוואר הבקבוק האמיתי הוא חישוב embeddings חוזר לכל מאמרי העזרה בכל בקשה (לא קריאת Claude עצמה), שינוי המודל לא יפתור כלום.",
        }}
        good={{
          label: "מדידה קודם",
          content: `"תוסיף לוג זמן לכל שלב ב-rag-chat/route.ts: זמן
embedding, זמן חיפוש, זמן קריאת Claude. תראה לי איפה
רוב הזמן מתבזבז."`,
          outcome: "מתגלה שחישוב ה-embeddings לוקח 80% מהזמן (בדיוק כמו שנלמד בפרויקט המודול הקודם — embeddings מחושבים מחדש בכל בקשה) — עכשיו האופטימיזציה ממוקדת בבעיה האמיתית.",
        }}
        takeaway="מדידה לפני אופטימיזציה חוסכת מאמץ שמושקע במקום הלא-נכון — בדיוק כמו debugging מונחה-השערה (מודול 3): קודם מבינים איפה הבעיה, ואז פותרים אותה."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="מדידה-לפני-אופטימיזציה קיימת כי אינטואיציה על ביצועים לרוב שגויה — הבעיה האמיתית מתגלה רק במדידה, לא בניחוש."
        alternatives="אופטימיזציה מונעת-אינטואיציה עובדת לפעמים בקוד קטן ופשוט; נכשלת ככל שהמערכת מורכבת יותר (בדיוק כמו AtlasDesk עם כמה שלבי pipeline)."
        whenNotTo="לקוד שממש ואל תרוץ בקנה מידה משמעותי (כמו הדגמת לימוד עם 5 מאמרי עזרה) — אופטימיזציה שם היא over-engineering."
        commonMistakes="לאופטם את החלק ה'מעניין' (למשל בחירת מודל) במקום החלק שבאמת אחראי לרוב הזמן (embeddings שמחושבים מחדש)."
        cost="לוגים זמניים לצורך מדידה עולים מעט קוד נוסף (ואפשר להסיר אחר כך) — חוסכים זמן פיתוח שהיה מושקע בכיוון הלא-נכון."
        realWorld="בדיוק אותו ממצא נלמד כבר בפרויקט מודול Embeddings: לחשב embeddings פעם אחת ולשמור ב-pgvector, לא בכל בקשה — זו האופטימיזציה שנמדדת ונכונה כאן."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="advanced-production-performance-optimization"
        title="מדוד את זמני התגובה של AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk."
        steps={[
          "עם Claude Code, הוסף לוג זמני ביניים ל-rag-chat/route.ts (זמן embedding, זמן קריאת Claude).",
          "הרץ בקשה אמיתית (או ב-preview) ובדוק את הפילוג.",
          "זהה: איפה רוב הזמן מתבזבז בפועל?",
        ]}
        successCriteria={[
          "יש לך נתוני זמן אמיתיים, לא ניחוש",
          "אתה יודע להצביע על השלב שהכי תורם לזמן התגובה הכולל",
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
          חשוב על פרויקט שלך שבו &quot;הרגשת&quot; שמשהו איטי בלי למדוד. נסה למדוד עכשיו בפועל —
          האם החשד שלך התאמת למציאות?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
