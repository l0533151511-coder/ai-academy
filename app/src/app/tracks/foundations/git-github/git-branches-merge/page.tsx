"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { GitSimulator } from "@/components/simulators/git-simulator";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "git-github",
  lessonSlug: "git-branches-merge",
  title: "ענפים ומיזוג — איך Claude Code עובד בענפים",
  objectives: [
    "להבין למה עובדים על ענף (branch) נפרד במקום ישירות על main",
    "לראות ויזואלית איך merge מאחד שני ענפים",
    "להבין את זרימת ה-PR הבסיסית שגם agentic coding tools משתמשים בה",
  ],
  estMinutes: 25,
  difficulty: "בינוני",
  prerequisites: ["למה Git קיים + init/add/commit"],
};

const SLIDES: Slide[] = [
  {
    title: "למה ענף נפרד?",
    bullets: [
      "main (או master) הוא הענף ה'יציב' — הקוד שעובד באמת.",
      "כשמפתחים פיצ'ר חדש (או ש-Claude Code עושה זאת עבורך), עובדים על ענף נפרד — כדי לא לשבור את main בטעות.",
      "רק כשהפיצ'ר מוכן ונבדק, ממזגים (merge) אותו חזרה ל-main.",
    ],
  },
  {
    title: "merge — איחוד שני ענפים",
    bullets: [
      "git checkout <ענף> עובר לענף מסוים.",
      "git branch <שם> יוצר ענף חדש מהמצב הנוכחי.",
      "git merge <ענף> מאחד את השינויים מהענף המצוין לתוך הענף הנוכחי — יוצר 'merge commit' מיוחד עם שני הורים.",
    ],
  },
  {
    title: "החיבור ל-Claude Code",
    bullets: [
      "כשאתה מבקש מ-Claude Code לבצע שינוי גדול, מקובל לעבוד על ענף ייעודי (feature branch).",
      "כך תמיד אפשר להשוות, לבדוק, ואם צריך — להשליך את הענף בלי לפגוע ב-main.",
      "זו בדיוק אותה זרימת עבודה שצוותי פיתוח מקצועיים משתמשים בה עם Pull Requests.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה קורה כשעושים git merge?",
    options: [
      "הענף המקורי נמחק מיידית",
      "נוצר commit חדש שמאחד את ההיסטוריה של שני הענפים",
      "כל הקבצים נמחקים",
      "שום דבר, זו רק פקודת תצוגה",
    ],
    correctIndex: 1,
    explanation: "merge יוצר commit עם שני הורים — אחד מכל ענף — שמייצג את האיחוד.",
  },
  {
    id: "q2",
    question: "למה עובדים על branch נפרד במקום ישירות על main?",
    options: [
      "כי Git דורש את זה טכנית",
      "כדי לא לשבור את הקוד היציב בזמן עבודה על שינוי לא גמור",
      "כי זה מהיר יותר",
      "אין סיבה אמיתית",
    ],
    correctIndex: 1,
    explanation: "branch נפרד מבודד שינויים בתהליך פיתוח, ומגן על main מלהישבר.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "simulator",
    label: "סימולטור Git — תרגל ענפים ומיזוג",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          נסה רצף מלא: <code>git init</code> → <code>git add .</code> →{" "}
          <code>git commit -m ”Initial commit”</code> → <code>git branch feature</code> →{" "}
          <code>git checkout feature</code> → <code>git add .</code> →{" "}
          <code>git commit -m ”Add new feature”</code> → <code>git checkout main</code> →{" "}
          <code>git merge feature</code>
        </p>
        <GitSimulator height={300} />
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
            <li>לעבוד ישירות על main לפרויקטים משותפים — סיכון גבוה לשבור קוד יציב.</li>
            <li>לשכוח על איזה ענף אתה נמצא לפני commit (בדוק תמיד עם git status/branch).</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">Best Practices</p>
          <ul className="space-y-1.5 text-sm">
            <li>שם ענף מתאר: feature/login-form ולא branch1.</li>
            <li>מזג רק אחרי שבדקת שהענף עובד כמצופה.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Branch", "קו התפתחות נפרד של הקוד."],
          ["Merge", "איחוד שינויים משני ענפים לענף אחד."],
          ["Merge Commit", "קומיט מיוחד עם שני הורים, שמייצג איחוד."],
          ["Pull Request (PR)", "בקשה לסקור ולמזג ענף ל-main (ב-GitHub)."],
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
            "מה אם שני ענפים משנים את אותה שורת קוד? (קונפליקט)",
            "Git יסמן 'merge conflict' ויבקש ממך לבחור ידנית איזו גרסה נשארת. זה נושא מתקדם שנעמיק בו בהמשך המסלול המלא.",
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
          בסימולטור: צור שני ענפים נפרדים מ-main, בצע קומיט אחד בכל אחד, ומזג את שניהם בחזרה ל-main.
          כמה הורים יש ל-merge commit השני?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
