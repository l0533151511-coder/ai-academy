"use client";

import { Shield, FileText, Gauge, IdCard, Database, Scale } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-agents",
  moduleSlug: "automation-scraping",
  lessonSlug: "responsible-scraping-principles",
  title: "עקרונות scraping אחראי",
  objectives: [
    "להבין את robots.txt, rate limiting, ותנאי שימוש כגבולות אתיים וחוקיים — ולדעת מה כל אחד פותר",
    "לזהות מתי API רשמי עדיף על scraping, ומתי scraping הוא בכל זאת ההכרח",
    "להבין את הסיכונים ההנדסיים (HTML שמשתנה, חסימות), האתיים (עומס על שרת זר) והמשפטיים (ToS, PII)",
    "לתכנן scraper 'אזרח טוב': מזוהה, ממותן, ממוקד-cache, ומכבד גבולות",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: AtlasDesk מקבל אסקלציה רב-סוכנית"],
};

const SLIDES: Slide[] = [
  {
    title: "מודול חדש: לפעול על העולם החיצוני",
    bullets: [
      "עד כה AtlasDesk 'פעל' בעולם סגור (מאמרי עזרה, כלים פנימיים). המודול הזה עוסק ביכולת לפעול על מקורות מידע חיצוניים — scraping ואוטומציה מבוססת webhooks.",
      "כלל יסוד ראשון: API רשמי כמעט תמיד עדיף על scraping כשהוא קיים — יציב יותר, חוקי יותר, ומתועד. scraping הוא הכלי האחרון, לא הראשון.",
      "המדד למהנדס אינו 'הצלחתי למשוך את הדף', אלא 'משכתי את המידע בלי לפגוע בשרת הזר, בלי לחשוף את המעסיק שלי לתביעה, ובלי שהקוד יישבר מחר בבוקר'.",
    ],
  },
  {
    title: "למה scraping אחראי בכלל קיים: זו לא בירוקרטיה",
    bullets: [
      "כל בקשה שלך רצה על שרת של מישהו אחר, שהוא משלם עליו. scraper לא-ממותן שולח אלפי בקשות בשנייה — מבחינת השרת השני זה נראה כמו מתקפת עומס (DoS), גם אם הכוונה תמימה.",
      "יש כאן שלושה צירים שנפרדים אך שלובים: הנדסי (יציבות ותחזוקה), אתי (לא להזיק לצד שלישי) ומשפטי (ToS, זכויות יוצרים, פרטיות).",
      "scraper 'אזרח טוב' מזהה את עצמו, ממתן קצב, שומר cache כדי לא לחזור על בקשות, ומכבד את robots.txt. אלה לא חומרות — הם מה שמפריד קוד מקצועי מבוט תוקפני.",
    ],
  },
  {
    title: "חמשת הגבולות של scraping אחראי",
    bullets: [
      "robots.txt — הצהרה של האתר אילו נתיבים מותר/אסור לבוטים לסרוק. הכלל הראשון שבודקים.",
      "Rate limiting — השהיה בין בקשות כדי לא להעמיס; לרוב מדובר בשנייה או יותר בין קריאות, לא במקבילות אינסופיות.",
      "זיהוי הבוט — User-Agent אמיתי עם דרך יצירת קשר, כדי שבעל האתר יוכל לפנות אליך במקום פשוט לחסום.",
      "Caching — לשמור מה שכבר משכת ולא לחזור לשרת על אותו מידע. חוסך לו עומס ולך זמן/עלות.",
      "PII ופרטיות — מידע אישי (שמות, מיילים, טלפונים) כפוף לחוקי הגנת מידע (GDPR ודומיו) גם כשהוא 'פומבי'.",
    ],
  },
];

const RESPONSIBLE_STEPS: DiagramStep[] = [
  {
    icon: FileText,
    label: "בדוק robots.txt",
    detail: "לפני שורת קוד: קרא את domain.com/robots.txt. אם נתיב מסומן Disallow לבוטים — אל תיגע בו. זו נקודת הבדיקה הראשונה.",
  },
  {
    icon: Scale,
    label: "קרא את ה-ToS",
    detail: "תנאי השימוש עשויים לאסור scraping במפורש. הפרה אינה רק חוסר-נימוס — היא חשיפה משפטית לך ולמעסיק שלך.",
  },
  {
    icon: IdCard,
    label: "זהה את עצמך",
    detail: "User-Agent אמיתי עם שם ודרך קשר. בוט אנונימי נחסם מיד; בוט מזוהה מקבל לרוב הזדמנות ופנייה לפני חסימה.",
  },
  {
    icon: Gauge,
    label: "מתן קצב",
    detail: "השהיה בין בקשות (rate limiting) כדי לא להיראות כמתקפת עומס. בקשה אחת לשנייה עדיפה על 1000 במקביל.",
  },
  {
    icon: Database,
    label: "שמור cache",
    detail: "אל תחזור לשרת על מידע שכבר יש לך. cache מקומי חוסך עומס לשרת הזר, וחוסך לך זמן ועלות.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה API רשמי עדיף בדרך כלל על scraping, כשהוא קיים?",
    options: [
      "אין הבדל אמיתי, שניהם מספקים את אותו מידע",
      "API רשמי יציב יותר (לא נשבר כשה-HTML משתנה), חוקי יותר (מותר לפי תנאי שימוש), ומתועד — scraping הוא 'עוקף' שברירי",
      "scraping תמיד מהיר יותר מ-API",
      "API רשמי תמיד חינמי לגמרי",
    ],
    correctIndex: 1,
    explanation:
      "scraping תלוי במבנה HTML שיכול להשתנות בכל רגע (שובר את הקוד בשקט), ולעיתים מפר תנאי שימוש. API רשמי הוא חוזה ממשק מוסכם, מגורס ומתועד — הצד השני מתחייב שלא לשבור אותו בלי הודעה.",
    optionNotes: [
      "שגוי: יש הבדל מהותי ביציבות ובחוקיות. אותו מידע, אך אמינות אספקה שונה לגמרי.",
      "נכון: יציבות (API לא נשבר כש-HTML משתנה) וחוקיות (תואם ToS) הם היתרונות המרכזיים, לצד תיעוד.",
      "שגוי: מהירות תלויה במקרה. לרוב API דווקא מהיר יותר כי אין צורך להוריד ולפרסר עמוד שלם.",
      "שגוי: APIs רשמיים רבים דורשים תשלום או מכסה — לא בהכרח חינמיים.",
    ],
  },
  {
    id: "q2",
    question: "בנית scraper בלי rate limiting, והוא שולח מאות בקשות בשנייה. מה הסיכון ההנדסי המיידי?",
    options: [
      "אין סיכון — ככל שמהר יותר, כך טוב יותר",
      "העומס עלול להיראות לשרת הזר כמתקפת DoS, ולהוביל לחסימת ה-IP שלך (ולעיתים גם צעד משפטי)",
      "הבקשות יגיעו בסדר הלא-נכון",
      "המידע יגיע דחוס מדי לקריאה",
    ],
    correctIndex: 1,
    explanation:
      "מבחינת השרת השני אין הבדל בין scraper תמים לבין תוקף — שניהם מציפים אותו בבקשות. מערכות הגנה (WAF, Cloudflare) יחסמו את ה-IP שלך, ובמקרים חמורים זו גם חשיפה משפטית. rate limiting הוא לא נימוס — הוא תנאי להישרדות ה-scraper.",
    optionNotes: [
      "שגוי: מהירות מקסימלית היא בדיוק מה שגורם לחסימה. 'מהר' כאן שקול ל'תוקפני'.",
      "נכון: הצפת השרת נראית כ-DoS, מפעילה חסימות אוטומטיות, ועלולה לגרור אחריות משפטית.",
      "שגוי: סדר הבקשות אינו הבעיה — העומס הוא הבעיה.",
      "שגוי: דחיסת נתונים אינה קשורה לקצב הבקשות.",
    ],
  },
  {
    id: "q3",
    question: "אתה סורק דף פומבי שכולל שמות, מיילים וטלפונים של אנשים. מה השיקול שרבים מפספסים?",
    options: [
      "אין שיקול — אם המידע פומבי, מותר לעשות בו הכל",
      "מידע אישי (PII) כפוף לחוקי הגנת פרטיות (GDPR ודומיו) גם כשהוא נגיש פומבית — איסוף ואחסון שלו גורר חובות ואחריות",
      "צריך רק לוודא שה-HTML לא ישתנה",
      "השיקול היחיד הוא מהירות הסריקה",
    ],
    correctIndex: 1,
    explanation:
      "'פומבי' אינו 'חופשי לכל שימוש'. חוקי הגנת מידע חלים על עצם האיסוף והאחסון של PII, לא רק על הדרך שבה הגיע אליך. סורק אחראי שואל תחילה: האם אני בכלל צריך את המידע האישי הזה? ואם כן — כיצד אאחסן, אאבטח ואמחק אותו כחוק.",
    optionNotes: [
      "שגוי ומסוכן: 'פומבי' לא מבטל את חוקי הפרטיות. זו טעות התפיסה הנפוצה ביותר בתחום.",
      "נכון: PII כפוף להגנת מידע גם כשהוא גלוי; האיסוף והאחסון עצמם יוצרים חובות משפטיות.",
      "שגוי: יציבות ה-HTML היא שיקול הנדסי, לא השיקול המשפטי/אתי כאן.",
      "שגוי: מהירות אינה קשורה כלל לאחריות על מידע אישי.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: לפעול על העולם החיצוני באחריות", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "צ'קליסט ה-scraper האחראי — חמישה גבולות",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          לפני שאתה כותב scraper, עבור על חמשת הגבולות לפי הסדר. ברוב תקלות ה-scraping בפרודקשן —
          אחד מהם דולג. עבור על השלבים:
        </p>
        <StepDiagram steps={RESPONSIBLE_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: scraping ראשוני מול API רשמי",
    content: (
      <PromptComparisonLab
        title="קבלת מחירי מתחרים לצורך השוואה"
        unitLabel="גישה"
        bad={{
          label: "scraping ישיר של אתר המתחרה",
          content: `"תכתוב סקריפט שסורק את דף המחירים של המתחרה
כל שעה" (בלי לבדוק robots.txt או תנאי שימוש,
בלי rate limiting, בלי User-Agent מזהה)`,
          outcome:
            "אם המתחרה משנה את מבנה ה-HTML, הסקריפט נשבר בשקט ואתה עובד על נתונים ישנים. אם ה-ToS אוסר scraping, יש חשיפה משפטית. בלי rate limiting והזדהות — ה-IP נחסם כ-'תעבורה חשודה' תוך יום.",
        }}
        good={{
          label: "בדיקת API רשמי + חלופות חוקיות",
          content: `"בדוק אם יש API רשמי/feed לנתוני מחירים. אם אין,
בדוק robots.txt ואת ה-ToS לפני שתציע scraping,
ותכנן rate limiting מכבד + User-Agent עם דרך קשר"`,
          outcome:
            "פתרון בר-קיימא: אם יש API — משתמשים בו ומקבלים נתונים יציבים ומתועדים. אם צריך scraping, הוא נעשה בגבולות המותרים, ממותן, מזוהה וממוקד-cache — ולא יגרור חסימה או תביעה.",
        }}
        takeaway="scraping אחראי הוא לא רק 'טכני נכון' — הוא גם עמידות (API רשמי לא נשבר) וגם עמידה בגבולות חוקיים/אתיים. שלושת השיקולים — הנדסי, אתי ומשפטי — חשובים באותה מידה."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="עקרונות scraping אחראי קיימים כי scraping לא-מבוקר גורם נזק ממשי: עומס על שרתים של צד שלישי, חשיפה משפטית (ToS, זכויות יוצרים, פרטיות), ותחזוקה בלתי-נגמרת כשה-HTML משתנה."
        alternatives="API רשמי (כשקיים) — יציב, חוקי ומתועד. Feed/RSS או ייצוא נתונים רשמי כשמוצע. רק כשכל אלה חסרים — scraping ממותן ומזוהה כמוצא אחרון."
        whenNotTo="אם ה-ToS אוסר scraping במפורש; אם אין דרך לבצע אותו בכבוד (rate limiting סביר); או אם מדובר בכמות גדולה של PII שאין לך בסיס חוקי לאסוף — עדיף לוותר על המקור."
        commonMistakes="scraper בלי rate limiting (נראה כ-DoS ונחסם); User-Agent אנונימי או מזויף (חסימה מיידית); בלי cache (חוזרים לשרת על אותו מידע שוב ושוב); הנחה ש-'פומבי' = 'מותר לכל שימוש' תוך התעלמות מ-PII."
        performance="cache הוא לא רק נימוס — הוא ביצועים. סורק שממחזר תשובות שכבר משך רץ מהר יותר, עולה פחות, ומעמיס פחות על השרת הזר. ETag/If-Modified-Since מאפשרים לבדוק 'האם השתנה' בלי להוריד את כל העמוד."
        cost="scraping דורש תחזוקה שוטפת (HTML משתנה = קוד נשבר) — עלות נסתרת שלא קיימת עם API רשמי יציב. הוסף לכך עלות proxy, פתרון CAPTCHA, וזמן מהנדס לתיקונים חוזרים."
        security="ה-HTML שאתה מושך הוא קלט לא-אמין — לעולם אל תריץ אותו כקוד ואל תסמוך על מבנהו. עבור PII: אם אתה כן אוסף, אבטח באחסון, הצפן במעבר, ותכנן מדיניות מחיקה — כפי שחוקי הגנת המידע דורשים."
        maintenance="scraper הוא נכס-חוב לתחזוקה: הוא נשבר בכל שינוי עיצוב באתר הזר, בלי אזהרה. נטר תקלות (למשל 'שדה חסר' = כנראה שינוי HTML), ותכנן התראה — אל תגלה שהוא שבור רק כשהנתונים חסרים בדוח."
        realWorld="ב-AtlasDesk, פרויקט המודול ישתמש ב-webhooks (לא scraping) לקבלת מידע חיצוני — בדיוק כי זו הדרך הרשמית, היציבה והחוקית יותר. scraping נשמר למקרים שבהם אין ברירה."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר בפרודקשן מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר (ומזיק) בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>scraper בלי rate limiting — נראה כ-DoS, ה-IP נחסם תוך שעות, ולפעמים גם פנייה משפטית.</li>
            <li>User-Agent אנונימי או מתחזה לדפדפן — סימן ראשון שנחסם, ומונע מבעל האתר לפנות אליך במקום.</li>
            <li>התעלמות מ-robots.txt ומה-ToS — &quot;לא ידעתי&quot; אינו הגנה משפטית.</li>
            <li>איסוף PII כי &quot;זה פומבי&quot; — התעלמות מ-GDPR וחוקי פרטיות שחלים על האחסון עצמו.</li>
            <li>בלי cache — חזרה לשרת על אותו מידע, מעמיסה עליו וגם מייקרת ומאטה אותך.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מחפשים API רשמי/feed קודם; scraping רק כשאין ברירה אחרת.</li>
            <li>בודקים robots.txt ואת ה-ToS לפני שורת קוד ראשונה, ומתעדים את ההחלטה.</li>
            <li>User-Agent מזהה עם דרך קשר, ו-rate limiting מכבד (השהיה בין בקשות).</li>
            <li>cache אגרסיבי (ETag/If-Modified-Since) — לא חוזרים לשרת על מה שכבר יש.</li>
            <li>מצמצמים PII למינימום ההכרחי, מאבטחים אותו, ומתכננים מדיניות מחיקה.</li>
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
        id="automation-responsible-scraping-principles"
        title="בדוק robots.txt, ToS ו-API רשמי לפני scraping היפותטי"
        context="בחר אתר ציבורי כלשהו (חנות, בלוג, מאגר מידע ציבורי). עבוד עם Claude Code — זו משימת תכנון ובדיקה, לא מימוש scraper אמיתי."
        steps={[
          "בדוק את robots.txt של האתר (domain.com/robots.txt) — אילו נתיבים מסומנים Disallow? מה מותר?",
          "עם Claude Code, חפש אם יש API רשמי/feed לאותו מקור מידע, וסכם מה הוא מציע לעומת scraping.",
          "אתר את סעיף ה-scraping/automation בתנאי השימוש של האתר — האם הוא אוסר, מגביל, או שותק?",
          "אם אין API והסריקה מותרת: תכנן (בלי לממש) rate limiting סביר, User-Agent מזהה, ואסטרטגיית cache.",
          "צעד דיבוג: נסח כיצד תזהה שה-scraper שלך נשבר בשקט (למשל 'שדה חסר' = כנראה שינוי HTML) לפני שהנתונים החסרים יגיעו לדוח.",
        ]}
        successCriteria={[
          "בדקת robots.txt אמיתי ואת ה-ToS בפועל, לא ניחוש",
          "יש לך תשובה ברורה: API רשמי קיים או לא, ואם לא — תוכנית rate limiting + הזדהות + cache",
          "יש לך מנגנון זיהוי לתקלה שקטה (שינוי HTML) לפני שהיא מזהמת נתונים",
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
          ["robots.txt", "קובץ בשורש האתר שמצהיר אילו נתיבים מותר/אסור לבוטים לסרוק. נקודת הבדיקה הראשונה."],
          ["Rate limiting", "השהיה מכוונת בין בקשות כדי לא להעמיס על השרת הזר ולא להיראות כמתקפה."],
          ["User-Agent", "מחרוזת זיהוי שהבקשה נושאת. סורק אחראי מזהה את עצמו עם דרך קשר, לא מתחזה לדפדפן."],
          ["ToS", "תנאי שימוש. עשויים לאסור scraping במפורש; הפרה היא חשיפה משפטית."],
          ["PII", "מידע אישי מזהה (שם, מייל, טלפון). כפוף לחוקי פרטיות גם כשהוא פומבי."],
          ["Caching", "שמירת מידע שכבר נמשך כדי לא לחזור לשרת עליו. חוסך עומס, עלות וזמן."],
          ["DoS", "Denial of Service — הצפת שרת בבקשות. scraper לא-ממותן נראה בדיוק כך."],
          ["ETag", "מזהה גרסה של משאב; מאפשר לשאול 'האם השתנה?' בלי להוריד את כל העמוד."],
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
          <Shield size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>API רשמי <strong>קודם</strong>. scraping הוא המוצא האחרון, לא הראשון.</li>
          <li>שלושה צירים שלובים: <strong>הנדסי</strong> (יציבות), <strong>אתי</strong> (לא להזיק) ו<strong>משפטי</strong> (ToS, PII).</li>
          <li>scraper אזרח-טוב: <strong>מזוהה, ממותן, ממוקד-cache, ומכבד robots.txt</strong>.</li>
          <li>&apos;פומבי&apos; אינו &apos;מותר לכל שימוש&apos; — <strong>PII כפוף לחוקי פרטיות</strong> גם כשהוא גלוי.</li>
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
          חפש שירות/אתר שאתה משתמש בו לעתים קרובות ובדוק אם יש לו API רשמי לפני שהיית שוקל
          scraping. קרא גם את robots.txt שלו — מה הוא חוסם מבוטים? הפתעת לגלות שיש (או אין) API?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          ראית ש-API רשמי עדיף על &apos;למשוך&apos; מידע בעצמך. בשיעור הבא — אוטומציה מונעת-webhooks — נהפוך
          את היוצרות: במקום שתשאל שוב ושוב &apos;יש חדש?&apos;, המערכת החיצונית תדחוף אליך את האירוע ברגע שהוא קורה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
