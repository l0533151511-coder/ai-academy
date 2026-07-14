"use client";

import { Trophy, Brain, Scale, Target } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { SpamClassifierLab } from "@/components/simulators/spam-classifier-lab";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "ai-foundations",
  moduleSlug: "ml-intro",
  lessonSlug: "project-spam-classifier",
  title: "פרויקט מודול: בניית מסווג ספאם אינטראקטיבי",
  objectives: [
    "לכוונן משקלים (weights) של מילות מפתח ולראות איך זה משפיע על דיוק המודל",
    "לחוות באופן מוחשי מהו 'אימון' ולמה איזון (לא overfitting) קריטי",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["מדדי הצלחה: Accuracy, Precision, Recall, Overfitting"],
};

const SLIDES: Slide[] = [
  {
    title: "🏆 האתגר: הגע ל-100% דיוק",
    bullets: [
      "למטה 10 הודעות אמיתיות (5 ספאם, 5 לא). לכל מודל יש 'משקלים' למילות מפתח ו'סף' להחלטה.",
      "המשימה: כוונן את המשקלים והסף כדי לסווג את כל 10 ההודעות נכון — בלי לפגוע ביכולת ההכללה (זה בדיוק מה שמודל אמיתי עושה באימון, רק אוטומטית).",
      "שים לב: מודל אמיתי לא 'רואה' את תשובות המבחן כמוך — הוא לומד ממערך אימון נפרד ונבדק על מערך test. כאן אתה משחק את שני התפקידים.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "אם תכוונן משקלים בדיוק כדי לסווג נכון את כל 10 הדוגמאות שאתה רואה, האם המודל בהכרח יעבוד טוב על הודעות חדשות?",
    options: [
      "כן, תמיד",
      "לא בהכרח — זה יכול להיות overfitting למערך הקטן שראית",
      "זה לא רלוונטי",
      "רק אם יש בדיוק 10 דוגמאות בעולם",
    ],
    correctIndex: 1,
    explanation: "כיוונון מדויק מדי למערך קטן הוא בדיוק overfitting — מודל אמיתי נבדק תמיד על נתונים שלא ראה.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "האתגר שלך", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "why",
    label: "למה הפרויקט הזה",
    content: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 flex items-center gap-2 font-bold">
            <Target size={16} className="text-primary" /> הנימוק ההנדסי
          </p>
          <p className="text-muted">
            מסווג ספאם הוא ה”Hello World” של למידה מונחית: בעיית סיווג בינארי עם נתונים
            <strong> לא-מאוזנים</strong> (יותר תקין מספאם), בדיוק כמו הונאה, אבחון או מודרציה. כשתכוונן
            כאן משקלים וסף, תרגיש בגוף את שלושת המושגים של המודול בבת אחת — <strong>אימון</strong>{" "}
            (כיוונון משקלים), <strong>מדדי הצלחה</strong> (accuracy מול precision/recall) ו-
            <strong>overfitting</strong> (כיוונון מדויק מדי למעט דוגמאות). זה הרבה יותר חזק מלקרוא עליהם.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 flex items-center gap-2 font-bold">
            <Scale size={16} className="text-primary" /> ה-trade-off שתחווה: precision מול recall דרך הסף
          </p>
          <p className="text-muted">
            הסף (threshold) שאתה קובע הוא ידית ה-trade-off. <strong>סף גבוה</strong> = פחות התראות-שווא
            (precision גבוה) אבל יותר ספאם שמחליק פנימה (recall נמוך). <strong>סף נמוך</strong> = תופס
            כמעט כל ספאם (recall גבוה) אבל חוסם גם מיילים תקינים (precision נמוך). אין ”נכון”
            אחד — יש בחירה לפי מה יקר יותר: מייל תקין שנחסם, או ספאם שעובר. בזה בדיוק מכריע מהנדס אמיתי.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "lab",
    label: "מעבדת אימון — כוונן את המודל",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <Trophy size={18} className="shrink-0 text-primary" />
          <span>נסה להגיע ל-100% accuracy — ואז שאל את עצמך: האם המודל הזה יעבוד גם על הודעות שלא ראית?</span>
        </div>
        <SpamClassifierLab />
      </div>
    ),
  },
  {
    id: "success",
    label: "מה נחשב הצלחה בפרויקט",
    content: (
      <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
        <p className="mb-2 flex items-center gap-2 font-bold text-success">
          <Trophy size={16} /> קריטריונים להצלחה
        </p>
        <ul className="space-y-1.5">
          <li>סיווגת נכון את כל 10 ההודעות — אבל חשוב מכך: אתה יודע להסביר <strong>איזה משקל</strong> גרם לכל החלטה.</li>
          <li>אתה מזהה שכיוונון מושלם ל-10 דוגמאות אינו ערובה להכללה — ויכול לנסח למה זה overfitting.</li>
          <li>אתה יכול לומר, לפי הסף שבחרת, האם המסווג נוטה ל-precision או ל-recall — ומתי כל נטייה עדיפה.</li>
          <li>אתה מבין ש”מודל אמיתי” לומד ממערך אימון ונבדק על מערך test נפרד — וכאן שיחקת את שני התפקידים.</li>
        </ul>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "summary",
    label: "סיכום המודול",
    content: (
      <div className="rounded-xl bg-card p-5 text-sm">
        <div className="mb-2 flex items-center gap-2 font-bold">
          <Brain size={18} className="text-primary" /> מה כיסינו במודול ”מבוא ל-AI ולמידת מכונה”
        </div>
        <ul className="space-y-1.5">
          <li>✅ ההבדלים בין AI, ML, DL ו-LLM</li>
          <li>✅ שלושת סוגי הלמידה: מונחית, לא-מונחית, חיזוקית</li>
          <li>✅ מדדי הצלחה: Accuracy, Precision, Recall, ו-Overfitting</li>
          <li>✅ בנייה וכוונון של מסווג ספאם אינטראקטיבי במו ידיך</li>
        </ul>
        <p className="mt-3 text-muted">
          במודול הבא נעמיק ברשתות נוירונים ולמידה עמוקה — הבסיס הטכני שעליו בנויים כל מודלי השפה הגדולים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
