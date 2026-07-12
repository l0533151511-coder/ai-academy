"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "advanced-production",
  lessonSlug: "common-mistakes-anti-patterns",
  title: "טעויות נפוצות ואנטי-פטרנים",
  objectives: [
    "לזהות את חמשת האנטי-פטרנים הנפוצים ביותר בעבודה עם Claude Code",
    "להבין למה 'אמון עיוור' בפלט AI הוא הטעות הכי יקרה",
    "לבנות הרגלי בדיקה שמונעים את רוב הטעויות הנפוצות",
  ],
  estMinutes: 25,
  difficulty: "בינוני",
  prerequisites: ["production-deployment-workflows"],
};

const SLIDES: Slide[] = [
  {
    title: "חמשת האנטי-פטרנים — כולם כבר נראו בטראק הזה",
    bullets: [
      "1. אמון עיוור — לקבל פלט AI בלי לבדוק (בדיוק למה TDD ו-code review קיימים, מודולים 3-4).",
      "2. פרומפט מעורפל — 'תתקן את זה' בלי הקשר (מודול 2, פרומפט מדויק).",
      "3. דילוג על תכנון — ישר לקוד במשימה מורכבת (מודול 2, תכנון-לפני-ביצוע).",
      "4. context מוזנח — סשן שנהיה 'עמוס' ולא ממוקד (מודול 1).",
      "5. תיעוד מוזנח — commit/CLAUDE.md שלא מתעדכנים (מודול 5).",
    ],
  },
  {
    title: "למה 'אמון עיוור' הוא הכי יקר",
    bullets: [
      "כל שאר הטעויות מתגלות מהר (build נכשל, טסט נכשל). אמון עיוור בקוד שגוי-בשקט (silent bug, מודול 3) יכול לרוץ שבועות עד שמישהו שם לב — הנזק המצטבר הכי גדול.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'אמון עיוור' בפלט AI נחשב לאנטי-פטרן הכי יקר מבין החמישה?",
    options: [
      "הוא לא באמת יקר יותר משאר האנטי-פטרנים",
      "כי בניגוד לפרומפט מעורפל או context מוזנח (שמתגלים מהר), קוד שגוי שהתקבל באמון עיוור עלול לרוץ בשקט לאורך זמן לפני שהנזק מתגלה",
      "כי הוא היחיד שקשור לכסף",
      "כי הוא היחיד שקרה פעם אחת בלבד באקדמיה"
    ],
    correctIndex: 1,
    explanation: "טעויות אחרות מתגלות מהר (build/טסט נכשל); אמון עיוור בקוד שגוי-בשקט יכול להצטבר נזק ממושך לפני שמישהו מבחין.",
    optionNotes: [
      "לא נכון: יש הבדל אמיתי בחומרה, בגלל משך הזמן שהבעיה יכולה להישאר בלתי-מזוהה.",
      "התשובה הנכונה: זמן הגילוי הוא ההבדל הקריטי — טעויות אחרות נתפסות מהר, אמון עיוור עלול לחמוק לאורך זמן.",
      "לא נכון: כל חמשת האנטי-פטרנים יכולים לגרום לעלות (זמן, טוקנים, נזק) — זה לא ייחודי לאמון עיוור.",
      "לא נכון: כל האנטי-פטרנים האלו נראו יותר מפעם אחת באקדמיה — זה לא הקריטריון לחומרה.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: 5 אנטי-פטרנים, כולם כבר נראו", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="אנטי-פטרנים חוזרים על עצמם כי הם 'קיצורי דרך' טבעיים — קל להתפתות אליהם כשממהרים, גם למרות שכל מודול בטראק הזה לימד את הדרך הנכונה."
        alternatives="להתעלם מהם ולתקן אד-הוק כשמשהו נשבר — עובד לפעמים, אבל ההרגלים הטובים (מהמודולים הקודמים) מונעים את רוב הבעיות מראש."
        whenNotTo="—"
        commonMistakes="לדעת את חמשת האנטי-פטרנים תיאורטית אבל לא לבדוק את עצמך בזמן אמת אם אתה נופל לאחד מהם."
        cost="זיהוי אנטי-פטרן מוקדם עולה רגע של עצירה — מונע שעות של נזק מצטבר (בדיוק כמו silent bug שרץ שבועות)."
        realWorld="כל אחד מחמשת האנטי-פטרנים הודגם בפועל באקדמיה הזו עצמה — לא תיאוריה, אלא דברים שבאמת נמנעו (או תוקנו) לאורך הבנייה."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="advanced-production-common-mistakes-anti-patterns"
        title="בדוק את עצמך מול 5 האנטי-פטרנים"
        context="עבור על העבודה האחרונה שלך עם Claude Code (בכל פרויקט)."
        steps={[
          "עבור על חמשת האנטי-פטרנים אחד-אחד.",
          "לכל אחד, שאל את עצמך בכנות: נפלתי בזה לאחרונה?",
          "בחר אחד שנפלת בו וכתוב איך תמנע אותו בפעם הבאה.",
        ]}
        successCriteria={[
          "בדקת את עצמך בכנות מול כל חמשת האנטי-פטרנים",
          "יש לך תוכנית קונקרטית למניעה עתידית, לא רק הכרה",
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
          הדפס (או שמור) את רשימת חמשת האנטי-פטרנים במקום שתראה אותו לעתים קרובות — כתזכורת
          לפני שיחות Claude Code עתידיות.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
