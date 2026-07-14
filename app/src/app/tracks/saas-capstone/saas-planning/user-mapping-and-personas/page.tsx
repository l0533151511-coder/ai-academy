"use client";

import { Users, User, Wrench, Gauge, Target, Map, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-planning",
  lessonSlug: "user-mapping-and-personas",
  title: "מיפוי משתמשים ו-Personas",
  objectives: [
    "להבין למה מוצר AI זקוק להגדרת קהל יעד מדויקת לפני בנייה — ולמה בנייה 'לכולם' נכשלת",
    "לשלוט במושגים persona, Jobs-to-be-Done ומיפוי מסע-משתמש (user journey), ולדעת מתי כל אחד עוזר",
    "לזהות את שלוש ה-personas האמיתיות של AtlasDesk (לקוח קצה, נציג תמיכה, מנהל טכני) ולתרגם אותן להחלטות עיצוב",
    "לאמת persona מול משתמשים אמיתיים לפני שבונים — במקום להניח ולבזבז חודשי פיתוח",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: Runbook ו-Playbook תקריות ל-AtlasDesk"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה persona פותרת: הסוף לניחוש",
    bullets: [
      "AtlasDesk הוא היום מוצר AI production-ready. הטראק הזה שואל שאלה שונה לגמרי: מי בדיוק ישלם עליו, ולמה דווקא הוא?",
      "בלי persona מוגדרת, כל החלטת עיצוב הופכת לוויכוח דעות ('אני חושב שכדאי כפתור כאן'). עם persona, השאלה נעשית עובדתית: 'האם דנה, נציגת התמיכה, צריכה את זה כדי לסגור פנייה מהר יותר?'",
      "persona היא לא קישוט שיווקי — היא כלי הנדסי לתעדוף. היא מה שמאפשר לך להגיד 'לא' ליכולת מבריקה שאף משתמש אמיתי לא ביקש.",
    ],
  },
  {
    title: "dev mode — החלטת persona שכבר קיבלת בלי לשים לב",
    bullets: [
      "'מצב מפתח' (dev mode) שבנית לאורך האקדמיה — שמציג טוקנים, עלות וזמני-תגובה — לא נועד ללקוח קצה בכלל.",
      "זו החלטת persona מרומזת: הוא נבנה למפתח/מנהל טכני שבודק את המערכת, לא ללקוח שרוצה רק תשובה מהירה. הסתרתו כברירת-מחדל היא בדיוק העיצוב-לפי-persona בפעולה.",
      "כל פיצ’ר שבנית משרת persona כלשהי — גם כשלא נתת לה שם. השיעור הזה נותן שם למה שכבר עשית באינטואיציה.",
    ],
  },
  {
    title: "שלוש ה-personas של AtlasDesk",
    bullets: [
      "לקוח קצה — שולח שאלה, רוצה תשובה מהירה ומדויקת. לא מעניין אותו טוקנים, עלות או ארכיטקטורה. הצלחה מבחינתו = הבעיה נפתרה בפחות הודעות.",
      "נציג תמיכה — משתמש ב-AtlasDesk ככלי עבודה יומיומי, צריך אסקלציה חלקה (מודול Multi-Agent) כשה-AI לא מספיק. הצלחה = פחות פניות שמגיעות אליו בכלל.",
      "מנהל טכני/Ops — צריך את שכבת הניטור (מודול Production AI), רואה עלויות, מזהה אנומליות, מחליט מתי לשדרג מודל. הצלחה = מערכת יציבה בתקציב צפוי.",
    ],
  },
];

const PERSONA_STEPS: DiagramStep[] = [
  {
    icon: User,
    label: "לקוח קצה",
    detail: "Job-to-be-Done: 'לפתור את הבעיה שלי מהר, בלי לדבר עם בן-אדם'. מודד הצלחה: זמן-לפתרון ומספר הודעות. אכפת לו מדיוק וטון — לא מטוקנים.",
  },
  {
    icon: Wrench,
    label: "נציג תמיכה",
    detail: "Job-to-be-Done: 'לסגור יותר פניות באיכות גבוהה, ולהעביר לי רק את מה שה-AI לא הצליח'. מודד הצלחה: אחוז אסקלציות, זמן-טיפול. אכפת לו מהעברה חלקה של הקשר.",
  },
  {
    icon: Gauge,
    label: "מנהל טכני/Ops",
    detail: "Job-to-be-Done: 'לוודא שהמערכת יציבה, בטוחה ובתקציב'. מודד הצלחה: עלות-לפנייה, שיעור-שגיאות, latency. אכפת לו מהדשבורד, לא מהטון של תשובה בודדת.",
  },
];

const JTBD_STEPS: DiagramStep[] = [
  {
    icon: Target,
    label: "1. הגדר את ה-Job",
    detail: "לא 'מי המשתמש' אלא 'איזו עבודה הוא שוכר את המוצר כדי לבצע'. לקוח לא רוצה 'בוט' — הוא רוצה שהבעיה שלו תיעלם. הבחנה זו מונעת בניית פיצ'רים שאיש לא צריך.",
  },
  {
    icon: Map,
    label: "2. מפה את המסע",
    detail: "עקוב אחרי ה-persona מרגע שהבעיה מתעוררת ועד לפתרון: איפה היא נתקעת, איפה היא מוותרת, איפה AI יכול לקצר. כל שלב במסע הוא הזדמנות מוצר או נקודת נשירה.",
  },
  {
    icon: CheckCircle2,
    label: "3. אמת מול אמת",
    detail: "דבר עם 5 משתמשים אמיתיים מהקהל. 'אני חושב שהם רוצים X' הוא השערה — 3 שיחות מגלות אם היא נכונה, לפני שבזבזת חודש פיתוח על X.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'מצב מפתח' (dev mode) ב-AtlasDesk הוא בעצם עדות להחלטת persona שכבר התקבלה בלי לשים לב?",
    options: [
      "הוא לא קשור ל-personas בכלל, זה רק פיצ'ר טכני",
      "כי הוא נבנה מלכתחילה בשביל מנהל טכני/מפתח שרוצה לראות טוקנים ועלות — לא בשביל לקוח קצה, שלא מעניין אותו המידע הזה כלל",
      "כי כל משתמש רואה את מצב המפתח כברירת מחדל",
      "כי הוא נועד רק לצוות הפיתוח של האקדמיה עצמה",
    ],
    correctIndex: 1,
    explanation:
      "כל פיצ'ר טכני שנבנה משקף החלטה (מודעת או לא) לגבי מי ה-persona שהוא משרת. dev mode מציג עלות וטוקנים ומוסתר כברירת-מחדל — עיצוב שמניח persona טכני שרוצה פרטים, בניגוד ללקוח קצה שרק רוצה תשובה. זיהוי ההנחה הזו במפורש הוא הצעד הראשון בעיצוב-לפי-persona.",
    optionNotes: [
      "לא נכון: כל פיצ'ר משקף החלטת persona, גם אם היא לא הייתה מודעת בזמן הבנייה. אין 'פיצ'ר ניטרלי'.",
      "התשובה הנכונה: dev mode מוצג רק כשלוחצים עליו במפורש — עיצוב שמניח persona טכני שרוצה פרטים, בניגוד ללקוח קצה רגיל.",
      "לא נכון: dev mode כבוי כברירת מחדל — צריך ללחוץ עליו במפורש, וזו בדיוק הבחירה שמסגירה את ה-persona.",
      "לא נכון: הוא כלי לגיטימי בתוך AtlasDesk המוצר עצמו (למנהל הטכני של הלקוח), לא רק כלי פנימי לצוות האקדמיה.",
    ],
  },
  {
    id: "q2",
    question: "מהי הטעות המרכזית ב'בואו נבנה מוצר שמתאים לכולם'?",
    options: [
      "אין טעות — מוצר שמתאים לכולם הוא היעד האידיאלי של כל SaaS",
      "מוצר 'לכולם' מנסה לספק צרכים סותרים בו-זמנית, והתוצאה היא ממשק עמוס שלא משרת אף persona היטב — הלקוח מרגיש שהמוצר 'לא בשבילו'",
      "הבעיה היחידה היא שקשה יותר לתמחר מוצר כזה",
      "זה עובד מצוין למוצרי B2C אבל לא ל-B2B",
    ],
    correctIndex: 1,
    explanation:
      "צרכי ה-personas מתנגשים: לקוח קצה רוצה מסך נקי, מנהל טכני רוצה לראות עלויות ולוגים. אם מנסים לספק את שניהם באותו מסך, מקבלים דשבורד עמוס שלקוח הקצה נרתע ממנו והמנהל צריך לחפש בו. מוצר חד שמנצח 'persona אחת מצוין' כמעט תמיד גובר על מוצר בינוני שמנסה לרצות את כולם.",
    optionNotes: [
      "לא נכון: 'לכולם' נשמע טוב אך הוא מלכודת קלאסית — הוא מוביל לפשרות שפוגעות בכל צד.",
      "התשובה הנכונה: צרכים סותרים דורשים פשרות, והפשרות מדללות את הערך לכל persona בנפרד.",
      "לא נכון: התמחור הוא סימפטום — הבעיה השורשית היא שהמוצר עצמו לא ממוקד.",
      "לא נכון: המלכודת קיימת גם ב-B2C וגם ב-B2B; היא נובעת מסתירת-צרכים, לא מסוג השוק.",
    ],
  },
  {
    id: "q3",
    question: "בנית persona בשם 'דנה, מנהלת תמיכה בת 34' עם היסטוריה, תמונה ותחביבים. מה הופך אותה לכלי הנדסי שימושי — או לבזבוז זמן?",
    options: [
      "כמות הפרטים הביוגרפיים — ככל שיותר פרטים, כך ה-persona טובה יותר",
      "האם ה-persona מעוגנת ב-Job-to-be-Done אמיתי ובכאבים שאומתו מול משתמשים — ולא רק דמות בדיונית 'שנשמעת נכון'",
      "האם יש לה שם ישראלי",
      "האם היא מבוססת על העדפות הצוות שבנה את המוצר",
    ],
    correctIndex: 1,
    explanation:
      "persona שימושית = כאבים, מטרות ו-Jobs שאומתו מול משתמשים אמיתיים. הפרטים הביוגרפיים (גיל, תחביב) הם קישוט שעוזר לזכור אותה, אבל אם ה'כאבים' הומצאו ליד שולחן, ה-persona תוביל אותך לבנות את הדבר הלא-נכון בביטחון מזויף. persona טובה מתחילה מ-3 שיחות עם משתמשים, לא מ-3 רעיונות של הצוות.",
    optionNotes: [
      "לא נכון: פרטים ביוגרפיים לבד הם קישוט. persona עמוסת-פרטים אך לא-מאומתת מסוכנת יותר מ-persona רזה ואמיתית.",
      "התשובה הנכונה: העוגן הוא ה-Job והכאבים המאומתים — הם מה שהופך persona להחלטה ולא לספר.",
      "לא נכון: השם הוא סתם עזר-זיכרון; אין לו קשר לתקפות ה-persona.",
      "לא נכון: העדפות הצוות הן בדיוק ההטיה שאימות-משתמשים בא למנוע.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מי בדיוק ה-persona", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "personas",
    label: "שלוש ה-personas — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          לכל persona יש <strong>Job-to-be-Done</strong> אחר ו<strong>מודד הצלחה</strong> אחר. שים לב איך
          אותו מוצר בדיוק (AtlasDesk) נמדד בשלוש מדידות שונות לגמרי — זו הסיבה שאי אפשר לבנות ”לכולם”:
        </p>
        <StepDiagram steps={PERSONA_STEPS} />
      </div>
    ),
  },
  {
    id: "jtbd",
    label: "מ-persona למסע: Jobs-to-be-Done",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          persona לבדה היא סטטית. הכוח האמיתי הוא לחבר אותה ל<strong>עבודה שהיא מנסה לבצע</strong> ולמפות את
          המסע שלה — שלושת הצעדים שהופכים דמות בדיונית לכלי-תעדוף אמיתי:
        </p>
        <StepDiagram steps={JTBD_STEPS} />
        <p className="mt-4 rounded-lg border border-border bg-card p-3 text-sm text-muted">
          <strong>למה JTBD ולא רק ”פיצ’רים”:</strong> אנשים לא רוצים ”בוט תמיכה” — הם רוצים
          שהבעיה שלהם תיעלם. כשאתה חושב במונחי Job, אתה מגלה שהמתחרה האמיתי של AtlasDesk הוא לפעמים
          ”לוותר ולסגור את הטאב”, לא בוט מתחרה. זה משנה לגמרי מה חשוב לבנות.
        </p>
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: מוצר בלי personas מוגדרים מול עם",
    content: (
      <PromptComparisonLab
        title="עיצוב תכונה חדשה ל-AtlasDesk"
        unitLabel="גישת עיצוב"
        bad={{
          label: "בלי persona מוגדר",
          content: `"תוסיף דשבורד עם כל המידע האפשרי — עלויות, לוגים,
תשובות, הכל באותו מסך, שכולם יהיו מרוצים"`,
          outcome:
            "דשבורד עמוס ומבלבל — לקוח קצה לא צריך לראות עלויות טוקנים, ומנהל טכני לא רוצה לחפש נתונים בין שיחות לקוחות. אף persona לא מרוצה באמת.",
        }}
        good={{
          label: "עיצוב לפי persona מוגדר",
          content: `לקוח קצה: ממשק צ'אט נקי (מה שכבר קיים)
נציג תמיכה: תור אסקלציות + הקשר-שיחה מלא
מנהל טכני: /api/atlasdesk/stats + מצב מפתח
(כל אחד רואה רק את שלו)`,
          outcome:
            "כל persona רואה בדיוק את מה שרלוונטי לו — בדיוק כמו ההפרדה שכבר קיימת בפועל ב-AtlasDesk. המוצר מרגיש ”נבנה בשבילי” לכל אחד מהם.",
        }}
        takeaway="AtlasDesk כבר מיישם את העיקרון הזה בלי שנקרא לו כך במפורש — עכשיו אתה יודע לתת לו שם ולהשתמש בו במודע בכל החלטת עיצוב עתידית."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הגדרת personas קיימת כי בלעדיה כל החלטת עיצוב היא ניחוש. עם personas ברורות, אפשר לשאול 'מי צריך את זה, לאיזו עבודה, ואיך נדע שהצליח' לפני שבונים — וזה מה שהופך תכנון-מוצר ממחלוקת-דעות למשמעת הנדסית."
        alternatives="לבנות תכונות 'לכולם' בלי הבחנה (מוביל למוצר עמוס שלא משרת אף persona טוב); או לבנות לפי אינטואיציה של המייסד בלבד (מהיר, אך שביר — האינטואיציה של מהנדס לא בהכרח משקפת את הלקוח האמיתי)."
        whenNotTo="לכלי פנימי קטן עם משתמש אחד ברור (סקריפט אישי, כלי-אוטומציה למשרד שלך) — personas פורמליות שם הן over-engineering. גם ב-pivot מהיר של סטארט-אפ מוקדם מאוד, לפעמים עדיף לדבר עם 5 לקוחות מאשר לכתוב מסמך personas מהוקצע."
        commonMistakes="להניח persona בלי לאמת אותה מול משתמשים אמיתיים ('אני חושב שזה מה שהם רוצים' ≠ 'בדקתי'); לבנות persona עמוסת-פרטים-ביוגרפיים אך ריקה מ-Jobs וכאבים אמיתיים; וליצור יותר מ-3-4 personas — אז אף אחת לא מנחה החלטות באמת."
        performance="persona מדויקת חוסכת את משאב היקר ביותר: זמן פיתוח. כל פיצ'ר שנבנה ל-persona לא-מאומתת הוא שבועות שאולי יימחקו. תעדוף-לפי-persona הוא אופטימיזציה של תפוקת-הצוות, לא של קוד."
        cost="הגדרת personas מראש עולה זמן תכנון (וכמה שיחות-משתמש) — אך חוסכת בנייה, תחזוקה ואבטחה של תכונות שאף persona אמיתית לא צריכה. זו אותה חשיבת trade-off כמו בהחלטת ארכיטקטורה."
        maintenance="personas שלא מתעדכנות מתיישנות: ככל שהמוצר גדל, ה-personas משתנות (נציג התמיכה של 10 לקוחות שונה מזה של 10,000). כדאי לבקר את מסמך ה-personas אחת לרבעון מול נתוני-שימוש אמיתיים מה-Monitoring."
        realWorld="Superhuman בנתה את כל המוצר סביב persona אחת חדה ('מנהל עמוס שחי במייל'), וויתרה במכוון על מיליוני משתמשים שלא התאימו לה — וזה מה שהפך אותה למוצר מבוקש. בפרויקט המודול הבא (מסמך MVP) תשתמש בדיוק ב-3 ה-personas האלו כדי לתעדף אילו יכולות נכנסות ל-MVP ואילו הן 'נחמד שיהיה'."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר בפרודקשן מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-danger">
            <AlertTriangle size={16} /> מה שובר מוצרים בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>persona שהומצאה ליד שולחן ולא אומתה — הצוות בונה בביטחון את הדבר הלא-נכון.</li>
            <li>מוצר ”לכולם” — ממשק עמוס שאף persona לא מרגישה ש”נבנה בשבילה”.</li>
            <li>7 personas שונות — כל כך הרבה עד שאף אחת לא מנחה החלטה אמיתית.</li>
            <li>persona = פרטים ביוגרפיים בלי Jobs וכאבים — דמות יפה, חסרת-תועלת לתעדוף.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <CheckCircle2 size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מתחילים מ-5 שיחות עם משתמשים אמיתיים לפני שכותבים persona אחת.</li>
            <li>בוחרים persona ראשית אחת ומנצחים אותה מצוין, לפני שמרחיבים.</li>
            <li>מגבילים ל-3-4 personas ממוקדות, כל אחת עם Job וכאב מוגדרים.</li>
            <li>מקשרים כל החלטת פיצ’ר ל-persona ול-Job שהיא משרתת — או מוחקים אותו.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית עם Claude Code",
    content: (
      <RealWorldTask
        id="saas-planning-user-mapping-and-personas"
        title="מפה את 3 ה-personas של AtlasDesk לעומק — כמסמך תכנון"
        context="עבוד עם Claude Code על הריפו האמיתי של AtlasDesk. זו משימת עיצוב/מפרט — התוצר הוא מסמך personas, לא קוד."
        steps={[
          "בקש מ-Claude Code לסרוק את AtlasDesk ולהפיק רשימה של כל היכולות (8+): שיחה, זיכרון, tools, RAG, agent, multi-agent, webhook, monitoring, security.",
          "לכל יכולת, סווגו יחד: לאיזו persona (לקוח קצה / נציג תמיכה / מנהל טכני) היא משרתת בעיקר, ולאיזה Job-to-be-Done. בנו טבלת יכולת→persona→Job.",
          "דיבוג-החלטות: מצאו יכולת אחת שלא ברור לאיזו persona היא משרתת. שאלו את Claude Code 'מי היה נוטש אם נסיר אותה?' — אם התשובה מעורפלת, זה דגל אדום שהיא לא מעוגנת ב-persona.",
          "לכל persona, נסחו 2 כאבים ו-Job אחד מרכזי. סמנו במפורש אילו מהם השערה שלכם ואילו הייתם יכולים לאמת בשיחת-משתמש.",
          "דונו: איזו persona רביעית (למשל מנהל ארגון שקונה את המוצר, בניגוד למי שמשתמש בו) עדיין לא מקבלת מענה — ומה הייתה צריכה?",
        ]}
        successCriteria={[
          "יש לך טבלת יכולת→persona→Job לכל 8+ היכולות, לא רק רשימה",
          "זיהית לפחות פער אחד (persona שלא משרתים היטב, או יכולת בלי persona ברורה)",
          "לכל persona יש Job מרכזי מוגדר, ואתה יודע להבחין בין כאב מאומת לכאב-השערה",
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
          ["Persona", "דמות מייצגת של קבוצת-משתמשים בעלת מטרות וכאבים משותפים — כלי לתעדוף החלטות, לא קישוט שיווקי."],
          ["Job-to-be-Done (JTBD)", "ה'עבודה' שהמשתמש שוכר את המוצר לבצע. לא 'מי הוא' אלא 'מה הוא מנסה להשיג'."],
          ["User Journey", "מיפוי המסלול של ה-persona מרגע הבעיה ועד הפתרון, כולל נקודות-נשירה ותסכול."],
          ["אימות persona", "בדיקת ההנחות מול משתמשים אמיתיים (שיחות/סקרים) לפני השקעה בפיתוח."],
          ["Pain point", "נקודת-כאב ספציפית שה-persona חווה — היעד שהמוצר בא לפתור."],
          ["persona ראשית", "ה-persona האחת שסביבה מעצבים את ליבת המוצר; משרתים אותה מצוין לפני שמרחיבים לאחרות."],
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
          <Users size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>persona היא <strong>כלי-תעדוף הנדסי</strong>: היא מאפשרת להגיד ”לא” ליכולת שאף משתמש אמיתי לא צריך.</li>
          <li>חשוב ב<strong>Jobs-to-be-Done</strong>, לא בפיצ’רים — אנשים רוצים שהבעיה תיעלם, לא ”בוט”.</li>
          <li>בנייה <strong>”לכולם” נכשלת</strong> כי צרכי ה-personas סותרים — בחר persona ראשית ונצח אותה.</li>
          <li><strong>אמת לפני שתבנה</strong>: 5 שיחות-משתמש שוות יותר מ-5 רעיונות ליד השולחן.</li>
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
          בחר מוצר SaaS שאתה משתמש בו יומיומית. זהה 2-3 personas שהוא משרת, ולכל אחת נסח את
          ה-Job-to-be-Done המרכזי. עכשיו החלק הקשה: מצא פיצ’ר אחד בממשק שאתה בטוח שנבנה ל-persona
          מסוימת — ואחד שלא ברור לך לאיזו persona הוא משרת. מה זה מלמד אותך על מיקוד המוצר?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          עכשיו כשאתה יודע <strong>מי</strong> הלקוח ו<strong>איזו עבודה</strong> הוא רוצה — נשאלת השאלה
          הבאה: כמה הוא ישלם, ואיך? בשיעור הבא נצלול לאתגר הייחודי בתמחור מוצרי AI, שבו כל שימוש עולה
          כסף אמיתי — וגישת ”מחיר קבוע” יכולה להרוס לך את המרווח.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
