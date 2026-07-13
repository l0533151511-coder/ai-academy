"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-agents",
  moduleSlug: "single-agent",
  lessonSlug: "project-atlasdesk-agent",
  title: "פרויקט מודול: AtlasDesk מקבל סוכן עם החלטה אוטונומית",
  objectives: [
    "לתכנן ולממש סוכן שמחליט בעצמו אילו כלים להפעיל ומתי לעצור",
    "להוסיף הגנות production (מגבלת סיבובים, מגבלת עלות, לוג מלא)",
    "לבדוק את הסוכן על מקרה שבו הוא צריך כמה סיבובי tool calling כדי לענות",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["production-agent-case-study"],
};

const SLIDES: Slide[] = [
  {
    title: "הסוכן כבר חי — לחץ '🤖 סוכן' ב-/atlasdesk",
    bullets: [
      "app/api/ai/agent-chat/route.ts מיישם בדיוק את ההגנה שלמדת במקרה הבוחן: אם הסוכן קורא לאותו כלי עם אותם פרמטרים פעמיים ברצף, הוא עוצר מיד ומבקש הבהרה — לא ממשיך 'לנחש'.",
      "נסה: שאל \"מה הסטטוס של הפנייה שלי?\" בלי לציין מספר — עקוב אחרי ה-badge הכתום שמופיע כשההגנה מופעלת.",
      "השווה למצב 'כלים מחוברים' הרגיל — שם אין הגנה כזו, הסוכן עלול לנחש שוב ושוב עד מגבלת הסיבובים.",
    ],
  },
  {
    title: "ה-trade-off: ריגישות מול הפרעה למשתמש",
    bullets: [
      "הגנת 'קריאה חוזרת זהה' היא בחירה מכוונת: פשוטה וזולה (השוואת מחרוזות), אבל היא תופסת רק תקיעות מסוג אחד — אותה קריאה בדיוק פעמיים ברצף.",
      "אפשר להחמיר (לעצור כבר אחרי ניסיון כושל אחד) — פחות בזבוז, אבל יותר עצירות-שווא שמפריעות למשתמש כשהסוכן היה מתקן את עצמו לבד בסיבוב הבא.",
      "אפשר להקל (לזהות גם קריאות דומות-אך-לא-זהות דרך embedding) — תופס יותר, אבל יקר ומורכב יותר. הבחירה כאן: התבנית הפשוטה שמכסה את רוב המקרים בעלות אפסית — וזו החלטה הנדסית לגיטימית, לא פשרה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל המרכזי בין מצב 'כלים מחוברים' (tool-chat) למצב 'סוכן' (agent-chat) ב-AtlasDesk?",
    options: [
      "אין הבדל אמיתי, זה אותו קוד בשם אחר",
      "agent-chat מוסיף הגנת production: זיהוי קריאה חוזרת לאותו כלי עם אותם פרמטרים, ועצירה מיידית לבקשת הבהרה — tool-chat רץ עד מגבלת הסיבובים בלי הגנה כזו",
      "agent-chat לא תומך בכלל ב-tool calling",
      "tool-chat יקר יותר מ-agent-chat",
    ],
    correctIndex: 1,
    explanation: "זו בדיוק ההגנה שנוספה בעקבות מקרה הבוחן — זיהוי 'ניחוש חוזר' ועצירה ל-human-in-the-loop, לפני שהסוכן מבזבז את כל 4 הסיבובים על ניחושים.",
    optionNotes: [
      "לא נכון: יש הבדל אמיתי וממשי בלוגיקת ההגנה — לא רק שם שונה לאותו קוד.",
      "התשובה הנכונה: זו בדיוק התוספת שנלמדה במקרה הבוחן — זיהוי חתימת קריאה חוזרת (toolCallSignature) ועצירה מיידית.",
      "לא נכון: agent-chat כן משתמש ב-tool calling — הוא בדיוק בנוי סביב אותה יכולת, עם הגנה נוספת.",
      "לא נכון: העלות תלויה במספר הסיבובים בפועל, לא בבחירת המסלול עצמו — אבל agent-chat דווקא עשוי לחסוך עלות בזכות העצירה המוקדמת בתרחישי כשל.",
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
        why="פרויקט זה קיים כדי להראות שהגנת production לא צריכה להיות מורכבת — זיהוי 'קריאה חוזרת זהה' הוא בדיקת שוויון פשוטה (toolCallSignature), אבל היא פותרת בדיוק את תרחיש הכשל הכי נפוץ בסוכנים."
        alternatives="אפשר לזהות תקיעות בדרכים מתוחכמות יותר (embedding similarity בין קריאות, מודל 'שופט' נפרד שמזהה חוסר התקדמות) — יקר וגם מורכב יותר; ההשוואה הפשוטה (חתימה זהה) תופסת את רוב המקרים הנפוצים בעלות נמוכה."
        whenNotTo="אם המשימה תמיד דורשת בדיוק אותו רצף כלים (pipeline דטרמיניסטי) — אין צורך בסוכן אוטונומי כלל, ולכן גם לא בהגנות האלו. הסוכן מוצדק רק כשמספר הכלים/הסיבובים באמת לא ידוע מראש."
        maintenance="ההגנה מבוססת על השוואת toolCallSignature — אם תוסיף כלים חדשים או תשנה פורמט פרמטרים, ודא שהחתימה עדיין מזהה נכון 'קריאה זהה'. לוג של כל עצירת-הגנה (מתי ולמה ה-badge הופעל) הופך את הסוכן לניתן-לתחזוקה: אתה רואה כמה פעמים ההגנה נכנסה לפעולה בפרודקשן ועל אילו קלטים."
        commonMistakes="להוסיף הגנות 'אחרי' שמשתמש ראשון נתקל בבעיה, במקום לתכנן אותן מראש (כמו בשיעור הזה) — בדיוק ההבדל בין מהנדס מתחיל למהנדס מנוסה."
        cost="ההגנה כמעט ולא מוסיפה עלות (השוואת מחרוזות פשוטה) — אבל היא חוסכת עלות משמעותית במקרה כשל, כי היא עוצרת אחרי סיבוב אחד כפול במקום ממתינה למגבלת 4 הסיבובים."
        realWorld="זו הגנה שכל מוצר סוכן AI production אמיתי צריך — Zendesk AI, Intercom Fin וכל מערכת דומה מיישמת גרסה כלשהי של זיהוי 'הסוכן לא מתקדם'."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="single-agent-project-atlasdesk-agent"
        title="בדוק והרחב את הסוכן החי של AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk. הסוכן כבר עובד (app/api/ai/agent-chat/route.ts) — בדוק אותו וחפש תרחיש כשל נוסף שהוא לא מכסה עדיין."
        steps={[
          "פתח /atlasdesk, הפעל '🤖 סוכן' ו'מצב מפתח', ושאל שאלה בלי מספר פנייה — ודא שה-badge הכתום מופיע.",
          "עם Claude Code, קרא את app/api/ai/agent-chat/route.ts וזהה בדיוק איפה ה-toolCallSignature מושווה.",
          "חשוב על תרחיש כשל נוסף (למשל: הסוכן קורא לשני כלים שונים לסירוגין בלי להתקדם) — האם ההגנה הנוכחית תופסת אותו?",
          "בקש מ-Claude Code להציע שיפור להגנה (או להסביר למה ההגנה הנוכחית מספיקה למקרה הזה).",
        ]}
        successCriteria={[
          "ראית בפועל את ה-badge של הגנת production מופעל",
          "אתה מבין בדיוק את מנגנון הזיהוי בקוד, לא רק שהוא 'עובד'",
          "בדקת תרחיש כשל נוסף וקיבלת תשובה מנומקת (בין אם ההגנה הנוכחית מספיקה ובין אם לא)",
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
        <p className="font-semibold">סיימת את מודול הסוכן הבודד!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו כולל סוכן אוטונומי עם הגנת production אמיתית. במודול הבא (Multi-Agent)
          נלמד איך לתאם בין כמה סוכנים — למשל סוכן ראשוני שמסלים למומחה כשהוא לא בטוח בתשובה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
