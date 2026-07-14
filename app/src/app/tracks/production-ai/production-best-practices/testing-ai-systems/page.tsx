"use client";

import {
  FlaskConical,
  Database,
  Play,
  Gauge,
  ShieldCheck,
  ScrollText,
  Scale,
  Bot,
  GitBranch,
  Ban,
  Target,
  RefreshCw,
} from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "production-best-practices",
  lessonSlug: "testing-ai-systems",
  title: "בדיקות למערכות AI (Eval-Driven Development)",
  objectives: [
    "להבין למה בדיקות assert-equals קלאסיות נשברות על פלט LLM לא-דטרמיניסטי — ומה בא במקומן",
    "לבנות golden set של קלטים מייצגים עם תכונות-פלט צפויות, ולתת לו ציון בשלוש שכבות: בדיקות תוכנתיות, דמיון/רובריקה, ו-LLM-as-judge",
    "להטמיע regression testing שמריץ את ה-eval על כל שינוי פרומפט/מודל, ולחבר אותו ל-feature-flags כשער שחרור",
  ],
  estMinutes: 35,
  difficulty: "מתקדם",
  prerequisites: ["feature-flags-safe-rollout"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: 'עבד כשניסיתי פעם אחת' זה לא בדיקה",
    bullets: [
      "בדיקת תוכנה קלאסית היא assert-equals: אותו קלט → בדיוק אותו פלט. LLM שובר את ההנחה הזו — אותו פרומפט בדיוק יכול להחזיר ניסוח שונה בכל הרצה (temperature, דגימה הסתברותית), וכל השוואת-מחרוזת קשיחה תיכשל גם כשהתשובה נכונה לחלוטין.",
      "התוצאה: מפתחים 'בודקים' בעין — מריצים פעם אחת, רואים פלט יפה, ומשחררים. זה 'ship on vibes'. הקצה שלא בדקת (קלט מבולגן, ניסוח לא-צפוי, שאלה עוינת) מתפוצץ בפרודקשן על לקוח אמיתי.",
      "השיעור הזה הוא על הדיסציפלינה שמחליפה את ה-vibes: Eval-Driven Development — למדוד את איכות המערכת על סט קלטים מייצג, באופן חוזר ואוטומטי, כך שכל שינוי נמדד לפני שהוא מגיע למשתמש.",
    ],
  },
  {
    title: "המעבר: מ-assert-equals ל-Eval-Driven Development",
    bullets: [
      "unit test בודק שוויון מדויק על לוגיקה דטרמיניסטית. eval בודק תכונות (properties) על פלט הסתברותי: לא 'האם הפלט זהה למחרוזת X', אלא 'האם ה-JSON תקין? האם הוא מכיל את העובדה הנדרשת? האם הוא נקי מתוכן אסור?'.",
      "לכן eval לא נכשל/עובר על מקרה בודד — הוא מייצר pass-rate על פני עשרות מקרים, מול סף (threshold). '92% מהמקרים עברו' זה תוצאה תקינה; המדד הוא מגמה, לא בוליאני יחיד.",
      "זו בדיוק אותה קפיצת-תפיסה כמו ב-ML קלאסי: לא 'נכון/לא-נכון', אלא accuracy מול baseline. רק שכאן ה'מודל' הוא הפרומפט+המודל+ה-pipeline כולם יחד.",
    ],
  },
  {
    title: "ה-golden set הוא הנכס — והוא נבנה מכישלונות אמת",
    bullets: [
      "ה-golden set הוא אוסף קלטים מייצגים + התכונות שהפלט חייב לקיים עבורם. הוא ה'ספר בחינה' הקבוע של המערכת: כל שינוי נמדד מולו.",
      "אל תמציא אותו מהראש. הדרך הנכונה לגדל אותו: כל תקלת פרודקשן אמיתית הופכת למקרה חדש ב-golden set. כך המערכת לומדת מכל כישלון פעם אחת, ולעולם לא נסוגה לאותו באג (regression) שוב.",
      "זה מחבר ישירות ל-feature-flags מהשיעור הקודם: אתה לא מגלגל שינוי לפי תחושה — אתה מגלגל אותו רק אחרי שהוא עבר את ה-eval, ומשתמש ב-flag כדי לעצור מיד אם משהו בכל זאת נשבר בשטח.",
    ],
  },
];

const EVAL_STEPS: DiagramStep[] = [
  {
    icon: Database,
    label: "Golden Set — אוספים",
    detail:
      "אוסף קלטים מייצגים (כולל קצה וקלטים מבולגנים), כל אחד עם התכונות שהפלט חייב לקיים. נבנה מקלטי אמת ומתקלות פרודקשן, לא מדוגמאות 'נקיות' שהמצאת.",
  },
  {
    icon: Play,
    label: "Run — מריצים",
    detail:
      "מריצים את ה-pipeline המלא (פרומפט+מודל+פוסט-פרוססינג) על כל מקרה ב-golden set. אותה גרסה בדיוק שתרוץ בפרודקשן — לא קונפיגורציה 'לבדיקה בלבד'.",
  },
  {
    icon: Gauge,
    label: "Score — מנקדים",
    detail:
      "כל פלט מנוקד בשלוש שכבות: בדיקות תוכנתיות (schema/עובדה/תוכן אסור), דמיון/רובריקה, ו-LLM-as-judge לשיפוט איכות. התוצאה: pass-rate מול סף, לא בוליאני יחיד.",
  },
  {
    icon: GitBranch,
    label: "Gate — מגַנים",
    detail:
      "ה-eval רץ ב-CI על כל שינוי פרומפט/מודל. ירידה מתחת לסף חוסמת merge (regression נתפס לפני פרודקשן). שחרור מגולגל דרך feature-flag רק אחרי שה-eval עבר.",
  },
];

const SCORING_LAYERS: Array<[typeof ShieldCheck, string, string]> = [
  [
    ShieldCheck,
    "בדיקות תוכנתיות (deterministic)",
    "השכבה הזולה, המהירה והחד-משמעית ביותר. קוד רגיל בודק עובדות שאפשר למדוד בוודאות: האם ה-JSON תקין מול schema? האם הפלט מכיל את מספר-ההזמנה שנשאל עליו? האם הוא נקי ממילות-איסור/PII? אם קלט חייב להחזיר סירוב — האם באמת סירב? כאן תופסים 80% מהרגרסיות בעלות אפס-כמעט.",
  ],
  [
    Scale,
    "דמיון / רובריקה",
    "לתשובות פתוחות שאין להן פלט יחיד נכון: מודדים קרבה לתשובת-ייחוס (embedding similarity) או מנקדים מול רובריקה מפורשת ('כיסה את שלושת הצעדים? הזכיר את הסייג?'). לא מדויק כמו בדיקה תוכנתית, אבל תופס 'סחף' איכותי שבדיקת-schema מפספסת.",
  ],
  [
    Bot,
    "LLM-as-judge",
    "מודל שני מנקד את הפלט מול קריטריון מנוסח ('דרג נאמנות-למקור 1-5', 'האם הטון מקצועי?'). חזק לשיפוט ניואנס איכותי בקנה-מידה, אבל יקר (קריאת-מודל לכל מקרה), רועש, ומוטה — לכן משמש שכבה אחרונה ולא תחליף לשתי הקודמות. תמיד לתקף אותו מול מדגם שאדם ניקד ידנית.",
  ],
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question:
      "למה בדיקת assert-equals קלאסית ('הפלט שווה בדיוק למחרוזת הצפויה') נשברת על מערכת LLM, גם כשהמערכת עובדת נכון?",
    options: [
      "כי LLMs אף פעם לא מחזירים JSON תקין",
      "כי הפלט הוא לא-דטרמיניסטי: אותו קלט יכול להחזיר ניסוח שונה בכל הרצה, אז השוואת-מחרוזת קשיחה נכשלת גם כשהתשובה נכונה לגמרי — לכן בודקים תכונות (schema/עובדה/איסור) מול סף, לא שוויון מדויק",
      "כי בדיקות אוטומטיות לא עובדות על קוד שקורא ל-API חיצוני",
      "כי צריך פשוט להוריד את ה-temperature ל-0 וזה פותר הכל",
    ],
    correctIndex: 1,
    explanation:
      "מודל בוחר את הטוקן הבא לפי התפלגות הסתברות, ולכן אותו קלט יכול להניב ניסוחים שונים — כולם נכונים. assert-equals משווה מחרוזת אחת מדויקת, אז הוא ידווח 'כישלון' על תשובה תקינה שרק נוסחה אחרת. הפתרון הוא eval מבוסס-תכונות: בודקים אם הפלט מקיים את מה שחשוב (JSON תקין, מכיל עובדה נדרשת, נקי מתוכן אסור) ומודדים pass-rate מול סף.",
    optionNotes: [
      "שגוי: מודלים מייצרים JSON תקין מצוין כשמנחים אותם נכון; זו לא הסיבה שהבדיקה הקשיחה נשברת.",
      "נכון: אי-הדטרמיניזם הוא השורש. בודקים תכונות מול סף במקום שוויון-מחרוזת מדויק.",
      "שגוי: אפשר בהחלט לבדוק קוד שקורא ל-API (עם golden set קבוע); הבעיה היא שיטת-ההשוואה, לא הקריאה החיצונית.",
      "שגוי מסוכן: temperature=0 מקטין שונות אבל לא מבטל אותה (עדיין תלוי-מודל/גרסה), ובעיקר לא הופך פלט טקסט חופשי ל'מחרוזת יחידה צפויה'. זה טלאי, לא פתרון לשיטת-הבדיקה.",
    ],
  },
  {
    id: "q2",
    question:
      "מהי הדרך הנכונה לגדל golden set לאורך זמן, ולמה היא מחוברת ל-feature-flags?",
    options: [
      "להמציא כמה שיותר קלטים דמיוניים מראש, כדי לכסות הכל ביום הראשון",
      "כל תקלת פרודקשן אמיתית הופכת למקרה חדש ב-golden set; כך המערכת לא נסוגה שוב לאותו באג (regression), וה-eval שהתעדכן משמש שער שאחריו בלבד מגלגלים את התיקון דרך feature-flag",
      "למחוק מקרים שנכשלים כדי לשמור על pass-rate של 100%",
      "לבנות אותו פעם אחת ולהקפיא — golden set שמשתנה אינו אמין",
    ],
    correctIndex: 1,
    explanation:
      "golden set הוא נכס חי. כל כישלון אמת שלא נתפס הוא בדיוק מקרה-הבדיקה שחסר — הופכים אותו למקרה קבוע, וכך המערכת לומדת מהכישלון פעם אחת ולתמיד. החיבור ל-feature-flags: אתה מגלגל שינוי רק אחרי שה-eval (כולל המקרה החדש) עובר, ומשתמש ב-flag כדי לעצור מיד אם בכל זאת משהו נשבר בשטח — ואז מוסיף גם אותו ל-golden set.",
    optionNotes: [
      "שגוי חלקית: כיסוי מראש עוזר להתחלה, אבל קלטים דמיוניים מפספסים את הכשלים האמיתיים והמבולגנים שרק פרודקשן חושף.",
      "נכון: incidents → מקרים חדשים = הגנה מפני regression, ו-flag מגלגל את התיקון רק אחרי שה-eval עבר.",
      "שגוי ומסוכן: מחיקת מקרים שנכשלים כדי 'לייפות' את הציון היא בדיוק הסתרת הבאג שה-eval נועד לחשוף.",
      "שגוי: golden set קפוא מתיישן — מודל/פרומפט/דרישות חדשים דורשים מקרים חדשים. הוא צריך לגדול עם המערכת.",
    ],
  },
  {
    id: "q3",
    question:
      "מתי נכון להשתמש ב-LLM-as-judge, ומה המלכודת המרכזית בו?",
    options: [
      "תמיד, לכל בדיקה — הוא מדויק יותר מקוד ולכן מייתר בדיקות תוכנתיות",
      "כשכבה אחרונה לשיפוט איכות ניואנסית (נאמנות/טון) שקוד לא יכול למדוד — אבל הוא יקר, רועש ומוטה, ולכן לא מחליף בדיקות תוכנתיות זולות וחד-משמעיות, וחייב תיקוף מול מדגם שאדם ניקד",
      "אף פעם — מודל לא יכול לשפוט מודל אחר",
      "רק כדי לחסוך כסף, כי קריאה למודל זולה מבדיקת-schema בקוד",
    ],
    correctIndex: 1,
    explanation:
      "LLM-as-judge זורח כשצריך לשפוט ניואנס איכותי בקנה-מידה — נאמנות-למקור, טון, שלמות — דברים שקוד דטרמיניסטי לא לוכד. אבל הוא קריאת-מודל לכל מקרה (עלות + latency), הוא רועש (אותו פלט יכול לקבל ציון שונה), והוא מוטה (למשל מעדיף תשובות ארוכות). לכן הוא השכבה האחרונה: קודם בדיקות תוכנתיות זולות, ואת ה-judge מתקפים מול מדגם שאדם ניקד כדי לוודא שהוא מסכים עם בני-אדם.",
    optionNotes: [
      "שגוי: judge יקר ורועש; להריץ אותו על מה שבדיקת-קוד פותרת בחינם זה בזבוז ומקור-רעש מיותר.",
      "נכון: שכבה אחרונה לניואנס, מעל בדיקות תוכנתיות, ותמיד מתוקף מול שיפוט אנושי.",
      "שגוי: מודל כן יכול לשפוט פלט מול קריטריון מנוסח היטב — זו טכניקה מקובלת, בזהירות.",
      "שגוי והפוך: קריאה למודל *יקרה* בהרבה מבדיקת-schema בקוד, לא זולה. חיסכון הוא לא הסיבה להשתמש בו.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: למה בדיקות רגילות נשברות", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "לולאת ה-Eval: אוספים, מריצים, מנקדים, מגַנים",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          Eval-Driven Development הוא לולאה של ארבעה שלבים, לא בדיקה חד-פעמית. שים לב שהשלב האחרון
          (gate) הוא מה שהופך את ה-eval ממדד-מעניין למנגנון שבאמת מונע רגרסיה מלהגיע לפרודקשן:
        </p>
        <StepDiagram steps={EVAL_STEPS} />
      </div>
    ),
  },
  {
    id: "scoring",
    label: "שלוש שכבות ניקוד — מהזול והוודאי ליקר והרועש",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          &quot;ציון&quot; ב-eval אינו מספר יחיד — הוא לוח-תוצאות (scoreboard) שמורכב משכבות משלימות.
          מתחילים בזול והחד-משמעי, ורק מה שהוא לא לוכד עולה לשכבה יקרה יותר:
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {SCORING_LAYERS.map(([Icon, title, body]) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2 flex items-center gap-2 font-bold text-primary">
                <Icon size={16} /> {title}
              </p>
              <p className="text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg border border-border bg-card p-3 text-sm text-muted">
          המדד הסופי הוא <strong>scoreboard</strong>, לא מספר בודד: pass-rate של בדיקות תוכנתיות,
          ציון-דמיון ממוצע, ופיזור ציוני ה-judge — כל אחד מספר לך על סוג-כשל אחר. מדד יחיד ממוצע
          מחביא איזו שכבה בדיוק צנחה.
        </p>
      </div>
    ),
  },
  {
    id: "comparison",
    label: "רע מול טוב: שחרור על תחושה מול שחרור מגודר-eval",
    content: (
      <PromptComparisonLab
        title="שינוי פרומפט בבוט תמיכה — לפני שחרור"
        unitLabel="גישת שחרור"
        bad={{
          label: "Ship on vibes",
          content:
            "שיניתי את ה-system prompt כדי לשפר את הטון.\nהרצתי שאלה אחת ('מתי מגיע המשלוח שלי?'),\nהתשובה נראתה מצוינת — עשיתי merge ו-deploy.\nאין golden set, אין CI, אין flag.",
          outcome:
            "השינוי שיפר את הטון אך גרם למודל 'לפטפט' ולהפסיק להחזיר JSON תקין ב-12% מהמקרים — קצה שלא בדקת. הקוד שמנתב לפי ה-JSON קרס אצל לקוחות אמיתיים. גילית מהתלונות, לא מהבדיקה. אין flag לכבות — נדרש redeploy דחוף.",
        }}
        good={{
          label: "Eval-gated release",
          content:
            "הרצתי את הפרומפט החדש מול golden set של 40 קלטים\n(כולל 8 שנבנו מתקלות עבר). בדיקות תוכנתיות: schema\nתקין + מכיל תאריך + סירוב על שאלה מחוץ-לתחום.\nה-eval רץ ב-CI; pass-rate ירד מ-98% ל-86% → merge נחסם.\nתיקנתי, ה-eval עבר, גלגלתי דרך feature-flag ל-10%.",
          outcome:
            "הרגרסיה (JSON שבור) נתפסה ב-CI לפני שהגיעה למשתמש אחד. אחרי התיקון וה-pass-מלא, השחרור המגולגל דרך flag איפשר לנטר את ה-10% הראשונים ולהרחיב בביטחון — או לכבות מיידית בלי redeploy אם משהו בכל זאת חורג.",
        }}
        takeaway="אותו שינוי, אותו מודל — ההבדל הוא הדיסציפלינה. golden set + CI תופס את הרגרסיה לפני פרודקשן, ו-feature-flag נותן רשת-ביטחון לגלגול. 'נראה טוב על שאלה אחת' הוא לא ראיה."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="פלט LLM הוא הסתברותי, אז אי אפשר לבדוק אותו בשוויון-מחרוזת. eval-driven development מחליף 'עבד כשניסיתי' במדידה חוזרת ואוטומטית של תכונות-פלט מול golden set — כך שאיכות הופכת למספר שאפשר לעקוב אחריו ולגדֵר עליו שחרור, במקום תחושה."
        alternatives="אפשר לבדוק ידנית ('קראתי כמה תשובות, נראה סביר') — עובד ל-prototype חד-פעמי, אבל לא מתקנה, לא תופס רגרסיה, ומתפרק ברגע שיש כמה מפתחים או כמה שינויי-פרומפט בשבוע. אפשר גם רק בדיקות תוכנתיות בלי judge — מצוין וזול, אבל מפספס סחף איכותי (טון/נאמנות) שקוד לא מודד."
        whenNotTo="ל-spike/POC חד-פעמי שלא יגיע לפרודקשן — לבנות golden set + CI + judge זה over-engineering; בדיקה ידנית מספיקה. ברגע שהפרומפט חוזר על עצמו במערכת חיה על מגוון קלטים — ה-eval הופך לחובה, לא למותרות."
        commonMistakes="golden set של דוגמאות 'נקיות' בלבד בלי מקרי-קצה אמיתיים; מדידה על מספר יחיד שמחביא איזו שכבה צנחה; להישען על LLM-as-judge בלי לתקף אותו מול שיפוט אנושי; 'עבד פעם אחת' כראיה; ולא לחבר את ה-eval ל-CI (eval שרץ רק ידני נשכח בדיוק כשצריך אותו)."
        performance="הרץ קודם את השכבה הזולה (בדיקות תוכנתיות) ורק על מה שעבר — או על מדגם — הפעל את ה-judge היקר. הרץ מקרים במקביל, ושמור cache של פלטי-מודל לקלטים שלא השתנו כדי לא לשלם שוב על אותו eval בכל commit."
        cost="עלות ה-eval היא בעיקר קריאות ה-judge וההרצה החוזרת: golden set של 200 מקרים × judge לכל אחד × כל commit מצטבר מהר. מאזנים: judge רק על תת-קבוצה/על מה שבדיקות-קוד לא כיסו, ומריצים eval מלא על שינויי-פרומפט/מודל ולא על כל commit של קוד לא-קשור."
        security="ה-golden set הוא גם חגורת-הבטיחות: הכנס אליו קלטים עוינים (prompt injection, בקשות ל-PII, שאלות מחוץ-לתחום) ובדוק תוכנתית שהמודל מסרב. כך רגרסיה שמחלישה הגנה נתפסת ב-CI, לא אחרי דליפה. אל תכניס נתוני-אמת רגישים ל-golden set שמאוחסן ב-repo."
        maintenance="golden set חי: כל תקלת פרודקשן הופכת למקרה חדש, וכל דרישה חדשה מוסיפה תכונה לבדוק. בלי תחזוקה הוא מתיישן והציון מאבד משמעות. תעדף רוחב-כיסוי (עוד סוגי-קלט) על-פני עומק חוזר, וסקור את הרובריקות כשהמוצר משתנה."
        realWorld="בפרויקט המסכם (AtlasDesk) תבנה harness eval קטן: golden set של פניות-תמיכה מייצגות + בדיקות תוכנתיות (schema, ציטוט-מקור, סירוב על שאלה מחוץ-לתחום). כל שינוי פרומפט של הבוט יעבור דרכו ב-CI, ורק eval שעבר יגלגל לפרודקשן דרך feature-flag — בדיוק כמו במערכת מסחרית."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר בפרודקשן מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-danger">
            <Ban size={16} /> מה שובר מערכות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>&quot;הרצתי פעם אחת, נראה טוב&quot; — הקצה שלא בדקת מתפוצץ על לקוח אמיתי.</li>
            <li>assert-equals על פלט LLM — נכשל על תשובה נכונה שרק נוסחה אחרת, אז מוותרים על בדיקות בכלל.</li>
            <li>golden set של דוגמאות נקיות שהמצאת — מפספס בדיוק את הקלטים המבולגנים שקורסים בשטח.</li>
            <li>eval שרץ רק ידנית ולא ב-CI — נשכח בדיוק בשינוי שהיה מכניס את הרגרסיה.</li>
            <li>נשענים על LLM-as-judge בלבד — יקר, רועש, ומוטה, ואף אחד לא תיקף שהוא מסכים עם בני-אדם.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <Target size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>בונים golden set מקלטי-אמת ומתקלות עבר, כולל מקרי-קצה וקלטים עוינים.</li>
            <li>מנקדים בתכונות מול סף (pass-rate), לא בשוויון-מחרוזת — שלוש שכבות, מהזול ליקר.</li>
            <li>מריצים את ה-eval ב-CI על כל שינוי פרומפט/מודל; ירידה מתחת לסף חוסמת merge.</li>
            <li>מגלגלים רק eval שעבר, דרך feature-flag, כדי לנטר ולכבות מיד אם צריך.</li>
            <li>כל תקלה חדשה הופכת למקרה קבוע ב-golden set — לומדים פעם אחת, לא נסוגים שוב.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית עם Claude Code",
    content: (
      <RealWorldTask
        id="production-best-practices-testing-ai-systems"
        title="בנה harness eval קטן — ואז שבור פרומפט בכוונה וצפה בו נכשל"
        context="עבוד עם Claude Code בתיקייה כלשהי. המטרה היא לחוות את הלולאה המלאה: golden set → run → score → לתפוס רגרסיה. אין צורך בפרויקט קיים — סקריפט אחד + קובץ נתונים מספיקים."
        steps={[
          "בקש מ-Claude Code להגדיר משימה קטנה וברורה (למשל: חילוץ {category, urgency, summary} כ-JSON מפניית תמיכה), וכתוב פרומפט ראשוני עם Format ו-Constraints מפורשים.",
          "בנה golden set של 10 מקרים בקובץ JSON: קלט + התכונות הצפויות (schema צפוי, מילת-מפתח שחייבת להופיע, ולפחות 2 מקרי-קצה — קלט מבולגן ושאלה מחוץ-לתחום שאמורה להחזיר category=unknown).",
          "בקש מ-Claude Code לכתוב harness שמריץ את הפרומפט על כל 10 המקרים, ומנקד כל פלט בבדיקות תוכנתיות: JSON תקין מול schema? מכיל את מילת-המפתח? urgency הוא אחד מ-low/med/high? המקרה מחוץ-לתחום החזיר unknown? הדפס pass-rate.",
          "הרץ את ה-harness ורשום את ה-baseline (למשל 10/10). זה ה'ירוק' שלך.",
          "עכשיו שבור בכוונה: בקש מ-Claude Code לשנות את הפרומפט כך שיוסיף משפט-הקדמה חופשי לפני ה-JSON ('Sure, here is the result:'). הרץ שוב את ה-harness.",
          "צפה ב-pass-rate צונח (ה-JSON כבר לא תקין) — ה-eval תפס את הרגרסיה בלי שהסתכלת בפלט בעין. תקן את הפרומפט, הרץ שוב, ואמת חזרה ל-10/10.",
          "צעד-דיבוג: הוסף מקרה 11 שמדמה תקלת-פרודקשן אמיתית (קלט ריק/רועש שגרם לקריסה), ודא שה-harness מזהה אותו כ-fail במקום לזרוק חריגה שמפילה את הריצה כולה.",
        ]}
        successCriteria={[
          "יש לך golden set של 10+ מקרים עם תכונות-פלט צפויות, כולל מקרי-קצה",
          "ה-harness מנקד בתכונות (schema/מילת-מפתח/ערך-מותר) ומדפיס pass-rate, לא שוויון-מחרוזת",
          "כשהפרומפט 'שבור' בכוונה — ה-pass-rate צונח וה-eval תופס את הרגרסיה אוטומטית",
          "אחרי התיקון ה-eval חוזר לירוק, וה-harness לא קורס על קלט תקול אלא מדווח עליו כ-fail",
          "אתה יכול להסביר איך היית מחבר את ה-harness הזה ל-CI ול-feature-flag כשער שחרור",
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
          ["Eval-Driven Development", "מתודולוגיה שבה כל שינוי פרומפט/מודל נמדד מול golden set לפני שחרור — במקום להסתמך על בדיקה ידנית חד-פעמית."],
          ["Golden Set", "אוסף קלטים מייצגים + התכונות שהפלט חייב לקיים עבורם. ה'ספר בחינה' הקבוע; גדל מתקלות אמת."],
          ["Property-based check", "בדיקה של תכונה (JSON תקין? מכיל עובדה? נקי מתוכן אסור?) במקום שוויון-מחרוזת מדויק — מתאים לפלט הסתברותי."],
          ["Pass-rate / Threshold", "אחוז המקרים שעברו מול סף. eval נמדד במגמה מול סף, לא כבוליאני יחיד."],
          ["LLM-as-judge", "מודל שני שמנקד פלט מול קריטריון מנוסח. חזק לניואנס איכותי, אך יקר/רועש/מוטה — שכבה אחרונה, מתוקף מול אדם."],
          ["Regression testing", "הרצת ה-eval על כל שינוי כדי לתפוס ירידת-איכות לפני פרודקשן; כל תקלה הופכת למקרה קבוע כדי לא לחזור."],
          ["CI gate", "חסימת merge כשה-eval יורד מתחת לסף — הרגרסיה נעצרת בצנרת, לא אצל המשתמש."],
          ["Scoreboard", "אוסף מדדים (pass-rate, דמיון, פיזור judge), לא מספר יחיד — כל מדד חושף סוג-כשל אחר."],
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
          <FlaskConical size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>פלט LLM <strong>לא-דטרמיניסטי</strong> — assert-equals נשבר; בודקים <strong>תכונות מול סף</strong>, לא שוויון-מחרוזת.</li>
          <li>ה-<strong>golden set</strong> הוא הנכס: קלטים מייצגים + תכונות צפויות, שגדל <strong>מתקלות אמת</strong>.</li>
          <li>מנקדים בשלוש שכבות: <strong>בדיקות תוכנתיות</strong> (זול/ודאי) → <strong>דמיון/רובריקה</strong> → <strong>LLM-as-judge</strong> (יקר, מתוקף מול אדם).</li>
          <li><strong>regression + CI + feature-flag</strong>: ה-eval רץ על כל שינוי, חוסם merge בירידה, ומגלגל רק מה שעבר — עם רשת-ביטחון לכיבוי.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "homework",
    label: "שיעורי בית",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold">
          <RefreshCw size={15} className="text-primary" /> שיעורי בית:
        </p>
        <p className="mt-1 text-muted">
          קח את ה-harness שבנית במשימה, והוסף לו שכבת <strong>LLM-as-judge</strong>: בקש מ-Claude Code
          לכתוב פונקציה שמעבירה כל פלט למודל שני עם רובריקה ('דרג 1-5: האם ה-summary נאמן לקלט?').
          עכשיו האתגר האמיתי — תקף את ה-judge: נקד ידנית 5 מקרים בעצמך, והשווה לציוני ה-judge. האם הוא
          מסכים איתך? היכן הוא מוטה (למשל מעדיף תשובות ארוכות)? זה בדיוק התיקוף שמפריד judge אמין
          מ-judge שמשקר לך בביטחון.
        </p>
        <p className="mt-3 flex items-center gap-2 font-semibold">
          <ScrollText size={15} className="text-primary" /> מוביל לשיעור הבא:
        </p>
        <p className="mt-1 text-muted">
          עכשיו יש לך יעדי אמינות (SLO), שחרור בטוח (feature-flags), ובדיקות (eval) — כל הכלים
          למערכת production. בשיעורי ההמשך נחבר אותם יחד ל-runbook תקריות ולתהליך שחרור שלם, כדי
          שהמערכת שלך תעמוד לא רק ביום שהיא נכתבת, אלא בכל יום אחריו.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
