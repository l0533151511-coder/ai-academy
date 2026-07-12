"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptPlayground } from "@/components/playground/prompt-playground";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "prompt-ai-dev",
  moduleSlug: "prompt-engineering",
  lessonSlug: "prompt-anatomy",
  title: "אנטומיה של פרומפט מקצועי",
  objectives: [
    "להבין את רכיבי הפרומפט: context, task, format, constraints",
    "להבין את ההבדל בין system prompt להודעת משתמש",
    "לכתוב ולהריץ פרומפטים אמיתיים במעבדה אינטראקטיבית",
  ],
  estMinutes: 30,
  difficulty: "מתחיל",
  prerequisites: ["פרויקט מודול: מחשבון טוקנים ועלויות"],
};

const SLIDES: Slide[] = [
  {
    title: "ברוך הבא לליבה של מטרת האקדמיה",
    bullets: [
      "עד עכשיו הבנת איך LLMs עובדים מבפנים. מכאן והלאה — איך *לתקשר* איתם בצורה מקצועית שמניבה תוצאות עקביות.",
      "הנדסת Prompt היא לא 'קסמים' — היא כישור הנדסי עם עקרונות ברורים, בדיוק כמו כתיבת קוד נקי.",
    ],
  },
  {
    title: "System Prompt מול הודעת משתמש",
    bullets: [
      "System Prompt: מוגדר פעם אחת, קובע 'מי' ה-AI, מה התפקיד שלו, אילו כללים הוא חייב לשמור תמיד.",
      "הודעת משתמש: השאלה/הבקשה הספציפית של כל פנייה.",
      "לדוגמה: ה-AI Mentor באקדמיה הזו יש לו system prompt קבוע שאוסר עליו לתת פתרונות ישירות — זה לא משתנה בין שאלות.",
    ],
  },
  {
    title: "ארבעת המרכיבים של פרומפט טוב",
    bullets: [
      "Context — איזה מידע רקע ה-AI צריך כדי להבין את הבקשה נכון.",
      "Task — מה בדיוק מבקשים ממנו לעשות, בניסוח ברור וחד-משמעי.",
      "Format — באיזו צורה התשובה צריכה להיות (רשימה, JSON, פסקה קצרה וכו').",
      "Constraints — מגבלות: אורך, טון, מה לא לעשות.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל המרכזי בין system prompt להודעת משתמש?",
    options: [
      "אין הבדל אמיתי",
      "system prompt קבוע לאורך כל השיחה; הודעת משתמש משתנה בכל פנייה",
      "system prompt תמיד קצר יותר",
      "רק הודעת משתמש נשלחת בפועל ל-API",
    ],
    correctIndex: 1,
    explanation: "system prompt מגדיר את ה'זהות' והכללים הקבועים; הודעת המשתמש היא הבקשה הספציפית שמשתנה כל פעם.",
  },
  {
    id: "q2",
    question: "למה חשוב לציין 'Format' בפרומפט?",
    options: [
      "זה לא חשוב, ה-AI תמיד יודע איך לענות",
      "כדי לקבל תשובה בצורה שקל לעבד אותה תוכנתית או להציג למשתמש",
      "כדי לחסוך טוקנים",
      "רק לצורך אסתטיקה",
    ],
    correctIndex: 1,
    explanation: "אם אתה מצפה ל-JSON, רשימה, או אורך מסוים, לציין את זה מפורשות מגדיל דרמטית את הסיכוי לקבל בדיוק את זה.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "playground",
    label: "Prompt Playground — נסה בעצמך על Claude אמיתי",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          נסה לכתוב system prompt שמגדיר תפקיד ברור (למשל &quot;אתה עוזר תמיכה טכנית קצר ותכליתי&quot;),
          ושלח הודעת משתמש. שנה את ה-system prompt וראה איך התשובה משתנה גם לאותה שאלה בדיוק:
        </p>
        <PromptPlayground
          label="נסה: אנטומיית פרומפט"
          defaultSystemPrompt="אתה עוזר תמיכה טכנית של חברת תוכנה. ענה בקצרה, בשלוש נקודות לכל היותר, בטון מקצועי וחברותי."
          defaultUserMessage="המשתמש שלי לא מצליח להתחבר לחשבון, מה הצעד הראשון שכדאי לבדוק?"
        />
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הפרדה בין system prompt להודעת משתמש נבחרה כי היא מאפשרת לשמור 'זהות' עקבית לאורך שיחה שלמה, בלי לחזור על אותן הוראות בכל הודעה — חוסך טוקנים וזמן פיתוח."
        alternatives="אפשר גם 'להזריק' הנחיות בתוך הודעת המשתמש עצמה (לשלב context+task יחד) — לפעמים פשוט יותר לפרומפט חד-פעמי, אבל פחות ניתן לתחזוקה במערכת production עם הרבה סוגי בקשות."
        whenNotTo="לפרומפט חד-פעמי מאוד פשוט (כמו 'סכם את הטקסט הזה'), הפרדה מלאה בין system ל-user יכולה להיות over-engineering — לפעמים הודעה אחת ברורה מספיקה."
        commonMistakes="לכתוב system prompt ארוך מדי עם המון כללים סותרים, או לשכוח לבדוק את הפרומפט על מגוון קלטים — מה שעובד על דוגמה אחת לא בהכרח יעבוד על כולן."
        cost="System prompt נשלח בכל בקשה (הוא חלק מהקלט) — system prompt ארוך מדי מייקר כל קריאה בודדת, גם אם הוא זהה בין קריאות."
        realWorld="ב-AtlasDesk (הפרויקט שתבנה בהמשך המודול), system prompt קבוע יגדיר את זהות הבוט כנציג תמיכה — זו בדיוק אותה טכניקה בקנה מידה מסחרי אמיתי."
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
          ["System Prompt", "הוראות קבועות שמגדירות את זהות/כללי ה-AI לאורך כל השיחה."],
          ["Context", "מידע רקע שה-AI צריך כדי להבין את הבקשה נכון."],
          ["Task", "הבקשה הספציפית — מה בדיוק לעשות."],
          ["Constraints", "מגבלות על התשובה: אורך, טון, מה אסור."],
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
          במעבדה למעלה, כתוב system prompt חדש שהופך את העוזר ל&quot;נציג מכירות נלהב&quot; במקום תמיכה
          טכנית, ושלח את אותה שאלה בדיוק. השווה בין שתי התשובות.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
