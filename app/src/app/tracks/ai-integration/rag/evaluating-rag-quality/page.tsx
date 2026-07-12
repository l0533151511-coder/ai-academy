"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "rag",
  lessonSlug: "evaluating-rag-quality",
  title: "הערכת איכות RAG: Grounding ו-Hallucination Detection",
  objectives: [
    "לחבר בין grounding (ממודול Prompt Engineering) לבין RAG בפועל",
    "להבין מדדי הערכה בסיסיים ל-RAG (רלוונטיות retrieval, נאמנות תשובה למקור)",
    "לזהות מתי RAG 'ממציא' למרות שיש לו מסמכים רלוונטיים",
  ],
  estMinutes: 25,
  difficulty: "בינוני",
  prerequisites: ["chunking-retrieval-strategies"],
};

const SLIDES: Slide[] = [
  {
    title: "תזכורת: Grounding ממודול Prompt Engineering",
    bullets: [
      "כבר למדת (מודול 6.1) שגרונדינג הוא לבסס תשובות בעובדות במקום לתת למודל 'לנחש'. RAG הוא בדיוק המימוש המעשי של גרונדינג: להזין מקורות אמיתיים לפני שהמודל עונה.",
      "אבל RAG לא 'פותר' הזיות אוטומטית — גם עם מסמכים רלוונטיים בפרומפט, המודל עדיין יכול 'לסטות' מהם ולהוסיף פרטים שלא כתובים שם.",
    ],
  },
  {
    title: "שני סוגי כישלון ב-RAG",
    bullets: [
      "כישלון Retrieval — לא נמצא המסמך הנכון (או שנמצא מסמך לא רלוונטי). התשובה תהיה לא מדויקת פשוט כי המידע הנכון לא הגיע לפרומפט בכלל.",
      "כישלון Faithfulness (נאמנות) — המסמך הנכון כן נמצא ונשלח, אבל המודל בכל זאת מוסיף/משנה פרטים שלא כתובים בו במפורש — 'הזיה' למרות context נכון.",
      "אלו שני סוגי בעיות שונים לגמרי, ודורשים אבחון שונה: הראשון פתרונו בשיפור retrieval, השני פתרונו בשיפור הפרומפט/System Prompt.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין כישלון 'Retrieval' לכישלון 'Faithfulness' ב-RAG?",
    options: [
      "אין הבדל, שניהם אותה בעיה בשם אחר",
      "Retrieval נכשל כשלא נמצא המסמך הנכון בכלל; Faithfulness נכשל כשהמסמך הנכון כן נמצא אבל המודל בכל זאת סוטה ממנו/ממציא פרטים",
      "Retrieval קורה רק בעברית, Faithfulness רק באנגלית",
      "שניהם נפתרים תמיד באותו אופן — שיפור ה-embedding model",
    ],
    correctIndex: 1,
    explanation: "אלו שני שלבים שונים בפייפליין שיכולים להיכשל בנפרד — חשוב לאבחן איזה מהם קרה כדי לתקן את הדבר הנכון.",
    optionNotes: [
      "לא נכון: אלו שני כשלים שונים לחלוטין, בשלבים שונים של ה-pipeline (retrieval לפני generation, faithfulness בזמן generation).",
      "התשובה הנכונה: retrieval נכשל 'לפני' שהמודל בכלל התחיל לענות (לא הגיע לו המידע הנכון); faithfulness נכשל 'אחרי' — יש לו המידע הנכון אבל הוא לא נצמד אליו.",
      "לא נכון: אין קשר לשפה — שני סוגי הכישלון יכולים לקרות בכל שפה.",
      "לא נכון: תיקון retrieval שגוי דורש שיפור embeddings/chunking; תיקון faithfulness שגוי דורש שיפור בהנחיות (system prompt) — פתרונות שונים לגמרי.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מגרונדינג תיאורטי לבדיקה מעשית", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: system prompt חלש מול חזק למניעת הזיה למרות RAG תקין",
    content: (
      <PromptComparisonLab
        title="למודל יש את המסמך הנכון — אבל האם הוא נצמד אליו?"
        unitLabel="System prompt"
        bad={{
          label: "בלי הנחיה מפורשת ל-grounding",
          content: `"ענה על שאלות לקוחות בהתבסס על המסמכים המצורפים."`,
          outcome: "המודל עלול 'למלא פערים' בעצמו אם המסמך לא מכסה הכל — למשל להוסיף פרטים סבירים-נשמעים שלא כתובים במפורש במסמך שסופק.",
        }}
        good={{
          label: "עם הנחיית grounding מפורשת (כמו במודול Prompt Engineering)",
          content: `"ענה אך ורק בהתבסס על המסמכים המצורפים. אם המידע
הדרוש לא מופיע בהם במפורש, אמור בבירור: 'אין לי מידע
מדויק על כך במאמרי העזרה' — אל תשלים פרטים בעצמך."`,
          outcome: "המודל נצמד בקפדנות למה שכתוב בפועל, ומודה כשאין לו תשובה — בדיוק כמו שלמדת במודול grounding-hallucinations.",
        }}
        takeaway="RAG טוב = retrieval טוב + system prompt שמכריח grounding קפדני. שני התנאים נחוצים יחד — retrieval מצוין עם system prompt חלש עדיין יכול להוליד הזיות."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הערכת RAG קיימת כי 'זה עובד על הדוגמה שבדקתי' לא אומר 'זה עובד תמיד' — כמו כל מערכת production, RAG צריך מדדים אובייקטיביים כדי לדעת מתי הוא נכשל ולמה."
        alternatives="הערכה ידנית (לבדוק כמה דוגמאות בעין) — מהירה להתחיל, אבל לא סקלבילית ולא עקבית; מסגרות הערכה אוטומטיות (כמו RAGAS) מודדות רלוונטיות retrieval ונאמנות תשובה בצורה שיטתית יותר."
        whenNotTo="למערכת RAG פנימית קטנה עם מעט שאלות סטנדרטיות — הערכה ידנית של כמה עשרות דוגמאות עשויה להספיק, בלי צורך במסגרת הערכה מלאה."
        commonMistakes="לבדוק רק את 'איכות התשובה הסופית' בלי להפריד בין בעיית retrieval לבעיית faithfulness — זה מוביל לתיקון הדבר הלא נכון (למשל לשפר את ה-system prompt כשהבעיה האמיתית היא embeddings גרועים)."
        cost="הערכה אוטומטית (עם מודל 'שופט' נוסף) עולה קריאות API נוספות — משתלם כשהמערכת חשובה מספיק, לא לפרויקט הדגמה קטן."
        realWorld="בפרויקט המודול הבא תבדוק את AtlasDesk בדיוק ככה: לוודא שכשאין מאמר עזרה רלוונטי, המערכת מודה בכך במקום להמציא — זו בדיקת faithfulness אמיתית."
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
          ["Faithfulness", "מידת הנאמנות של תשובת המודל למקורות שסופקו לו בפועל."],
          ["Retrieval failure", "כישלון במציאת המסמך הרלוונטי לשאלה."],
          ["Faithfulness failure", "המודל סוטה מהמקור שכן נמצא ומוסיף/משנה פרטים."],
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
        id="rag-evaluating-rag-quality"
        title="בדוק faithfulness על מקרה קצה אמיתי"
        context="עבוד מול AtlasDesk (או כל מערכת RAG/chat אחרת שיש לך גישה אליה)."
        steps={[
          "שאל שאלה שהתשובה לה לא מכוסה במלואה במסמכים הקיימים (למשל שאלה על פרט קטן שלא מוזכר).",
          "בדוק: האם התשובה מודה שהמידע חסר, או שהיא 'ממלאת' את הפער בעצמה?",
          "אם היא ממלאת פערים, נסה לשפר את ה-system prompt (עם Claude Code) כדי לאכוף grounding קפדני יותר.",
          "בדוק שוב את אותה שאלה אחרי השיפור.",
        ]}
        successCriteria={[
          "מצאת בפועל מקרה שבו המערכת 'מילאה פער' בעצמה",
          "שיפרת את ה-system prompt וראית שיפור מדיד בהתנהגות",
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
          נסח 5 שאלות מקרה-קצה למערכת RAG שאתה מכיר או בונה — שאלות שבכוונה לא מכוסות במלואן
          במסמכים הקיימים. אלו יהיו &quot;בדיקות רגרסיה&quot; שתוכל לחזור אליהן בכל פעם שאתה
          משנה את ה-pipeline.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
