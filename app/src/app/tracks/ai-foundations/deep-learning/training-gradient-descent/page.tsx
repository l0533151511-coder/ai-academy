"use client";

import { Gauge, Mountain, Database, LineChart, Repeat, AlertTriangle } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { GradientDescentVisualizer } from "@/components/diagrams/gradient-descent-visualizer";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { RealWorldTask } from "@/components/exercises/real-world-task";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "ai-foundations",
  moduleSlug: "deep-learning",
  lessonSlug: "training-gradient-descent",
  title: "איך רשת 'לומדת': Loss, Backpropagation, Gradient Descent",
  objectives: [
    "להבין מהי פונקציית loss ולמה מודל שואף למזער אותה",
    "להבין את הרעיון מאחורי gradient descent — צעד-צעד לכיוון מינימום",
    "להבין את ה-trade-off של learning rate, ואת ההבדל בין overfitting ל-underfitting וכיצד מזהים אותם",
    "להפנים את מציאות הפרודקשן: רוב הזמן הולך לנתונים, לא למודל",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["הנוירון המלאכותי ורשת מלאה"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה אימון פותר?",
    bullets: [
      "בשיעור הקודם היה לנו מבנה של רשת — אבל המשקלים היו אקראיים. רשת עם משקלים אקראיים סתם מנחשת.",
      "אימון הוא התהליך שמכוונן את מיליוני המשקלים כך שהרשת תיתן תשובות נכונות. השאלה: איך מכוונים מיליארד ידיות בלי לנסות את כולן?",
      "התשובה היא לולאה פשוטה להפליא: נחש, מדוד כמה טעית, תקן קצת בכיוון הנכון — וחזור.",
    ],
  },
  {
    title: "Loss — כמה &apos;טעינו&apos;",
    bullets: [
      "Loss (פונקציית שגיאה) מודדת כמה רחוקה תחזית המודל מהתשובה הנכונה — מספר אחד שאומר &apos;כמה רע&apos;.",
      "מטרת האימון פשוטה להגדרה: למצוא משקלים שממזערים את ה-loss הממוצע על דוגמאות האימון.",
      "ה&apos;קושי&apos; הוא שיש מיליארדי משקלים אפשריים — אי אפשר לנסות את כולם. צריך שיטה חכמה.",
    ],
  },
  {
    title: "Gradient Descent — לרדת במורד ההר",
    bullets: [
      "דמיין את ה-loss כנוף הררי: כל נקודה היא צירוף משקלים, והגובה הוא כמה טעינו. אנחנו רוצים את העמק.",
      "הגרדיאנט מצביע על כיוון העלייה התלולה ביותר — אז אנחנו צועדים בכיוון ההפוך, כמו כדור שמתגלגל במורד.",
      "Backpropagation הוא האלגוריתם היעיל שמחשב את הגרדיאנט הזה לכל משקל, שכבה אחורה משכבה.",
    ],
  },
  {
    title: "Learning Rate — גודל הצעד",
    bullets: [
      "Learning rate קטן מדי: האימון איטי מאוד, לוקח נצח להתכנס — ולעיתים נתקע במינימום מקומי.",
      "Learning rate גדול מדי: המודל &apos;קופץ&apos; מעבר לעמק ולפעמים מתבדר לגמרי במקום להתכנס.",
      "מציאת ה-learning rate הנכון היא אחת ההחלטות המעשיות החשובות ביותר באימון.",
    ],
  },
];

const LOOP_STEPS: DiagramStep[] = [
  {
    icon: Repeat,
    label: "1 · Forward — נחש",
    detail: "מעבירים batch של דוגמאות דרך הרשת ומקבלים תחזיות עם המשקלים הנוכחיים.",
  },
  {
    icon: LineChart,
    label: "2 · Loss — מדוד",
    detail: "משווים את התחזיות לתשובות האמת ומחשבים מספר אחד: כמה טעינו בממוצע.",
  },
  {
    icon: Mountain,
    label: "3 · Backprop — חשב כיוון",
    detail: "מפיצים את השגיאה אחורה כדי לחשב לכל משקל: לאיזה כיוון ובכמה הוא &apos;אשם&apos; בשגיאה.",
  },
  {
    icon: Gauge,
    label: "4 · Update — תקן צעד",
    detail: "מזיזים כל משקל צעד קטן (learning rate) נגד הגרדיאנט. חוזרים לשלב 1 — epoch אחרי epoch.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "learning rate גבוה מדי גורם לרוב ל...",
    options: [
      "אימון שתמיד נגמר מהר יותר ובהצלחה",
      "loss שקופץ למעלה-למטה או מתבדר לאינסוף במקום לרדת בהדרגה",
      "אין השפעה — זה רק פרמטר קוסמטי",
      "מודל שתמיד מדויק יותר",
    ],
    correctIndex: 1,
    explanation:
      "צעד גדול מדי גורם לכדור &apos;לדלג&apos; מעבר לעמק, לנחות על צלע גבוהה יותר, ולדלג שוב — ה-loss מתנודד או מתפוצץ (NaN). הסימן הקלאסי בפרודקשן: עקומת ה-loss קופצת במקום לרדת חלק. הפתרון הראשון שבודקים תמיד הוא להקטין את ה-learning rate.",
    optionNotes: [
      "שגוי: learning rate גבוה לרוב <em>מונע</em> הצלחה, לא מאיץ אותה.",
      "נכון: זהו הסימן הקלאסי לצעד גדול מדי — התבדרות או תנודתיות של ה-loss.",
      "שגוי: זהו אחד ההיפר-פרמטרים המשפיעים ביותר על הצלחת האימון.",
      "שגוי: צעד גדול פוגע בדיוק כי הוא מפספס את המינימום.",
    ],
  },
  {
    id: "q2",
    question: "מה תפקידו של Backpropagation?",
    options: [
      "לטעון נתונים לזיכרון ה-GPU",
      "לחשב ביעילות את הגרדיאנט לכל משקל ברשת, שכבה אחר שכבה מהפלט להתחלה",
      "להציג את תוצאות המודל למשתמש",
      "למחוק משקלים לא נחוצים כדי לחסוך זיכרון",
    ],
    correctIndex: 1,
    explanation:
      "Backpropagation הוא יישום חכם של כלל השרשרת (chain rule): הוא מפיץ את השגיאה אחורה דרך הרשת ומחשב לכל משקל כמה הוא &apos;אשם&apos; ב-loss. בלעדיו היינו צריכים לחשב גרדיאנט לכל משקל בנפרד — יקר בצורה בלתי-אפשרית למיליארדי פרמטרים.",
    optionNotes: [
      "שגוי: טעינת נתונים היא עניין של data loader, לא של backprop.",
      "נכון: זהו החישוב היעיל של הגרדיאנטים לכל המשקלים בבת אחת.",
      "שגוי: הצגת פלט אינה קשורה לחישוב הגרדיאנט.",
      "שגוי: גיזום משקלים (pruning) הוא תהליך נפרד ולא מטרת backprop.",
    ],
  },
  {
    id: "q3",
    question: "ה-loss על נתוני האימון ממשיך לרדת יפה, אבל ה-loss על נתוני הוולידציה מתחיל <em>לעלות</em>. מה זה?",
    options: [
      "underfitting — המודל פשוט מדי",
      "overfitting — המודל משנן את האימון במקום ללמוד דפוס כללי",
      "learning rate נמוך מדי",
      "זה תקין ואין מה לעשות",
    ],
    correctIndex: 1,
    explanation:
      "כשה-train loss יורד אבל ה-validation loss עולה, המודל התחיל לשנן פרטים ורעש של סט האימון במקום ללמוד את הדפוס הכללי. זו ההגדרה המדויקת של overfitting, וזו בדיוק הסיבה שמפרידים סט וולידציה: בלעדיו לא היינו יכולים לזהות את זה בכלל. הפתרונות: יותר נתונים, רגולריזציה, early stopping, או מודל קטן יותר.",
    optionNotes: [
      "שגוי: ב-underfitting <em>שני</em> ה-loss גבוהים — המודל לא לומד אפילו את האימון.",
      "נכון: פער שנפתח בין train ל-validation הוא החתימה הקלאסית של overfitting.",
      "שגוי: learning rate נמוך מאט את הכול, אבל לא גורם ל-validation לעלות בזמן ש-train יורד.",
      "שגוי: זהו סימן אזהרה ברור — צריך early stopping או רגולריזציה.",
    ],
  },
  {
    id: "q4",
    question: "בפרויקט ML אמיתי, לאן הולך רוב הזמן ההנדסי?",
    options: [
      "לבחירת ארכיטקטורת המודל הכי חדשנית",
      "לאיסוף, ניקוי, תיוג ואיזון של הנתונים",
      "לכוונון ה-learning rate בלבד",
      "לכתיבת לולאת ה-gradient descent מאפס",
    ],
    correctIndex: 1,
    explanation:
      "בפרקטיקה, הביטוי &apos;garbage in, garbage out&apos; שולט: המודל טוב כמו הנתונים שלו. לולאת האימון עצמה כבר כתובה בספריות (PyTorch/TensorFlow), וארכיטקטורות קיימות מוכנות. הזמן האמיתי — לרוב 70–80% — הולך לנתונים: איסוף, ניקוי, תיוג, טיפול באי-איזון ובדליפות (data leakage). זו האמת הלא-זוהרת של התחום.",
    optionNotes: [
      "שגוי: ארכיטקטורה חדשנית נותנת שיפור שולי לעומת נתונים טובים; זה לא צוואר הבקבוק.",
      "נכון: עבודת הנתונים היא נתח הארי של כל פרויקט ML רציני.",
      "שגוי: כוונון learning rate חשוב אך הוא חלק קטן מהמאמץ הכולל.",
      "שגוי: כמעט אף אחד לא כותב את הלולאה מאפס — הספריות עושות זאת.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "loop",
    label: "לולאת האימון — ארבעה שלבים שחוזרים",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          כל האימון, מרשת של יד ועד Claude, הוא אותה לולאה של ארבעה שלבים שרצה שוב ושוב. מעבר מלא על
          כל דוגמאות האימון נקרא <strong>epoch</strong>; כל צעד עובד על <strong>batch</strong> קטן
          כדי לחסוך זיכרון וזמן. עבור על הלולאה:
        </p>
        <StepDiagram steps={LOOP_STEPS} />
      </div>
    ),
  },
  {
    id: "visualizer",
    label: "ויזואלייזר: גרור את הכדור למינימום",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          זהו נוף ה-loss בממד אחד. הכדור הוא המצב הנוכחי של המשקלים; העמק הוא ה-loss המינימלי. שחק
          עם ה-learning rate וראה מתי הכדור מתכנס בעדינות, מתי הוא קופץ, ומתי הוא מתבדר:
        </p>
        <GradientDescentVisualizer />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "רע מול טוב: איך יודעים אם המודל באמת לומד",
    content: (
      <PromptComparisonLab
        title="ניטור אימון — לפי train loss בלבד מול train+validation"
        unitLabel="שיטת ניטור"
        bad={{
          label: "מסתכלים רק על train loss",
          content:
            "epoch 1  train_loss=0.62\nepoch 5  train_loss=0.21\nepoch 10 train_loss=0.04\nepoch 20 train_loss=0.006\n// &apos;מעולה, ה-loss יורד! המודל מוכן.&apos;",
          outcome:
            "המודל נראה מושלם באימון ואז נכשל על נתונים אמיתיים. שיננת רעש. בלי סט וולידציה אין דרך בכלל לדעת שקרה overfitting — עד שהמוצר בפרודקשן טועה.",
        }}
        good={{
          label: "עוקבים אחרי train מול validation",
          content:
            "epoch 5  train=0.21 val=0.24  ✓ שניהם יורדים\nepoch 10 train=0.04 val=0.11  ✓ עדיין בסדר\nepoch 15 train=0.01 val=0.15  ⚠ val מתחיל לעלות\n// עוצרים כאן (early stopping) — זו נקודת ה-overfitting",
          outcome:
            "הפער שנפתח בין train ל-validation חושף את ה-overfitting בזמן אמת. עוצרים ב-epoch 10, שומרים את המודל שמכליל הכי טוב — לא את זה ששינן הכי הרבה.",
        }}
        takeaway="&apos;ה-loss יורד&apos; זה לא &apos;המודל לומד&apos;. בלי סט וולידציה נפרד אתה עיוור ל-overfitting — וזו הטעות מספר 1 של מתחילים."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="Gradient Descent נבחר כי הוא היעיל ביותר שידוע לחיפוש משקלים טובים במרחב עצום — הוא לא מבטיח את הפתרון המושלם (מינימום גלובלי), אבל מגיע ל&apos;מספיק טוב&apos; בפרקטיקה, ובזכות backprop הוא עושה זאת ביעילות שמאפשרת בכלל לאמן מיליארדי פרמטרים."
        alternatives="קיימות וריאציות רבות: SGD, Adam, RMSprop — כולן על אותו רעיון עם קצב-למידה אדפטיבי (Adam הוא ברירת מחדל טובה ברוב המקרים). לבעיות קטנות אפילו grid search עובד. נגד overfitting: dropout, weight decay, augmentation ו-early stopping."
        whenNotTo="אם פונקציית ה-loss אינה גזירה (אי אפשר לחשב גרדיאנט), gradient descent לא רלוונטי — שם משתמשים בשיטות כמו אלגוריתמים גנטיים או חיפוש מבוסס-סימולציה. וכשיש מעט מאוד נתונים, אין טעם באימון עמוק בכלל — עדיף מודל פשוט או מודל מאומן-מראש."
        commonMistakes="learning rate קבוע לאורך כל האימון (עדיף להקטין בהדרגה — &apos;LR schedule&apos;); אי-נרמול נתונים; מדידה על train loss בלבד בלי validation; data leakage — כשמידע מסט הבדיקה זולג בטעות לאימון וגורם לתוצאות &apos;מושלמות&apos; מזויפות; אימון ארוך מדי עד overfitting."
        performance="אימון רשתות ענקיות (LLMs) יכול לקחת שבועות על אלפי GPUs — זו הסיבה שאימון מודל שפה מאפס עולה מיליוני דולרים. batch גדול יותר מנצל טוב יותר את ה-GPU אך דורש יותר זיכרון; זהו trade-off מתמיד בין throughput לזיכרון."
        cost="ברוב הפרויקטים המסחריים לא מאמנים LLM מאפס — קוראים ל-API של מודל קיים (כמו Claude), מה שהופך את כל נושא ה-gradient descent לרלוונטי בעיקר להבנה, לא לפעולה יומיומית. גם fine-tuning עולה כסף וזמן, ולכן שוקלים אותו רק כשהנחיה חכמה (prompting) לא הספיקה."
        security="הנתונים שאתה מאמן עליהם נטמעים במודל: נתונים רגישים או מוטים בסט האימון מייצרים מודל דולף או מפלה. data leakage גם מייצר מטריקות מנופחות שמתרסקות בפרודקשן. בדיקת הנתונים היא בדיקת אבטחה, לא רק בדיקת איכות."
        maintenance="מודל שאומן פעם אחת מתיישן ככל שהעולם משתנה (data drift). תחזוקה אמיתית = ניטור מתמשך של הביצועים בפרודקשן, איסוף דוגמאות כישלון, ואימון מחדש תקופתי — הרבה מעבר ל&apos;אימנו וסיימנו&apos;."
        realWorld="כשאתה קורא ל-Claude API כל האימון הזה כבר קרה מראש — אתה &apos;רק&apos; משתמש במודל המאומן. אבל הבנת התהליך מסבירה למה למודלים יש cutoff של ידע, למה fine-tuning עולה, ולמה &apos;פשוט תאמנו אותו על עוד נתונים&apos; זה משפט שמסתיר שבועות עבודה."
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
            <li>learning rate גבוה מדי — ה-loss מתפוצץ ל-NaN וכל האימון לאיבוד.</li>
            <li>אין סט וולידציה — overfitting מתגלה רק כשהמוצר טועה מול לקוחות.</li>
            <li>data leakage — נתוני בדיקה זולגים לאימון, מטריקות &quot;מושלמות&quot; שמתרסקות בפרודקשן.</li>
            <li>משקיעים שבועות בכוונון מודל על נתונים מלוכלכים — במקום לנקות את הנתונים קודם.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מתחילים מ-learning rate שמרני ומעלים בזהירות; משתמשים ב-LR schedule.</li>
            <li>מפצלים train/validation/test מההתחלה ועוקבים אחרי שניהם בכל epoch.</li>
            <li>מוודאים הפרדה מוחלטת בין הסטים — אפס דליפה — לפני שסומכים על מטריקה.</li>
            <li>משקיעים את רוב הזמן בנתונים: ניקוי, תיוג, איזון. המודל בא אחר כך.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "תרגיל אמיתי עם Claude Code",
    content: (
      <RealWorldTask
        id="training-gd-experiment"
        title="אמן מודל זעיר — וגרום לו ל-overfitting בכוונה כדי לזהות אותו"
        context="פתח את Claude Code בתיקייה ריקה. השתמש ב-Python עם scikit-learn או PyTorch — בקש מ-Claude Code להתקין ולהכין את השלד."
        steps={[
          "בקש מ-Claude Code להכין דאטהסט צעצוע קטן לסיווג בינארי, ולפצל אותו ל-train ול-validation.",
          "אמן מודל קטן (רשת עם שכבה חבויה אחת) ובקש להדפיס train_loss ו-validation_loss בכל epoch.",
          "צעד הדיבוג — גרום ל-overfitting בכוונה: הגדל מאוד את מספר ה-epochs וגם את גודל הרשת על מעט דוגמאות, והרץ עד שה-validation loss מתחיל לעלות בזמן שה-train loss ממשיך לרדת. זהה את ה-epoch שבו הפער נפתח.",
          "עכשיו נסה learning rate = 1.0 והרץ שוב — צפה איך ה-loss מתנודד או מתפוצץ ל-NaN. הקטן ל-0.01 והשווה.",
          "הוסף early stopping (עצירה כשה-validation לא משתפר N epochs) ובקש מ-Claude Code להסביר איזה מודל נשמר — ולמה הוא עדיף על זה מה-epoch האחרון.",
        ]}
        successCriteria={[
          "יש לך גרף/טבלה שמראה בבירור את הנקודה שבה train ו-validation מתפצלים (overfitting)",
          "ראית בעיניים את ההשפעה של learning rate: התבדרות ב-1.0 מול התכנסות ב-0.01",
          "early stopping עובד ואתה יכול להסביר למה הוא שומר את המודל שמכליל הכי טוב, לא את המשונן ביותר",
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
          ["Loss Function", "פונקציה שמודדת כמה תחזיות המודל רחוקות מהאמת — מספר אחד שממזערים."],
          ["Gradient", "כיוון העלייה התלולה ביותר של פונקציה — &apos;שיפוע&apos;. יורדים בכיוון ההפוך."],
          ["Gradient Descent", "אלגוריתם שמעדכן משקלים נגד כיוון הגרדיאנט כדי למזער loss."],
          ["Learning Rate", "גודל הצעד בכל עדכון משקלים — ההיפר-פרמטר המשפיע ביותר."],
          ["Backpropagation", "יישום יעיל של כלל השרשרת לחישוב גרדיאנטים בכל שכבות הרשת."],
          ["Epoch", "מעבר מלא אחד על כל דוגמאות האימון."],
          ["Batch", "תת-קבוצה של דוגמאות שמעבדים יחד בצעד אימון בודד."],
          ["Overfitting", "המודל משנן את האימון במקום ללמוד דפוס — train יורד, validation עולה."],
          ["Underfitting", "המודל פשוט מדי ולא לומד אפילו את האימון — שני ה-loss גבוהים."],
          ["Validation Set", "נתונים שלא ראה באימון — הכלי לזיהוי overfitting."],
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
          <AlertTriangle size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>Loss</strong> הוא מה שממזערים; <strong>Gradient Descent</strong> יורד במורדו צעד-צעד.</li>
          <li><strong>Learning rate</strong> הוא trade-off: גדול מדי מתבדר, קטן מדי איטי.</li>
          <li><strong>Overfitting</strong> = train יורד, validation עולה. בלי סט וולידציה אתה עיוור לזה.</li>
          <li>בפרודקשן: <strong>רוב הזמן הולך לנתונים</strong>, לא למודל. garbage in, garbage out.</li>
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
          בוויזואלייזר, נסה learning rate = 1.0 ולחץ &quot;צעד גרדיאנט&quot; כמה פעמים — מה קורה
          לכדור? עכשיו נסה 0.05: כמה צעדים לוקח להגיע קרוב למינימום? נסה גם למקם את הכדור על &quot;צלע&quot;
          אחרת והתבונן אם הוא מתכנס לאותו עמק — זו האינטואיציה למינימום מקומי מול גלובלי.
        </p>
        <p className="mt-3 flex items-center gap-2 font-semibold">
          <Database size={15} className="text-primary" /> מוביל לשיעור הבא:
        </p>
        <p className="mt-1 text-muted">
          עכשיו כשאתה מבין נוירון, רשת ואיך היא לומדת — בפרויקט המודול תבנה מסווג עובד ותקבל את
          ההחלטה ההנדסית האמיתית: האם הבעיה הזו בכלל צריכה רשת עמוקה?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
