"use client";

import { Target, Repeat, ClipboardCheck, Scale, AlertTriangle, GitCompare } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "fine-tuning",
  lessonSlug: "evaluating-fine-tuned-models",
  title: "הערכת מודלים מותאמים",
  objectives: [
    "להכיר מדדי הערכה בסיסיים (accuracy, human eval, A/B testing מול המודל הבסיסי)",
    "להבין את הסיכון של overfitting על סט הדוגמאות שאומן עליו, ואת catastrophic forgetting",
    "לזהות מתי מודל מותאם 'משתפר' רק על הנייר אך לא בפועל",
    "לבנות baseline הוגן — מודל בסיסי + prompt טוב — כלפיו כל שיפור נמדד",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["fine-tuning-vs-rag-vs-prompting"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: 'זה מרגיש טוב יותר' זו לא הערכה",
    bullets: [
      "אחרי שהשקעת שעות באיסוף דוגמאות ובאימון, יש הטיה טבעית לרצות שהמודל 'יעבוד'. זו בדיוק הנקודה שבה מהנדסים מטעים את עצמם.",
      "הערכה אמינה קיימת כדי לענות על שאלה כלכלית חדה: האם המודל המותאם מצדיק את העלות והתחזוקה שלו — מול החלופה הזולה שכבר יש לך (מודל בסיסי + prompt טוב)?",
      "בלי מתודולוגיה, קל 'להוכיח' שה-fine-tuning הצליח — ואז לגלות בפרודקשן שהוא לא באמת עדיף.",
    ],
  },
  {
    title: "איך יודעים שה-fine-tuning 'עבד'",
    bullets: [
      "מדד ראשון: ביצועים על סט בדיקה (held-out test set) שהמודל לא ראה באימון — לא על אותן דוגמאות שהוא אומן עליהן (זה יראה תמיד 'מצוין' באופן מטעה).",
      "מדד שני: A/B testing מול baseline — המודל הבסיסי עם prompt engineering טוב. האם המודל המותאם באמת טוב יותר, או שרק 'מרגיש' שונה?",
      "מדד שלישי: human eval — בני אדם מדרגים תשובות בצורה עיוורת (בלי לדעת איזה מודל ענה) כדי למנוע הטיה.",
    ],
  },
  {
    title: "שתי הסכנות: Overfitting ו-Catastrophic Forgetting",
    bullets: [
      "Overfitting: המודל משנן את דוגמאות האימון במקום ללמוד דפוס כללי — מצוין עליהן, גרוע על מקרים חדשים. סט בדיקה נפרד הוא מה שחושף את זה.",
      "Catastrophic Forgetting: תוך כדי ההתמחות במשימה הצרה, המודל 'שוכח' יכולת כללית שהייתה לו (למשל פתאום גרוע בעברית כללית). לכן בודקים גם משימות שמחוץ להתמחות.",
      "שתי הסכנות בלתי-נראות אם בודקים רק את מה שאימנת עליו — צריך למדוד רחב.",
    ],
  },
];

const EVAL_STEPS: DiagramStep[] = [
  {
    icon: Target,
    label: "1. הגדר baseline",
    detail: "המודל הבסיסי + system prompt הכי טוב שאתה יכול לנסח. זו נקודת הייחוס ההוגנת — לא 'מודל בסיסי ערום'. כל שיפור נמדד מולו.",
  },
  {
    icon: ClipboardCheck,
    label: "2. הפרד סט בדיקה",
    detail: "דוגמאות שהמודל מעולם לא ראה באימון (held-out). כאן, ורק כאן, נחשפת הכללה אמיתית מול שינון (overfitting).",
  },
  {
    icon: GitCompare,
    label: "3. השווה עיוור (A/B)",
    detail: "מדרג אנושי רואה תשובות בלי לדעת מי ענה. מסיר את ההטיה 'אני רוצה שהמודל שלי ינצח'.",
  },
  {
    icon: AlertTriangle,
    label: "4. בדוק רגרסיה",
    detail: "הרץ גם משימות מחוץ להתמחות. אם ירדו — יש catastrophic forgetting, גם אם המשימה הצרה השתפרה.",
  },
  {
    icon: Scale,
    label: "5. הכרע כלכלית",
    detail: "שיפור מובהק מספיק כדי להצדיק עלות אימון + תחזוקה (re-tune על drift)? אם לא — הישאר עם ה-baseline.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה חובה לבדוק מודל מותאם על סט בדיקה נפרד (held-out), לא רק על דוגמאות האימון?",
    options: [
      "אין צורך אמיתי בזה, בדיקה על דוגמאות האימון מספיקה",
      "כי מודל שרק 'משנן' דוגמאות אימון (overfitting) יראה ביצועים מצוינים עליהן אך יתפקד גרוע על מקרים חדשים — סט בדיקה נפרד חושף את זה",
      "כי Claude API דורש סט בדיקה נפרד",
      "רק כדי לחסוך זמן חישוב",
    ],
    correctIndex: 1,
    explanation:
      "בדיקה רק על דוגמאות האימון לא יכולה לחשוף overfitting — המודל 'ראה' אותן כבר; רק דוגמאות חדשות (סט בדיקה) בודקות הכללה אמיתית. זה עיקרון מתודולוגי, לא דרישה טכנית של ספק כלשהו.",
    optionNotes: [
      "לא נכון: זה בדיוק המלכודת — בדיקה על דוגמאות אימון בלבד מסתירה overfitting במקום לחשוף אותו.",
      "התשובה הנכונה: overfitting נראה 'מצוין' על סט האימון אבל נכשל על מקרים חדשים — רק סט בדיקה נפרד חושף את הפער.",
      "לא נכון: זו לא דרישה טכנית של API כלשהו — זה עיקרון מתודולוגי בהערכת מודלים.",
      "לא נכון: המטרה היא נכונות ההערכה, לא חיסכון בזמן חישוב.",
    ],
  },
  {
    id: "q2",
    question: "בבדיקת מודל מותאם, מה ההשוואה ה-baseline ההוגנת ביותר?",
    options: [
      "המודל המותאם מול עצמו בהרצה שנייה",
      "המודל המותאם מול המודל הבסיסי 'ערום', בלי שום prompt engineering",
      "המודל המותאם מול המודל הבסיסי + system prompt הכי טוב שאפשר לנסח",
      "המודל המותאם מול מודל של ספק מתחרה",
    ],
    correctIndex: 2,
    explanation:
      "החלופה הריאלית ל-fine-tuning היא לא 'שום דבר' — היא המודל הבסיסי עם prompt טוב, שכבר יש לך בחינם. אם משווים מול מודל ערום, כמעט תמיד 'מוכיחים' שה-fine-tuning עזר, גם כשprompt טוב היה משיג את אותו הדבר בזול.",
    optionNotes: [
      "לא נכון: השוואה של מודל מול עצמו לא מודדת שיפור, רק שונות בין הרצות.",
      "לא נכון: מודל בסיסי 'ערום' הוא baseline חלש מדי — הוא מנפח את השיפור המדומה של ה-fine-tuning.",
      "התשובה הנכונה: זו החלופה הזולה האמיתית; רק אם ה-fine-tuning מנצח אותה, הוא מצדיק את עצמו.",
      "לא נכון: מודל מתחרה זו שאלה אחרת (בחירת ספק), לא הערכת התרומה של ה-fine-tuning שלך.",
    ],
  },
  {
    id: "q3",
    question: "מודל שאימנת לסיווג פניות תמיכה משתפר יפה במשימה — אבל פתאום עונה גרוע יותר על שאלות עברית כלליות. מה קרה?",
    options: [
      "Overfitting לסט הבדיקה",
      "Catastrophic forgetting — ההתמחות הצרה שחקה יכולת כללית שהייתה למודל",
      "המודל הבסיסי היה מקולקל מלכתחילה",
      "זה נורמלי ולא צריך למדוד את זה",
    ],
    correctIndex: 1,
    explanation:
      "כשמאמנים אגרסיבית על משימה צרה, המשקלים מוסטים לטובתה ויכולות כלליות עלולות להישחק — זהו catastrophic forgetting. לכן ההערכה חייבת לכלול גם משימות מחוץ להתמחות, לא רק את מה שאימנת עליו.",
    optionNotes: [
      "לא נכון: overfitting היה מתבטא בכישלון על מקרים חדשים *באותה משימה*, לא בשחיקת יכולת כללית אחרת.",
      "התשובה הנכונה: התמחות צרה שחקה יכולת כללית — זו הסיבה שבודקים גם מטלות רגרסיה מחוץ להתמחות.",
      "לא נכון: אם המודל הבסיסי ענה טוב על עברית כללית לפני האימון, הבעיה נוצרה באימון, לא לפניו.",
      "לא נכון: זו רגרסיה אמיתית שיכולה לשבור פרודקשן — חייבים למדוד אותה.",
    ],
  },
  {
    id: "q4",
    question: "המודל המותאם עדיף על ה-baseline ב-1.5% ב-accuracy. מה השיקול ההנדסי הנכון?",
    options: [
      "כל שיפור מצדיק לפרוס — תמיד לוקחים את המדויק יותר",
      "לשקול אם 1.5% מצדיק את עלות האימון והתחזוקה המתמשכת (re-tune על drift) — ולעיתים להישאר עם ה-baseline הזול",
      "לפרוס מיד, כי fine-tuning תמיד שווה את זה",
      "להתעלם מהמספר ולהחליט לפי תחושה",
    ],
    correctIndex: 1,
    explanation:
      "fine-tuning נושא עלות מתמשכת: הכנת דאטה, אימון, ותחזוקה — כשההתפלגות בפרודקשן נודדת (drift) צריך לאמן מחדש. שיפור זעום לרוב לא מצדיק את זה; החלטת ההנדסה היא כלכלית, לא 'המספר הגדול ביותר מנצח'.",
    optionNotes: [
      "לא נכון: שיפור זעום עם עלות תחזוקה גבוהה יכול להיות עסקה גרועה נטו.",
      "התשובה הנכונה: מודדים תועלת מול עלות-חיים-שלמה, כולל re-tune על drift.",
      "לא נכון: 'תמיד שווה' זו לא חשיבה הנדסית — הכול תלוי בגודל השיפור מול העלות.",
      "לא נכון: יש לך מספר — ההחלטה צריכה להתבסס עליו מול העלות, לא על תחושה.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: איך יודעים שfine-tuning עבד", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "מתודולוגיית הערכה — חמישה צעדים",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          הערכה אמינה היא תהליך, לא הרצה בודדת. עבור על החמישה — הפרה של כל אחד מהם היא דרך קלאסית
          ”להוכיח” שיפור מדומה:
        </p>
        <StepDiagram steps={EVAL_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: הערכה שטחית מול הערכה אמינה",
    content: (
      <PromptComparisonLab
        title="בדיקת איכות מודל מותאם"
        unitLabel="שיטת הערכה"
        bad={{
          label: "הערכה שטחית",
          content: `"תבדוק את המודל המותאם על 5 דוגמאות מהאימון
ותגיד לי אם הוא טוב"`,
          outcome:
            "המודל 'ראה' את הדוגמאות האלו כבר — הוא כמעט תמיד יראה מצוין עליהן, גם אם הוא לא באמת השתפר על מקרים חדשים (overfitting מוסתר).",
        }}
        good={{
          label: "A/B testing עיוור על סט בדיקה נפרד",
          content: `בדיקה על 50 שאלות חדשות (לא מהאימון), בהשוואה
עיוורת (בלי לדעת איזה מודל ענה) מול המודל הבסיסי
עם system prompt טוב`,
          outcome:
            "תוצאה אמינה שמראה האם המודל המותאם באמת עדיף על החלופה הזולה יותר (פרומפט טוב), לא רק 'מרגיש' שונה.",
        }}
        takeaway="הערכה אמינה דורשת משמעת: סט בדיקה שלא נראה באימון, השוואה עיוורת, ומול חלופה ריאלית (לא רק מול 'שום דבר') — אחרת קל להטעות את עצמך."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הערכה קפדנית קיימת כי 'זה נראה טוב' על כמה דוגמאות לא מוכיח כלום — בדיוק כמו טסטים (מודול Claude Code Mastery), רק שכאן בודקים את המודל עצמו, לא את הקוד."
        alternatives="להסתפק ב'תחושת בטן' על איכות המודל — מהיר, אבל לא אמין ועלול להוביל להחלטה יקרה שגויה (לפרוס מודל שלא באמת טוב יותר). חלופה מדודה: מדד אוטומטי (accuracy/F1) על סט בדיקה + human eval עיוור על מדגם."
        whenNotTo="כשעוד אין לך baseline מוגדר (מודל בסיסי + prompt טוב) — אין טעם למדוד מול אוויר. וגם: כשסט הבדיקה קטן מכדי להיות מייצג — מספר יפה על 5 דוגמאות הוא רעש, לא ראיה."
        commonMistakes="להשוות מודל מותאם רק מול 'שום דבר' (המודל הבסיסי בלי שום עזרה) במקום מול החלופה הריאלית (בסיסי + system prompt טוב); לבדוק רק על סט האימון; לדלג על בדיקת רגרסיה ולפספס catastrophic forgetting; למדוד ידע 'טרי' שהמודל בכלל לא אומן עליו (זו עבודה של RAG, לא של fine-tuning)."
        performance="מדד אוטומטי (accuracy/F1) על סט בדיקה גדול זול ומהיר להריץ שוב-ושוב; human eval יקר ואיטי — לכן מריצים אותו על מדגם מייצג, לא על הכול. השילוב: אוטומטי לרוחב, אנושי לעומק."
        cost="הערכה קפדנית עולה זמן (איסוף סט בדיקה, human eval) — אבל חוסכת עלות גדולה בהרבה של לפרוס מודל מותאם שלמעשה לא משתפר על החלופה הזולה, ואז לשלם עליו תחזוקה לנצח."
        maintenance="מודל בפרודקשן נמדד לא פעם אחת אלא ברציפות: ההתפלגות נודדת (drift), ומדד שהיה טוב בהשקה יורד עם הזמן. שומרים את סט הבדיקה כ'רגרסיה' ומריצים אותו על כל גרסה חדשה — בדיוק כמו CI לקוד."
        realWorld="בדיוק כמו שכל תכונה ב-AtlasDesk אומתה ב-production (לא רק ב-build), מודל מותאם חייב אימות אמין לפני שסומכים עליו במוצר אמיתי. הרבה צוותים מדלגים על זה, פורסים על סמך תחושה, ומגלים את הרגרסיה מהמשתמשים."
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
            <li>מודדים על סט האימון בלבד — overfitting נשאר בלתי-נראה עד הפרודקשן.</li>
            <li>משווים מול מודל בסיסי ”ערום” במקום מול baseline הוגן — כל fine-tuning ”מנצח”.</li>
            <li>לא בודקים משימות מחוץ להתמחות — catastrophic forgetting מתגלה מתלונות משתמשים.</li>
            <li>human eval לא-עיוור — המדרג יודע מי המודל ”שלו” ומטה את הדירוג.</li>
            <li>מודדים פעם אחת בהשקה ולא שוב — drift שוחק את הביצועים בשקט.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>סט בדיקה held-out נפרד לחלוטין, מוקפא לפני האימון.</li>
            <li>baseline = מודל בסיסי + prompt הכי טוב; שיפור נמדד רק מולו.</li>
            <li>סוללת רגרסיה שכוללת גם מטלות כלליות, לזיהוי forgetting.</li>
            <li>human eval עיוור על מדגם מייצג, בנוסף למדד אוטומטי לרוחב.</li>
            <li>מריצים את סוללת ההערכה על כל גרסה — כמו CI — ומתריעים על ירידה.</li>
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
        id="fine-tuning-evaluating-fine-tuned-models"
        title="תכנן מתודולוגיית הערכה למודל מותאם היפותטי"
        context="עבוד עם Claude Code — תכנון בלבד, בלי אימון בפועל."
        steps={[
          "דמיין שיש לך מודל מותאם לסיווג פניות תמיכה ב-AtlasDesk. הגדר את ה-baseline ההוגן שכלפיו תמדוד (מודל בסיסי + איזה system prompt?).",
          "תכנן את סט הבדיקה: כמה דוגמאות נפרדות (לא מהאימון) תרצה כדי שהתוצאה תהיה מייצגת ולא רעש?",
          "תכנן A/B test עיוור: איך היית מסתיר מהמדרג האנושי איזה מודל ענה, כדי למנוע הטיה?",
          "בקש מ-Claude Code לנסח סוללת רגרסיה קצרה של מטלות כלליות (מחוץ להתמחות) לזיהוי catastrophic forgetting.",
          "כתוב את כלל ההכרעה מראש: איזה פער מינימלי בביצועים יצדיק את עלות האימון והתחזוקה — ומתי תישאר עם ה-baseline.",
        ]}
        successCriteria={[
          "יש לך baseline מוגדר במפורש, לא 'המודל הבסיסי הערום'",
          "יש לך תוכנית הערכה קונקרטית עם סט בדיקה מייצג והשוואה עיוורת",
          "אתה יכול לזהות סימני overfitting ו-catastrophic forgetting",
          "כלל ההכרעה נכתב מראש (פער מינימלי מול עלות) — לא 'נראה בסוף'",
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
          ["Held-out test set", "סט דוגמאות שהופרד לפני האימון והמודל מעולם לא ראה — היחיד שבודק הכללה אמיתית."],
          ["Baseline", "נקודת הייחוס ההוגנת: מודל בסיסי + prompt טוב. כל שיפור נמדד מולה, לא מול 'כלום'."],
          ["Overfitting", "המודל משנן דוגמאות אימון במקום להכליל — מצוין עליהן, גרוע על מקרים חדשים."],
          ["Catastrophic Forgetting", "התמחות צרה שוחקת יכולת כללית קודמת של המודל."],
          ["A/B testing עיוור", "השוואת שני מודלים כשהמדרג לא יודע מי ענה — מסיר הטיה."],
          ["Human eval", "דירוג תשובות בידי בני אדם, בנוסף למדד אוטומטי — לעומק שקשה לכמת."],
          ["Drift", "נדידת התפלגות הקלט בפרודקשן עם הזמן — שוחקת ביצועים ומחייבת re-tune."],
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
          <Repeat size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>מדוד תמיד על <strong>סט בדיקה נפרד</strong> — סט האימון תמיד ”נראה מצוין” ומסתיר overfitting.</li>
          <li>ה-<strong>baseline ההוגן</strong> הוא מודל בסיסי + prompt טוב, לא מודל ערום.</li>
          <li>בדוק גם <strong>מחוץ להתמחות</strong> — כדי לתפוס catastrophic forgetting.</li>
          <li>ההכרעה <strong>כלכלית</strong>: שיפור זעום עם תחזוקה יקרה יכול להיות עסקה גרועה.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "homework",
    label: "סיכום מודול",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">סיימת את מודול Fine-tuning — וכל טראק ai-integration!</p>
        <p className="mt-1 text-muted">
          עברת דרך MCP, Embeddings, RAG, ו-Fine-tuning — וראית ש-AtlasDesk הגיע רחוק בלי fine-tuning
          אחד. זה בעצמו לקח הנדסי חשוב: תמיד לנסות את הפתרון הזול והמהיר קודם, ולמדוד בקפדנות לפני
          שמשלמים על מורכבות.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
