"use client";

import { Cpu, Trophy } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { ToyComputer } from "@/components/simulators/toy-computer";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "computer-basics",
  lessonSlug: "project-toy-computer",
  title: "פרויקט מודול: מחשב צעצוע ויזואלי",
  objectives: [
    "לחבר בין כל מה שנלמד במודול (CPU, זיכרון, קומפילציה/אינטרפרטציה, ייצוג מידע) לכדי מכונה עובדת אחת",
    "לכתוב 'תוכנית' פשוטה במחשב צעצוע ולעקוב אחרי כל שלב בביצוע שלה",
    "להבין באופן מוחשי מה זה רגיסטר, זיכרון, ו-Program Counter",
  ],
  estMinutes: 45,
  difficulty: "בינוני",
  prerequisites: ["ייצוג מידע: בינארי, טקסט, תמונה, קול"],
};

const SLIDES: Slide[] = [
  {
    title: "מה בונים בפרויקט הזה",
    bullets: [
      "מחשב 'צעצוע' עם שני רגיסטרים (A, B), 8 תאי זיכרון, ומספר פקודות בסיסי.",
      "אתה כותב 'שפת אסמבלי' פשוטה — כל שורה היא פקודה אחת שהמחשב מבצע.",
      "תוכל לצעוד פקודה-פקודה ולראות בדיוק מה קורה ברגיסטרים ובזיכרון בכל רגע — בדיוק כמו הדיאגרמה שראית בשיעור הראשון, אבל הפעם אתה שולט בה.",
    ],
  },
  {
    title: "הפקודות הזמינות",
    bullets: [
      "SETA n / SETB n — טען ערך קבוע לרגיסטר A או B",
      "ADD / SUB — חבר או חסר את B מ-A (התוצאה נשמרת ב-A)",
      "STORE addr / LOAD addr — שמור את A בזיכרון בכתובת מסוימת, או טען ממנו",
      "PRINT — הוסף את הערך הנוכחי של A לפלט",
      "HALT — עצור את הביצוע",
    ],
  },
];

const CHALLENGE_PROGRAM = `SETA 7
SETB 5
ADD
STORE 0
SETA 2
SETB 3
ADD
STORE 1
LOAD 0
PRINT
LOAD 1
PRINT
HALT`;

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "בתוכנית הדוגמה, מה יודפס קודם (PRINT הראשון)?",
    options: ["5", "12", "7", "2"],
    correctIndex: 1,
    explanation: "7+5=12 נשמר בכתובת 0, ואז נטען חזרה ל-A ומודפס — התוצאה הראשונה היא 12.",
  },
  {
    id: "q2",
    question: "מה תפקידו של ה-Program Counter (PC) שראית בסימולטור?",
    options: [
      "סופר כמה זיכרון נותר",
      "מצביע על השורה/הפקודה הבאה שתבוצע",
      "סופר כמה שגיאות קרו",
      "שומר את התוצאה הסופית",
    ],
    correctIndex: 1,
    explanation: "ה-PC הוא בדיוק מה שראינו בדיאגרמה של השיעור הראשון: המנגנון שעוקב היכן אנחנו בתוכנית.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מה בונים", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "simulator",
    label: "המחשב הצעצוע שלך",
    content: <ToyComputer defaultProgram={CHALLENGE_PROGRAM} />,
  },
  {
    id: "challenge",
    label: "האתגר שלך",
    content: (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <div className="mb-3 flex items-center gap-2 font-bold text-primary">
          <Trophy size={18} /> משימה
        </div>
        <p className="text-sm">
          ערוך את התוכנית בעורך למעלה כך שהיא תחשב את התוצאה של <code>(10 - 4) + 6</code> ותדפיס
          אותה פעם אחת בלבד. השתמש בזיכרון (STORE/LOAD) לפחות פעם אחת בדרך, גם אם אינך חייב טכנית —
          זה כדי לתרגל את תזוזת הנתונים בין רגיסטר לזיכרון.
        </p>
        <p className="mt-3 text-xs text-muted">
          רמז אם נתקעת: חשב קודם 10-4 ושמור, אחר כך טען את זה בחזרה, הוסף 6, והדפס.
        </p>
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
          <Cpu size={18} className="text-primary" /> מה כיסינו במודול הזה
        </div>
        <ul className="space-y-1.5">
          <li>✅ CPU, RAM ו-Storage ותפקידם במסלול הרצת תוכנית</li>
          <li>✅ תהליכים, threads, וניהול זיכרון על ידי מערכת ההפעלה</li>
          <li>✅ ההבדל בין קומפילציה, אינטרפרטציה, ו-JIT</li>
          <li>✅ ייצוג מידע בינארי — טקסט, תמונה וקול כמספרים</li>
          <li>✅ חיברת הכל יחד במחשב צעצוע עובד בפועל</li>
        </ul>
        <p className="mt-3 text-muted">
          במודול הבא (”איך האינטרנט עובד”) ניקח את ההבנה הזו של מחשב בודד ונרחיב אותה לתקשורת
          בין מחשבים ברשת.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
