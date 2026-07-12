"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptPlayground } from "@/components/playground/prompt-playground";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "prompt-ai-dev",
  moduleSlug: "prompt-engineering",
  lessonSlug: "few-shot-chain-of-thought",
  title: "Few-shot Prompting ו-Chain-of-Thought",
  objectives: [
    "להבין את ההבדל בין zero-shot, few-shot ו-CoT",
    "לראות איך דוגמאות בפרומפט משפרות עקביות תשובות",
    "להבין מתי chain-of-thought עוזר ומתי הוא רק מבזבז טוקנים",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["אנטומיה של פרומפט מקצועי"],
};

const SLIDES: Slide[] = [
  {
    title: "Zero-shot מול Few-shot",
    bullets: [
      "Zero-shot: מבקשים מה-AI לבצע משימה בלי שום דוגמה — סומכים על הבנתו הכללית.",
      "Few-shot: נותנים 2-3 דוגמאות של קלט→פלט רצוי בתוך הפרומפט עצמו, לפני הבקשה האמיתית.",
      "Few-shot יעיל במיוחד כשיש פורמט ספציפי או סגנון ניואנסי שקשה להסביר במילים בלבד.",
    ],
  },
  {
    title: "Chain-of-Thought (CoT)",
    bullets: [
      "במקום לבקש תשובה ישירה, מבקשים מה-AI 'לחשוב בקול' צעד-צעד לפני מתן התשובה הסופית.",
      "זה משפר דיוק במיוחד במשימות שדורשות היגיון מרובה-שלבים (חישובים, ניתוח לוגי).",
      "החיסרון: יותר טוקני פלט (יקר יותר, איטי יותר) — לא כדאי לכל משימה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מתי few-shot prompting הכי מועיל?",
    options: [
      "לכל משימה, תמיד",
      "כשיש פורמט/סגנון ספציפי שקשה להסביר במילים אך קל להדגים",
      "רק למשימות מתמטיות",
      "אף פעם, זה טכניקה מיושנת",
    ],
    correctIndex: 1,
    explanation: "דוגמאות קונקרטיות מראות למודל בדיוק את הפורמט/הסגנון הרצוי, יעיל יותר מתיאור מילולי מופשט.",
  },
  {
    id: "q2",
    question: "מה החיסרון המרכזי של Chain-of-Thought?",
    options: [
      "הוא תמיד פחות מדויק",
      "הוא צורך יותר טוקני פלט — יקר יותר ואיטי יותר",
      "הוא לא עובד על Claude",
      "אין לו חסרונות"
    ],
    correctIndex: 1,
    explanation: "'לחשוב בקול' דורש יותר טוקנים בפלט, מה שמעלה עלות וזמן תגובה — לא כדאי למשימות פשוטות.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "playground",
    label: "מעבדה: השווה zero-shot מול few-shot",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          נסה קודם לבקש מה-AI לסווג משוב לקוח כ&quot;חיובי/שלילי/ניטרלי&quot; בלי דוגמאות (zero-shot),
          ואז הוסף 2-3 דוגמאות ב-system prompt וראה אם התשובה עקבית יותר:
        </p>
        <PromptPlayground
          label="נסה: few-shot classification"
          defaultSystemPrompt={`סווג את המשוב הבא כ-חיובי/שלילי/ניטרלי. החזר מילה אחת בלבד.

דוגמאות:
משוב: "המוצר הזה שינה לי את החיים!" -> חיובי
משוב: "לא עבד בכלל, מבזבז זמן" -> שלילי
משוב: "קיבלתי את זה בזמן" -> ניטרלי`}
          defaultUserMessage="השירות היה טוב אבל לקח יותר מדי זמן להגיע"
        />
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="Few-shot ו-CoT נבחרו כי הם 'למידה בהקשר' (in-context learning) — לא צריך לאמן מודל מחדש כדי לשפר ביצועים על משימה ספציפית, רק לתת דוגמאות טובות בפרומפט."
        alternatives="לשיפור עקבי ואיכותי במיוחד, ניתן גם לעשות fine-tuning (נלמד בהמשך) — אך זה יקר ואיטי יותר מלשפר פרומפט."
        whenNotTo="למשימות פשוטות וברורות (תרגום מילה בודדת, סיווג טריוויאלי) — few-shot/CoT הם overhead מיותר שרק מייקר ומאט."
        performance="כל דוגמת few-shot מוסיפה טוקנים לקלט של כל בקשה — 5 דוגמאות ארוכות יכולות להכפיל את עלות הקלט."
        commonMistakes="לתת דוגמאות לא-מייצגות (רק מקרים קלים) — המודל ילמד מהדוגמאות שלך, גם אם הן לא מכסות edge cases אמיתיים."
        realWorld="מערכות סיווג בפרודקשן (כמו זיהוי spam, ניתוח סנטימנט) משתמשות הרבה ב-few-shot לפני שמשקיעים ב-fine-tuning יקר יותר."
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
          ["Zero-shot", "ביצוע משימה בלי שום דוגמה בפרומפט."],
          ["Few-shot", "מתן 2-5 דוגמאות קלט→פלט בפרומפט לפני הבקשה."],
          ["Chain-of-Thought", "בקשה מהמודל 'לחשוב בקול' צעד-צעד לפני תשובה סופית."],
          ["In-Context Learning", "שיפור ביצועי מודל דרך הפרומפט בלבד, בלי אימון מחדש."],
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
          נסה במעבדה משימה חשבונית פשוטה (כמו "12 קופסאות עם 8 עטים בכל אחת, כמה עטים בסך הכל?")
          פעם בלי CoT ופעם עם "חשוב שלב-שלב". האם התשובה או ההסבר השתפרו?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
