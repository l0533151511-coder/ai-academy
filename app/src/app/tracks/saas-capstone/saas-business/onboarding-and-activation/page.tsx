"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "saas-capstone",
  moduleSlug: "saas-business",
  lessonSlug: "onboarding-and-activation",
  title: "אונבורדינג והפעלת משתמשים",
  objectives: [
    "להבין את החשיבות של 'רגע ה-aha' — מתי משתמש חדש רואה ערך אמיתי לראשונה",
    "לעצב זרימת onboarding ל-AtlasDesk שמביאה לקוח חדש לערך מהר",
    "להבין מדדי אקטיבציה (activation metrics) כמנבאים לשימור לקוחות",
  ],
  estMinutes: 25,
  difficulty: "בינוני",
  prerequisites: ["subscription-billing-concepts"],
};

const SLIDES: Slide[] = [
  {
    title: "רגע ה-'aha'",
    bullets: [
      "לקוח חדש שנרשם ל-AtlasDesk לא 'מבין' את הערך שלו מיד — הוא צריך לחוות רגע קונקרטי שבו הוא רואה תוצאה אמיתית (למשל: RAG עונה נכון על שאלה אמיתית מתוך המסמכים שלו).",
      "ככל שלוקח יותר זמן/צעדים להגיע לרגע הזה, כך יותר משתמשים 'נושרים' לפני שהם בכלל מבינים למה זה שווה תשלום.",
    ],
  },
  {
    title: "עיצוב onboarding ל-AtlasDesk",
    bullets: [
      "צעד 1: הרשמה מהירה (לא לבקש הרבה פרטים מראש).",
      "צעד 2: להביא את הלקוח מיד ל'רגע aha' — למשל, לתת לו לשאול שאלה על מסמך העזרה ולראות RAG עונה נכון, בלי הגדרה מסובכת.",
      "צעד 3: רק אחרי שראה ערך, להציג את היכולות המתקדמות (סוכן, אסקלציה) — לא להציף הכל בבת אחת.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה חשוב להביא משתמש חדש ל'רגע aha' כמה שיותר מהר, לפני שמציגים לו יכולות מתקדמות?",
    options: [
      "זה לא באמת משנה, אפשר להציג הכל בבת אחת",
      "כי משתמש שלא חווה ערך מהר עלול לנשור לפני שהוא בכלל מבין למה המוצר שווה תשלום — הרושם הראשוני קריטי לשימור",
      "כי יכולות מתקדמות תמיד מבלבלות משתמשים",
      "כי זה דורש פחות קוד"
    ],
    correctIndex: 1,
    explanation: "רוב הנשירה (churn) קורית מוקדם — אם משתמש לא רואה ערך מהר, הוא לא נותן למוצר הזדמנות שנייה.",
    optionNotes: [
      "לא נכון: זה כן משנה מאוד — עומס מידע מוקדם מדי הוא סיבה נפוצה לנשירה.",
      "התשובה הנכונה: הרושם הראשוני קובע אם משתמש בכלל ימשיך להשתמש במוצר — 'aha moment' מוקדם הוא קריטי לשימור.",
      "לא נכון: לא כל יכולת מתקדמת מבלבלת — הבעיה היא התזמון (להציג הכל מיד), לא היכולת עצמה.",
      "לא נכון: זה לא שיקול טכני של כמות קוד — זה שיקול חוויית משתמש.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרושם הראשוני קובע הכל", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: onboarding עמוס מול ממוקד-ערך",
    content: (
      <PromptComparisonLab
        title="onboarding ללקוח חדש ב-AtlasDesk"
        unitLabel="זרימת onboarding"
        bad={{
          label: "הכל בבת אחת",
          content: `הרשמה → הגדרת ארגון → הזמנת חברי צוות →
העלאת כל מאמרי העזרה → הגדרת סוכן → הגדרת אסקלציה
→ (רק אחרי כל זה) לראות תוצאה ראשונה`,
          outcome: "משתמש חדש מתייאש לפני שהוא בכלל רואה שהמוצר עובד — הרבה שלבים לפני כל ערך נראה-לעין.",
        }}
        good={{
          label: "ממוקד-ערך תחילה",
          content: `הרשמה מהירה → שאלה לדוגמה מוצגת מיד עם
תשובת RAG על מסמך דוגמה → "וואו, זה עובד!" →
רק עכשיו: להעלות את המסמכים שלך`,
          outcome: "משתמש רואה ערך אמיתי (RAG שעונה נכון) תוך דקה, לפני שנדרשת השקעה משמעותית ממנו.",
        }}
        takeaway="אותו עיקרון כמו MVP (מודול קודם) — לא 'הכל בבת אחת', אלא הדבר החשוב ביותר קודם. onboarding טוב הוא MVP בזעיר-אנפין של חווית המשתמש הראשונה."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="onboarding ממוקד-ערך קיים כי משתמשים מקבלים החלטה 'להישאר או לעזוב' תוך דקות ראשונות — אין זמן לחכות שהם 'יגלו' את הערך בעצמם."
        alternatives="onboarding מקיף שמסביר הכל מראש — נותן תמונה מלאה, אבל מסכן איבוד משתמשים לפני שהם בכלל התחילו."
        whenNotTo="למוצר B2B מורכב שבו הרכישה עצמה כבר כרוכה בהדגמה/הכשרה (sales-led) — שם onboarding הדרגתי ומקיף מתאים יותר."
        commonMistakes="למדוד רק 'signups' במקום 'activation' (משתמשים שהגיעו ל-aha moment) — מספר הרשמות גבוה לא אומר כלום אם אף אחד לא נשאר."
        cost="עיצוב onboarding טוב דורש איטרציה (בדיקת מדדי אקטיבציה, שיפור) — אבל משפיע ישירות על שימור לקוחות ולכן על ההכנסה."
        realWorld="בפרויקט המודול הבא (רשימת מוכנות להשקה) תבדוק אם ל-AtlasDesk יש בכלל 'רגע aha' ברור — או שצריך לעצב אותו מחדש לפני השקה."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="saas-business-onboarding-and-activation"
        title="עצב onboarding ממוקד-ערך ל-AtlasDesk"
        context="עבוד עם Claude Code, וגם עם /atlasdesk עצמו כדי לחוות את חוויית המשתמש הנוכחית."
        steps={[
          "פתח /atlasdesk כאילו אתה משתמש חדש בפעם הראשונה — כמה זמן/צעדים לוקח עד שאתה רואה ערך אמיתי (תשובה טובה)?",
          "עם Claude Code, תכננו זרימת onboarding משופרת שמביאה לרגע aha הכי מהר שאפשר.",
          "הגדירו מדד אקטיבציה קונקרטי (למשל: 'שאל שאלה אחת וקיבל תשובה מבוססת-מקור תוך 60 שניות מההרשמה').",
        ]}
        successCriteria={[
          "חווית את ה-onboarding הנוכחי בעצמך ותיארת כמה זמן לוקח לערך ראשון",
          "יש לך זרימת onboarding משופרת קונקרטית",
          "יש לך מדד אקטיבציה מדיד, לא 'שהמשתמש יהיה מרוצה'",
        ]}
      />
    ),
  },
  {
    id: "homework",
    label: "סיכום מודול",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">סיימת את מודול העסקי: billing ואונבורדינג!</p>
        <p className="mt-1 text-muted">
          יש לך עכשיו הבנה של מחזור מנוי, webhook billing, ואונבורדינג ממוקד-ערך. במודול האחרון
          (השקה) תבנה checklist מוכנות מלא ותסכם את כל מסע AtlasDesk לאורך האקדמיה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
