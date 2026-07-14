"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { GitSimulator } from "@/components/simulators/git-simulator";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "git-github",
  lessonSlug: "git-commits-basics",
  title: "למה Git קיים + init/add/commit",
  objectives: [
    "להבין את הבעיה ש-Git פותר (היסטוריה, בטיחות, שיתוף פעולה)",
    "להבין את המחזור הבסיסי: init → add → commit",
    "לעקוב אחרי עץ קומיטים מתפתח בסימולטור ויזואלי",
  ],
  estMinutes: 20,
  difficulty: "מתחיל",
  prerequisites: ["פרויקט מודול: פתרון משימה אמיתית בטרמינל"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה Git פותר?",
    bullets: [
      "בלי בקרת גרסאות: 'final_v2_REALLY_FINAL.js' — מוכר לך?",
      "Git שומר היסטוריה מלאה של כל שינוי בקוד — אפשר תמיד לחזור אחורה.",
      "כשעובדים עם Claude Code, Git הוא רשת הביטחון שלך: אם משהו השתבש, אתה תמיד יכול לראות מה השתנה ולחזור.",
    ],
  },
  {
    title: "המחזור הבסיסי",
    bullets: [
      "git init — 'תתחיל לעקוב אחרי השינויים כאן'.",
      "git add <קובץ> — 'הכן את השינוי הזה לשמירה' (staging).",
      "git commit -m \"הודעה\" — 'שמור נקודת ציון קבועה עם תיאור'.",
      "כל commit הוא 'תמונת מצב' מלאה שאפשר לחזור אליה בכל רגע.",
    ],
  },
];

const EXERCISE: ExerciseConfig = {
  id: "git-commits-ex1",
  prompt:
    "כתוב פונקציה בשם isValidCommitMessage שמקבלת הודעת קומיט (מחרוזת) ומחזירה true רק אם האורך שלה גדול מ-10 תווים (כדי לעודד הודעות מתארות, לא רק 'fix').",
  starterCode: `function isValidCommitMessage(message) {
  // TODO: החזר true אם message.length > 10
}`,
  hints: [
    "בדוק את message.length מול המספר 10.",
    "נסה: return message.length > 10;",
    "טעות נפוצה: להשתמש ב->= במקום >, מה שיקבל הודעות בדיוק ב-10 תווים (הדרישה היא 'גדול מ', לא 'גדול או שווה').",
  ],
  solutionCode: `function isValidCommitMessage(message) {
  return message.length > 10;
}`,
  check: (userFn) => {
    const fn = userFn as (m: string) => boolean;
    try {
      const a = fn("fix");
      const b = fn("Add user authentication flow");
      if (a === false && b === true) {
        return { passed: true, message: "מדויק! הודעה קצרה נדחית, הודעה מתארת מאושרת." };
      }
      return { passed: false, message: `עבור 'fix' קיבלתי ${a}, עבור הודעה ארוכה קיבלתי ${b}.` };
    } catch (e) {
      return { passed: false, message: `שגיאת הרצה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה תפקידו של git add לפני git commit?",
    options: [
      "הוא מוחק את הקובץ",
      "הוא מסמן אילו שינויים ייכללו בקומיט הבא (staging)",
      "הוא שולח את הקוד ל-GitHub",
      "אין לו תפקיד ממשי",
    ],
    correctIndex: 1,
    explanation: "git add מוסיף שינויים ל-'אזור ההכנה' — רק מה שנוסף שם ייכלל בקומיט הבא.",
  },
  {
    id: "q2",
    question: "למה חשוב לכתוב הודעת קומיט מתארת ולא רק 'fix' או 'update'?",
    options: [
      "זה לא חשוב באמת",
      "כדי שאתה (ואחרים, כולל Claude Code) תבינו את ההיסטוריה מאוחר יותר",
      "כי Git דורש לפחות 20 תווים",
      "כדי שהקומיט יעבוד טכנית",
    ],
    correctIndex: 1,
    explanation: "הודעת קומיט טובה היא תיעוד — היא עוזרת להבין למה שינוי נעשה, גם חודשים אחר כך.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "simulator",
    label: "סימולטור Git חי — תרגל עכשיו",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          נסה: <code>git init</code> · <code>git add file.js</code> ·{" "}
          <code>git commit -m ”First commit”</code> · <code>git log</code>
        </p>
        <GitSimulator />
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
          ["Repository", "תיקיית פרויקט שעוקבים אחריה עם Git."],
          ["Staging Area", "מקום ביניים שבו מסמנים שינויים לפני שמירתם."],
          ["Commit", "תמונת מצב שמורה עם הודעה מתארת."],
          ["Commit Hash", "מזהה ייחודי (אותיות+מספרים) לכל קומיט."],
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
            "כמה פעמים ביום צריך לעשות commit?",
            "אין מספר קבוע — עקרון טוב: כל פעם שהשלמת יחידת עבודה הגיונית ובודדת (למשל 'הוספתי טופס התחברות').",
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
        <p className="mb-2 font-bold">init → add → commit, כמו קלסר תמונות-מצב</p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>git init</strong> — פותח "קלסר" חדש וריק לפרויקט.</li>
          <li><strong>git add</strong> — מסמן אילו קבצים ייכנסו לתמונת המצב הבאה.</li>
          <li><strong>git commit</strong> — "מצלם" תמונת מצב מתוארכת ושמורה לצמיתות בהיסטוריה.</li>
        </ol>
        <p className="mt-3 text-xs text-muted">
          חזור לסימולטור ה-Git החי למעלה ונסה לבצע init → add → commit על תיקייה משלך, בלי להעתיק
          פקודות — נסח אותן מהזיכרון.
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
          בסימולטור: בצע 3 קומיטים ברצף עם הודעות שונות, ואז הרץ git log וודא שכולם מופיעים בסדר הנכון.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
