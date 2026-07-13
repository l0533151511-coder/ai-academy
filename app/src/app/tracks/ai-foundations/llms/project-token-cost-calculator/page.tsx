"use client";

import { Trophy, Sparkles } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { TokenCostCalculator } from "@/components/simulators/token-cost-calculator";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "ai-foundations",
  moduleSlug: "llms",
  lessonSlug: "project-token-cost-calculator",
  title: "פרויקט מודול: מחשבון טוקנים ועלויות",
  objectives: [
    "לבנות כלי שמעריך עלות בפועל של קריאות API בהתאם למודל, לנפח, ולתדירות",
    "להבין שיקולי עלות כחלק בלתי נפרד מתכנון מוצר AI",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["Context Window, יכולות ומגבלות"],
};

const SLIDES: Slide[] = [
  {
    title: "למה מהנדס AI חייב להבין עלויות",
    bullets: [
      "פיצ'ר AI 'מגניב' יכול להיות בלתי-כדאי כלכלית אם לא חישבת נכון את העלות בקנה מידה.",
      "ההבדל בין מודל Haiku ל-Opus יכול להיות פי 15-20 בעלות — לפעמים המודל הזול מספיק לגמרי למשימה.",
      "התרגול הזה מחבר את כל מה שלמדת במודול: טוקניזציה (איך סופרים), context window (מה נכנס לחישוב), ותכנון מוצר אחראי.",
    ],
  },
  {
    title: "למה הפרויקט הזה, וה-trade-off שבליבו",
    bullets: [
      "הנימוק ההנדסי: החלטת מודל היא החלטה ארכיטקטונית, לא 'הגדרה' — היא נעולה לתוך העלות-ליחידה של המוצר ומשפיעה על כל בקשה. מחשבון הופך אותה מניחוש למספר.",
      "ה-trade-off המרכזי: יכולת מול עלות. מודל חזק יותר נותן תשובות טובות יותר אך עולה פי-כמה; מודל זול 'מספיק טוב' חוסך דרמטית בקנה-מידה אך עלול להיכשל במקרי-קצה.",
      "הבנייה שלך צריכה לחשוף את ה-trade-off הזה כמספר — כך שאפשר יהיה להחליט על בסיס נתונים, לא תחושה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "אם אתה בונה צ'אטבוט עם 100,000 משתמשים ביום, מה השאלה הכי חשובה לשאול לפני בחירת מודל?",
    options: [
      "איזה מודל הכי חדיש",
      "מה העלות הכוללת בקנה מידה, ואיזה מודל 'מספיק טוב' באמת למשימה",
      "איזה מודל הכי מהיר לכתוב עליו קוד",
      "אין הבדל בין מודלים",
    ],
    correctIndex: 1,
    explanation: "בקנה מידה, הבדלי עלות קטנים למשתמש בודד הופכים למשמעותיים מאוד — צריך לאזן בין יכולת לעלות.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "הפרויקט שלך", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "lab",
    label: "מחשבון טוקנים ועלויות — נסה תרחישים שונים",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <Trophy size={18} className="shrink-0 text-primary" />
          <span>
            נסה: שנה בין המודלים ובין נפח הבקשות היומי, וראה איך העלות החודשית משתנה. מה קורה אם
            תעבור מ-Opus ל-Haiku על אותה משימה?
          </span>
        </div>
        <TokenCostCalculator />
      </div>
    ),
  },
  {
    id: "success",
    label: "מה נחשב הצלחה בפרויקט",
    content: (
      <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
        <p className="mb-2 font-bold text-success">הכלי שלך 'עובד' כשהוא עונה על אלה:</p>
        <ul className="space-y-1.5">
          <li>מקבל מודל, טוקני קלט/פלט לבקשה, ותדירות יומית — ומחזיר עלות חודשית משוערת.</li>
          <li>מאפשר להחליף מודל ולראות מיד את פער העלות (למשל Haiku מול Opus על אותה משימה).</li>
          <li>מפריד בין תמחור קלט לפלט — הם לרוב שונים, וזו טעות-עלות נפוצה לאחד אותם.</li>
          <li>הופך את ה-trade-off יכולת/עלות למספר קונקרטי שאפשר להציג ולהחליט לפיו.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="מחשבון עלויות הוא כלי סטנדרטי בכל צוות AI מקצועי — לפני בניית פיצ'ר, מעריכים עלות בקנה מידה כדי לוודא כדאיות עסקית."
        alternatives="ניתן גם 'לחסוך' טוקנים בדרכים אחרות: caching של תשובות נפוצות, קיצור פרומפט מערכת, או שימוש במודל קטן לרוב הבקשות ומודל גדול רק כ'fallback' למקרים מורכבים."
        cost="עלות = f(מודל, טוקני קלט, טוקני פלט, תדירות). כל אחד מהפרמטרים האלה ניתן לאופטימיזציה בנפרד."
        performance="מודלים קטנים (Haiku) לרוב גם מהירים משמעותית — לפעמים הבחירה הזולה יותר היא גם המהירה יותר, win-win."
        maintenance="מעקב עלויות לאורך זמן (לא רק הערכה חד-פעמית) הוא חלק מתחזוקת מערכת AI production — עלויות יכולות לגדול בהפתעה אם השימוש גדל."
        realWorld="חברות AI מסחריות משתמשות באסטרטגיית 'model routing': שולחות בקשות פשוטות למודל זול ומהיר, ורק בקשות מורכבות למודל היקר והחזק ביותר."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "summary",
    label: "סיכום המודול והטראק",
    content: (
      <div className="rounded-xl bg-card p-5 text-sm">
        <div className="mb-2 flex items-center gap-2 font-bold">
          <Sparkles size={18} className="text-primary" /> מה כיסינו במודול "מודלי שפה גדולים (LLMs)"
        </div>
        <ul className="space-y-1.5">
          <li>✅ טוקניזציה — איך טקסט הופך למספרים, וזואלייזר טוקנים אמיתי</li>
          <li>✅ ארכיטקטורת הטרנספורמר ו-Attention — הבסיס לכל LLM מודרני</li>
          <li>✅ Context Window, הזיות, הטיות, ו-knowledge cutoff</li>
          <li>✅ פרויקט: מחשבון עלויות אמיתי לתכנון מוצר AI</li>
        </ul>
        <p className="mt-3 text-muted">
          זהו! סיימת את כל טראק "יסודות AI". מכאן — הליבה האמיתית של מטרתך: Prompt Engineering
          מקצועי ופיתוח עם Claude Code.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
