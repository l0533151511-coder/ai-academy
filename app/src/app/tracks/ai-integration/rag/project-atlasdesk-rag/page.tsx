"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "rag",
  lessonSlug: "project-atlasdesk-rag",
  title: "פרויקט מודול: AtlasDesk עונה מתוך בסיס הידע האמיתי שלו",
  objectives: [
    "לחבר את חיפוש הסמנטי הקיים ל-pipeline RAG מלא בתוך SupportChat",
    "לוודא שתשובות מבוססות על תוכן המאמרים בפועל, עם ציטוט מקור",
    "לבדוק מקרה שבו אין מסמך רלוונטי, ולוודא שהמערכת מודה בכך במקום להמציא",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["evaluating-rag-quality"],
};

const SLIDES: Slide[] = [
  {
    title: "RAG מלא כבר חי ב-AtlasDesk — לחץ 'RAG מופעל'",
    bullets: [
      "לחץ \"📚 RAG מופעל\" ב-/atlasdesk, ושאל שאלה כמו \"איך מבטלים מנוי?\" — התשובה תגיע עם ציטוט המאמר שנעשה בו שימוש (מוצג מתחת להודעה).",
      "המימוש חי ב-app/api/ai/rag-chat/route.ts — משלב Retrieval (embeddings, מהמודול הקודם) + Augmentation (הזרקת המאמרים הרלוונטיים ל-system prompt) + Generation (Claude, עם הנחיית grounding קפדנית).",
      "שים לב לסף (threshold) similarity > 0.3 בקוד — אם שום מאמר לא עובר את הסף, ה-context שנשלח למודל הוא ריק, והוא נאלץ להודות שאין לו מידע.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה יש סף (threshold) similarity > 0.3 במימוש ה-RAG, במקום פשוט לשלוח תמיד את המאמר הכי דומה?",
    options: [
      "כדי לחסוך טוקנים בלבד, אין סיבה איכותית",
      "כדי למנוע הזרקת מאמר לא-רלוונטי כ'הקשר' — אם אף מאמר לא רלוונטי מספיק, עדיף לא לשלוח כלום ולתת למודל להודות בכך, מאשר לשלוח מידע מטעה",
      "כי Claude API דורש סף מינימלי טכנית",
      "כדי לחסוך זמן חישוב embeddings",
    ],
    correctIndex: 1,
    explanation: "בלי סף, המערכת תמיד 'תמצא' משהו (גם אם לא רלוונטי באמת) ותזריק אותו כ-context — מה שעלול להטעות את המודל יותר מלא לשלוח כלום.",
    optionNotes: [
      "לא נכון: יש כאן שיקול איכותי אמיתי (מניעת הטעיה), לא רק חיסכון טוקנים — למרות שזה יתרון נלווה.",
      "התשובה הנכונה: הסף מבטיח שרק מידע *באמת* רלוונטי נכנס ל-context — עדיף 'אין לי מידע' אמיתי מאשר תשובה מבוססת על מאמר לא-קשור שנשלח 'כי הוא היה הכי טוב מהגרועים'.",
      "לא נכון: אין דרישה טכנית כזו מ-Claude API — הסף הוא החלטת עיצוב שלנו, לא מגבלת המערכת.",
      "לא נכון: הסף מיושם אחרי שכל ה-embeddings כבר חושבו — הוא לא חוסך את זמן החישוב עצמו.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הפרויקט המסכם של המודול", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="פרויקט זה קיים כדי לחבר סוף-סוף את כל חלקי ה-RAG (retrieval, chunking-awareness, grounding) לכדי מערכת אחת שרואים אותה עובדת על מוצר אמיתי."
        alternatives="אפשר היה להשאיר RAG כ'הדגמה נפרדת' בלי לשלב אותו ב-SupportChat עצמו — אבל זה מפספס בדיוק את מה שהופך את האקדמיה הזו לשונה: לראות תכונה חיה במוצר אמיתי, לא רק בדוגמת קוד מבודדת."
        whenNotTo="—"
        commonMistakes="לבדוק RAG רק עם שאלות 'קלות' שברור שיש להן תשובה טובה — הבדיקה האמיתית היא דווקא שאלות שאין להן כיסוי, כדי לוודא שהמערכת מודה בזה ולא ממציאה."
        cost="כל שאלה במצב RAG עולה: embedding לשאלה + embeddings לכל המאמרים (בהדגמה הזו — מחושבים בכל בקשה, כמו במודול הקודם) + קריאת Claude עם context מורחב. יקר יותר מצ'אט רגיל, אבל מוצדק כשנכונות המידע קריטית."
        realWorld="זו בדיוק הארכיטקטורה שמערכות תמיכה AI אמיתיות (Intercom Fin, Zendesk AI) בנויות עליה — RAG על בסיס ידע פנימי, עם grounding קפדני נגד הזיות."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="rag-project-atlasdesk-rag"
        title="בדוק ושפר את ה-RAG החי של AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk. RAG כבר עובד (app/api/ai/rag-chat/route.ts) — המשימה שלך: לבדוק אותו לעומק ולשפר אותו."
        steps={[
          "פתח /atlasdesk, הפעל \"RAG מופעל\" ו\"מצב מפתח\", ושאל 3 שאלות: אחת עם תשובה ברורה במאמרים, אחת עם תשובה חלקית, ואחת שלא קשורה בכלל.",
          "בדוק את המקורות המוצגים (similarity scores) — האם הם הגיוניים?",
          "עם Claude Code, קרא את app/api/ai/rag-chat/route.ts ובקש לו להסביר כל שורה בלולאת ה-RAG.",
          "בקש מ-Claude Code להוסיף מאמר עזרה חדש (ל-lib/atlasdesk/help-articles.ts) על נושא שחסר כרגע, ובדוק ששאלה על הנושא הזה עכשיו מקבלת תשובה נכונה עם ציטוט.",
        ]}
        successCriteria={[
          "בדקת בעצמך את שלושת סוגי המקרים (תשובה מלאה/חלקית/לא-קשורה) וראית שהמערכת מתנהגת נכון בכל אחד",
          "הוספת מאמר עזרה חדש ואימתת שה-RAG משתמש בו כשרלוונטי",
          "אתה מבין כל שלב בקוד — לא רק שהוא 'עובד'",
        ]}
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "homework",
    label: "סיכום מודול",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">סיימת את מודול RAG — ואת שלושת המודולים הראשונים של Track ai-integration!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו: שומר שיחות, מפעיל כלים אמיתיים (Tool Calling), ועונה מתוך בסיס ידע
          אמיתי (RAG). במודול הבא (Fine-tuning) נסיים את הטראק עם נושא תיאורטי-רוב לפני שנעבור
          לטראק AI Agents — שם AtlasDesk יקבל סוכן אמיתי עם זיכרון וקבלת החלטות.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
