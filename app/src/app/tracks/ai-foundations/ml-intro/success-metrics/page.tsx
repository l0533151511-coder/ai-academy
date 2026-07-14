"use client";

import { Layers, ShieldAlert, Search, Activity } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { ConfusionMatrixLab } from "@/components/simulators/confusion-matrix-lab";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { RealWorldTask } from "@/components/exercises/real-world-task";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "ai-foundations",
  moduleSlug: "ml-intro",
  lessonSlug: "success-metrics",
  title: "מדדי הצלחה: Accuracy, Precision, Recall, F1",
  objectives: [
    "להבין למה accuracy 'משקר' על נתונים לא-מאוזנים (הסיפור הקלאסי של גלאי סרטן 99%-מדויק וחסר-תועלת)",
    "להבין את ה-trade-off בין Precision ל-Recall, ומתי מכווננים את מי — ומה תפקיד F1",
    "לדעת איך מודדים פיצ'ר AI בפרודקשן: הערכה offline לפני עלייה + מדדים online אחרי",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["סוגי למידה: מונחית, לא-מונחית, חיזוקית"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה השיעור הזה פותר",
    bullets: [
      "אימנת מודל. הוא מדווח '97% דיוק'. מנהל שמח, עולים לפרודקשן — והמערכת מפספסת בדיוק את המקרים שחשובים. איך זה קרה?",
      "מדד לא-נכון גורם לך לחגוג מודל גרוע ולפסול מודל טוב. בחירת המדד היא החלטה הנדסית, לא פורמליות.",
      "בשיעור: למה accuracy מטעה, מה ההבדל בין precision ל-recall, ואיך למדוד פיצ'ר AI כשהוא כבר חי מול משתמשים.",
    ],
  },
  {
    title: "המלכודת של Accuracy",
    bullets: [
      "Accuracy = כמה אחוז מהחיזויים היו נכונים בסך הכל.",
      "מלכודת: אם 99% מהבדיקות בריאות, מודל שתמיד עונה 'בריא' משיג 99% accuracy — ומפספס 100% מהחולים. 'מדויק' וחסר-תועלת בו-זמנית.",
      "ככל שהנתונים לא-מאוזנים יותר (מחלה נדירה, הונאה, ספאם), כך accuracy מטעה יותר. זהו המקרה השכיח בפרודקשן, לא החריג.",
    ],
  },
  {
    title: "Precision מול Recall",
    bullets: [
      "Precision: מכל מה שהמודל סימן 'חיובי', כמה באמת היו חיוביים? מכוונים אותו כשטעות חיובית-כוזבת יקרה (חסמנו מייל תקין של מנכ\"ל).",
      "Recall: מכל החיוביים האמיתיים, כמה המודל תפס? מכוונים אותו כשפספוס מסוכן (החמצנו גידול סרטני).",
      "יש trade-off: הידוק אחד מרפה את השני. F1 הוא הממוצע ההרמוני שלהם — מדד יחיד כשרוצים איזון בין השניים.",
    ],
  },
  {
    title: "לא רק offline — גם בפרודקשן",
    bullets: [
      "לפני עלייה: הערכה offline על מערך test שהמודל לא ראה — precision/recall/F1, ומטריצת בלבול.",
      "אחרי עלייה: מדדי online — האם המשתמשים לחצו 'זה כן ספאם'? האם הסימונים ירדו? הנתון האמיתי מגיע מהשטח.",
      "מודל טוב offline שנכשל online = הנתונים בפרודקשן שונים מנתוני האימון. תמיד סוגרים את הלולאה עם מדידה חיה.",
    ],
  },
];

const METRIC_STEPS: DiagramStep[] = [
  {
    icon: ShieldAlert,
    label: "כמה יקרה טעות חיובית-כוזבת (False Positive)?",
    detail: "אם לסמן משהו תקין בטעות כ'חיובי' הוא יקר — חסימת מייל לגיטימי, האשמת לקוח כשר בהונאה — מייעלים Precision. עדיף לפספס מאשר להתריע לשווא.",
  },
  {
    icon: Search,
    label: "כמה מסוכן פספוס (False Negative)?",
    detail: "אם להחמיץ מקרה חיובי אמיתי הוא הרסני — גידול סרטני שלא זוהה, הונאה שעברה — מייעלים Recall. עדיף להתריע יותר מדי מאשר לפספס.",
  },
  {
    icon: Activity,
    label: "צריך איזון בין השניים?",
    detail: "כשגם FP וגם FN עולים, וקשה להעדיף אחד — משתמשים ב-F1 (ממוצע הרמוני של precision ו-recall) כמדד יחיד להשוואת מודלים.",
  },
];

const EXERCISE: ExerciseConfig = {
  id: "success-metrics-ex1",
  prompt:
    "כתוב פונקציה בשם calculateRecall שמקבלת truePositives ו-falseNegatives ומחזירה את ה-Recall כאחוז (0-100), מעוגל למספר שלם.",
  starterCode: `function calculateRecall(truePositives, falseNegatives) {
  // Recall = TP / (TP + FN) * 100
  // TODO: החזר את התוצאה מעוגלת (Math.round)
}`,
  hints: [
    "הנוסחה נתונה בהערה — רק תממש אותה ב-JavaScript.",
    "נסה: return Math.round((truePositives / (truePositives + falseNegatives)) * 100);",
    "טעות נפוצה: לשכוח את הסוגריים סביב truePositives + falseNegatives לפני החילוק — סדר פעולות שגוי ייתן תוצאה שגויה.",
  ],
  solutionCode: `function calculateRecall(truePositives, falseNegatives) {
  return Math.round((truePositives / (truePositives + falseNegatives)) * 100);
}`,
  check: (userFn) => {
    const fn = userFn as (tp: number, fn: number) => number;
    try {
      const result = fn(3, 2);
      if (result === 60) {
        return { passed: true, message: "מדויק! 3/(3+2) = 60% — בדיוק כמו בתרחיש שראית בסימולטור." };
      }
      return { passed: false, message: `קיבלתי ${result}, ציפיתי ל-60.` };
    } catch (e) {
      return { passed: false, message: `שגיאת הרצה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "גלאי מחלה נדירה (1% מהאוכלוסייה חולים) מדווח 99% accuracy. למה זה יכול להיות חסר-ערך לחלוטין?",
    options: [
      "99% זה תמיד מצוין — אין כאן בעיה",
      "מודל שתמיד עונה 'בריא' משיג 99% accuracy אך תופס 0% מהחולים (recall אפסי) — accuracy מסתיר את זה בנתונים לא-מאוזנים",
      "הבעיה היא שצריך יותר נתוני אימון",
      "accuracy תמיד שווה ל-recall, אז 99% recall זה מעולה",
    ],
    correctIndex: 1,
    explanation:
      "כשמחלקה אחת נדירה (1% חולים), הרוב המוחלט מהמקרים שליליים. מודל 'טיפש' שעונה תמיד 'בריא' צודק ב-99% מהמקרים — אבל ה-recall שלו על החולים הוא אפס. זה בדיוק למה בנתונים לא-מאוזנים בודקים precision ו-recall לכל מחלקה, לא accuracy כולל.",
    optionNotes: [
      "שגוי: הערך המספרי הגבוה הוא בדיוק המלכודת — הוא נובע מחוסר האיזון, לא מטיב המודל.",
      "נכון: המודל תופס אפס חולים אך 'צודק' ב-99%. accuracy עיוור לכך; recall חושף זאת.",
      "שגוי: הבעיה אינה כמות נתונים אלא בחירת המדד — אותו מודל ייראה 'מצוין' גם עם עוד נתונים.",
      "שגוי: accuracy ו-recall הם מדדים שונים לגמרי; כאן ה-accuracy 99% וה-recall 0%.",
    ],
  },
  {
    id: "q2",
    question: "לגלאי הונאה בכרטיס אשראי, איזה מדד לרוב מייעלים ומדוע?",
    options: [
      "Precision — כי חסימת עסקה תקינה של לקוח לגיטימי מרגיזה ומאבדת אותו, אז רוצים שהתראה תהיה כמעט תמיד אמיתית",
      "Recall — כי עדיף לחסום כמה שיותר עסקאות, גם תקינות",
      "Accuracy — כי הוא המדד היחיד שחשוב",
      "אף מדד — הונאה לא ניתנת למדידה",
    ],
    correctIndex: 0,
    explanation:
      "כאן טעות חיובית-כוזבת (לסמן עסקה כשרה כהונאה) יקרה: הלקוח נחסם, מתעצבן ואולי עוזב. לכן מייעלים precision — שכשמתריעים, זו כנראה באמת הונאה. במחיר: recall נמוך יותר (חלק מההונאות יעברו), ולכן מוסיפים שכבות הגנה נוספות. זו ההחלטה ההנדסית: לבחור את המדד לפי עלות סוג הטעות, לא לפי נוחות.",
    optionNotes: [
      "נכון: FP יקר (לקוח נחסם וכועס) ⇒ מייעלים precision, גם במחיר החמצת חלק מההונאות.",
      "שגוי: לחסום הכל מקסים recall אבל הורג את חוויית הלקוח — לא ריאלי מסחרית.",
      "שגוי: accuracy מטעה בהונאה (נדירה); הוא לא המדד להחלטה כאן.",
      "שגוי: הונאה בהחלט נמדדת — עם precision/recall בדיוק כמו כל סיווג בינארי.",
    ],
  },
  {
    id: "q3",
    question: "מודל השיג offline precision ו-recall מצוינים, אבל בפרודקשן המשתמשים מתלוננים על תוצאות גרועות. מה השורש ההנדסי הסביר?",
    options: [
      "המדדים offline תמיד משקרים ואין טעם למדוד אותם",
      "נתוני הפרודקשן שונים מנתוני האימון/test (distribution shift) — לכן חובה למדוד גם מדדים online חיים",
      "צריך פשוט לאמן מודל גדול יותר",
      "המשתמשים טועים — המדדים offline הם האמת היחידה",
    ],
    correctIndex: 1,
    explanation:
      "מדדי offline נמדדים על מערך test שנדגם בעבר. אם המציאות בפרודקשן שונה — סלנג חדש, סוג משתמשים אחר, עונתיות — הביצועים בשטח יורדים למרות מספרים יפים במעבדה. לכן סוגרים את הלולאה: מודדים מדדי online (משוב משתמשים, שיעורי סימון) ומריצים מחדש הערכה על נתונים עדכניים.",
    optionNotes: [
      "שגוי: מדדי offline חיוניים לסינון לפני עלייה — הם פשוט לא מספיקים לבד.",
      "נכון: פער התפלגות בין אימון לפרודקשן הוא החשוד המרכזי; מדידה online חושפת אותו.",
      "שגוי: גודל מודל לא פותר פער התפלגות — מודל גדול יותר יתאים גם הוא לנתונים הישנים.",
      "שגוי: תלונות המשתמשים הן דווקא אות אמת מהשטח שאסור להתעלם ממנו.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "choose-metric",
    label: "איך בוחרים מדד — לפי עלות סוג הטעות",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          אין ”המדד הכי טוב” — יש המדד הנכון <strong>לסוג הטעות שהכי יקר לך</strong>. עבור על
          השאלות לפני שאתה בוחר:
        </p>
        <StepDiagram steps={METRIC_STEPS} />
      </div>
    ),
  },
  {
    id: "simulator",
    label: "סימולטור: מטריצת בלבול (Confusion Matrix) חיה",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          כל המדדים נגזרים מ-4 מספרים: TP, FP, FN, TN. שחק עם הספים בסימולטור וראה איך <strong>הידוק
          precision מרפה recall</strong> — זה ה-trade-off, בעיניים:
        </p>
        <ConfusionMatrixLab />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "רע מול טוב: אותו מודל, מדד שמטעה מול מדד שחושף",
    content: (
      <PromptComparisonLab
        title="הערכת מסווג ספאם — 10,000 מיילים, מתוכם רק 200 ספאם (2%)"
        unitLabel="דוח הערכה"
        bad={{
          label: "מדווחים accuracy בלבד",
          content:
            "Model report:\n  Accuracy: 98%   ✅ looks great!\n\n// ההנהלה מאשרת עלייה לפרודקשן.\n// מה שלא נאמר בדוח:\n// המודל תופס רק 20 מתוך 200 הספאמים.\n// הוא 'צודק' ב-98% כי כמעט הכל תקין ממילא.",
          outcome:
            "פלט: מודל שנראה מצוין ומפספס 90% מהספאם. המדד הנבחר הסתיר את הכישלון בדיוק במחלקה שבגללה בנינו את המערכת.",
        }}
        good={{
          label: "מדווחים precision, recall ו-F1 למחלקת הספאם",
          content:
            "Model report (spam class):\n  Precision: 91%  (מה שסימנו כספאם — כמעט תמיד ספאם)\n  Recall:    10%  ⚠️ תופסים רק 10% מהספאם!\n  F1:        0.18 ← חושף מיד שהמודל חלש\n\n// החלטה: לרדת בסף → recall עולה,\n// לבדוק את ה-trade-off מול precision.",
          outcome:
            "פלט: אותו מודל בדיוק — אבל עכשיו רואים שה-recall אסון. F1 הנמוך מונע עלייה לפרודקשן של מודל שהיה 'עובר' על accuracy.",
        }}
        takeaway="המדד קובע איזו מציאות אתה רואה. באותם נתונים, accuracy אמר 'מצוין' ו-recall אמר 'אסון'. בחר את המדד לפי מה שחשוב לבעיה — לא לפי המספר הכי מחמיא."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="בחירת המדד היא החלטה מוצרית-הנדסית: היא קובעת איזה מודל תשלח לפרודקשן ומתי תתריע. מדד לא-מתאים גורם לך לחגוג מודל גרוע ולפסול מודל טוב — לכן בוחרים אותו לפני שמאמנים, לפי עלות סוג הטעות."
        alternatives="מעבר ל-precision/recall/F1: לבעיות לא-מאוזנות מאוד שוקלים ROC-AUC / PR-AUC (ביצועים על פני כל הספים); לרגרסיה משתמשים ב-MAE/RMSE; ולעיתים במדד עסקי ישיר (הכנסה, נטישה) במקום מדד סטטיסטי בלבד."
        whenNotTo="אל תסתמך על accuracy בנתונים לא-מאוזנים. אל תייעל recall כשכל התראת-שווא יקרה, ואל תייעל precision כשפספוס הרסני. אל תשווה מודלים לפי F1 כשברור שסוג טעות אחד יקר בהרבה מהשני — אז מדד יחיד מטשטש את ההחלטה."
        commonMistakes="לדווח accuracy בלבד; להתעלם מאיזון המחלקות; לכוונן סף על מערך ה-test עצמו (דליפה); למדוד רק offline ולהניח שזה מייצג פרודקשן; לשכוח שהמדד תלוי-סף — אותו מודל נותן precision/recall שונים בכל סף."
        performance="חישוב המדדים עצמו זול. היקר הוא מערך הערכה מייצג ותהליך הבדיקה. בפרודקשן, מדידה online (איסוף משוב, לוגים) מוסיפה עומס קל אך היא מה שחושף בעיות אמת — לא לוותר עליה כדי 'לחסוך'."
        cost="הטעות היקרה אינה בחישוב אלא בהחלטה: מודל שנבחר לפי מדד שגוי עולה בפרודקשן — ספאם שעובר, הונאה שלא נתפסת, לקוחות שנחסמו בטעות. עלות המדד הנכון היא אפס; עלות המדד הלא-נכון היא הכישלון בשטח."
        security="בגלאי הונאה/תוכן פוגעני, recall נמוך הוא חור אבטחה (מקרים אמיתיים עוברים) ו-precision נמוך הוא מטרד שמאמן משתמשים להתעלם מהתראות ('alert fatigue'). כיול הסף הוא החלטת אבטחה, לא רק מטריקה."
        maintenance="מדדים נודדים עם הזמן (concept drift): מודל שהיה מצוין נשחק כשהעולם משתנה. מתחזקים dashboard חי של precision/recall בפרודקשן ומתריעים כשהם צונחים — כדי לדעת מתי לאמן מחדש לפני שהמשתמשים מתלוננים."
        realWorld="גם פיצ'ר מבוסס-LLM נמדד ככה: אם Claude מסווג פניות תמיכה לפי דחיפות, מודדים offline על סט מתויג (precision/recall לכל רמת דחיפות) ואז online (האם 'דחוף' באמת טופל מהר?). ה-LLM השתנה, המשמעת המדידתית — לא."
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
            <li>מדווחים accuracy על נתונים לא-מאוזנים וחוגגים מודל שמפספס את מה שחשוב.</li>
            <li>מכווננים את הסף על מערך ה-test עצמו — דליפה שמנפחת את המספרים.</li>
            <li>מודדים רק offline ומניחים שזה מייצג פרודקשן — עד שהמשתמשים מתלוננים.</li>
            <li>בוחרים מדד אחרי שרואים תוצאות (”איזה מדד גורם לנו להיראות טוב?”).</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>בוחרים מדד <strong>לפני</strong> האימון, לפי עלות סוג הטעות היקר.</li>
            <li>בנתונים לא-מאוזנים מדווחים precision/recall/F1 לכל מחלקה, לא accuracy כולל.</li>
            <li>מכווננים סף על מערך <strong>validation</strong> נפרד, ובודקים על test נעול.</li>
            <li>סוגרים לולאה עם מדדי online חיים ו-dashboard שמתריע על drift.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "exercise", label: "תרגיל מודרך", content: <ExerciseValidator exercise={EXERCISE} /> },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית עם Claude Code",
    content: (
      <RealWorldTask
        id="success-metrics-eval"
        title="בנה סקריפט הערכה שחושף מודל שנראה טוב ובאמת גרוע"
        context="פתח את Claude Code בתיקייה כלשהי. תבנה מיני-סקריפט הערכה — בדיוק מה שמהנדס ML כותב לפני שהוא מאשר עלייה לפרודקשן."
        steps={[
          "בקש מ-Claude Code ליצור סקריפט שמקבל רשימת חיזויים ותוויות אמת (predicted, actual) ומחשב accuracy, precision, recall ו-F1 למחלקת ה'חיובי'.",
          "בנה מערך test לא-מאוזן: 98 דוגמאות שליליות ו-2 חיוביות. הזן 'מודל טיפש' שמנבא תמיד 'שלילי' וראה: accuracy 98%, recall 0%.",
          "בקש מ-Claude Code להסביר, על סמך הפלט, למה accuracy מטעה כאן ואיזה מדד היה מונע עלייה לפרודקשן.",
          "שנה את הסף (threshold) של מודל דמה והראה בטבלה איך precision יורד כש-recall עולה — תעד את ה-trade-off.",
          "כתוב במחברת: לתרחיש שבחרת (ספאם? הונאה? אבחון?) איזה מדד היית מייעל ולמה — ומה סף ההחלטה שהיית קובע.",
        ]}
        successCriteria={[
          "הסקריפט מדפיס accuracy, precision, recall ו-F1 נכונים על מערך לא-מאוזן",
          "הראית מקרה שבו accuracy גבוה אך recall אפסי — ואתה יכול להסביר למה",
          "יש לך טבלת trade-off של precision מול recall על פני כמה ספים, והחלטת מדד מנומקת לתרחיש שלך",
        ]}
      />
    ),
  },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Accuracy", "אחוז החיזויים הנכונים מכלל החיזויים — מטעה בנתונים לא-מאוזנים."],
          ["Precision", "מכל מה שסומן חיובי, כמה באמת חיובי. חשוב כשטעות-כוזבת יקרה."],
          ["Recall", "מכל החיוביים האמיתיים, כמה נתפסו. חשוב כשפספוס מסוכן."],
          ["F1 Score", "ממוצע הרמוני של precision ו-recall — מדד יחיד לאיזון ביניהם."],
          ["Confusion Matrix", "טבלת TP / FP / FN / TN שממנה נגזרים כל המדדים."],
          ["Online metrics", "מדדים הנמדדים בפרודקשן על תעבורה חיה — לעומת offline על מערך test."],
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
    id: "recap",
    label: "רגע לפני שממשיכים: בקצרה",
    content: (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-2 flex items-center gap-2 font-bold">
          <Layers size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>Accuracy משקר</strong> על נתונים לא-מאוזנים — גלאי שתמיד עונה ”שלילי” מקבל ציון גבוה וחסר-ערך.</li>
          <li><strong>Precision</strong> — כשטעות-כוזבת יקרה. <strong>Recall</strong> — כשפספוס מסוכן. יש ביניהם <strong>trade-off</strong>.</li>
          <li><strong>F1</strong> — מדד יחיד לאיזון בין השניים, כשאף אחד לא ברור שיקר יותר.</li>
          <li>בוחרים מדד <strong>לפני</strong> האימון, לפי עלות סוג הטעות — ומודדים גם <strong>offline וגם online</strong>.</li>
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
          בסימולטור למעלה, איזה מהתרחישים היית בוחר עבור מערכת שסורקת דואר נכנס לזיהוי וירוסים
          מסוכנים? נמק לפי precision מול recall — ושים לב מה קורה ל-recall כשאתה מהדק את הסף.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          עכשיו שאתה יודע להגדיר מדד הצלחה ולזהות מודל טוב מגרוע — בפרויקט המסכם של המודול תבנה ותכוונן
          מסווג ספאם אמיתי במו ידיך, ותראה את המדדים האלה זזים בזמן אמת.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
