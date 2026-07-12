"use client";

import { Hammer, CheckCircle2, UploadCloud, Eye } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "advanced-production",
  lessonSlug: "production-deployment-workflows",
  title: "תהליכי דיפלוי לפרודקשן",
  objectives: [
    "לשלב Claude Code בצינור build→test→deploy→verify",
    "להבין את החשיבות של אימות פוסט-דיפלוי (לא רק 'זה נדחף')",
    "להכיר אסטרטגיית rollback כשמשהו משתבש בפרודקשן",
  ],
  estMinutes: 25,
  difficulty: "מתקדם",
  prerequisites: ["error-recovery-long-sessions"],
};

const SLIDES: Slide[] = [
  {
    title: "בדיוק התהליך שליווה כל שיעור באקדמיה הזו",
    bullets: [
      "כל מודול באקדמיה עבר אותו תהליך: build נקי → typecheck נקי → בדיקה ידנית בדפדפן → commit+push → אימות production. זה לא טקס — כל שלב תפס בעיות אמיתיות (זוכר את הבאג שנתפס רק בבדיקה ידנית, לא ב-build?).",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: Hammer, label: "1. Build", detail: "npm run build — מוודא שהקוד מתקמפל ושכל הדפים נבנים בהצלחה." },
  { icon: CheckCircle2, label: "2. Verify", detail: "typecheck + בדיקה ידנית בדפדפן — תופס בעיות שה-build לא תופס (כמו לוגיקה שגויה)." },
  { icon: UploadCloud, label: "3. Deploy", detail: "git push → דיפלוי אוטומטי (Vercel). לא הסוף — רק אמצע התהליך." },
  { icon: Eye, label: "4. Verify Production", detail: "בדיקה בסביבת production בפועל (לא רק 'זה נדחף') — לפעמים production מתנהג אחרת מ-dev (למשל: מפתחות API שקיימים/חסרים)." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'git push' לא מספיק כדי לסיים תהליך דיפלוי, לפי מה שנעשה בפועל באקדמיה הזו?",
    options: [
      "זה כן מספיק, אין צורך בשום דבר אחרי",
      "כי push הוא רק אמצע התהליך — צריך לוודא בפועל שהתכונה עובדת ב-production, כי לפעמים dev ו-production מתנהגים אחרת (למשל מפתחות API)",
      "כי git push תמיד נכשל בפעם הראשונה",
      "כי Vercel דורש אישור ידני לכל דיפלוי"
    ],
    correctIndex: 1,
    explanation: "לאורך כל האקדמיה, כל תכונה אומתה בפועל ב-production אחרי הדיפלוי — כי הבדלי סביבה (מפתחות, config) יכולים לגרום להתנהגות שונה מ-dev.",
    optionNotes: [
      "לא נכון: push הוא רק שלב אחד — אימות פוסט-דיפלוי הוא חלק בלתי נפרד מהתהליך המלא.",
      "התשובה הנכונה: זה בדיוק מה שנעשה בפועל בכל מודול — curl/בדיקה ידנית ב-production לוודא שהתכונה עובדת בסביבה האמיתית.",
      "לא נכון: push לא נכשל 'תמיד' — זו לא הסיבה לצורך באימות.",
      "לא נכון: Vercel (בהגדרות ברירת המחדל של הפרויקט) מבצע דיפלוי אוטומטי בכל push, בלי אישור ידני.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: התהליך שכבר תרגלת בפועל", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "צינור הדיפלוי המלא", content: <StepDiagram steps={STEPS} /> },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="אימות פוסט-דיפלוי קיים כי סביבת production שונה מ-dev בדרכים שלא תמיד צפויות — מפתחות API, הגדרות רשת, גרסאות תלויות."
        alternatives="'push ולסמוך שזה עובד' — עובד לפעמים, אבל מסוכן ל-production אמיתי עם משתמשים תלויים."
        whenNotTo="—"
        commonMistakes="לבדוק רק שה-build עבר (ירוק ב-CI) ולהניח שזה מספיק — build ירוק לא אומר שהתכונה עובדת נכון בסביבה האמיתית."
        cost="אימות פוסט-דיפלוי עולה כמה דקות — חוסך גילוי מאוחר של תקלה שכבר משפיעה על משתמשים אמיתיים."
        realWorld="בדיוק ככה אומתה כל תכונה באקדמיה: לא רק build, אלא curl אמיתי ל-production אחרי כל push."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="advanced-production-deployment-workflows"
        title="הרץ צינור דיפלוי מלא על שינוי קטן ל-AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk (או פרויקט Vercel אחר שלך)."
        steps={[
          "בצע שינוי קטן ואמיתי.",
          "הרץ build+typecheck מקומית.",
          "בדוק ידנית ב-preview.",
          "push, ואז אמת בפועל ב-production (curl/ביקור באתר) — לא רק שהדיפלוי 'הצליח'.",
        ]}
        successCriteria={[
          "עברת את כל 4 השלבים בפועל, לא רק חלק מהם",
          "יש לך אימות production אמיתי (לא רק 'זה נדחף')",
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
          חשוב על דיפלוי אחרון שביצעת (בכל פרויקט) בלי אימות production מלא. האם היה שם משהו
          שהיה מתגלה רק בבדיקה אמיתית, לא ב-build?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
