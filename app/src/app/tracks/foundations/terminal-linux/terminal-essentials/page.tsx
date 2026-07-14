"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { TerminalSimulator } from "@/components/simulators/terminal-simulator";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "terminal-linux",
  lessonSlug: "terminal-essentials",
  title: "טרמינל: ניווט וקבצים",
  objectives: [
    "להבין למה כל עבודה עם Claude Code עוברת דרך הטרמינל",
    "לנווט בין תיקיות ולנהל קבצים עם pwd/ls/cd/mkdir/touch/rm",
    "לתרגל בטרמינל אמיתי (מדומה) באתר",
  ],
  estMinutes: 20,
  difficulty: "מתחיל",
  prerequisites: ["פרויקט: מפת מסע בקשת HTTP מלאה"],
};

const SLIDES: Slide[] = [
  {
    title: "למה טרמינל, ולמה עכשיו?",
    bullets: [
      "Claude Code (וכל כלי agentic coding) עובד בעיקר דרך שורת פקודה — הוא קורא קבצים, מריץ פקודות, ובודק תוצאות בדיוק כמוך.",
      "כדי להבין מה Claude Code עושה בפרויקט שלך (ולתקן אם משהו משתבש), אתה חייב שפה משותפת: הטרמינל.",
      "זו לא מטרה בפני עצמה — זו הדרך המהירה ביותר להגיע לבניית מערכות AI אמיתיות.",
    ],
  },
  {
    title: "חמש הפקודות שתשתמש בהן הכי הרבה",
    bullets: [
      "pwd — 'איפה אני נמצא?' (Print Working Directory)",
      "ls — 'מה יש כאן?' (List)",
      "cd <תיקייה> — 'עבור לשם' (Change Directory)",
      "mkdir/touch — 'צור תיקייה/קובץ חדש'",
      "rm — 'מחק' (בזהירות — אין סל מיחזור!)",
    ],
  },
];

const EXERCISE: ExerciseConfig = {
  id: "terminal-essentials-ex1",
  prompt:
    "כתוב פונקציה בשם buildPath שמקבלת מערך של שמות תיקיות (למשל ['home','student','projects']) ומחזירה נתיב מלא בסגנון יוניקס (למשל '/home/student/projects').",
  starterCode: `function buildPath(parts) {
  // TODO: החזר נתיב שמתחיל ב-/ ומחבר את כל החלקים עם /
}`,
  hints: [
    "אתה צריך לחבר (join) את המערך עם '/' ולהוסיף '/' בהתחלה.",
    "נסה: return '/' + parts.join('/');",
    "טעות נפוצה: לשכוח את ה-'/' הראשון, מה שיוצר נתיב יחסי במקום מוחלט.",
  ],
  solutionCode: `function buildPath(parts) {
  return '/' + parts.join('/');
}`,
  check: (userFn) => {
    const fn = userFn as (p: string[]) => string;
    try {
      const result = fn(["home", "student", "projects"]);
      if (result === "/home/student/projects") {
        return { passed: true, message: "מדויק! בדיוק כמו נתיב שהיית רואה בטרמינל אמיתי." };
      }
      return { passed: false, message: `קיבלתי '${result}', ציפיתי ל-'/home/student/projects'.` };
    } catch (e) {
      return { passed: false, message: `שגיאת הרצה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "איזו פקודה מציגה את התיקייה הנוכחית שבה אתה נמצא?",
    options: ["ls", "cd", "pwd", "mkdir"],
    correctIndex: 2,
    explanation: "pwd = Print Working Directory — מציגה את הנתיב המלא של המיקום הנוכחי.",
  },
  {
    id: "q2",
    question: "מה עושה rm לעומת מחיקה רגילה בסייר קבצים גרפי?",
    options: [
      "זהה לגמרי, כולל סל מיחזור",
      "מוחקת לצמיתות ללא סל מיחזור",
      "רק מסמנת קובץ למחיקה מאוחרת",
      "לא מוחקת כלום, רק מציגה אזהרה",
    ],
    correctIndex: 1,
    explanation: "rm בטרמינל מוחקת מיידית וללא סל מיחזור — יש להשתמש בזהירות.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "terminal",
    label: "טרמינל חי — תרגל עכשיו",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          נסה: <code>pwd</code> · <code>ls</code> · <code>cd projects</code> · <code>ls</code> ·{" "}
          <code>cd ..</code> · <code>mkdir tests</code> · <code>ls</code>
        </p>
        <TerminalSimulator />
      </div>
    ),
  },
  {
    id: "mistakes",
    label: "טעויות נפוצות ו-Best Practices",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">טעויות נפוצות</p>
          <ul className="space-y-1.5 text-sm">
            <li>להריץ rm בלי לבדוק היטב איפה אתה נמצא (pwd) — מחיקה בתיקייה הלא נכונה בלתי הפיכה.</li>
            <li>לבלבל בין נתיב יחסי (projects) לנתיב מוחלט (/home/student/projects).</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">Best Practices</p>
          <ul className="space-y-1.5 text-sm">
            <li>לפני פעולה הרסנית — תמיד ls קודם כדי לוודא שאתה במקום הנכון.</li>
            <li>כשעובדים עם Claude Code, שאל אותו "איפה אנחנו?" אם אתה לא בטוח — הוא ישתמש ב-pwd/ls בעצמו.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "exercise", label: "תרגיל מודרך", content: <ExerciseValidator exercise={EXERCISE} /> },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Shell", "תוכנית שמקבלת פקודות טקסט ומריצה אותן (למשל bash)."],
          ["Working Directory", "התיקייה שבה אתה 'נמצא' כרגע בטרמינל."],
          ["Absolute Path", "נתיב מלא שמתחיל מהשורש (/)."],
          ["Relative Path", "נתיב יחסי למיקום הנוכחי."],
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
    id: "faq",
    label: "שאלות נפוצות",
    content: (
      <div className="space-y-3">
        {[
          [
            "האם אני חייב לזכור את כל הפקודות בעל פה?",
            "לא. גם מפתחים מנוסים משתמשים ב-help/man/AI כדי להיזכר. המטרה היא הבנת העקרונות, לא שינון.",
          ],
          [
            "האם Windows והLinux/Mac משתמשים באותן פקודות?",
            "רובן זהות ב-Git Bash/WSL/Mac/Linux. Windows CMD המקורי שונה מעט, אבל Claude Code בדרך כלל עובד עם shell תואם-יוניקס.",
          ],
        ].map(([q, a]) => (
          <div key={q} className="rounded-lg bg-card p-4">
            <p className="font-semibold">{q}</p>
            <p className="mt-1 text-sm text-muted">{a}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "recap",
    label: "רגע לפני שממשיכים: בקצרה",
    content: (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-2 font-bold">שלוש הפקודות שכל השאר בונות עליהן</p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>pwd</strong> — "איפה אני עכשיו?" (Print Working Directory).</li>
          <li><strong>ls</strong> — "מה יש כאן?" (List).</li>
          <li><strong>cd</strong> — "לך לשם" (Change Directory).</li>
        </ol>
        <p className="mt-3 text-xs text-muted">
          חשוב לזכור: זו בדיוק השפה ש-Claude Code ”מדבר” כשהוא מנווט בקוד שלך. פתח טרמינל
          אמיתי במחשב שלך ונווט לתיקיית המסמכים שלך רק עם שלוש הפקודות האלו, בלי לעזור לעצמך
          בממשק גרפי.
        </p>
      </div>
    ),
  },
  {
    id: "homework",
    label: "שיעורי בית",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">שיעורי בית:</p>
        <p className="mt-1 text-muted">
          בסימולטור למעלה: צור תיקייה בשם test-hw, היכנס אליה, צור בתוכה קובץ בשם done.txt, וודא עם
          ls שהוא שם.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
