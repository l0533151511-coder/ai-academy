"use client";

import { FileCode2, XCircle, Hammer, CheckCircle2 } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "core-dev-workflows",
  lessonSlug: "tdd-with-claude-code",
  title: "TDD עם Claude Code",
  objectives: [
    "לתרגל כתיבת טסטים לפני מימוש, ולתת ל-Claude Code לממש עד שהם עוברים",
    "להבין למה TDD עם AI שונה מ-TDD אנושי (מי כותב את הטסט, מי בודק אותו)",
    "לזהות מתי TDD משתלם ומתי הוא overhead מיותר",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["debugging-with-claude-code"],
};

const SLIDES: Slide[] = [
  {
    title: "TDD עם AI: אותו עיקרון, תפקידים שונים",
    bullets: [
      "TDD קלאסי: אתה כותב טסט כושל, אתה כותב מימוש עד שהוא עובר. עם Claude Code: אתה (או הסוכן) כותב את הטסט תחילה — אבל מי שממש 'מגן' על הכוונה המקורית הוא הטסט עצמו, לא הזיכרון שלך.",
      "זה קריטי דווקא כשעובדים עם AI: הטסט הוא 'חוזה' חד-משמעי שהסוכן לא יכול לפרש לא-נכון — בניגוד לתיאור מילולי שעלול להתפרש בכמה דרכים.",
    ],
  },
  {
    title: "מי כותב את הטסט?",
    bullets: [
      "הכי בטוח: אתה כותב את הטסט (או לפחות מאשר אותו בקפידה) — כך אתה בטוח שהוא באמת בודק את מה שהתכוונת.",
      "פחות בטוח: לתת ל-Claude Code לכתוב גם את הטסט וגם את המימוש — יש סיכון ש'יתאים' את הטסט למימוש שהוא כותב, במקום שהטסט יכריח מימוש נכון.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: FileCode2, label: "1. כתיבת טסט", detail: "כותבים (או מאשרים) טסט שמתאר את ההתנהגות הרצויה — לפני שקיים מימוש." },
  { icon: XCircle, label: "2. הרצה — נכשל", detail: "מריצים את הטסט ומוודאים שהוא נכשל (red) — מוודא שהטסט באמת בודק משהו, לא 'עובר תמיד'." },
  { icon: Hammer, label: "3. מימוש", detail: "Claude Code מממש קוד שמטרתו היחידה היא לגרום לטסט לעבור — לא 'לנחש' מעבר לזה." },
  { icon: CheckCircle2, label: "4. הרצה — עובר", detail: "מריצים שוב ומוודאים שהטסט עובר (green) — זה קריטריון ההצלחה האובייקטיבי, לא 'זה נראה טוב'." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה חשוב לוודא שהטסט 'נכשל' (red) לפני שממשים את הפיצ'ר?",
    options: [
      "זה לא חשוב, אפשר לדלג על השלב הזה",
      "כדי לוודא שהטסט אכן בודק משהו אמיתי — טסט ש'עובר תמיד' (גם בלי מימוש) לא מגן על כלום",
      "כי Claude Code דורש את זה טכנית",
      "כדי לחסוך זמן בהרצת הטסטים",
    ],
    correctIndex: 1,
    explanation: "טסט שעובר גם בלי מימוש (למשל בגלל באג בטסט עצמו) לא באמת בודק את ההתנהגות — שלב ה'red' מוודא שהטסט תקף לפני שסומכים עליו.",
    optionNotes: [
      "לא נכון: זה בדיוק השלב שמוודא שהטסט 'אמיתי' — דילוג עליו מסוכן.",
      "התשובה הנכונה: אם הטסט עובר גם בלי מימוש, הוא לא בודק כלום — צריך לוודא שהוא נכשל קודם כדי לדעת שהוא רגיש למימוש הנכון.",
      "לא נכון: זו לא דרישה טכנית של Claude Code — זה עיקרון מתודולוגי של TDD עצמו.",
      "לא נכון: השלב הזה לא חוסך זמן — הוא מוסיף בדיקת תקפות לפני ההשקעה במימוש.",
    ],
  },
  {
    id: "q2",
    question: "מה הסיכון בלתת ל-Claude Code לכתוב גם את הטסט וגם את המימוש בעצמו, בלי בדיקה שלך?",
    options: [
      "אין סיכון, זה חוסך זמן בלבד",
      "הסוכן עלול 'להתאים' את הטסט למימוש שהוא כותב, כך שהטסט תמיד יעבור בלי לבדוק אמת אמיתית",
      "Claude Code לא מסוגל טכנית לכתוב טסטים",
      "זה יעבוד רק בשפות תכנות מסוימות",
    ],
    correctIndex: 1,
    explanation: "כשאותו גורם כותב טסט ומימוש יחד, הטסט מאבד את תפקידו כ'חוזה עצמאי' — הוא עלול פשוט לשקף את מה שהמימוש עושה, לא את מה שהתכוונת.",
    optionNotes: [
      "לא נכון: יש כאן סיכון איכותי אמיתי, לא רק שיקול זמן.",
      "התשובה הנכונה: הטסט מאבד את ערכו כ'בדיקה עצמאית' כשהוא נכתב יחד עם המימוש על ידי אותו גורם.",
      "לא נכון: Claude Code כן מסוגל לכתוב טסטים היטב — הסיכון הוא בתהליך (מי מאשר את מה), לא ביכולת.",
      "לא נכון: העיקרון הזה כללי לכל שפת תכנות — לא ספציפי לטכנולוגיה מסוימת.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: TDD עם AI", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "מחזור ה-TDD", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: מימוש ישיר מול TDD",
    content: (
      <PromptComparisonLab
        title="הוספת פונקציית ולידציה למספר פנייה (פורמט AD-XXXX)"
        unitLabel="workflow"
        bad={{
          label: "מימוש ישיר, בלי טסט",
          content: `"תוסיף פונקציה שבודקת אם מחרוזת היא מספר פנייה תקין"
→ מימוש ישיר, בלי הגדרת מקרי קצה מראש`,
          outcome: "לא ברור אם 'ad-1042' (אותיות קטנות) תקין, מה עם 'AD-104' (4 ספרות)? המימוש עשוי להחליט את זה 'איך שיצא', בלי שהתכוונת לזה.",
        }}
        good={{
          label: "TDD: טסטים קודם",
          content: `test("AD-1042 תקין", ...)
test("ad-1042 (אותיות קטנות) לא תקין", ...)
test("AD-104 (חסר ספרה) לא תקין", ...)
test("AD-10420 (ספרה עודפת) לא תקין", ...)
→ רק אחרי אישור הטסטים, מבקשים מימוש`,
          outcome: "כל מקרה קצה מוגדר במפורש לפני המימוש — הטסטים עצמם מתעדים את ההחלטות (case-sensitivity, אורך מדויק) בלי צורך לזכור אותן בנפרד.",
        }}
        takeaway="TDD במיוחד יעיל למקרים עם מקרי-קצה רבים (ולידציה, פרסינג) — הטסטים הופכים את ההחלטות המרומזות (מה תקין, מה לא) למפורשות וניתנות לאימות."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="TDD עם AI קיים כי טסט הוא 'חוזה' חד-משמעי שהסוכן לא יכול לפרש בטעות — בניגוד לתיאור מילולי שתלוי בניסוח."
        alternatives="לתאר את ההתנהגות הרצויה במילים בלבד (בלי טסטים) — מהיר יותר למשימות פשוטות, אבל משאיר מקום לפרשנות שגויה במקרי קצה."
        whenNotTo="לקוד אקספלורטיבי/פרוטוטייפ שעדיין לא ברור לך בעצמך מה ההתנהגות הרצויה — TDD דורש לדעת מראש מה לבדוק, וזה סותר את שלב האקספלורציה."
        commonMistakes="לתת ל-Claude Code לכתוב את הטסטים בעצמו ולא לקרוא אותם בעיון — הטסטים חייבים לשקף את הכוונה שלך, לא רק 'להיראות סביר'."
        cost="כתיבת טסטים מוסיפה זמן מראש, אבל חוסכת זמן debugging מאוחר יותר (טסט שנכשל מצביע מיד על הבעיה, במקום חקירה ארוכה)."
        security="לפונקציות ולידציה/פרסינג — הטסטים חייבים לכלול קלט זדוני/שבור, לא רק קלט תקין: מחרוזת ריקה, אורך חורג, תווים לא-צפויים, injection. TDD מכריח אותך להגדיר את גבול ה'תקין' במפורש, וזה בדיוק הגבול שתוקף מנסה לחצות. טסט שבודק רק את ה-happy path נותן ביטחון-שווא."
        maintenance="הטסטים הם התיעוד החי של ההחלטות: חצי שנה אחר כך, טסט 'ad-1042 (אותיות קטנות) לא תקין' מסביר למתחזק הבא *למה* הפונקציה קפדנית — בלי צורך בהערה נפרדת. וכשמישהו (או Claude Code) ישנה את הפונקציה בעתיד, הטסטים יתפסו מיד אם ההתנהגות המקורית נשברה."
        realWorld="בפרויקט המודול הבא תשתמש ב-TDD כדי לבנות פיצ'ר אמיתי ב-AtlasDesk — הטסטים יתעדו את ההחלטות שלך לאורך זמן."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר בפרודקשן מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר מערכות בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>נותנים ל-Claude Code לכתוב גם טסט וגם מימוש, ולא קוראים את הטסט — הוא ”מתאים” לעצמו.</li>
            <li>מדלגים על שלב ה-red — טסט שעובר גם בלי מימוש לא מגן על כלום.</li>
            <li>בודקים רק happy path — הפונקציה נשברת על מקרה הקצה שלא כתבתם לו טסט.</li>
            <li>מוחקים טסט שנכשל אחרי שינוי, במקום לברר אם השינוי שבר התנהגות אמיתית.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>כותבים (או קוראים בעיון) את הטסט בעצמם — הוא החוזה, לא ה-suggestion של הסוכן.</li>
            <li>מוודאים red לפני מימוש — כדי לדעת שהטסט באמת רגיש למימוש.</li>
            <li>מכסים מקרי קצה במפורש: ריק, אורך חורג, case-sensitivity, קלט זדוני.</li>
            <li>טסט שנכשל אחרי שינוי = אזהרה לחקור, לא מכשול למחוק.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="core-dev-tdd-with-claude-code"
        title="תרגל TDD על פונקציית ולידציה"
        context="עבוד עם Claude Code על כל פרויקט (או AtlasDesk)."
        steps={[
          "בחר פונקציה קטנה עם מקרי-קצה (ולידציה, פרסינג, פורמט).",
          "כתוב (או אשר בעיון) 3-5 טסטים לפני שקיים מימוש.",
          "ודא שהטסטים נכשלים (red) בהיעדר מימוש.",
          "בקש מ-Claude Code לממש עד שכל הטסטים עוברים (green).",
        ]}
        successCriteria={[
          "כתבת/אישרת טסטים לפני מימוש, לא אחריו",
          "ראית בפועל את מעבר ה-red ל-green",
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
          חשוב על פונקציה שכתבת לאחרונה בלי טסטים. נסה לכתוב עכשיו 3 טסטים למקרי קצה שלה —
          האם גילית מקרה שהפונקציה לא מטפלת בו נכון?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
