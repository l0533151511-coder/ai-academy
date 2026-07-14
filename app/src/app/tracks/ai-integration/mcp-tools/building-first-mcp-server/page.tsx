"use client";

import { PenLine, Wrench, Plug, CheckCircle2, ShieldAlert, Layers } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "mcp-tools",
  lessonSlug: "building-first-mcp-server",
  title: "בניית שרת MCP ראשון עם Claude Code",
  objectives: [
    "לתכנן ולממש שרת MCP מינימלי (כלי בודד) בעזרת Claude Code",
    "להבין את מחזור-החיים של שרת MCP: רישום כלים → discovery ע\"י הלקוח → קריאה → החזרת תוצאה",
    "להבין מתי MCP server נפרד עדיף על tool calling מובנה, ומתי לא",
    "לחבר את השרת ל-Claude Code עצמו, לבדוק אותו בסשן אמיתי, ולדבג את שכבת החיבור",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["mcp-protocol-architecture"],
};

const SLIDES: Slide[] = [
  {
    title: "מה נבנה בשיעור הזה",
    bullets: [
      "שרת MCP מינימלי, מקומי (stdio transport) — כלי בודד: 'ספירת קבצים בתיקייה'. פשוט מספיק להבין את המבנה, אמיתי מספיק שתראה אותו עובד בפועל בתוך Claude Code.",
      "זה קורה על המחשב שלך, לא בפרויקט AtlasDesk (Vercel serverless) — בדיוק כי למדת בשיעור הקודם ש-MCP server נפרד לא מתאים ל-AtlasDesk. פרויקט נפרד, קטן, הוא הדרך הנכונה לתרגל את זה.",
      "המטרה היא לא הכלי עצמו (ספירת קבצים היא תירוץ) — אלא לחוות את מחזור-החיים המלא: להגדיר כלי, לחשוף אותו דרך הפרוטוקול, ולראות לקוח אמיתי (Claude Code) מגלה אותו וקורא לו.",
    ],
  },
  {
    title: "תהליך העבודה: architecture-first, כמו שלמדת",
    bullets: [
      "1. תכנון: מה בדיוק הכלי עושה, אילו פרמטרים הוא מקבל, מה הוא מחזיר — החוזה לפני הקוד.",
      "2. מימוש: שימוש ב-SDK הרשמי של MCP (יש חבילות npm רשמיות) עם Claude Code.",
      "3. חיבור: הוספת השרת להגדרות Claude Code (קובץ קונפיגורציה שמצביע על השרת ואיך להריץ אותו).",
      "4. בדיקה: פתיחת סשן Claude Code חדש ווידוא שהכלי החדש 'מופיע' (discovery) ונקרא נכון.",
    ],
  },
  {
    title: "כלי הוא כוח אמיתי — גם המינימלי",
    bullets: [
      "count_files_in_dir נשמע תמים, אבל הוא מקבל path מהמודל — קלט שהמודל שלט בו. מה קורה אם ה-path הוא '../../../etc' או נתיב מחוץ לתיקיית העבודה?",
      "כלל הזהב מהשיעור הקודם חל כבר בכלי הראשון: אל תסמוך על ארגומנטים שהמודל שלח. ולד את הנתיב, הגבל אותו לתיקיית-בסיס מותרת (least privilege).",
      "העיקרון שאתה מטמיע כאן בכלי של 20 שורות הוא בדיוק אותו עיקרון שמגן על שרת MCP ארגוני שחשוף ל-CRM או ל-DB פנימי.",
    ],
  },
];

const LIFECYCLE_STEPS: DiagramStep[] = [
  {
    icon: PenLine,
    label: "1. הגדרת הכלי",
    detail: "בקוד השרת אתה רושם כלי: שם (count_files_in_dir), description ברור, ו-input schema (path: string). זה החוזה שהלקוח יראה.",
  },
  {
    icon: Plug,
    label: "2. Discovery",
    detail: "הלקוח (Claude Code) מתחבר לשרת דרך ה-transport (stdio) ומבקש 'אילו כלים יש לך?'. השרת מחזיר את רשימת הכלים — כך הכלי 'מופיע' בסשן בלי שכתבת שורת קוד בלקוח.",
  },
  {
    icon: Wrench,
    label: "3. קריאה",
    detail: "כשהמשתמש שואל 'כמה קבצים ב-X', המודל מחליט לקרוא לכלי ושולח ארגומנטים. השרת מקבל את הקריאה — כאן מוולידים את ה-path לפני שנוגעים בדיסק.",
  },
  {
    icon: CheckCircle2,
    label: "4. החזרת תוצאה",
    detail: "השרת מריץ את הלוגיקה (סופר קבצים) ומחזיר תוצאה מובנית. הלקוח מחזיר אותה למודל, שמנסח תשובה בשפה טבעית — סגירת הלולאה.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה השיעור הזה בונה שרת MCP בפרויקט נפרד ולא בתוך AtlasDesk?",
    options: [
      "כי אי אפשר טכנית להוסיף MCP server ל-Next.js",
      "כי בשיעור הקודם נלמד ש-AtlasDesk (אפליקציית Vercel serverless) לא מתאימה לתהליך MCP נפרד — הפרויקט הנפרד הוא הבחירה ההנדסית הנכונה להדגמה",
      "כי AtlasDesk כבר מלא מדי ואין מקום לעוד קוד",
      "אין סיבה מיוחדת, זה שרירותי",
    ],
    correctIndex: 1,
    explanation:
      "זו החלטה ארכיטקטונית מודעת, לא מגבלה טכנית — כפי שנלמד בשיעור הקודם, MCP server נפרד דורש תהליך שרץ, מה שלא מתאים לאפליקציית serverless כמו AtlasDesk.",
    optionNotes: [
      "לא נכון: זה כן טכנית אפשרי (אפשר להריץ תהליכי Node נפרדים גם לצד Next.js) — הבעיה היא ארכיטקטונית/תפעולית, לא טכנית.",
      "התשובה הנכונה: זו יישום ישיר של מה שנלמד בשיעור הקודם — MCP server דורש תהליך תמידי, וזה לא מתאים ל-serverless.",
      "לא נכון: אין מגבלת 'מקום' בקוד — זו לא הסיבה האמיתית.",
      "לא נכון: ההחלטה מבוססת בדיוק על הנימוק ההנדסי מהשיעור הקודם, לא שרירותית.",
    ],
  },
  {
    id: "q2",
    question: "בנית שרת MCP, הרצת אותו בלי שגיאה, אבל בסשן Claude Code חדש הכלי לא מופיע כלל. מהו הצעד ההנדסי הראשון הנכון?",
    options: [
      "לשכתב את כל לוגיקת הכלי — כנראה יש באג בספירת הקבצים",
      "לבדוק את שכבת החיבור לפני הלוגיקה: האם קובץ הקונפיגורציה של Claude Code מצביע נכון על השרת ופקודת ההרצה שלו, והאם הסשן נטען מחדש אחרי השינוי",
      "להחליף transport מ-stdio ל-HTTP — stdio לא אמין",
      "פשוט לפתוח ולסגור את Claude Code כמה פעמים עד שיעבוד",
    ],
    correctIndex: 1,
    explanation:
      "אם הכלי לא מופיע בכלל (discovery נכשל), הבעיה כמעט תמיד בשכבת החיבור — קונפיגורציה שגויה, נתיב שרת לא נכון, או סשן שלא נטען מחדש — ולא בלוגיקת הכלי, שאפילו לא הגיעה לרוץ. מדבגים שכבה-שכבה מבחוץ פנימה.",
    optionNotes: [
      "לא נכון: אם הכלי לא מופיע בכלל, הלוגיקה שלו מעולם לא נקראה — אין טעם לחפש שם באג.",
      "התשובה הנכונה: 'כלי לא מופיע' = כשל discovery = בעיית חיבור/קונפיגורציה. תמיד לוודא את שכבת החיבור קודם.",
      "לא נכון: stdio אמין לחלוטין לשרתים מקומיים — זו לא מקור התקלה, ושינוי transport מסבך בלי סיבה.",
      "לא נכון: 'לפתוח ולסגור עד שיעבוד' זה לא דיבוג — צריך לזהות איזו שכבה נכשלה.",
    ],
  },
  {
    id: "q3",
    question: "הכלי count_files_in_dir מקבל path מהמודל. איזו שורת הגנה חייבת להיות בקוד השרת?",
    options: [
      "אין צורך — path שהמודל שולח תמיד בטוח כי המודל 'הגיוני'",
      "ולידציה שהנתיב נמצא בתוך תיקיית-בסיס מותרת (מניעת path traversal כמו '../../etc'), לפני כל גישה לדיסק",
      "להצפין את הנתיב לפני השימוש בו",
      "לוודא רק שהנתיב הוא מחרוזת ולא מספר",
    ],
    correctIndex: 1,
    explanation:
      "ארגומנטים מהמודל הם קלט לא-אמין (בין אם מטעות ובין אם מ-prompt injection). כלי filesystem חייב להגביל את עצמו לתיקיית-בסיס מותרת ולדחות נתיבים שחורגים ממנה — least privilege, בדיוק כמו שהיית עושה ל-endpoint שמקבל path ממשתמש.",
    optionNotes: [
      "לא נכון ומסוכן: 'המודל הגיוני' הוא בדיוק ההנחה ששוברת מערכות — המודל יכול לשלוח נתיב מסוכן בטעות או בעקבות הזרקה.",
      "התשובה הנכונה: מגבילים את הכלי לתיקיית-בסיס ודוחים path traversal — לפני שנוגעים בדיסק.",
      "לא נכון: הצפנה לא רלוונטית כאן — הבעיה היא גבולות גישה, לא סודיות.",
      "לא נכון: בדיקת-סוג בלבד לא מספיקה — '../../etc/passwd' הוא מחרוזת תקינה ועדיין מסוכן.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מה נבנה ולמה", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "lifecycle",
    label: "מחזור-החיים של שרת MCP — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          לפני שכותבים שורת קוד — כדאי להחזיק בראש את ארבעת השלבים שהכלי שלך יעבור. כשמשהו לא עובד,
          תדע בדיוק באיזה שלב לבדוק:
        </p>
        <StepDiagram steps={LIFECYCLE_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: לבנות MCP server בלי תכנון מול עם תכנון",
    content: (
      <PromptComparisonLab
        title="גישה לבניית השרת הראשון שלך"
        unitLabel="גישה"
        bad={{
          label: "ישר לקוד",
          content: `"תבנה לי שרת MCP" (בלי לפרט מה הכלי עושה, אילו
פרמטרים, מה מוחזר)`,
          outcome: "הסוכן ינחש מבנה כלשהו — אולי לא בדיוק מה שרצית, ותצטרך סבב תיקונים כדי להגיע למה שהתכוונת אליו במקור.",
        }}
        good={{
          label: "תכנון קודם (כמו שלמדת במודול Claude Code Mastery)",
          content: `"תכנן איתי שרת MCP עם כלי בודד: count_files_in_dir.
קלט: path (string). פלט: מספר קבצים (לא תיקיות) בנתיב הזה.
הכלי חייב לדחות נתיבים מחוץ לתיקיית העבודה.
תציג לי תוכנית לפני שאתה כותב קוד."`,
          outcome: "החוזה (קלט/פלט) והאילוץ הביטחוני מוגדרים מראש, בדיוק כמו architecture-first שלמדת. המימוש הופך למכני ופשוט לאמת.",
        }}
        takeaway="כל מה שלמדת במודול Claude Code Mastery (פרומפט מדויק, תכנון לפני ביצוע, architecture-first) חל במלואו גם כאן — MCP הוא רק עוד סוג פרויקט, לא סיבה לזרוק את המשמעת ההנדסית."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="שרת MCP מקומי לצורך לימוד נבנה כפרויקט נפרד קטן כי זה מבודד את מורכבות הפרוטוקול (transport, lifecycle) מהלוגיקה העסקית — קל יותר להבין ולבדוק."
        alternatives="חלופה: לדלג על בניית שרת עצמאי ולהסתפק בהבנה תיאורטית מהשיעור הקודם. מומלץ נגד זה — בניית שרת אמיתי, גם מינימלי, היא ההבדל בין 'שמעתי על MCP' ל'יודע לבנות עם MCP'."
        whenNotTo="אם אין לך שום צורך אמיתי ב-tool חדש כרגע — לבנות שרת MCP רק 'כדי להתאמן' בלי מטרה קונקרטית עלול להרגיש מלאכותי; עדיף לקשר תרגול לצורך אמיתי (גם קטן) כשאפשר. וגם: אם רק לקוח אחד צריך את הכלי — tool calling מובנה פשוט יותר."
        commonMistakes="לשכוח לבדוק שהשרת באמת מחובר ל-Claude Code (קובץ הקונפיגורציה) לפני שמתפלאים 'למה הכלי לא עובד' — תמיד לוודא את שכבת החיבור לפני שמחפשים באג בלוגיקה עצמה."
        performance="stdio מריץ תהליך מקומי לכל סשן — זול ומהיר. אבל אם הכלי עושה עבודה כבדה (סריקת עשרות אלפי קבצים), הוא חוסם עד שהוא מסיים; לכלים ארוכים שוקלים streaming או הגבלת היקף (למשל עומק חיפוש)."
        security="ה-path מגיע מהמודל — קלט לא-אמין. ולד אותו והגבל אותו לתיקיית-בסיס מותרת (least privilege). כלי filesystem בלי הגבלת גבולות הוא path-traversal מוכן. הכלל הזה חל כבר בכלי הראשון, לא רק ב'כלי רציניים'."
        cost="שרת MCP מקומי לצורך לימוד לא עולה כסף (אין קריאות API בשרת עצמו) — העלות היחידה היא זמן הפיתוח. בשרת MCP שקורא ל-API חיצוני, לעומת זאת, כל קריאת כלי היא עלות אמיתית שצריך לתקצב."
        maintenance="שרת MCP הוא dependency לכל דבר: כשה-SDK מתעדכן או הפרוטוקול משתנה, צריך לתחזק. שמור את השרת קטן וממוקד — כלי אחד שעושה דבר אחד היטב קל יותר לתחזק מ'שרת-על' עם עשרה כלים חופפים."
        realWorld="ארגונים אמיתיים בונים שרתי MCP פנימיים לגישה למערכות קנייניות (CRM פנימי, מסדי נתונים) — זו בדיוק אותה טכניקה שתרגלת כאן, בקנה מידה ארגוני, ובדיוק אותם שיקולי ולידציה והרשאות."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות פרודקשן נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-danger">
            <ShieldAlert size={16} /> מה שובר מערכות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מדבגים את לוגיקת הכלי כשהבעיה בכלל בשכבת החיבור — הכלי מעולם לא נטען.</li>
            <li>סומכים על ה-path שהמודל שלח בלי ולידציה — path traversal מחכה לקרות.</li>
            <li>שרת שקורס בשקט ב-runtime — הלקוח פשוט לא רואה כלים, בלי שגיאה ברורה.</li>
            <li>description עמום לכלי — המודל לא יודע מתי לקרוא לו, אז הוא ”לא עובד” לכאורה.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <CheckCircle2 size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מדבגים מבחוץ פנימה: קודם discovery (הכלי מופיע?), רק אז הלוגיקה.</li>
            <li>מגבילים כל כלי filesystem לתיקיית-בסיס מותרת ודוחים חריגה ממנה.</li>
            <li>בודקים את השרת עצמאית (מריצים ידנית) לפני שמחברים ללקוח.</li>
            <li>כותבים description ספציפי — מתי לקרוא לכלי, ומה כל פרמטר מצפה לקבל.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של השיעור",
    content: (
      <RealWorldTask
        id="mcp-building-first-mcp-server"
        title="בנה שרת MCP מינימלי עם Claude Code"
        context="פרויקט נפרד וקטן על המחשב שלך — לא בתוך AtlasDesk."
        steps={[
          "צור תיקיית פרויקט חדשה וקטנה, ופתח בה סשן Claude Code.",
          "תכנן (לפני קוד!) שרת MCP עם כלי בודד: count_files_in_dir(path) שמחזיר את מספר הקבצים בנתיב — והגדר מראש את האילוץ הביטחוני: הנתיב חייב להיות בתוך תיקיית-בסיס מותרת.",
          "בקש מ-Claude Code לממש את השרת עם ה-SDK הרשמי של MCP (חפש את שם החבילה העדכני בעצמך/עם הסוכן), כולל ולידציה של ה-path.",
          "לפני חיבור ללקוח — הרץ את השרת ידנית וודא שהוא עולה בלי שגיאה.",
          "חבר את השרת להגדרות Claude Code שלך (קובץ קונפיגורציה מקומי).",
          "פתח סשן Claude Code חדש ובדוק: כשאתה מבקש \"כמה קבצים יש בתיקייה X\", האם הכלי החדש שלך נקרא בפועל?",
          "דיבוג מכוון: שנה בכוונה את הנתיב בקונפיגורציה לנתיב שגוי, פתח סשן חדש, וראה שהכלי נעלם — כך תזהה כשל discovery בעתיד. אחר כך תקן.",
        ]}
        successCriteria={[
          "יש לך שרת MCP רץ בפועל (לא רק קוד תיאורטי)",
          "Claude Code בסשן חדש מזהה ומשתמש בכלי שבנית",
          "הכלי דוחה נתיב שחורג מתיקיית-הבסיס המותרת (בדקת בעצמך)",
          "ראית איך נראה כשל discovery (הכלי נעלם) ואתה יודע שהצעד הראשון הוא לבדוק את שכבת החיבור",
          "אתה מבין את ההבדל המעשי בין זה לבין tool calling מובנה שכבר בנית ב-AtlasDesk",
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
          ["stdio transport", "ערוץ תקשורת מקומי — הלקוח מריץ את השרת כתהליך ומדבר איתו דרך קלט/פלט סטנדרטי."],
          ["Discovery", "השלב שבו הלקוח שואל את השרת 'אילו כלים יש לך?' ומקבל את רשימתם — כך כלי 'מופיע' בסשן."],
          ["Tool schema", "החוזה שהשרת חושף לכל כלי: name, description, input schema."],
          ["MCP SDK", "החבילה הרשמית (npm) שמטפלת בפרוטוקול, כדי שתתמקד בלוגיקת הכלי ולא בתקשורת."],
          ["Path traversal", "מתקפה שבה נתיב כמו '../../etc' חורג מהתיקייה המותרת — נמנעת בהגבלה לתיקיית-בסיס."],
          ["Least privilege", "עיקרון: תן לכלי בדיוק את הגישה שהוא צריך, לא יותר."],
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
          <li>שרת MCP מינימלי הוא <strong>ארבעה שלבים</strong>: הגדרת כלי → discovery → קריאה → החזרת תוצאה.</li>
          <li>כשכלי <strong>לא מופיע</strong> — הבעיה כמעט תמיד בשכבת החיבור, לא בלוגיקה. דבג מבחוץ פנימה.</li>
          <li>ארגומנטים מהמודל הם <strong>קלט לא-אמין</strong> — ולד והגבל כבר בכלי הראשון (least privilege).</li>
          <li>אותה משמעת הנדסית מהמודול הקודם — <strong>תכנון לפני קוד</strong> — חלה גם על MCP.</li>
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
          הוסף כלי שני לשרת ה-MCP שבנית (למשל list_file_names_in_dir). תרגל שוב את התהליך: תכנון
          קודם, ואז מימוש — וודא שהתיאור (description) של הכלי החדש ברור מספיק שהסוכן יידע
          מתי להשתמש בו, ושגם הוא מוגבל לאותה תיקיית-בסיס מותרת.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          בנית כלי בפרויקט נפרד — עכשיו נחזור ל-AtlasDesk ונוסיף לו כלי אמיתי משלך, עם דגש על
          שיקולי האבטחה של הרצת כלים במוצר production. שם תראה איפה ההבדל בין read ל-write באמת נהיה קריטי.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
