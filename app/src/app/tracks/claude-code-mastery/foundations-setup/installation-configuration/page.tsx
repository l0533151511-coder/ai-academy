"use client";

import { Terminal, KeyRound, FolderCog, MonitorSmartphone } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "foundations-setup",
  lessonSlug: "installation-configuration",
  title: "התקנה והגדרה של Claude Code",
  objectives: [
    "להתקין את Claude Code ולהבין את מודל האימות (auth) שלו",
    "להבין את ההבדל בין הגדרות גלובליות (~/.claude) להגדרות פרויקט",
    "להכיר את אינטגרציות ה-IDE העיקריות ומתי להשתמש בכל אחת",
  ],
  estMinutes: 25,
  difficulty: "מתחיל",
  prerequisites: [],
};

const SLIDES: Slide[] = [
  {
    title: "מתחילים טראק חדש: Claude Code Mastery",
    bullets: [
      "Claude Code הוא לא 'צ'אטבוט שכותב קוד' — הוא סוכן פיתוח אגנטי שרץ בטרמינל שלך, קורא/כותב קבצים אמיתיים, מריץ פקודות ומבצע workflows שלמים.",
      "מהשיעור הזה ואילך, כל שיעור מסתיים במשימה אמיתית על AtlasDesk — הפרויקט המסחרי שאתה בונה לאורך כל האקדמיה. הקוד באמת ציבורי, באמת רץ בפרודקשן.",
    ],
  },
  {
    title: "התקנה",
    bullets: [
      "Claude Code מותקן כ-CLI (npm install -g @anthropic-ai/claude-code, או דרך המתקין הנייטיבי הרשמי לפי מערכת ההפעלה).",
      "אימות (auth) נעשה מול חשבון Anthropic שלך — או Claude.ai subscription, או API key ארגוני.",
      "אחרי התקנה, `claude` בתוך תיקיית פרויקט פותח סשן אינטראקטיבי שרואה את הקבצים של הפרויקט הזה בלבד.",
    ],
  },
  {
    title: "הגדרות: גלובלי מול פרויקט",
    bullets: [
      "הגדרות גלובליות (~/.claude/) חלות על כל הפרויקטים שלך — הרשאות ברירת מחדל, מודל מועדף, אינטגרציות.",
      "הגדרות פרויקט (.claude/settings.json בתוך הריפו) — חלות רק על הפרויקט הזה, ונכנסות ל-git כדי שכל הצוות יעבוד לפי אותם כללים.",
      "עיקרון מפתח: פרויקט צוותי → הגדרות בריפו (משותפות). העדפה אישית → גלובלי.",
    ],
  },
  {
    title: "איפה עובדים: טרמינל, IDE, או שניהם",
    bullets: [
      "טרמינל-first: הכי גמיש, עובד בכל סביבה, הכי קרוב ל-'workflow אמיתי' של מהנדס.",
      "אינטגרציית VS Code / JetBrains: נוחה לצפייה בדיפים inline, טובה לעבודה יומיומית בעורך קבוע.",
      "מהנדסים מנוסים בד״כ עובדים משולב: טרמינל לסשנים ארוכים/אוטומציה, IDE לסקירת שינויים.",
    ],
  },
];

const INSTALL_STEPS: DiagramStep[] = [
  { icon: Terminal, label: "1. התקנה", detail: "npm install -g @anthropic-ai/claude-code (או המתקין הנייטיבי) — מוסיף פקודת `claude` גלובלית למערכת." },
  { icon: KeyRound, label: "2. אימות", detail: "`claude` בפעם הראשונה פותח תהליך login מול חשבון Anthropic — Claude subscription או API key ארגוני." },
  { icon: FolderCog, label: "3. כניסה לפרויקט", detail: "`cd my-project && claude` — הסוכן קורא את מבנה התיקייה, ומחפש CLAUDE.md אם קיים (השיעור הבא)." },
  { icon: MonitorSmartphone, label: "4. בחירת סביבת עבודה", detail: "טרמינל טהור, או אינטגרציית IDE (VS Code/JetBrains) שמציגה דיפים inline לצד אותו סוכן." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל העיקרי בין הגדרות גלובליות (~/.claude) להגדרות פרויקט (.claude/settings.json בריפו)?",
    options: [
      "אין הבדל, שתיהן זהות",
      "גלובלי חל על כל הפרויקטים שלך; פרויקט חל רק על ריפו ספציפי ונכנס ל-git לשיתוף עם הצוות",
      "הגדרות פרויקט תמיד גוברות בלי קשר לתוכן",
      "רק אחת מהן נתמכת בפועל",
    ],
    correctIndex: 1,
    explanation: "הגדרות פרויקט משותפות לצוות דרך git; הגדרות גלובליות הן העדפה אישית שלך שחלה בכל מקום. השילוב הנכון: מה שכל הצוות צריך לשתף → פרויקט. מה שאישי לך → גלובלי.",
    optionNotes: [
      "לא נכון: אם לא היה הבדל, לא היה טעם בשני מנגנוני הגדרות נפרדים — Claude Code בכוונה מפריד ביניהם.",
      "התשובה הנכונה: ההפרדה קיימת בדיוק כדי שהגדרות צוותיות (permissions, מוסכמות) יהיו תחת בקרת גרסאות, בעוד העדפות אישיות (מודל מועדף) לא ישתלטו על שאר הצוות.",
      "לא נכון: אין 'גבירה' אוטומטית — שני סוגי ההגדרות מתקיימים זה לצד זה, וכל אחד חל בהקשר שלו.",
      "לא נכון: שני הסוגים נתמכים ופעילים בו-זמנית; הם לא אלטרנטיביים זה לזה.",
    ],
  },
  {
    id: "q2",
    question: "למה מהנדסים מנוסים לרוב עובדים גם בטרמינל וגם ב-IDE, ולא רק באחד?",
    options: [
      "כי חובה להשתמש בשניהם",
      "טרמינל טוב לסשנים ארוכים/אוטומציה, IDE טוב לסקירת דיפים — כל אחד מתאים למשימה אחרת",
      "IDE לא תומך ב-Claude Code בכלל",
      "טרמינל מהיר יותר תמיד ואין סיבה להשתמש ב-IDE",
    ],
    correctIndex: 1,
    explanation: "אלו כלים משלימים, לא מתחרים — הבחירה תלויה בסוג המשימה הנוכחית: עומק אוטומציה מול נוחות סקירה חזותית.",
    optionNotes: [
      "לא נכון: אין חובה טכנית — זו בחירת workflow אישית, לא כלל מחייב.",
      "התשובה הנכונה: לכל כלי יתרון שונה — טרמינל לזרימת עבודה רציפה ואוטומציה, IDE להצגת דיפים ברורה. מהנדסים בוחרים לפי המשימה, לא לפי הרגל בלבד.",
      "לא נכון: יש אינטגרציות רשמיות ל-VS Code ול-JetBrains — הטענה הזו עובדתית שגויה.",
      "לא נכון: 'מהיר יותר' תלוי מאוד במשימה — סקירת דיף חזותי ב-IDE לרוב מהירה יותר מקריאת diff טקסטואלי בטרמינל.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: ברוכים הבאים ל-Claude Code Mastery", content: <SlideDeck slides={SLIDES} /> },
  { id: "install-flow", label: "תהליך ההתקנה שלב-אחר-שלב", content: <StepDiagram steps={INSTALL_STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: סשן ראשון טוב מול גרוע",
    content: (
      <PromptComparisonLab
        title="איך נראה סשן ראשון עם Claude Code על פרויקט חדש"
        unitLabel="גישה"
        bad={{
          label: "לקפוץ ישר לביצוע",
          content: `$ claude
> תבנה לי מערכת ניהול משתמשים מלאה עם auth, roles, ו-dashboard`,
          outcome: "אין קונטקסט על הפרויקט, אין ארכיטקטורה מוסכמת, אין דרך לדעת אם התוצאה מתאימה למוסכמות הקוד הקיים. תוצאה: קוד שצריך לזרוק ולהתחיל מחדש.",
        }}
        good={{
          label: "להבין לפני שמבצעים",
          content: `$ claude
> תסקור את מבנה הפרויקט הנוכחי ותסביר לי את הארכיטקטורה
> (לאחר תשובה) עכשיו: תציע תוכנית להוספת ניהול משתמשים שמתאימה למוסכמות הקיימות`,
          outcome: "הסוכן בונה הבנה אמיתית של הקוד לפני שהוא נוגע בו — התוצאה עקבית עם שאר הפרויקט ודורשת הרבה פחות תיקונים.",
        }}
        takeaway="הפער הגדול ביותר בין מתחילים למומחים ב-Claude Code הוא לא ידע טכני — הוא משמעת: להבין לפני שמבצעים. זה יהיה הנושא המרכזי של המודול הבא."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הפרדה בין הגדרות גלובליות לפרויקט קיימת כי כלי פיתוח משותפים לצוות (permissions, מוסכמות) חייבים להיות בשליטת גרסאות (git), בעוד העדפות אישיות (מודל מועדף, קיצורי מקלדת) לא."
        alternatives="ניתן לעבוד גם בלי הגדרות פרויקט בכלל (רק ברירות מחדל גלובליות) — פשוט יותר לפרויקט אישי קטן, אבל בעייתי בצוות כי כל מפתח 'מתנהג' אחרת מול הסוכן."
        whenNotTo="בפרויקט ניסיוני חד-פעמי (proof of concept) שלא ימשיך להתקיים, השקעה בהגדרות פרויקט מפורטות היא בזבוז זמן — עדיף גלובלי בלבד."
        commonMistakes="להתקין ולהתחיל לעבוד בלי בכלל להסתכל אילו הגדרות/הרשאות פעילות — ואז להתפלא כש-Claude Code מבקש אישור על כל פעולה, או להיפך, מבצע פעולות רגישות ללא שאלה."
        cost="ההתקנה עצמה חינמית; העלות האמיתית היא בשימוש (טוקנים/קריאות API) — נדון בזה לעומק במודול הבא כשנדבר על ניהול context."
        realWorld="ב-AtlasDesk, פרויקט האקדמיה, יש כבר .claude/settings.json אמיתי בריפו — תראה אותו במשימה המעשית בסוף השיעור הזה."
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
          ["Claude Code", "סוכן פיתוח אגנטי הרץ כ-CLI, שקורא/כותב קבצים ומריץ פקודות בפרויקט אמיתי."],
          ["CLAUDE.md", "קובץ זיכרון/הנחיות בשורש הפרויקט שהסוכן קורא אוטומטית בתחילת כל סשן (שיעור הבא)."],
          ["הגדרות גלובליות", "~/.claude/ — חלות על כל הפרויקטים שלך במחשב."],
          ["הגדרות פרויקט", ".claude/settings.json בריפו — משותפות לצוות דרך git."],
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
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="cc-installation-configuration"
        title="התקן את Claude Code ובדוק את ההגדרות של AtlasDesk"
        context="AtlasDesk הוא פרויקט Next.js אמיתי בריפו הציבורי של האקדמיה. אם עוד אין לך אותו משובט מקומית, שבט אותו עכשיו (כתובת הריפו מופיעה ב-README של הפלטפורמה)."
        steps={[
          "התקן את Claude Code במחשב שלך (npm install -g @anthropic-ai/claude-code או המתקין הנייטיבי) ובצע התחברות (claude, ואז /login אם צריך).",
          "שבט או פתח מקומית את ריפו AtlasDesk, והרץ `claude` בתוך תיקיית הפרויקט.",
          "שאל את הסוכן: \"אילו הגדרות פרויקט פעילות כרגע (.claude/settings.json אם קיים), ומה הן אומרות?\"",
          "בדוק את ~/.claude/ שלך — אילו הגדרות גלובליות כבר קיימות (אם בכלל) מהתקנה קודמת.",
        ]}
        successCriteria={[
          "פקודת `claude` נפתחת בהצלחה בתוך תיקיית AtlasDesk ומזהה את הקבצים בפרויקט",
          "אתה יודע להסביר במילים שלך את ההבדל בין ~/.claude ל-.claude/settings.json",
          "יש לך תשובה כתובה (מהסוכן) לגבי ההגדרות הפעילות בפרויקט הזה",
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
          פתח סשן Claude Code על פרויקט אחר (אפילו קטן) שיש לך במחשב, ובקש ממנו לתאר במשפט אחד
          ”מה הפרויקט הזה עושה” — בלי לתת לו שום הקשר נוסף. שים לב כמה הוא מדייק (או טועה)
          בהבנה הראשונית, וחשוב למה. זה יהיה הבסיס לשיעור הבא על CLAUDE.md.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
