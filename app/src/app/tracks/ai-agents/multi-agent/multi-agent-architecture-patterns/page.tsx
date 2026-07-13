"use client";

import { Network, ArrowRightLeft, GitBranch, UserCog, Boxes, Combine, Layers } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-agents",
  moduleSlug: "multi-agent",
  lessonSlug: "multi-agent-architecture-patterns",
  title: "תבניות ארכיטקטורה רב-סוכניות",
  objectives: [
    "להכיר שלוש תבניות יסוד: orchestrator-worker, sequential (pipeline), parallel — ומתי כל אחת מתאימה",
    "להבין מתי סוכן בודד לא מספיק, ומתי ריבוי סוכנים הוא over-engineering",
    "לזהות את העלות האמיתית של ריבוי סוכנים: תיאום, latency, משטח כשל רחב יותר, דיבוג קשה",
    "לפרק תבנית orchestrator→workers לשלביה, ולהבין למה ה-orchestrator חייב להישאר קל",
  ],
  estMinutes: 35,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: AtlasDesk מקבל סוכן עם החלטה אוטונומית"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה ריבוי-סוכנים פותר",
    bullets: [
      "הסוכן שבנית ב-AtlasDesk מומחה בדבר אחד: תמיכה כללית + בדיקת סטטוס פנייה. מגיעה שאלה שדורשת מומחיות עמוקה בתחום אחר (חיוב מורכב) שה-system prompt הכללי לא מכסה טוב — הוא מתחיל לנחש.",
      "פתרון א' (סוכן בודד): system prompt ענק שמכיל הכל. פתרון ב' (רב-סוכני): כמה 'מומחים' נפרדים, כל אחד עם system prompt ממוקד, שמתאמים ביניהם.",
      "התובנה: ריבוי סוכנים הוא הפרדת אחריות (separation of concerns) — כל סוכן פרומפט קצר וממוקד. אבל ההפרדה הזו לא חינם.",
    ],
  },
  {
    title: "למה בכלל לפצל: היתרונות",
    bullets: [
      "Separation of concerns: כל סוכן עושה דבר אחד היטב עם prompt ממוקד — קל יותר לכתוב, לבדוק ולתחזק מ-system prompt ענק אחד.",
      "פרומפטים ממוקדים = פחות בלבול: המודל לא 'נשאב' לידע לא-רלוונטי כשהשאלה פשוטה.",
      "פרלליזם: כשמשימות באמת בלתי-תלויות (אבטחה + ביצועים + עלות), אפשר להריץ אותן במקביל ולקצר latency כולל.",
    ],
  },
  {
    title: "המחיר האמיתי: coordination overhead",
    bullets: [
      "כל handoff הוא קריאת API נוספת — latency מצטבר + עלות. פרלליזם עוזר רק כשהמשימות באמת בלתי-תלויות.",
      "יותר סוכנים = משטח כשל רחב יותר: כל סוכן יכול להיכשל, וגם ההעברות ביניהם. ודיבוג של 'למה התשובה יצאה מוזרה' קשה בהרבה כשעברו דרך 3 מוחות.",
      "לכן ההמלצה ההנדסית: ברירת מחדל היא סוכן בודד. עבור לרב-סוכני רק כשסוכן בודד נכשל בבירור — ידע מתנגש, prompt נפוח, או פלט לא-עקבי בתחום מסוים.",
    ],
  },
  {
    title: "שלוש תבניות יסוד",
    bullets: [
      "Orchestrator-worker: סוכן 'מנהל' מחליט דינמית איזה מומחה מתאים, מפנה אליו, ומרכיב את התוצאות.",
      "Sequential (pipeline): סוכן א' מסיים לגמרי → מעביר לסוכן ב' → וכן הלאה. סדר קבוע מראש.",
      "Parallel + debate: כמה סוכנים עובדים בו-זמנית על היבטים שונים (או מתדיינים על אותה שאלה), והתוצאות משולבות/מוכרעות בסוף.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: Network, label: "Orchestrator-Worker", detail: "סוכן מנהל מחליט דינמית איזה מומחה מתאים ומפנה אליו — בדיוק כמו נציג תמיכה שמעביר שיחה למחלקה הנכונה." },
  { icon: GitBranch, label: "Sequential", detail: "סוכן א' (מסכם בעיה) → סוכן ב' (מנסח פתרון) → סוכן ג' (מנסח תשובה ללקוח) — צינור עם שלבים ברורים וסדר קבוע." },
  { icon: ArrowRightLeft, label: "Parallel / Debate", detail: "כמה סוכנים בודקים בו-זמנית היבטים שונים (אבטחה + ביצועים + עלות) או מתדיינים על אותה שאלה, ומאחדים/מכריעים בסוף." },
];

const ORCHESTRATOR_STEPS: DiagramStep[] = [
  { icon: UserCog, label: "1. Orchestrator מקבל בקשה", detail: "הסוכן המנהל קורא את הפנייה ומחליט לאיזה סוג מומחה היא שייכת. הוא לא עונה בעצמו על השאלה המורכבת — רק מנתב." },
  { icon: Boxes, label: "2. ניתוב ל-worker מתאים", detail: "מפנה למומחה הרלוונטי (billing / security / technical), כל אחד עם system prompt ממוקד. אפשר לנתב לכמה workers במקביל אם המשימות בלתי-תלויות." },
  { icon: Network, label: "3. Workers מבצעים", detail: "כל worker מתמחה בתחומו ומחזיר תוצאה חלקית. ה-workers לא מדברים זה עם זה — הם מחזירים ל-orchestrator." },
  { icon: Combine, label: "4. Orchestrator מרכיב תשובה", detail: "המנהל אוסף את התוצאות, מאחד לתשובה אחת קוהרנטית ללקוח. כאן גם מקום לבדיקת עקביות/קונפליקטים בין workers." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין תבנית orchestrator-worker לתבנית sequential?",
    options: [
      "אין הבדל, שני השמות מתארים את אותו דבר",
      "ב-orchestrator-worker סוכן מנהל בוחר דינמית איזה מומחה מתאים ומפנה אליו; ב-sequential הסוכנים עובדים בסדר קבוע אחד אחרי השני, כמו צינור",
      "sequential תמיד מהיר יותר מ-orchestrator-worker",
      "orchestrator-worker עובד רק עם 2 סוכנים בדיוק",
    ],
    correctIndex: 1,
    explanation:
      "orchestrator-worker כולל החלטה דינמית (איזה מומחה מתאים כרגע, לפי תוכן הפנייה); sequential הוא זרימה קבועה מראש בין שלבים, ללא החלטת ניתוב.",
    optionNotes: [
      "שגוי: יש הבדל מהותי — החלטה דינמית (orchestrator) מול זרימה קבועה מראש (sequential).",
      "נכון: זו בדיוק ההבחנה — orchestrator בוחר דינמית לפי הפנייה, sequential עובר בסדר קבוע תמיד.",
      "שגוי: sequential לא בהכרח מהיר יותר — זה תלוי במשימה, לא בתבנית. לעתים orchestrator שמנתב ישירות למומחה הנכון מהיר יותר מצינור ארוך.",
      "שגוי: orchestrator-worker יכול לעבוד עם כל מספר של workers — אחד, שניים, או עשרות.",
    ],
  },
  {
    id: "q2",
    question: "מה העלות הנוספת (trade-off) של מערכת רב-סוכנית לעומת סוכן בודד?",
    options: [
      "אין עלות נוספת, רב-סוכנים תמיד עדיף",
      "תיאום בין סוכנים מוסיף latency (כל 'העברה' היא קריאת API נוספת), מרחיב את משטח הכשל ומקשה על דיבוג — לא כדאי אלא אם המומחיות הנפרדת שווה את זה",
      "רב-סוכנים תמיד זול יותר כי כל סוכן קטן יותר",
      "העלות היחידה היא זמן פיתוח, אין השפעה בזמן ריצה",
    ],
    correctIndex: 1,
    explanation:
      "כל מעבר בין סוכנים הוא קריאת API נוספת (זמן+עלות), כל סוכן הוא נקודת כשל נוספת, ודיבוג פלט שעבר דרך כמה מוחות קשה יותר — משתלם רק כשהמומחיות הנפרדת מצדיקה את זה.",
    optionNotes: [
      "שגוי: יש עלות אמיתית — רב-סוכנים לא תמיד עדיף; זה תלוי אם המשימה באמת דורשת התמחויות נפרדות.",
      "נכון: זו בדיוק הפשרה — יותר קריאות API, יותר latency, משטח כשל רחב יותר, ודיבוג קשה יותר.",
      "שגוי: לעתים סוכן אחד עם system prompt טוב זול יותר מכמה סוכנים בגלל ה-overhead של התיאום.",
      "שגוי: יש השפעה ממשית בזמן ריצה (latency, עלות קריאות, משטח כשל), לא רק בזמן פיתוח.",
    ],
  },
  {
    id: "q3",
    question: "בתבנית orchestrator-worker, למה חשוב שה-orchestrator יישאר 'קל' (system prompt קצר, ללא כל ידע התחומים)?",
    options: [
      "זה לא משנה — עדיף שה-orchestrator יידע הכל ליתר ביטחון",
      "כי ה-orchestrator רץ על כל פנייה ותפקידו רק לנתב; אם נעמיס עליו את כל ידע התחומים, ביטלנו את יתרון ההפרדה — חזרנו ל-system prompt ענק, רק עם קריאות API נוספות",
      "כי ה-orchestrator לא נספר כטוקנים",
      "כי workers לא יכולים לעבוד עם orchestrator כבד",
    ],
    correctIndex: 1,
    explanation:
      "כל הרעיון בהפרדה הוא שכל סוכן קצר וממוקד. אם ה-orchestrator בעצמו מכיל את כל ידע התחומים, שילמת את מחיר הריבוי (קריאות API נוספות) בלי לקבל את התועלת (prompts קטנים). ה-orchestrator צריך רק לדעת 'לאן לשלוח', לא 'איך לפתור'.",
    optionNotes: [
      "שגוי: orchestrator שיודע הכל הוא בדיוק ה-system prompt הענק שניסינו להימנע ממנו — רק יקר יותר.",
      "נכון: תפקידו לנתב בלבד; העמסת ידע עליו מבטלת את יתרון ההפרדה ומשאירה רק את החסרונות.",
      "שגוי: ה-orchestrator כן נספר כטוקנים בכל קריאה — זו בדיוק הסיבה שכדאי שיהיה קצר.",
      "שגוי: workers עובדים מצוין עם כל orchestrator; הבעיה ב-orchestrator כבד היא עלות ותחזוקה, לא תאימות.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מתי צריך יותר מסוכן אחד", content: <SlideDeck slides={SLIDES} /> },
  { id: "patterns", label: "שלוש תבניות יסוד", content: <StepDiagram steps={STEPS} /> },
  {
    id: "orchestrator",
    label: "זום-אין: זרימת orchestrator → workers",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          התבנית הנפוצה ביותר בפרודקשן היא orchestrator-worker. הנה הזרימה המלאה — שים לב שה-workers
          לא מדברים זה עם זה, וכל ההרכבה חוזרת ל-orchestrator:
        </p>
        <StepDiagram steps={ORCHESTRATOR_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: system prompt ענק מול סוכן מומחה נפרד",
    content: (
      <PromptComparisonLab
        title="טיפול בשאלת חיוב מורכבת ב-AtlasDesk"
        unitLabel="ארכיטקטורה"
        bad={{
          label: "system prompt ענק שמכיל הכל",
          content: `system prompt כללי + 200 שורות כללי חיוב מפורטים
(הנחות, שוברי זיכוי, סוגי תשלום, מדיניות ביטול...)`,
          outcome:
            "system prompt מתנפח ומשמש בכל בקשה — גם כשהשאלה כלל לא קשורה לחיוב, ה'ידע' הזה נשלח ותופס טוקנים. גם קשה לתחזק system prompt ענק אחד, וגם המודל מתבלבל בין תחומים.",
        }}
        good={{
          label: "סוכן מומחה נפרד לחיוב",
          content: `סוכן כללי מזהה: "זו שאלת חיוב מורכבת" ומעביר
(handoff) לסוכן billing-specialist עם system prompt
ממוקד רק בחיוב — נטען רק כשבאמת נחוץ`,
          outcome:
            "system prompt הכללי נשאר קטן ומהיר לרוב הבקשות; ה'ידע העמוק' בחיוב נטען רק כשבאמת רלוונטי. המחיר: קריאת API נוספת כשמסלימים.",
        }}
        takeaway="הבחירה בין system prompt ענק לסוכנים נפרדים היא בדיוק כמו הבחירה בין monolith למיקרו-שירותים — תלויה בגודל/מורכבות התחום ובתדירות השימוש בכל חלק. אל תפרק לפני שהמונוליט כואב."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="ארכיטקטורות רב-סוכניות קיימות כי לפעמים תחום ידע ספציפי (חיוב, אבטחה, משפט) דורש system prompt עמוק וממוקד שלא כדאי לטעון בכל בקשה כללית. ההפרדה מאפשרת פרומפטים קצרים, בדיקה ממוקדת, ולעתים פרלליזם."
        alternatives="סוכן בודד עם system prompt אחד גדול — פשוט יותר לתחזק (קובץ אחד, זרימה אחת), אך יקר ומסורבל ככל שהתחום גדל. בין התבניות עצמן: sequential לזרימה קבועה וצפויה, orchestrator-worker לניתוב דינמי, parallel/debate כשמשימות בלתי-תלויות או כשרוצים 'דעה שנייה' שמכריעה בין תשובות."
        whenNotTo="אם כל השאלות דומות בהיקף המידע הנדרש (כמו AtlasDesk בשלביו המוקדמים) — סוכן בודד עם system prompt סביר מספיק, בלי overhead של תיאום. אל תבנה רב-סוכני 'כי זה נשמע מתקדם'. ברירת המחדל היא סוכן אחד עד שהוא נכשל בבירור על נתון מדיד."
        commonMistakes="לבנות מערכת רב-סוכנית בלי שיש באמת התמחויות שונות שמצדיקות אותה (over-engineering); orchestrator כבד שמכיל את כל ידע התחומים — משלם את מחיר הריבוי בלי התועלת; פרלליזם על משימות שבעצם תלויות זו בזו; היעדר שלב הרכבה/בדיקת-קונפליקט שמאחד את תוצאות ה-workers."
        performance="פרלליזם מקצר latency רק כשהמשימות באמת בלתי-תלויות ורצות במקביל; אם הן סדרתיות, ריבוי סוכנים רק מוסיף latency. שמור את ה-orchestrator קטן וזול — הוא רץ על כל פנייה, גם על אלה שלא יסלימו."
        cost="כל handoff/קריאת worker הוא קריאת API נוספת — יקר יותר מסוכן בודד. אבל עשוי לחסוך טוקנים בטווח הארוך: system prompts קטנים לרוב הבקשות, וה'ידע הכבד' נטען רק כשרלוונטי. חשב את זה על תמהיל הפניות האמיתי שלך, לא על המקרה הגרוע."
        security="ריבוי סוכנים = יותר גבולות אמון. סוכן עם הרשאות רגישות (למשל ביצוע זיכוי) צריך לקבל בקשות רק מ-orchestrator מהימן, לא ישירות מקלט משתמש. הפרדת אחריות היא גם הפרדת הרשאות — worker כללי לא צריך גישה לכלים של מומחה החיוב."
        maintenance="כל סוכן = system prompt נוסף לתחזק + לוגיקת ניתוב שהיא קוד שצריך בדיקות. תעד איזו תבנית בחרת ולמה; דיבוג של פלט שעבר דרך 3 סוכנים דורש logging של כל שלב (מי קיבל, מה החליט, מה החזיר). גרסא את ה-prompts כמו קוד."
        realWorld="חברות בונות pipeline-ים של סוכנים לעיבוד מסמכים (חילוץ→אימות→סיכום), ו-orchestrator-worker למערכות תמיכה (L1 כללי מנתב ל-L2/L3 מומחים). בפרויקט המסכם של המודול תממש בדיוק את זה: אסקלציה מסוכן כללי לסוכן מומחה-חיוב ב-AtlasDesk."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות פרודקשן נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר מערכות בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>בונים רב-סוכני &quot;כי זה מתקדם&quot; בלי שיש התמחויות שמצדיקות זאת — over-engineering קלאסי.</li>
            <li>orchestrator כבד שמכיל את כל ידע התחומים — שילמת על הריבוי בלי לקבל prompts קטנים.</li>
            <li>מריצים &quot;במקביל&quot; משימות שבעצם תלויות זו בזו — התוצאה לא-עקבית או שגויה.</li>
            <li>אין שלב הרכבה: תוצאות ה-workers נדבקות זו לזו בלי בדיקת קונפליקט/עקביות.</li>
            <li>אין logging פר-שלב — כשהתשובה יוצאת מוזרה אי אפשר לדעת איזה סוכן אשם.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מתחילים מסוכן בודד ומודדים — עוברים לרב-סוכני רק על סמך נתון שמראה כשל.</li>
            <li>שומרים את ה-orchestrator קל: רק ניתוב, בלי ידע התחומים עצמם.</li>
            <li>מפרללים רק משימות בלתי-תלויות באמת; השאר נשאר סדרתי.</li>
            <li>שלב הרכבה מפורש ב-orchestrator שמאחד ובודק קונפליקטים בין workers.</li>
            <li>logging של כל שלב (קלט/החלטה/פלט) כדי שדיבוג בפרודקשן יהיה אפשרי.</li>
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
        id="multi-agent-architecture-patterns"
        title="עצב ארכיטקטורה רב-סוכנית ל-AtlasDesk — והצדק אותה מול סוכן בודד"
        context="עבוד עם Claude Code — תכנון בלבד, המימוש בפרויקט המסכם. אין צורך בריפו קיים."
        steps={[
          "זהה תחום ידע ב-AtlasDesk שהיה שווה סוכן מומחה נפרד (חיוב, אבטחה, טכני מעמיק). נמק: למה סוכן בודד מתקשה בו?",
          "בקש מ-Claude Code להציע system prompt ממוקד לאותו מומחה — קצר וחד, לא 'קיר טקסט'.",
          "בחר תבנית (orchestrator-worker / sequential / parallel) והסבר מדוע היא מתאימה יותר מהשתיים האחרות למקרה שלך.",
          "תרגיל נגדי (trade-off): כתוב במפורש מה העלות של ההחלטה שלך — כמה קריאות API נוספות, כמה latency, ואיזה משטח כשל חדש נפתח. האם עדיין משתלם?",
          "דיבוג-תכנון: תאר איך תדע איזה סוכן אשם אם התשובה הסופית יוצאת שגויה — איזה logging תוסיף בכל שלב?",
        ]}
        successCriteria={[
          "יש לך תחום מומחיות קונקרטי (לא כללי) ונימוק למה סוכן בודד מתקשה בו",
          "בחרת תבנית ואתה יכול להסביר למה היא עדיפה על שתי האלטרנטיבות",
          "כתבת במפורש את ה-trade-off: עלות/latency/משטח-כשל של הבחירה",
          "יש לך תוכנית logging שתאפשר דיבוג של פלט שעבר דרך כמה סוכנים",
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
          ["Orchestrator", "סוכן מנהל שמנתב פניות ל-workers מתאימים ומרכיב את תוצאותיהם — נשאר קל, רק מנתב."],
          ["Worker", "סוכן מומחה עם system prompt ממוקד שמבצע משימה בתחומו ומחזיר תוצאה ל-orchestrator."],
          ["Sequential / Pipeline", "תבנית של סדר קבוע: כל סוכן מסיים ומעביר לבא בתור, ללא החלטת ניתוב."],
          ["Parallel", "כמה סוכנים רצים בו-זמנית על משימות בלתי-תלויות; התוצאות מאוחדות בסוף."],
          ["Debate", "כמה סוכנים מציעים תשובות לאותה שאלה, וסוכן/כלל מכריע — 'דעה שנייה' מובנית."],
          ["Coordination overhead", "העלות הנוספת של תיאום בין סוכנים: קריאות API, latency, משטח כשל, דיבוג."],
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
          <li>שלוש תבניות: <strong>orchestrator-worker</strong> (ניתוב דינמי), <strong>sequential</strong> (צינור), <strong>parallel</strong> (בו-זמני).</li>
          <li>ריבוי סוכנים = הפרדת אחריות + פרומפטים ממוקדים, אבל <strong>לא חינם</strong>: latency, משטח כשל, דיבוג קשה.</li>
          <li>ה-<strong>orchestrator נשאר קל</strong> — רק מנתב. אם הוא מכיל הכל, ביטלת את היתרון.</li>
          <li>ברירת המחדל היא <strong>סוכן בודד</strong> — פרק רק כשיש נתון שמראה שהוא נכשל.</li>
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
          חשוב על מוצר AI שאתה מכיר (עוזר קוד, צ&apos;אטבוט תמיכה). האם יש לו (או שהיה כדאי שיהיה לו)
          יותר מ&quot;סוכן&quot; אחד? איזו תבנית הייתה הכי מתאימה — ומה היה ה-trade-off שהמעצבים שלו שילמו
          עליה? נסה לזהות מקרה אחד שבו סוכן בודד היה עדיף למרות הפיתוי לפצל.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          הכרת את התבניות — בשיעור הבא נצלול ל-handoff ואסקלציה: איך context עובר נכון בין סוכנים,
          איך מסלימים לאדם בזמן, ואיך נמנעים מלולאת handoff אינסופית.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
