"use client";

import { Hammer, CheckCircle2, UploadCloud, Eye, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "advanced-production",
  lessonSlug: "production-deployment-workflows",
  title: "תהליכי דיפלוי לפרודקשן",
  objectives: [
    "לשלב Claude Code בצינור אמיתי: build → test → verify → deploy → verify-in-prod",
    "להבין למה אף פעם לא מדפלוים פלט AI לא-מאומת, ומה ההבדל בין staging ל-prod",
    "להכיר אסטרטגיית rollback: לזהות תקלה בפרודקשן ולחזור אחורה מהר ובבטחה",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["error-recovery-long-sessions"],
};

const SLIDES: Slide[] = [
  {
    title: "דיפלוי הוא צינור, לא 'לחיצה על push'",
    bullets: [
      "Claude Code יכול לכתוב, לבנות, ולדחוף קוד תוך דקות. זה בדיוק מה שהופך משמעת דיפלוי לקריטית: קל מדי לשלוח קוד AI לא-מאומת ישר לפרודקשן.",
      "כלל-הזהב של השיעור: קוד ש-AI ייצר אינו 'מוכן' עד שעבר build + test + אימות ידני. מהירות הכתיבה לא מקצרת את שרשרת האימות — היא מדגישה כמה היא נחוצה.",
      "כל מודול באקדמיה עבר אותו צינור: build נקי → typecheck → בדיקה ידנית ב-preview → commit+push → אימות ב-production. זה לא טקס — כל שלב תפס בעיה אמיתית שהשלב שלפניו פספס.",
    ],
  },
  {
    title: "staging מול production — ולמה שניהם קיימים",
    bullets: [
      "preview / staging: סביבה זהה-ככל-האפשר ל-production, אבל בלי משתמשים אמיתיים. כאן בודקים ידנית לפני שמישהו נפגע.",
      "production: הסביבה החיה. הבדלים ממנה ל-dev — מפתחות API, משתני סביבה, גרסאות תלויות, קונפיג רשת — הם בדיוק המקום שבו באגים 'שלא ראית ב-dev' מתפוצצים.",
      "לכן אימות פוסט-דיפלוי אינו כפילות: preview מוכיח שהלוגיקה נכונה, production מוכיח שהסביבה נכונה. שניהם נחוצים.",
    ],
  },
  {
    title: "rollback — התוכנית שקיימת לפני שצריך אותה",
    bullets: [
      "כשתקלה מתגלה בפרודקשן, השאלה הראשונה אינה 'איך מתקנים' אלא 'איך חוזרים למצב תקין מהר'. תיקון תחת לחץ מוליד באגים חדשים.",
      "rollback = לחזור לגרסה האחרונה הטובה הידועה (redeploy של commit קודם / revert). מהיר, צפוי, ומחזיר את המשתמשים למצב עובד בזמן שאתה חוקר ברוגע.",
      "לכן commits קטנים וברורים משתלמים: הם הופכים rollback לפעולה כירורגית ולא ל'לחזור שבוע אחורה'.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: Hammer, label: "1. Build", detail: "npm run build — מוודא שהקוד מתקמפל ושכל הדפים נבנים. נכשל כאן = לא ממשיכים הלאה, נקודה." },
  { icon: CheckCircle2, label: "2. Test + Typecheck", detail: "typecheck + טסטים אוטומטיים — תופסים חוזה-טיפוסים שבור ורגרסיות בלוגיקה שה-build לבדו לא תופס." },
  { icon: Eye, label: "3. Verify (preview)", detail: "בדיקה ידנית ב-preview/staging — תופס לוגיקה שגויה ובעיות UX שאף בדיקה אוטומטית לא תפסה. כאן פלט ה-AI 'מוכיח את עצמו'." },
  { icon: UploadCloud, label: "4. Deploy", detail: "git push → דיפלוי אוטומטי (Vercel). לא הסוף — רק המעבר לסביבה החיה." },
  { icon: ShieldCheck, label: "5. Verify Production", detail: "בדיקה בסביבת production בפועל (curl/ביקור באתר) — כי מפתחות/config/סביבה יכולים לגרום להתנהגות שונה מ-dev." },
  { icon: RotateCcw, label: "6. Rollback (במידת הצורך)", detail: "אם אימות ה-prod נכשל — חזרה מיידית לגרסה הטובה האחרונה. קודם מייצבים, אחר כך חוקרים." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'git push' לא מספיק כדי לסיים תהליך דיפלוי, לפי מה שנעשה בפועל באקדמיה הזו?",
    options: [
      "זה כן מספיק, אין צורך בשום דבר אחרי",
      "כי push הוא רק אמצע התהליך — צריך לוודא בפועל שהתכונה עובדת ב-production, כי לפעמים dev ו-production מתנהגים אחרת (למשל מפתחות API או משתני סביבה)",
      "כי git push תמיד נכשל בפעם הראשונה",
      "כי Vercel דורש אישור ידני לכל דיפלוי",
    ],
    correctIndex: 1,
    explanation:
      "build ירוק מוכיח שהקוד מתקמפל; preview מוכיח שהלוגיקה נכונה; אבל רק אימות ב-production מוכיח שהסביבה נכונה. הבדלי סביבה (מפתחות, config, תלויות) יכולים לגרום להתנהגות שונה מ-dev — לכן curl/בדיקה ידנית ב-prod הם חלק בלתי-נפרד מהתהליך.",
    optionNotes: [
      "לא נכון: push הוא שלב אחד בלבד — אימות פוסט-דיפלוי הוא חלק מהתהליך המלא, לא תוספת.",
      "נכון: זה בדיוק מה שנעשה בכל מודול — בדיקה אמיתית ב-production כי הבדלי סביבה משנים התנהגות.",
      "לא נכון: push לא נכשל 'תמיד' — זו לא הסיבה לצורך באימות.",
      "לא נכון: Vercel (בהגדרות ברירת המחדל של הפרויקט) מדפלוי אוטומטית בכל push, בלי אישור ידני.",
    ],
  },
  {
    id: "q2",
    question:
      "התגלתה תקלה בפרודקשן אחרי דיפלוי של שינוי ש-Claude Code כתב. מה הצעד הראשון הנכון?",
    options: [
      "לפתוח את Claude Code ולבקש ממנו לתקן ישר על main, כי הוא כתב את זה מהר",
      "לבצע rollback לגרסה הטובה האחרונה כדי לייצב את הפרודקשן, ורק אז לחקור את הבאג ברוגע",
      "להשאיר את התקלה ולחכות שמשתמשים ידווחו לפני שמחליטים",
      "למחוק את כל ההיסטוריה ולהתחיל את הפרויקט מחדש",
    ],
    correctIndex: 1,
    explanation:
      "תחת לחץ, תיקון-ישיר-על-פרודקשן מוליד באגים חדשים. הסדר הנכון: קודם מייצבים (rollback לגרסה הטובה הידועה, שמחזירה מיד את המשתמשים למצב עובד), ורק אז חוקרים ומתקנים ברוגע ב-preview. rollback הוא החלטה הנדסית, לא כישלון.",
    optionNotes: [
      "לא נכון: תיקון תחת לחץ ישירות על main הוא בדיוק המצב שמוליד באגים חדשים על גבי הישן.",
      "נכון: קודם ייצוב (rollback), אחר כך חקירה. זו הדרך המהירה והבטוחה להחזיר משתמשים למצב תקין.",
      "לא נכון: להשאיר תקלה חיה פוגע במשתמשים אמיתיים — בדיוק מה שהצינור נועד למנוע.",
      "לא נכון: תגובת-יתר הרסנית. rollback לגרסה קודמת פותר בלי לאבד היסטוריה.",
    ],
  },
  {
    id: "q3",
    question: "למה בודקים ב-preview/staging *לפני* production, אם ממילא נבדוק שוב ב-production?",
    options: [
      "זו כפילות מיותרת — מספיק לבדוק פעם אחת ב-production",
      "preview מוכיח שהלוגיקה נכונה בלי לסכן משתמשים אמיתיים; production מוכיח שהסביבה (מפתחות/config) נכונה. כל אחד תופס סוג בעיה אחר",
      "preview רץ מהר יותר אז הוא מחליף לגמרי את הבדיקה ב-production",
      "staging קיים רק בשביל להרשים את הצוות, אין לו ערך טכני",
    ],
    correctIndex: 1,
    explanation:
      "שתי הבדיקות אינן כפילות — הן תופסות שכבות שונות. preview הוא רשת-ביטחון של הלוגיקה בסביבה בטוחה (בלי משתמשים בסיכון); production הוא רשת-ביטחון של הסביבה עצמה. באג לוגי אמור להיתפס ב-preview; באג של מפתח API חסר אמור להיתפס ב-prod.",
    optionNotes: [
      "לא נכון: אם תדלג על preview, כל באג לוגי יתגלה רק כשמשתמשים אמיתיים כבר נפגעו.",
      "נכון: כל סביבה מוכיחה דבר אחר — לוגיקה מול סביבה — ולכן שתיהן נחוצות.",
      "לא נכון: preview לא מחליף production כי הוא לא חושף הבדלי-סביבה אמיתיים (מפתחות/config).",
      "לא נכון: ל-staging ערך טכני מובהק — לתפוס בעיות לפני שהן מגיעות למשתמשים.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: התהליך שכבר תרגלת בפועל", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "צינור הדיפלוי המלא", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "רע מול טוב: אותו שינוי, שני תהליכי דיפלוי",
    content: (
      <PromptComparisonLab
        title="שינוי קטן ל-AtlasDesk — עדכון פרומפט המערכת של בוט התמיכה"
        unitLabel="תהליך דיפלוי"
        bad={{
          label: "'push ותקווה'",
          content: `Claude Code מעדכן את הפרומפט → git push ישר ל-main.
"ה-build עבר ב-Vercel, אז זה בטח עובד." סוגרים את המחשב.`,
          outcome:
            "ב-production הפרומפט קורא ממשתנה סביבה שקיים ב-dev אך חסר ב-prod, אז הבוט מחזיר תשובות ריקות. אף אחד לא בדק בפועל — התקלה מתגלה רק כשלקוח מתלונן, בלי rollback מוכן.",
        }}
        good={{
          label: "צינור מלא + rollback מוכן",
          content: `build+typecheck מקומית → בדיקה ידנית ב-preview
(שלחתי הודעה, ראיתי תשובה תקינה) → push → curl אמיתי
ל-production ("האם הבוט עונה?") → הכל ירוק, ואם לא —
redeploy של ה-commit הקודם מוכן ביד.`,
          outcome:
            "אימות ה-production תופס מיד את משתנה הסביבה החסר, לפני שמשתמש אחד נפגע. מוסיפים את המשתנה, מדפלוים שוב, ומאמתים — או, אם היה צריך, rollback מיידי מחזיר את הגרסה העובדת בשנייה.",
        }}
        takeaway="אותו שינוי בדיוק. ההבדל הוא שהתהליך הטוב מניח שמשהו *יכול* להשתבש בסביבה החיה — ולכן בונה אימות ו-rollback לתוך התהליך, לא כמחשבה שנייה אחרי שכבר נשבר."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="אימות פוסט-דיפלוי קיים כי סביבת production שונה מ-dev בדרכים שלא תמיד צפויות — מפתחות API, משתני סביבה, הגדרות רשת, גרסאות תלויות. build ירוק מוכיח קומפילציה, לא נכונות בסביבה החיה."
        alternatives="'push ולסמוך שזה עובד' — מהיר, ועובד לפעמים. אבל לפרודקשן עם משתמשים תלויים, ההסתברות שהבדל-סביבה כלשהו יתפוצץ גבוהה מספיק כדי להצדיק את דקות האימות בכל דיפלוי."
        whenNotTo="לפרויקט צד אישי בלי משתמשים, או ל-preview שגם ככה זמני — אפשר לקצר את הטקס. ככל שיש יותר משתמשים תלויים ויותר סיכון עסקי, הצינור המלא (כולל rollback מתוכנן) הופך לחובה."
        commonMistakes="לבדוק רק שה-build עבר (ירוק ב-CI) ולהניח שזה מספיק; לדפלוי בלי תוכנית rollback ואז לתקן בפאניקה ישירות על main; לבלבל בין 'הדיפלוי הצליח' (הקוד נדחף) לבין 'התכונה עובדת' (המשתמש מקבל תוצאה נכונה)."
        performance="הצינור עצמו הוא זול: build+test רצים תוך דקות ואפשר להריצם במקביל. הוא חוסך את היקר באמת — גילוי מאוחר של תקלה שכבר פוגעת במשתמשים, על גבי דיבוג תחת לחץ."
        security="production חושף גם סיכוני-אבטחה שלא נראים ב-dev: מפתח שנחשף בלוג, endpoint פתוח בטעות, CORS פרוץ. אימות פוסט-דיפלוי הוא גם הזדמנות לוודא שסודות לא דלפו לצד הלקוח — לא רק שהתכונה עובדת."
        cost="אימות פוסט-דיפלוי עולה כמה דקות. rollback מהיר עולה שניות. שניהם זולים לאין ערוך מהחלופה: שעות של דיבוג-חירום + נזק-אמון של משתמשים שראו את המערכת שבורה."
        maintenance="commits קטנים וברורים הם מה שהופך rollback לכירורגי. commit ענק ('כל היכולת בבת אחת') מכריח rollback גס שמבטל גם חלקים תקינים — עוד סיבה לפרק, בדיוק כפי שנלמד באנטי-פטרנים."
        realWorld="בדיוק ככה אומתה כל תכונה באקדמיה: לא רק build, אלא curl אמיתי ל-production אחרי כל push — ולא פעם זה תפס משתנה סביבה או config שקיים ב-dev וחסר ב-prod, לפני שמישהו נפגע."
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
            <AlertTriangle size={16} /> מה שובר מערכות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מדפלוים פלט AI ישר ל-prod בלי בדיקה ידנית — &quot;ה-build עבר, אז זה עובד&quot;.</li>
            <li>מבלבלים בין &quot;הדיפלוי הצליח&quot; (נדחף) לבין &quot;התכונה עובדת&quot; (המשתמש קיבל תוצאה נכונה).</li>
            <li>מדלגים על preview ובודקים לראשונה ישר בסביבה החיה, על משתמשים אמיתיים.</li>
            <li>אין תוכנית rollback — כשמשהו נשבר, מתקנים בפאניקה ישירות על main.</li>
            <li>commit ענק שהופך כל rollback לגס: מבטלים גם חלקים תקינים.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <ShieldCheck size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>build + typecheck + טסטים מקומית — נכשל = לא ממשיכים.</li>
            <li>בדיקה ידנית ב-preview לפני שמשתמש אחד נוגע בקוד החדש.</li>
            <li>אימות אמיתי ב-production (curl/ביקור) אחרי כל push — לא רק &quot;זה נדחף&quot;.</li>
            <li>rollback מתוכנן מראש: חוזרים לגרסה הטובה האחרונה, מייצבים, ואז חוקרים.</li>
            <li>commits קטנים וברורים — כדי ש-rollback יהיה כירורגי, לא גורף.</li>
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
        id="advanced-production-deployment-workflows"
        title="הרץ צינור דיפלוי מלא — כולל תרגול rollback — על שינוי קטן ל-AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk (או פרויקט Vercel אחר שלך). המטרה היא לתרגל את הצינור המלא, כולל היכולת לחזור אחורה."
        steps={[
          "בצע שינוי קטן ואמיתי (למשל שינוי טקסט או פרומפט מערכת).",
          "הרץ build+typecheck מקומית. ודא שהם ירוקים לפני שממשיכים.",
          "בדוק ידנית ב-preview שהשינוי באמת עובד — לא רק שהוא קומפל.",
          "push, ואז אמת בפועל ב-production (curl/ביקור באתר) — לא רק שהדיפלוי 'הצליח'.",
          "תרגל rollback: מצא את ה-commit הקודם ובקש מ-Claude Code להראות לך איך היית מבצע redeploy שלו (בלי לבצע בפועל אם לא צריך).",
        ]}
        successCriteria={[
          "עברת את כל שלבי הצינור בפועל, לא רק חלק מהם",
          "יש לך אימות production אמיתי (לא רק 'זה נדחף')",
          "אתה יודע להצביע על ה-commit שאליו היית עושה rollback, ואיך",
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
          ["Deploy", "שליחת גרסת קוד לסביבה שרצה בפועל (למשל push → דיפלוי Vercel אוטומטי)."],
          ["Staging / Preview", "סביבה זהה-ככל-האפשר ל-prod אך בלי משתמשים אמיתיים — לבדיקה בטוחה."],
          ["Production", "הסביבה החיה שמשרתת משתמשים אמיתיים; שם הבדלי-סביבה מתפוצצים."],
          ["Verify-in-prod", "בדיקה אמיתית (curl/ביקור) שהתכונה עובדת ב-prod, לא רק שהדיפלוי הצליח."],
          ["Rollback", "חזרה לגרסה הטובה האחרונה כדי לייצב מהר, לפני חקירת הבאג."],
          ["Environment variable", "ערך תלוי-סביבה (מפתח API/config) שיכול להיות שונה בין dev ל-prod."],
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
          <UploadCloud size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>דיפלוי הוא <strong>צינור</strong> (build→test→verify→deploy→verify), לא לחיצת push.</li>
          <li>פלט AI <strong>אינו מוכן</strong> עד שעבר build + test + אימות ידני — המהירות לא מקצרת את האימות.</li>
          <li><strong>preview מוכיח לוגיקה, production מוכיח סביבה</strong> — שתי הבדיקות נחוצות.</li>
          <li>תמיד יש <strong>rollback מתוכנן</strong>: קודם מייצבים, אחר כך חוקרים.</li>
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
          חשוב על דיפלוי אחרון שביצעת (בכל פרויקט) בלי אימות production מלא. האם היה שם משהו שהיה
          מתגלה רק בבדיקה אמיתית, לא ב-build? ואם היה נשבר — האם היה לך rollback מוכן?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          ראית ש-rollback מייצב מהר כשמשהו משתבש בפרודקשן. בשיעור הבא (טעויות נפוצות ואנטי-פטרנים)
          נלמד איך למנוע את רוב אותן תקלות עוד לפני הדיפלוי — כי הדיפלוי הכי בטוח הוא זה שלא נשבר מלכתחילה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
