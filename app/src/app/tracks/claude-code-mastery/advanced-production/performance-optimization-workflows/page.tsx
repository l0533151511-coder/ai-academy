"use client";

import { Gauge, Lightbulb, Ruler, GitCompare, AlertTriangle, ShieldCheck } from "lucide-react";
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
  lessonSlug: "performance-optimization-workflows",
  title: "אופטימיזציית ביצועים עם Claude Code",
  objectives: [
    "לזהות צווארי בקבוק אמיתיים במדידה (לא בניחוש) לפני כל אופטימיזציה",
    "לבקש מ-Claude Code השערות ומדידה — לא שינויים עיוורים — ולמדוד לפני ואחרי",
    "להימנע מאופטימיזציה מוקדמת ולוודא שכל שיפור לא הכניס רגרסיה",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: prompt-library מתועד ל-AtlasDesk"],
};

const SLIDES: Slide[] = [
  {
    title: "מדוד לפני שאתה משפר — הכלל שמונע בזבוז",
    bullets: [
      "AtlasDesk כבר עובד עם 7 יכולות. השאלה עכשיו: האם הוא מהיר מספיק ל-production — ואם לא, איפה בדיוק האיטיות?",
      "כלל היסוד: לא לבצע אופטימיזציה על בסיס ניחוש. אינטואיציה על ביצועים שגויה לעתים קרובות — הבעיה כמעט תמיד לא היכן שחשבת.",
      "ב-RAG שבנית, כל שאלה מחשבת embedding לכל מאמרי העזרה מחדש (למדת זאת בפרויקט embeddings) — זה צוואר בקבוק אמיתי ונמדד, לא היפותטי.",
    ],
  },
  {
    title: "בקש מ-Claude Code השערות ומדידה, לא 'תעשה מהר יותר'",
    bullets: [
      "פרומפט גרוע: 'תשפר את הביצועים'. המודל ינחש ויבצע שינויים עיוורים שאולי אפילו לא נוגעים בבעיה האמיתית.",
      "פרומפט טוב: 'תוסיף לוגי זמן לכל שלב ב-pipeline ותראה לי איפה רוב הזמן מתבזבז'. עכשיו יש נתונים להחליט לפיהם.",
      "השערה לפני שינוי: 'אני חושד שה-embeddings הם צוואר הבקבוק. בוא נמדוד כדי לאשש או להפריך' — בדיוק כמו debugging מונחה-השערה (מודול 3).",
    ],
  },
  {
    title: "מדידה→שינוי→מדידה שוב — לוודא שאין רגרסיה",
    bullets: [
      "אופטימיזציה בלי מדידת 'אחרי' היא ניחוש כפול: לא יודעים אם השתפר, ולא יודעים אם שברת משהו אחר.",
      "כל שינוי-ביצועים חייב מדידת before/after על אותו קלט — וגם בדיקה שהתוצאה עדיין נכונה (קורלטיביות/דיוק לא נפגעו).",
      "אופטימיזציה מוקדמת (על קוד שלא רץ בקנה מידה) היא אנטי-פטרן: מוסיפה מורכבות בלי תועלת נמדדת.",
    ],
  },
];

const PERF_STEPS: DiagramStep[] = [
  { icon: Ruler, label: "1. מדוד קו-בסיס", detail: "לפני כל שינוי: לוגי זמן לכל שלב ב-pipeline. נתונים אמיתיים על היכן הזמן מתבזבז — לא ניחוש." },
  { icon: Lightbulb, label: "2. גבש השערה", detail: "בקש מ-Claude Code השערה מנומקת ('embeddings הם 80% מהזמן כי הם מחושבים מחדש') לפני כל שינוי קוד." },
  { icon: Gauge, label: "3. שנה ממוקד", detail: "אופטם רק את מה שהמדידה הצביעה עליו (חישוב embeddings פעם אחת ושמירה ב-pgvector) — לא את החלק ה'מעניין'." },
  { icon: GitCompare, label: "4. מדוד שוב", detail: "before/after על אותו קלט. ודא שהזמן ירד — וגם שהתוצאה עדיין נכונה (אין רגרסיית דיוק)." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'לא לבצע אופטימיזציה על בסיס ניחוש' הוא כלל יסוד?",
    options: [
      "כי אופטימיזציה תמיד מסוכנת ולא כדאי לבצע אותה בכלל",
      "כי בלי מדידה, אתה עלול להשקיע זמן בשיפור חלק שלא באמת איטי, בעוד צוואר הבקבוק האמיתי נשאר בלתי-מטופל",
      "כי Claude Code לא יודע למדוד ביצועים",
      "כי מדידה תמיד מגלה שהקוד כבר מהיר מספיק",
    ],
    correctIndex: 1,
    explanation:
      "אופטימיזציה בלי מדידה היא הימור — ייתכן שהיא משפרת חלק לא-קריטי בזמן שהבעיה האמיתית (למשל חישוב embeddings חוזר) נשארת. מדידה קודם ממקדת את המאמץ במקום שבאמת פוגע בביצועים.",
    optionNotes: [
      "לא נכון: אופטימיזציה חשובה ולגיטימית — הבעיה היא לעשות אותה בלי בסיס מדוד, לא האופטימיזציה עצמה.",
      "נכון: בלי מדידה, מבזבזים מאמץ במקום הלא-נכון בעוד הבעיה האמיתית ממשיכה לפגוע.",
      "לא נכון: Claude Code יכול למדוד ביצועים (זמני תגובה, כמות קריאות) בהחלט — זו לא מגבלה טכנית.",
      "לא נכון: לפעמים מדידה מגלה בדיוק ההפך — צוואר בקבוק אמיתי וקריטי.",
    ],
  },
  {
    id: "q2",
    question:
      "אתה רוצה לזרז את ה-RAG של AtlasDesk. איזה פרומפט ל-Claude Code הוא הגישה ההנדסית הנכונה?",
    options: [
      "'תעשה את ה-RAG מהיר יותר' — ולתת למודל להחליט מה לשנות",
      "'תוסיף לוגי זמן לכל שלב ב-rag-chat/route.ts (embedding, חיפוש, קריאת Claude) ותראה לי איפה רוב הזמן מתבזבז' — ואז להחליט לפי הנתונים",
      "'תחליף את המודל למהיר יותר' — כי מודל מהיר תמיד פותר בעיות ביצועים",
      "'תריץ את הכל במקביל' — כי מקביליות תמיד מזרזת",
    ],
    correctIndex: 1,
    explanation:
      "פרומפט טוב מבקש מדידה והשערה, לא שינוי עיוור. 'תעשה מהר יותר' נותן למודל לנחש. בקשת לוגי-זמן לכל שלב מייצרת נתונים אמיתיים — ורק אז מחליטים היכן להשקיע. זו בדיוק המשמעת של debugging מונחה-השערה.",
    optionNotes: [
      "לא נכון: 'תעשה מהר יותר' הוא בדיוק פרומפט מעורפל שמזמין שינויים עיוורים.",
      "נכון: לוגי-זמן לכל שלב מייצרים נתונים, ואז ההחלטה מבוססת-מדידה ולא ניחוש.",
      "לא נכון: החלפת מודל לא עוזרת אם צוואר הבקבוק הוא חישוב embeddings, לא קריאת Claude.",
      "לא נכון: מקביליות עוזרת רק לקריאות עצמאיות, ולא חינם — היא מעמיסה על rate limits ומגדילה עלות בו-זמנית.",
    ],
  },
  {
    id: "q3",
    question: "מהי 'אופטימיזציה מוקדמת' (premature optimization), ולמה היא אנטי-פטרן?",
    options: [
      "כל אופטימיזציה שנעשית לפני שהמוצר עולה ל-production",
      "השקעת מאמץ בייעול קוד שאינו רץ בקנה מידה משמעותי (למשל הדגמה עם 5 מאמרי עזרה) — מוסיפה מורכבות ותחזוקה בלי תועלת נמדדת",
      "אופטימיזציה שמבוססת על מדידה במקום ניחוש",
      "כל שימוש ב-Promise.all לפני שהקוד הושלם",
    ],
    correctIndex: 1,
    explanation:
      "אופטימיזציה מוקדמת היא ייעול קוד שהעומס עליו זניח — מוסיפה מורכבות (וחוב תחזוקה) בלי שיפור מדיד. הכלל: קודם מוודאים שיש בעיית-ביצועים אמיתית ונמדדת, ורק אז מייעלים. פשטות עדיפה עד שהמדידה מוכיחה צורך.",
    optionNotes: [
      "לא נכון: העיתוי (לפני/אחרי production) אינו ההגדרה — קנה-המידה והמדידה הם.",
      "נכון: ייעול קוד ללא עומס אמיתי מוסיף מורכבות בלי תועלת — זו ההגדרה המדויקת.",
      "לא נכון: אופטימיזציה מבוססת-מדידה היא בדיוק ההפך מ'מוקדמת' — היא מוצדקת.",
      "לא נכון: Promise.all אינו האנטי-פטרן; שימוש בו בלי מדידה שמצדיקה אותו — כן.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מדוד לפני שאתה משפר", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "לולאת האופטימיזציה — דיאגרמה", content: <StepDiagram steps={PERF_STEPS} /> },
  {
    id: "comparison",
    label: "רע מול טוב: אופטימיזציה על בסיס ניחוש מול מדידה",
    content: (
      <PromptComparisonLab
        title="שיפור ביצועי RAG ב-AtlasDesk"
        unitLabel="גישה"
        bad={{
          label: "ניחוש: 'המודל איטי'",
          content: `"תשדרג את המודל של Claude למהיר יותר כי RAG איטי"`,
          outcome:
            "אם צוואר הבקבוק האמיתי הוא חישוב embeddings חוזר לכל מאמרי העזרה בכל בקשה (לא קריאת Claude עצמה), שינוי המודל לא יפתור כלום — בזבזת מאמץ ואולי הורדת דיוק בלי לגעת בבעיה.",
        }}
        good={{
          label: "מדידה קודם, ואז שינוי ממוקד",
          content: `"תוסיף לוג זמן לכל שלב ב-rag-chat/route.ts: זמן
embedding, זמן חיפוש, זמן קריאת Claude. תראה לי איפה
רוב הזמן מתבזבז — ואז נחליט מה לשנות."`,
          outcome:
            "מתגלה שחישוב ה-embeddings לוקח 80% מהזמן (כמו שנלמד בפרויקט embeddings — מחושבים מחדש בכל בקשה). האופטימיזציה ממוקדת: לחשב פעם אחת ולשמור ב-pgvector. מדידת 'אחרי' מאשרת שיפור, ובדיקה מאשרת שהדיוק לא נפגע.",
        }}
        takeaway="מדידה לפני אופטימיזציה חוסכת מאמץ שמושקע במקום הלא-נכון — בדיוק כמו debugging מונחה-השערה (מודול 3): קודם מבינים איפה הבעיה, ואז פותרים אותה. הפרומפט הטוב מבקש נתונים, לא ניחוש."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="מדידה-לפני-אופטימיזציה קיימת כי אינטואיציה על ביצועים לרוב שגויה — הבעיה האמיתית מתגלה רק במדידה, לא בניחוש. הנתון מחליף את הדעה."
        alternatives="אופטימיזציה מונעת-אינטואיציה עובדת לפעמים בקוד קטן ופשוט; נכשלת ככל שהמערכת מורכבת יותר (כמו AtlasDesk עם כמה שלבי pipeline), כי צוואר הבקבוק נסתר בין השלבים."
        whenNotTo="לקוד שלא רץ בקנה מידה משמעותי (הדגמת לימוד עם 5 מאמרי עזרה) — אופטימיזציה שם היא over-engineering. וכשהמדידה מראה שהשלב 'האיטי' כבר זניח — לא נוגעים בו."
        commonMistakes="לאופטם את החלק ה'מעניין' (בחירת מודל) במקום החלק שבאמת אחראי לרוב הזמן (embeddings שמחושבים מחדש); ולשכוח את מדידת ה'אחרי' — כך לא יודעים אם השתפר או אם נשברה נכונות."
        performance="החיסכון הגדול ב-RAG כמעט תמיד ב-caching של embeddings ובקריאות מקבילות לשלבים עצמאיים — אבל רק מדידה קובעת מי מהם רלוונטי כאן. מקביליות אינה חינם: היא מעמיסה על rate limits."
        security="לוגי-זמן זמניים עלולים בטעות להדפיס תוכן רגיש (הודעות משתמש, מפתחות) ללוג. ודא שמודדים זמנים בלבד, לא payload — ושהלוגים הזמניים מוסרים לפני production."
        cost="לוגים זמניים למדידה עולים מעט קוד (ואפשר להסירם) — וחוסכים זמן פיתוח שהיה מושקע בכיוון הלא-נכון. caching של embeddings חוסך גם עלות-API אמיתית בכל בקשה."
        maintenance="כל אופטימיזציה מוסיפה מורכבות — cache צריך invalidation, מקביליות מקשה על דיבוג. לכן מייעלים רק מה שהמדידה הצדיקה: פשטות היא ברירת-המחדל עד שהנתון דורש אחרת."
        realWorld="בדיוק אותו ממצא נלמד בפרויקט מודול Embeddings: לחשב embeddings פעם אחת ולשמור ב-pgvector, לא בכל בקשה — זו האופטימיזציה שנמדדת ונכונה כאן, בניגוד לשדרוג-מודל שהוא ניחוש."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר ביצועים בפועל מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-danger">
            <AlertTriangle size={16} /> מה שובר ביצועים בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מאופטמים לפי תחושה (&quot;המודל איטי&quot;) בלי למדוד — משפרים את החלק הלא-נכון.</li>
            <li>פרומפט מעורפל (&quot;תעשה מהר יותר&quot;) שמזמין שינויים עיוורים.</li>
            <li>אין מדידת &quot;אחרי&quot; — לא יודעים אם השתפר או אם נשברה נכונות.</li>
            <li>אופטימיזציה מוקדמת על קוד בלי עומס אמיתי — מורכבות בלי תועלת.</li>
            <li>מוסיפים מקביליות עיוורת ומתנגשים ב-rate limits ובעלות.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <ShieldCheck size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מודדים קו-בסיס עם לוגי-זמן לכל שלב לפני שנוגעים בקוד.</li>
            <li>מבקשים מ-Claude Code השערה מנומקת, לא שינוי עיוור.</li>
            <li>מאופטמים ממוקד רק את מה שהמדידה הצביעה עליו.</li>
            <li>מודדים before/after על אותו קלט — ומוודאים שהדיוק לא נפגע.</li>
            <li>שומרים פשטות עד שהמדידה מצדיקה מורכבות (בלי אופטימיזציה מוקדמת).</li>
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
        id="advanced-production-performance-optimization"
        title="מדוד, שער, אופטם, ומדוד שוב — את זמני התגובה של AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk. המטרה: לעבור את הלולאה המלאה, לא רק לנחש."
        steps={[
          "עם Claude Code, הוסף לוגי זמני-ביניים ל-rag-chat/route.ts (זמן embedding, זמן חיפוש, זמן קריאת Claude). ודא שאתה מודד זמנים בלבד, לא תוכן רגיש.",
          "הרץ בקשה אמיתית (או ב-preview) וקבל את הפילוג. זהו קו-הבסיס שלך.",
          "בקש מ-Claude Code השערה מנומקת: איפה רוב הזמן, ולמה? אשש או הפרך מול המדידה.",
          "בצע שינוי ממוקד אחד לצוואר הבקבוק שזוהה (למשל caching של embeddings).",
          "מדוד שוב על אותו קלט: ודא שהזמן ירד — ושהתשובה עדיין נכונה (אין רגרסיית דיוק).",
        ]}
        successCriteria={[
          "יש לך נתוני זמן אמיתיים (before), לא ניחוש",
          "אתה יודע להצביע על השלב שהכי תורם לזמן התגובה הכולל",
          "יש לך מדידת after שמוכיחה שיפור — בלי לשבור את נכונות התוצאה",
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
          ["צוואר בקבוק", "השלב שאחראי לרוב זמן הריצה — המקום היחיד שאופטימיזציה שם באמת עוזרת."],
          ["Baseline (קו-בסיס)", "מדידת ביצועים לפני כל שינוי — נקודת ההשוואה לכל 'אחרי'."],
          ["Profiling", "מדידת זמן/משאבים לכל שלב כדי לגלות היכן הזמן מתבזבז בפועל."],
          ["Premature optimization", "ייעול קוד בלי עומס אמיתי — מורכבות בלי תועלת נמדדת."],
          ["Regression", "שבירה של תוצאה נכונה או ביצועים אחרים כתופעת-לוואי של שינוי."],
          ["Caching (embeddings)", "חישוב פעם אחת ושמירה (pgvector) במקום חישוב חוזר בכל בקשה."],
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
          <li><strong>מדוד קודם</strong>: אינטואיציה על ביצועים שגויה לעתים קרובות.</li>
          <li>בקש מ-Claude Code <strong>השערה ומדידה</strong>, לא שינוי עיוור.</li>
          <li>אופטם <strong>רק את צוואר הבקבוק הנמדד</strong> — לא את החלק ה&apos;מעניין&apos;.</li>
          <li>מדוד <strong>before/after</strong> וּודא שאין רגרסיית נכונות. פשטות עד שהנתון דורש אחרת.</li>
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
          חשוב על פרויקט שלך שבו &quot;הרגשת&quot; שמשהו איטי בלי למדוד. נסה למדוד עכשיו בפועל —
          האם החשד שלך התאמת למציאות, או שצוואר הבקבוק היה במקום אחר לגמרי?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          מדדת ושיפרת ביצועים בסשן עבודה. אבל סשן אופטימיזציה ארוך נוטה לסחוף — בשיעור הבא
          (התאוששות משגיאות וסשנים ארוכים) נלמד לשמור אותו ממוקד עם checkpoints ועיגון מחדש.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
