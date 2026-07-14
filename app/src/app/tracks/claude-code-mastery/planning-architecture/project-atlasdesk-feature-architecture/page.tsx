"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "planning-architecture",
  lessonSlug: "project-atlasdesk-feature-architecture",
  title: "פרויקט מודול: תוכנית ארכיטקטורה + מימוש ב-AtlasDesk",
  objectives: [
    "לתכנן ולתעד ארכיטקטורה לפיצ'ר אמיתי: זיכרון שיחה persistent",
    "לפרק את הפיצ'ר לצעדים קטנים ולממש אותו בעזרת Claude Code צעד-אחר-צעד",
    "לאמת שהתוצאה תואמת את התוכנית המקורית",
  ],
  estMinutes: 50,
  difficulty: "מתקדם",
  prerequisites: ["decomposition-large-tasks"],
};

const SLIDES: Slide[] = [
  {
    title: "פרויקט המודול: הכל ביחד",
    bullets: [
      "במודול הזה למדת ארבעה כישורים: עיצוב פרומפט מדויק, תכנון לפני ביצוע, architecture-first, ופירוק משימות. עכשיו תשתמש בכולם יחד על פיצ'ר אמיתי אחד ב-AtlasDesk.",
      "הפיצ'ר: זיכרון שיחה persistent — כרגע ב-AtlasDesk כל רענון דף מאבד את השיחה. תתכנן ותממש פתרון שהשיחה נשמרת (localStorage לפחות, Supabase אם רלוונטי) ונטענת מחדש.",
    ],
  },
  {
    title: "תזכורת לתהליך המלא",
    bullets: [
      "1. פרומפט מדויק: הגדר מטרה/אילוצים/קריטריון הצלחה למשימה כולה.",
      "2. תכנון: בקש תוכנית לפני קוד — אילו קבצים ישתנו, אילו החלטות מתקבלות.",
      "3. Architecture-first: הגדר את חוזה הנתונים (טיפוס לשיחה שמורה) לפני מימוש הלוגיקה.",
      "4. פירוק: חלק את המימוש לצעדים ניתנים לאימות (טיפוס → שמירה → טעינה → UI).",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה מייחד את פרויקט המודול הזה משיעורי התרגול הקודמים?",
    options: [
      "שום דבר, זה עוד תרגיל רגיל",
      "הוא דורש שילוב של כל ארבעת הכישורים (פרומפט מדויק, תכנון, ארכיטקטורה, פירוק) על משימה אחת אמיתית, לא כל אחד בנפרד",
      "הוא לא קשור ל-AtlasDesk",
      "הוא לא דורש בכלל להשתמש ב-Claude Code",
    ],
    correctIndex: 1,
    explanation: "כל שיעור קודם תרגל כישור בודד; הפרויקט מאלץ שילוב שלהם על משימה הנדסית אמיתית ומלאה.",
    optionNotes: [
      "לא נכון: יש הבדל משמעותי מהתרגילים הקודמים — זה בדיוק מה שהופך אותו לפרויקט מסכם ולא לעוד תרגיל בודד.",
      "התשובה הנכונה: תרגול משולב על משימה אחת אמיתית חושף אינטראקציות בין כישורים (למשל: איך תכנון משפיע על פירוק) שלא מתגלות כשמתרגלים כל כישור בבידוד.",
      "לא נכון: AtlasDesk הוא בדיוק ליבת התרגיל — כל המודול נבנה סביב פרויקט אמיתי ומתמשך, לא נספח צדדי.",
      "לא נכון: השימוש ב-Claude Code הוא תנאי הכרחי לביצוע המשימה בפועל — בלעדיו אי אפשר לבצע את התרגיל כלל.",
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
        why="פרויקט זה קיים כי כישורים בודדים (פרומפט, תכנון, ארכיטקטורה, פירוק) נלמדים בנפרד אך מיושמים תמיד ביחד בעבודה אמיתית — תרגול משולב הוא הדרך היחידה לבנות את ההרגל האמיתי."
        alternatives="ניתן לממש את הפיצ'ר ישירות בבקשה אחת בלי לעבור את התהליך המלא — יעבוד, אבל יפספס בדיוק את התרגול שהמודול הזה נועד לתת."
        whenNotTo="—"
        commonMistakes="לדלג על שלב התכנון/ארכיטקטורה ולקפוץ ישר למימוש 'כי זה נראה פשוט' — בדיוק ההרגל שהמודול הזה נועד לשבור."
        cost="השקעה מלאה בתהליך (תכנון+ארכיטקטורה+פירוק) לוקחת יותר זמן מראש, אבל מייצרת פיצ'ר יציב שממשיך לשרת אותך (ואת שאר האקדמיה) בכל מודול עתידי שיבנה עליו."
        realWorld="זיכרון שיחה persistent הוא פיצ'ר production אמיתי — כל מוצר SaaS AI רציני צריך אותו. זה בדיוק סוג ההחלטה שמהנדס AI בכיר מקבל ביום-יום."
      />
    ),
  },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="cc-project-atlasdesk-feature-architecture"
        title="תכנן ומש את זיכרון השיחה ה-persistent של AtlasDesk"
        context="זהו פרויקט המודול — התוצר המסכם של 'חשיבה לפני קוד'. עבוד מול הריפו האמיתי של AtlasDesk."
        steps={[
          "כתוב פרומפט מדויק שמתאר את המטרה (שיחה נשמרת בין רענוני דף), האילוצים (לא לשבור את ה-UI/API הקיימים), וקריטריון ההצלחה (רענון דף לא מוחק את השיחה).",
          "בקש מ-Claude Code תוכנית מלאה לפני כל קוד — כולל המלצה: localStorage בלבד, או גם Supabase (בדוק אם יש כבר טבלת conversations/messages, בדומה ל-notes/bookmarks).",
          "אשר/תקן את התוכנית, ואז בקש הגדרת טיפוס (חוזה) לשיחה שמורה — לפני מימוש הלוגיקה.",
          "פרק את המימוש לצעדים (הגדרת טיפוס → שמירה → טעינה בעת פתיחת הדף → בדיקה ידנית) ובצע כל צעד בנפרד עם אימות בין הצעדים.",
          "בדוק את התוצאה הסופית: רענן את דף /atlasdesk אחרי שיחה — האם היא נשמרת?",
          "עדכן את docs/13-atlasdesk-features.md עם היכולת החדשה (שורה 2.5 במיפוי AtlasDesk).",
        ]}
        successCriteria={[
          "שיחה ב-/atlasdesk שורדת רענון דף",
          "יש טיפוס TypeScript ברור לנתון השמור, לא מבנה ad-hoc",
          "עברת דרך כל 4 השלבים של התהליך (פרומפט מדויק → תכנון → ארכיטקטורה → פירוק), לא רק ישר למימוש",
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
        <p className="font-semibold">סיימת את מודול התכנון והארכיטקטורה!</p>
        <p className="mt-1 text-muted">
          AtlasDesk עכשיו שומר שיחות — פיצ'ר production אמיתי, שתוכנן ומומש בתהליך הנדסי מלא.
          במודול הבא נעבור לתהליכי הפיתוח הליבתיים: בניית פיצ’רים מאפס, refactoring בטוח,
          debugging, ו-TDD — עם Claude Code כשותף עבודה יומיומי.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
