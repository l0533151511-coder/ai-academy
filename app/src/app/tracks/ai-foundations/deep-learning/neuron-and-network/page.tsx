"use client";

import { Brain, Layers, Zap, TrendingUp, Sigma, Boxes } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { NeuralNetworkVisualizer } from "@/components/diagrams/neural-network-visualizer";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { ExerciseValidator, type ExerciseConfig } from "@/components/exercises/exercise-validator";
import { RealWorldTask } from "@/components/exercises/real-world-task";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "ai-foundations",
  moduleSlug: "deep-learning",
  lessonSlug: "neuron-and-network",
  title: "הנוירון המלאכותי ורשת מלאה",
  objectives: [
    "להבין מהו נוירון מלאכותי: קלטים, משקלים, סכימה, פונקציית אקטיבציה",
    "להבין למה אי-לינאריות היא חובה — ולמה בלעדיה רשת עמוקה קורסת לפונקציה לינארית אחת",
    "להבין איך נוירונים מתחברים לשכבות, ולמה עומק בונה היררכיה של תכונות",
    "לחבר את הרעיון ל-LLMs (שהם רשתות עמוקות) ולפרק את המיתוס &quot;נוירון = תא מוח&quot;",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: בניית מסווג ספאם אינטראקטיבי"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה נוירון פותר?",
    bullets: [
      "במסווג הספאם כתבת כללים ידניים: &apos;אם יש את המילה X, הוסף נקודות&apos;. זה עובד — עד שהמציאות מורכבת מדי לכתוב לה כללים ביד.",
      "נוירון הוא &apos;כלל שנלמד מנתונים&apos; במקום כלל שנכתב ביד. במקום שאתה תקבע כמה חשובה כל מילה, הרשת לומדת את המשקלים בעצמה מדוגמאות.",
      "זו קפיצת המדרגה מ&apos;תכנות מפורש&apos; ל&apos;למידה&apos;: אתה מגדיר מבנה, והנתונים ממלאים את הפרטים.",
    ],
  },
  {
    title: "נוירון בודד — המחשבון הפשוט ביותר",
    bullets: [
      "כל נוירון עושה שלוש פעולות: מכפיל כל קלט במשקל שלו, מחבר הכול (+ bias), ומעביר דרך פונקציית אקטיבציה.",
      "המשקל אומר &apos;כמה חשוב הקלט הזה&apos;; ה-bias מזיז את סף ההחלטה; האקטיבציה מכריעה &apos;כמה להידלק&apos;.",
      "נוירון בודד הוא בעצם וריאציה של מסווג הספאם: סכימה משוקללת עם סף — אבל עכשיו המספרים נלמדים אוטומטית.",
    ],
  },
  {
    title: "למה אי-לינאריות היא לב העניין",
    bullets: [
      "בלי פונקציית אקטיבציה, כל שכבה היא רק כפל וחיבור — וסדרה של פעולות לינאריות מצטמצמת מתמטית לפעולה לינארית אחת.",
      "המשמעות: רשת בת 100 שכבות בלי אקטיבציה שקולה בדיוק לנוירון בודד. כל העומק מתבזבז.",
      "האקטיבציה (ReLU, sigmoid) &apos;שוברת&apos; את הלינאריות, וזה מה שמאפשר לרשת ללמוד גבולות החלטה מעוקלים ומורכבים.",
    ],
  },
  {
    title: "מרשת רדודה לרשת עמוקה — היררכיה של תכונות",
    bullets: [
      "שכבה = הרבה נוירונים במקביל על אותו קלט. עומק = שכבות זו על גבי זו.",
      "בזיהוי תמונה: השכבה הראשונה לומדת קצוות, הבאה צירופי קצוות (פינות, עקומות), הבאה חלקי אובייקט, ובסוף — אובייקט שלם.",
      "כל שכבה בונה על התכונות של הקודמת. זו הסיבה ההנדסית ש&apos;עומק&apos; עוזר: הוא בונה הפשטה בשכבות.",
    ],
  },
];

const ANATOMY_STEPS: DiagramStep[] = [
  {
    icon: Boxes,
    label: "1 · קלטים (Inputs)",
    detail: "המספרים שנכנסים לנוירון — פיקסלים, מאפייני טקסט, או פלטים של שכבה קודמת. x₁, x₂, ... xₙ.",
  },
  {
    icon: Sigma,
    label: "2 · סכימה משוקללת",
    detail: "כל קלט מוכפל במשקל שלו והכול מסוכם: w₁x₁ + w₂x₂ + ... + b. המשקלים הם מה שהרשת לומדת.",
  },
  {
    icon: TrendingUp,
    label: "3 · Bias",
    detail: "מספר קבוע שמזיז את סף ההפעלה. בלעדיו הנוירון חייב לעבור דרך הראשית — ה-bias נותן גמישות.",
  },
  {
    icon: Zap,
    label: "4 · אקטיבציה",
    detail: "הסכום עובר דרך פונקציה לא-לינארית (ReLU/sigmoid). זה מה שהופך רשת עמוקה למשהו חזק מקו ישר.",
  },
];

const EXERCISE: ExerciseConfig = {
  id: "neuron-ex1",
  prompt:
    "כתוב פונקציה בשם neuronOutput שמקבלת מערך inputs, מערך weights (באותו אורך), ו-bias, ומחזירה את סכימת הנוירון (בלי אקטיבציה עדיין) — sum(input[i] * weight[i]) + bias.",
  starterCode: `function neuronOutput(inputs, weights, bias) {
  // TODO: החזר את סכום המכפלות + bias
}`,
  hints: [
    "תצטרך ללולאה (או reduce) שעובר על שני המערכים במקביל.",
    "נסה: return inputs.reduce((sum, x, i) => sum + x * weights[i], 0) + bias;",
    "טעות נפוצה: לשכוח להוסיף את ה-bias בסוף, או להשתמש באינדקס לא נכון.",
  ],
  solutionCode: `function neuronOutput(inputs, weights, bias) {
  return inputs.reduce((sum, x, i) => sum + x * weights[i], 0) + bias;
}`,
  check: (userFn) => {
    const fn = userFn as (i: number[], w: number[], b: number) => number;
    try {
      const result = fn([1, 2], [0.5, 0.5], 1);
      if (Math.abs(result - 2.5) < 0.001) {
        return { passed: true, message: "מדויק! (1×0.5 + 2×0.5) + 1 = 2.5" };
      }
      return { passed: false, message: `קיבלתי ${result}, ציפיתי ל-2.5.` };
    } catch (e) {
      return { passed: false, message: `שגיאת הרצה: ${(e as Error).message}` };
    }
  },
};

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מדוע פונקציית אקטיבציה לא-לינארית היא חובה, ולא רק &apos;נחמד שיהיה&apos;?",
    options: [
      "כי היא מאיצה את החישוב על ה-GPU",
      "כי בלעדיה כל שרשרת של שכבות מצטמצמת מתמטית לשכבה לינארית אחת, ומבטלת את יתרון העומק",
      "כי היא חוסכת זיכרון בזמן אימון",
      "כי בלעדיה הרשת לא תוכל לקבל קלטים שליליים",
    ],
    correctIndex: 1,
    explanation:
      "הרכבה של פונקציות לינאריות היא עצמה לינארית: f(g(x)) כששתיהן לינאריות = פונקציה לינארית אחת. לכן רשת בת 100 שכבות בלי אקטיבציה שקולה בדיוק לנוירון בודד. האקטיבציה הלא-לינארית היא מה שמאפשר לעומק לבנות גבולות החלטה מורכבים.",
    optionNotes: [
      "שגוי: אקטיבציה דווקא מוסיפה חישוב; היא לא נועדה להאצה, ו-ReLU זולה אך לא &apos;מאיצה&apos; את שאר הרשת.",
      "נכון: זו הסיבה המתמטית העמוקה — בלי אי-לינאריות העומק מתמוטט לפונקציה לינארית יחידה.",
      "שגוי: אקטיבציה לא קשורה לחיסכון בזיכרון; חלק מהפונקציות אף דורשות שמירת ערכי ביניים ל-backprop.",
      "שגוי: רשת לינארית מטפלת בקלטים שליליים מצוין; הבעיה היא כושר הביטוי, לא הסימן.",
    ],
  },
  {
    id: "q2",
    question: "מה נכון לגבי ההשוואה בין נוירון מלאכותי לתא מוח ביולוגי?",
    options: [
      "הם זהים — נוירון מלאכותי מדמה תא מוח באופן מדויק",
      "זו מטאפורה היסטורית מעוררת השראה, אבל נוירון מלאכותי הוא כפל-חיבור-אקטיבציה — פישוט מתמטי, לא ביולוגיה",
      "תא מוח פשוט יותר מנוירון מלאכותי",
      "אין שום קשר, גם לא מטאפורי, בין השניים",
    ],
    correctIndex: 1,
    explanation:
      "השם &apos;נוירון&apos; הוא ירושה היסטורית מ-1943. נוירון ביולוגי הוא מערכת אלקטרו-כימית מורכבת עם עיתוי, כימיה וסוגי אותות מרובים; נוירון מלאכותי הוא נוסחה: סכום משוקלל ואקטיבציה. להתייחס אליהם כזהים מוביל לאינטואיציות שגויות על &apos;תודעה&apos; ו&apos;הבנה&apos;.",
    optionNotes: [
      "שגוי ומטעה: זהו בדיוק המיתוס. הדמיון שטחי ומטאפורי בלבד.",
      "נכון: מטאפורה מועילה ללימוד, אך מבחינה הנדסית זו נוסחה מתמטית פשוטה.",
      "שגוי: נוירון ביולוגי מורכב בהרבה — לא פשוט יותר.",
      "שגוי: יש קשר מטאפורי-היסטורי אמיתי; ההשראה קיימת, רק אין זהות.",
    ],
  },
  {
    id: "q3",
    question: "למה &apos;עומק&apos; (הרבה שכבות) עוזר יותר מרשת רחבה ורדודה עם אותו מספר נוירונים?",
    options: [
      "כי שכבות עמוקות רצות מהר יותר על החומרה",
      "כי כל שכבה בונה תכונות מורכבות יותר על גבי התכונות של הקודמת — היררכיה של הפשטה",
      "כי עומק תמיד מונע overfitting",
      "כי רשת רחבה לא יכולה ללמוד בכלל",
    ],
    correctIndex: 1,
    explanation:
      "עומק מאפשר קומפוזיציה: השכבה הראשונה לומדת קצוות, הבאה צירופים, הבאה חלקי-אובייקט. אותו מספר נוירונים המסודר לעומק יכול לייצג פונקציות מסוימות ביעילות מעריכית לעומת רשת רדודה. זה יתרון ייצוגי, לא רק &apos;יותר&apos;.",
    optionNotes: [
      "שגוי: עומק דווקא עלול להאט ולסבך את האימון (vanishing gradients); היתרון אינו מהירות.",
      "נכון: היררכיית התכונות היא הסיבה המרכזית שעומק חזק כל כך.",
      "שגוי: עומק לא מונע overfitting — לעיתים מגדיל אותו; לכך יש רגולריזציה נפרדת.",
      "שגוי: רשת רחבה כן לומדת (קירוב אוניברסלי), פשוט לעיתים פחות יעיל לתכונות היררכיות.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "anatomy",
    label: "אנטומיה של נוירון — ארבעה שלבים",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          נוירון בודד הוא שרשרת של ארבע פעולות. שים לב: רק שלב 2 ו-3 (המשקלים וה-bias) הם מה
          שהרשת <strong>לומדת</strong>; שלב 4 (האקטיבציה) הוא בחירה קבועה של המהנדס. עבור על השלבים:
        </p>
        <StepDiagram steps={ANATOMY_STEPS} />
      </div>
    ),
  },
  {
    id: "visualizer",
    label: "ויזואלייזר רשת נוירונים — הרץ Forward Pass",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          שנה את ערכי הקלט ולחץ &quot;הרץ Forward Pass&quot; — צפה איך הערכים זורמים דרך הרשת ומשתנים
          בכל שכבה (המשקלים קבועים לצורך ההדגמה). זהו בדיוק אותו חישוב שקורה מיליארדי פעמים בכל
          קריאה ל-LLM:
        </p>
        <NeuralNetworkVisualizer layers={[3, 4, 2]} layerLabels={["קלט", "שכבה חבויה", "פלט"]} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "רע מול טוב: עם ובלי אקטיבציה",
    content: (
      <PromptComparisonLab
        title="אותה רשת עמוקה — עם אקטיבציה ובלעדיה"
        unitLabel="ארכיטקטורה"
        bad={{
          label: "רשת עמוקה ללא אקטיבציה (רק לינארית)",
          content:
            "layer1 = W1 · x + b1\nlayer2 = W2 · layer1 + b2\nlayer3 = W3 · layer2 + b3\noutput  = W4 · layer3 + b4\n// אין אף פונקציה לא-לינארית בין השכבות",
          outcome:
            "מתמטית הכול מצטמצם ל- output = W' · x + b' יחיד. 4 שכבות שקולות לנוירון בודד — לא ניתן ללמוד גבול החלטה מעוקל. העומק בזבוז מוחלט.",
        }}
        good={{
          label: "אותה רשת עם ReLU בין השכבות",
          content:
            "layer1 = ReLU(W1 · x + b1)\nlayer2 = ReLU(W2 · layer1 + b2)\nlayer3 = ReLU(W3 · layer2 + b3)\noutput  = W4 · layer3 + b4",
          outcome:
            "כל ReLU &apos;שובר&apos; את הלינאריות, כך שכל שכבה יכולה לעקם את מרחב ההחלטה. עכשיו העומק באמת בונה היררכיית תכונות — וזו רשת שיכולה ללמוד דפוסים מורכבים.",
        }}
        takeaway="אותם משקלים, אותו קלט — ההבדל היחיד הוא פונקציה קטנה בין השכבות. זו הסיבה שכל רשת עמוקה אמיתית (כולל Claude) בנויה מבלוקים לא-לינאריים."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="רשתות נוירונים נבחרו כי הן &apos;קירוב אוניברסלי&apos; — עם מספיק שכבות ונוירונים הן יכולות ללמוד כמעט כל פונקציה ישירות מנתונים, בלי שמתכנתים כותבים את הכללים ביד. זה מה שהופך אותן לפתרון-על לבעיות שאי אפשר לתאר בכללים מפורשים (ראייה, שפה)."
        alternatives="לבעיות פשוטות (כמו מסווג הספאם) רגרסיה לוגיסטית, עצי החלטה או k-NN מספיקים — מהירים, זולים וגם ניתנים-להסבר יותר. אקטיבציות עצמן הן בחירה: ReLU היא ברירת המחדל היום (זולה, לא סובלת מ-vanishing gradient), sigmoid/tanh משמשות בעיקר בפלט או ב-gates."
        whenNotTo="אם יש מעט נתונים, או שהבעיה פשוטה וניתנת לכללים ברורים — רשת עמוקה היא &apos;תותח נגד יתוש&apos;: יקרה לאמן, קשה להסביר, ולעיתים פחות מדויקת משיטה פשוטה. במקרים רגולטוריים שדורשים שקיפות מלאה, מודל &apos;קופסה שחורה&apos; עלול להיפסל."
        commonMistakes="בונים רשת גדולה מדי לבעיה קטנה (overfitting מיידי); שוכחים לנרמל קלטים (ערכים בטווחים שונים פוגעים באימון); בוחרים sigmoid בשכבות עמוקות ונתקעים ב-vanishing gradients; מבלבלים בין &apos;נוירון&apos; ל&apos;תא מוח&apos; ובונים על כך אינטואיציות שגויות."
        performance="גודל הרשת (מספר פרמטרים) קובע ישירות את זמן האימון והריצה ואת צריכת הזיכרון. רשתות ענקיות (LLMs, מיליארדי פרמטרים) דורשות GPU/TPU. ReLU נבחרת חלקית כי היא זולה מאוד לחשב לעומת exp() ב-sigmoid — במיליארדי הפעלות זה מצטבר."
        cost="כל פרמטר הוא זיכרון שצריך לטעון ולהריץ. מודל של 70B פרמטרים דורש עשרות GB VRAM רק כדי לרוץ (inference), לפני שדיברנו על אימון. זו הסיבה שרוב הפרויקטים קוראים ל-API של מודל קיים במקום להריץ בעצמם."
        security="רשת היא &apos;קופסה שחורה&apos; במידה רבה: קשה להוכיח מה בדיוק היא למדה, ולכן היא פגיעה לקלטי-קצה עוינים (adversarial inputs) — שינוי זעיר בקלט שמטעה אותה לחלוטין. במערכות רגישות מוסיפים בדיקות שפיות מסביב למודל."
        maintenance="נוירון בודד שקוף (כפל-חיבור-אקטיבציה), אבל רשת של מיליוני נוירונים כמעט בלתי ניתנת לפירוש ידני. תחזוקה נשענת על ניטור מטריקות ובדיקות רגרסיה על סט קבוע, לא על &apos;קריאת הקוד&apos;."
        realWorld="מודלי שפה גדולים כמו Claude הם רשתות נוירונים עצומות מסוג טרנספורמר — אותו נוירון בסיסי (כפל-חיבור-אקטיבציה), בקנה מידה של מיליארדים, מסודר בבלוקים חכמים. כשתבין את הנוירון הבודד, הבנת את אבן היסוד של כל LLM."
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
            <li>שוכחים אקטיבציה בין שכבות — הרשת &quot;לא לומדת&quot; ולא מבינים למה (היא לינארית).</li>
            <li>לא מנרמלים קלטים — פיצ&apos;ר בטווח 0–10000 &quot;מציף&quot; פיצ&apos;ר בטווח 0–1.</li>
            <li>רשת ענקית על 200 דוגמאות — משננת את האימון, נכשלת על נתונים חדשים.</li>
            <li>בוחרים ארכיטקטורה מורכבת כי &quot;deep learning&quot; מרשים, לפני שבדקו אם baseline פשוט מספיק.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>ReLU כברירת מחדל בין שכבות חבויות; sigmoid/softmax רק בפלט לפי הצורך.</li>
            <li>מנרמלים כל פיצ&apos;ר לטווח דומה לפני האימון — כלל ברזל.</li>
            <li>מתחילים מ-baseline פשוט (רגרסיה/עץ) ומעלים מורכבות רק כשמוכיחים צורך.</li>
            <li>מתאימים את גודל הרשת לכמות הנתונים, לא לאגו של המהנדס.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "exercise", label: "תרגיל מודרך: מימוש נוירון", content: <ExerciseValidator exercise={EXERCISE} /> },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "תרגיל אמיתי עם Claude Code",
    content: (
      <RealWorldTask
        id="neuron-network-build"
        title="בנה רשת זעירה מאפס — והוכח לעצמך שאקטיבציה קריטית"
        context="פתח את Claude Code בתיקייה ריקה. אין צורך בספריות כבדות — נעבוד ב-JS/Python טהור על רשת של יד."
        steps={[
          "בקש מ-Claude Code לממש נוירון בודד: פונקציה שמקבלת inputs, weights, bias ומחזירה את הסכימה המשוקללת + bias (בלי אקטיבציה עדיין).",
          "הוסף פונקציית אקטיבציה ReLU (max(0, x)) ופונקציית sigmoid, והפעל אותן על פלט הנוירון.",
          "בקש לבנות רשת קטנה של 2 שכבות (למשל 2→3→1) המחברת כמה נוירונים, והרץ forward pass על קלט לדוגמה.",
          "עכשיו ניסוי הדיבוג: בקש להריץ את אותה רשת פעם עם ReLU בין השכבות ופעם בלי (רק לינארי). על סט של כמה נקודות שאינן ניתנות-להפרדה לינארית (למשל בעיית XOR), בדוק איזו גרסה יכולה בכלל לייצג את הגבול הנכון.",
          "בקש מ-Claude Code להסביר בשורות ספורות למה הגרסה הלינארית נכשלת — ואמת שההסבר תואם את מה שראית: היא מצטמצמת לשכבה אחת.",
        ]}
        successCriteria={[
          "יש לך נוירון עובד + שתי אקטיבציות שאתה יכול להחליף ביניהן",
          "ראית בפועל שהגרסה הלינארית לא מצליחה לייצג את XOR והגרסה עם ReLU כן",
          "אתה יכול להסביר במילים שלך למה &apos;עומק בלי אי-לינאריות&apos; שקול לנוירון בודד",
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
          ["Neuron", "יחידת חישוב בסיסית: סכום משוקלל של קלטים + bias, עובר דרך אקטיבציה."],
          ["Weight", "מספר נלמד שקובע כמה חשוב כל קלט לנוירון."],
          ["Bias", "ערך קבוע נלמד שמזיז את סף ההפעלה ומוסיף גמישות."],
          ["Activation Function", "פונקציה לא-לינארית (ReLU/sigmoid) — מקור כושר הביטוי של הרשת."],
          ["ReLU", "max(0, x). האקטיבציה הנפוצה היום: זולה ולא סובלת מ-vanishing gradient."],
          ["Layer", "קבוצת נוירונים שפועלים במקביל על אותו קלט."],
          ["Deep Network", "רשת עם כמה שכבות חבויות — בונה היררכיית תכונות."],
          ["Forward Pass", "מעבר קדימה של הקלט דרך הרשת עד לפלט."],
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
          <Brain size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>נוירון = <strong>סכום משוקלל + bias + אקטיבציה</strong>. המשקלים וה-bias נלמדים מנתונים.</li>
          <li><strong>אי-לינאריות היא חובה</strong>: בלעדיה כל העומק קורס לשכבה לינארית אחת.</li>
          <li><strong>עומק בונה היררכיה</strong>: כל שכבה לומדת תכונות מורכבות יותר על גבי הקודמת.</li>
          <li>LLMs הם בדיוק אותו נוירון — בקנה מידה של מיליארדים. &apos;נוירון&apos; היא מטאפורה, לא תא מוח.</li>
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
          בוויזואלייזר למעלה, נסה להביא את שני ערכי הפלט לכמה שיותר קרובים זה לזה על ידי שינוי הקלטים
          בלבד. שים לב שאתה משנה רק את הקלט — לא את המשקלים. מה זה מלמד אותך על הרגישות של הרשת לקלט,
          ולמה אימון (שינוי המשקלים) הוא כלי חזק בהרבה משינוי הקלט?
        </p>
        <p className="mt-3 flex items-center gap-2 font-semibold">
          <Layers size={15} className="text-primary" /> מוביל לשיעור הבא:
        </p>
        <p className="mt-1 text-muted">
          יש לנו מבנה של רשת — אבל מאיפה מגיעים המשקלים ה&quot;נכונים&quot;? בשיעור הבא נלמד איך רשת
          <strong> לומדת</strong> אותם: Loss, Gradient Descent ו-Backpropagation.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
