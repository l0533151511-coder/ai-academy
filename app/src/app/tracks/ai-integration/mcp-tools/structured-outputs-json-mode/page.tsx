"use client";

import { FileJson, ShieldCheck, RefreshCw, Braces, AlertTriangle, CheckCircle2 } from "lucide-react";
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
  lessonSlug: "structured-outputs-json-mode",
  title: "פלט מובנה: JSON אמין ו-Schema",
  objectives: [
    "להבין למה 'פשוט תבקש JSON' נכשל באחוז קטן אך קטלני מהקריאות, ולמה זה שובר קוד בפרודקשן",
    "לשלוט בשלוש הגישות לפלט מובנה אמין: אכיפה דרך tool_use/input_schema, דוגמה מפורשת בפרומפט, וּולידציה + retry בקוד",
    "לבנות לולאת חילוץ שמאמתת כל פלט מול schema, מנסה שוב עם הודעת שגיאה, ואף פעם לא סומכת על ה-JSON של המודל בעיוור",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["building-first-mcp-server"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: פלט 'כמעט תמיד תקין' הוא באג",
    bullets: [
      "בנית MCP server ולמדת שהמודל יכול 'לבקש' כלים. עכשיו השאלה ההפוכה: איך מוציאים מהמודל נתונים במבנה שהקוד שלך יכול לצרוך בבטחון — פעם אחר פעם, על אלפי קלטים.",
      "כשאתה מבקש 'תחזיר JSON', תקבל JSON תקין ברוב המכריע של הפעמים. אבל בחלק קטן (בסביבות ~10% בפרומפט לא-אכוף) יגיע 'בטח! הנה ה-JSON:' לפני הסוגר, או פסיק חסר, או markdown fence — וה-JSON.parse קורס.",
      "בפרודקשן, באג שקורה ב-1 מכל 20 בקשות הוא לא נדיר — הוא תקלה יומיומית. פלט מובנה אמין הוא היכולת ההנדסית שהופכת מודל שפה מ'הדגמה מגניבה' לרכיב שאפשר לבנות עליו מערכת.",
    ],
  },
  {
    title: "למה זה קורה: המודל מייצר טקסט, לא נתונים",
    bullets: [
      "מודל שפה תמיד מייצר את הטוקן הבא לפי הסתברות. 'JSON' הוא בשבילו רק תבנית טקסט שהוא נוטה אליה — אין לו מנגנון פנימי שמבטיח שהתו האחרון יסגור את הסוגריים.",
      "לכן 'ברוב הפעמים תקין' זה בדיוק הצפוי: ההתפלגות מרוכזת סביב JSON תקין, אבל הזנב שלה כולל טקסט פתיחה, הערות, או שדה שהמודל 'המציא'.",
      "המסקנה ההנדסית: אל תנסה לשכנע את המודל להיות מושלם. במקום זה — צמצם את מרחב הפלט (אכיפה) ואמת בקוד (ולידציה). שתי שכבות, לא אחת.",
    ],
  },
  {
    title: "הקשר ל-tool calling: קריאת כלי היא פלט מובנה",
    bullets: [
      "בשיעור הקודם המודל 'ביקש' כלי עם input_schema. שים לב: הוא לא כתב טקסט חופשי — הוא מילא schema. זה בדיוק פלט מובנה, רק שקראנו לו tool_use.",
      "לכן הטכניקה הכי אמינה לקבל JSON אינה 'לבקש JSON יפה' אלא להגדיר כלי (או response format) עם input_schema, ולתת למודל למלא אותו. ה-API מבטיח שהמבנה יתאים ל-schema.",
      "התובנה: כשאתה צריך פלט מבני, אל תחשוב 'איך אנסח את הבקשה יפה' — חשוב 'איזה schema אני אוכף'. זה מעביר את האחריות מהניסוח למבנה.",
    ],
  },
];

const PIPELINE_STEPS: DiagramStep[] = [
  {
    icon: Braces,
    label: "1. הגדר schema",
    detail: "מגדירים את המבנה המדויק שהקוד צריך: שדות, סוגים, מה חובה ומה enum. זה 'החוזה' — מקור האמת היחיד לצורת הפלט.",
  },
  {
    icon: FileJson,
    label: "2. המודל ממלא",
    detail: "שולחים את ה-schema כ-input_schema של כלי (או response format), והמודל ממלא אותו במקום לכתוב טקסט חופשי. המבנה נאכף בצד ה-API.",
  },
  {
    icon: ShieldCheck,
    label: "3. אמת בקוד",
    detail: "גם אחרי אכיפה — מריצים ולידציה (Zod/JSON-schema) בקוד. מוודאים סוגים, טווחים וערכים לוגיים. אף פעם לא סומכים על הפלט בעיוור.",
  },
  {
    icon: RefreshCw,
    label: "4. נכשל? retry עם השגיאה",
    detail: "אם הוולידציה נכשלה — שולחים למודל בחזרה את הודעת השגיאה המדויקת ומבקשים לתקן. בדרך כלל ניסיון אחד נוסף מספיק; מגבילים תקרה.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה 'פשוט תבקש מהמודל JSON' נכשל בחלק קטן מהקריאות, גם עם מודל מצוין?",
    options: [
      "כי מודלים לא באמת יודעים לייצר JSON — זה פורמט מדי מורכב עבורם",
      "כי המודל מייצר טוקנים לפי הסתברות; ברוב הפעמים הוא ינחת על JSON תקין, אך בזנב ההתפלגות יגיע טקסט פתיחה, markdown fence או שדה מומצא",
      "כי ה-API דוחס את הפלט ולפעמים משבש אותו",
      "כי JSON חייב תמיד לעבור דרך כלי (tool_use), ואי אפשר לקבל אותו אחרת",
    ],
    correctIndex: 1,
    explanation:
      "המודל לא 'מבין' JSON כמבנה נתונים — הוא מייצר את הטוקן הבא לפי הסתברות. ההתפלגות מרוכזת סביב JSON תקין, אבל הזנב שלה כולל 'בטח, הנה:' לפני הסוגר, ```json fences, או שדה נוסף שהומצא. לכן 'רוב הפעמים תקין' הוא בדיוק הצפוי — והפתרון הוא אכיפה + ולידציה, לא ניסוח משכנע יותר.",
    optionNotes: [
      "שגוי: מודלים מייצרים JSON תקין ברוב המכריע של הפעמים; הבעיה היא העקביות בזנב, לא חוסר יכולת עקרוני.",
      "נכון: זו טבע הייצור ההסתברותי. ברוב הפעמים תקין, ובזנב — טקסט עוטף, fence, או שדה מומצא ששוברים את ה-parse.",
      "שגוי: אין דחיסה שמשבשת פלט; מה שהמודל מייצר מגיע כפי שהוא.",
      "שגוי: אפשר לקבל JSON גם בלי כלי (בקשה + ולידציה), פשוט פחות אמין מאכיפה דרך input_schema.",
    ],
  },
  {
    id: "q2",
    question: "המחלץ שלך מאמת פלט מול schema. פעם ב-30 קריאות הוולידציה נכשלת. מה הגישה ההנדסית הנכונה?",
    options: [
      "לתפוס את הכישלון, ללוגג, ולהחזיר null ללקוח — פשוט לוותר על הקריאה הזו",
      "לתפוס את שגיאת הוולידציה, לשלוח אותה בחזרה למודל כהודעת תיקון ('הפלט נכשל כי X, החזר שוב לפי ה-schema'), ולנסות שוב עם תקרת ניסיונות",
      "לעטוף את JSON.parse ב-try/catch ולהתעלם — אם זה נשבר, כנראה הקלט לא תקין",
      "להעלות את הטמפרטורה כדי שהמודל יהיה 'יצירתי' יותר וימצא את הפורמט",
    ],
    correctIndex: 1,
    explanation:
      "כישלון ולידציה הוא אירוע צפוי, לא חריג נדיר — צריך להתייחס אליו כחלק מהלולאה. הדפוס המקצועי: ולידציה → אם נכשל, שלח את השגיאה המדויקת בחזרה למודל ובקש לתקן → נסה שוב עד תקרה (למשל 2 ניסיונות). הודעת השגיאה הקונקרטית היא הרמז שמנווט את המודל לפלט תקין.",
    optionNotes: [
      "שגוי: לוותר על הקריאה זו פגיעה חמורה בחוויית המשתמש כשניסיון תיקון אחד היה פותר את זה בסבירות גבוהה.",
      "נכון: retry עם הודעת שגיאה מפורשת הוא הדפוס הסטנדרטי — נותן למודל בדיוק את המידע שחסר לו כדי לתקן.",
      "שגוי: להתעלם משגיאה זה להסתיר באג, לא לפתור. הבעיה כמעט תמיד בפורמט, לא בקלט.",
      "שגוי: טמפרטורה גבוהה מגדילה שונות ולכן *מגבירה* את סיכוי הסטייה מהפורמט — ההפך ממה שרוצים כאן.",
    ],
  },
  {
    id: "q3",
    question: "אכפת פלט דרך input_schema של כלי, וה-API מבטיח שהמבנה תואם ל-schema. למה עדיין צריך ולידציה בקוד?",
    options: [
      "אין צורך — אם ה-API אוכף את המבנה, הוולידציה מיותרת",
      "כי אכיפת ה-schema מבטיחה *מבנה* (סוגים ושדות), אך לא *נכונות לוגית*: enum יכול להתמלא בערך לא-הגיוני, מספר יכול להיות מחוץ לטווח, וטקסט יכול להיות מומצא — הקוד הוא הגבול האחרון",
      "כי ולידציה מאיצה את הקריאה ל-API",
      "רק כדי לתעד — הוולידציה לא תופסת שום דבר אמיתי בפועל",
    ],
    correctIndex: 1,
    explanation:
      "אכיפת schema פותרת את בעיית ה-parse (המבנה תמיד יהיה JSON תקין עם השדות הנכונים), אבל היא לא מבטיחה שהערכים הגיוניים: תאריך יכול להיות בעבר כשצריך עתיד, סכום יכול להיות שלילי, וטקסט 'summary' יכול להכיל הזיה. הוולידציה בקוד היא השכבה שבודקת חוקים עסקיים — היא הגבול האחרון לפני שנתון לא-אמין נכנס למערכת שלך.",
    optionNotes: [
      "שגוי: אכיפת מבנה אינה אכיפת משמעות. פלט יכול להתאים ל-schema ועדיין להיות שגוי לוגית.",
      "נכון: schema אוכף צורה, לא נכונות. הוולידציה בקוד בודקת טווחים, ערכי enum הגיוניים וחוקים עסקיים.",
      "שגוי: ולידציה היא פעולה מקומית בקוד; אין לה קשר למהירות קריאת ה-API.",
      "שגוי: הוולידציה תופסת בעיות אמיתיות (ערכים מחוץ לטווח, הזיות) — זה בדיוק תפקידה.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: למה פלט מובנה קשה", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "pipeline",
    label: "צינור הפלט המובנה — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          פלט מובנה אמין הוא לא טריק ניסוח אחד — הוא צינור בן ארבעה שלבים. שים לב שהאכיפה (שלב 2)
          והוולידציה (שלב 3) הן שתי שכבות נפרדות: אחת מבטיחה מבנה, השנייה מבטיחה משמעות.
        </p>
        <StepDiagram steps={PIPELINE_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "רע מול טוב: בקשת JSON חופשית מול schema אכוף",
    content: (
      <PromptComparisonLab
        title="חילוץ פרטי הזמנה מהודעת לקוח"
        unitLabel="גישת פלט"
        bad={{
          label: "בקשת טקסט חופשי: 'תחזיר JSON'",
          content: `// prompt
"Extract the order details from this message and return JSON:
{ product, quantity, urgency }

Message: I need 3 blue chairs, kind of urgent."

// תשובות אופייניות על פני הרצות שונות:
// הרצה 1 (תקין):
{ "product": "blue chairs", "quantity": 3, "urgency": "high" }

// הרצה 2 (נשבר — טקסט עוטף):
Sure! Here is the JSON you requested:
{ "product": "blue chairs", "quantity": 3, "urgency": "medium" }

// הרצה 3 (נשבר — markdown fence + שדה מומצא):
\`\`\`json
{ "product": "blue chairs", "quantity": 3, "urgency": "high", "color": "blue" }
\`\`\``,
          outcome:
            "JSON.parse קורס בהרצה 2 ו-3. ~1 מכל 10-20 קריאות מפילה את הקוד בפרודקשן. אין ערובה לסוגי השדות או לערכי urgency — enum לא נאכף.",
        }}
        good={{
          label: "אכיפה דרך input_schema של כלי",
          content: `// מגדירים כלי שהמודל *חייב* למלא — זה פלט מובנה אמיתי
const tool = {
  name: "record_order",
  description: "רשום את פרטי ההזמנה שחולצו מהודעת הלקוח",
  input_schema: {
    type: "object",
    properties: {
      product:  { type: "string" },
      quantity: { type: "integer", minimum: 1 },
      urgency:  { type: "string", enum: ["low", "medium", "high"] },
    },
    required: ["product", "quantity", "urgency"],
  },
};

// המודל מחזיר tool_use עם input שתואם ל-schema —
// לא טקסט חופשי, בלי fences, בלי 'Sure! Here is':
{ "product": "blue chairs", "quantity": 3, "urgency": "high" }

// ואז, תמיד, ולידציה בקוד לפני שימוש:
const parsed = OrderSchema.safeParse(toolUse.input);
if (!parsed.success) retryWithError(parsed.error);`,
          outcome:
            "המבנה נאכף בצד ה-API: אין טקסט עוטף, אין fence, השדות והסוגים מובטחים. הוולידציה תופסת את מה שנשאר (ערך לוגי חריג), ו-retry מתקן. יציב על אלפי קלטים.",
        }}
        takeaway="אותו מודל, אותו קלט — ההבדל הוא לא בניסוח אלא בשאלה 'מבנה אכוף או בקשה משכנעת'. schema הופך פלט 'כמעט תמיד תקין' לפלט production שהקוד יכול לצרוך בעיניים עצומות (וגם אז — מאמתים)."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="פלט מובנה מפריד את 'מה המודל מבין' מ'איך הקוד צורך את זה'. ה-schema הוא חוזה מפורש בין המודל למערכת — בדיוק כמו טיפוסים בין שני שירותים. בלעדיו, כל שינוי בניסוח הפרומפט יכול לשבור בשקט את הצרכן במורד הזרם."
        alternatives="שלוש גישות, מהאמינה לפחות: (1) אכיפה דרך input_schema/response_format — ה-API מבטיח מבנה; (2) דוגמה מפורשת בפרומפט + 'JSON בלבד' — עוזר אך לא אוכף; (3) parsing סלחני (לחלץ את הבלוק בין הסוגריים הראשון לאחרון) — טלאי אחרון, לא תשתית. השתמש ב-(1) כברירת מחדל; (2) כשאין תמיכת כלים; (3) רק כרשת ביטחון."
        whenNotTo="אם הפלט הרצוי הוא ממילא טקסט חופשי לבן-אדם (תשובת צ'אט, סיכום לקריאה) — אל תכפה JSON. אכיפת מבנה על פלט שאף אחד לא מנתח תוכנתית היא overhead שמגביל את איכות הניסוח בלי תמורה."
        commonMistakes="לסמוך על ה-JSON של המודל בלי ולידציה; להתייחס לכישלון ולידציה כחריג נדיר במקום כחלק מהלולאה; לכפות JSON על פלט שממילא נועד לקריאה אנושית; לשכוח תקרת ניסיונות ל-retry — ולולאה שלא נעצרת מתייקרת."
        performance="אכיפת schema מקטינה דרמטית את שיעור ה-retries — וכל retry הוא קריאת API נוספת (טוקנים + latency). הבדל בין ~10% כישלונות ל-<1% הוא הבדל של אלפי קריאות מיותרות בקנה מידה. ולידציה עצמה זולה (מקומית, מיקרו-שניות)."
        cost="שים לב לעלות ה-retry: כל ניסיון תיקון שולח את כל ההקשר מחדש. תקרה של 2 ניסיונות היא איזון טוב — מעבר לזה, כישלון חוזר בדרך כלל מצביע על schema לא-ריאלי או קלט פגום, לא על מזל רע. עדיף להיכשל מהר ולדווח מלנסות 5 פעמים."
        security="כל שדה בפלט הוא קלט לא-אמין, גם כשהוא עבר את ה-schema. 'summary' יכול להכיל הזיה, 'email' יכול להיות מומצא, מחרוזת יכולה להכיל injection ל-DB במורד הזרם. ולידציית schema אוכפת צורה — אתה עדיין חייב לחטא ולאמת משמעות לפני שימוש."
        maintenance="ה-schema הוא נקודת התחזוקה המרכזית: כשהצורך משתנה, מעדכנים schema אחד — לא מחפשים ניסוחים פזורים בפרומפטים. הגדר אותו פעם אחת (למשל Zod schema) והשתמש בו גם לאכיפה מול המודל וגם לוולידציה בקוד — מקור אמת יחיד."
        realWorld="בדיוק ככה עובד ה-MCP server שבנית: כשהמודל קורא לכלי, ה-input_schema מכריח אותו למלא מבנה — קריאת כלי היא פלט מובנה שעבר אכיפה. אותו עיקרון מפעיל מחלצי-נתונים, מסווגים, ו-agents בכל מערכת production."
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
            <AlertTriangle size={16} /> מה שובר מערכות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>JSON.parse על פלט גולמי בלי טיפול — קורס ברגע שמגיע ”Sure! Here is:” או ```json fence.</li>
            <li>סומכים על הפלט אחרי parse מוצלח — לא מאמתים סוגים/טווחים, ו-enum מתמלא בערך לא-הגיוני.</li>
            <li>מתייחסים לכישלון ולידציה כתקלה נדירה — אין לולאת retry, קריאה בודדת שנכשלה מפילה משתמש.</li>
            <li>כופים JSON גם על פלט שנועד לקריאה אנושית — פוגעים באיכות בלי צרכן תוכנתי בכלל.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <CheckCircle2 size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>אוכפים מבנה דרך input_schema/response_format — לא מסתמכים על ניסוח בלבד.</li>
            <li>מגדירים schema אחד (Zod) ומשתמשים בו גם לאכיפה מול המודל וגם לוולידציה בקוד.</li>
            <li>בלולאה: ולידציה → אם נכשל, שולחים את השגיאה בחזרה למודל → retry עד תקרה (למשל 2).</li>
            <li>מחטאים כל ערך כקלט לא-אמין לפני שימוש — schema אוכף צורה, לא נכונות או בטיחות.</li>
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
        id="structured-outputs-json-mode-task"
        title="בנה מחלץ יציב: schema + ולידציה + retry, והוכח יציבות על הרבה קלטים"
        context="פתח את Claude Code בתיקייה חדשה. תבנה מחלץ שהופך הודעות לקוח חופשיות ל-JSON מובנה — ותוכיח שהוא לא נשבר על עשרות קלטים מבולגנים."
        steps={[
          "בקש מ-Claude Code ליצור schema (Zod או JSON-schema) להזמנה: product (מחרוזת), quantity (שלם ≥1), urgency (enum: low/medium/high). זה החוזה — מקור האמת היחיד.",
          "בנה קריאה ל-Claude API שאוכפת את ה-schema דרך input_schema של כלי (tool_use), כך שהמודל ממלא מבנה במקום לכתוב טקסט חופשי.",
          "הוסף שכבת ולידציה בקוד: הרץ safeParse על פלט המודל. אם נכשל — שלח בחזרה למודל את הודעת השגיאה המדויקת ובקש לתקן, עם תקרה של 2 ניסיונות.",
          "צור 20 הודעות קלט מגוונות ומבולגנות (חלקן דו-משמעיות, חלקן חסרות כמות, חלקן עם כמה מוצרים). הרץ את המחלץ על כולן.",
          "צעד דיבוג: בכוונה הסר את אכיפת ה-schema (חזור ל'תחזיר JSON' חופשי) והרץ שוב על אותם 20 קלטים. ספור כמה נשברו. אז החזר את האכיפה+ולידציה והשווה את שיעור הכישלון.",
        ]}
        successCriteria={[
          "כל 20 הקלטים מניבים אובייקט שעובר ולידציה מול ה-schema — או נכשלים בבירור אחרי retry, בלי לקרוס",
          "אתה יכול להצביע במספרים על ההבדל בשיעור הכישלון בין הגרסה החופשית לגרסה האכופה+מאומתת",
          "הקוד אף פעם לא צורך ערך לא-מאומת: כל פלט עובר safeParse לפני שהוא נכנס ללוגיקה",
          "לולאת ה-retry מוגבלת בתקרה ולא יכולה לרוץ אינסופית",
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
          ["פלט מובנה (Structured Output)", "פלט מהמודל במבנה מוגדר וניתן-לעיבוד תוכנתי (למשל JSON), להבדיל מטקסט חופשי."],
          ["Schema", "הגדרה פורמלית של מבנה הפלט: שדות, סוגים, מה חובה ואילו ערכים חוקיים. 'החוזה' של הנתון."],
          ["input_schema", "ה-JSON Schema של כלי; כשהמודל קורא לכלי הוא ממלא אותו — כך אוכפים מבנה."],
          ["ולידציה (Validation)", "בדיקה בקוד שהפלט תואם ל-schema (סוגים, טווחים, ערכים לוגיים) לפני שסומכים עליו."],
          ["Zod", "ספריית ולידציה ל-TypeScript; מגדירים schema פעם אחת ומאמתים מולו בזמן ריצה."],
          ["Retry-on-fail", "כשהוולידציה נכשלת — שולחים את השגיאה בחזרה למודל ומבקשים לתקן, עד תקרת ניסיונות."],
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
          <FileJson size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>המודל מייצר <strong>טקסט לפי הסתברות</strong>, לא נתונים — לכן 'תחזיר JSON' נכשל בזנב ההתפלגות.</li>
          <li>שתי שכבות, לא אחת: <strong>אכיפה</strong> (input_schema מבטיח מבנה) ו<strong>ולידציה</strong> (הקוד מבטיח משמעות).</li>
          <li>כישלון ולידציה הוא חלק מהלולאה: <strong>retry עם הודעת השגיאה</strong>, עם תקרת ניסיונות.</li>
          <li>קריאת כלי היא פלט מובנה שעבר אכיפה — <strong>אותו עיקרון</strong> שהפעיל את ה-MCP server שבנית.</li>
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
          קח את המחלץ שבנית והוסף שדה חדש ל-schema: notes (מחרוזת אופציונלית, עד 20 מילים). הרץ
          אותו על קלטים שבחלקם אין הערות בכלל, ובדוק: האם המודל ממציא notes כשאין מה למלא, או משאיר
          ריק? זה בדיוק המקום שבו ולידציית schema אוכפת מבנה אך לא נכונות — נסח חוק ולידציה שתופס
          notes שהומצא.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          עכשיו שאתה יודע להוציא נתונים מובנים ולאמת אותם — בשיעור הבא נחבר את זה למספר כלים בו-זמנית
          ולניהול שגיאות של כלים, ונראה איך agent שלם עובד כשכל צעד בו הוא פלט מובנה שעבר ולידציה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
