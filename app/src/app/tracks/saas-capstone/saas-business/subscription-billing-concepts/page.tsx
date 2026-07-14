"use client";

import { CreditCard, ShieldOff, TrendingUp, RefreshCcw } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-business",
  lessonSlug: "subscription-billing-concepts",
  title: "יסודות Subscription Billing",
  objectives: [
    "להבין מחזור חיים של מנוי: trial, active, past_due, cancelled — וכיצד הוא נשלט באירועים",
    "להכיר את המדדים העסקיים המרכזיים: תוכניות ומדרגות (tiers), MRR/ARR, churn, proration ו-dunning",
    "להבין למה משתמשים בספק סליקה (Stripe) ולא מטפלים בכרטיסי אשראי לבד — PCI ואבטחה",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: AtlasDesk מקבל שכבת הרשאות בסיסית"],
};

const SLIDES: Slide[] = [
  {
    title: "תוכניות ומדרגות: איך מוצר SaaS גובה כסף",
    bullets: [
      "מוצר SaaS מוכר מנויים חוזרים, לרוב במדרגות (tiers): Free / Pro / Enterprise. כל מדרגה נותנת יותר יכולות או מכסה גבוהה יותר (למשל: מספר מסמכים או שאלות בחודש ב-AtlasDesk).",
      "המדרגות הן גם מנוע צמיחה: משתמש מתחיל ב-Free, מגיע לגבול, ומשדרג (upgrade) — וזו הכנסה נוספת בלי לרכוש לקוח חדש.",
      "לצד מנוי קבוע קיים גם usage-based (חיוב לפי צריכה, שנלמד קודם). הרבה מוצרי AI משלבים: מנוי בסיס + חיוב על שימוש עודף בטוקנים.",
    ],
  },
  {
    title: "המדדים שכל מייסד מודד: MRR, ARR, churn",
    bullets: [
      "MRR (Monthly Recurring Revenue) — סך ההכנסה החוזרת החודשית מכל המנויים. זה הדופק של עסק SaaS: לא הכנסה חד-פעמית אלא הכנסה צפויה שחוזרת כל חודש.",
      "ARR (Annual Recurring Revenue) — פשוט MRR כפול 12. אותו מדד בקנה מידה שנתי, נפוץ בשיחות עם משקיעים.",
      "Churn — אחוז הלקוחות (או ההכנסה) שנוטש בכל חודש. churn של 5% חודשי נשמע קטן, אבל הוא אוכל שליש מבסיס הלקוחות בשנה. הפחתת churn שווה לרוב יותר מרכישת לקוחות חדשים.",
    ],
  },
  {
    title: "מחזור חיים של מנוי",
    bullets: [
      "Trial — תקופת ניסיון, לרוב עם הגבלת זמן או שימוש, כדי לתת ללקוח להגיע לערך לפני שהוא משלם.",
      "Active — מנוי פעיל ומשלם. Past due — תשלום נכשל (כרטיס פג תוקף, אין כיסוי), לרוב עם תקופת חסד לפני השעיה.",
      "Cancelled — המנוי הופסק. Proration — כשלקוח משדרג/משנמך באמצע חודש, מחשבים חיוב יחסי לימים שנותרו. Dunning — הרצף האוטומטי של ניסיונות גבייה חוזרים והתראות כשתשלום נכשל, לפני שמוותרים על הלקוח.",
    ],
  },
  {
    title: "webhook-driven billing — כבר בנית את זה!",
    bullets: [
      "מערכות billing אמיתיות (Stripe, Paddle) שולחות webhooks בדיוק כמו זה שבנית במודול Automation — ’תשלום הצליח’, ’מנוי בוטל’, ’כרטיס נכשל’. המערכת שלך מעדכנת סטטוס לקוח לפי האירוע.",
      "אותם עקרונות בדיוק: אימות חתימה (לא לסמוך על תוכן ה-payload), ו-idempotency (אירוע כפול לא יעדכן פעמיים).",
    ],
  },
];

const LIFECYCLE_STEPS: DiagramStep[] = [
  {
    icon: TrendingUp,
    label: "Trial → Active",
    detail: "המשתמש התנסה, ראה ערך, והזין אמצעי תשלום (אצל הספק). הסטטוס עובר ל-active וה-MRR גדל.",
  },
  {
    icon: CreditCard,
    label: "חיוב מחזורי",
    detail: "כל חודש הספק (Stripe) מחייב את הכרטיס ושולח webhook 'תשלום הצליח'. אתה רק מעדכן סטטוס — לא נוגע בכרטיס.",
  },
  {
    icon: RefreshCcw,
    label: "Past due → Dunning",
    detail: "תשלום נכשל → הספק מנסה שוב ושולח התראות (dunning). תקופת חסד לפני השעיה — כדי לא לאבד לקוח על כרטיס שפג.",
  },
  {
    icon: ShieldOff,
    label: "Cancelled",
    detail: "הלקוח ביטל או הגבייה נכשלה סופית. הסטטוס עובר ל-cancelled, המנוי נגרע מה-MRR — זה churn.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה webhook-driven billing (כמו Stripe) דורש בדיוק את אותן שתי הגנות שכבר בנית ב-/api/webhooks/new-ticket?",
    options: [
      "זה צירוף מקרים, אין קשר אמיתי",
      "כי זה אותו דפוס ארכיטקטוני בדיוק: מערכת חיצונית שולחת אירוע, והאבטחה (חתימה) והנכונות (idempotency) קריטיות באותה מידה — בין אם האירוע הוא 'פנייה חדשה' או 'תשלום הצליח'",
      "כי Stripe דורש קוד שונה לגמרי מ-webhook רגיל",
      "כי billing webhooks לא יכולים להישלח פעמיים",
    ],
    correctIndex: 1,
    explanation:
      "זה בדיוק אותו דפוס webhook שנלמד במודול Automation — רק שהתוכן שונה (billing event במקום ticket event). העקרונות (אימות + idempotency) זהים.",
    optionNotes: [
      "לא נכון: זה לא צירוף מקרים — זה אותו דפוס ארכיטקטוני שחוזר על עצמו בהקשרים שונים.",
      "התשובה הנכונה: אותה ארכיטקטורה משרתת מקרי שימוש שונים לגמרי — זה בדיוק הכוח של ללמוד את הדפוס, לא רק את היישום הספציפי.",
      "לא נכון: הקוד דומה במבנה (webhook + חתימה + idempotency) — ההבדל הוא רק בתוכן ה-payload ובלוגיקה העסקית.",
      "לא נכון: כמו כל webhook, גם billing webhooks יכולים להישלח פעמיים (retry ברשת) — לכן idempotency נחוץ בדיוק כמו קודם.",
    ],
  },
  {
    id: "q2",
    question: "מדוע כמעט כל מוצר SaaS משתמש בספק סליקה חיצוני (Stripe/Paddle) במקום לקבל ולשמור מספרי כרטיס אשראי בעצמו?",
    options: [
      "כי אסור מבחינה חוקית לחברות תוכנה לגעת בכסף בכלל",
      "כי אחסון מספרי כרטיס גולמיים כפוף לתקן PCI-DSS מחמיר ומסוכן — הספק לוקח על עצמו את התאימות והסיכון, ואתה מקבל טוקן במקום מספר הכרטיס",
      "כי ספק סליקה תמיד זול יותר מלגבות לבד",
      "כי Stripe הוא הדרך היחידה שקיימת לחייב כרטיס",
    ],
    correctIndex: 1,
    explanation:
      "טיפול במספרי כרטיס גולמיים כפוף לתקן PCI-DSS — דרישות אבטחה מחמירות, ביקורות, ואחריות עצומה במקרה דליפה. ספק הסליקה מקבל את פרטי הכרטיס ישירות בדפדפן הלקוח ומחזיר לך טוקן; אתה שומר רק את הטוקן ולא רואה את המספר האמיתי לעולם. כך רוב נטל ה-PCI והסיכון עוברים אליו.",
    optionNotes: [
      "לא נכון: מותר לחברות לגבות תשלום — הסוגיה היא איך עושים זאת בבטחה, לא איסור גורף.",
      "התשובה הנכונה: PCI-DSS הופך אחסון עצמי של כרטיסים ליקר, מסוכן ומחייב-תאימות. הספק נושא בנטל ומחזיר לך טוקן.",
      "המחיר הוא שיקול משני — לפעמים ספק אף יקר יותר בעמלות, אבל התאימות והסיכון שהוא חוסך מכריעים.",
      "לא נכון: יש ספקים רבים (Paddle, Braintree, ועוד) — Stripe אינו יחיד. הנקודה היא להשתמש בספק כלשהו, לא מי בדיוק.",
    ],
  },
  {
    id: "q3",
    question: "בעל מוצר רואה churn חודשי של 5% ומרגיע את עצמו: 'רק 5%, זניח'. למה זו טעות?",
    options: [
      "זו לא טעות — 5% באמת זניח לחלוטין",
      "כי churn מצטבר: 5% בחודש שוחק כשליש מבסיס הלקוחות תוך שנה, ופוגע ישירות ב-MRR — שימור נמוך יכול לבטל כל צמיחה מרכישת לקוחות",
      "כי churn משפיע רק על מוצרים חינמיים",
      "כי 5% churn אומר שהתמחור גבוה מדי, וזו הבעיה היחידה",
    ],
    correctIndex: 1,
    explanation:
      "churn הוא מדד מצטבר. 5% נטישה בכל חודש נשמע קטן, אבל על פני שנה הוא שוחק חלק ניכר מבסיס הלקוחות (בערך שליש), ופוגע ישירות ב-MRR. לכן חברות SaaS מתייחסות ל-churn כאויב מספר אחת — לרוב זול יותר לשמר לקוח קיים מאשר לרכוש חדש שרק ימלא את החור.",
    optionNotes: [
      "לא נכון: 5% חודשי אינו זניח — בהצטברות שנתית הוא מכרסם נתח גדול מהלקוחות ומההכנסה.",
      "התשובה הנכונה: churn מצטבר ופוגע ב-MRR; שימור נמוך יכול לבלוע כל רכישת לקוחות חדשה.",
      "לא נכון: churn רלוונטי דווקא למוצרים בתשלום — שם כל נטישה היא הכנסה חוזרת שאבדה.",
      "לא נכון: churn יכול לנבוע מסיבות רבות (ערך חסר, אונבורדינג גרוע, באגים) — לא בהכרח מתמחור.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: billing כאירועים, לא כמצב סטטי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "מחזור חיים של מנוי — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          מנוי הוא לא מצב סטטי אלא מכונת-מצבים שנשלטת באירועים מספק הסליקה. עבור על המסלול הטיפוסי,
          מ-trial ועד churn:
        </p>
        <StepDiagram steps={LIFECYCLE_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: בדיקת סטטוס מנוי בכל בקשה מול webhook-driven",
    content: (
      <PromptComparisonLab
        title="עדכון סטטוס מנוי לקוח"
        unitLabel="ארכיטקטורה"
        bad={{
          label: "polling — לבדוק את Stripe בכל בקשה",
          content: `בכל בקשה של המשתמש, קריאה סינכרונית ל-Stripe API:
"מה הסטטוס של המנוי הזה עכשיו?"`,
          outcome:
            "מוסיף latency לכל בקשה (קריאת API חיצונית נוספת), ותלוי בזמינות Stripe בכל רגע — בדיוק הבעיה שלמדת ש-webhooks פותרים (מודול Automation).",
        }}
        good={{
          label: "webhook-driven — עדכון פעם אחת, קריאה מקומית תמיד",
          content: `Stripe שולח webhook כשסטטוס משתנה → מעדכנים
שדה subscription_status ב-DB המקומי → כל בקשה
עתידית קוראת מה-DB המקומי, לא מ-Stripe`,
          outcome:
            "כל בקשה מהירה (קריאה מקומית בלבד), ועדיין מדויקת כי ה-DB מתעדכן בזמן אמת מ-webhooks — בדיוק העיקרון שכבר תרגלת.",
        }}
        takeaway="webhook-driven billing הוא לא נושא חדש שצריך ללמוד מאפס — הוא אותו דפוס בדיוק (event-driven, לא polling) שכבר תרגלת במודול Automation, רק על תוכן עסקי אחר."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="billing מבוסס webhooks קיים כי סטטוס מנוי הוא בדיוק סוג המידע שמשתנה 'שם' (אצל ספק הסליקה) ולא אצלך — webhook הוא הדרך היעילה לדעת מתי הוא השתנה, בלי לשאול כל הזמן (polling)."
        alternatives="polling תדיר ל-Stripe API — עובד, אבל מוסיף latency ותלות בזמינות חיצונית לכל בקשה, בדיוק כמו החיסרון של polling שכבר נלמד. חלופה מלאה יותר: להיישען על ה-billing portal של הספק לניהול המנוי, במקום לבנות מסכים בעצמך."
        whenNotTo="לגבייה חד-פעמית ופשוטה (מוצר שנמכר פעם אחת, לא מנוי) — כל המנגנון של מחזור-חיים, dunning ו-proration הוא over-engineering. שם checkout פשוט מספיק."
        commonMistakes="לשכוח שגם billing webhooks יכולים להישלח כפול (retry) — צריך אותה הגנת idempotency כמו בכל webhook אחר. טעות חמורה נוספת: לשמור מספרי כרטיס אשראי אצלך במקום לתת לספק לטפל בהם."
        cost="webhook-driven billing חוסך קריאות API מיותרות (לא צריך לשאול בכל בקשה) — משתלם בדיוק כמו prompt caching (מודול Monitoring). מנגד, לספק הסליקה יש עמלה (למשל ~2.9% + סנטים לעסקה) — עלות שמגלמת בתוכה את תאימות ה-PCI והסיכון שהוא נושא במקומך."
        security="לעולם אל תשמור מספר כרטיס אשראי גולמי, CVV או פרטי כרטיס מלאים אצלך — זה הכלל הראשון. הכרטיס נמסר ישירות מהדפדפן של הלקוח לספק הסליקה, והספק מחזיר לך טוקן שמייצג את אמצעי התשלום. אתה שומר רק את הטוקן. כך אתה יוצא כמעט לחלוטין מגבולות ה-PCI-DSS, ודליפת ה-DB שלך לא חושפת אף כרטיס. בנוסף: תמיד אמת את חתימת ה-webhook לפני שאתה סומך על תוכנו."
        realWorld="Stripe, Paddle, וכל ספק סליקה מוביל עובדים בדיוק כך — /api/webhooks/new-ticket שבנית הוא תרגול ישיר לאותה ארכיטקטורה. גם המדדים (MRR, churn) מגיעים לרוב מוכנים מלוח המחוונים של הספק."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות billing נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-danger">
            <ShieldOff size={16} /> מה שובר billing בפרודקשן
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>לשמור מספרי כרטיס גולמיים ב-DB — סיכון PCI עצום, ודליפה שחושפת כרטיסים של כל הלקוחות.</li>
            <li>אין idempotency ב-webhook — retry של הספק מחייב פעמיים או מזכה כפול.</li>
            <li>אין תהליך dunning — כרטיס שפג תוקף גורר ביטול מיידי, ואתה מאבד לקוח משלם על טעות טכנית.</li>
            <li>לחשב סטטוס מנוי ב-polling לכל בקשה — latency ותלות בזמינות Stripe.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>שומרים רק טוקן מהספק — מספר הכרטיס האמיתי לעולם לא נוגע בשרת שלך.</li>
            <li>מאמתים חתימת webhook ומריצים כל אירוע דרך מנגנון idempotency.</li>
            <li>מגדירים dunning: ניסיונות גבייה חוזרים + התראות + תקופת חסד לפני השעיה.</li>
            <li>מחזיקים subscription_status מקומי שמתעדכן מ-webhooks — קריאה מקומית מהירה בכל בקשה.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Tier / תוכנית", "מדרגת מנוי (Free/Pro/Enterprise) עם יכולות או מכסה שונות ומחיר שונה."],
          ["MRR / ARR", "הכנסה חוזרת חודשית / שנתית. הדופק של עסק SaaS — הכנסה צפויה שחוזרת."],
          ["Churn", "אחוז הלקוחות או ההכנסה שנוטש בכל תקופה. מדד מצטבר ופוגע ישירות ב-MRR."],
          ["Trial", "תקופת ניסיון לפני תשלום, שנועדה להביא את הלקוח לערך לפני החיוב."],
          ["Past due", "תשלום נכשל — לרוב עם תקופת חסד לפני השעיה."],
          ["Proration", "חיוב יחסי כשמשדרגים או משנמכים מנוי באמצע מחזור חיוב."],
          ["Dunning", "רצף אוטומטי של ניסיונות גבייה חוזרים והתראות לאחר תשלום שנכשל."],
          ["PCI-DSS", "תקן אבטחה לטיפול בכרטיסי אשראי. הסיבה שמשתמשים בספק סליקה במקום לשמור כרטיסים."],
          ["Token (תשלום)", "מזהה שמחזיר ספק הסליקה במקום מספר הכרטיס. אתה שומר אותו, לא את הכרטיס."],
          ["Webhook-driven billing", "עדכון סטטוס מנוי לפי אירועים מספק הסליקה, לא polling."],
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
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="saas-business-subscription-billing-concepts"
        title="תכנן שכבת billing ל-AtlasDesk בהשראת /api/webhooks/new-ticket"
        context="עבוד עם Claude Code על הריפו האמיתי של AtlasDesk. זו משימת תכנון ומפרט (design/spec) — התוצר הוא תכנון ומיפוי, לא מימוש מלא."
        steps={[
          "קראו יחד את app/api/webhooks/new-ticket/route.ts (מודול Automation) — שימו לב לאימות החתימה ול-idempotency.",
          "תכננו (בלי לממש) webhook דומה: /api/webhooks/billing-event שהיה מקבל אירועי 'תשלום הצליח' / 'תשלום נכשל' / 'מנוי בוטל' מספק סליקה היפותטי.",
          "מפו כל סוג אירוע לעדכון סטטוס: אילו שדות ב-DB (subscription_status, tier, past_due_since) מתעדכנים בכל מקרה? כללו את המעבר past_due → dunning → cancelled.",
          "החליטו על 3 מדרגות תמחור ל-AtlasDesk (Free/Pro/Enterprise) — מה המכסה בכל אחת, ומה יגרום למשתמש לשדרג.",
          "דיבוג/אבטחה: בקש מ-Claude Code לאתר בתכנון שלכם כל מקום שבו בטעות עלולים לשמור פרט כרטיס אשראי, ולוודא ששומרים אך ורק טוקן מהספק. הסבירו למה זה חשוב (PCI).",
        ]}
        successCriteria={[
          "יש לך תכנון webhook billing שמבוסס במפורש על הדפוס הקיים, כולל אימות חתימה ו-idempotency",
          "יש לך מיפוי ברור בין כל סוג אירוע לעדכון סטטוס, כולל מסלול dunning",
          "יש לך 3 מדרגות תמחור עם היגיון שדרוג",
          "ווידאת שהתכנון לא שומר שום פרט כרטיס גולמי — רק טוקן מהספק",
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
          <CreditCard size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>מנוי הוא <strong>מכונת-מצבים</strong> (trial → active → past_due → cancelled) שנשלטת באירועים.</li>
          <li>המדדים שקובעים: <strong>MRR/ARR</strong> (הכנסה חוזרת) ו-<strong>churn</strong> (נטישה מצטברת).</li>
          <li><strong>לעולם</strong> אל תשמור מספרי כרטיס — ספק הסליקה נושא ב-PCI ומחזיר לך טוקן.</li>
          <li>billing הוא אותו דפוס <strong>webhook</strong> שכבר בנית: אימות חתימה + idempotency.</li>
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
          קרא בקצרה על webhooks של Stripe (stripe.com/docs/webhooks) והשווה למה שבנית ב-
          /api/webhooks/new-ticket — כמה מהעקרונות זהים? שים לב במיוחד איך Stripe מתאר את אחסון
          אמצעי התשלום כטוקן, ולא כמספר כרטיס.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          הבנת עכשיו איך לקוח משלם ונשאר משלם. בשיעור הבא — אונבורדינג והפעלה — נחזור צעד אחורה
          ונשאל: איך בכלל מביאים לקוח חדש לראות ערך מספיק מהר כדי שירצה להגיע לשלב התשלום.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
