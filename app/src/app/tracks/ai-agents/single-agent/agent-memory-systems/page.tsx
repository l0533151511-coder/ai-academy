"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-agents",
  moduleSlug: "single-agent",
  lessonSlug: "agent-memory-systems",
  title: "מערכות זיכרון לסוכנים",
  objectives: [
    "להבחין בין short-term memory (בתוך לולאה בודדת) ל-long-term memory (בין הרצות)",
    "להבין מתי RAG משמש כזיכרון long-term של סוכן",
    "לתכנן איזה מידע לשמר בזיכרון ואיזה 'לזרוק' כדי לא לפוצץ את חלון ההקשר",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["agent-loop-anatomy"],
};

const SLIDES: Slide[] = [
  {
    title: "שני סוגי זיכרון, שני צרכים שונים",
    bullets: [
      "Short-term memory — כל מה שקורה *בתוך* ריצה בודדת של הלולאה: הצעדים שכבר בוצעו, התוצאות שהתקבלו. נעלם כשהלולאה מסתיימת (כמו ה-conversation array בתוך tool-chat).",
      "Long-term memory — מידע ששורד *בין* ריצות: מה שהסוכן 'למד' בפעם הקודמת, העדפות משתמש, היסטוריה. חייב להישמר במקום חיצוני (DB, קובץ) — לא ב-RAM של הבקשה.",
      "AtlasDesk כבר יש לו את שני הסוגים בפועל: היסטוריית השיחה ב-localStorage היא long-term (שורדת רענון דף), וה-conversation array בתוך tool-chat/rag-chat הוא short-term (חי רק בזמן הקריאה הבודדת).",
    ],
  },
  {
    title: "RAG כזיכרון long-term",
    bullets: [
      "אחת הדרכים הנפוצות לתת לסוכן 'זיכרון' ארוך-טווח היא בדיוק RAG שבנית במודול הקודם: שומרים embeddings של אינטראקציות/עובדות קודמות, ומאחזרים אותן כשרלוונטי.",
      "זה שונה מ-RAG על מסמכי מוצר (מה שבנית ב-AtlasDesk) — כאן ה-'מסמכים' הם ההיסטוריה של הסוכן עצמו, לא תיעוד חיצוני.",
    ],
  },
  {
    title: "מה לשמר, מה 'לזרוק'",
    bullets: [
      "לא כל מה שקרה ב-short-term memory שווה שמירה ב-long-term — פרטים חד-פעמיים (למשל 'המשתמש ניסה קודם לחפש AD-9999 ולא נמצא') לרוב לא שווים שמירה קבועה.",
      "כלל אצבע: לשמר עובדות/החלטות שישפיעו על אינטראקציות עתידיות (למשל 'המשתמש מעדיף תשובות קצרות'), לא את כל תהליך החשיבה המלא של כל ריצה.",
      "בדיוק כמו ניהול context שלמדת במודול Claude Code Mastery — 'לשמור הכל' עולה בטוקנים ומקשה על מציאת מה שבאמת רלוונטי.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין short-term memory ל-long-term memory בסוכן?",
    options: [
      "אין הבדל, שני המונחים מתארים את אותו דבר",
      "short-term נעלם בסוף כל ריצה של הלולאה (חי ב-RAM של הבקשה); long-term נשמר במקום חיצוני ושורד בין ריצות שונות",
      "short-term זול יותר, long-term תמיד יקר יותר",
      "long-term עובד רק עם מודלים גדולים",
    ],
    correctIndex: 1,
    explanation: "בדיוק כמו conversation array (short-term, נעלם בסוף הבקשה) מול localStorage (long-term, שורד בין בקשות) שכבר ראית ב-AtlasDesk.",
    optionNotes: [
      "לא נכון: יש הבדל מהותי — משך החיים של המידע (בקשה בודדת מול לאורך זמן).",
      "התשובה הנכונה: זה בדיוק ההבדל — short-term הוא זיכרון זמני של ריצה אחת, long-term נשמר במקום חיצוני ונגיש גם בריצות עתידיות.",
      "לא נכון: העלות לא תלויה בסוג הזיכרון עצמו, אלא בכמות המידע ובאיך משתמשים בו.",
      "לא נכון: אין קשר לגודל המודל — זו החלטת ארכיטקטורה של האפליקציה, לא יכולת מודל.",
    ],
  },
  {
    id: "q2",
    question: "למה לא כדאי לשמור את כל תהליך החשיבה המלא של כל ריצה ב-long-term memory?",
    options: [
      "טכנית אי אפשר לשמור טקסט ארוך במסד נתונים",
      "כי זה מנפח את הזיכרון עם מידע לא-רלוונטי לעתיד, ומייקר/מקשה על אחזור המידע שבאמת חשוב בהמשך",
      "כי זה אסור על פי חוק הגנת הפרטיות",
      "כי מודלי שפה לא מסוגלים לקרוא טקסט ארוך",
    ],
    correctIndex: 1,
    explanation: "בדיוק כמו ניהול context שלמדת קודם — 'לשמור הכל' עולה בעלות ומקשה על מציאת המידע הרלוונטי כשבאמת צריך אותו.",
    optionNotes: [
      "לא נכון: אין מגבלה טכנית על שמירת טקסט ארוך במסד נתונים — זו שאלה של תכנון, לא יכולת.",
      "התשובה הנכונה: מידע עודף ב-long-term memory הוא בדיוק כמו context עודף — עולה כסף ומקשה על retrieval ממוקד.",
      "לא נכון: זו אינה סוגיה משפטית בהקשר הזה — זו החלטת ארכיטקטורה הנדסית.",
      "לא נכון: מודלים כן מסוגלים לקרוא טקסט ארוך (עד גבול חלון ההקשר) — הבעיה היא יעילות, לא יכולת.",
    ],
  },
  {
    id: "q3",
    question: "אתה שומר ב-long-term memory 'עובדות' שהסוכן מסיק בעצמו משיחות. מה הסיכון ההנדסי המרכזי בכך?",
    options: [
      "אין סיכון — כל מה שהמודל מסיק הוא נכון בהגדרה",
      "עובדה שגויה (הזיה, או פרט שהמשתמש שינה מאז) נשמרת לתמיד ומזהמת כל שיחה עתידית — 'memory poisoning'",
      "מסדי נתונים לא יכולים לאחסן טקסט שהמודל מייצר",
      "long-term memory תמיד מוחק את ה-short-term memory",
    ],
    correctIndex: 1,
    explanation:
      "זיכרון הוא רק טוב כמו איכות מה שנכתב אליו. אם הסוכן מסיק עובדה שגויה ('הלקוח בתוכנית Free' כשהוא בעצם Enterprise) ושומר אותה, כל שיחה עתידית תישען על שקר. מקצוענים מגבילים מה נכתב לזיכרון (רק עובדות מאומתות/מפורשות מהמשתמש), מתייגים כל עובדה במקור ובתאריך, ומאפשרים דריסה/תפוגה.",
    optionNotes: [
      "לא נכון: המודל מסיק גם עובדות שגויות (הזיות) — שמירה עיוורת שלהן מסוכנת.",
      "התשובה הנכונה: memory poisoning — עובדה שגויה שנשמרה מזהמת כל אחזור עתידי, וקשה לאתר אותה.",
      "לא נכון: אחסון טקסט אינו הבעיה — הבעיה היא *אמינות* התוכן שנשמר.",
      "לא נכון: אלו שתי שכבות נפרדות; long-term לא מוחק short-term.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: שני סוגי זיכרון", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: זיכרון בלתי-מנוהל מול מנוהל",
    content: (
      <PromptComparisonLab
        title="מה שומרים בזיכרון long-term של סוכן AtlasDesk"
        unitLabel="אסטרטגיית זיכרון"
        bad={{
          label: "שמור הכל, לתמיד",
          content: `כל הודעה, כל תוצאת כלי, כל 'מחשבה' של הסוכן —
נשמרים ב-DB ללא הגבלה, ומוזרקים חזרה לכל שיחה עתידית.`,
          outcome: "אחרי כמה חודשים, כל שיחה חדשה 'גוררת' אלפי הודעות ישנות לא-רלוונטיות — עולה בטוקנים, ומקשה על המודל למצוא מה שבאמת חשוב עכשיו.",
        }}
        good={{
          label: "שימור סלקטיבי של עובדות רלוונטיות",
          content: `רק החלטות/העדפות שישפיעו על העתיד נשמרות
(למשל: "הלקוח בתוכנית Enterprise", "מעדיף תשובות קצרות") —
לא כל תהליך החשיבה המלא של כל שיחה.`,
          outcome: "הזיכרון נשאר קטן וממוקד — כל עובדה שמורה היא כזו שבאמת משפיעה על איכות התשובה הבאה.",
        }}
        takeaway="זיכרון long-term טוב הוא לא 'לוג מלא של הכל' — הוא תמצית מתוחזקת של מה שבאמת חשוב לזכור. זה בדיוק אותו עיקרון כמו CLAUDE.md טוב (מודול Claude Code Mastery): תמציתי ופעולתי, לא ארכיון מלא."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הבחנה בין short-term ל-long-term memory קיימת כי לכל אחד תכונות ביצועים/עלות שונות לגמרי — short-term חי בזיכרון החם של הבקשה (מהיר, חינמי, זמני); long-term דורש אחסון+retrieval (איטי יותר, עולה כסף, אבל קבוע)."
        alternatives="אפשר 'לדמות' long-term memory ע'י שליחת כל ההיסטוריה בכל בקשה (כמו localStorage הנוכחי ב-AtlasDesk) — עובד לכמות קטנה, אבל לא סקלבילי כשההיסטוריה גדלה למאות הודעות."
        whenNotTo="לסוכן חד-פעמי (כמו כלי CLI שרץ פעם ותם) — אין טעם ב-long-term memory כלל, כי אין 'פעם הבאה' לזכור עבורה."
        commonMistakes="לבלבל בין 'context ארוך' ל'long-term memory אמיתי' — לשלוח היסטוריה ארוכה בכל בקשה זה לא long-term memory, זה רק short-term memory שגדל מדי (בדיוק הבעיה שלמדת בניהול context)."
        cost="long-term memory אמיתי (DB + embeddings) עולה באחסון + בקריאות embedding לכל שמירה/אחזור — אבל חוסך בטווח הארוך על ידי הקטנת כמות ה-context שנשלח בכל בקשה."
        security="זיכרון הוא נתון רגיש: אם שומרים העדפות/פרטי לקוח, זה כפוף לפרטיות (GDPR — זכות למחיקה, ולכן חייבים מנגנון מחיקה לפי משתמש). מסוכן במיוחד: 'memory poisoning' — טקסט מהמשתמש שנשמר עלול להכיל הוראות זדוניות שיוזרקו לשיחה עתידית (prompt injection דרך הזיכרון). כלל: אחסן זיכרון מבודד לכל משתמש, ואל תערבב זיכרון של משתמש אחד בשיחה של אחר."
        maintenance="זיכרון דורש תחזוקה פעילה, לא 'שמור ושכח': מדיניות תפוגה (עובדות ישנות שכבר לא רלוונטיות), אפשרות דריסה (המשתמש שינה כתובת), ותיוג כל עובדה במקור ובתאריך כדי שאפשר יהיה לבקר ולתקן. זיכרון בלי מנגנון ניקוי הופך תוך חודשים לזבל שמזיק יותר מלעזור."
        realWorld="ב-AtlasDesk, localStorage הוא long-term memory פרימיטיבי (שומר הכל). שיפור אמיתי לפרודקשן: לסכם שיחות ישנות ל'עובדות מפתח' בלבד, בדיוק כפי שדנו כאן."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות פרודקשן נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר זיכרון בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>שומרים הכל לתמיד — הזיכרון תופח, כל שיחה גוררת אלפי הודעות לא-רלוונטיות ומתייקרת.</li>
            <li>שומרים עובדות שהמודל הזה (הזיה) בלי אימות — memory poisoning שמזהם כל שיחה עתידית.</li>
            <li>מבלבלים 'context ארוך' ב-'long-term memory' — שולחים היסטוריה עצומה בכל בקשה במקום לאחסן ולאחזר.</li>
            <li>אין בידוד בין משתמשים — זיכרון של לקוח אחד זולג לשיחה של אחר (דליפת פרטיות).</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>שומרים סלקטיבית — רק עובדות/החלטות שישפיעו על העתיד, לא כל תהליך החשיבה.</li>
            <li>מתייגים כל עובדה במקור ובתאריך, ומאפשרים דריסה ותפוגה.</li>
            <li>מאחזרים רלוונטי בלבד (RAG על הזיכרון) במקום להזריק את כל ההיסטוריה.</li>
            <li>מאחסנים זיכרון מבודד לכל משתמש עם מנגנון מחיקה (זכות פרטיות).</li>
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
          ["Short-term memory", "מידע שחי רק בתוך ריצה בודדת של לולאת הסוכן."],
          ["Long-term memory", "מידע שנשמר במקום חיצוני ושורד בין ריצות שונות."],
          ["זיכרון סלקטיבי", "שמירת עובדות/החלטות רלוונטיות בלבד, לא ארכיון מלא."],
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
        id="single-agent-agent-memory-systems"
        title="תכנן סכמת long-term memory לסוכן AtlasDesk"
        context="עבוד עם Claude Code, בלי צורך לממש בפועל בשיעור הזה — זה יקרה בפרויקט המודול."
        steps={[
          "בקש מ-Claude Code להציע טיפוס TypeScript ל'עובדת זיכרון' (agent memory fact) — מה השדות הנחוצים (תוכן, תאריך, רלוונטיות)?",
          "דון: איזה מידע מתוך שיחה טיפוסית ב-AtlasDesk היה שווה לשמר כ-long-term memory, ואיזה לא?",
          "שאל את הסוכן: איך אפשר למנוע מהזיכרון 'לתפוח' עם הזמן (כמו strategy לניקוי עובדות ישנות/לא-רלוונטיות)?",
          "דיבוג: תן ל-Claude Code דוגמה של 'עובדת זיכרון' שגויה שהסוכן שמר (למשל 'הלקוח בתוכנית Free' כשהוא Enterprise), ותאר תרחיש שבו היא מזהמת שיחה עתידית. בקש ממנו להציע איך היית מזהה ומתקן את זה — מה חסר בסכמה שלך כדי שזה יהיה ניתן-לתיקון (מקור? תאריך? מנגנון דריסה?).",
        ]}
        successCriteria={[
          "יש לך טיפוס ברור לעובדת זיכרון, לא רעיון מעורפל",
          "אתה יכול לתת 2-3 דוגמאות קונקרטיות למידע ששווה/לא-שווה שימור",
          "הסכמה שלך כוללת שדות שמאפשרים לזהות ולתקן עובדה שגויה (מקור/תאריך/דריסה), לא רק תוכן",
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
          עבור על היסטוריית שיחה ארוכה שלך עם Claude Code או כל AI אחר. סמן אילו חלקים היו
          שווים שימור כ-long-term memory (עובדות שממשיכות להיות רלוונטיות) ואילו היו רק
          &quot;רעש&quot; חד-פעמי שאפשר לזרוק.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
