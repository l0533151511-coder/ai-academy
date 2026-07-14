"use client";

import { Layers, Target, FileJson, Ban, MessageSquare } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptPlayground } from "@/components/playground/prompt-playground";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { RealWorldTask } from "@/components/exercises/real-world-task";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "prompt-ai-dev",
  moduleSlug: "prompt-engineering",
  lessonSlug: "prompt-anatomy",
  title: "אנטומיה של פרומפט מקצועי",
  objectives: [
    "לפרק פרומפט ל-4 רכיביו — Context, Task, Format, Constraints — ולדעת מה כל אחד פותר",
    "להבין למה ההפרדה בין system prompt להודעת משתמש קיימת, ומתי היא over-engineering",
    "לזהות ולתקן פרומפט 'שביר' שמחזיר תוצאות לא-עקביות בפרודקשן",
  ],
  estMinutes: 40,
  difficulty: "מתחיל",
  prerequisites: ["project-token-cost-calculator"],
};

const SLIDES: Slide[] = [
  {
    title: "פרומפט הוא מפרט (spec), לא משאלה",
    bullets: [
      "עד עכשיו הבנת איך LLMs עובדים מבפנים. מכאן והלאה — איך *לתקשר* איתם כך שיניבו תוצאה עקבית, פעם אחר פעם.",
      "מהנדס לא כותב 'תעשה לי משהו יפה' — הוא כותב מפרט. פרומפט מקצועי הוא בדיוק זה: מפרט חד-משמעי שממזער את מרחב הפרשנויות של המודל.",
      "המדד לפרומפט טוב הוא לא 'האם קיבלתי תשובה יפה פעם אחת', אלא 'האם אקבל את אותה איכות על 1000 קלטים שונים'.",
    ],
  },
  {
    title: "למה זה בכלל עובד: LLM הוא מנוע הסתברותי",
    bullets: [
      "המודל בוחר את המילה הבאה לפי התפלגות הסתברות. פרומפט מעורפל = התפלגות רחבה = פלט לא צפוי בין הרצה להרצה.",
      "כל רכיב שאתה מוסיף (פורמט, דוגמה, מגבלה) 'מצר' את ההתפלגות סביב הפלט שאתה רוצה — זו הסיבה ההנדסית שהנדסת פרומפט עובדת.",
      "לכן 'תכתוב יותר ברור' זו לא עצה מעורפלת — היא במובן מדויק הקטנת האנטרופיה של הפלט.",
    ],
  },
  {
    title: "System Prompt מול הודעת משתמש — ולמה ההפרדה קיימת",
    bullets: [
      "System Prompt: מוגדר פעם אחת, קובע 'מי' ה-AI, תפקידו, והכללים שהוא חייב לשמור בכל פנייה.",
      "הודעת משתמש: הבקשה הספציפית שמשתנה בכל קריאה.",
      "ההפרדה קיימת כדי לא לשלם (בטוקנים) ולא לחזור על אותן הוראות בכל הודעה — וכדי שקוד ה-production יחזיק את הזהות במקום אחד, ניתן-לתחזוקה.",
    ],
  },
];

const ANATOMY_STEPS: DiagramStep[] = [
  {
    icon: MessageSquare,
    label: "Context",
    detail: "מידע הרקע שהמודל צריך: מי המשתמש, מה המצב, אילו נתונים רלוונטיים. בלעדיו המודל 'ממציא' הנחות.",
  },
  {
    icon: Target,
    label: "Task",
    detail: "המשימה עצמה, בפועל אחד וברור. 'סכם', 'סווג', 'חלץ' — פועל מדויק עדיף על תיאור מעורפל.",
  },
  {
    icon: FileJson,
    label: "Format",
    detail: "מבנה הפלט: JSON עם שדות מוגדרים, רשימה, פסקה קצרה. זה מה שהופך פלט ל'ניתן לעיבוד תוכנתי'.",
  },
  {
    icon: Ban,
    label: "Constraints",
    detail: "מה אסור ומה הגבולות: אורך, טון, 'אל תמציא מידע', 'אם אינך יודע — אמור זאת'. כאן נמנעות רוב התקלות.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מדוע הפרדת ההוראות ל-system prompt (ולא שכפולן בכל הודעת משתמש) חוסכת עלות?",
    options: [
      "כי system prompt לא נספר בכלל כטוקנים",
      "כי system prompt נשלח פעם אחת בתחילת השיחה בלבד ואז נשמר בצד השרת",
      "כי כך אין צורך לחזור על אותן הוראות בכל הודעה, ולכן פחות טוקנים חוזרים על עצמם לאורך שיחה",
      "כי הוא תמיד נשלח בדחיסה",
    ],
    correctIndex: 2,
    explanation:
      "בכל קריאה המודל מקבל את כל ההקשר מחדש (הוא stateless). הרווח הוא שאתה כותב את ההוראות פעם אחת בשדה ה-system במקום להדביק אותן שוב ושוב בכל הודעת משתמש — כך פחות טוקנים חוזרים לאורך שיחה ארוכה.",
    optionNotes: [
      "שגוי: system prompt כן נספר כטוקנים ומחויב — זו בדיוק הסיבה שאורכו משנה לעלות.",
      "שגוי ומסוכן להאמין בזה: ה-API הוא stateless — אין 'שמירה בצד השרת', כל הקשר נשלח מחדש בכל קריאה.",
      "נכון: החיסכון הוא בכך שלא משכפלים הוראות בכל הודעת משתמש; הזהות נכתבת פעם אחת.",
      "שגוי: אין דחיסה אוטומטית של הפרומפט; הוא נספר כפי שהוא.",
    ],
  },
  {
    id: "q2",
    question: "פרומפט שלך מחזיר JSON תקין ב-9 מתוך 10 קריאות, ובפעם העשירית טקסט חופשי ששובר את הקוד. מה השורש ההנדסי הנכון?",
    options: [
      "המודל 'תקול' — צריך להחליף מודל",
      "הפורמט נדרש אך לא נאכף: חסרים דוגמת פלט מדויקת ומגבלה מפורשת ('החזר JSON בלבד, ללא טקסט נוסף')",
      "צריך פשוט להריץ שוב עד שיצליח",
      "JSON הוא פורמט לא נתמך על ידי מודלים",
    ],
    correctIndex: 1,
    explanation:
      "פלט לא-עקבי הוא כמעט תמיד סימן לפורמט שהוגדר ברפרוף. הפתרון המקצועי: דוגמת פלט קונקרטית בפרומפט, מגבלה מפורשת, ובקוד — ולידציה של הפלט (schema) עם ניסיון חוזר במקרה כישלון.",
    optionNotes: [
      "שגוי: החלפת מודל מסתירה את הבעיה. אותו פרומפט שביר יישבר גם על מודל אחר בקצה מסוים.",
      "נכון: זו הגדרת פורמט חלשה. אוכפים אותה בדוגמה + מגבלה מפורשת + ולידציה בצד הקוד.",
      "שגוי: 'להריץ שוב' זה טלאי, לא פתרון. בפרודקשן זה עלות וזמן — ולפעמים נכשל שוב.",
      "שגוי: מודלים מייצרים JSON מצוין כשמנחים אותם נכון; הבעיה בהנחיה, לא בפורמט.",
    ],
  },
  {
    id: "q3",
    question: "מתי ההפרדה המלאה ל-system + user + כל 4 הרכיבים היא דווקא over-engineering?",
    options: [
      "אף פעם — תמיד יש להשתמש בכל הרכיבים",
      "לפרומפט חד-פעמי ופשוט (למשל 'תרגם את המשפט הבא לאנגלית'), שבו הודעה אחת ברורה מספיקה",
      "רק כשעובדים בעברית",
      "כשיש הרבה משתמשים",
    ],
    correctIndex: 1,
    explanation:
      "כמו בהנדסת תוכנה — מבנה נכון תלוי בהקשר. למשימה חד-פעמית וטריוויאלית, טקס של system+4-רכיבים מוסיף מורכבות בלי תועלת. המבנה המלא משתלם כשהפרומפט חוזר על עצמו במערכת, על מגוון קלטים.",
    optionNotes: [
      "שגוי: 'תמיד הכל' זו חשיבה לא-הנדסית. מבנה נכון תלוי בהקשר ובעלות התחזוקה.",
      "נכון: למשימה טריוויאלית וחד-פעמית, הודעה אחת ברורה עדיפה על טקס מלא.",
      "שגוי: שפת הקלט לא קובעת את הצורך במבנה.",
      "שגוי: מספר המשתמשים דווקא *מגדיל* את הצורך במבנה עקבי, לא מקטין.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הרעיון המרכזי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "anatomy",
    label: "ארבעת הרכיבים — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          פרומפט מקצועי מורכב מ-4 רכיבים. לא כולם חובה בכל פרומפט, אבל כשמשהו משתבש — כמעט תמיד
          אחד מהם חסר או מוגדר חלש. עבור על הרכיבים:
        </p>
        <StepDiagram steps={ANATOMY_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "רע מול טוב: אותו צורך, שני פרומפטים",
    content: (
      <PromptComparisonLab
        title="חילוץ פרטים מפניית לקוח"
        bad={{
          label: "משאלה מעורפלת",
          content: "Read this support email and tell me what it's about:\n\n\"...email text...\"",
          outcome:
            "פלט: פסקה חופשית באורך משתנה, בלי מבנה קבוע. אי אפשר לעבד תוכנתית — כל קריאה מחזירה מבנה אחר.",
        }}
        good={{
          label: "מפרט חד-משמעי (4 רכיבים)",
          content:
            "Context: You triage support emails for a SaaS product.\nTask: Extract the customer's core issue.\nFormat: Return ONLY valid JSON: {\"category\": string, \"urgency\": \"low\"|\"med\"|\"high\", \"summary\": string}\nConstraints: summary <= 15 words. If unclear, set category to \"unknown\". No text outside the JSON.\n\nEmail:\n\"...email text...\"",
          outcome:
            "פלט: JSON יציב וניתן-לעיבוד בכל קריאה. הקוד יכול לנתב לפי category/urgency בלי ניחושים.",
        }}
        takeaway="אותו מודל, אותו קלט — ההבדל הוא רק במפרט. 4 הרכיבים הפכו פלט 'יפה אך חסר-תועלת' לפלט production שאפשר לבנות עליו."
      />
    ),
  },
  {
    id: "playground",
    label: "Prompt Playground — נסה בעצמך על Claude אמיתי",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          שנה את ה-system prompt וראה איך אותה שאלה בדיוק מניבה תשובה שונה לחלוטין. נסה: הוסף מגבלת
          פורמט (”החזר בדיוק 3 נקודות”) וראה כמה הפלט נהיה צפוי יותר.
        </p>
        <PromptPlayground
          label="נסה: אנטומיית פרומפט"
          defaultSystemPrompt="אתה עוזר תמיכה טכנית של חברת תוכנה. ענה בקצרה, בשלוש נקודות לכל היותר, בטון מקצועי וחברותי."
          defaultUserMessage="המשתמש שלי לא מצליח להתחבר לחשבון, מה הצעד הראשון שכדאי לבדוק?"
        />
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="ההפרדה בין system ל-user מאפשרת לשמור זהות עקבית לאורך שיחה שלמה בלי לשכפל הוראות — חוסכת טוקנים ומרכזת את 'החוזה' של המערכת במקום אחד ניתן-לתחזוקה."
        alternatives="אפשר לשלב הכל בהודעת משתמש אחת (context+task יחד). פשוט יותר לפרומפט חד-פעמי, אך במערכת עם עשרות סוגי בקשות זה הופך לכאוס בלתי-ניתן-לתחזוקה."
        whenNotTo="למשימה טריוויאלית וחד-פעמית ('תרגם את המשפט') — מבנה מלא של system+4-רכיבים הוא over-engineering. הודעה אחת ברורה מספיקה."
        commonMistakes="System prompt נפוח עם כללים סותרים; בדיקת הפרומפט על דוגמה אחת בלבד; הגדרת Format ברפרוף בלי דוגמה — שלושתם מובילים לפלט לא-עקבי בפרודקשן."
        performance="פורמט מוגדר היטב (JSON עם schema) מקטין את הצורך ב-retries ובפוסט-פרוססינג — כל retry הוא קריאת API נוספת (עלות + latency)."
        security="הודעת המשתמש היא קלט לא-אמין. אף פעם אל תיתן ל-system prompt לסמוך על כך שהמשתמש 'ישחק לפי הכללים' — נלמד הגנת prompt injection בהמשך, אבל ההרגל מתחיל כאן: הפרד הוראות (system) מנתונים (user)."
        cost="System prompt נשלח בכל קריאה כחלק מהקלט. system prompt ארוך פי 2 מייקר כל קריאה בשיחה — גם אם הוא זהה. קצר וחד עדיף על ארוך ו'ליתר ביטחון'."
        realWorld="ב-AtlasDesk (הפרויקט המסכם של המודול) system prompt קבוע יגדיר את זהות בוט התמיכה, והודעות המשתמש יזרמו אליו — בדיוק אותה ארכיטקטורה, בקנה מידה מסחרי."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות פרודקשן נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר מערכות בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>Format מוגדר במילים (”תחזיר JSON”) בלי דוגמה מדויקת — עובד ב-90% ונשבר בקצה.</li>
            <li>אין ולידציה של הפלט בקוד — סומכים על המודל במקום לאמת (schema) ולנסות שוב.</li>
            <li>System prompt שגדל עם הזמן ל”קיר טקסט” עם כללים סותרים — המודל מתעלם מחלקם.</li>
            <li>בדיקה על קלט 'נקי' אחד בלבד, לא על קלטים אמיתיים, מבולגנים וקצה.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>נותנים דוגמת פלט קונקרטית אחת לפחות (few-shot) — נלמד בשיעור הבא.</li>
            <li>מאמתים כל פלט מול schema, ומנסים שוב עם הודעת תיקון אם נכשל.</li>
            <li>שומרים system prompt קצר, ממוקד, ובלי כללים סותרים — ומגרסאים אותו כמו קוד.</li>
            <li>בונים סט בדיקות של 10-20 קלטים מייצגים ומריצים עליהם כל שינוי פרומפט.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "debug-task",
    label: "תרגיל דיבוג עם Claude Code",
    content: (
      <RealWorldTask
        id="prompt-anatomy-debug"
        title="תקן פרומפט 'שביר' שמחזיר פלט לא-עקבי"
        context="פתח את Claude Code בתיקייה כלשהי. אין צורך בפרויקט קיים — תעבוד על קובץ פרומפט אחד."
        steps={[
          "בקש מ-Claude Code ליצור סקריפט קצר שקורא ל-Claude API עם הפרומפט הבא (בכוונה שביר): 'Read this email and tell me the category and how urgent it is'.",
          "הרץ אותו על 5 מיילים שונים (המצא אותם). שים לב שהפלט חוזר בכל פעם במבנה אחר.",
          "עכשיו בקש מ-Claude Code לשכתב את הפרומפט לפי 4 הרכיבים: הוסף Context, Task ברור, Format כ-JSON עם דוגמה מדויקת, ו-Constraints ('JSON בלבד, urgency אחד מ-low/med/high').",
          "הוסף בקוד ולידציה: אם הפלט אינו JSON תקין מול ה-schema — הדפס שגיאה במקום לקרוס.",
          "הרץ שוב על אותם 5 מיילים. אמת שכעת המבנה זהה בכל הפעמים.",
        ]}
        successCriteria={[
          "יש לך 'לפני' ו'אחרי' — ואתה יכול להסביר בדיוק איזה רכיב חסר גרם לחוסר-העקביות",
          "הפלט 'אחרי' עובר ולידציה מול schema על כל 5 הקלטים",
          "הקוד לא קורס על פלט לא-תקין — הוא מזהה ומדווח",
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
          ["System Prompt", "הוראות קבועות שמגדירות זהות/כללי ה-AI לאורך כל השיחה; נשלחות בכל קריאה."],
          ["Context", "מידע רקע שהמודל צריך כדי להבין את הבקשה — בלעדיו הוא ממציא הנחות."],
          ["Task", "המשימה הספציפית, בפועל ברור אחד: סכם / סווג / חלץ."],
          ["Format", "מבנה הפלט הרצוי (JSON/רשימה) — מה שהופך פלט לניתן-לעיבוד תוכנתי."],
          ["Constraints", "מגבלות: אורך, טון, 'אל תמציא', 'אם אינך יודע — אמור'."],
          ["Stateless", "ה-API לא זוכר קריאות קודמות — כל ההקשר נשלח מחדש בכל בקשה."],
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
          <li>פרומפט הוא <strong>מפרט</strong>: ככל שהוא חד-משמעי יותר, כך הפלט עקבי יותר על מגוון קלטים.</li>
          <li>4 הרכיבים — <strong>Context, Task, Format, Constraints</strong> — הם רשימת בדיקה. פלט שבור? כנראה אחד מהם חלש.</li>
          <li>הפרד <strong>הוראות (system)</strong> מ<strong>נתונים (user)</strong> — לעקביות, לעלות, ובהמשך גם לאבטחה.</li>
          <li>מדוד על <strong>הרבה קלטים</strong>, לא על דוגמה אחת. 'עבד פעם אחת' זה לא 'עובד'.</li>
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
          במעבדה למעלה, כתוב system prompt שהופך את העוזר ל”נציג מכירות נלהב” במקום תמיכה טכנית,
          ושלח את אותה שאלה. אחר כך הוסף מגבלת פורמט מפורשת (”בדיוק 3 נקודות, כל אחת עד 12 מילים”)
          והשווה כמה הפלט נעשה צפוי יותר.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          ראית שדוגמה מדויקת משפרת פורמט? בשיעור הבא — Few-shot ו-Chain-of-Thought — נהפוך את זה
          לטכניקה שיטתית שמעלה דיוק דרמטית.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
