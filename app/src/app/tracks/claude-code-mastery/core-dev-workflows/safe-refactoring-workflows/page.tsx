"use client";

import { ShieldCheck, GitBranch, ListChecks, Undo2, Layers } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "core-dev-workflows",
  lessonSlug: "safe-refactoring-workflows",
  title: "תהליכי Refactoring בטוחים",
  objectives: [
    "להבין את העיקרון: refactoring לא משנה התנהגות, רק מבנה",
    "לתרגל refactoring מודרך עם בדיקות לפני/אחרי",
    "לזהות מתי refactoring 'גדול מדי' דורש פירוק לצעדים קטנים והפיכים",
    "לדעת לבקש מ-Claude Code תוכנית לפני עריכה — ולקרוא את ה-diff שלו בביקורתיות",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["building-features-workflow"],
};

const SLIDES: Slide[] = [
  {
    title: "הכלל המכונן של Refactoring",
    bullets: [
      "Refactoring = שינוי מבנה הקוד בלי לשנות את ההתנהגות שלו כלפי חוץ. אם ההתנהגות משתנה, זה לא refactoring — זה feature change (או תיקון באג) בתחפושת.",
      "בדוגמה אמיתית מהאקדמיה: כשמצאנו ששלושת נתיבי ה-API (chat/tool-chat/rag-chat) חוזרים על אותו קוד יצירת client ואותה תשובת 'לא מחובר', חילצנו את זה ל-lib/api-routes/anthropic-helpers.ts — אותה התנהגות בדיוק, מבנה קוד נקי יותר.",
      "החשיבות עם Claude Code: הסוכן מסוגל לשנות 10 קבצים בפרומפט אחד — וזה בדיוק מה שהופך refactoring איתו למסוכן אם אין רשת ביטחון. מהירות בלי אימות = באג שקט מהיר.",
    ],
  },
  {
    title: "איך מאמתים ש-refactoring באמת 'בטוח'",
    bullets: [
      "לפני: להריץ/לבדוק את ההתנהגות הקיימת (build, typecheck, טסטים, בדיקה ידנית) — ולתעד מה בדיוק מוחזר.",
      "אחרי: להריץ בדיוק את אותן בדיקות ולוודא תוצאה זהה — לא רק 'זה מתקמפל', אלא 'זה מתנהג אותו דבר'.",
      "בפועל באקדמיה: אחרי חילוץ ה-helpers, נבדק ידנית ב-preview שהצ'אט הרגיל עדיין מחזיר בדיוק את אותה הודעת 'לא מחובר' — לא רק ש-build עבר.",
    ],
  },
  {
    title: "מדוע 'refactor הכל' זה פרומפט מסוכן",
    bullets: [
      "פרומפט כמו 'תסדר את כל הקוד בפרויקט' נותן ל-Claude Code רשות לשנות עשרות קבצים בבת אחת — וכשמשהו נשבר, אין דרך לדעת איזה מהשינויים אשם.",
      "מהנדס בכיר עובד הפוך: refactoring אחד, קטן, הפיך — מאומת — ורק אז הבא. כל צעד נשאר בגודל שאפשר לבטל (git) ולהבין במבט אחד.",
      "הטכניקה המרכזית: לבקש מ-Claude Code תוכנית במילים לפני שהוא נוגע בקוד. תוכנית זולה לקריאה; diff של 40 קבצים לא.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: ShieldCheck, label: "1. רשת ביטחון", detail: "לפני שנוגעים בקוד: טסטים עוברים / build ירוק / תיעוד ההתנהגות הנוכחית. אם אין טסטים — כותבים characterization test שמקבע את ההתנהגות הקיימת." },
  { icon: ListChecks, label: "2. תוכנית קודם", detail: "מבקשים מ-Claude Code להסביר את הצעדים במילים לפני עריכה — קוראים ומאשרים לפני שהוא נוגע בקוד." },
  { icon: GitBranch, label: "3. צעד קטן והפיך", detail: "שינוי אחד ממוקד בכל פעם (חילוץ פונקציה אחת, שינוי-שם אחד) — לא 'refactor הכל'." },
  { icon: Undo2, label: "4. אמת או בטל", detail: "אותן בדיקות בדיוק אחרי השינוי. זהה? ממשיכים לצעד הבא. לא זהה? git revert לצעד האחרון בלבד." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה מגדיר 'refactoring' לעומת שינוי פיצ'ר רגיל?",
    options: [
      "כל שינוי בקוד שנעשה על ידי Claude Code",
      "שינוי מבנה הקוד בלי לשנות את ההתנהגות החיצונית שלו — אם ההתנהגות משתנה, זה לא refactoring",
      "רק שינויים שמקצרים את מספר השורות",
      "כל שינוי שדורש הרצת build מחדש",
    ],
    correctIndex: 1,
    explanation: "ההגדרה המדויקת היא שימור התנהגות — מבנה משתנה, פלט/פעולה כלפי חוץ נשארים זהים.",
    optionNotes: [
      "לא נכון: לא כל שינוי קוד הוא refactoring — התיקון של באג, למשל, הוא שינוי התנהגות מכוון, לא refactoring.",
      "התשובה הנכונה: זו בדיוק ההגדרה — שינוי צורה פנימית, לא תוכן/פלט חיצוני.",
      "לא נכון: refactoring יכול גם להוסיף שורות (למשל הפרדה לפונקציות קטנות יותר) — אורך אינו הקריטריון.",
      "לא נכון: build רץ אחרי כל שינוי קוד, לא רק refactoring — זה לא מבחין ביניהם.",
    ],
  },
  {
    id: "q2",
    question: "אתה מבקש מ-Claude Code refactoring לא-טריוויאלי. מה הצעד הכי חכם *לפני* שהוא עורך קובץ?",
    options: [
      "לתת לו לערוך מיד — אפשר תמיד לבטל אחר כך עם git",
      "לבקש ממנו קודם להסביר את התוכנית במילים (אילו קבצים, אילו צעדים) ולאשר אותה לפני שהוא נוגע בקוד",
      "לבקש ממנו לשנות כמה שיותר קבצים בבת אחת כדי לסיים מהר",
      "לכבות את הטסטים כדי שלא יאטו את התהליך",
    ],
    correctIndex: 1,
    explanation: "תוכנית במילים היא הרבה יותר זולה לקריאה ולתיקון מ-diff של הרבה קבצים. אם התוכנית שגויה — מתקנים אותה במשפט אחד לפני שנוצר קוד שגוי בכלל.",
    optionNotes: [
      "לא נכון: git הוא רשת ביטחון, לא תחליף לחשיבה מראש — ביטול diff ענק גוזל זמן ומאבד גם עבודה תקינה שנעשתה באותו סבב.",
      "התשובה הנכונה: 'תוכנית לפני עריכה' הופכת את נקודת האימות לזולה — קוראים פסקה, לא מאה שורות diff.",
      "לא נכון: 'כמה שיותר בבת אחת' זה בדיוק הפרומפט המסוכן — כשמשהו נשבר, אי אפשר לבודד את הסיבה.",
      "לא נכון: כיבוי הטסטים מסיר את רשת הביטחון היחידה שמבדילה refactoring בטוח מהימור.",
    ],
  },
  {
    id: "q3",
    question: "אתה עומד לבצע refactoring על מודול שאין לו שום טסטים. מה הגישה המקצועית?",
    options: [
      "פשוט לבצע את ה-refactoring — טסטים זה מותרות",
      "לכתוב קודם characterization test אחד או שניים שמקבעים את ההתנהגות הקיימת, ורק אז לבצע את ה-refactoring מאחוריהם",
      "לוותר על ה-refactoring לגמרי כי אין טסטים",
      "לבקש מ-Claude Code לשנות את כל המודול ולסמוך על ש-build עובר",
    ],
    correctIndex: 1,
    explanation: "characterization test מתעד את ההתנהגות הנוכחית (גם אם היא לא 'נכונה' — רק כפי שהיא) ונותן רשת ביטחון: אם אחרי ה-refactoring הטסט נשבר, שינית התנהגות בטעות. זה בדיוק 'refactoring מאחורי טסטים'.",
    optionNotes: [
      "לא נכון: refactoring בלי רשת ביטחון הוא הימור — אתה לא יכול לדעת שההתנהגות נשמרה.",
      "התשובה הנכונה: קובעים את ההתנהגות הקיימת בטסט, ואז משנים מבנה מאחוריו — כל סטייה נתפסת מיד.",
      "לא נכון: אפשר בהחלט לבצע refactoring בטוח — פשוט בונים קודם את הרשת החסרה.",
      "לא נכון: build ירוק מוכיח שהקוד מתקמפל, לא שההתנהגות נשמרה — בדיוק ההבחנה של השיעור.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: refactoring אמיתי מהאקדמיה עצמה", content: <SlideDeck slides={SLIDES} /> },
  { id: "flow", label: "לולאת ה-refactoring הבטוח", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: 'refactor הכל' מול צעד קטן מאומת",
    content: (
      <PromptComparisonLab
        title="חילוץ lib/api-routes/anthropic-helpers.ts (מקרה אמיתי מהאקדמיה)"
        unitLabel="פרומפט ל-Claude Code"
        bad={{
          label: "פרומפט 'refactor הכל' בלי אימות",
          content: `"תעבור על כל נתיבי ה-API בפרויקט, תנקה כפילויות
ותסדר את הקוד איך שנראה לך נכון"
→ Claude Code משנה 8 קבצים בבת אחת, מיד commit + push,
   בלי לבדוק שההתנהגות זהה`,
          outcome: "אם הריפקטור בטעות שינה את מבנה תגובת ה-JSON (למשל השמיט שדה usage), זה נשבר בשקט — הצ'אט בפרודקשן יחזיר תשובות לא-תקינות. וכשמשהו נשבר, אי אפשר לדעת איזה מ-8 הקבצים אשם.",
        }}
        good={{
          label: "צעד ממוקד עם אימות לפני ואחרי",
          content: `1. "קרא את שלושת הנתיבים ותציע תוכנית חילוץ — בלי לערוך עדיין"
2. אימות לפני: לבדוק (curl/preview) שהתשובה כשאין מפתח API
   היא {content, usage:{0,0}, connected:false}
3. "חלץ רק את יצירת ה-client ל-helper אחד" (צעד יחיד)
4. אימות אחרי: אותה קריאה בדיוק → תגובה זהה`,
          outcome: "זה בדיוק מה שנעשה באקדמיה עצמה — אחרי חילוץ ה-helpers, /api/ai/chat נבדק שוב ב-preview וב-production וקיבל תגובה זהה למה שהיה לפני הריפקטור. צעד אחד, מאומת, הפיך.",
        }}
        takeaway="refactoring 'בטוח' לא אומר 'זהיר יותר בכתיבה' — הוא אומר: תוכנית לפני עריכה, צעד קטן והפיך, ואימות קונקרטי שההתנהגות לא השתנתה. עם Claude Code זה קריטי כפליים, כי הוא מסוגל לשנות המון בפרומפט אחד."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="refactoring קיים כי קוד תקין אבל מבולגן מאט פיתוח עתידי — אבל בלי אימות שההתנהגות נשמרת, refactoring הופך לגורם סיכון בעצמו. עם Claude Code המהירות מגבירה גם את התועלת וגם את הסיכון."
        alternatives="'להשאיר את זה ככה כי זה עובד' — עובד לטווח קצר, אבל שכפול קוד (כמו שהיה בשלושת נתיבי ה-API) מצטבר לחוב טכני שמאט כל שינוי עתידי. חלופה שנייה: לכתוב מחדש מאפס — כמעט תמיד מסוכן יותר מ-refactoring הדרגתי מאומת."
        whenNotTo="לקוד שעומד להימחק/להתחלף בקרוב — אין טעם ל'לנקות' קוד שלא ימשיך להתקיים. גם לא לפני deadline קריטי בלי רשת ביטחון: refactoring 'סתם' לפני שחרור הוא סיכון מיותר."
        commonMistakes="לבצע refactoring גדול מדי בבת אחת (לשנות 5 קבצים בו-זמנית) — אם משהו נשבר, קשה לדעת מה גרם לזה. לתת ל-Claude Code לערוך לפני שראית את התוכנית. לסמוך על 'build עובר' כאילו הוא מוכיח שההתנהגות נשמרה — הוא רק מוכיח שהקוד מתקמפל."
        performance="refactoring לרוב ניטרלי לביצועים — אבל היזהר מ-refactoring ש'בטעות' משנה מורכבות (למשל הופך לולאה יחידה לשתי מעברות). זו בדיוק סוג הרגרסיה שאימות לפני/אחרי (כולל מדידת זמן) תופס."
        cost="refactoring לא מוסיף value נראה-לעין מיידי (המוצר 'נראה אותו דבר') — אבל חוסך זמן פיתוח עתידי. עלות ה-token של 'תוכנית קודם' זניחה מול עלות ניפוי באג שקט שדלף לפרודקשן."
        security="חילוץ קוד משותף למקום אחד הוא גם יתרון אבטחתי: תיקון (למשל סינון קלט) במקום אחד מגן על כל הקוראים. אבל היזהר — refactoring שמזיז בטעות בדיקת הרשאה או ולידציה יכול לפתוח פרצה בשקט. אמת גם את מסלולי ה-error/הרשאה, לא רק את ה-happy path."
        maintenance="ה-diff הקטן הוא-הוא התחזוקה: reviewer יכול לאשר צעד של 20 שורות בביטחון, לא diff של 400 שורות. הודעת commit שמתעדת גם את הבעיה (שכפול) וגם את האימות שבוצע הופכת את ההיסטוריה למסמך."
        realWorld="חילוץ ה-anthropic-helpers.ts באקדמיה עצמה הוא הדוגמה החיה — קוד production אמיתי, לא תרגיל מלאכותי. צעד אחד, מאומת ב-preview, עם הודעת commit שמתעדת את השכפול שהוסר."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר בפרודקשן מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר מערכות בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>פרומפט ”תסדר את כל הקוד” ל-Claude Code — עשרות קבצים משתנים, אי אפשר לבודד מה נשבר.</li>
            <li>מריצים build אחרי ה-refactoring וסומכים ש”ירוק” = ”בטוח” — אבל build לא בודק התנהגות.</li>
            <li>refactoring על קוד בלי טסטים, בלי לתעד קודם מה ההתנהגות הנוכחית.</li>
            <li>מאשרים את ה-diff של Claude Code ”על עיוור” כי הוא נראה סביר.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מבקשים תוכנית במילים לפני עריכה, ומאשרים אותה קודם.</li>
            <li>צעד אחד קטן והפיך בכל פעם — commit נפרד לכל צעד.</li>
            <li>אם אין טסטים — כותבים characterization test שמקבע את ההתנהגות הקיימת.</li>
            <li>אימות קונקרטי לפני ואחרי (אותה קריאה בדיוק → תגובה זהה), כולל מסלולי שגיאה.</li>
            <li>קוראים את ה-diff בביקורתיות — במיוחד היכן זזו בדיקות הרשאה/ולידציה.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית עם Claude Code שלך",
    content: (
      <RealWorldTask
        id="core-dev-safe-refactoring-workflows"
        title="מצא ובצע refactoring בטוח בפרויקט אמיתי"
        context="עבוד ב-Claude Code האמיתי שלך על AtlasDesk או כל פרויקט אחר שיש לך גישה אליו. המטרה: לתרגל את הלולאה תוכנית→צעד→אימות, לא רק 'לנקות קוד'."
        steps={[
          "בקש מ-Claude Code לחפש שכפול קוד (2+ מקומות עם לוגיקה כמעט-זהה) — אבל שלא יערוך עדיין, רק ידווח.",
          "לפני כל שינוי: הרץ/תעד את ההתנהגות הנוכחית (טסט, curl, או צילום מסך של הפלט).",
          "בקש מ-Claude Code תוכנית חילוץ במילים בלבד. קרא אותה. אם משהו נראה רחב מדי — צמצם אותו לצעד יחיד.",
          "רק אחרי אישור התוכנית — בקש את הצעד הראשון (חילוץ אחד), בלי לשנות התנהגות.",
          "אמת שוב את אותה התנהגות בדיוק אחרי השינוי. זהה? המשך. לא זהה? git revert לצעד הזה וחקור למה.",
          "צעד דיבוג: שנה בכוונה שורה אחת בתוך ה-helper שחילצת כך שתשבור התנהגות (למשל השמט שדה). הרץ שוב את האימות — ודא שהוא באמת תופס את הסטייה. אם לא תפס, רשת הביטחון שלך חלשה מדי.",
        ]}
        successCriteria={[
          "מצאת שכפול קוד אמיתי, לא רק דוגמה מדומיינת",
          "ראית תוכנית במילים לפני שקוד כלשהו נערך",
          "יש לך תיעוד ברור של 'לפני' ו'אחרי' שמראה התנהגות זהה",
          "שלב הדיבוג הוכיח שהאימות שלך באמת תופס שינוי התנהגות",
        ]}
      />
    ),
  },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Refactoring", "שינוי מבנה קוד בלי לשנות התנהגות חיצונית."],
          ["Characterization test", "טסט שמקבע את ההתנהגות הקיימת (כפי שהיא) כרשת ביטחון לפני refactoring."],
          ["צעד הפיך", "שינוי קטן מספיק שאפשר לבטל אותו (git revert) ולהבין אותו במבט אחד."],
          ["באג שקט", "רגרסיה שלא גורמת לקריסה/שגיאה — רק לתוצאה שגויה שדולפת לפרודקשן."],
          ["Diff", "ההבדל שהעריכה יצרה — היחידה שבה קוראים וסוקרים שינוי של Claude Code."],
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
    id: "recap",
    label: "רגע לפני שממשיכים: בקצרה",
    content: (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-2 flex items-center gap-2 font-bold">
          <Layers size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>Refactoring = <strong>שינוי מבנה בלי שינוי התנהגות</strong>. אם ההתנהגות זזה — זה כבר לא refactoring.</li>
          <li><strong>תוכנית לפני עריכה</strong>: בקש מ-Claude Code להסביר צעדים במילים — זול לקרוא, זול לתקן.</li>
          <li><strong>צעד קטן והפיך</strong> בכל פעם. ”refactor הכל” זה פרומפט מסוכן.</li>
          <li><strong>אמת התנהגות</strong>, לא רק build. אין טסטים? כתוב characterization test קודם.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "homework",
    label: "שיעורי בית",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">שיעורי בית:</p>
        <p className="mt-1 text-muted">
          קרא את הקומיט של חילוץ anthropic-helpers.ts (אם יש לך גישה להיסטוריית ה-git של הפרויקט) —
          שים לב איך הודעת הקומיט מתעדת גם את הבעיה (שכפול) וגם את האימות שבוצע. אחר כך, בפרויקט
          שלך, בצע refactoring יחיד לפי הלולאה שלמדת ותעד commit באותו סגנון.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          ראית שרשת ביטחון (טסט/אימות) היא מה שהופך refactoring לבטוח? בשיעור הבא — Debugging יעיל —
          נראה איך אותו עיקרון של ”הקשר מדויק לפני פעולה” הופך גם את איתור הבאגים למהיר פי כמה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
