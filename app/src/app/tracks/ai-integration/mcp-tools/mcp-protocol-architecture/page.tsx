"use client";

import { Server, Plug, FileText, Wrench, MessageSquareQuote } from "lucide-react";
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
  lessonSlug: "mcp-protocol-architecture",
  title: "פרוטוקול MCP: קונספט וארכיטקטורה",
  objectives: [
    "להבין את התפקיד של MCP כפרוטוקול סטנדרטי לחיבור כלים ל-AI",
    "להבין את ההבדל בין MCP server נפרד (עם transport משלו) ל-tool calling מובנה ב-API",
    "להכיר את שלושת סוגי היכולות ב-MCP: tools, resources, prompts",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["tool-function-calling-basics"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה ש-MCP פותר",
    bullets: [
      "בשיעור הקודם ראית tool calling מובנה ב-API של Claude — זה עובד מצוין, אבל הכלים מוגדרים בקוד שלך, ספציפיים לאפליקציה אחת (AtlasDesk).",
      "מה אם רצית להשתמש באותם כלים (למשל 'חפש בקבצים', 'הרץ שאילתת SQL') גם ב-Claude Code, גם ב-Claude Desktop, וגם באפליקציה אחרת — בלי לכתוב אינטגרציה נפרדת לכל אחד?",
      "MCP (Model Context Protocol) הוא פרוטוקול סטנדרטי (לא ספציפי ל-Anthropic בלבד) שפותר בדיוק את זה: 'כתוב שרת MCP פעם אחת, כל לקוח תואם MCP יכול להשתמש בו'.",
    ],
  },
  {
    title: "ארכיטקטורת Client/Server",
    bullets: [
      "MCP Server — תהליך נפרד שחושף יכולות (tools/resources/prompts) דרך פרוטוקול תקני, בדרך כלל דרך stdio (תקשורת מקומית) או HTTP/SSE (מרוחק).",
      "MCP Client — האפליקציה שצורכת את היכולות (Claude Code, Claude Desktop, או כל כלי אחר שתומך ב-MCP).",
      "ההפרדה הזו שונה מ-tool calling רגיל: השרת הוא תהליך משלו, לא רק פונקציות בתוך קוד השרת של האפליקציה.",
    ],
  },
  {
    title: "שלושת סוגי היכולות ב-MCP",
    bullets: [
      "Tools — פונקציות שהמודל יכול לקרוא להן (בדיוק כמו tool calling, אבל דרך הפרוטוקול הסטנדרטי).",
      "Resources — מידע שהלקוח יכול לקרוא (למשל תוכן קובץ, שורות DB) — לא פעולה, אלא גישה למידע.",
      "Prompts — תבניות פרומפט מוגדרות מראש שהשרת חושף ללקוח לשימוש חוזר.",
    ],
  },
];

const STEPS: DiagramStep[] = [
  { icon: Server, label: "MCP Server", detail: "תהליך נפרד שחושף tools/resources/prompts דרך פרוטוקול תקני — לדוגמה שרת שיודע לחפש בקבצי הפרויקט שלך." },
  { icon: Plug, label: "Transport", detail: "stdio (תהליך מקומי, כמו ש-Claude Code מתחבר לשרתי MCP מקומיים) או HTTP/SSE (שרת מרוחק)." },
  { icon: Wrench, label: "Tools exposed", detail: "השרת מפרסם רשימת כלים זמינים — הלקוח (Claude Code/Desktop) 'רואה' אותם אוטומטית." },
  { icon: FileText, label: "Resources", detail: "גישה למידע (קבצים, רשומות DB) שהלקוח יכול לבקש לקרוא, לא רק 'להריץ'." },
  { icon: MessageSquareQuote, label: "Prompts", detail: "תבניות פרומפט מוכנות שהשרת מציע — למשל 'סכם את כל הבעיות הפתוחות'." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל המרכזי בין MCP server ל-tool calling מובנה ב-API (כמו ב-AtlasDesk)?",
    options: [
      "אין הבדל אמיתי, זה אותו דבר בשם אחר",
      "MCP server הוא תהליך נפרד עם פרוטוקול סטנדרטי שניתן לשימוש חוזר בכמה לקוחות שונים; tool calling מובנה הוא קוד ספציפי לאפליקציה אחת",
      "tool calling מובנה עובד רק עם GPT, לא עם Claude",
      "MCP תמיד מהיר יותר מ-tool calling מובנה",
    ],
    correctIndex: 1,
    explanation: "MCP נוצר בדיוק כדי לפתור את בעיית השימוש החוזר — כתוב שרת אחד, השתמש בו מכל לקוח תואם MCP, במקום לשכפל קוד לכל אפליקציה.",
    optionNotes: [
      "לא נכון: יש הבדל ארכיטקטוני משמעותי — לא רק שם שונה לאותו רעיון.",
      "התשובה הנכונה: MCP מפריד את השרת (יכולות) מהלקוח (מי שצורך אותן) בפרוטוקול תקני — בדיוק כדי לאפשר שימוש חוזר בכמה אפליקציות.",
      "לא נכון: tool calling מובנה (ה-API tools parameter) הוא יכולת של Claude API עצמו — לא קשור ל-GPT כלל.",
      "לא נכון: MCP מוסיף שכבת תקשורת נוספת (transport, פרוטוקול) — זה יכול להיות איטי יותר במקרים מסוימים, לא בהכרח מהיר יותר.",
    ],
  },
  {
    id: "q2",
    question: "מהם שלושת סוגי היכולות שMCP server יכול לחשוף?",
    options: [
      "Input, Output, Error",
      "Tools, Resources, Prompts",
      "Client, Server, Transport",
      "GET, POST, DELETE",
    ],
    correctIndex: 1,
    explanation: "Tools = פעולות שהמודל יכול לקרוא להן, Resources = מידע לקריאה, Prompts = תבניות פרומפט מוכנות לשימוש חוזר.",
    optionNotes: [
      "לא נכון: אלו לא מונחי MCP — נשמעים כמו מונחי תכנות כלליים אבל לא הסיווג הרשמי.",
      "התשובה הנכונה: זהו הסיווג הרשמי של MCP — שלושה סוגי יכולות שונים לתכליות שונות.",
      "לא נכון: Client/Server/Transport הם מרכיבי הארכיטקטורה, לא סוגי יכולות שהשרת חושף.",
      "לא נכון: אלו שיטות HTTP, לא קשורות לסיווג היכולות של MCP.",
    ],
  },
  {
    id: "q3",
    question: "צוות מתחבר לשרת MCP צד-שלישי לא-מוכר שמצא ברשת, שחושף כלי run_shell_command. מהי הזהירות ההנדסית הנכונה?",
    options: [
      "לחבר אותו מיד — אם הוא ברשימת שרתי MCP הציבוריים הוא בטוח לחלוטין",
      "להתייחס לשרת MCP כמו לכל dependency לא-מהימן: לקרוא את הקוד/ההרשאות, להבין מה כל כלי באמת מריץ, ולהריץ בסביבה מבודדת עם least privilege",
      "MCP מאובטח מעצם היותו פרוטוקול, אז אין צורך לבדוק דבר",
      "מספיק שה-transport הוא stdio (מקומי) — אין שום סיכון בשרת מקומי",
    ],
    correctIndex: 1,
    explanation:
      "שרת MCP הוא קוד שרץ עם ההרשאות שלך ויכול לחשוף כלים בעלי כוח אמיתי (הרצת פקודות, גישה לקבצים). חיבור שרת לא-מוכר זהה להרצת חבילה לא-מוכרת: בדוק מה הוא עושה, הענק לו את המינימום ההכרחי, ובודד אותו. הפרוטוקול מסדיר תקשורת — הוא לא ערובה לאבטחת התוכן.",
    optionNotes: [
      "לא נכון ומסוכן: 'רשימה ציבורית' אינה חותמת אמון — כל אחד יכול לפרסם שרת. run_shell_command בפרט הוא כוח מלא על המכונה שלך.",
      "התשובה הנכונה: שרת MCP = dependency לא-מהימן שרץ עם ההרשאות שלך. בדוק, הגבל (least privilege), בודד.",
      "לא נכון: הפרוטוקול מגדיר איך מדברים, לא מה הכלים מותר להם לעשות — האבטחה היא באחריותך.",
      "לא נכון: stdio מקומי רץ על המכונה שלך עם ההרשאות שלך — זה דווקא מסוכן יותר, לא פחות, כי יש גישה מקומית ישירה.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: למה MCP קיים", content: <SlideDeck slides={SLIDES} /> },
  { id: "architecture", label: "ארכיטקטורת MCP", content: <StepDiagram steps={STEPS} /> },
  {
    id: "comparison",
    label: "השוואה: מתי MCP server ומתי tool calling מובנה",
    content: (
      <PromptComparisonLab
        title="אותו צורך (בדיקת סטטוס פנייה), שתי גישות ארכיטקטוניות"
        unitLabel="ארכיטקטורה"
        bad={{
          label: "MCP server נפרד ל-AtlasDesk (over-engineering כאן)",
          content: `תהליך Node.js נפרד שרץ תמידית, חושף check_ticket_status
דרך stdio/HTTP, ש-AtlasDesk (אפליקציית Vercel serverless)
צריכה להתחבר אליו כלקוח MCP.`,
          outcome: "AtlasDesk הוא אפליקציית Vercel serverless — אין 'תהליך תמידי' שרץ ברקע להתחבר אליו. הוספת שרת MCP נפרד כאן מוסיפה מורכבות תפעולית עצומה בלי שום תועלת, כי אין צורך בשימוש חוזר בין כמה לקוחות.",
        }}
        good={{
          label: "Tool calling מובנה (מה ש-AtlasDesk באמת עושה)",
          content: `הכלי מוגדר ישירות בקוד השרת של AtlasDesk (lib/atlasdesk/tools.ts),
נשלח כפרמטר tools ל-Claude API בכל קריאה — בלי תהליך נוסף,
בלי תחזוקת שרת נפרד.`,
          outcome: "פשוט, ישיר, בלי overhead תפעולי. מתאים בדיוק למקרה של אפליקציה אחת עם כלים ספציפיים לה.",
        }}
        takeaway="MCP שווה את המורכבות שלו כשבאמת יש כמה לקוחות שונים (Claude Code, Claude Desktop, אפליקציה אחרת) שצריכים לשתף אותם כלים. לאפליקציית web בודדת כמו AtlasDesk, tool calling מובנה הוא הבחירה ההנדסית הנכונה."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="MCP נוצר כי ארגונים גדולים מצאו את עצמם כותבים את אותה אינטגרציה (חיפוש בקבצים, גישה ל-DB) פעמים רבות עבור כלי AI שונים — MCP הוא ניסיון סטנדרטיזציה: כתוב פעם אחת, השתמש בכל מקום."
        alternatives="חלופה ל-MCP: להמשיך לכתוב tool calling ספציפי לכל אפליקציה (מה ש-AtlasDesk עושה) — פשוט יותר לפרויקט בודד, אבל לא ניתן לשימוש חוזר בין פרויקטים/כלים שונים."
        whenNotTo="אל תבנה MCP server אם יש לך אפליקציה אחת בלבד עם כלים ספציפיים לה ואין צורך לשתף אותם עם כלי AI אחר — זה over-engineering טהור."
        commonMistakes="לבנות MCP server מורכב לפני שבודקים אם tool calling פשוט מספיק לצורך בפועל — 'תמיד להתחיל עם הפתרון הפשוט ביותר שעונה על הצורך' חל גם כאן."
        cost="MCP server נפרד דורש תהליך רץ (או deployment נפרד), תחזוקה, וניהול גרסאות פרוטוקול — עלות תפעולית אמיתית שצריך להצדיק מול התועלת."
        realWorld="Claude Code עצמו הוא MCP client — כשאתה מחבר לו שרתי MCP (למשל שרת שמתחבר ל-GitHub או ל-Slack), אתה בדיוק חווה את הארכיטקטורה שלמדת כאן."
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
            <li>בונים MCP server מלא כי ”זה הטרנד”, כשלאפליקציה בודדת מספיק tool calling מובנה — מורכבות תפעולית בלי תועלת.</li>
            <li>שוכחים ש-MCP server הוא תהליך שצריך לרוץ, לנטר ולעדכן — בפרודקשן הוא נקודת-כשל נוספת שנופלת בשקט.</li>
            <li>מחברים שרת MCP צד-שלישי לא-מוכר בלי לבדוק אילו כלים הוא חושף ובאיזה כוח — כמו להתקין dependency עיוור.</li>
            <li>מבלבלים בין Resources (קריאת מידע) ל-Tools (פעולה) ומגדירים כלי-כתיבה כ”resource” תמים.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מתחילים מהפתרון הפשוט (tool calling מובנה) ועוברים ל-MCP רק כשבאמת יש כמה לקוחות שצריכים לשתף כלים.</li>
            <li>מתייחסים ל-MCP server כמו לכל שירות: health-check, לוגים, גרסת פרוטוקול מנוהלת.</li>
            <li>בודקים שרת MCP חיצוני כמו dependency לא-מהימן: קוראים מה הוא מריץ, מריצים בבידוד, least privilege.</li>
            <li>ממפים במודע כל יכולת לסוג הנכון — tool / resource / prompt — כדי שהלקוח יטפל בה נכון.</li>
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
          ["MCP (Model Context Protocol)", "פרוטוקול סטנדרטי לחיבור כלי AI למקורות מידע/פעולות בצורה ניתנת לשימוש חוזר."],
          ["MCP Server", "תהליך שחושף tools/resources/prompts דרך הפרוטוקול."],
          ["MCP Client", "אפליקציה שצורכת יכולות משרת MCP (למשל Claude Code)."],
          ["Transport", "אופן התקשורת בין client ל-server — stdio או HTTP/SSE."],
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
        id="mcp-protocol-architecture"
        title="חקור שרתי MCP קיימים עם Claude Code"
        context="לא צריך לבנות שרת עדיין (זה השיעור הבא) — המשימה כאן היא הבנה מעשית של מה כבר קיים."
        steps={[
          "שאל את Claude Code שלך: \"אילו MCP servers ציבוריים ידועים לך שקיימים היום (למשל לגישה ל-GitHub, filesystem, databases)?\"",
          "בחר אחד מהם ובקש מ-Claude Code להסביר איזה tools/resources הוא חושף.",
          "השווה: האם היכולת הזו הייתה אפשרית גם כ-tool calling מובנה פשוט, או שהיא באמת מצדיקה שרת MCP נפרד (כי כמה כלים שונים צריכים אותה)?",
        ]}
        successCriteria={[
          "מצאת דוגמה אמיתית לשרת MCP קיים ואת מה שהוא חושף",
          "אתה מסוגל להסביר במילים שלך למה השימוש החוזר בין לקוחות שונים מצדיק את המורכבות של MCP במקרה הזה",
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
          חשוב על פרויקט אישי או רעיון עסקי שיש לך. האם יש בו יכולת (חיפוש, גישה למידע, פעולה)
          שהיה הגיוני לחשוף כשרת MCP כדי שכמה כלי AI שונים יוכלו להשתמש בה? נמק בקצרה למה כן/לא.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
