"use client";

import { Activity, Target, FileSignature, Gauge, TrendingDown, ShieldOff, Timer, Ban } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "production-best-practices",
  lessonSlug: "sla-reliability-targets",
  title: "SLA ויעדי אמינות",
  objectives: [
    "להבין SLI/SLO/SLA כשפה משותפת ומדידה לתיאור אמינות — ולא כמילים נרדפות",
    "לקבוע יעדי אמינות ריאליים למערכת AI: זמינות, latency באחוזונים (p50/p95/p99), ושיעור הצלחה",
    "להבין למה 100% הוא היעד הלא-נכון, ומהו error budget ואיך הוא הופך אמינות להחלטה עסקית",
    "לתכנן graceful degradation ו-fallbacks כשהמודל איטי או לא-זמין — כמו שהאקדמיה עצמה עובדת גם בלי מפתח",
  ],
  estMinutes: 35,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: הקשחת AtlasDesk מפני Prompt Injection"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה זה פותר: 'אמינה' היא לא מספר",
    bullets: [
      "כשלקוח שואל ”המערכת אמינה?” — בלי הגדרה מדידה, כל אחד עונה תשובה אחרת. מהנדס אומר ”כן”, המשתמש חווה נפילות, ואף אחד לא צודק כי אין קנה-מידה משותף.",
      "SLI/SLO/SLA הן השפה שהופכת ”אמינות” ממושג רגשי למספר שאפשר לתכנן, למדוד, ולהתחייב עליו — או לגלות שלא עומדים בו לפני שהלקוח מגלה.",
      "זה המודול האחרון: כאן אנחנו לוקחים את AtlasDesk (RAG, סוכן, ניטור, אבטחה) והופכים אותו ממשהו ש”עובד אצלי” למשהו עם חוזה אמינות מוגדר.",
    ],
  },
  {
    title: "שלוש מילים, שלוש רמות — SLI ⊂ SLO ⊂ SLA",
    bullets: [
      "SLI (Indicator) — המדד בפועל. מה קרה. דוגמה: ”97.3% מהבקשות ב-24 השעות האחרונות הסתיימו תוך 5 שניות”.",
      "SLO (Objective) — היעד הפנימי. מה אנחנו רוצים שיקרה. דוגמה: ”95% מהבקשות תוך 5 שניות”. זה הקו שמעליו הצוות רגוע ומתחתיו נכנס לפעולה.",
      "SLA (Agreement) — ההבטחה החוזית ללקוח, עם השלכה כספית. דוגמה: ”אם הזמינות החודשית נופלת מ-99.5% — 10% החזר”. תמיד רופף יותר מה-SLO, כדי שנתריע לעצמנו לפני שנפר חוזה.",
    ],
  },
  {
    title: "יעדים ייחודיים למערכת AI",
    bullets: [
      "לא רק uptime. מערכת AI צריכה גם: latency (זמן תגובה — והוא משתנה מאוד, לכן מודדים באחוזונים), tool-call success (כמה קריאות-כלים של הסוכן הצליחו), ו-grounding rate (כמה תשובות RAG כללו ציטוט מקור תקף במקום המצאה).",
      "המדד הכי חשוב שאין למערכות רגילות: ”correctness” — תשובה יכולה לחזור מהר, עם 200 OK, ולהיות שגויה לחלוטין. זמינות טכנית ≠ תשובה נכונה.",
      "AtlasDesk כבר אוסף חלק מהמדדים (מודול Monitoring, /api/atlasdesk/stats) — עכשיו קובעים יעד ריאלי לכל אחד.",
    ],
  },
];

const RELIABILITY_STEPS: DiagramStep[] = [
  {
    icon: Activity,
    label: "SLI — מודדים",
    detail: "בוחרים מדד אחד וברור וסופרים אותו בפועל: אחוז בקשות שהצליחו, p95 של latency, אחוז תשובות עם ציטוט. אם אי אפשר למדוד — זה לא SLI.",
  },
  {
    icon: Target,
    label: "SLO — מכוונים",
    detail: "קובעים יעד פנימי מבוסס-נתונים (למשל 99%). המשלים ל-100% הוא ה-error budget — כמה כישלון מותר לפני שעוצרים פיצ'רים חדשים ומטפלים ביציבות.",
  },
  {
    icon: FileSignature,
    label: "SLA — מתחייבים",
    detail: "רק אם צריך: הבטחה חוזית עם פיצוי כספי. תמיד רופפת יותר מה-SLO. לרוב הפרויקטים (כולל AtlasDesk הלימודי) — אין SLA, רק SLO פנימי.",
  },
  {
    icon: ShieldOff,
    label: "Degrade — שורדים",
    detail: "כשה-SLI צולל (המודל איטי/נפל): לא קורסים. חוזרים לתשובת fallback, cache, או מצב מוגבל. המערכת נשארת שימושית גם כשה-AI לא זמין.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין SLI, SLO, ו-SLA?",
    options: [
      "אין הבדל, שלושתם מתארים את אותו דבר",
      "SLI הוא המדד בפועל (מה שקורה), SLO הוא היעד הפנימי (מה שרוצים שיקרה), SLA הוא ההבטחה החוזית ללקוח (מה שמובטח, עם פיצוי)",
      "SLA הוא היחיד שרלוונטי למערכות AI",
      "SLI נמדד רק פעם בשנה",
    ],
    correctIndex: 1,
    explanation:
      "שלושת המונחים בונים זה על זה: מודדים (SLI), קובעים יעד פנימי (SLO), ולפעמים מתחייבים כלפי חוץ (SLA). ה-SLA תמיד רופף יותר מה-SLO בכוונה — כדי שנתריע לעצמנו הרבה לפני שנפר את החוזה.",
    optionNotes: [
      "שגוי: יש הבדל מהותי בין מדידה, יעד פנימי, והתחייבות חיצונית — הם ברמות שונות.",
      "נכון: זו בדיוק ההיררכיה — SLI מודד, SLO מכוון, SLA מתחייב כלפי חוץ עם השלכה כספית.",
      "שגוי: כל שלושת המונחים רלוונטיים למערכות AI. לרוב המערכות יש SLO פנימי בלי SLA חיצוני כלל.",
      "שגוי: SLI נמדד ברציפות (בזמן אמת או תדיר) — זה כל הרעיון, למדוד את המצב הנוכחי.",
    ],
  },
  {
    id: "q2",
    question: "למה 100% זמינות הוא היעד הלא-נכון כמעט תמיד?",
    options: [
      "כי אי אפשר לכתוב קוד מספיק טוב",
      "כי המחיר של כל 'תשע' נוסף גדל אקספוננציאלית, כי אתה תלוי בשירותים חיצוניים (Claude API) שלא בשליטתך, ובלי error budget אי אפשר לשחרר שום שינוי חדש",
      "כי 100% זה בלתי-חוקי בחוזי SLA",
      "כי לקוחות בכלל לא רוצים אמינות גבוהה",
    ],
    correctIndex: 1,
    explanation:
      "המעבר מ-99% ל-99.9% ל-99.99% מכפיל את המורכבות וההשקעה בכל צעד (redundancy, retries, fallbacks, on-call), בעוד המשתמש בקושי מרגיש. חשוב מכך: אתה תלוי ב-Claude API, ב-Vercel, ברשת — אף אחד מהם לא מבטיח 100%, אז גם אתה לא יכול. וה-error budget (המרווח מתחת ל-100%) הוא מה שמתיר לך בכלל לשחרר פיצ'רים — בלעדיו כל שינוי הוא הימור אסור.",
    optionNotes: [
      "שגוי: זה לא עניין של איכות קוד — אפילו קוד מושלם תלוי ברשת ובספקים חיצוניים שנופלים.",
      "נכון: העלות של כל 'תשע' אקספוננציאלית, יש תלות חיצונית שלא בשליטתך, ו-error budget=0 חוסם כל שחרור.",
      "שגוי: אין איסור חוקי — פשוט אף ספק שפוי לא מתחייב ל-100% כי זה בלתי-אפשרי לקיים.",
      "שגוי: לקוחות רוצים אמינות גבוהה, אבל 99.9% מרגיש כמעט זהה ל-100% במחיר נמוך בהרבה.",
    ],
  },
  {
    id: "q3",
    question: "למה מודדים latency ב-p95/p99 ולא רק בממוצע?",
    options: [
      "כי הממוצע קשה לחישוב",
      "כי הממוצע מסתיר את הזנב הארוך: אפשר שממוצע התגובה 800ms מצוין, אבל 5% מהמשתמשים ממתינים 12 שניות — והאחוזון p95 חושף בדיוק את החוויה הגרועה שהממוצע מחביא",
      "כי p99 תמיד שווה לממוצע",
      "כי ממוצע לא עובד על מספרים גדולים",
    ],
    correctIndex: 1,
    explanation:
      "latency של LLM הוא מאוד 'זנבי' — רוב הבקשות מהירות, אבל מיעוט (בקשות ארוכות, עומס, retries) איטי בהרבה. הממוצע נשלט ע”י הרוב המהיר ומחביא את הסבל של המיעוט. p95 אומר ”95% מהמשתמשים חוו זמן זה או טוב יותר”, ו-p99 חושף את 1% הגרוע ביותר — שם מסתתרות תלונות הלקוחות. SLO רציני נכתב על אחוזון, לא על ממוצע.",
    optionNotes: [
      "שגוי: הממוצע קל מאוד לחישוב — הבעיה היא מה שהוא מסתיר, לא הקושי.",
      "נכון: האחוזונים חושפים את הזנב הארוך — החוויה הגרועה של המיעוט שהממוצע מטשטש.",
      "שגוי: p99 כמעט תמיד גבוה בהרבה מהממוצע במערכות LLM — זה בדיוק הפער שמחפשים.",
      "שגוי: ממוצע עובד מתמטית על כל גודל — זו לא הסיבה. הסיבה היא רגישות לזנב.",
    ],
  },
  {
    id: "q4",
    question: "המודל (Claude API) איטי מהרגיל בפתאומיות. מה הגישה ההנדסית הנכונה כדי לא לשבור את חוויית המשתמש?",
    options: [
      "לחכות עד שהמודל יענה, כמה זמן שייקח — נכון תמיד להחזיר תשובת AI",
      "graceful degradation: timeout סביר, ואז fallback — cache, תשובת ברירת-מחדל, או מצב מוגבל — כך שהמערכת נשארת שימושית גם כשה-AI איטי/נפל",
      "להחזיר שגיאה 500 ולתת למשתמש לנסות שוב",
      "לעבור מיד לספק מודל אחר בכל בקשה",
    ],
    correctIndex: 1,
    explanation:
      "עיצוב production מניח שהתלות החיצונית תיכשל מתישהו. graceful degradation אומר: קבע timeout, וכשעוברים אותו — אל תקרוס. הגש תשובת fallback (תבנית, cache של שאלה דומה, או הודעה כנה ”אני איטי כרגע, הנה מה שאפשר”). דוגמה חיה: מנוע ה-AI של האקדמיה הזו עובד גם בלי מפתח API — הוא נופל בחן לתוכן סטטי במקום להציג מסך שבור. זה בדיוק העיקרון.",
    optionNotes: [
      "שגוי: המתנה בלתי-מוגבלת מקפיאה את המשתמש ומבזבזת משאבים — timeout הוא חובה.",
      "נכון: timeout + fallback שומרים על מערכת שימושית. זה עיקרון ה-graceful degradation.",
      "שגוי: 500 חשוף למשתמש הוא כישלון של חוויה. עדיף fallback מנומס מאשר מסך שגיאה.",
      "שגוי: החלפת ספק בכל בקשה מוסיפה מורכבות, עלות ולטנסי — fallback מקומי מהיר ופשוט יותר לרוב המקרים.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: שפת האמינות המשותפת", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "ארבעת השלבים: למדוד, לכוון, להתחייב, לשרוד",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          אמינות היא לא מתג — היא תהליך של ארבעה שלבים. עבור עליהם לפי הסדר. שים לב שהשלב האחרון
          (degrade) הוא מה שמפריד בין מערכת ”נופלת” למערכת ”שורדת” כשהמודל לא זמין:
        </p>
        <StepDiagram steps={RELIABILITY_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: יעד אמינות לא-ריאלי מול ריאלי",
    content: (
      <PromptComparisonLab
        title="קביעת SLO ל-AtlasDesk"
        unitLabel="גישת יעד"
        bad={{
          label: "יעד לא-ריאלי ('100% תמיד')",
          content: `SLO: "100% מהבקשות מצליחות, תמיד, ללא יוצא מהכלל.
אפס נפילות. כל תשובה תוך 2 שניות."`,
          outcome:
            "בלתי-אפשרי בפועל: Claude API עצמו יכול להיות איטי/לא-זמין (תלות חיצונית שלא בשליטתך). error budget=0 אומר שאסור לשחרר שום פיצ'ר חדש. היעד מבטיח כישלון תמידי במדידה — ובפועל פשוט יתעלמו ממנו.",
        }}
        good={{
          label: "יעד ריאלי מבוסס-נתונים ואחוזונים",
          content: `SLO: "99% מהבקשות מסתיימות תוך 5 שניות (p99),
p95 latency < 3 שניות, 95% מתשובות ה-RAG כוללות
ציטוט מקור תקף" — מבוסס נתוני /api/atlasdesk/stats
בפועל. error budget: 1% מהבקשות/חודש רשאיות להיכשל.`,
          outcome:
            "יעד מדיד, ריאלי, מבוסס נתונים ואחוזונים אמיתיים. אפשר לדעת אם עומדים בו, ה-error budget מתיר לשחרר פיצ'רים בביטחון, וכשהתקציב נגמר — יודעים לעצור ולייצב.",
        }}
        takeaway="SLO טוב הוא ריאלי, מדיד, ומנוסח באחוזונים — לא שאיפה מושלמת. תלות בשירות חיצוני (Claude API) אומרת שאתה שואף ליעד גבוה וסביר, לא ל-100%. ה-error budget הוא מה שהופך את היעד מחלום להחלטה עסקית."
      />
    ),
  },
  {
    id: "error-budget",
    label: "Error Budget: המרווח שמתיר לך לחדש",
    content: (
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Gauge size={16} /> מה זה
          </p>
          <p className="text-sm text-muted">
            אם ה-SLO הוא 99%, ה-error budget הוא ה-1% שמותר לך ”לשרוף” — בחודש עם מיליון בקשות,
            זה 10,000 בקשות שרשאיות להיכשל בלי שהפרת יעד.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Timer size={16} /> למה הוא מבריק
          </p>
          <p className="text-sm text-muted">
            הוא הופך את המתח בין ”שחרר מהר” ל”שמור יציב” לכלל אחד: יש תקציב? מותר להעז ולשחרר.
            נגמר התקציב? עוצרים פיצ'רים ומתקנים יציבות. אין ויכוחים — יש מספר.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <TrendingDown size={16} /> הקשר ל-100%
          </p>
          <p className="text-sm text-muted">
            יעד 100% פירושו error budget אפס — כלומר אסור לשחרר לעולם שום דבר, כי כל שינוי מסכן.
            זו הסיבה העמוקה ש-100% הוא יעד שמשתק, לא יעד שמשרת.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="SLA/SLO/SLI קיימים כי 'אמינות' היא מושג מעורפל בלי הגדרה מדידה. השפה הזו הופכת אותו למשהו שאפשר לתכנן, לעקוב אחריו, ולהחליט לגביו — במקום ויכוח על תחושות."
        alternatives="לעבוד בלי יעדים מוגדרים ('נעשה כמה שיותר טוב') — עובד לפרויקט קטן, אבל אין דרך לדעת אם המערכת 'מספיק אמינה' בלי יעד להשוואה, ואין קריטריון אובייקטיבי מתי לעצור פיצ'רים ולתקן יציבות."
        whenNotTo="לפרויקט לימודי/דמו (כמו AtlasDesk הנוכחי) — SLA פורמלי עם פיצוי כספי הוא overhead מיותר. מספיק SLO פנימי לא-פורמלי כדי לדעת אם המערכת בכיוון."
        commonMistakes="לקבוע יעד לא-ריאלי (100%) שמבטיח כישלון במדידה; למדוד latency בממוצע ולהחביא את ה-p99 הגרוע; לשכוח graceful degradation ולתת לכל תקלה ב-Claude API להפיל את כל המערכת."
        performance="מדידה באחוזונים (p50/p95/p99) חושפת את הזנב הארוך שממוצע מסתיר. timeout + fallback מונעים מבקשה איטית אחת להקפיא thread ולגרור את כל השאר איתה."
        cost="כל 'תשע' נוסף (99%→99.9%→99.99%) מכפיל מורכבות ועלות (redundancy, retries, on-call) בעוד המשתמש בקושי מרגיש. יעד AMBITIOUS מדי בלי הצדקה עסקית הוא בזבוז ישיר של זמן הנדסה."
        security="ניטור זמינות הוא גם ניטור אבטחה: קפיצה פתאומית בשיעור הכישלונות או ב-latency יכולה להיות סימן ל-DoS או ל-prompt injection שמכריח את הסוכן ללולאות — ה-SLI חושף את זה מוקדם."
        maintenance="SLO צריך לחיות עם המערכת: מודל חדש, prompt חדש או עומס חדש משנים את הבסיס. בודקים מחדש כל רבעון שהיעד עדיין ריאלי — יעד מאובן שאף אחד לא מכבד גרוע מאין-יעד."
        realWorld="האקדמיה הזו היא דוגמה חיה ל-graceful degradation: מנוע ה-AI שלה עובד גם בלי מפתח API — נופל בחן לתוכן סטטי במקום מסך שבור. בפרויקט המסכם תגדיר runbook תקריות + יעדי SLA ריאליים ל-AtlasDesk באותה רוח."
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
            <Ban size={16} /> מה שובר מערכות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>יעד ”100% uptime” — נשמע מרשים, בלתי-בר-מדידה, וכולם מתעלמים ממנו תוך שבוע.</li>
            <li>מדידת latency בממוצע בלבד — ה-p99 של 14 שניות נשאר בלתי-נראה עד שהלקוחות נוטשים.</li>
            <li>אין timeout על קריאת המודל — בקשה תקועה אחת מקפיאה משתמש ותופסת משאבים.</li>
            <li>כל תקלה ב-Claude API מפילה את כל המסך — אין fallback, המשתמש רואה שגיאה גולמית.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <Target size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מגדירים SLO ריאלי מבוסס-נתונים (99%, לא 100%) עם error budget מפורש.</li>
            <li>מנסחים latency באחוזונים (p95/p99) ומנטרים אותם, לא רק את הממוצע.</li>
            <li>קובעים timeout סביר לכל קריאת מודל, ומטפלים בחריגה במקום להיתקע.</li>
            <li>בונים graceful degradation: cache/תבנית/מצב-מוגבל כשה-AI לא זמין — המערכת נשארת שימושית.</li>
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
        id="production-best-practices-sla-reliability-targets"
        title="קבע SLO ריאלי + fallback ל-AtlasDesk"
        context="עבוד עם /api/atlasdesk/stats (מודול Monitoring) על AtlasDesk האמיתי, יחד עם Claude Code."
        steps={[
          "בדוק את הנתונים הקיימים ב-/api/atlasdesk/stats — latency ממוצע, וחשוב יותר: אם יש נתוני p95/p99, ואם אין — בקש מ-Claude Code להוסיף מדידת אחוזונים.",
          "עם Claude Code, קבע 3 יעדי SLO ריאליים (latency ב-p95, שיעור הצלחה, שיעור grounding) מבוססים על מה שנמדד בפועל — לא ניחוש.",
          "חשב את ה-error budget של כל יעד: אם ה-SLO הוא 99%, כמה בקשות רשאיות להיכשל בחודש? מה תעשה כשהתקציב נגמר?",
          "הוסף graceful degradation: בקש מ-Claude Code לעטוף את קריאת המודל ב-timeout + fallback (תשובת ברירת-מחדל או הודעה מנומסת) — כך שכשה-API איטי/נפל, AtlasDesk לא קורס.",
          "דון: מה היה קורה אם היית מגדיר יעד שאפתני מדי (99.99%)? מה זה היה דורש הנדסית, וכמה זה היה עולה?",
        ]}
        successCriteria={[
          "יש לך 3 יעדי SLO מבוססי-נתונים ומנוסחים באחוזונים, לא ניחוש",
          "אתה יכול לחשב את ה-error budget ולהסביר מה קורה כשהוא נגמר",
          "AtlasDesk מחזיר fallback מנומס במקום לקרוס כשהמודל איטי/לא-זמין",
          "אתה מבין את הפשרה בין רמת אמינות למורכבות/עלות הנדסית",
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
          ["SLI", "Service Level Indicator — המדד בפועל: אחוז בקשות שהצליחו, p95 latency. מה שקרה."],
          ["SLO", "Service Level Objective — היעד הפנימי (99%). הקו שמעליו רגועים ומתחתיו פועלים."],
          ["SLA", "Service Level Agreement — הבטחה חוזית ללקוח עם פיצוי כספי. תמיד רופפת יותר מה-SLO."],
          ["Error Budget", "המרווח מ-100% ל-SLO (למשל 1%). כמה כישלון מותר לפני שעוצרים פיצ'רים ומייצבים."],
          ["p95 / p99", "אחוזונים: p95=95% מהבקשות היו מהירות מזה. חושפים את הזנב הארוך שהממוצע מחביא."],
          ["Graceful Degradation", "כשהמודל נופל — המערכת יורדת למצב מוגבל (cache/fallback) במקום לקרוס."],
          ["Fallback", "תשובת ברירת-מחדל כשהקריאה למודל נכשלה/פגה — תבנית, cache, או הודעה כנה."],
          ["Availability", "אחוז הזמן שהמערכת עונה כראוי. נמדד לרוב ב'תשעים' — 99%, 99.9%, 99.99%."],
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
          <li><strong>SLI מודד, SLO מכוון, SLA מתחייב</strong> — שלוש רמות, לא מילים נרדפות.</li>
          <li><strong>100% הוא יעד מזיק</strong>: יקר אקספוננציאלית, תלוי בספקים חיצוניים, ו-error budget אפס משתק כל שחרור.</li>
          <li><strong>מדוד latency באחוזונים</strong> (p95/p99), לא בממוצע — הזנב הארוך הוא מקור התלונות.</li>
          <li><strong>graceful degradation</strong>: timeout + fallback שומרים על מערכת שימושית גם כשה-AI נופל — בדיוק כמו האקדמיה הזו בלי מפתח.</li>
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
          חפש SLA פומבי של שירות ענן שאתה מכיר (AWS, Vercel, Anthropic). מה היעד המדויק (כמה
          ”תשעים”?), ומה הפיצוי שמובטח אם לא עומדים בו? שים לב: כמעט תמיד ה-SLA מנוסח בזהירות
          עם החרגות — נסה לזהות אותן.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          קבעת יעד אמינות — אבל איך משחררים שינוי חדש בלי לסכן אותו? בשיעור הבא, Feature Flags
          ופריסה בטוחה, נלמד להפריד פריסה משחרור, לפרוס בהדרגה, ולבצע rollback מיידי בלי redeploy.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
