"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptPlayground } from "@/components/playground/prompt-playground";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "prompt-ai-dev",
  moduleSlug: "prompt-engineering",
  lessonSlug: "grounding-hallucinations",
  title: "מניעת הזיות: Grounding ו-Self-Verification",
  objectives: [
    "להבין טכניקות לביסוס תשובות בעובדות (grounding)",
    "להבין איך לעודד את המודל להודות באי-ודאות במקום להמציא",
    "להשוות תשובה עם ובלי טכניקות grounding על אותה שאלה",
  ],
  estMinutes: 25,
  difficulty: "בינוני",
  prerequisites: ["Few-shot Prompting ו-Chain-of-Thought"],
};

const SLIDES: Slide[] = [
  {
    title: "תזכורת: למה מודל מהזה בכלל",
    bullets: [
      "זכור משיעור ה-LLMs: מודל לא 'יודע' עובדות כמו מסד נתונים — הוא חוזה טוקן סביר הבא.",
      "כשאין לו מידע מהימן על נושא, הוא עלול להמשיך 'לנחש' בביטחון מלא — זו הזיה.",
    ],
  },
  {
    title: "טכניקות Grounding",
    bullets: [
      "לספק את המידע הרלוונטי ישירות בפרומפט (זו בעצם ההקדמה ל-RAG שנלמד בהמשך!).",
      "לבקש מהמודל לצטט את המקור לכל טענה עובדתית.",
      "להגביל מפורשות: 'ענה רק על סמך המידע שסופק, אל תשתמש בידע כללי'.",
    ],
  },
  {
    title: "עידוד הודאה באי-ודאות",
    bullets: [
      "הוראה מפורשת כמו 'אם אינך בטוח או שהמידע לא סופק, אמור זאת בפירוש' משפרת דרמטית אמינות.",
      "בלי ההוראה הזו, מודלים נוטים 'להעדיף' לתת תשובה כלשהי על פני הודאה בחוסר ידיעה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מהי טכניקת ה-grounding הבסיסית ביותר?",
    options: [
      "לבקש מהמודל לנחש יותר טוב",
      "לספק את המידע הרלוונטי עצמו בתוך הפרומפט, כדי שהמודל יענה על סמכו ולא על 'זיכרון' כללי",
      "להשתמש במודל גדול יותר",
      "לחזור על השאלה כמה פעמים",
    ],
    correctIndex: 1,
    explanation: "לספק את המידע הרלוונטי בפרומפט עצמו ('ground' את התשובה בעובדות נתונות) הוא היסוד לכל טכניקות ה-grounding, כולל RAG.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "playground",
    label: "מעבדה: השווה עם ובלי Grounding",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          שאל שאלה על מדיניות מוצר בדויה בלי מידע (זרוק) — סביר שהמודל יסרב לענות/יזהיר. עכשיו הוסף
          את פרטי המדיניות בפועל ל-system prompt ושאל שוב:
        </p>
        <PromptPlayground
          label="נסה: grounding על מדיניות מוצר"
          defaultSystemPrompt={`אתה נציג תמיכה של AtlasDesk. ענה רק על סמך המידע שסופק כאן. אם המידע לא כאן, אמור בפירוש "אין לי מידע על כך" ואל תמציא תשובה.

מדיניות החזרות: ניתן להחזיר מוצר תוך 30 יום מהרכישה, בכפוף לקבלה מקורית.`}
          defaultUserMessage="כמה זמן יש לי להחזיר מוצר?"
        />
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="Grounding נבחר כי הוא הפתרון הפשוט והזול ביותר להזיות — לפני שקופצים לפתרונות מורכבים (RAG, fine-tuning), פרומפט מבוסס-עובדות פשוט יכול לפתור המון מקרים."
        alternatives="RAG (שנלמד בהמשך) הוא הרחבה טבעית: במקום להדביק ידנית מידע לפרומפט, שולפים אוטומטית את המידע הרלוונטי ממאגר ידע גדול."
        whenNotTo="למשימות יצירתיות (כתיבת שיר, סיעור מוחות) grounding קפדני מדי דווקא מזיק — לפעמים רוצים שהמודל 'יהיה יצירתי', לא מוגבל למקורות."
        security="בהקשר תמיכת לקוחות (כמו AtlasDesk), הודעת סירוב ברורה כשאין מידע חשובה גם מבחינה משפטית — עדיף 'אינני יודע' על פני מידע שגוי שעלול להטעות לקוח."
        commonMistakes="לשכוח את ההוראה המפורשת 'אם אין מידע, אמור זאת' — בלעדיה, המודל עדיין עלול 'להשלים' תשובה גם עם הקשר חלקי."
        realWorld="ב-AtlasDesk, שכבת ה-grounding הזו היא הבסיס הישיר ל-RAG שנבנה בטראק הבא — מ'הדבקת מידע ידנית' ל'שליפה אוטומטית ממאגר ידע'."
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
          ["Grounding", "ביסוס תשובת המודל על מידע נתון, במקום ידע כללי בלבד."],
          ["Hallucination", "יצירת מידע שגוי שנשמע סביר, ללא בסיס עובדתי."],
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
    id: "homework",
    label: "שיעורי בית",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">שיעורי בית:</p>
        <p className="mt-1 text-muted">
          במעבדה למעלה, שאל שאלה שהמידע הנתון *לא* עונה עליה (למשל "האם יש משלוח בינלאומי?") ובדוק
          אם המודל אכן מודה שאין לו מידע, בהתאם להוראה שנתת.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
