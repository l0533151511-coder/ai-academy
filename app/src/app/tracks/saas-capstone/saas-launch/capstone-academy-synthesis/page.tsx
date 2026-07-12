"use client";

import { Sparkles, Rocket, Trophy } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-launch",
  lessonSlug: "capstone-academy-synthesis",
  title: "קפסטון סופי: מסע AtlasDesk וסינתזת האקדמיה כולה",
  objectives: [
    "לסכם את כל מסע הבנייה של AtlasDesk לאורך כל האקדמיה — מ-system prompt בסיסי למוצר עם 8+ יכולות",
    "לזהות אילו כישורים הנדסיים (מכל הטראקים) שימשו הכי הרבה בפועל",
    "לתכנן את הצעד הבא: מה היית בונה קודם אם AtlasDesk היה חייב לצאת לפרודקשן אמיתי מחר",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["launch-readiness-checklist"],
};

const SLIDES: Slide[] = [
  {
    title: "המסע המלא: מ'שלום עולם' למוצר AI production",
    bullets: [
      "התחלת עם system prompt אחד פשוט (מודול Prompt Engineering). לאורך הדרך, AtlasDesk צבר: זיכרון persistent, Tool Calling אמיתי, חיפוש סמנטי, RAG עם grounding, סוכן אוטונומי עם הגנת production, מערכת רב-סוכנית עם אסקלציה, אוטומציה מונעת-webhook, שכבת ניטור, הגנת prompt injection, והגנת גישה בסיסית.",
      "כל יכולת נבנתה באותו תהליך: תכנון→מימוש→בדיקה חיה→commit→push→אימות production — לא פעם אחת, אלא בכל מודול לאורך כל הטראקים.",
    ],
  },
];

const JOURNEY_STEPS: DiagramStep[] = [
  { icon: Sparkles, label: "יסודות", detail: "Prompt Engineering, Claude Code Mastery (6 מודולים) — המשמעת ההנדסית שליוותה הכל." },
  { icon: Rocket, label: "אינטגרציה", detail: "MCP/Tool Calling, Embeddings, RAG, Fine-tuning — AtlasDesk לומד לפעול ולא רק לדבר." },
  { icon: Trophy, label: "Production", detail: "Agents, Multi-Agent, Automation, Monitoring, Security, SaaS — AtlasDesk הופך למוצר אמיתי." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה המשותף בין כל אחת מ-8+ היכולות שנוספו ל-AtlasDesk, בלי קשר לתוכן הספציפי שלהן?",
    options: [
      "אין שום דבר משותף, כל תכונה נבנתה בצורה שונה לגמרי",
      "כל אחת עברה את אותו תהליך הנדסי: תכנון מדויק → מימוש → בדיקה חיה בדפדפן → build/typecheck נקיים → commit מתועד → push → אימות production בפועל",
      "כולן דורשות ANTHROPIC_API_KEY בלבד ושום דבר אחר",
      "כולן נבנו באותו יום"
    ],
    correctIndex: 1,
    explanation: "בלי קשר לתוכן (RAG, סוכן, webhook, אבטחה), כל תכונה עברה את אותו workflow הנדסי מוקפד — זו בדיוק המשמעת שהטראק Claude Code Mastery לימד בתחילת הדרך.",
    optionNotes: [
      "לא נכון: יש דבר משותף מאוד ברור — התהליך ההנדסי החוזר, גם אם התוכן שונה בכל פעם.",
      "התשובה הנכונה: זו בדיוק הנקודה — המשמעת ההנדסית (לא התוכן הספציפי) היא מה שחזר על עצמו בכל מודול לאורך כל האקדמיה.",
      "לא נכון: חלק מהיכולות (embeddings, webhook secret) דורשות מפתחות/סודות נוספים — לא רק ANTHROPIC_API_KEY.",
      "לא נכון: הבנייה נמשכה לאורך זמן, לא ביום אחד — זה לא הקריטריון המשותף.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: המסע המלא", content: <SlideDeck slides={SLIDES} /> },
  { id: "journey", label: "שלושת שלבי המסע", content: <StepDiagram steps={JOURNEY_STEPS} /> },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI — הסינתזה הסופית",
    content: (
      <EngineeringInsights
        why="הקפסטון הסופי הזה קיים כי הכישור הכי חשוב שלמדת לא היה 'איך לבנות RAG' או 'איך לבנות סוכן' בנפרד — הוא איך לחשוב כמו מהנדס AI על כל בעיה חדשה: לתכנן לפני שממשים, למדוד לפני שמאופטמים, לאבטח לפני שמשיקים."
        alternatives="ללמוד כל טכנולוגיה בבידוד (קורס נפרד ל-RAG, קורס נפרד ל-agents) — נותן ידע טכני, אבל מפספס את מה שבאמת מבדיל מהנדס בכיר: היכולת לשלב הכל יחד על מוצר אמיתי אחד שממשיך לגדול."
        whenNotTo="—"
        commonMistakes="לסיים את האקדמיה ולחשוב 'עכשיו אני יודע RAG/Agents/וכו׳' בלי לשים לב שהכישור האמיתי שנרכש הוא המשמעת ההנדסית שחזרה על עצמה בכל מודול."
        cost="ההשקעה בלמידה מלאה של כל הטראקים (לא רק אחד) היא זו שיוצרת את היכולת לראות את הדפוסים החוזרים (webhook פעמיים, system prompt נפרד לכל agent, graceful degradation בכל endpoint) — זה מה שהופך אותך למהנדס AI, לא רק למישהו שיודע להשתמש ב-Claude API."
        realWorld="AtlasDesk הוא לא רק פרויקט לימודי — הוא הוכחה חיה שאפשר לבנות מוצר AI production-ready אמיתי, שיעור אחר שיעור, עם המשמעת הנכונה. זה בדיוק איך מוצרי AI אמיתיים נבנים בתעשייה."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "המשימה המסכמת של האקדמיה כולה",
    content: (
      <RealWorldTask
        id="saas-launch-capstone-academy-synthesis"
        title="כתוב את 'סיפור ההנדסה' המלא של AtlasDesk"
        context="עבוד עם Claude Code על הריפו האמיתי של AtlasDesk, ועם כל מה שלמדת בכל הטראקים."
        steps={[
          "עברו יחד עם Claude Code על כל docs/13-atlasdesk-features.md — כל 8+ היכולות, בסדר שבו נבנו.",
          "לכל יכולת, כתבו משפט אחד: איזה כישור הנדסי ספציפי (מאיזה מודול) היא דרשה הכי הרבה.",
          "זהו: איזה כישור חזר על עצמו הכי הרבה פעמים לאורך כל האקדמיה (רמז: תכנון-לפני-קוד, graceful degradation, ואימות production הם מועמדים טובים).",
          "כתבו תוכנית לצעד הבא האמיתי: אם AtlasDesk היה חייב לצאת לפרודקשן אמיתית מחר עם לקוחות משלמים, מה 3 הדברים הראשונים שהיית בונה (מתוך הפערים שזיהית ב-launch-readiness-checklist)?",
        ]}
        successCriteria={[
          "יש לך מיפוי מלא של יכולת→כישור הנדסי לכל 8+ היכולות",
          "זיהית את הכישור/הדפוס שחזר הכי הרבה — עם דוגמאות קונקרטיות",
          "יש לך תוכנית אמיתית ומדורגת לצעד הבא, לא רק 'צריך auth'",
        ]}
      />
    ),
  },
  {
    id: "homework",
    label: "🎓 סיום האקדמיה",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">
          מזל טוב — סיימת את כל אקדמיית ה-AI! 12 טראקים, עשרות מודולים, ומעל 100 שיעורים.
        </p>
        <p className="mt-1 text-muted">
          AtlasDesk, הפרויקט שבנית לאורך כל הדרך, הוא לא דוגמה מלאכותית — הוא מוצר AI אמיתי
          עם ארכיטקטורה production-grade: זיכרון, כלים, RAG, סוכנים, אוטומציה, ניטור, ואבטחה.
          הכישורים שרכשת — לתכנן לפני שממשים, לאמת כל שינוי, לחשוב על עלות/ביצועים/אבטחה מההתחלה —
          הם בדיוק מה שמבדיל מהנדס AI מתחיל ממהנדס AI בכיר. תמשיך לבנות.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
