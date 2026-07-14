"use client";

import { ShieldCheck, Server, DollarSign, BookOpen, ListChecks, AlertTriangle, Gauge } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-launch",
  lessonSlug: "launch-readiness-checklist",
  title: "רשימת מוכנות להשקה",
  objectives: [
    "לבנות checklist השקה מלא ב-4 תחומים: טכני, אבטחה, עסקי, תיעוד — ולדעת מה כל תחום בודק",
    "להבין את ההבדל המהותי בין ’עובד’ ל’מוכן ללקוחות משלמים’, ולמה build ירוק הוא תנאי הכרחי אך לא מספיק",
    "לדרג את הפערים שנותרו ב-AtlasDesk לפי חומרה, ולזהות את 3 החוסמים הקריטיים לפני launch",
  ],
  estMinutes: 35,
  difficulty: "מתקדם",
  prerequisites: ["onboarding-and-activation"],
};

const SLIDES: Slide[] = [
  {
    title: "המודול האחרון: לפני שלוחצים ’launch’",
    bullets: [
      "לאורך כל האקדמיה, AtlasDesk נבנה עם משמעת הנדסית — כל תכונה אומתה ב-build, ב-typecheck ובבדיקה חיה. אבל ’מוכן טכנית’ ו’מוכן ללקוחות משלמים’ הם עדיין שני דברים שונים לחלוטין.",
      "השקה היא לא אירוע טכני — היא רגע שבו אנשים אמיתיים, עם כסף אמיתי, מתחילים להישען על המערכת שלך. ברגע הזה כל פער שהתעלמת ממנו הופך לתקלה מול לקוח.",
      "המדד הנכון אינו ’האם הקוד רץ’ אלא ’האם אני מוכן שמישהו שלא מכיר אותי ישלם, יסמוך, וייפגע אם משהו יישבר’.",
    ],
  },
  {
    title: "4 תחומי מוכנות — למה בדיוק ארבעה",
    bullets: [
      "טכני: יציבות, ביצועים, טיפול-בשגיאות, גיבוי. השאלה: האם המערכת מחזיקה מעמד תחת עומס וכישלון?",
      "אבטחה: auth, בידוד נתונים בין לקוחות, סודות, prompt injection. השאלה: מה קורה כשמישהו זדוני מנסה?",
      "עסקי: תמחור, billing מחובר בפועל, מכסות, תנאי שימוש. השאלה: האם יש כאן עסק בר-קיימא, לא רק קוד?",
      "תיעוד: onboarding, מדריך, מדיניות פרטיות, תמיכה. השאלה: האם משתמש חדש מצליח לבד, בלי שאתה לידו?",
    ],
  },
  {
    title: "מה כבר קיים ב-AtlasDesk, ומה עוד חסר",
    bullets: [
      "קיים: ניטור (Production AI), הגנת prompt injection, הגנת webhook, MVP מוגדר, אסטרטגיית תמחור על הנייר.",
      "חסר-קריטי: auth מלא (users/orgs עם בידוד נתונים), monitoring persistent ב-DB (כרגע in-memory — נמחק בכל reboot), billing מחובר בפועל (לא רק תוכנית).",
      "פער נסתר מסוכן: תוכנית תמחור שקיימת רק במסמך אינה billing. ’עובד בהדגמה’ אינו ’עובד כשלקוח מס’ 200 לא שילם’.",
    ],
  },
];

const GATE_STEPS: DiagramStep[] = [
  {
    icon: Server,
    label: "שער 1 — טכני",
    detail: "יציבות תחת עומס, טיפול-בשגיאות בכל endpoint, גיבוי ושחזור, יעדי latency ריאליים. build ירוק הוא רק הכניסה לשער הזה, לא היציאה ממנו.",
  },
  {
    icon: ShieldCheck,
    label: "שער 2 — אבטחה",
    detail: "auth אמיתי, בידוד נתונים בין arganizations, ניהול סודות, הגנת injection ו-webhook. פער כאן אינו באג — הוא דליפת מידע של לקוח.",
  },
  {
    icon: DollarSign,
    label: "שער 3 — עסקי",
    detail: "billing שמחייב בפועל, מכסות ואכיפה, תמחור שמכסה עלות-הטוקנים, תנאי שימוש. בלי זה יש הדגמה יפה, לא עסק.",
  },
  {
    icon: BookOpen,
    label: "שער 4 — תיעוד",
    detail: "onboarding שמצליח לבד, מדריך, מדיניות פרטיות, ערוץ תמיכה. משתמש שתקוע ואין לו למי לפנות — עוזב ולא חוזר.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה ’עובד ב-build ו-typecheck’ לא מספיק כדי להגיד ש-AtlasDesk ’מוכן להשקה’?",
    options: [
      "זה כן מספיק, אין שום דבר נוסף לבדוק",
      "כי מוכנות להשקה כוללת גם תחומים ש-build/typecheck לא בודקים כלל: אבטחה בפועל, יעדי SLA ריאליים, מודל עסקי (תמחור/billing), ותיעוד למשתמש חדש",
      "כי build תמיד נכשל בסביבת production",
      "כי typecheck לא רלוונטי לקוד JavaScript",
    ],
    correctIndex: 1,
    explanation:
      "build/typecheck בודקים תקינות קוד — לא בודקים אם המערכת מאובטחת, אם יש מודל עסקי בר-קיימא, או אם משתמש חדש יודע איך להתחיל. מוכנות היא רב-ממדית; טכני הוא רק שער אחד מתוך ארבעה.",
    optionNotes: [
      "לא נכון: יש הרבה מעבר לזה — build ירוק הוא תנאי הכרחי אבל לא מספיק. הוא מבטיח שהקוד מתקמפל, לא שהמוצר מוכן.",
      "התשובה הנכונה: מוכנות להשקה היא רב-ממדית — טכני הוא רק מימד אחד. אבטחה, עסקי ותיעוד אינם נבדקים על ידי הקומפיילר.",
      "לא נכון: build לא ’נכשל תמיד’ בפרודקשן — זו לא הסיבה שהוא לא מספיק כמדד יחיד.",
      "לא נכון: typecheck רלוונטי מאוד ל-TypeScript (מה שהפרויקט משתמש בו) — זו לא הסיבה שהוא לא מספיק לבד.",
    ],
  },
  {
    id: "q2",
    question: "ניטור AtlasDesk כרגע שומר מדדים ב-in-memory (בזיכרון התהליך). למה זה פער קריטי להשקה, ולא רק שיפור נחמד?",
    options: [
      "זה לא באמת פער — in-memory מהיר יותר וזה מספיק",
      "כי בכל reboot / deploy / crash כל היסטוריית הניטור נמחקת — כך שבדיוק ברגע שבו משהו נשבר בפרודקשן, אין לך את הנתונים לחקור מה קרה",
      "כי in-memory צורך יותר מדי RAM מכל דבר אחר",
      "כי ניטור לא נחוץ בכלל אחרי שהמערכת עלתה",
    ],
    correctIndex: 1,
    explanation:
      "ניטור קיים בשביל הרגע שבו משהו משתבש. אם המדדים חיים רק בזיכרון התהליך, אז crash — האירוע שהכי חשוב לחקור — גם מוחק את הראיות. ניטור production חייב להיות persistent (DB/שירות חיצוני) כדי לשרוד את מה שהוא אמור לתעד.",
    optionNotes: [
      "לא נכון: מהירות אינה השאלה כאן. הבעיה היא איבוד הנתונים בדיוק כשצריך אותם.",
      "התשובה הנכונה: persistence הוא העיקר — ניטור שנמחק ב-crash לא עוזר לחקור את אותו crash.",
      "לא נכון: צריכת RAM אינה הסיבה המרכזית; גם אם הייתה זולה, איבוד הנתונים ב-reboot נשאר.",
      "לא נכון: ניטור נחוץ במיוחד אחרי עלייה לאוויר — זה בדיוק כשלקוחות אמיתיים נפגעים מתקלות.",
    ],
  },
  {
    id: "q3",
    question: "בדירוג פערים לפני השקה, איזה פער נכון לסמן ’קריטי’ (חוסם launch) ולא ’נחמד-שיהיה’?",
    options: [
      "עיצוב יפה יותר לדף הנחיתה",
      "בידוד נתונים בין לקוחות (org isolation) — בלעדיו לקוח אחד יכול לראות נתונים של לקוח אחר",
      "תמיכה ב-dark mode",
      "לוגו באיכות גבוהה יותר",
    ],
    correctIndex: 1,
    explanation:
      "קריטריון החומרה הוא: ’מה קורה אם משיקים בלי זה?’. בלי בידוד נתונים, לקוח אחד עלול לחשוף מידע של לקוח אחר — כשל אבטחה ואמון שאי אפשר לתקן בדיעבד. עיצוב, dark mode ולוגו הם שיפורים אמיתיים אך אינם חוסמים השקה.",
    optionNotes: [
      "לא נכון: עיצוב משפר חוויה אבל אינו חוסם השקה — אפשר לשפר אחרי.",
      "התשובה הנכונה: בידוד נתונים הוא כשל אבטחה/פרטיות. פער כזה שמתגלה אחרי השקה שורף אמון בלתי-הפיך.",
      "לא נכון: dark mode הוא נחמד-שיהיה קלאסי, לא חוסם.",
      "לא נכון: איכות לוגו היא ליטוש, לא מוכנות מהותית.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: 4 תחומי מוכנות להשקה", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "gates",
    label: "ארבעת שערי המוכנות — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          חשוב על השקה כרצף שערים. מוצר לא ’מוכן’ עד שהוא עובר את כולם — לא רק את הראשון.
          ברוב הפרויקטים השער הטכני נראה ירוק מוקדם, ומסתירים אחריו שלושה שערים שעדיין אדומים:
        </p>
        <StepDiagram steps={GATE_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "’עובד’ מול ’מוכן ללקוחות משלמים’",
    content: (
      <PromptComparisonLab
        title="אותה מערכת, שתי הגדרות של ’מוכן’"
        unitLabel="הגדרת מוכנות"
        bad={{
          label: "’עובד’ — מוכנות מדומה",
          content:
            "build ירוק ✅, typecheck נקי ✅, הדגמה רצה יפה למשתמש-בודק אחד.\nניטור בזיכרון, אין auth אמיתי, billing רק על הנייר, אין onboarding.\nהמסקנה שהוסקה: ’אפשר להשיק’.",
          outcome:
            "בפרודקשן: לקוח שני נרשם ורואה נתונים של לקוח ראשון; crash מוחק את כל הניטור; אף אחד לא מחויב בפועל. ’עבד בהדגמה’ קרס מול מציאות.",
        }}
        good={{
          label: "’מוכן’ — מוכנות אמיתית",
          content:
            "כל 4 השערים נבדקו במפורש. פערים דורגו לפי חומרה.\n3 חוסמים קריטיים (auth+בידוד, ניטור persistent, billing מחובר) נסגרו לפני launch.\nנחמד-שיהיה (dark mode, ליטוש עיצוב) נדחה במודע לאחרי.",
          outcome:
            "בפרודקשן: כל לקוח רואה רק את הנתונים שלו; תקלה נחקרת מלוגים ששרדו; חיוב עובד. משיקים ליודעים בדיוק מה עוד פתוח — ומה מודע-ומקובל.",
        }}
        takeaway="ההבדל אינו כמות עבודה — הוא שיפוט. ’מוכן’ פירושו שדירגת כל פער לפי חומרה, סגרת את החוסמים, ודחית את הליטוש במודע. השקה ללא הדירוג הזה היא הימור, לא החלטה."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="checklist השקה מקיף קיים כי אף תחום בודד (טכני/עסקי/אבטחה/תיעוד) לא מספיק לבד — מוצר יכול להיות מושלם טכנית ועדיין להיכשל בגלל תיעוד גרוע, מודל עסקי לא בר-קיימא, או דליפת נתונים בין לקוחות."
        alternatives="להשיק ’כשזה עובד’ בלי checklist מסודר — עובד לפעמים, אבל מסתכן בפספוס פער קריטי (auth חסר, ניטור נדיף) שמתגלה רק אחרי שכבר יש לקוחות אמיתיים שנפגעים — הרגע היקר ביותר לגלות בו באג."
        whenNotTo="לפרויקט-צעצוע פנימי, prototype להדגמה, או כלי אישי בלי משתמשים חיצוניים — checklist השקה מלא הוא over-engineering. הדרישה מתעוררת ברגע שאדם שאינך מכיר נשען על המערכת."
        commonMistakes="להתמקד רק בתחום אחד (בדרך כלל הטכני, כי הוא הכי מוחשי) ולהזניח את השאר; לבלבל ’תוכנית תמחור במסמך’ עם ’billing מחובר’; לדרג הכל ’קריטי’ ובכך לאבד את היכולת להחליט מה באמת חוסם."
        performance="קבע יעדי latency ו-uptime ריאליים לפני השקה, ומדוד מולם — לא ’מהר מספיק בהדגמה’. יעד שלא נמדד אינו יעד. ניטור persistent הוא מה שמאפשר לדעת אם עמדת ביעד תחת עומס אמיתי."
        cost="checklist מקיף עולה זמן בדיקה לפני השקה — זול בהרבה מגילוי פער קריטי אחרי שלקוחות תלויים במוצר. שקלול נוסף: תמחור שלא מכסה את עלות-הטוקנים לכל בקשה הופך כל לקוח חדש להפסד גדל."
        security="שער האבטחה הוא לרוב הפער הכי מוזנח והכי יקר: בלי auth אמיתי ובידוד נתונים בין organizations, השקה אחת עלולה לחשוף מידע של לקוח אחד לאחר. פער אבטחה שמתגלה אחרי launch שורף אמון בלתי-הפיך."
        maintenance="checklist השקה אינו מסמך חד-פעמי — הוא מתחזק כ-runbook: כל launch עתידי (גרסה, פיצ’ר גדול) עובר עליו מחדש. תעד למה כל פער דורג כפי שדורג, כדי שההחלטות יהיו ניתנות-לביקורת בעתיד."
        realWorld="זה בדיוק התהליך שכל startup עובר לפני launch — לא ’הקוד עובד’, אלא בדיקה הוליסטית של כל מה שצריך כדי לשרת לקוחות אמיתיים. חברות בוגרות מכנות זאת ’launch readiness review’ ולא משיקות בלעדיו."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר השקות בפרודקשן",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-danger">
            <AlertTriangle size={16} /> מה שובר השקות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מודדים רק את השער הטכני (”build ירוק, אז מוכן”) ומתעלמים משלושת השערים האחרים.</li>
            <li>מבלבלים ”תמחור על הנייר” עם billing מחובר — אף אחד לא מחויב בפועל.</li>
            <li>ניטור in-memory שנמחק בכל reboot — אין ראיות בדיוק כשמשהו נשבר.</li>
            <li>אין auth/בידוד נתונים — לקוח אחד רואה מידע של לקוח אחר.</li>
            <li>מדרגים הכל ”קריטי”, ואז אי אפשר להחליט מה באמת חוסם launch.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <ListChecks size={16} /> איך מקצוענים משיקים
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>עוברים במפורש על כל 4 השערים, כל אחד עם רשימת פריטים ✅/⬜.</li>
            <li>מדרגים כל פער חסר לפי חומרה: חוסם-launch מול נחמד-שיהיה.</li>
            <li>סוגרים את החוסמים הקריטיים, ודוחים ליטוש במודע — ומתעדים למה.</li>
            <li>מוודאים billing, auth ובידוד נתונים בפועל, לא בהנחה.</li>
            <li>מפעילים ניטור persistent לפני launch, לא אחרי התקלה הראשונה.</li>
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
        id="saas-launch-launch-readiness-checklist"
        title="בנה checklist השקה מלא ל-AtlasDesk וזהה 3 הפערים הקריטיים"
        context="עבוד עם Claude Code על הריפו האמיתי של AtlasDesk, על סמך כל מה שנבנה לאורך האקדמיה כולה. אל תנחש סטטוס — בקש מ-Claude Code לאמת כל פריט מול הקוד בפועל."
        steps={[
          "בקשו מ-Claude Code לסרוק את הריפו ולבנות checklist עם 4 קטגוריות (טכני, אבטחה, עסקי, תיעוד), ולכל אחת לרשום מה כבר קיים (✅) ומה חסר (⬜) — כשכל סטטוס מגובה בהפניה לקוד, לא בניחוש.",
          "לכל פריט חסר, בקשו דירוג חומרה לפי הקריטריון ’מה קורה אם משיקים בלי זה?’: חוסם-launch (למשל בידוד נתונים) מול נחמד-שיהיה (למשל dark mode).",
          "אתגרו את הדירוג: בקשו מ-Claude Code ’עשה advocate נגד’ — לנמק למה כל פריט ’קריטי’ אולי בעצם לא, ולהיפך. שיפוט טוב עומד בביקורת.",
          "צעד דיבוג: פתחו את קוד הניטור בפועל וודאו האם המדדים persistent או in-memory. אם in-memory — זהו זאת כפער קריטי מגובה-ראיות, לא כהשערה.",
          "כתבו את 3 הפערים הקריטיים ביותר, מדורגים ומנומקים, כתוכנית סגירה לפני launch אמיתי.",
        ]}
        successCriteria={[
          "יש לך checklist מלא ב-4 תחומים עם סטטוס אמיתי מגובה-קוד לכל פריט (לא ניחוש)",
          "כל פער חסר מדורג לפי חומרה עם נימוק שעומד בביקורת נגדית",
          "יש לך 3 פערים קריטיים מדורגים ומנומקים, ואתה יכול להגן על הדירוג",
          "אימתת בפועל (לא בהנחה) האם הניטור persistent או נדיף",
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
          ["Launch Readiness", "בדיקה הוליסטית ב-4 תחומים (טכני/אבטחה/עסקי/תיעוד) של האם מוצר מוכן ללקוחות אמיתיים — לא רק אם הקוד מתקמפל."],
          ["Org Isolation", "בידוד נתונים בין ארגונים/לקוחות: לקוח אחד לא יכול לראות או לגעת בנתונים של לקוח אחר. חובת-אבטחה בסיסית ל-SaaS."],
          ["Persistent Monitoring", "ניטור ששומר מדדים בזיכרון קבוע (DB/שירות) ולא בזיכרון התהליך — כך שנתונים שורדים crash ו-reboot."],
          ["Billing מחובר", "מנגנון חיוב שמחייב לקוחות בפועל ואוכף מכסות — להבדיל מ’תוכנית תמחור’ שקיימת רק במסמך."],
          ["חומרת פער", "דירוג פער לפי ’מה קורה אם משיקים בלעדיו’: חוסם-launch מול נחמד-שיהיה. הבסיס להחלטת השקה."],
          ["SLA", "יעד שירות מדיד (latency/uptime) שמתחייבים אליו ומודדים מולו — לא ’מהר מספיק בהדגמה’."],
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
          <Gauge size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>מוכנות היא <strong>רב-ממדית</strong>: 4 שערים — טכני, אבטחה, עסקי, תיעוד. build ירוק פותח רק את הראשון.</li>
          <li>’עובד’ ≠ ’מוכן’. ההבדל הוא <strong>שיפוט</strong>: דירוג פערים לפי חומרה, לא כמות עבודה.</li>
          <li>סגור <strong>חוסמים קריטיים</strong> (auth+בידוד, ניטור persistent, billing מחובר); דחה ליטוש במודע.</li>
          <li>אמת כל פריט <strong>מול הקוד</strong>, לא מהזיכרון. ’תמחור על הנייר’ אינו billing.</li>
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
          חפש checklist השקה פומבי של חברת SaaS (יש כמה בלוגים טכניים מוכרים). כמה מהקטגוריות
          חופפות ל-4 השערים שבנית כאן? מצא לפחות פריט אחד שהם בודקים ואתה לא חשבת עליו — והוסף אותו ל-checklist של AtlasDesk.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          עכשיו כשיש לך תמונה חדה של מה מוכן ומה חסר — השיעור הבא הוא הקפסטון הסופי של האקדמיה כולה:
          נחבר את כל המסע, מ-system prompt בודד ועד מוצר AI שלם, ונזקק מה בדיוק הפך אותך למהנדס AI.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
