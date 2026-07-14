"use client";

import { Building2, Database, Filter, Layers, TestTube } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-build",
  lessonSlug: "multi-tenancy-fundamentals",
  title: "יסודות Multi-Tenancy",
  objectives: [
    "להבין מהו multi-tenancy ולמה מוצר SaaS זקוק לו",
    "להכיר גישות בידוד נתונים: shared DB עם tenant_id, schema-per-tenant, ו-DB נפרד לכל לקוח, ואת ה-trade-offs שלהן",
    "לזהות את מחלקת הבאגים המפורסמת של 'דליפת נתונים חוצת-לקוחות' — ואיך אוכפים בידוד ומוכיחים אותו בבדיקה",
  ],
  estMinutes: 40,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: מסמך MVP מלא ל-AtlasDesk כמוצר מסחרי"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה זה פותר: מוצר אחד, הרבה לקוחות",
    bullets: [
      "רגע שיש לך לקוח משלם שני — נולד צורך חדש: לקוח A לעולם, בשום מצב, לא אמור לראות נתון של לקוח B. זו לא 'תכונה נחמדה', זו הדרישה שמפרידה בין demo למוצר.",
      "Multi-tenancy הוא הארכיטקטורה שמאפשרת ל-instance אחד של המוצר לשרת הרבה לקוחות ('tenants') תוך בידוד מלא בין הנתונים שלהם — על אותה תשתית, אותו קוד, אותו deployment.",
      "'Tenant' = יחידת בידוד. בדרך כלל זה ארגון/חברה-לקוחה, לא משתמש בודד: לחברה יש הרבה משתמשים, אך כולם שייכים לאותו tenant ורואים את אותם הנתונים.",
    ],
  },
  {
    title: "הפער הנוכחי: AtlasDesk היום הוא single-tenant",
    bullets: [
      "AtlasDesk הנוכחי לא מבחין בין 'לקוחות' — כולם משתמשים באותה מערכת בלי הפרדה. מושלם ללימוד, אבל לא מתאים למוצר SaaS מסחרי.",
      "המעבר ל-multi-tenant אינו שינוי UI — הוא שינוי עומק ב-data model: כל טבלה, כל שאילתה, כל endpoint צריכים לדעת 'לְמי שייך הנתון הזה'.",
      "ככל שמאחרים את השינוי — יקר יותר. להוסיף tenant_id ל-3 טבלאות זה קל; להוסיף אותו ל-40 טבלאות עם נתוני production חיים זה פרויקט מסוכן.",
    ],
  },
  {
    title: "שלוש גישות בידוד — ורצף של trade-off אחד",
    bullets: [
      "Shared DB + tenant_id: כל הלקוחות באותו DB, מופרדים בעמודת tenant_id. הכי זול, הכי קל לתחזק — אך הבידוד לוגי בלבד (תלוי בקוד).",
      "Schema-per-tenant: DB אחד, אך schema (מרחב-שמות של טבלאות) נפרד לכל לקוח. בידוד חזק יותר, מורכבות ניהול בינונית.",
      "DB-per-tenant: DB פיזי נפרד לכל לקוח. בידוד מקסימלי ו-blast-radius מינימלי — אך היקר והמורכב ביותר בקנה מידה.",
      "הציר: משמאל (shared) עלות וסקייל נמוכים אך סיכון בידוד גבוה; מימין (DB-per-tenant) בידוד מקסימלי אך עלות וסיבוכיות תפעול גבוהים.",
    ],
  },
];

const ISOLATION_STEPS: DiagramStep[] = [
  {
    icon: Building2,
    label: "1. זהה את ה-Tenant",
    detail: "בכל בקשה נכנסת, קבע לאיזה tenant היא שייכת — מתוך ה-session/JWT של המשתמש המחובר, לא מפרמטר שהלקוח שולח (אחרת אפשר לזייף אותו).",
  },
  {
    icon: Database,
    label: "2. הוסף tenant_id לכל טבלה",
    detail: "כל טבלה שמכילה נתוני-לקוח מקבלת עמודת tenant_id (עם אינדקס). זה ה'תג הבעלות' שכל שורה נושאת.",
  },
  {
    icon: Filter,
    label: "3. סנן כל שאילתה",
    detail: "כל SELECT/UPDATE/DELETE מוגבל ל-tenant הנוכחי. עדיף לאכוף דרך שכבה משותפת (helper/ORM scope/RLS) ולא בכל שאילתה ידנית.",
  },
  {
    icon: TestTube,
    label: "4. הוכח את הבידוד",
    detail: "בדיקה אוטומטית שמנסה לגשת מ-tenant A לנתון של tenant B ומוודאת שהיא נכשלת. בלי הבדיקה הזו — הבידוד הוא הנחה, לא עובדה.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה הסיכון המרכזי בגישת 'shared DB עם tenant_id' לעומת DB נפרד לכל לקוח?",
    options: [
      "אין סיכון נוסף, שתי הגישות זהות באבטחה",
      "אם מפתח שוכח לסנן שאילתה לפי tenant_id הנוכחי (בטעות), הוא עלול לחשוף נתונים של לקוח אחר — הבידוד תלוי במשמעת קוד, לא באכיפה פיזית",
      "shared DB תמיד איטי יותר מ-DB נפרד",
      "shared DB לא נתמך על ידי Supabase",
    ],
    correctIndex: 1,
    explanation:
      "ב-DB נפרד הבידוד פיזי — אי אפשר 'לטעות' ולגשת ללקוח אחר, כי אין חיבור לאותו DB. ב-shared DB הבידוד לוגי — הוא תלוי בכך שכל שאילתה מסננת נכון, וזה יוצר סיכון אנוש שקנה-מידתו כל בסיס-הקוד.",
    optionNotes: [
      "שגוי: יש הבדל מהותי — בידוד לוגי (shared) פגיע לטעות אנוש; בידוד פיזי (נפרד) לא.",
      "נכון: שכחת פילטר אחת מספיקה כדי לדלוף נתונים חוצי-לקוחות — מה שלא יכול לקרות עם DB נפרד פיזית.",
      "שגוי: ביצועים תלויים במימוש ובאינדוקס, לא בגישה כעיקרון גורף. shared-DB מאונדקס היטב יכול להיות מהיר מאוד.",
      "שגוי: Supabase (כמו כל Postgres) תומך במלואו ב-shared-DB עם tenant_id, וגם ב-RLS שאוכף אותו.",
    ],
  },
  {
    id: "q2",
    question: "מהיכן נכון לקחת את ה-tenant_id של הבקשה הנוכחית?",
    options: [
      "מפרמטר query-string שהלקוח שולח (למשל ?tenant=acme)",
      "מה-session/JWT של המשתמש המאומת בצד השרת — הערך שהשרת קבע, לא הלקוח",
      "מכתובת ה-IP של המבקש",
      "מ-header שהדפדפן ממלא אוטומטית",
    ],
    correctIndex: 1,
    explanation:
      "ה-tenant_id הוא גבול אבטחה. אם הוא מגיע מקלט שהלקוח שולט בו (query/body/header חופשי), תוקף פשוט משנה אותו ל-tenant של מישהו אחר. הערך חייב להיגזר מזהות מאומתת בצד השרת — session או JWT חתום שהשרת הנפיק.",
    optionNotes: [
      "שגוי ומסוכן: פרמטר מהלקוח ניתן לזיוף — זו בדיוק פרצת ה-IDOR/cross-tenant הקלאסית.",
      "נכון: ה-tenant נגזר מהזהות שהשרת אימת (session/JWT), ולכן לא ניתן לזייף אותו מהצד של הלקוח.",
      "שגוי: IP אינו מזהה tenant — משתמשים מאותו tenant מגיעים מ-IP שונים, ו-IP ניתן לזיוף/שיתוף.",
      "שגוי: אין header 'קסם' שהדפדפן ממלא עם tenant אמין; כל header שהלקוח שולח הוא קלט לא-אמין.",
    ],
  },
  {
    id: "q3",
    question: "מהי 'בעיית השכן הרעשן' (noisy neighbor) ב-shared DB, ואיך ניגשים אליה?",
    options: [
      "באג אבטחה שבו לקוח קורא נתונים של לקוח אחר",
      "לקוח אחד עם עומס חריג (query כבד/הרבה נתונים) פוגע בביצועים של כל שאר הלקוחות על אותה תשתית — מטפלים במגבלות/quota, אינדוקס, ובמקרי-קצה בהעברת לקוח כבד ל-DB ייעודי",
      "שגיאת רשת שגורמת ל-timeout",
      "בעיה שקיימת רק ב-DB-per-tenant",
    ],
    correctIndex: 1,
    explanation:
      "כשלקוחות חולקים משאבים פיזיים, לקוח 'רעשן' (שאילתות כבדות, נפח ענק) יכול לזלול CPU/IO ולהאט את כולם. זו בעיית ביצועים/הוגנות, לא אבטחה. פתרונות: rate-limiting ו-quota per-tenant, אינדוקס נכון, connection pooling, ובקצה — הוצאת לקוח-ענק ל-DB ייעודי משלו.",
    optionNotes: [
      "שגוי: זו דליפת-נתונים (בעיית בידוד), לא noisy-neighbor — שני דברים נפרדים.",
      "נכון: זה עומס של לקוח אחד שפוגע בשאר; מטפלים ב-quota/אינדוקס/pooling ובקצה בהפרדת התשתית.",
      "שגוי: timeout רשתי אינו noisy-neighbor; זו תופעה של תחרות על משאבי מחשוב משותפים.",
      "שגוי: davka ב-DB-per-tenant הבעיה כמעט נעלמת (לכל לקוח משאבים משלו) — היא חריפה ב-shared.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: למה multi-tenancy קיים", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "isolation-flow",
    label: "ארבעת הצעדים לבידוד tenant — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          בידוד נכון אינו טריק אחד אלא שרשרת של ארבעה צעדים. אם אחד מהם חסר — הבידוד דולף. עבור עליהם
          לפי הסדר:
        </p>
        <StepDiagram steps={ISOLATION_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "רע מול טוב: שאילתה בלי בידוד מול עם",
    content: (
      <PromptComparisonLab
        title="שליפת שיחות שמורות במערכת multi-tenant"
        unitLabel="שאילתת DB"
        bad={{
          label: "בלי סינון tenant",
          content: `-- הקוד סומך על user_id בלבד
SELECT * FROM conversations
WHERE user_id = 123`,
          outcome:
            "אם user_id 123 קיים בשני tenants (למשל התנגשות מזהים בין שני לקוחות עסקיים), השאילתה מחזירה שיחות של שני הלקוחות מעורבבות. זו בדיוק מחלקת הבאג המפורסמת של דליפה חוצת-לקוחות — לקוח רואה נתון של לקוח אחר.",
        }}
        good={{
          label: "עם סינון tenant מפורש (או RLS)",
          content: `-- tenant_id נגזר מה-session, לא מהלקוח
SELECT * FROM conversations
WHERE tenant_id = :current_tenant
  AND user_id = 123`,
          outcome:
            "כל שאילתה מוגבלת מפורשות ל-tenant הנוכחי. גם אם user_id מתנגש בין לקוחות — שורות של tenant אחר פשוט לא נכללות. עם RLS, ה-DB עצמו אוכף את התנאי גם אם המפתח שכח.",
        }}
        takeaway="בגישת shared-DB כל שאילתה חייבת לכלול סינון tenant. אל תסמוך על כך שכל מפתח יזכור בכל שאילתה — אכוף את זה בשכבה אחת (helper/ORM scope/RLS) כך ש'לשכוח' פשוט לא יהיה אפשרי."
      />
    ),
  },
  {
    id: "rls",
    label: "רשת הביטחון: Row-Level Security (RLS)",
    content: (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-2 font-bold text-primary">מה זה RLS ולמה זה משנה</p>
        <p className="mb-3 text-muted">
          Row-Level Security הוא מנגנון של Postgres (וזמין ב-Supabase) שבו ה-DB עצמו — לא הקוד — אוכף
          מי רשאי לראות אילו שורות. מגדירים policy שאומרת ”שורה נראית רק אם tenant_id שלה שווה ל-tenant
          של המשתמש המחובר”, וה-DB מסנן אוטומטית כל שאילתה. גם אם מפתח כותב <code className="rounded bg-bg px-1">SELECT *</code> בלי
          WHERE — ה-DB לא יחזיר שורות של tenant אחר.
        </p>
        <p className="mb-1 font-bold text-success">ההבדל התפיסתי</p>
        <ul className="mb-3 list-disc space-y-1 pr-5 text-muted">
          <li>סינון ידני בקוד = הבידוד תלוי בכך ש<strong>כל</strong> מסלול קוד זוכר לסנן. שכחה אחת = דליפה.</li>
          <li>RLS = הבידוד נאכף בשכבה אחת נמוכה (ה-DB), ברירת-המחדל היא ”לא רואים”, ושכחה בקוד אינה פותחת פרצה.</li>
        </ul>
        <p className="text-muted">
          RLS אינו קסם: הוא דורש שה-DB ידע מיהו ה-tenant הנוכחי (למשל דרך משתנה session שהאפליקציה מגדירה
          בכל בקשה), ויש לו עלות ביצועים קטנה. אבל כרשת-ביטחון מעל סינון בקוד — הוא מפחית דרמטית את
          הסיכוי לדליפה קטסטרופלית.
        </p>
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="multi-tenancy קיים כי מוצר SaaS משרת הרבה לקוחות על אותה תשתית — בלי בידוד, נתון של לקוח אחד עלול לדלוף לאחר. זו לא בעיה תיאורטית: זו מחלקת הכשל שהורידה מוצרים והובילה לקנסות רגולטוריים."
        alternatives="שלוש נקודות על ציר אחד: shared-DB+tenant_id (זול, קל, בידוד לוגי), schema-per-tenant (בידוד בינוני, ניהול migrations מורכב יותר), ו-DB-per-tenant/instance נפרד (בידוד מקסימלי, יקר ומסובך בקנה מידה). רוב ה-SaaS מתחילים ב-shared+RLS, ומוציאים לקוחות-ענק ל-DB ייעודי כשצריך (מודל היברידי)."
        whenNotTo="למוצר לקוח-יחיד (internal tool) — multi-tenancy הוא overhead מיותר. וגם: אל תקפוץ ישר ל-DB-per-tenant 'ליתר ביטחון' כשיש לך 5 לקוחות — תשלם מורכבות תפעולית עצומה לפני שתצטרך אותה."
        commonMistakes="לגזור tenant_id מקלט של הלקוח (query/body) במקום מ-session מאומת; לממש סינון ידני בכל שאילתה בנפרד במקום שכבה משותפת/RLS; להוסיף tenant_id רק ל-90% מהטבלאות ולשכוח את ה-join tables; ולסמוך על בדיקה 'ידנית' במקום טסט אוטומטי שמוכיח שגישה חוצת-tenant נחסמת."
        performance="עמודת tenant_id חייבת אינדקס (בדרך כלל composite: tenant_id + מפתח נוסף), אחרת כל שאילתה סורקת את כל הלקוחות. RLS מוסיף תנאי לכל שאילתה — עלות קטנה אך אמיתית שכדאי למדוד. 'שכן רעשן' יכול להאט את כולם — נדרשות quotas ו-connection pooling."
        cost="shared-DB זול (תשתית אחת), DB-per-tenant יקר (הרבה DBs לנהל, לגבות, לתחזק). אך העלות האמיתית של בידוד שגוי היא אירוע דליפה: אובדן אמון, לקוחות, ואפשרות קנס GDPR. תכנון בידוד נכון מראש זול בהרבה מ-migration חירום אחרי דליפה."
        security="tenant_id הוא גבול אבטחה, לא נוחות. חובה: לגזור אותו מזהות מאומתת; לאכוף אותו בשכבה שאי-אפשר לעקוף (RLS/middleware); ולבדוק אותו אדוורסרית. ההנחה שכל מפתח 'יזכור לסנן' היא בדיוק ההנחה ששוברת מערכות בפרודקשן."
        maintenance="ככל שיש יותר טבלאות, ידני נהיה בלתי-נתחזק — לכן שכבה אחת (RLS/scope). migrations צריכות לזכור להוסיף tenant_id + אינדקס לכל טבלה חדשה; שווה lint/בדיקת-CI שמוודאת שאף טבלת-לקוח לא נוצרה בלי tenant_id."
        realWorld="Slack, Notion, ו-Salesforce כולם multi-tenant בקנה מידה עצום — רובם shared-DB עם בידוד לוגי חזק + לקוחות-enterprise ב-instances ייעודיים (מודל היברידי). בפרויקט המודול הבא תוסיף שכבת הרשאה ראשונה ל-AtlasDesk — לא multi-tenancy מלא, אבל הצעד הראשון בכיוון."
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
            <li>שאילתה אחת ששכחה <code className="rounded bg-bg px-1">WHERE tenant_id</code> — ומדליפה נתון בין לקוחות.</li>
            <li>tenant_id שנלקח מפרמטר שהלקוח שולט בו — תוקף משנה אותו ורואה לקוח אחר.</li>
            <li>סינון ידני מפוזר על מאות שאילתות בלי שכבה אוכפת — שאלת זמן עד שמישהו ישכח.</li>
            <li>אין טסט שמוכיח בידוד — 'זה עובד אצלי' על tenant יחיד מסתיר את הבאג.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>גוזרים tenant_id מ-session/JWT מאומת בלבד — לעולם לא מקלט הלקוח.</li>
            <li>אוכפים בשכבה אחת: RLS ב-DB ו/או scope גלובלי ב-ORM — 'לשכוח' לא אפשרי.</li>
            <li>מוסיפים אינדקס על tenant_id, ו-CI שמוודא שכל טבלת-לקוח כוללת אותו.</li>
            <li>כותבים טסט אדוורסרי: tenant A מנסה לקרוא נתון של B — ומוודאים שזה נכשל.</li>
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
        id="saas-build-multi-tenancy-fundamentals"
        title="הוסף סינון tenant לשאילתה — וכתוב טסט שמוכיח שגישה חוצת-לקוחות נחסמת"
        context="עבוד עם Claude Code. אם אין לך את הריפו של AtlasDesk זמין, בקש מ-Claude Code ליצור פרויקט מינימלי: טבלת conversations עם עמודות id, tenant_id, user_id, body, ופונקציית getConversations."
        steps={[
          "בקש מ-Claude Code להראות לך את הפונקציה שקוראת שיחות. אם היא מסננת רק לפי user_id (בלי tenant_id) — זו הפרצה.",
          "בקש להוסיף פרמטר tenantId שנגזר מה-session, ולסנן כל שאילתה גם לפי tenant_id. הדגש: tenantId חייב להגיע מצד השרת, לא מקלט הלקוח.",
          "בקש מ-Claude Code לכתוב טסט אדוורסרי: הכנס שתי שורות עם אותו user_id אבל tenant_id שונה (A ו-B), קרא כ-tenant A, וּודא שהתוצאה כוללת רק את שורת A ולעולם לא את B.",
          "דיבוג: הרץ את הטסט לפני התיקון וראה אותו נכשל (הפרצה מוכחת), ואז אחרי התיקון וראה אותו עובר. אם עובר עוד לפני התיקון — הטסט חלש; בקש מ-Claude Code לחזק אותו.",
          "בונוס: בקש מ-Claude Code להסביר איך RLS ב-Supabase היה אוכף את אותו כלל ברמת ה-DB, כך שגם שאילתה ששכחה את הפילטר לא תדליף.",
        ]}
        successCriteria={[
          "השאילתה מסננת גם לפי tenant_id, וה-tenantId נגזר מהשרת ולא מקלט הלקוח",
          "יש טסט שנכשל לפני התיקון ועובר אחריו — הוא באמת מוכיח שגישה חוצת-tenant נחסמת",
          "אתה יכול להסביר מה ההבדל בין אכיפה בקוד לבין אכיפה ב-RLS, ומתי כל אחת מתאימה",
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
          ["Tenant", "יחידת הבידוד — בדרך כלל ארגון/חברה-לקוחה. כל הנתונים והמשתמשים שלה מבודדים משאר הלקוחות."],
          ["Multi-Tenancy", "ארכיטקטורה שבה instance אחד של המוצר משרת הרבה tenants עם בידוד נתונים ביניהם."],
          ["tenant_id", "עמודת 'תג בעלות' בכל שורת-נתונים; ה'מפתח' שלפיו מסננים כדי לבודד לקוחות."],
          ["Shared DB", "כל הלקוחות באותו DB, מופרדים לוגית ב-tenant_id. זול וקל, בידוד תלוי-קוד."],
          ["DB-per-Tenant", "DB פיזי נפרד לכל לקוח. בידוד מקסימלי, יקר ומורכב בקנה מידה."],
          ["Row-Level Security", "מנגנון DB שאוכף מי רשאי לראות אילו שורות — רשת ביטחון מעל סינון בקוד."],
          ["Cross-Tenant Leak", "באג שבו לקוח רואה נתון של לקוח אחר — מחלקת הכשל הקטסטרופלית של multi-tenancy."],
          ["Noisy Neighbor", "לקוח עם עומס חריג שפוגע בביצועים של שאר הלקוחות על תשתית משותפת."],
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
          <li>Multi-tenancy = מוצר אחד, הרבה לקוחות, <strong>בידוד מלא</strong> ביניהם.</li>
          <li>הציר: <strong>shared-DB</strong> (זול, בידוד לוגי) ↔ <strong>DB-per-tenant</strong> (יקר, בידוד פיזי); schema-per-tenant באמצע.</li>
          <li>tenant_id הוא <strong>גבול אבטחה</strong>: גזור אותו מ-session מאומת, אכוף בשכבה אחת (RLS), ואל תסמוך על 'לזכור לסנן'.</li>
          <li>בידוד שלא <strong>נבדק אדוורסרית</strong> הוא הנחה, לא עובדה. טסט שמנסה לדלוף — ונכשל — הוא ההוכחה.</li>
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
          חפש דוגמה תיעודית (blog post / post-mortem) של חברת SaaS שסבלה מדליפת נתונים בין לקוחות בגלל
          בעיית multi-tenancy. זהה את הסיבה השורשית: האם זו שאילתה בלי פילטר? tenant_id מקלט הלקוח? היעדר
          RLS? נסח במשפט אחד איזה אחד מארבעת הצעדים בדיאגרמה נכשל אצלם.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          הבנת שבידוד מתחיל בשאלה ”מי המבקש ולמה הוא זכאי”? בפרויקט המודול הבא תממש את הצעד הראשון
          בפועל — שכבת הרשאת-גישה בסיסית ל-AtlasDesk — ותתעד בדיוק מה עוד חסר עד ל-auth מלא ו-multi-tenancy אמיתי.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
