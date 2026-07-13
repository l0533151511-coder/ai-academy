"use client";

import { ClipboardList, Boxes, Hammer, CheckCircle2, Layers } from "lucide-react";
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
  lessonSlug: "building-features-workflow",
  title: "workflow מלא לבניית פיצ'ר מאפס",
  objectives: [
    "לתרגל את התהליך המלא: spec→תכנון→שלד→מימוש→בדיקה→סקירה עם Claude Code",
    "להבין למה 'שלד קודם, מימוש אחר כך' מייצר קוד יציב יותר",
    "לזהות את ההבדל בין 'תוסיף עמוד התחברות' לבין spec מדויק — ולמה זה משנה הכל",
    "לזהות נקודות עצירה טבעיות לאימות תוך כדי בנייה, ולקרוא את הפלט בביקורתיות",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: AtlasDesk מקבל סוכן עם החלטה אוטונומית"],
};

const SLIDES: Slide[] = [
  {
    title: "מודול חדש: מהתכנון לביצוע יומיומי",
    bullets: [
      "עד כה למדת לתכנן (מודול 2) ולהרחיב את AtlasDesk עם יכולות AI (MCP/RAG/Agents). המודול הזה חוזר ליסודות: איך בונים כל פיצ'ר — לא רק AI — בעזרת Claude Code בצורה מקצועית וחוזרת.",
      "הטעות הנפוצה עם Claude Code: לזרוק פרומפט מעורפל ('תוסיף עמוד התחברות') ולקבל קוד שנראה סביר אבל מחליט לבד עשרות החלטות שלא התכוונת אליהן.",
      "המיומנות המרכזית של השיעור: לכתוב spec לפני שמבקשים קוד, ולעבוד בלולאה עם נקודות אימות זולות.",
    ],
  },
  {
    title: "spec לפני קוד: 'תוסיף עמוד התחברות' מול spec",
    bullets: [
      "'תוסיף עמוד התחברות' משאיר ל-Claude Code להחליט: אימייל+סיסמה או OAuth? איפה נשמר הטוקן? מה קורה בכישלון? האם יש rate limiting? כל החלטה כזו עלולה לא לתאום את הצורך.",
      "spec טוב עונה על השאלות מראש: 'טופס אימייל+סיסמה, ולידציה בצד לקוח, POST ל-/api/auth/login, בכישלון הצג הודעה בעברית בלי לחשוף אם המשתמש קיים, בהצלחה נווט ל-/dashboard'.",
      "כתיבת ה-spec היא העבודה ההנדסית האמיתית — הקוד עצמו הוא כמעט תוצר-לוואי. Claude Code מצוין במימוש spec ברור; הוא מנחש כשה-spec מעורפל.",
    ],
  },
  {
    title: "שלד לפני מימוש מלא",
    bullets: [
      "במקום לבקש 'תממש את הכל בבת אחת', בקש קודם שלד: חתימות פונקציות, טיפוסים, מבנה קבצים — בלי לוגיקה פנימית.",
      "בדוק את השלד (הוא קריא ומהיר לבדוק) לפני שממשיכים למימוש המלא — בדיוק כמו architecture-first שלמדת, אבל ברמת קוד ולא רק טיפוסים.",
      "השלד הוא נקודת אימות זולה: קל לתקן חתימה שגויה עכשיו מאשר לגלות אחרי מימוש מלא שהממשק לא נכון.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: ClipboardList, label: "1. spec + תכנון", detail: "כותבים spec מדויק: מטרה, אילוצים, מקרי קצה, קריטריון הצלחה — עונים על ההחלטות מראש במקום להשאיר לסוכן לנחש." },
  { icon: Boxes, label: "2. שלד", detail: "מבקשים חתימות פונקציות/טיפוסים/מבנה קבצים — בלי לוגיקה פנימית עדיין. בודקים את החוזה." },
  { icon: Hammer, label: "3. מימוש", detail: "ממלאים את השלד בלוגיקה האמיתית, צעד-צעד לפי הפירוק שתוכנן." },
  { icon: CheckCircle2, label: "4. בדיקה + סקירה", detail: "typecheck + build + בדיקה ידנית בדפדפן, וקריאה ביקורתית של ה-diff — לפני שממשיכים לפיצ'ר הבא." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה לבקש 'שלד' (חתימות פונקציות בלי לוגיקה) לפני מימוש מלא?",
    options: [
      "כי זה חוסך זמן כתיבה בלבד",
      "כי שלד קריא ומהיר לבדוק — אפשר לתפוס בעיית מבנה/ממשק לפני שמשקיעים בלוגיקה מלאה שאולי תצטרך להיכתב מחדש",
      "כי Claude Code לא מסוגל לכתוב לוגיקה מורכבת בבת אחת",
      "זה שלב טכני שאין לו באמת תועלת",
    ],
    correctIndex: 1,
    explanation: "שלד הוא נקודת אימות זולה — הרבה יותר קל לתקן חתימת פונקציה שגויה מאשר לגלות אחרי מימוש מלא שהממשק לא נכון.",
    optionNotes: [
      "לא נכון: החיסכון האמיתי הוא במניעת כתיבה-מחדש, לא רק בזמן כתיבה ראשוני.",
      "התשובה הנכונה: שלד הוא בדיוק נקודת ביקורת זולה — בודקים את המבנה לפני שמשקיעים בפרטים.",
      "לא נכון: Claude Code בהחלט מסוגל לכתוב לוגיקה מורכבת — זו בחירת workflow, לא מגבלת יכולת.",
      "לא נכון: יש תועלת ממשית ומדידה — מניעת עבודה כפולה על מימוש שהתברר כמבוסס על ממשק שגוי.",
    ],
  },
  {
    id: "q2",
    question: "מה ההבדל המהותי בין הפרומפט 'תוסיף עמוד התחברות' לבין spec מדויק, מבחינת מה ש-Claude Code יפיק?",
    options: [
      "אין הבדל — Claude Code תמיד מייצר את אותו קוד",
      "פרומפט מעורפל מאלץ את Claude Code להחליט לבד עשרות פרטים (OAuth או סיסמה? איפה הטוקן? מה בכישלון?), ו-spec מדויק קובע אותם מראש כך שהפלט תואם את הכוונה",
      "spec מדויק גורם ל-Claude Code לכתוב פחות קוד",
      "פרומפט מעורפל תמיד נכשל לחלוטין ולא מייצר כלום",
    ],
    correctIndex: 1,
    explanation: "Claude Code תמיד ימלא את החללים במשהו. השאלה היא אם ה'משהו' הזה מגיע מה-spec שלך או מניחוש שלו. spec מדויק מעביר את ההחלטות ההנדסיות אליך.",
    optionNotes: [
      "לא נכון: הפלט תלוי לחלוטין בפרומפט — פרומפט מעורפל מייצר תוצאות משתנות ולא צפויות.",
      "התשובה הנכונה: זה בדיוק העניין — הפלט תמיד 'מלא', השאלה היא מי קיבל את ההחלטות, אתה או הסוכן.",
      "לא נכון: כמות הקוד לא הנקודה — התאימות לכוונה שלך היא הנקודה.",
      "לא נכון: פרומפט מעורפל דווקא מייצר קוד (שנראה סביר) — וזו הסכנה, לא כישלון גלוי.",
    ],
  },
  {
    id: "q3",
    question: "אחרי ש-Claude Code מימש את הפיצ'ר וה-build עובר, מה הצעד שמבדיל מהנדס בכיר ממתחיל?",
    options: [
      "לעשות commit מיד — build עובר, סימן שהכל תקין",
      "לקרוא את ה-diff בביקורתיות ולבדוק ידנית את ההתנהגות מול ה-spec (כולל מקרי קצה), כי build מוכיח קומפילציה, לא נכונות",
      "לבקש מ-Claude Code לכתוב את הכל מחדש כדי לוודא",
      "למחוק את הטסטים כדי לא להאט את ה-CI",
    ],
    correctIndex: 1,
    explanation: "build ירוק אומר שהקוד מתקמפל — לא שהוא עושה את מה שהתכוונת. סקירת diff מול ה-spec, ובדיקה ידנית של מקרי הקצה, היא נקודת האימות שתופסת פערים בין הכוונה למימוש.",
    optionNotes: [
      "לא נכון: build עובר ≠ הפיצ'ר נכון — זו בדיוק ההנחה שמכניסה באגים לפרודקשן.",
      "התשובה הנכונה: אימות מול ה-spec (קריאת diff + בדיקה ידנית של מקרי קצה) הוא מה שסוגר את הפער.",
      "לא נכון: כתיבה מחדש היא בזבוז — הבעיה, אם יש, ממוקדת ומתגלה בסקירה.",
      "לא נכון: מחיקת טסטים מסירה את רשת הביטחון — ההפך הגמור מאימות.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מהתכנון לביצוע", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "ה-workflow המלא", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: פרומפט מעורפל מול spec+שלד",
    content: (
      <PromptComparisonLab
        title="הוספת פיצ'ר 'תגיות לשיחות' ב-AtlasDesk"
        unitLabel="workflow עם Claude Code"
        bad={{
          label: "פרומפט מעורפל, מימוש מלא ישיר",
          content: `"תוסיף תגיות לשיחות ב-AtlasDesk, עם UI לניהול תגיות
וסינון לפי תגית"
→ בקשה אחת מעורפלת, Claude Code מממש הכל ישר`,
          outcome: "הסוכן בוחר לבד: תגית אחת או כמה לשיחה? צבעים? איפה נשמר? הוא מחליט — ואם זה לא תואם את הצורך האמיתי (למשל צריך כמה תגיות, לא אחת) — מתגלה רק אחרי שהכל כבר נכתב, כולל ה-UII.",
        }}
        good={{
          label: "spec מדויק, ואז שלד קודם",
          content: `1. spec: "כל שיחה יכולה לקבל 0..N תגיות. תגית = {id, name,
   color}. סינון לפי תגית אחת בכל פעם. תגיות נשמרות ב-store הקיים."
2. "תציע קודם רק את הטיפוסים: Tag, ConversationWithTags,
   וחתימות addTag/removeTag/filterByTag — בלי לוגיקה או UI"`,
          outcome: "בודקים את החוזה (conversation.tags: Tag[] — מאשר שאכן כמה תגיות) מול ה-spec לפני שמשקיעים במימוש ה-UI המלא. אם השלד לא תואם — תיקון של שורה, לא של פיצ'ר שלם.",
        }}
        takeaway="ה-spec מעביר את ההחלטות ההנדסיות אליך; השלד הופך אותן לחוזה קוד שבודקים בזול. Claude Code מצוין במימוש spec ברור מאחורי שלד מאושר — הוא מנחש כשמדלגים על שניהם."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="workflow מובנה (spec→שלד→מימוש→בדיקה) קיים כי הוא מפצל משימה מורכבת לנקודות אימות זולות, בדיוק כמו decomposition שלמדת — רק שכאן זה ברמת קוד קונקרטי, ומול סוכן שממלא כל חלל שתשאיר לו."
        alternatives="פיתוח 'זורם' (לבקש הכל ולתקן תוך כדי) עובד למשימות קטנות שקל לתקן; הופך מסוכן ככל שהפיצ'ר גדול/מורכב יותר, כי הפער בין הכוונה לניחוש מצטבר."
        whenNotTo="לתיקון קטן (שינוי טקסט, תיקון typo) — כל התהליך המובנה הזה הוא overhead מיותר. spec מלא לכפתור בודד זה over-engineering."
        commonMistakes="לדלג משלד ישר למימוש בלי לבדוק את השלד בעצמו. לכתוב spec מעורפל ('תוסיף עמוד התחברות') ולהתפלא שהתוצאה לא תואמת. לאשר את ה-diff הסופי בלי לקרוא אותו כי 'build עובר'."
        performance="פיצול לשלב שלד לא מאט את הפיתוח בפועל — הוא מונע את הסבב היקר של כתיבה-מחדש. סבב תקשורת אחד נוסף זול לאין ערוך ממימוש שלם שנזרק."
        security="ב-spec של פיצ'ר עם קלט משתמש (טופס, חיפוש) — כתוב את דרישות האבטחה במפורש: ולידציה, escaping, מה לא לחשוף בהודעת שגיאה. אם לא תכתוב זאת ב-spec, Claude Code עלול לממש את ה-happy path בלבד."
        cost="עלות ה-token של spec+שלד זניחה מול עלות מימוש מלא שגוי שצריך לזרוק. וזה גם זול יותר בזמן אדם: קוראים פסקת spec, לא מפענחים 300 שורות קוד."
        maintenance="ה-spec הופך למסמך: הודעת ה-commit או ה-PR מסבירה למה הפיצ'ר בנוי כך. reviewer שקורא spec+שלד מאשר בביטחון; reviewer שמקבל רק diff ענק מנחש."
        realWorld="בפרויקט המודול תשתמש בדיוק בתהליך הזה יחד עם TDD (שיעור 4) לבניית פיצ'ר אמיתי ב-AtlasDesk — ה-spec יגדיר את ההתנהגות, הטסטים יאכפו אותה."
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
            <li>פרומפט מעורפל (&quot;תוסיף עמוד X&quot;) — Claude Code מנחש עשרות החלטות שלא התכוונת אליהן.</li>
            <li>מדלגים על שלד ומקבלים מימוש מלא שמבוסס על ממשק שגוי — כתיבה-מחדש יקרה.</li>
            <li>&quot;build עובר&quot; מתייחסים אליו כאילו הוא מוכיח נכונות — הוא מוכיח רק קומפילציה.</li>
            <li>מאשרים diff גדול בלי לקרוא, כי אין כוח לפענח 300 שורות.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>כותבים spec שעונה על ההחלטות מראש (מקרי קצה, כישלון, אבטחה).</li>
            <li>מבקשים שלד ובודקים את החוזה מול ה-spec לפני מימוש.</li>
            <li>בודקים ידנית בדפדפן מול ה-spec, כולל מקרי קצה — לא רק build.</li>
            <li>קוראים את ה-diff בביקורתיות; שלד קצר הופך גם את הסקירה לזולה.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית עם Claude Code שלך",
    content: (
      <RealWorldTask
        id="core-dev-building-features-workflow"
        title="תרגל spec→שלד→מימוש על פיצ'ר קטן ב-AtlasDesk"
        context="עבוד ב-Claude Code האמיתי שלך. בחר פיצ'ר קטן-בינוני (לדוגמה: מונה תווים בתיבת הקלט עם אזהרה מעל 500, או אינדיקציית 'נשלח/נכשל' על הודעות)."
        steps={[
          "כתוב spec של 4-6 שורות: מה בדיוק הפיצ'ר עושה, מקרי קצה (מה מעל הגבול? מה בכישלון?), וקריטריון הצלחה — לפני שאתה פונה לסוכן.",
          "בקש מ-Claude Code שלד בלבד (חתימות/טיפוסים, בלי לוגיקה) לפי ה-spec.",
          "עבור על השלד מול ה-spec: האם הוא מכסה את מקרי הקצה? האם משהו חסר?",
          "רק אחרי אישור השלד — בקש מימוש מלא.",
          "הרץ typecheck ובדוק ידנית בדפדפן — כולל מקרה הקצה שכתבת ב-spec, לא רק המסלול הרגיל.",
          "צעד דיבוג: קרא את ה-diff וחפש מקום אחד שבו Claude Code החליט משהו שלא כתבת ב-spec. אם מצאת — או שתעדכן את ה-spec, או שתבקש שינוי. זה מלמד אותך כמה ה-spec שלך היה מלא.",
        ]}
        successCriteria={[
          "יש לך spec כתוב לפני הפרומפט הראשון לסוכן",
          "ראית שלד לפני מימוש מלא, לא רק תיאורטית",
          "בדקת ידנית לפחות מקרה קצה אחד מה-spec",
          "זיהית לפחות החלטה אחת שהסוכן קיבל לבד, ויודע/ת אם היא תואמת את הכוונה",
        ]}
      />
    ),
  },
  {
    id: "recap",
    label: "רגע לפני שממשיכים: בקצרה",
    content: (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-2 flex items-center gap-2 font-bold">
          <Layers size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>spec לפני קוד</strong>: Claude Code ממלא כל חלל — עדיף שההחלטות יגיעו ממך, לא מניחוש שלו.</li>
          <li><strong>שלד לפני מימוש</strong>: בודקים את חוזה הקוד בזול, לפני שמשקיעים בלוגיקה.</li>
          <li><strong>בדיקה מול ה-spec</strong>, לא רק build. build מוכיח קומפילציה, לא נכונות.</li>
          <li><strong>קוראים את ה-diff</strong> בביקורתיות — במיוחד היכן הסוכן החליט לבד.</li>
        </ol>
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
          בפעם הבאה שאתה מבקש פיצ'ר לא-טריוויאלי מ-Claude Code (בכל פרויקט), כתוב קודם spec של 5
          שורות ובקש שלד לפני קוד. שים לב אם זה חוסך לך סבב תיקונים מאוחר יותר.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          בנית פיצ'ר — ומשהו לא עבד כמצופה? בשיעור הבא, Debugging יעיל, נלמד איך לתת ל-Claude Code
          את ההקשר הנכון כדי לאבחן באג במהירות, במקום סבב ניחושים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
