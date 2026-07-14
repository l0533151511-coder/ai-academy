"use client";

import { FileText, Cog, PlayCircle, Binary, Zap } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { CodePlayground } from "@/components/playground/code-playground";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "computer-basics",
  lessonSlug: "compilation-vs-interpretation",
  title: "איך קוד הופך לתוכנה רצה",
  objectives: [
    "להבין את ההבדל בין קומפילציה לאינטרפרטציה",
    "להבין מה זה קוד מכונה ברמת עקרון",
    "להריץ את אותו רעיון דרך שתי הגישות ולהשוות תוצאה וביצועים",
  ],
  estMinutes: 25,
  difficulty: "מתחיל",
  prerequisites: ["מערכות הפעלה, תהליכים וזיכרון"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה זה פותר?",
    bullets: [
      "מחשב מבין רק 0 ו-1 (קוד מכונה). אנחנו כותבים ב-JavaScript/Python/C++.",
      "מישהו חייב לתרגם בין השפה שאנחנו כותבים לשפה שהמעבד מבין.",
      "יש שתי אסטרטגיות עיקריות לתרגום הזה: קומפילציה ואינטרפרטציה.",
    ],
  },
  {
    title: "קומפילציה (Compilation)",
    bullets: [
      "כל הקוד מתורגם מראש (לפני הריצה) לקוד מכונה — נוצר קובץ הרצה (executable).",
      "יתרון: ריצה מהירה מאוד כי אין תרגום 'תוך כדי'.",
      "חיסרון: צריך לקמפל מחדש בכל שינוי; שגיאות מתגלות רק בזמן קומפילציה (C++, Rust, Go).",
    ],
  },
  {
    title: "אינטרפרטציה (Interpretation)",
    bullets: [
      "הקוד מתורגם ומורץ שורה-שורה, בזמן אמת, על ידי תוכנית בשם 'אינטרפרטר'.",
      "יתרון: אין שלב בנייה נפרד — כותבים ומריצים מיד (Python, JavaScript).",
      "חיסרון: בדרך כלל איטי יותר מקוד מקומפל, כי התרגום קורה כל פעם מחדש.",
    ],
  },
  {
    title: "מה עם JavaScript? זה לא בדיוק אחד מהשניים",
    bullets: [
      "מנועי JS מודרניים (כמו V8 בכרום) משתמשים ב-JIT (Just-In-Time compilation).",
      "הקוד מתחיל כאינטרפרטציה, וקטעים שרצים הרבה פעמים מתקמפלים 'תוך כדי ריצה' למהירות.",
      "זו הסיבה ש-JavaScript מהיר בהרבה ממה שהיה צפוי לשפה 'מפורשת' טהורה.",
    ],
  },
];

const FLOW_STEPS: DiagramStep[] = [
  {
    icon: FileText,
    label: "קוד מקור",
    detail: "אתה כותב קוד קריא לבני אדם — למשל x = 2 + 2.",
  },
  {
    icon: Cog,
    label: "תרגום",
    detail: "קומפיילר מתרגם הכל מראש לקובץ הרצה, או אינטרפרטר מתרגם שורה-שורה תוך כדי ריצה.",
  },
  {
    icon: Binary,
    label: "קוד מכונה",
    detail: "בסופו של דבר הכל הופך לרצף פקודות בינאריות שה-CPU יודע לבצע ישירות.",
  },
  {
    icon: Zap,
    label: "JIT (מקרה ביניים)",
    detail: "מנועים כמו V8 מזהים קוד 'חם' (רץ הרבה) ומקמפלים אותו בזמן ריצה למהירות מקסימלית.",
  },
  {
    icon: PlayCircle,
    label: "הרצה",
    detail: "ה-CPU מבצע את הפקודות בפועל ומחזיר תוצאה.",
  },
];

const EXERCISE: ExerciseConfig = {
  id: "compilation-ex1",
  prompt:
    "כתוב פונקציה בשם describeApproach שמקבלת שם שפת תכנות (מחרוזת) ומחזירה 'compiled' עבור 'C++'/'Rust'/'Go', ו-'interpreted' עבור כל שפה אחרת.",
  starterCode: `function describeApproach(language) {
  // TODO: החזר 'compiled' עבור C++/Rust/Go, אחרת 'interpreted'
}`,
  hints: [
    "תזדקק למערך של שמות השפות המקומפלות ובדיקה אם השפה נמצאת בו.",
    "נסה: const compiled = ['C++', 'Rust', 'Go']; return compiled.includes(language) ? 'compiled' : 'interpreted';",
    "טעות נפוצה: רגישות לאותיות גדולות/קטנות — ודא שהערכים במערך תואמים בדיוק למה שהבודק שולח.",
  ],
  solutionCode: `function describeApproach(language) {
  const compiled = ['C++', 'Rust', 'Go'];
  return compiled.includes(language) ? 'compiled' : 'interpreted';
}`,
  check: (userFn) => {
    const fn = userFn as (l: string) => string;
    try {
      const a = fn("Rust");
      const b = fn("Python");
      if (a === "compiled" && b === "interpreted") {
        return { passed: true, message: "מדויק! זיהית נכון את שתי הגישות." };
      }
      return {
        passed: false,
        message: `עבור 'Rust' קיבלתי '${a}' (ציפיתי 'compiled'), עבור 'Python' קיבלתי '${b}' (ציפיתי 'interpreted').`,
      };
    } catch (e) {
      return { passed: false, message: `שגיאת הרצה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה היתרון המרכזי של קומפילציה על פני אינטרפרטציה?",
    options: [
      "אין צורך לכתוב קוד תקין",
      "ריצה מהירה יותר כי התרגום קורה מראש ולא בזמן ריצה",
      "אפשר לשנות קוד בלי לשמור",
      "היא עובדת רק על מק",
    ],
    correctIndex: 1,
    explanation: "כי כל התרגום קורה מראש, אין 'עלות תרגום' בזמן הריצה עצמה.",
  },
  {
    id: "q2",
    question: "מהו JIT (Just-In-Time compilation)?",
    options: [
      "שיטה לכתוב קוד מהר יותר",
      "קומפילציה שקורה בזמן ריצה עבור קוד שרץ הרבה פעמים",
      "כלי לבדיקת שגיאות",
      "שם אחר לאינטרפרטר",
    ],
    correctIndex: 1,
    explanation: "JIT מזהה 'קוד חם' ומקמפל אותו תוך כדי ריצה כדי לשפר ביצועים.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "דיאגרמה אינטראקטיבית: מקוד מקור לביצוע",
    content: <StepDiagram steps={FLOW_STEPS} />,
  },
  {
    id: "playground",
    label: "דוגמה חיה: אותו רעיון, שתי גישות",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          הרץ את הקוד הבא — זהו JavaScript שרץ באמצעות אינטרפרטציה/JIT בדפדפן שלך ממש עכשיו. שים לב
          שאין ”שלב קומפילציה” נפרד שאתה רואה — לחצת ”הרץ” וזה קרה.
        </p>
        <CodePlayground
          initialCode={`function factorial(n) {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}\nconsole.log("5! =", factorial(5));`}
        />
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
            <li>לחשוב ש”קומפילציה תמיד מהירה יותר” — תלוי גם באלגוריתם, לא רק בשיטת התרגום.</li>
            <li>לבלבל בין ”שפה מקומפלת” ל”שפה מהירה” — יש הרבה גורמים נוספים לביצועים.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">Best Practices</p>
          <ul className="space-y-1.5 text-sm">
            <li>בחר שפה לפי הצרכים בפועל (מהירות פיתוח מול מהירות ריצה), לא רק לפי ”טרנד”.</li>
            <li>כשמבצעים אופטימיזציה — תמיד למדוד (profile) לפני שמשערים מה איטי.</li>
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
          ["Compiler", "תוכנית שמתרגמת קוד מקור לקוד מכונה מראש, לפני הריצה."],
          ["Interpreter", "תוכנית שמתרגמת ומריצה קוד שורה-שורה בזמן אמת."],
          ["JIT", "קומפילציה שקורה בזמן ריצה עבור קוד שרץ הרבה — שילוב של שתי הגישות."],
          ["Machine Code", "פקודות בינאריות שה-CPU מבצע ישירות."],
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
            "אם קומפילציה מהירה יותר, למה משתמשים בכלל בשפות מפורשות כמו Python?",
            "כי הן מהירות משמעותית לפיתוח — אין שלב בנייה, קל לנסות ולתקן, ולרוב זה שווה יותר ממהירות ריצה גולמית.",
          ],
          [
            "TypeScript מקומפל?",
            "TypeScript 'מתקמפל' (transpiles) ל-JavaScript רגיל — זו לא קומפילציה לקוד מכונה, אלא תרגום לשפה אחרת ברמה דומה.",
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
        <p className="mb-2 font-bold">קומפילציה מול אינטרפרטציה, בשתי מילים</p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>קומפיילר</strong> — מתרגם את כל הקוד בבת אחת מראש, לפני שהוא רץ (כמו לתרגם ספר שלם לפני שמדפיסים אותו).</li>
          <li><strong>אינטרפרטר</strong> — מתרגם שורה-שורה תוך כדי ריצה (כמו מתורגמן סימולטני בכנס).</li>
          <li><strong>JIT</strong> (Just-In-Time) — פשרה: מתחיל כאינטרפרטר, אבל "מהדר" קוד שרץ הרבה פעמים כדי להאיץ אותו.</li>
        </ol>
        <p className="mt-3 text-xs text-muted">
          חזור לעורך הקוד החי למעלה ונסה להריץ את אותה פונקציה פעמיים — פעם ראשונה ופעם שנייה.
          שים לב אם אתה מבחין בהבדל בזמן הריצה בין הריצות (זה בדיוק ה-JIT בפעולה).
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
          חפש: האם Java היא שפה מקומפלת או מפורשת? (רמז: התשובה מעניינת ומשלבת את שניהם — זה יעזור
          לך להבין למה השאלה ”קומפילציה או אינטרפרטציה” היא לפעמים לא בינארית).
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
