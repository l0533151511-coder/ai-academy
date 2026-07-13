"use client";

import { MessageCircle, Wrench, Play, Reply } from "lucide-react";
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
  lessonSlug: "tool-function-calling-basics",
  title: "יסודות Tool/Function Calling",
  objectives: [
    "להבין איך מודל 'מבקש' להריץ פונקציה במקום לענות ישירות",
    "להבין את מבנה ה-tool schema (name, description, input_schema)",
    "לעקוב אחרי מחזור חיים מלא: בקשה→tool_use→ביצוע→tool_result→תשובה סופית",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: תוכנית ארכיטקטורה + מימוש ב-AtlasDesk"],
};

const SLIDES: Slide[] = [
  {
    title: "המגבלה שגרמה ל-Tool Calling להיוולד",
    bullets: [
      "עד עכשיו, ה-AI שבנית ידע רק 'לדבר' — לענות מתוך מה שהוא יודע מהאימון שלו. אבל AtlasDesk האמיתי (וכל מוצר אמיתי) צריך AI שיודע גם *לפעול*: לבדוק סטטוס פנייה אמיתי, לגשת ל-DB, לקרוא ל-API חיצוני.",
      "Tool Calling (נקרא גם Function Calling) הוא המנגנון שנותן למודל שפה יכולת 'לבקש' מהקוד שמריץ אותו להפעיל פונקציה ספציפית, ולקבל את התוצאה בחזרה כדי לענות נכון.",
    ],
  },
  {
    title: "מה בדיוק המודל 'מבקש'",
    bullets: [
      "המודל לא מריץ קוד בעצמו — הוא רק מחזיר הודעה מובנית: 'תרוץ את הפונקציה X עם הפרמטרים Y'.",
      "התוכנה שלך (לא המודל!) היא זו שבאמת מריצה את הפונקציה, ושולחת את התוצאה בחזרה למודל בהודעה הבאה.",
      "זו הפרדת אחריות קריטית: המודל מחליט *מה* לעשות, הקוד שלך שולט *איך* זה קורה בפועל — ויכול לחסום, לוולד, או לסרב.",
    ],
  },
  {
    title: "אנטומיית tool schema",
    bullets: [
      "name — שם ייחודי לכלי (למשל check_ticket_status).",
      "description — הסבר בשפה טבעית מתי להשתמש בכלי הזה. זה בדיוק כמו system prompt: איכות התיאור קובעת אם המודל ידע *מתי* לקרוא לכלי.",
      "input_schema — JSON Schema שמגדיר אילו פרמטרים הכלי מקבל וזה סוגם.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: MessageCircle, label: "1. בקשת משתמש", detail: "'מה הסטטוס של הפנייה AD-1042?' — נשלח למודל יחד עם רשימת הכלים הזמינים." },
  { icon: Wrench, label: "2. tool_use", detail: "המודל לא עונה טקסט — הוא מחזיר בקשה מובנית: 'הרץ check_ticket_status עם ticket_id=AD-1042'." },
  { icon: Play, label: "3. ביצוע אמיתי", detail: "הקוד שלך (לא המודל!) מריץ את הפונקציה בפועל — מול DB/API אמיתי — ומקבל תוצאה." },
  { icon: Reply, label: "4. tool_result → תשובה", detail: "התוצאה נשלחת בחזרה למודל כהודעה חדשה; המודל מנסח תשובה טבעית ללקוח על בסיס הנתון האמיתי." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מי בפועל מריץ את הפונקציה כשמודל 'מבקש' tool_use?",
    options: [
      "המודל עצמו מריץ את הקוד בשרתי Anthropic",
      "הקוד שלך (השרת/אפליקציה) — המודל רק מבקש, אתה שולט בביצוע בפועל",
      "זה קורה אוטומטית בדפדפן של המשתמש",
      "אף אחד לא מריץ בפועל — זו רק סימולציה טקסטואלית",
    ],
    correctIndex: 1,
    explanation: "זו בדיוק ההפרדה החשובה: המודל מחליט *מה* לעשות, אבל הקוד שלך שולט לחלוטין ב*איך* — ויכול לוולד, לחסום, או לסרב לפני שמשהו רגיש קורה.",
    optionNotes: [
      "לא נכון: Anthropic לא מריצה שום קוד עסקי שלך — המודל הוא רק 'מוח' שמחזיר בקשה, בלי גישה למערכות שלך.",
      "התשובה הנכונה: זו הפרדת האחריות המרכזית ב-tool calling — המודל מציע, האפליקציה שלך מבצעת (ויכולה לסרב).",
      "לא נכון: אין שום ביצוע אוטומטי בצד הלקוח — כל הביצוע קורה בקוד השרת שכתבת.",
      "לא נכון: הביצוע הוא אמיתי לגמרי (למשל קריאה אמיתית ל-DB) — זו לא סימולציה.",
    ],
  },
  {
    id: "q2",
    question: "מה התפקיד של שדה ה-description ב-tool schema?",
    options: [
      "תיעוד פנימי בלבד למפתחים, לא משפיע על המודל",
      "מסביר למודל בשפה טבעית מתי להשתמש בכלי — איכות התיאור קובעת אם הוא ייקרא בזמן הנכון",
      "קובע את שם הפרמטר היחיד שהכלי מקבל",
      "משמש רק להצגה ב-UI למשתמש הסופי",
    ],
    correctIndex: 1,
    explanation: "description הוא בדיוק כמו system prompt קטן — הניסוח שלו קובע אם המודל 'יבין' מתי הכלי הזה רלוונטי לבקשה של המשתמש.",
    optionNotes: [
      "לא נכון: זה בדיוק ההפך — description הוא המידע היחיד שהמודל רואה כדי להחליט אם לקרוא לכלי; הוא קריטי, לא רק תיעוד.",
      "התשובה הנכונה: המודל לא 'יודע' מראש מתי להשתמש בכלי — הוא לומד את זה אך ורק מהתיאור שכתבת. description עמום = הכלי לא ייקרא בזמן הנכון.",
      "לא נכון: זה תפקיד ה-input_schema, לא ה-description.",
      "לא נכון: description לא מוצג למשתמש הסופי כלל — הוא מיועד למודל בלבד.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: איך AI לומד 'לפעול'", content: <SlideDeck slides={SLIDES} /> },
  { id: "loop", label: "מחזור החיים המלא של קריאת כלי", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: תיאור כלי חלש מול חזק",
    content: (
      <PromptComparisonLab
        title="אותו כלי, שני תיאורים שונים לגמרי"
        unitLabel="Tool description"
        bad={{
          label: "עמום",
          content: `{
  "name": "check_ticket_status",
  "description": "בודק פנייה",
  "input_schema": { "ticket_id": { "type": "string" } }
}`,
          outcome: "המודל לא יודע *מתי* להשתמש בזה — 'בודק פנייה' יכול להתאים גם לשאלות כלליות שלא קשורות לפנייה ספציפית. הכלי ייקרא לפעמים מיותר, ולפעמים לא ייקרא כשבאמת צריך.",
        }}
        good={{
          label: "ספציפי ומדריך",
          content: `{
  "name": "check_ticket_status",
  "description": "בודק את הסטטוס העדכני של פניית תמיכה (ticket)
    לפי מספר הפנייה. השתמש בכלי הזה כל פעם שהלקוח שואל על
    סטטוס פנייה קיימת, בפורמט AD-XXXX.",
  "input_schema": { "ticket_id": {
    "type": "string", "description": "מספר הפנייה, לדוגמה AD-1042" } }
}`,
          outcome: "המודל מבין בדיוק מתי לקרוא לכלי (שאלה על סטטוס פנייה) ואיך למלא את הפרמטר (פורמט AD-XXXX) — פחות ניחושים, פחות קריאות מיותרות או חסרות.",
        }}
        takeaway="תיאור כלי הוא הפרומפט הכי חשוב שתכתוב במערכת tool calling — הוא הדבר היחיד שהמודל רואה כדי להחליט אם ומתי להשתמש בכלי. תשקיע בו בדיוק כמו שהיית משקיע ב-system prompt."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הפרדת 'החלטה' (המודל) מ'ביצוע' (הקוד שלך) קיימת כי מודל שפה לא יכול (ולא צריך) לקבל גישה ישירה למסדי נתונים/API — זה היה חור אבטחה עצום. tool calling נותן למודל את הכוח לבקש, בלי לתת לו את המפתחות בפועל."
        alternatives="חלופה: לבנות פרומפט ענק שמכיל את כל המידע האפשרי מראש (כל הפניות, כל הסטטוסים) בתוך ה-context. עובד לכמות קטנה של מידע קבוע, אבל נשבר מיד כשהמידע דינמי/גדול/משתנה בזמן אמת."
        whenNotTo="אם המידע הנדרש קטן וקבוע (כמו FAQ סטטי), tool calling הוא overhead מיותר — פשוט לשים את המידע ב-system prompt או ב-RAG (השיעורים הבאים)."
        commonMistakes="לתת למודל כלי 'מסוכן' (למשל delete_ticket) בלי שכבת אישור נוספת בקוד — תמיד לזכור: המודל יכול לבקש כל דבר, הקוד שלך חייב להיות שכבת ההגנה האמיתית."
        cost="כל tool_use round-trip הוא קריאת API נוספת (טוקנים + זמן) — לולאה שלא נעצרת (המודל מבקש כלים שוב ושוב) יכולה להתייקר מהר; תמיד להגביל מספר סיבובים מקסימלי (כפי שראית ב-/api/ai/tool-chat)."
        realWorld="בדיוק ככה נבנה הכלי check_ticket_status ב-AtlasDesk (lib/atlasdesk/tools.ts) — נסה אותו בעצמך ב-/atlasdesk עם 'כלים מחוברים' פעיל."
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
            <li>סומכים על הארגומנטים שהמודל שלח כמו שהם — הוא &quot;ביקש&quot; delete_ticket עם id שהמציא, והקוד מבצע בלי ולידציה.</li>
            <li>description עמום (&quot;בודק פנייה&quot;) — הכלי נקרא בזמן הלא-נכון או לא נקרא כשצריך.</li>
            <li>אין תקרת סיבובים ללולאת הכלים — המודל מבקש כלי שוב ושוב, העלות וה-latency מתפוצצים.</li>
            <li>שוכחים להחזיר tool_result בפורמט/id הנכון — המודל &quot;תקוע&quot; ולא ממשיך את השיחה.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מתייחסים לכל ארגומנט מהמודל כקלט לא-אמין: מוודאים סוג, טווח, והרשאה לפני ביצוע (least privilege).</li>
            <li>משקיעים ב-description כמו ב-system prompt — ספציפי, עם פורמט הפרמטר ומקרי-קצה.</li>
            <li>מגבילים מספר סיבובי tool_use מקסימלי ומטפלים במקרה שהמודל &quot;מסרב&quot; להיעצר.</li>
            <li>מפרידים פעולות write (דורשות אישור/ולידציה קפדנית) מ-read — בדיוק כמו endpoints רגילים.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Tool/Function Calling", "מנגנון שמאפשר למודל 'לבקש' מהקוד שמריץ אותו להפעיל פונקציה ספציפית."],
          ["tool_use", "סוג ההודעה שהמודל מחזיר כשהוא מבקש להריץ כלי."],
          ["tool_result", "ההודעה שהאפליקציה שולחת בחזרה למודל עם תוצאת הכלי בפועל."],
          ["input_schema", "JSON Schema שמגדיר אילו פרמטרים הכלי מקבל."],
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
        id="mcp-tool-function-calling-basics"
        title="נסה Tool Calling אמיתי ב-AtlasDesk, ואז שפר תיאור כלי בעזרת Claude Code"
        context="AtlasDesk כבר כולל כלי אמיתי (check_ticket_status) — הפעל אותו ובחן את ההתנהגות."
        steps={[
          "פתח את /atlasdesk, הפעל 'כלים מחוברים' ו'מצב מפתח', ושאל: \"מה הסטטוס של AD-2087?\"",
          "בדוק ביומן הכלים (מוצג במצב מפתח) איזה tool נקרא ובאילו פרמטרים.",
          "פתח את lib/atlasdesk/tools.ts בעזרת Claude Code, וקרא את ה-description הקיים.",
          "בקש מ-Claude Code להציע ניסוח description עוד יותר מדויק — למשל שיבהיר גם מה קורה אם מספר הפנייה לא נמצא.",
        ]}
        successCriteria={[
          "ראית בפועל קריאת tool אמיתית ביומן הכלים",
          "אתה מבין את הקשר בין ניסוח ה-description לבין מתי המודל בוחר לקרוא לכלי",
          "יש לך הצעת שיפור קונקרטית לתיאור הכלי, לא רק תיאורטית",
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
          תכנן (בכתב, בלי לממש עדיין) tool schema לכלי חדש שהיה שימושי ב-AtlasDesk — למשל
          &quot;get_plan_pricing&quot; שמחזיר מחיר תוכנית לפי שם. כתוב name/description/input_schema
          מלאים, ובדוק את עצמך: האם ה-description שלך מספיק ספציפי כדי שמודל ידע בדיוק מתי להשתמש בו?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
