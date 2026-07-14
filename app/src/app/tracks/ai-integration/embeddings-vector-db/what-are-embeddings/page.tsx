"use client";

import { Layers } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EmbeddingExplorer } from "@/components/diagrams/embedding-explorer";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "embeddings-vector-db",
  lessonSlug: "what-are-embeddings",
  title: "מהם Embeddings",
  objectives: [
    "להבין איך טקסט הופך לוקטור מספרים שמייצג משמעות",
    "להבין את המושג similarity (cosine similarity) ולמה הוא מודד קרבה סמנטית",
    "להתנסות בוויזואלייזר embeddings אינטראקטיבי",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: AtlasDesk מקבל כלי אמיתי"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: איך משווים משמעות של שני משפטים?",
    bullets: [
      "חיפוש מילולי (keyword search) מוצא רק התאמות מדויקות של מילים. חיפוש 'איך מבטלים מנוי' לא ימצא מאמר שכתוב 'הליך סיום התחייבות חודשית' — למרות שהם אותו רעיון.",
      "Embeddings פותרים את זה: הופכים כל טקסט לוקטור (רשימת מספרים) שממקם אותו במרחב רב-ממדי לפי משמעות — טקסטים דומים במשמעות מקבלים וקטורים קרובים במרחב, גם אם המילים שונות לגמרי.",
    ],
  },
  {
    title: "איך זה עובד בפועל",
    bullets: [
      "מודל embedding (למשל text-embedding-3 של OpenAI, או מודלים ייעודיים אחרים) מקבל טקסט ומחזיר וקטור באורך קבוע (למשל 1536 מספרים).",
      "הוקטור הזה 'נלמד' באימון כך שמשפטים בעלי משמעות דומה מקבלים וקטורים קרובים גיאומטרית.",
      "המרחק/הקרבה בין שני וקטורים נמדד לרוב ב-cosine similarity — ציון בין 0 (לא קשור) ל-1 (זהה במשמעות).",
    ],
  },
  {
    title: "ממדים (dimensions): יותר לא תמיד עדיף",
    bullets: [
      "מספר הממדים של הוקטור (למשל 1536, 3072) קובע 'כמה ניואנסים' המודל יכול לתפוס — יותר ממדים = יותר קיבולת לייצג הבחנות דקות במשמעות.",
      "אבל יותר ממדים עולה יותר: יותר אחסון בכל שורה, וקטורים כבדים יותר לחישוב similarity, ואינדקסים גדולים יותר. text-embedding-3-small (1536 ממדים) לרוב מספיק ומהיר; 3-large (3072) מדויק מעט יותר אך יקר וכבד יותר.",
      "text-embedding-3 אף מאפשר לקצץ ממדים (Matryoshka) — לבקש למשל 512 ממדים במקום 1536 ולוותר על מעט דיוק תמורת אחסון וחיפוש זולים בהרבה. הבחירה היא trade-off הנדסי, לא 'תמיד הכי גדול'.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה חיפוש מילולי (keyword search) נכשל למצוא 'הליך סיום התחייבות חודשית' כשמחפשים 'איך מבטלים מנוי'?",
    options: [
      "כי חיפוש מילולי תמיד שבור ולא עובד בכלל",
      "כי אין אף מילה זהה בין שתי המחרוזות, למרות שהמשמעות זהה — חיפוש מילולי לא 'מבין' משמעות, רק מתאים מחרוזות",
      "כי המשפטים באורכים שונים",
      "כי חיפוש מילולי עובד רק באנגלית",
    ],
    correctIndex: 1,
    explanation: "חיפוש מילולי מתאים מחרוזות/מילים, לא משמעות — embeddings פותרים בדיוק את זה על ידי ייצוג משמעות כוקטור.",
    optionNotes: [
      "לא נכון: חיפוש מילולי עובד מצוין כשיש התאמת מילים — הבעיה כאן ספציפית: אין שום מילה משותפת בין שני הביטויים.",
      "התשובה הנכונה: זו בדיוק המגבלה של התאמת מחרוזות — היא עיוורת למשמעות, רק בודקת אם אותן מילים מופיעות.",
      "לא נכון: אורך המחרוזת לא רלוונטי לבעיה — גם משפטים קצרים לגמרי יכולים לסבול מאותה בעיה.",
      "לא נכון: הבעיה קיימת בכל שפה — אין קשר לשפה ספציפית.",
    ],
  },
  {
    id: "q2",
    question: "מה מודד cosine similarity בין שני embeddings?",
    options: [
      "את מספר המילים הזהות בין שני הטקסטים",
      "את הקרבה הגיאומטרית בין שני וקטורים במרחב — ציון גבוה יותר = משמעות דומה יותר",
      "את אורך הטקסט המקורי",
      "את מספר הטוקנים שנוצרו מהטקסט",
    ],
    correctIndex: 1,
    explanation: "cosine similarity מודד את הזווית בין שני וקטורים — קרוב ל-1 כשהם 'מצביעים' לאותו כיוון במרחב, כלומר משמעות דומה.",
    optionNotes: [
      "לא נכון: זו הגדרת התאמה מילולית, לא similarity וקטורי — embeddings לא סופרים מילים זהות בכלל.",
      "התשובה הנכונה: cosine similarity הוא מדד גיאומטרי טהור — הוא לא 'יודע' כלום על המילים המקוריות, רק על המיקום היחסי של הוקטורים.",
      "לא נכון: אורך הטקסט המקורי לא נכנס לחישוב ה-similarity בין הוקטורים.",
      "לא נכון: מספר הטוקנים קשור לעלות/tokenization (נלמד במודול הקודם), לא ל-similarity.",
    ],
  },
  {
    id: "q3",
    question: "צוות בוחר בין מודל embedding של 1536 ממדים לאחד של 3072 ממדים לחיפוש במאמרי עזרה. מה השיקול ההנדסי הנכון?",
    options: [
      "תמיד לבחור 3072 — יותר ממדים תמיד נותנים תוצאות טובות יותר",
      "יותר ממדים נותנים קיבולת לניואנסים דקים יותר, אך עולים יותר באחסון, בזמן חישוב similarity ובגודל אינדקס — לרוב מקרים 1536 מספיק, וכדאי למדוד לפני שמשלמים על 3072",
      "תמיד לבחור 1536 — 3072 הוא באג שלא כדאי להשתמש בו",
      "מספר הממדים לא משפיע על שום דבר מעשי, זו רק החלטה שרירותית",
    ],
    correctIndex: 1,
    explanation:
      "ממדים הם trade-off: יותר ממדים מעלים את תקרת הדיוק אך מייקרים אחסון, חישוב וזיכרון אינדקס. ההחלטה ההנדסית היא למדוד recall על סט שאילתות אמיתי — אם 1536 כבר עונה על היעד, אין סיבה לשלם על 3072. מודלים כמו text-embedding-3 אף מאפשרים לקצץ ממדים לפי הצורך.",
    optionNotes: [
      "לא נכון: 'תמיד הכי גדול' זו חשיבה לא-הנדסית — ממדים נוספים עולים כסף/latency ולא תמיד משפרים תוצאה מורגשת.",
      "התשובה הנכונה: זו בדיוק הפשרה — קיבולת ניואנס מול עלות/מהירות; מודדים recall אמיתי ומחליטים לפי היעד.",
      "לא נכון: 3072 הוא מודל תקין לגמרי (text-embedding-3-large) — פשוט יקר וכבד יותר, לא באג.",
      "לא נכון: הממדים משפיעים מאוד — על אחסון, מהירות חיפוש, וגודל אינדקס — זו לא החלטה שרירותית.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מטקסט לוקטור משמעות", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "explorer",
    label: "Embedding Explorer — נסה בעצמך",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          לחץ על שתי מילים כדי לראות איך הקרבה במרחב (מדומה כאן לצורך המחשה — ב-embeddings אמיתיים
          יש מאות/אלפי ממדים, לא רק 2) משקפת קרבה סמנטית.
        </p>
        <EmbeddingExplorer />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: חיפוש מילולי מול חיפוש סמנטי",
    content: (
      <PromptComparisonLab
        title="שאילתת חיפוש במאמרי עזרה של AtlasDesk"
        unitLabel="שיטת חיפוש"
        bad={{
          label: "חיפוש מילולי (keyword match)",
          content: `שאילתה: "איך מבטלים מנוי"
מאמרי עזרה זמינים: "הליך סיום התחייבות חודשית", "שינוי תוכנית תשלום"`,
          outcome: "אף מאמר לא נמצא — אין התאמת מילים בין 'מבטלים מנוי' ל'סיום התחייבות'. המשתמש מקבל 'לא נמצאו תוצאות' על שאלה שיש לה תשובה מצוינת במאמרים.",
        }}
        good={{
          label: "חיפוש סמנטי (embeddings + similarity)",
          content: `שאילתה: "איך מבטלים מנוי"
→ embedding של השאילתה מושווה ל-embeddings של כל המאמרים
→ "הליך סיום התחייבות חודשית" מקבל similarity גבוה (0.87)`,
          outcome: "המאמר הרלוונטי נמצא למרות שאין מילה משותפת אחת — כי המשמעות דומה, לא הניסוח.",
        }}
        takeaway="חיפוש סמנטי לא 'טוב יותר' תמיד — הוא פותר בעיה ספציפית (משמעות דומה, ניסוח שונה) שחיפוש מילולי לא יכול לפתור מטבעו. לפעמים שילוב של שניהם (hybrid search) הוא הפתרון הטוב ביותר."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="embeddings קיימים כי מחשבים לא 'מבינים' טקסט גולמי — הם צריכים ייצוג מספרי שניתן להשוות/לחשב עליו. וקטור הוא הדרך שנמצאה הכי יעילה לייצג משמעות בצורה שניתן למדוד קרבה ביניהם."
        alternatives="חלופה: thesaurus/מילון מילים נרדפות ידני — עובד לתחום מוגבל וידוע מראש, אבל לא מתמודד עם ניסוחים חדשים/יצירתיים שלא נצפו מראש. פרט אינטגרציה חשוב: ל-Anthropic אין API embeddings ילידי — Claude מצוין לשיחה, אבל ל-embeddings בפועל משתמשים בספק אחר (בקורס: OpenAI text-embedding-3-small). זה נורמלי לגמרי לשלב ספקים לפי מה שכל אחד עושה הכי טוב."
        whenNotTo="לחיפוש שבו דיוק מילולי מדויק חשוב (למשל חיפוש מספר הזמנה או קוד שגיאה ספציפי) — embeddings לא מתאימים, כי הם מוצאים 'דומה', לא 'זהה'."
        commonMistakes="להשתמש ב-embeddings לבד בלי fallback לחיפוש מילולי — לפעמים המשתמש מחפש בדיוק ID/קוד ספציפי, ואז חיפוש סמנטי 'מדויק מדי כלפי משמעות' עלול לפספס. בשילוב (hybrid) עדיף. טעות נוספת: להשוות embeddings משני מודלים שונים — וקטורים ממודלים שונים חיים במרחבים שונים, ה-similarity ביניהם חסר-משמעות."
        performance="cosine similarity הוא זול לחישוב לזוג בודד, אבל חיפוש 'הכי דומה' מול מיליון וקטורים מצריך אינדקס ANN (השיעור הבא). כמו כן, embeddings של טקסט לא-משתנה כדאי לחשב פעם אחת ולשמור (cache) — לא לחשב מחדש בכל בקשה."
        cost="חישוב embedding לכל טקסט הוא קריאת API (עולה טוקנים, אם כי בעלות נמוכה משמעותית מקריאת שיחה מלאה) — וגם צריך לאחסן ולחפש בין הוקטורים (השיעור הבא: מסדי נתונים וקטוריים). text-embedding-3-small זול משמעותית מ-3-large, ולרוב מספיק."
        maintenance="נעילת מודל: אם תחליף מודל embedding, כל הוקטורים הישנים כבר לא ניתנים להשוואה מול החדשים — צריך לחשב מחדש (re-embed) את כל המאגר. לכן החלפת מודל היא החלטה יקרה, ובוחרים מודל בכובד ראש."
        realWorld="בפרויקט המודול הבא תבנה בדיוק את זה: embeddings למאמרי העזרה של AtlasDesk, כדי לאפשר חיפוש סמנטי אמיתי."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות פרודקשן נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר מערכות בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>מחשבים embedding לכל המאמרים מחדש בכל שאילתה — בזבוז עלות ו-latency ענק.</li>
            <li>מערבבים וקטורים משני מודלים שונים ומשווים ביניהם — ה-similarity חסר-משמעות.</li>
            <li>מסתמכים על חיפוש סמנטי לבד גם כשהמשתמש מחפש מספר הזמנה/קוד מדויק — ומפספסים.</li>
            <li>בוחרים 3072 ממדים ”ליתר ביטחון” בלי למדוד — משלמים על אחסון וחיפוש כבדים ללא שיפור מורגש.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מחשבים embedding פעם אחת בכתיבה, שומרים (pre-computed), וחוזרים אליו בחיפוש.</li>
            <li>מקבעים מודל embedding אחד לכל המאגר; החלפת מודל = re-embed מלא מתוכנן.</li>
            <li>משלבים חיפוש מילולי + סמנטי (hybrid) — כל אחד מכסה את החולשה של השני.</li>
            <li>מודדים recall על סט שאילתות אמיתי ובוחרים את מספר הממדים הזול ביותר שעומד ביעד.</li>
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
          ["Embedding", "וקטור מספרים שמייצג את המשמעות הסמנטית של טקסט."],
          ["Cosine Similarity", "מדד גיאומטרי לקרבה בין שני וקטורים — 0 עד 1."],
          ["Semantic Search", "חיפוש לפי משמעות (embeddings), בניגוד לחיפוש מילולי."],
          ["Hybrid Search", "שילוב חיפוש מילולי וסמנטי לתוצאות טובות יותר."],
          ["Dimensions", "מספר הרכיבים בוקטור (למשל 1536) — קיבולת הניואנס מול עלות אחסון/חישוב."],
          ["Re-embed", "חישוב מחדש של כל הוקטורים במאגר, נדרש כשמחליפים מודל embedding."],
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
          <li>Embedding = <strong>וקטור שמייצג משמעות</strong> — טקסטים דומים במשמעות קרובים במרחב, גם בניסוח שונה.</li>
          <li><strong>cosine similarity</strong> מודד את הקרבה הזו — מדד גיאומטרי טהור, עיוור למילים המקוריות.</li>
          <li>מספר ה<strong>ממדים</strong> הוא trade-off: יותר קיבולת ניואנס מול עלות; מודדים לפני שמשלמים על הגדול.</li>
          <li>ל-Anthropic <strong>אין embeddings ילידי</strong> — משלבים ספק (OpenAI text-embedding-3-small). שילוב ספקים הוא נורמלי.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="embeddings-what-are-embeddings"
        title="חקור embeddings אמיתיים עם Claude Code"
        context="לא צריך API key בשיעור הזה — המשימה היא הבנה והכנה לקראת השיעורים הבאים."
        steps={[
          "שאל את Claude Code: \"אילו מודלי embedding ידועים לך (OpenAI, Cohere, מודלים פתוחים) ומה ההבדלים המרכזיים ביניהם?\"",
          "בקש ממנו לכתוב פונקציית JS/TS קטנה (בלי להריץ בפועל) שמחשבת cosine similarity בין שני מערכים של מספרים.",
          "בדוק את הקוד: האם אתה מבין כל שורה? אם לא, בקש הסבר.",
        ]}
        successCriteria={[
          "אתה מכיר לפחות 2 אפשרויות אמיתיות למודל embedding",
          "יש לך פונקציית cosine similarity שאתה מבין לעומק, לא רק מעתיק",
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
          חשוב על 3 זוגות משפטים: זוג אחד עם משמעות דומה וניסוח שונה לגמרי (embeddings ימצאו),
          זוג אחד עם ID/קוד מדויק שצריך להתאים (embeddings לא מתאימים, keyword כן), וזוג אחד
          שקשה להחליט. זה יעזור לך לפתח אינטואיציה למתי כל שיטת חיפוש מתאימה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
