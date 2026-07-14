"use client";

import { Layers, Cpu, MemoryStick, RefreshCw, AlertTriangle } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "computer-basics",
  lessonSlug: "os-processes-memory",
  title: "מערכות הפעלה, תהליכים וזיכרון",
  objectives: [
    "להבין מהו תהליך (process) ומה ההבדל מ-thread",
    "להבין ניהול זיכרון בסיסי ומהי דליפת זיכרון (memory leak)",
    "לצפות בתהליכים רצים במערכת ההפעלה שלך ולפרש מה הם צורכים",
  ],
  estMinutes: 30,
  difficulty: "מתחיל",
  prerequisites: ["מה זה בכלל מחשב"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה זה פותר?",
    bullets: [
      "במחשב שלך רצות בו-זמנית עשרות תוכניות — דפדפן, עורך קוד, מוזיקה. איך זה לא מתנגש?",
      "מערכת ההפעלה היא ה'מנהל' שמחלק זמן CPU וזיכרון לכל תוכנית בהגינות ובבידוד.",
      "בלי הבנה של תהליכים, קשה להבין למה תוכנית 'תקועה' לא מפילה את כל המחשב.",
    ],
  },
  {
    title: "Process מול Thread",
    bullets: [
      "Process = תוכנית רצה עם מרחב זיכרון פרטי משלה — מבודדת מתהליכים אחרים.",
      "Thread = 'זרם ביצוע' בתוך תהליך — כמה threads באותו תהליך חולקים את אותו זיכרון.",
      "לדוגמה: דפדפן הוא תהליך אחד, אבל כל טאב יכול לרוץ ב-thread (או תהליך) נפרד.",
    ],
  },
  {
    title: "מה זו דליפת זיכרון (Memory Leak)",
    bullets: [
      "כשתוכנית מקצה זיכרון ושוכחת לשחרר אותו — הזיכרון התפוס גדל עם הזמן.",
      "בשפות כמו JavaScript יש Garbage Collector שאמור למנוע זאת, אבל refernces שנשארות 'חיות' בטעות עדיין גורמות לדליפות.",
      "התוצאה בפועל: תוכנית שרצה זמן רב נהיית איטית יותר ויותר עד שהיא קורסת.",
    ],
  },
];

const FLOW_STEPS: DiagramStep[] = [
  {
    icon: Layers,
    label: "מערכת הפעלה",
    detail: "השכבה שמנהלת את כל התהליכים, מחליטה מי מקבל זמן CPU ומתי, ומבודדת ביניהם.",
  },
  {
    icon: Cpu,
    label: "תזמון (Scheduling)",
    detail: "המעבד למעשה מחליף בין תהליכים אלפי פעמים בשנייה — זו האשליה של 'בו-זמניות'.",
  },
  {
    icon: MemoryStick,
    label: "הקצאת זיכרון",
    detail: "לכל תהליך מוקצה מרחב זיכרון פרטי; מערכת ההפעלה דואגת שתהליך אחד לא 'יגנוב' זיכרון של אחר.",
  },
  {
    icon: RefreshCw,
    label: "מחזור חיים",
    detail: "תהליך נוצר (spawn), רץ, לפעמים 'נתקע' (waiting), ולבסוף מסתיים ומשחרר את משאביו.",
  },
  {
    icon: AlertTriangle,
    label: "כשמשהו משתבש",
    detail: "תהליך שלא משחרר זיכרון (leak) או נתקע בלולאה אינסופית — מערכת ההפעלה יכולה לזהות ולסגור אותו (Task Manager).",
  },
];

const EXERCISE: ExerciseConfig = {
  id: "os-processes-memory-ex1",
  prompt:
    "כתוב פונקציה בשם simulateProcesses שמקבלת מספר תהליכים (n) וזמן CPU כולל פנוי (totalMs), ומחזירה כמה זמן (במילישניות, מעוגל למטה) כל תהליך מקבל אם מערכת ההפעלה מחלקת את הזמן שווה בשווה (round-robin פשוט).",
  starterCode: `function simulateProcesses(n, totalMs) {
  // TODO: החזר כמה זמן CPU מקבל כל תהליך (חלוקה שווה, Math.floor)
}`,
  hints: [
    "זו בעצם חלוקה פשוטה: totalMs חלקי n. אבל שים לב לעיגול.",
    "נסה: Math.floor(totalMs / n)",
    "טעות נפוצה: לשכוח Math.floor ולהחזיר מספר עם שברים כשלא ביקשו את זה.",
  ],
  solutionCode: `function simulateProcesses(n, totalMs) {
  return Math.floor(totalMs / n);
}`,
  check: (userFn) => {
    try {
      const result = (userFn as (n: number, t: number) => number)(4, 100);
      if (result === 25) {
        return { passed: true, message: "מדויק! 4 תהליכים, 100ms — כל אחד מקבל 25ms." };
      }
      return { passed: false, message: `קיבלתי ${result}, ציפיתי ל-25. בדוק את החלוקה והעיגול.` };
    } catch (e) {
      return { passed: false, message: `שגיאת הרצה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל המרכזי בין process ל-thread?",
    options: [
      "אין הבדל, זה אותו דבר",
      "process מבודד עם זיכרון פרטי; threads באותו process חולקים זיכרון",
      "thread תמיד מהיר יותר מ-process",
      "process רץ רק בלינוקס",
    ],
    correctIndex: 1,
    explanation: "process הוא יחידת בידוד עם מרחב זיכרון משלו; threads בתוכו חולקים את אותו הזיכרון.",
  },
  {
    id: "q2",
    question: "מה גורם לתוכנית להיות איטית יותר ויותר ככל שהיא רצה זמן רב?",
    options: ["גרסת המעבד", "דליפת זיכרון (memory leak)", "צבע הרקע של האפליקציה", "מספר הליבות"],
    correctIndex: 1,
    explanation: "דליפת זיכרון גורמת לזיכרון תפוס להצטבר עם הזמן, מה שמאט את התוכנית בהדרגה.",
  },
  {
    id: "q3",
    question: "איך מערכת הפעלה יוצרת אשליה של הרצה 'בו-זמנית' של כמה תהליכים על מעבד אחד?",
    options: [
      "היא לא — זה לא באמת קורה",
      "היא מחליפה בין תהליכים אלפי פעמים בשנייה (scheduling)",
      "היא מכבה תהליכים שלא בשימוש",
      "היא מריצה כל תהליך על ליבה נפרדת תמיד",
    ],
    correctIndex: 1,
    explanation: "תזמון (scheduling) מחליף בין תהליכים כה מהר שלמשתמש זה נראה בו-זמני.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "דיאגרמה אינטראקטיבית: איך מערכת ההפעלה מנהלת תהליכים",
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
            <li>לחשוב שסגירת חלון = סגירת התהליך תמיד (יש תהליכי רקע שממשיכים).</li>
            <li>להתעלם מ-Task Manager כשמשהו איטי — הוא הכלי הראשון לאבחון.</li>
            <li>לבלבל ”תהליך תקוע” עם ”מחשב תקוע” — לרוב אפשר לסגור רק את התהליך הבעייתי.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">Best Practices</p>
          <ul className="space-y-1.5 text-sm">
            <li>כשכותבים קוד ארוך-טווח (שרתים) — תמיד לשחרר משאבים (קבצים, חיבורים) שלא בשימוש.</li>
            <li>לנטר צריכת זיכרון לאורך זמן, לא רק ברגע נתון.</li>
            <li>להבין את מודל ה-threading של השפה שלך (JS הוא single-threaded עם event loop).</li>
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
          ["Process", "מופע רץ של תוכנית, עם מרחב זיכרון מבודד משלו."],
          ["Thread", "זרם ביצוע בתוך process; כמה threads חולקים זיכרון משותף."],
          ["Scheduling", "האלגוריתם שמחליט איזה תהליך רץ מתי על ה-CPU."],
          ["Memory Leak", "זיכרון שהוקצה ולא שוחרר, שמצטבר עם הזמן."],
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
            "אם יש לי מעבד עם 8 ליבות, כמה תהליכים יכולים לרוץ 'באמת' בו-זמנית?",
            "עד 8 תהליכים יכולים לרוץ ממש בו-זמנית (אחד לכל ליבה), אבל מערכת ההפעלה יכולה לנהל מאות תהליכים על ידי החלפה מהירה ביניהם.",
          ],
          [
            "למה אפליקציות ב-JavaScript (כמו דפדפן) לא 'קורסות' כשיש הרבה טאבים?",
            "דפדפנים מודרניים מריצים כל טאב (או קבוצת טאבים) כ-process נפרד, כך שטאב אחד שקורס לא מפיל את שאר הדפדפן.",
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
        <p className="mb-2 font-bold">תהליכים, זיכרון, ודליפות — במשפט לכל אחד</p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>תהליך</strong> — תוכנית רצה עם משאבים משלה; מערכת ההפעלה מחלקת ביניהם זמן CPU בתורות מהירות (scheduling), מה שנראה לנו כאילו כולם רצים "בו-זמנית".</li>
          <li><strong>Thread</strong> — "זרם ביצוע" בתוך תהליך בודד — כמה threads באותו תהליך חולקים זיכרון משותף.</li>
          <li><strong>דליפת זיכרון</strong> — כשתוכנית ממשיכה "לתפוס" זיכרון בלי לשחרר אותו כשהוא כבר לא נחוץ, עד שהמערכת נחנקת.</li>
        </ol>
        <p className="mt-3 text-xs text-muted">
          פתח את מנהל המשימות (Task Manager) או Activity Monitor על המחשב שלך עכשיו ומצא תהליך
          שאתה לא מזהה — זו הדרך הכי טובה להפוך את הרעיון המופשט למשהו מוחשי.
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
          פתח Task Manager (Windows) או Activity Monitor (Mac), מיין לפי זיכרון, ומצא תהליך אחד
          שאתה לא מזהה. חפש אותו וברר מה תפקידו.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
