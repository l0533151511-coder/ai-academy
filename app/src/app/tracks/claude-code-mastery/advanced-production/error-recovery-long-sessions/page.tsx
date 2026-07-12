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
  lessonSlug: "error-recovery-long-sessions",
  title: "התאוששות משגיאות וסשנים ארוכים",
  objectives: [
    "לזהות מתי Claude Code 'סוטה' מהמשימה בסשן ארוך",
    "לתרגל checkpoint strategy — נקודות עצירה לאימות באמצע עבודה ארוכה",
    "להבין מתי לאתחל סשן לעומת לתקן תוך כדי",
  ],
  estMinutes: 25,
  difficulty: "מתקדם",
  prerequisites: ["performance-optimization-workflows"],
};

const SLIDES: Slide[] = [
  {
    title: "חיבור למודול Agents: goal drift קורה גם בסשן פיתוח",
    bullets: [
      "במודול הסוכנים למדת על goal drift — סוכן שסוטה מהמטרה. אותה תופעה קורית גם בסשן Claude Code ארוך: אחרי שעה של עבודה על תיקון קטן, פתאום אתה ב'שכתוב מחדש' של קובץ שלם.",
      "checkpoint strategy: כל 15-20 דקות (או אחרי כל שינוי משמעותי), לעצור ולשאול: 'האם זה עדיין מה שהתכוונתי לעשות?'",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה הקשר בין 'goal drift' שנלמד במודול הסוכנים לבין סשן Claude Code ארוך?",
    options: [
      "אין קשר, אלו תופעות שונות לגמרי",
      "אותה תופעה בדיוק: לאורך זמן/סיבובים רבים, המיקוד המקורי עלול 'להיסחף' — בין אם זה סוכן אוטונומי או סשן פיתוח אנושי-מודרך",
      "goal drift קורה רק לסוכנים אוטונומיים, לא לסשן רגיל",
      "checkpoint strategy קיימת רק כדי לחסוך טוקנים"
    ],
    correctIndex: 1,
    explanation: "העיקרון זהה: ככל שנצבר יותר context/זמן, יש יותר סיכוי ל'סחיפה' מהמטרה המקורית — לכן checkpoints נחוצים בשני המקרים.",
    optionNotes: [
      "לא נכון: יש קשר ישיר — זו אותה תופעה בהקשרים שונים.",
      "התשובה הנכונה: goal drift הוא תופעה כללית של תהליכים ארוכי-סיבוב, לא ייחודית לסוכנים אוטונומיים בלבד.",
      "לא נכון: זה יכול לקרות גם בסשן פיתוח מודרך על ידי אדם, לא רק בסוכן אוטונומי.",
      "לא נכון: checkpoints נועדו בעיקר לזהות סחיפה ולתקן כיוון, לא רק לחיסכון טוקנים (אף שזה יתרון נלווה).",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: goal drift בסשן פיתוח", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: סשן ארוך בלי checkpoints מול עם",
    content: (
      <PromptComparisonLab
        title="שעה של עבודה על שיפור ביצועים ב-AtlasDesk"
        unitLabel="גישה"
        bad={{
          label: "בלי checkpoints",
          content: `סשן רציף בן שעה, בלי עצירות — מתחיל בתיקון קטן,
ממשיך "כי כבר פה" לשכתב עוד ועוד קבצים`,
          outcome: "בסוף השעה, יש 15 קבצים ששונו למטרות שהתרחבו הרבה מעבר לכוונה המקורית — קשה לדעת מה בדיוק נחוץ ומה 'תוספת' לא-מתוכננת.",
        }}
        good={{
          label: "checkpoints כל 15-20 דקות",
          content: `כל 15-20 דקות: "בוא נעצור לרגע — האם השינויים
עד כה עדיין תואמים למטרה המקורית? נריץ typecheck
ונבדוק ידנית לפני שממשיכים."`,
          outcome: "כל checkpoint הוא הזדמנות לתפוס סחיפה מוקדם, ולתקן כיוון לפני שהיא מצטברת לשינוי גדול ובלתי-נשלט.",
        }}
        takeaway="checkpoints הם בדיוק אותה הגנה כמו מגבלת הסיבובים בסוכן (מודול Agents) — רק שכאן אתה, לא הקוד, מפעיל את העצירה."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="checkpoint strategy קיימת כי תהליכים ארוכים (בין אם סוכן אוטונומי או סשן פיתוח) נוטים לצבור סטייה מצטברת — עצירות תקופתיות מגבילות את הנזק לפני שהוא מצטבר."
        alternatives="לסמוך על 'אינטואיציה' לדעת מתי לעצור — עובד למפתחים מנוסים מאוד, אבל checkpoints קבועים הם רשת ביטחון עקבית יותר."
        whenNotTo="למשימה קצרה (פחות מ-10 דקות) — checkpoints הם overhead מיותר."
        commonMistakes="להמשיך סשן שכבר 'הרגיש' לא נכון כי כבר הושקע בו זמן (sunk cost) — לפעמים העצירה והתחלה מחדש (עם תובנות מהסשן הקודם) יעילה יותר מהמשך."
        cost="checkpoint עולה כמה דקות עצירה — חוסך שעות של תיקון עבודה שסטתה מהמטרה."
        realWorld="בפרויקט הקפסטון הבא (שיעור אחרון בטראק) תשתמש בדיוק בגישה הזו: audit מלא עם checkpoints ברורים בין שלבים."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="advanced-production-error-recovery-long-sessions"
        title="תרגל checkpoint strategy בסשן ארוך"
        context="עבוד על משימה שדורשת יותר מ-20 דקות עבודה (בכל פרויקט)."
        steps={[
          "לפני שמתחילים, כתוב משפט אחד: מה המטרה המדויקת של הסשן הזה?",
          "כל 15-20 דקות, עצור ובדוק: האם עדיין עובדים על אותה מטרה?",
          "אם זיהית סחיפה, תעד אותה ותחליט במודע: להמשיך, לתקן כיוון, או לפתוח סשן חדש.",
        ]}
        successCriteria={[
          "ביצעת לפחות checkpoint אחד אמיתי בפועל",
          "אתה יכול לדווח אם הייתה סחיפה, וכיצד טופלה",
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
          חשוב על סשן עבודה ארוך שהיה לך לאחרונה (בכל הקשר, לא רק תכנות). האם היית checkpoints
          שהיו עוזרים לתפוס סחיפה מוקדם יותר?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
