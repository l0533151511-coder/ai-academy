"use client";

import { Database, Search, Layers, Gauge } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "embeddings-vector-db",
  lessonSlug: "vector-databases",
  title: "מסדי נתונים וקטוריים",
  objectives: [
    "להבין למה צריך מסד נתונים ייעודי לחיפוש בין וקטורים",
    "להכיר את pgvector כתוסף ל-Postgres/Supabase",
    "להבין אינדקסים וקטוריים ברמת עקרון (למה חיפוש מדויק לא סקלבילי)",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["what-are-embeddings"],
};

const SLIDES: Slide[] = [
  {
    title: "למה לא פשוט לשמור וקטורים בטבלה רגילה",
    bullets: [
      "אפשר טכנית לשמור embedding (מערך של 1536 מספרים) בעמודה רגילה — אבל איך מוצאים את 'הכי דומה' מתוך מיליון שורות? צריך לחשב similarity מול כל שורה, אחת-אחת — זה איטי מדי בקנה מידה.",
      "מסד נתונים וקטורי (או תוסף ווקטורי כמו pgvector) מוסיף אינדקסים ייעודיים שמאפשרים 'מצא את K הקרובים ביותר' בזמן סביר, גם על מיליוני רשומות.",
    ],
  },
  {
    title: "pgvector — הבחירה הטבעית ל-Supabase",
    bullets: [
      "pgvector הוא תוסף (extension) ל-PostgreSQL שמוסיף טיפוס נתונים vector ואופרטורי דמיון (<->, <#>, <=>) ישירות ב-SQL.",
      "כיוון ש-Supabase הוא Postgres, אין צורך במסד נתונים נפרד — pgvector מתווסף לאותו מסד שכבר יש לך, בטבלה חדשה או עמודה חדשה.",
      "זו בדיוק הסיבה ש-AtlasDesk (שכבר משתמש ב-Supabase) יכול להוסיף חיפוש סמנטי בלי להוסיף שירות נפרד לגמרי.",
    ],
  },
  {
    title: "אינדקסים וקטוריים ברמת עקרון",
    bullets: [
      "חיפוש 'מדויק' (exact nearest neighbor) דורש להשוות מול כל וקטור — O(n), איטי על נתונים גדולים.",
      "אינדקסים כמו HNSW/IVFFlat מאפשרים חיפוש 'קרוב מספיק' (approximate nearest neighbor) הרבה יותר מהר — משלמים מעט דיוק תמורת מהירות עצומה.",
      "לרוב אפליקציות, הדיוק המקורב מספיק לגמרי — ההבדל בין התוצאה ה-99% מדויקת להיה 100% מדויקת כמעט ולא מורגש למשתמש.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: Database, label: "1. שמירה", detail: "כל מאמר/מסמך נשמר עם עמודת embedding (vector) לצד התוכן הרגיל שלו — אותה טבלה ב-Postgres." },
  { icon: Layers, label: "2. אינדקס", detail: "אינדקס וקטורי (HNSW/IVFFlat) נבנה על עמודת ה-embedding, מאפשר חיפוש מהיר גם על כמויות גדולות." },
  { icon: Search, label: "3. שאילתה", detail: "שאילתת המשתמש הופכת ל-embedding, ואז 'SELECT ... ORDER BY embedding <-> query_embedding LIMIT 5' מוצא את הקרובים ביותר." },
  { icon: Gauge, label: "4. פשרת דיוק/מהירות", detail: "אינדקסים מקורבים (approximate) מהירים משמעותית ממדויקים (exact), במחיר דיוק זעיר כמעט לא מורגש." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה חיפוש 'הכי דומה' על מיליון וקטורים איטי בלי אינדקס ייעודי?",
    options: [
      "כי וקטורים תופסים יותר מקום דיסק מטקסט רגיל",
      "כי בלי אינדקס צריך לחשב similarity מול כל וקטור בטבלה בנפרד (O(n)) — לא סקלבילי כשn גדל",
      "כי Postgres לא תומך בעמודות מסוג vector בכלל",
      "כי embeddings תמיד באורך משתנה, מה שמקשה על אינדוקס",
    ],
    correctIndex: 1,
    explanation: "בלי אינדקס וקטורי, כל שאילתה דורשת מעבר על כל השורות וחישוב similarity לכל אחת — עלות ליניארית שהופכת לאיטית מאוד בקנה מידה גדול.",
    optionNotes: [
      "לא נכון: תפוסת דיסק היא שיקול נפרד לגמרי מהירות חיפוש — לא הסיבה לאיטיות.",
      "התשובה הנכונה: זו בדיוק הבעיה שאינדקסים וקטוריים פותרים — הופכים חיפוש מ-O(n) למהיר משמעותית.",
      "לא נכון: pgvector בדיוק מוסיף תמיכה בטיפוס vector ל-Postgres — הטענה שגויה עובדתית.",
      "לא נכון: embeddings מאותו מודל הם תמיד באורך קבוע (למשל תמיד 1536 מספרים) — לא באורך משתנה.",
    ],
  },
  {
    id: "q2",
    question: "מה הפשרה (trade-off) של אינדקסים וקטוריים מקורבים (approximate, כמו HNSW)?",
    options: [
      "אין שום פשרה, הם תמיד מדויקים ומהירים גם יחד",
      "מהירות משמעותית תמורת דיוק מעט נמוך יותר מחיפוש מדויק מלא — לרוב האפליקציות ההפרש לא מורגש",
      "הם מדויקים יותר אבל איטיים יותר מחיפוש מדויק",
      "הם עובדים רק על טקסט באנגלית",
    ],
    correctIndex: 1,
    explanation: "אינדקסים מקורבים מוותרים על ערבות ל-100% דיוק כדי להשיג מהירות גבוהה בהרבה — פשרה סבירה כמעט תמיד בפועל.",
    optionNotes: [
      "לא נכון: יש כאן פשרה אמיתית — 'תמיד מדויק ומהיר גם יחד' זה בדיוק מה שאין (אחרת לא היה צריך את הבחירה בין exact ל-approximate).",
      "התשובה הנכונה: זה בדיוק ההגדרה של approximate nearest neighbor — משלמים מעט דיוק בשביל מהירות עצומה.",
      "לא נכון: זה הפוך — אינדקסים מקורבים מהירים יותר, לא איטיים יותר, מחיפוש מדויק.",
      "לא נכון: אינדקסים וקטוריים עובדים על וקטורים מספריים — אין קשר לשפת המקור של הטקסט.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: למה צריך מסד נתונים ייעודי", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "תהליך: מ-embedding לתוצאת חיפוש", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: חיפוש וקטורי בלי אינדקס מול עם אינדקס",
    content: (
      <PromptComparisonLab
        title="חיפוש סמנטי על 500,000 מאמרי עזרה"
        unitLabel="גישה"
        bad={{
          label: "בלי אינדקס וקטורי",
          content: `SELECT * FROM articles
ORDER BY embedding <-> query_embedding
LIMIT 5;
-- על עמודת vector בלי אינדקס: full scan על 500K שורות`,
          outcome: "כל שאילתה סורקת את כל הטבלה וחושבת similarity ל-500,000 שורות — עשוי לקחת שניות ארוכות, לא מתאים לחוויית משתמש בזמן אמת.",
        }}
        good={{
          label: "עם אינדקס HNSW",
          content: `CREATE INDEX ON articles USING hnsw (embedding vector_cosine_ops);

SELECT * FROM articles
ORDER BY embedding <-> query_embedding
LIMIT 5;
-- אותה שאילתה בדיוק, אבל האינדקס מקצר את מרחב החיפוש דרמטית`,
          outcome: "אותה שאילתה SQL בדיוק — אבל עם אינדקס, זמן התגובה יורד מסדרי גודל (מילישניות במקום שניות).",
        }}
        takeaway="השאילתה עצמה לא משתנה — האינדקס הוא כל ההבדל. זה מזכיר אינדקסים רגילים במסדי נתונים: לא משנים את הקוד שמריץ שאילתות, רק מוסיפים תשתית שמאיצה אותן."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="אינדקסים וקטוריים קיימים כי חיפוש 'הדמיון הכי גבוה' דורש מהותית סריקה של המרחב — אינדקס טוב מארגן את המרחב הזה מראש כך שאין צורך לבדוק כל אפשרות."
        alternatives="אפשר להשתמש במסד נתונים וקטורי ייעודי נפרד (Pinecone, Weaviate, Qdrant) במקום pgvector — עדיף כשצריך סקייל עצום מאוד או פיצ'רים מתקדמים במיוחד; pgvector מספיק ועדיף לרוב האפליקציות שכבר משתמשות ב-Postgres."
        whenNotTo="לכמות קטנה של וקטורים (מאות בודדות, כמו מאמרי עזרה של מוצר קטן) — גם בלי אינדקס בכלל, חיפוש ליניארי בזיכרון מהיר מספיק. אין טעם להוסיף מורכבות לפני שיש בעיה אמיתית. כלל אצבע: מתחת לכמה אלפי וקטורים, in-memory (או full scan) פשוט יותר וגם מהיר מספיק."
        commonMistakes="להוסיף אינדקס וקטורי לפני שיש בכלל מספיק נתונים כדי להצדיק אותו — אינדקס על 50 שורות הוא בזבוז, לא אופטימיזציה. טעות נוספת: לשכוח שסינון metadata (WHERE lang='he') לצד חיפוש וקטורי יכול לפגוע ב-recall של האינדקס — צריך לתכנן איך משלבים סינון עם ANN."
        performance="metadata filtering חשוב בפרודקשן: לרוב לא מחפשים בכל המאגר אלא בתת-קבוצה (למשל רק מאמרים של אותו לקוח/שפה). pgvector תומך ב-WHERE רגיל לצד אופרטור הדמיון — אבל שילוב סינון חזק עם אינדקס ANN הוא נקודה עדינה שמשפיעה על recall, וכדאי לבדוק אותה על נתונים אמיתיים."
        cost="אינדקסים וקטוריים תופסים מקום דיסק/זיכרון נוסף (HNSW במיוחד רעב לזיכרון) ומאטים מעט כתיבות (כי צריך לעדכן את האינדקס) — פשרה נוספת שצריך לקחת בחשבון, לא רק יתרון חד-צדדי. בקנה מידה גדול, זיכרון האינדקס ולא הדיסק הוא לרוב הצוואר-בקבוק."
        realWorld="ב-AtlasDesk, כשתבנה את פרויקט המודול (חיפוש סמנטי במאמרי עזרה), תשתמש בדיוק ב-pgvector על אותו Supabase שכבר קיים — אין צורך בתשתית נוספת."
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
            <li>full scan וקטורי על מיליוני שורות בכל שאילתה — שניות של latency, חוויית משתמש הרוסה.</li>
            <li>מוסיפים אינדקס HNSW על 50 שורות — מורכבות וזיכרון מבוזבזים בלי שום תועלת.</li>
            <li>סינון metadata חזק (WHERE) לצד ANN בלי לבדוק recall — האינדקס מחזיר פחות תוצאות ממה שחשבו.</li>
            <li>שוכחים שהאינדקס צורך זיכרון — HNSW על מאגר גדול יכול לפוצץ RAM בשקט.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>בוחרים אינדקס לפי הסקייל: in-memory/full-scan עד כמה אלפים, HNSW/IVFFlat מעבר לזה.</li>
            <li>מודדים recall ו-latency על נתונים אמיתיים — לא מניחים שהברירת-מחדל אופטימלית.</li>
            <li>מתכננים את שילוב הסינון (metadata) עם החיפוש הוקטורי מראש, ובודקים אותו.</li>
            <li>מנטרים זיכרון האינדקס וגודלו כשהמאגר גדל — קיבולת היא החלטה, לא הפתעה.</li>
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
          ["pgvector", "תוסף ל-PostgreSQL שמוסיף טיפוס vector ואופרטורי דמיון."],
          ["HNSW/IVFFlat", "סוגי אינדקסים וקטוריים מקורבים (approximate) שמאיצים חיפוש דמיון."],
          ["Approximate Nearest Neighbor", "חיפוש 'קרוב מספיק' במקום מדויק לחלוטין — הרבה יותר מהיר."],
          ["Metadata Filtering", "צמצום החיפוש הוקטורי לתת-קבוצה (WHERE lang/tenant) לצד אופרטור הדמיון."],
          ["Recall", "אחוז מהתוצאות הרלוונטיות באמת שהאינדקס המקורב הצליח להחזיר — המדד שמודדים מול מהירות."],
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
        id="embeddings-vector-databases"
        title="תכנן סכמת מסד נתונים וקטורית עם Claude Code"
        context="עבוד מול הריפו של AtlasDesk (או פרויקט Supabase נפרד לתרגול)."
        steps={[
          "בקש מ-Claude Code להציע migration SQL שמוסיפה טבלה help_articles עם עמודת content (text) ו-embedding (vector).",
          "בקש ממנו להסביר את ההבדל בין <-> (מרחק אוקלידי), <#> (inner product), ו-<=> (cosine distance) באופרטורי pgvector.",
          "החלט (עם הסבר מ-Claude Code) איזה אופרטור הכי מתאים לעבודה עם embeddings טקסטואליים, ולמה.",
        ]}
        successCriteria={[
          "יש לך migration SQL אמיתי, לא רק תיאורטי",
          "אתה מבין את ההבדל בין שלושת אופרטורי הדמיון ויודע להסביר איזה מתאים למקרה שלך",
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
          קרא בקצרה (חיפוש עצמאי, לא רק דרך Claude Code) על ההבדל בין pgvector ל-Pinecone/Weaviate.
          נסח לעצמך משפט אחד: מתי היית בוחר בכל אחד מהם, ולמה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
