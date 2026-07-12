"use client";

import { Scissors, Search, Layers3, MessageSquareText } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "rag",
  lessonSlug: "rag-anatomy",
  title: "אנטומיית RAG: Retrieval-Augmented Generation",
  objectives: [
    "להבין את ארבעת השלבים: chunking, retrieval, augmentation, generation",
    "להבין למה RAG פותר את בעיית 'הידע הקבוע' של מודל שפה",
    "לראות את ההבדל בין תשובה מהידע הכללי של המודל לתשובה מבוססת-מסמכים",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: חיפוש סמנטי במאמרי העזרה של AtlasDesk"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: הידע של מודל שפה 'קפוא' מזמן האימון",
    bullets: [
      "Claude (וכל מודל שפה) לא יודע שום דבר על 'מאמרי העזרה של AtlasDesk' — כי הם לא היו קיימים בזמן האימון שלו, והם ספציפיים לך.",
      "אם תשאל אותו על מדיניות ביטול המנוי של AtlasDesk, הוא עלול 'להמציא' תשובה סבירה-נשמעת אבל שגויה — כי אין לו שום דרך לדעת את המדיניות האמיתית שלך.",
      "RAG (Retrieval-Augmented Generation) פותר את זה: לפני שהמודל עונה, אנחנו 'שולפים' (retrieve) את המסמכים הרלוונטיים ומוסיפים אותם לפרומפט — כך התשובה מבוססת על מידע אמיתי, לא ניחוש.",
    ],
  },
  {
    title: "ארבעת השלבים",
    bullets: [
      "Chunking — פיצול מסמכים ארוכים לקטעים (chunks) קטנים וניתנים לאחזור בנפרד.",
      "Retrieval — כשמגיעה שאלה, חיפוש (בדרך כלל סמנטי, embeddings) אחר ה-chunks הכי רלוונטיים.",
      "Augmentation — הכנסת ה-chunks שנמצאו לתוך הפרומפט, כ'הקשר נוסף' לפני השאלה.",
      "Generation — המודל מייצר תשובה בהתבסס על ה-context שהוזן, לא רק על ידע כללי.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: Scissors, label: "1. Chunking", detail: "מאמר עזרה ארוך מתפצל לקטעים קטנים (למשל 200-500 מילים) — כל chunk הופך ל-embedding נפרד." },
  { icon: Search, label: "2. Retrieval", detail: "שאלת המשתמש הופכת ל-embedding, מושווית מול כל ה-chunks, ומוחזרים ה-K הכי דומים (למשל top-3)." },
  { icon: Layers3, label: "3. Augmentation", detail: "ה-chunks שנמצאו מוזרקים לתוך הפרומפט: 'בהתבסס על המידע הבא: [chunks] — ענה על: [שאלה]'." },
  { icon: MessageSquareText, label: "4. Generation", detail: "המודל מנסח תשובה טבעית שמבוססת על ה-context שהוזן, ולא על 'ניחוש' מהידע הכללי שלו." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה מודל שפה עלול 'להמציא' תשובה כשנשאל על מדיניות ספציפית של מוצר שלא היה קיים באימון שלו?",
    options: [
      "כי המודל 'משקר' בכוונה",
      "כי אין לו שום מידע אמיתי על המוצר הספציפי הזה, אבל הוא מאומן לייצר תשובה סבירה-נשמעת — בלי RAG, אין לו דרך להבדיל בין 'אני יודע' ל'אני מנחש'",
      "כי המודל תמיד טועה בשאלות על מוצרים",
      "כי חסר לו זיכרון שיחה",
    ],
    correctIndex: 1,
    explanation: "מודל שפה מיוצר לחזות טקסט סביר — בלי מידע אמיתי מוזרק (RAG), הוא 'ממלא את החלל' בתשובה שנשמעת נכון, גם כשהיא שגויה.",
    optionNotes: [
      "לא נכון: זו לא כוונה זדונית — זו תוצאה טבעית של איך המודל מיוצר (לחזות טקסט סביר, לא בהכרח נכון עובדתית).",
      "התשובה הנכונה: זו בדיוק הבעיה ש-RAG פותר — לתת למודל מידע אמיתי לפני שהוא עונה, במקום להסתמך על 'ניחוש סביר'.",
      "לא נכון: מודלים לא תמיד טועים — הם מדויקים כשהמידע היה חלק מהאימון הכללי שלהם (עובדות ידועות, לא מוצר ספציפי-פרטי).",
      "לא נכון: זיכרון שיחה קשור לניהול context בתוך סשן, לא לבעיית הידע החסר על מידע חיצוני-ספציפי.",
    ],
  },
  {
    id: "q2",
    question: "מהו סדר ארבעת השלבים הנכון ב-RAG?",
    options: [
      "Generation → Retrieval → Chunking → Augmentation",
      "Chunking → Retrieval → Augmentation → Generation",
      "Retrieval → Generation → Chunking → Augmentation",
      "Augmentation → Chunking → Generation → Retrieval",
    ],
    correctIndex: 1,
    explanation: "קודם מפצלים מסמכים לchunks (מראש, לא בזמן שאלה), אז מאתרים chunks רלוונטיים לשאלה, מוסיפים אותם לפרומפט, ולבסוף המודל מייצר תשובה.",
    optionNotes: [
      "לא נכון: אי אפשר לייצר תשובה (Generation) לפני שיש בכלל retrieval — הסדר הפוך מהגיוני.",
      "התשובה הנכונה: זהו סדר ה-pipeline הנכון — הכנה (chunking) מראש, ואז retrieval→augmentation→generation לכל שאלה חדשה.",
      "לא נכון: לא ניתן לייצר תשובה (Generation) באמצע התהליך, לפני שהmידע כבר הוזרק לפרומפט (Augmentation).",
      "לא נכון: Chunking חייב לקרות לפני Retrieval — אי אפשר לחפש chunks שעדיין לא נוצרו.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הבעיה ש-RAG פותר", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "ארבעת שלבי ה-pipeline", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: תשובה מהידע הכללי מול תשובה מבוססת-RAG",
    content: (
      <PromptComparisonLab
        title="שאלה על מדיניות AtlasDesk"
        unitLabel="גישה"
        bad={{
          label: "בלי RAG — ידע כללי בלבד",
          content: `שאלה: "איך מבטלים מנוי ב-AtlasDesk?"
פרומפט: רק השאלה, בלי context נוסף`,
          outcome: "המודל 'מנחש' תשובה סבירה כללית ('בדרך כלל דרך הגדרות החשבון...') — אבל אין לו שום דרך לדעת אם זה נכון ל-AtlasDesk הספציפי. עלול להמציא פרטים לא נכונים.",
        }}
        good={{
          label: "עם RAG — מבוסס מסמכים אמיתיים",
          content: `שאלה: "איך מבטלים מנוי ב-AtlasDesk?"
Retrieval מוצא: "הליך סיום התחייבות חודשית: פנה להגדרות..."
פרומפט: "בהתבסס על: [המאמר שנמצא] — ענה: איך מבטלים מנוי?"`,
          outcome: "המודל מנסח תשובה מבוססת על התוכן האמיתי שנמצא — מדויק לתהליך האמיתי של AtlasDesk, לא ניחוש כללי.",
        }}
        takeaway="RAG לא הופך את המודל 'חכם יותר' — הוא נותן לו את המידע הנכון בזמן הנכון. זה בדיוק ההבדל בין 'לזכור מהאימון' ל'לקרוא מהמקור הנכון עכשיו'."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="RAG קיים כי אימון מחדש של מודל שפה בכל פעם שמידע משתנה הוא יקר ואיטי בטירוף — הרבה יותר זול וגמיש 'להזריק' מידע עדכני בזמן אמת דרך הפרומפט."
        alternatives="Fine-tuning (נלמד במודול הבא) הוא חלופה — 'ללמד' את המודל את המידע הספציפי דרך אימון נוסף. יקר יותר, איטי יותר לעדכן, אבל מתאים כשצריך שהמודל 'יתנהג' אחרת, לא רק 'ידע' יותר."
        whenNotTo="אם המידע הרלוונטי קטן וקבוע מספיק שנכנס בקלות ל-system prompt (כמו ב-AtlasDesk בתחילת האקדמיה) — RAG מלא הוא overhead מיותר. RAG משתלם כשיש הרבה מסמכים שלא נכנסים כולם ל-context בבת אחת."
        commonMistakes="לבנות RAG בלי לבדוק את איכות ה-retrieval — אם השלב הראשון (מציאת המסמכים הנכונים) לא עובד טוב, אין משמעות כמה שהמודל 'טוב' בניסוח התשובה מהמידע השגוי שהוא קיבל."
        cost="RAG מוסיף שלב embedding (לשאלה) + retrieval (חיפוש) + טוקנים נוספים (ה-context שהוזרק) — יקר יותר משאלה ישירה, אבל זול בהרבה מ-fine-tuning."
        realWorld="ב-AtlasDesk, החיפוש הסמנטי שבנית במודול הקודם הוא בדיוק שלב ה-Retrieval — בפרויקט המודול הזה תחבר אותו לשלבי Augmentation ו-Generation כדי להשלים RAG מלא."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["RAG", "Retrieval-Augmented Generation — הזרקת מידע רלוונטי לפרומפט לפני שהמודל עונה."],
          ["Chunk", "קטע טקסט קטן שנוצר מפיצול מסמך ארוך, ניתן לאחזור בנפרד."],
          ["Retrieval", "שלב מציאת ה-chunks הרלוונטיים ביותר לשאלה."],
          ["Augmentation", "הוספת המידע שנמצא לתוך הפרומפט לפני שליחה למודל."],
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
        id="rag-anatomy"
        title="השווה תשובה עם ובלי RAG על שאלה אמיתית"
        context="לא צריך API בשיעור הזה — עבודה מושגית עם Claude Code שלך."
        steps={[
          "בחר תחום שיש לו מדיניות ספציפית (לא ידע כללי) — למשל מדיניות ההחזרות של חנות בדיונית.",
          "שאל את Claude Code את השאלה בלי שום context נוסף, וראה אם הוא 'מודה' שאין לו מידע ספציפי או מנחש.",
          "עכשיו תן לו 2-3 משפטים עם 'מדיניות בדיונית' אמיתית, ושאל שוב את אותה שאלה.",
          "השווה: האם התשובה השנייה מדויקת יותר ומצטטת את המידע שנתת?",
        ]}
        successCriteria={[
          "ראית בפועל את ההבדל בין תשובה מנוחשת לתשובה מבוססת מידע",
          "אתה מבין שהפער הוא לא 'איכות המודל' אלא זמינות המידע הנכון",
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
          חשוב על מוצר/שירות שאתה מכיר טוב עם הרבה תיעוד (יכול להיות בעבודה, פרויקט אישי, או
          קורס). אילו מסמכים היית בוחר להזין ל-RAG כדי שסוכן AI יוכל לענות עליהם נכון?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
