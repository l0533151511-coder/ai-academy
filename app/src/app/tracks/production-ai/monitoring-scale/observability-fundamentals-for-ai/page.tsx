"use client";

import { Activity, ScrollText, BarChart3, GitBranch, DollarSign, Gauge, AlertTriangle, ShieldAlert, ThumbsUp } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "monitoring-scale",
  lessonSlug: "observability-fundamentals-for-ai",
  title: "יסודות Observability למערכות AI",
  objectives: [
    "להבין שלושת עמודי ה-observability: logs, metrics, traces — ומה כל אחד פותר",
    "להכיר את המדדים הייחודיים ל-AI (טוקנים, עלות לקריאה, latency, ציוני איכות, שיעור הזיות/סירוב, משוב משתמש)",
    "לדעת מדוע ניטור AI שונה מניטור אפליקציה רגילה (אי-דטרמיניזם, איכות 'מעורפלת')",
    "לזהות מה חייבים לתעד בכל קריאת API בפרודקשן — ואיך עושים זאת בלי לדלוף PII",
  ],
  estMinutes: 35,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: הערכת מודל מותאם מול RAG/פרומפט"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: ’עובד’ אינו ’ניתן-לתחזוקה בפרודקשן’",
    bullets: [
      "AtlasDesk כבר כולל 8+ יכולות אמיתיות. אבל בפרודקשן מגיע היום שבו העלות קפצה פי 3, או שמשתמש טוען ’התשובות נהיו גרועות’ — ובלי נתונים אתה מנחש באפלה.",
      "Observability = היכולת להסביר מה קורה בתוך המערכת מבחוץ, בלי לצטרך לשחזר את התקלה. אתה שואל שאלה חדשה — והנתונים שכבר אספת עונים עליה.",
      "העיקרון: אי אפשר לשפר את מה שלא מודדים. פרומפט ’השתפר’? העלות ’ירדה’? בלי מדידה זו תחושת בטן, לא הנדסה.",
    ],
  },
  {
    title: "שלושת העמודים: logs, metrics, traces",
    bullets: [
      "Logs — רשומת אירוע בודד: ’מה קרה כאן, עכשיו’. קריאה אחת ל-API, עם כל הפרטים שלה.",
      "Metrics — צבירה מספרית לאורך זמן: ’מה המגמה’. עלות ליום, latency חציוני, שיעור שגיאות — מספרים שאפשר לצייר בגרף ולהתריע עליהם.",
      "Traces — מסלול בקשה בודדת דרך כל השלבים: retrieval → הרכבת פרומפט → קריאת מודל → פוסט-פרוססינג. חושף איפה בדיוק הזמן/העלות נשרפו.",
    ],
  },
  {
    title: "מה ש-AI מוסיף מעל ניטור רגיל",
    bullets: [
      "מדדי AI ייחודיים: טוקני קלט/פלט, עלות לקריאה, מספר סיבובי tool-calling, ציוני איכות (eval), שיעור הזיות/סירוב, ומשוב משתמש (👍/👎).",
      "אי-דטרמיניזם: אותו קלט יכול להחזיר פלט שונה. לכן ’עבד בבדיקה’ אינו ערובה — צריך למדוד על התפלגות, לא על דגימה אחת.",
      "איכות היא ’מעורפלת’: אין קוד-שגיאה 500 כשהתשובה פשוט לא טובה. צריך אות-איכות (eval אוטומטי / משוב משתמש) כדי בכלל לראות את הכשל.",
    ],
  },
];

const PILLARS_STEPS: DiagramStep[] = [
  {
    icon: ScrollText,
    label: "Logs — מה קרה",
    detail: "רשומת אירוע לכל קריאה: נתיב, טוקנים, עלות, latency, מספר מקורות RAG, האם היה סירוב. עונה על ’מה בדיוק קרה בקריאה ההיא ב-14:32’.",
  },
  {
    icon: BarChart3,
    label: "Metrics — מה המגמה",
    detail: "צבירה לאורך זמן: עלות/יום, latency חציוני ו-p95, שיעור שגיאות, טוקנים ממוצעים. עונה על ’האם העלות מטפסת השבוע’ — ומאפשר להתריע.",
  },
  {
    icon: GitBranch,
    label: "Traces — איך זרם",
    detail: "פירוק בקשה בודדת לשלבים עם זמן/עלות לכל שלב: retrieval, הרכבת פרומפט, קריאת מודל, ולידציה. עונה על ’איפה בדיוק נשרפו 4 השניות’.",
  },
  {
    icon: ThumbsUp,
    label: "אות-איכות — האם זה טוב",
    detail: "העמוד שרגיל ל-AI: eval אוטומטי או משוב משתמש (👍/👎). בלעדיו תשובה גרועה נראית כמו הצלחה מושלמת — HTTP 200 על זבל.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה שלושת עמודי ה-observability, ולמה כל אחד נחוץ בנפרד?",
    options: [
      "רק logs נחוצים, השאר מיותר",
      "Logs (מה קרה, אירוע ספציפי), Metrics (מגמות מצטברות לאורך זמן), Traces (מסלול בקשה בודדת דרך המערכת) — כל אחד עונה על שאלה שונה",
      "כולם אותו דבר בשם אחר",
      "רק metrics רלוונטי למערכות AI, logs ו-traces רק ל-web רגיל",
    ],
    correctIndex: 1,
    explanation:
      "כל עמוד עונה על שאלה שונה: logs=’מה קרה כרגע’, metrics=’מה המגמה הכללית’, traces=’איך בקשה ספציפית זרמה’. logs לבד לא חושפים מגמה איטית; metrics לבד לא נותנים לחקור מקרה בודד; traces לבד לא נותנים תמונה מצטברת. יחד הם מכסים את שלוש השאלות.",
    optionNotes: [
      "לא נכון: logs לבד לא מראים מגמות (למשל ’עלות עולה בהדרגה לאורך שבוע’) — לזה צריך metrics.",
      "התשובה הנכונה: שלושתם משלימים — כל אחד עונה על שאלה שהשניים האחרים לא עונים עליה.",
      "לא נכון: לכל עמוד תפקיד שונה; הם לא כפילויות של אותו דבר בשמות שונים.",
      "לא נכון: שלושת העמודים רלוונטיים גם ל-AI וגם ל-web — רק המדדים הספציפיים (טוקנים, עלות, איכות) מתווספים ב-AI.",
    ],
  },
  {
    id: "q2",
    question: "מהו ההבדל המהותי שהופך ניטור מערכת AI לשונה מניטור אפליקציית web רגילה?",
    options: [
      "אין הבדל — HTTP 200 מספיק לשתיהן",
      "ב-AI התשובה יכולה להיות שגויה/גרועה בלי שום קוד-שגיאה (איכות מעורפלת), והפלט לא-דטרמיניסטי — לכן צריך אות-איכות ייעודי ומדידה על התפלגות, לא רק סטטוס-קוד",
      "אפליקציות web לא מייצרות לוגים בכלל",
      "ב-AI אסור למדוד latency",
    ],
    correctIndex: 1,
    explanation:
      "באפליקציה רגילה כשל = חריגה/500. במערכת AI התשובה יכולה לחזור עם HTTP 200 ולהיות הזיה מוחלטת. בנוסף אותו קלט מחזיר פלט שונה בין הרצות. לכן ניטור AI מוסיף אות-איכות (eval/משוב) ומדידה על התפלגות במקום דגימה בודדת.",
    optionNotes: [
      "לא נכון: HTTP 200 יכול לעטוף תשובה גרועה לגמרי — סטטוס-קוד לבד לא מגלה כשל איכות.",
      "התשובה הנכונה: איכות מעורפלת + אי-דטרמיניזם הם בדיוק מה שמבדיל, ומחייבים אות-איכות ומדידה סטטיסטית.",
      "לא נכון: אפליקציות web כמובן מייצרות לוגים — זו לא נקודת ההבדל.",
      "לא נכון: latency הוא אחד המדדים החשובים ב-AI (קריאות מודל איטיות); בהחלט מודדים אותו.",
    ],
  },
  {
    id: "q3",
    question: "אתה מתעד כל קריאה כולל הפרומפט והתשובה המלאים, לצורך חקירת תקלות. מה הסיכון ההנדסי המרכזי?",
    options: [
      "אין סיכון — כמה שיותר נתונים תמיד עדיף",
      "לוגים של פרומפט+תשובה עלולים להכיל PII/מידע רגיש של משתמשים; צריך מיסוך/רדקציה, הרשאות גישה ומדיניות שמירה — אחרת הלוג עצמו הופך לדליפת פרטיות",
      "פרומפטים תמיד קצרים מדי מכדי להכיל מידע רגיש",
      "הבעיה היחידה היא שהלוגים תופסים מעט מקום בדיסק",
    ],
    correctIndex: 1,
    explanation:
      "לוג מובנה של פרומפטים+תשובות הוא כלי דיבוג מצוין — אבל התוכן שהמשתמש הזין (שם, טלפון, פרטי חשבון) נשמר איתו. בלי מיסוך PII, הגבלת הרשאות ומדיניות retention, מסד הלוגים הופך למאגר רגיש ולוקטור דליפה. מתעדים מטא-דאטה תמיד, ואת התוכן המלא — בזהירות ובמסוכה.",
    optionNotes: [
      "לא נכון: ’כמה שיותר’ מתעלם מפרטיות, מעלות אחסון ומחוקי הגנת-מידע.",
      "התשובה הנכונה: PII בלוגים היא הסיכון האמיתי; פתרונו רדקציה, הרשאות ומדיניות שמירה.",
      "לא נכון: פרומפטים אמיתיים כן מכילים תדיר מידע רגיש (פניות תמיכה, נתוני לקוח).",
      "לא נכון: מקום בדיסק הוא הדאגה הקטנה; פרטיות היא הקריטית.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: observability למערכות AI", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "pillars",
    label: "עמודי ה-observability — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          שלושת העמודים הקלאסיים (logs / metrics / traces) פותרים כל אחד שאלה אחרת. במערכת AI מתווסף
          עמוד רביעי שקל לשכוח: אות-איכות — כי תשובה גרועה לא מפילה את השרת, היא פשוט מאכזבת בשקט.
        </p>
        <StepDiagram steps={PILLARS_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: לוגינג מינימלי מול observability מלא",
    content: (
      <PromptComparisonLab
        title="קריאה ל-/api/ai/rag-chat ב-AtlasDesk"
        unitLabel="גישת ניטור"
        bad={{
          label: "בלי שום לוגינג מובנה",
          content: `// אין שום תיעוד של מה קרה בקריאה הזו
const response = await client.messages.create(...)
return NextResponse.json({ content: ... })`,
          outcome:
            "אם משהו משתבש בפרודקשן (עלות קופצת, שגיאות מצטברות, איכות יורדת) — אין שום נתון היסטורי לחקור. צריך לחכות שזה יקרה שוב, בזמן אמת, כדי בכלל לתפוס את זה.",
        }}
        good={{
          label: "לוגינג מובנה לכל קריאה",
          content: `logEvent({ route: "rag-chat", inputTokens, outputTokens,
  costUsd, latencyMs, sourcesFound: relevant.length,
  refused: false, userFeedback: null,
  timestamp: Date.now() })`,
          outcome:
            "כל קריאה משאירה עקבות מובנים. אפשר לנתח מגמות (עלות עולה? latency גדל? שיעור הסירובים קפץ?) בלי לחכות שהבעיה תקרה שוב ותפתיע.",
        }}
        takeaway="observability אינו ’נחמד שיהיה’ — הוא ההבדל בין לגלות בעיה תוך דקות מתוך הנתונים, לבין לגלות אותה רק כשמשתמש מתלונן (ואז בלי נתונים לחקור)."
      />
    ),
  },
  {
    id: "ai-signals",
    label: "האותות הייחודיים ל-AI",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <DollarSign size={16} /> עלות וטוקנים
          </p>
          <p className="text-sm text-muted">
            טוקני קלט/פלט לכל קריאה, עלות ב-USD, ומספר סיבובי tool-calling. זה המדד שקופץ בשקט
            כשמישהו מרחיב system prompt או כשסוכן נכנס ללולאה — ובלי ניטור מגלים אותו רק בחשבונית.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Gauge size={16} /> Latency לפי שלב
          </p>
          <p className="text-sm text-muted">
            לא רק ’כמה זמן לקח’ אלא ’איפה’: retrieval מול קריאת מודל מול פוסט-פרוססינג.
            מדוד חציון ו-p95 — הזנב הארוך (p95) הוא מה שמשתמשים מרגישים כ’איטי’.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <ThumbsUp size={16} /> איכות ומשוב
          </p>
          <p className="text-sm text-muted">
            ציוני eval אוטומטיים (למשל ’האם התשובה נשענת על המקורות’) ומשוב משתמש (👍/👎).
            זה האות היחיד שמבחין בין תשובה נכונה לתשובה שרק ’נשמעת’ נכונה.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <ShieldAlert size={16} /> הזיות וסירובים
          </p>
          <p className="text-sm text-muted">
            שיעור הסירובים (’אני לא יכול לעזור בזה’) ושיעור התשובות ללא ביסוס במקורות.
            קפיצה פתאומית באחד מהם היא לרוב סימן שפרומפט או מקור-נתונים השתנו.
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
        why="observability קיים כי מערכות production מורכבות מכדי ’לדעת מה קורה’ מתחושת בטן. הכלל הבסיסי: אי אפשר לשפר (או אפילו לתקן) את מה שלא מודדים."
        alternatives="להסתמך על דיווחי משתמשים (’זה איטי’, ’התשובות גרועות’) — עובד רק בדיעבד, אחרי שהנזק כבר קרה ובלי נתונים לחקור. observability מזהה את המגמה לפני שמישהו מתלונן."
        whenNotTo="לפרוטוטייפ לימודי קטן או הרצה חד-פעמית — observability מלא (traces, דשבורדים, התראות) הוא overhead. מספיק logEvent בסיסי. ההשקעה משתלמת כשהמערכת מגישה משתמשים אמיתיים בפרודקשן."
        commonMistakes="לאסוף נתונים בלי לשאול מה עושים איתם (לוג שאיש לא קורא); למדוד רק ממוצע ולפספס את זנב ה-p95; לתעד HTTP 200 כ’הצלחה’ בלי אות-איכות — כך תשובות גרועות נראות כמו הצלחה."
        performance="הלוגינג עצמו מוסיף מילישניות בודדות; לעולם אל תבצע כתיבה סינכרונית חוסמת לפני החזרת התשובה למשתמש — צבור/כתוב אסינכרונית כדי לא להוסיף latency לנתיב הקריטי."
        cost="הלוגינג כמעט חינמי בזמן ריצה, אבל דורש היכן לאחסן ולנתח (DB/שירות ניטור). התועלת ההפוכה גדולה: זיהוי קפיצת עלות מוקדם חוסך הרבה יותר מעלות האחסון."
        security="לוגים של פרומפט+תשובה עלולים להכיל PII. מסך/רדקט מידע רגיש, הגבל הרשאות גישה, והגדר מדיניות retention. מטא-דאטה (טוקנים, עלות, latency) בטוח לתעד תמיד; תוכן מלא — בזהירות."
        realWorld="Datadog/Grafana/OpenTelemetry הם הסטנדרט התעשייתי; מסביב ל-LLM צצו כלים ייעודיים (LangSmith, Helicone) שמוסיפים בדיוק את מדדי ה-AI. בפרויקט המודול תבנה גרסה מינימלית של זה בתוך AtlasDesk."
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
            <li>מודדים רק ’הצליח/נכשל’ (HTTP) ולא איכות — תשובות גרועות עוברות כהצלחה.</li>
            <li>מסתכלים על ממוצע latency בלבד ומפספסים את ה-p95 שהמשתמשים מרגישים.</li>
            <li>מתעדים פרומפט+תשובה גולמיים עם PII, בלי מיסוך ובלי הגבלת גישה.</li>
            <li>כתיבת לוג סינכרונית חוסמת בנתיב הקריטי — הניטור עצמו מאט את המערכת.</li>
            <li>אוספים המון נתונים אך בלי התראות — אף אחד לא מסתכל עד שמתפוצץ.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מוסיפים אות-איכות (eval אוטומטי + 👍/👎) לצד סטטוס-קוד.</li>
            <li>מדדים חציון ו-p95, ומתריעים על סף (עלות/יום, שיעור שגיאות).</li>
            <li>ממסכים PII, מגבילים הרשאות, ומגדירים מדיניות retention.</li>
            <li>כותבים לוג אסינכרונית/במאגר תור — אפס latency בנתיב הקריטי.</li>
            <li>מגדירים מראש ’מה נחשב אנומליה’ ומחברים לזה התראה.</li>
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
          ["Logs", "רשומות אירועים בודדים — ’מה קרה’ ברגע נתון בקריאה מסוימת."],
          ["Metrics", "מדדים מספריים מצטברים לאורך זמן — מגמות שאפשר לצייר ולהתריע עליהן."],
          ["Traces", "מעקב אחרי בקשה בודדת דרך כל שלבי המערכת, עם זמן/עלות לכל שלב."],
          ["p95 Latency", "הזמן שמתחת אליו נופלות 95% מהקריאות — חושף את הזנב האיטי שממוצע מסתיר."],
          ["Eval score", "ציון איכות אוטומטי לתשובה (למשל האם היא נשענת על המקורות) — אות-האיכות של AI."],
          ["PII", "מידע מזהה אישית (שם, טלפון, ת”ז) שעלול להסתתר בפרומפט/תשובה ודורש מיסוך בלוגים."],
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
          <Activity size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>אי אפשר לשפר את מה ש<strong>לא מודדים</strong> — observability הוא תשתית לכל שיפור.</li>
          <li>שלושה עמודים: <strong>logs</strong> (מה קרה), <strong>metrics</strong> (מגמה), <strong>traces</strong> (מסלול בקשה).</li>
          <li>AI מוסיף <strong>אות-איכות</strong> ומדדי טוקנים/עלות — כי HTTP 200 לא מבחין בתשובה גרועה.</li>
          <li>תעד תמיד מטא-דאטה; תוכן מלא — רק עם <strong>מיסוך PII</strong> ומדיניות שמירה.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="monitoring-observability-fundamentals-for-ai"
        title="תכנן סכמת לוגינג ל-AtlasDesk"
        context="עבוד עם Claude Code — כאן מתכננים, המימוש בפרויקט המסכם של המודול."
        steps={[
          "עם Claude Code, הציעו רשימת שדות ללוג אירוע (event) לכל קריאת AI ב-AtlasDesk — כולל מדדי הטוקנים/עלות/latency ואות-איכות אחד לפחות.",
          "החליטו: אילו שדות בטוח לתעד תמיד (מטא-דאטה), ואילו דורשים מיסוך PII לפני שמירה (הפרומפט/התשובה).",
          "הגדירו סף אחד קונקרטי ל’אנומליה’ (למשל: עלות יומית שחורגת פי 2 מהחציון של השבוע) שעליו הייתם רוצים התראה.",
          "דון: אילו 3 מדדים היו הכי חשובים לך לראות בדשבורד ניטור, ולמה דווקא הם?",
        ]}
        successCriteria={[
          "יש לך סכמת לוג ברורה עם שדות קונקרטיים, כולל אות-איכות",
          "סימנת אילו שדות דורשים מיסוך PII",
          "יש לך הגדרת אנומליה אחת מדידה + רשימת מדדים מנומקת (לא ’לנטר הכל’)",
        ]}
      />
    ),
  },
  {
    id: "homework",
    label: "שיעורי בית",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">שיעורי בית:</p>
        <p className="mt-1 text-muted">
          חשוב על תקלה שהייתה לך לאחרונה בכל מערכת (לא רק AI). איזה <strong>לוג או מדד</strong> היה
          עוזר לך לזהות אותה מהר יותר — ולמה הוא לא היה שם מלכתחילה?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          עכשיו כשאתה מודד עלות וטוקנים, תראה שחלק מהעלות הזו מבוזבז על עיבוד חוזר של אותו תוכן קבוע.
          בשיעור הבא — אסטרטגיות Caching — נלמד לחסוך בדיוק את החלק הזה, בלי להסתכן בתשובות מיושנות.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
