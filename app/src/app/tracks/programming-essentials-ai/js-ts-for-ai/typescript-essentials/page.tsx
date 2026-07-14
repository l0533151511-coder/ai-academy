"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { CodePlayground } from "@/components/playground/code-playground";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "programming-essentials-ai",
  moduleSlug: "js-ts-for-ai",
  lessonSlug: "typescript-essentials",
  title: "TypeScript: טיפוסים שתופסים באגים לפני שהם קורים",
  objectives: [
    "להבין למה קוד שנוצר על ידי AI (וכלים כמו Claude Code) לרוב כתוב ב-TypeScript",
    "לכתוב טיפוסים בסיסיים, interfaces, ו-union types",
    "לזהות שגיאות טיפוסים לפני שהקוד בכלל רץ",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["Async JavaScript ו-fetch — לדבר עם שירותים חיצוניים"],
};

const SLIDES: Slide[] = [
  {
    title: "למה TypeScript, ולמה עכשיו?",
    bullets: [
      "TypeScript = JavaScript + מערכת טיפוסים. הוא לא רץ ישירות בדפדפן — הוא 'מתקמפל' ל-JS רגיל (זוכר את שיעור הקומפילציה?).",
      "הרוב המכריע של קוד AI-generated מקצועי (כולל את האקדמיה הזו!) כתוב ב-TypeScript.",
      "היתרון הגדול: שגיאות רבות נתפסות בזמן הכתיבה, לפני שהקוד בכלל רץ.",
    ],
  },
  {
    title: "טיפוסים בסיסיים",
    bullets: [
      "let age: number = 28; — אומר לקומפיילר 'age תמיד יהיה מספר'.",
      "interface User { name: string; age: number } — מגדיר 'צורה' (shape) של אובייקט.",
      "אם תנסה להעביר אובייקט עם שדה חסר או מסוג לא נכון — TypeScript יתריע מיד.",
    ],
  },
];

const EXERCISE: ExerciseConfig = {
  id: "typescript-essentials-ex1",
  prompt:
    "כתוב פונקציה בשם isValidUser שמקבלת אובייקט לא ידוע ומחזירה true רק אם יש לו שדה name מסוג string ושדה age מסוג number. זו בדיוק סוג הבדיקה שספריות כמו Zod עושות בזמן ריצה כדי להשלים את מה ש-TypeScript בודק בזמן כתיבה.",
  starterCode: `function isValidUser(obj) {
  // TODO: החזר true רק אם obj.name הוא string ו-obj.age הוא number
}`,
  hints: [
    "אפשר לבדוק את סוג הערך עם typeof — למשל typeof obj.name === 'string'.",
    "נסה: return typeof obj.name === 'string' && typeof obj.age === 'number';",
    "טעות נפוצה: לבדוק רק שדה אחד ולשכוח את ה-&& לחיבור שני התנאים.",
  ],
  solutionCode: `function isValidUser(obj) {
  return typeof obj.name === 'string' && typeof obj.age === 'number';
}`,
  check: (userFn) => {
    const fn = userFn as (o: unknown) => boolean;
    try {
      const a = fn({ name: "דנה", age: 28 });
      const b = fn({ name: "דנה", age: "28" });
      if (a === true && b === false) {
        return { passed: true, message: "מדויק! זיהית אובייקט תקין ואובייקט עם טיפוס שגוי." };
      }
      return { passed: false, message: `עבור אובייקט תקין קיבלתי ${a}, עבור age כמחרוזת קיבלתי ${b}.` };
    } catch (e) {
      return { passed: false, message: `שגיאת הרצה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "האם TypeScript רץ ישירות בדפדפן?",
    options: [
      "כן, בדיוק כמו JavaScript",
      "לא — הוא מתורגם (transpiled) ל-JavaScript רגיל לפני הריצה",
      "רק בכרום",
      "רק בשרת",
    ],
    correctIndex: 1,
    explanation: "TypeScript עובר שלב תרגום ל-JavaScript תקני לפני שהוא רץ בפועל — בדיוק כמו שנלמד בשיעור הקומפילציה.",
  },
  {
    id: "q2",
    question: "מה מגדיר interface ב-TypeScript?",
    options: [
      "פונקציה חדשה",
      "את ה'צורה' (shape) הצפויה של אובייקט — אילו שדות ומאיזה סוג",
      "עיצוב ויזואלי של האתר",
      "מסד נתונים",
    ],
    correctIndex: 1,
    explanation: "interface מתאר אילו שדות אמורים להיות באובייקט ומאיזה טיפוס — כמו 'חוזה' לצורת הנתונים.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "playground",
    label: "ניסוי: תפוס שגיאת טיפוסים לפני הריצה",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          עורך הקוד מזהה TypeScript ומסמן שגיאות טיפוסים <strong>בזמן כתיבה</strong> (קו אדום מתחת
          לקוד) — עוד לפני שלוחצים ”הרץ”. נסה לשנות את <code>age</code> למחרוזת ולראות את
          ההתראה. שים לב: אם תלחץ ”הרץ”, תקבל שגיאה — כי הדפדפן לא יודע להריץ TypeScript
          גולמי (בדיוק כמו שלמדנו בשיעור הקומפילציה — צריך שלב תרגום קודם).
        </p>
        <CodePlayground
          language="typescript"
          initialCode={`interface User {\n  name: string;\n  age: number;\n}\n\nconst dana: User = {\n  name: "דנה",\n  age: 28,\n};\n\nconsole.log(dana.name, dana.age);`}
        />
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
          ["Type", "הגדרה של איזה סוג ערך משתנה יכול להכיל."],
          ["Interface", "הגדרת 'צורה' צפויה של אובייקט."],
          ["Type Checking", "תהליך בדיקת התאמת טיפוסים בזמן כתיבת הקוד."],
          ["Transpile", "תרגום קוד משפה אחת (TS) לשפה אחרת (JS)."],
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
            "אם TypeScript לא רץ בדפדפן, למה בכלל להשתמש בו?",
            "כי הוא תופס טעויות בזמן הכתיבה — הרבה יותר זול לתקן טעות אז מאשר אחרי שהקוד כבר בפרודקשן.",
          ],
          [
            "Claude Code כותב תמיד TypeScript?",
            "לא תמיד, אבל ברוב הפרויקטים המקצועיים (כמו האקדמיה הזו) כן — כי זה מפחית באגים משמעותית.",
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
    id: "homework",
    label: "שיעורי בית",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">שיעורי בית:</p>
        <p className="mt-1 text-muted">
          במעבדת הקוד למעלה, הוסף שדה email: string ל-interface User ולאובייקט dana, וודא שאין
          שגיאת טיפוסים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
