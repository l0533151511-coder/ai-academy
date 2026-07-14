"use client";

import { Trophy, Sparkles } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { ApiCallerLab } from "@/components/exercises/api-caller-lab";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "programming-essentials-ai",
  moduleSlug: "js-ts-for-ai",
  lessonSlug: "project-api-caller",
  title: "פרויקט מודול: קריאה אמיתית ל-AI Mentor API",
  objectives: [
    "לכתוב סקריפט TypeScript שקורא ל-API של המנטור באתר ומעבד את התשובה",
    "לחבר בין כל מה שנלמד: async/fetch/טיפוסים בפרויקט עובד אחד",
  ],
  estMinutes: 40,
  difficulty: "בינוני",
  prerequisites: ["TypeScript: טיפוסים שתופסים באגים לפני שהם קורים"],
};

const SLIDES: Slide[] = [
  {
    title: "הפרויקט: הקריאה הראשונה שלך ל-AI API אמיתי",
    bullets: [
      "עד עכשיו תרגלת עם נתונים מדומים. עכשיו תקרא ל-API אמיתי — בדיוק אותו endpoint שמפעיל את ה-AI Mentor הצף באתר הזה.",
      "זו בדיוק אבן הבניין הבסיסית של כל אפליקציית AI: fetch + async/await + עיבוד תשובת JSON.",
      "בכל פרויקט AI שתבנה מכאן והלאה — זה בדיוק הדפוס שתחזור עליו (רק עם endpoints שונים).",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "אילו שלושה מושגים מהמודול הזה משולבים בפרויקט הזה?",
    options: [
      "CSS, HTML, SQL",
      "async/await, fetch, וטיפוסי TypeScript",
      "Git, Docker, Linux",
      "React, Vue, Angular",
    ],
    correctIndex: 1,
    explanation: "הפרויקט משלב בדיוק את שלושת הנושאים שלמדת: אסינכרוניות, קריאת רשת, וטיפוסים.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "הפרויקט שלך", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "lab",
    label: "מעבדה: קריאה אמיתית ל-API",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <Trophy size={18} className="shrink-0 text-primary" />
          <span>
            שנה את השאלה, ואז לחץ ”הרץ קריאה אמיתית”. אם למנהל האתר מוגדר מפתח API, תקבל
            תשובה אמיתית מה-AI; אחרת תראה הודעה שקוראת לחיבור המפתח — גם זו תגובת API אמיתית, לא
            מזויפת.
          </span>
        </div>
        <ApiCallerLab />
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "summary",
    label: "סיכום המודול והטראק",
    content: (
      <div className="rounded-xl bg-card p-5 text-sm">
        <div className="mb-2 flex items-center gap-2 font-bold">
          <Sparkles size={18} className="text-primary" /> מה כיסינו בטראק ”יסודות תכנות ל-AI”
        </div>
        <ul className="space-y-1.5">
          <li>✅ JavaScript: משתנים, פונקציות, מערכים ואובייקטים</li>
          <li>✅ Async/await ו-fetch — התשתית לכל קריאת AI API</li>
          <li>✅ TypeScript — טיפוסים שתופסים באגים מוקדם</li>
          <li>✅ פרויקט: קריאה אמיתית ל-AI API מהאתר עצמו</li>
        </ul>
        <p className="mt-3 text-muted">
          זהו! סיימת את כל שלב היסודות. מכאן ואילך — הליבה האמיתית של האקדמיה: יסודות AI, Prompt
          Engineering, Claude Code, MCP, RAG, Agents, ובניית מוצרי AI מסחריים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
