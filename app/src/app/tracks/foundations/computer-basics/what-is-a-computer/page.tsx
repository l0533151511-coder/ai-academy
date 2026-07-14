"use client";

import { Cpu, MemoryStick, HardDrive, MonitorSmartphone, Printer } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "computer-basics",
  lessonSlug: "what-is-a-computer",
  title: "מה זה בכלל מחשב",
  objectives: [
    "להבין את תפקיד ה-CPU, הזיכרון (RAM) והאחסון (Storage)",
    "לעקוב אחרי מסלול הרצת תוכנית פשוטה מהלחיצה ועד התוצאה על המסך",
    "להבין למה 'מהירות מעבד' ו'כמות זיכרון' משפיעים על ביצועים בפועל",
  ],
  estMinutes: 25,
  difficulty: "מתחיל",
  prerequisites: [],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה זה פותר?",
    bullets: [
      "בלי להבין מה קורה 'מתחת למכסה המנוע', כל שגיאה תרגיש כמו קסם שחור.",
      "מתכנת שמבין חומרה יודע למה קוד איטי, למה תוכנה קורסת מחוסר זיכרון, ולמה שרת 'נתקע'.",
      "זו התשתית לכל מה שנלמד אחר כך — כולל איך מודלי AI בכלל רצים על GPU/CPU.",
    ],
  },
  {
    title: "למה מקצוענים חייבים את זה",
    bullets: [
      "דיבאגינג אמיתי דורש להבין רבדים: קוד → מערכת הפעלה → חומרה.",
      "החלטות ארכיטקטורה (איזה שרת לבחור, כמה זיכרון להקצות) מבוססות על ההבנה הזו.",
      "ראיונות עבודה טכניים כמעט תמיד נוגעים ביסודות האלה.",
    ],
  },
  {
    title: "שלושת הרכיבים המרכזיים",
    bullets: [
      "CPU (מעבד) — 'המוח' שמבצע פעולות חישוב אחת אחרי השנייה, במהירות עצומה.",
      "RAM (זיכרון) — שולחן עבודה זמני ומהיר; נמחק כשמכבים את המחשב.",
      "Storage (אחסון) — הארון הקבוע (דיסק/SSD); שומר מידע גם כשהמחשב כבוי.",
    ],
  },
];

const FLOW_STEPS: DiagramStep[] = [
  {
    icon: MonitorSmartphone,
    label: "לחיצה",
    detail: "פותחים אפליקציה — מערכת ההפעלה מקבלת בקשה להריץ תוכנית.",
  },
  {
    icon: HardDrive,
    label: "טעינה מהדיסק",
    detail: "קובץ התוכנה (שיושב על ה-SSD/דיסק) נטען לזיכרון RAM כדי שאפשר יהיה להריץ אותו מהר.",
  },
  {
    icon: MemoryStick,
    label: "זיכרון RAM",
    detail: "התוכנית והנתונים שהיא צריכה כרגע נשמרים בזיכרון — מהיר בהרבה מהדיסק אך זמני.",
  },
  {
    icon: Cpu,
    label: "עיבוד ב-CPU",
    detail: "המעבד מבצע את הפקודות של התוכנית אחת-אחת, במהירות של מיליארדי פעולות בשנייה.",
  },
  {
    icon: Printer,
    label: "פלט",
    detail: "התוצאה מוצגת על המסך (או נשלחת לרשת, מודפסת וכו') — וכל התהליך קורה תוך שבריר שנייה.",
  },
];

const EXERCISE: ExerciseConfig = {
  id: "what-is-a-computer-ex1",
  prompt:
    "כתוב פונקציה בשם calculateRAMNeeded שמקבלת מערך של 'תוכניות פתוחות' (כל אחת עם שדה memoryMB) ומחזירה את סך הזיכרון הדרוש בהפעלה בו-זמנית (סכימה פשוטה). זה ממחיש למה 'פתחת יותר מדי טאבים' מאט את המחשב.",
  starterCode: `function calculateRAMNeeded(programs) {
  // programs הוא מערך כמו: [{ name: "Chrome", memoryMB: 500 }, ...]
  // TODO: החזר את סך ה-memoryMB של כל התוכניות
}`,
  hints: [
    "חשוב על פונקציית מערך שמצטברת ערכים — מה שם הפונקציה שמקבלת reducer?",
    "נסה: programs.reduce((sum, p) => sum + p.memoryMB, 0)",
    "הטעות הנפוצה: לשכוח את הערך ההתחלתי (0) ב-reduce, מה שגורם לשגיאה אם המערך ריק.",
  ],
  solutionCode: `function calculateRAMNeeded(programs) {
  return programs.reduce((sum, p) => sum + p.memoryMB, 0);
}`,
  check: (userFn) => {
    const testInput = [
      { name: "Chrome", memoryMB: 500 },
      { name: "VSCode", memoryMB: 300 },
      { name: "Spotify", memoryMB: 200 },
    ];
    try {
      const result = (userFn as (p: typeof testInput) => number)(testInput);
      if (result === 1000) {
        return { passed: true, message: "מעולה! 1000MB — בדיוק כמו שצריך." };
      }
      return {
        passed: false,
        message: `קיבלתי ${result}, ציפיתי ל-1000. בדוק את לוגיקת הסכימה.`,
      };
    } catch (e) {
      return { passed: false, message: `הפונקציה זרקה שגיאה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה קורה למידע שנמצא ב-RAM כשמכבים את המחשב?",
    options: ["הוא נשמר לצמיתות", "הוא נמחק", "הוא עובר לדיסק אוטומטית", "שום דבר לא קורה"],
    correctIndex: 1,
    explanation: "RAM הוא זיכרון נדיף (volatile) — כל המידע בו נמחק ברגע שאין חשמל.",
  },
  {
    id: "q2",
    question: "למה תוכנית נטענת קודם ל-RAM ולא רצה ישירות מהדיסק?",
    options: [
      "כי הדיסק מקולקל",
      "כי RAM מהיר משמעותית מדיסק/SSD",
      "זה לא נכון, היא כן רצה ישירות מהדיסק",
      "כי ה-CPU לא יודע לקרוא מדיסק",
    ],
    correctIndex: 1,
    explanation: "RAM מהיר פי אלפים מדיסק רגיל, ולכן זה השכבה שממנה ה-CPU עובד בזמן ריצה.",
  },
  {
    id: "q3",
    question: "מה תפקיד ה-CPU?",
    options: [
      "לשמור קבצים לצמיתות",
      "להציג תמונות על המסך בלבד",
      "לבצע את פקודות התוכנית אחת-אחת",
      "לחבר את המחשב לאינטרנט",
    ],
    correctIndex: 2,
    explanation: "ה-CPU הוא 'המוח' שמבצע חישובים ופקודות — כל שאר הרכיבים תומכים בו.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "דיאגרמה אינטראקטיבית: מסלול הרצת תוכנית",
    content: <StepDiagram steps={FLOW_STEPS} />,
  },
  {
    id: "mistakes",
    label: "טעויות נפוצות ו-Best Practices",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">טעויות נפוצות</p>
          <ul className="space-y-1.5 text-sm">
            <li>לחשוב ש”יותר ליבות CPU” תמיד אומר ”יותר מהיר” — תלוי אם הקוד מקבילי.</li>
            <li>לבלבל בין RAM לאחסון (”יש לי 512GB זיכרון” — זה כנראה אחסון, לא RAM).</li>
            <li>להניח שסגירת תוכנית משחררת זיכרון מיידית תמיד — לפעמים יש עיכוב/cache.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">Best Practices</p>
          <ul className="space-y-1.5 text-sm">
            <li>כשמנפים בעיית ביצועים — תמיד תבדוק קודם: CPU, RAM או דיסק הם הצוואר בקבוק?</li>
            <li>השתמש בכלי ניטור מערכת (Task Manager / Activity Monitor / htop) כדי לראות בפועל.</li>
            <li>זכור: מה שנכון למחשב אישי נכון גם לשרת בענן — אותם עקרונות בקנה מידה גדול.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "exercise",
    label: "תרגיל מודרך",
    content: <ExerciseValidator exercise={EXERCISE} />,
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["CPU", "יחידת העיבוד המרכזית — מבצעת את כל הפעולות החישוביות של התוכנית."],
          ["RAM", "זיכרון עבודה מהיר ונדיף — נמחק כשאין חשמל."],
          ["Storage", "אחסון קבוע (HDD/SSD) — שומר מידע גם כשהמחשב כבוי."],
          ["Process", "מופע רץ של תוכנית, עם הזיכרון וההרשאות שלו."],
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
            "אם RAM מהיר יותר, למה לא כל המידע נשמר שם במקום בדיסק?",
            "כי RAM יקר משמעותית ל-GB, ונמחק ללא חשמל — לכן משתמשים בו רק לזיכרון עבודה זמני.",
          ],
          [
            "מה זה 'ליבות' (cores) במעבד?",
            "כל ליבה היא מעבד עצמאי קטן שיכול לבצע חישובים במקביל לליבות האחרות — יותר ליבות = יותר משימות בו-זמנית (אם התוכנה כתובה לנצל זאת).",
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
        <p className="mb-2 font-bold">שלוש הדמויות שגורמות למחשב לעבוד</p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>CPU</strong> — "המוח": מבצע חישובים והוראות, אחד בכל רגע (או כמה core-ים במקביל).</li>
          <li><strong>RAM</strong> — "שולחן העבודה": מקום זמני ומהיר לנתונים שבשימוש עכשיו; נמחק כשמכבים.</li>
          <li><strong>Storage</strong> — "הארון": אחסון קבוע ואיטי יותר, שנשאר גם אחרי כיבוי.</li>
        </ol>
        <p className="mt-3 text-xs text-muted">
          פתח את Task Manager (Windows) או Activity Monitor (Mac) עכשיו על המחשב שלך, ותסתכל
          כמה RAM ו-CPU תוכנה פתוחה אחת צורכת בזמן אמת — זו הדרך הכי טובה להפוך את שלוש הדמויות
          למשהו מוחשי, לא רק תיאורטי.
        </p>
      </div>
    ),
  },
  {
    id: "homework",
    label: "שיעורי בית ומיני-פרויקט",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">שיעורי בית:</p>
        <p className="mt-1 text-muted">
          פתח את מנהל המשימות במחשב שלך, מצא 3 תהליכים שצורכים הכי הרבה זיכרון, ורשום כמה MB כל אחד
          צורך.
        </p>
        <p className="mt-3 font-semibold">מיני-פרויקט (מוביל לפרויקט המודול):</p>
        <p className="mt-1 text-muted">
          בשיעור הבא נבנה יחד ”מחשב צעצוע” ויזואלי בדפדפן — תכין רשימה של 3 פקודות פשוטות שהיית
          רוצה שהוא ידע לבצע (למשל: ”שמור מספר”, ”חבר שני מספרים”).
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
