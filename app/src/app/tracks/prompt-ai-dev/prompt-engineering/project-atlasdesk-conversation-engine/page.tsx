"use client";

import Link from "next/link";
import { Trophy, ExternalLink, Sparkles } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "prompt-ai-dev",
  moduleSlug: "prompt-engineering",
  lessonSlug: "project-atlasdesk-conversation-engine",
  title: "פרויקט מודול: AtlasDesk — מנוע השיחה הבסיסי",
  objectives: [
    "לבנות את הליבה הראשונה של AtlasDesk — מערכת תמיכת לקוחות AI אמיתית",
    "לחבר system prompt מובנה + היסטוריית שיחה אמיתית מול Claude API",
    "להבין את שיקולי ההנדסה של הפרויקט הראשון בפלטפורמה מסחרית אמיתית",
  ],
  estMinutes: 45,
  difficulty: "בינוני",
  prerequisites: ["מניעת הזיות: Grounding ו-Self-Verification"],
};

const SLIDES: Slide[] = [
  {
    title: "🏆 מהיום, אתה בונה מוצר אמיתי",
    bullets: [
      "עד עכשיו כל פרויקט היה כלי בודד ללימוד מושג. מהמודול הזה — כל פרויקט מוסיף יכולת אמיתית לאותה מערכת: AtlasDesk.",
      "AtlasDesk היא מערכת תמיכת לקוחות AI מסחרית. הגרסה הראשונה שבנית כרגע: מנוע שיחה עם system prompt מובנה, שמדבר עם Claude API אמיתי.",
      "בכל מודול הבא (MCP, RAG, Agents, Auth, Dashboard...) תוסיף עוד יכולת אמיתית — לא תתחיל מחדש.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה מייחד את הגרסה הזו של AtlasDesk לעומת פרויקטים קודמים באקדמיה?",
    options: [
      "היא לא באמת עובדת",
      "היא הבסיס למוצר מתמשך שיתפתח לאורך כל שאר האקדמיה, לא כלי עצמאי",
      "היא זהה למנטור של האקדמיה",
      "אין הבדל אמיתי",
    ],
    correctIndex: 1,
    explanation: "כל מודול AI הבא יוסיף יכולת אמיתית לאותה מערכת בדיוק, בונה פרויקט אמיתי אחד לאורך זמן.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "הפרויקט שלך", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "product",
    label: "AtlasDesk — נסה את המוצר האמיתי",
    content: (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
        <Sparkles size={28} className="mx-auto mb-3 text-primary" />
        <p className="mb-4 text-sm text-muted">
          AtlasDesk רץ כעמוד עצמאי באתר (לא בתוך מסגרת השיעור) — כדי שתרגיש שאתה משתמש במוצר אמיתי,
          לא בדוגמת קוד. פתח אותו, שוחח איתו, ולחץ &quot;מצב מפתח&quot; כדי לראות עלות אמיתית לכל הודעה.
        </p>
        <Link
          href="/atlasdesk"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          פתח את AtlasDesk <ExternalLink size={16} />
        </Link>
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="בחרנו לבנות את AtlasDesk כעמוד/מוצר נפרד (לא רכיב בתוך שיעור) כי זה מדגים איך פרויקט production אמיתי נראה — עם route משלו, קומפוננטות משלו, וזהות מוצר עצמאית."
        alternatives="אפשר היה לבנות סימולציה בלבד (בלי קריאת API אמיתית) — אבל זה היה מפספס את הלמידה החשובה ביותר: לראות עלות וטוקנים אמיתיים, ולחוות latency אמיתי."
        maintenance="הקוד מאורגן כך שכל מודול עתידי יכול להרחיב בלי לבנות מחדש: lib/atlasdesk/config.ts (הגדרות/system prompt במקום אחד מרוכז), components/atlasdesk/ (רכיבי UI), app/atlasdesk/ (routes)."
        cost="מצב המפתח (Developer Mode) מציג טוקנים ועלות אמיתיים לכל הודעה — זה בדיוק סוג הכלי שצוות הנדסת AI אמיתי צריך כדי לפקח על עלויות בזמן פיתוח."
        realWorld="גרסה זו כבר ניתנת להצגה ל'משתמש אמיתי' (עם המגבלה שהיא לא ניגשת עדיין למידע אמיתי של לקוח — זה בדיוק מה שמודול ה-Tool Calling הבא יוסיף)."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "summary",
    label: "סיכום המודול",
    content: (
      <div className="rounded-xl bg-card p-5 text-sm">
        <div className="mb-2 flex items-center gap-2 font-bold">
          <Trophy size={18} className="text-warning" /> מה כיסינו במודול &quot;הנדסת Prompt מקצועית&quot;
        </div>
        <ul className="space-y-1.5">
          <li>✅ אנטומיית פרומפט, system prompt מול הודעת משתמש — עם Prompt Playground חי</li>
          <li>✅ Few-shot ו-Chain-of-Thought</li>
          <li>✅ Grounding למניעת הזיות</li>
          <li>✅ 🏆 <strong>AtlasDesk v0.1</strong> — מנוע השיחה הראשון של הפרויקט המתמשך שלך</li>
        </ul>
        <p className="mt-3 text-muted">
          במודול הבא — Claude Code ופיתוח AI-assisted — נלמד לעבוד עם agentic coding tools, ואז ישר
          לטראק MCP/RAG/Agents שיוסיפו ל-AtlasDesk יכולות אמיתיות נוספות.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
