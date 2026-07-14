"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { AgentLoopVisualizer } from "@/components/diagrams/agent-loop-visualizer";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-agents",
  moduleSlug: "single-agent",
  lessonSlug: "agent-loop-anatomy",
  title: "אנטומיית לולאת Agent: Think-Act-Observe",
  objectives: [
    "להבין את ההבדל בין 'קריאת API בודדת' ל'סוכן' — לולאה איטרטיבית עם החלטות",
    'להכיר את שלבי הלולאה: תכנון (think), פעולה (act, בד"כ tool call), תצפית (observe)',
    "להבין מתי סוכן עוצר (הגיע למטרה, מיצה תקציב, נתקע)",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: AtlasDesk עונה מתוך בסיס הידע האמיתי שלו"],
};

const SLIDES: Slide[] = [
  {
    title: "מתי 'קריאת API' הופכת ל'סוכן'",
    bullets: [
      "כל התכונות שבנית עד עכשיו ב-AtlasDesk (chat, tool calling, RAG) הן קריאה אחת: שאלה נכנסת, אולי קריאת כלי אחת, תשובה יוצאת. זו לא 'לולאה'.",
      "סוכן (Agent) הוא מודל שרץ בלולאה: הוא מחליט בעצמו כמה סיבובים הוא צריך, ומתי הוא סיים — לא מוגבל לצעד אחד קבוע מראש.",
      "ההבדל הקריטי: ב-tool calling הקוד שלך מריץ round-trip אחד או שניים לפי תסריט קבוע (כמו שראית ב-tool-chat); בסוכן, *המודל עצמו* מחליט כמה סיבובים ומה לעשות בכל אחד.",
    ],
  },
  {
    title: "שלושת שלבי הלולאה",
    bullets: [
      "Think — המודל 'חושב בקול' (או פנימית) מה עוד צריך כדי להשלים את המשימה.",
      "Act — המודל מבצע פעולה: לרוב קריאת כלי (tool call), לפעמים כתיבת תשובת ביניים.",
      "Observe — התוצאה של הפעולה חוזרת למודל, שמעדכן את התמונה שלו ומחליט אם להמשיך או לעצור.",
    ],
  },
  {
    title: "מתי הלולאה עוצרת",
    bullets: [
      "השלמת מטרה — המודל אוסף מספיק מידע כדי לענות במלואה, ומחליט לסיים.",
      "מיצוי תקציב — הגעה למספר מקסימלי של סיבובים (בדיוק כמו הגבלת 4 הסיבובים ב-tool-chat) — הגנת production קריטית.",
      "תקיעות (stuck) — המודל חוזר על אותה פעולה שוב ושוב בלי התקדמות — סימן לבעיה שדורש התערבות (נלמד בשיעור הבא על מקרי כשל).",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל המרכזי בין tool calling רגיל (כמו ב-/api/ai/tool-chat) לבין 'agent' אמיתי?",
    options: [
      "אין הבדל, זה אותו דבר בשם אחר",
      "ב-tool calling הקוד שלך מריץ מספר מוגבל של round-trips לפי תסריט; בסוכן, המודל עצמו מחליט כמה סיבובים ומתי לעצור",
      "סוכן לא יכול להשתמש בכלים בכלל",
      "tool calling עובד רק עם מודלים ישנים",
    ],
    correctIndex: 1,
    explanation: "ה-tool-chat שבנית כבר מריץ 'מיני-לולאה' עם מגבלת 4 סיבובים — סוכן אמיתי לוקח את זה צעד קדימה: המודל עצמו מקבל את ההחלטה על מספר הסיבובים, לא רק אתה כמפתח שקבעת מספר מקסימלי מראש.",
    optionNotes: [
      "לא נכון: יש הבדל מהותי בשליטה — מי מחליט על מבנה הלולאה (המפתח מראש, או המודל בזמן אמת).",
      "התשובה הנכונה: זה בדיוק ההבדל — tool calling רגיל הוא לולאה מוגבלת מראש בקוד; agent הוא לולאה שהמודל 'נוהג' בה בעצמו.",
      "לא נכון: סוכנים משתמשים בכלים באופן נרחב — זו בדיוק אחת היכולות המרכזיות שלהם.",
      "לא נכון: אין קשר לגרסת המודל — ההבדל הוא ארכיטקטוני (מבנה הקוד), לא יכולת המודל.",
    ],
  },
  {
    id: "q2",
    question: "מה אחד הסיכונים המרכזיים שדורש 'מיצוי תקציב' (מגבלת סיבובים מקסימלית) בכל סוכן production?",
    options: [
      "אין סיכון אמיתי, זו רק המלצה תיאורטית",
      "בלי מגבלה, סוכן שנתקע בלולאה (חוזר על אותה פעולה בלי התקדמות) יכול לרוץ לנצח ולצבור עלות API בלתי מוגבלת",
      "המגבלה קיימת רק כדי לחסוך זמן פיתוח",
      "מגבלת סיבובים דורשת ממודל מיוחד שתומך בזה",
    ],
    correctIndex: 1,
    explanation: "זו בדיוק הסיבה שגם ב-/api/ai/tool-chat כבר הגבלת 4 סיבובים — בלי הגנה כזו, כשל בלולאה (המודל 'תקוע') עלול לרוץ ללא סוף ולצבור עלות API אמיתית ובלתי צפויה.",
    optionNotes: [
      "לא נכון: זה סיכון production אמיתי וממשי — עלות כספית בלתי צפויה, לא רק תיאוריה.",
      "התשובה הנכונה: זו הגנת עלות/יציבות חיונית — בדיוק כמו ה-`for (let round = 0; round < 4; round++)` שכבר ראית בקוד.",
      "לא נכון: המגבלה קיימת בעיקר כהגנת production (עלות/יציבות), לא רק לחיסכון זמן פיתוח.",
      "לא נכון: זו הגבלה ברמת הקוד שלך (לולאת for רגילה) — לא תלויה ביכולת מיוחדת של המודל.",
    ],
  },
  {
    id: "q3",
    question: "בשלב ה-Observe, תוצאת הכלי חוזרת למודל כהודעת tool_result. מה קורה אם אתה מחזיר למודל הודעת שגיאה גולמית (stack trace) במקום הודעה נקייה?",
    options: [
      "המודל תמיד מתעלם משגיאות וממשיך כרגיל",
      "המודל 'רואה' את השגיאה כחלק מההקשר ועלול להסיק ממנה מסקנה שגויה, לחזור על אותה קריאה, או לחשוף פרטים פנימיים בתשובה למשתמש",
      "השגיאה נחסמת אוטומטית על ידי ה-API של המודל",
      "אין שום השפעה — tool_result הוא תמיד פנימי ולא נראה למודל",
    ],
    correctIndex: 1,
    explanation:
      "מה שחוזר ב-Observe הופך לחלק מההקשר של הצעד הבא. stack trace גולמי הוא גם רועש (מבזבז טוקנים), גם עלול לגרום למודל לחזור על אותה פעולה כושלת, וגם סיכון דליפת מידע פנימי אם הוא זולג לתשובה. מקצוענים ממפים שגיאות להודעה קצרה ופעולתית ('הכלי נכשל: מזהה לא נמצא — בקש מזהה תקין').",
    optionNotes: [
      "לא נכון: המודל דווקא מתייחס לתוכן ה-tool_result — הוא לא 'מתעלם' ממנו.",
      "התשובה הנכונה: תוכן ה-Observe מזין ישירות את ה-Think הבא; שגיאה גולמית מזהמת את ההחלטה ואף עלולה לזלוג למשתמש.",
      "לא נכון: אין חסימה אוטומטית — אתה כמפתח אחראי לנקות ולעצב מה שחוזר.",
      "לא נכון: tool_result כן נשלח חזרה למודל וכן משפיע — זו כל מהות שלב ה-Observe.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: מ-tool calling ל-agent אמיתי", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "visualizer",
    label: "Agent Loop Visualizer — עקוב אחרי סוכן פותר משימה דו-שלבית",
    content: <AgentLoopVisualizer />,
  },
  {
    id: "comparison",
    label: "השוואה: מגבלת סיבובים חכמה מול נאיבית",
    content: (
      <PromptComparisonLab
        title="עיצוב מגבלת הסיבובים בלולאת סוכן"
        unitLabel="גישה"
        bad={{
          label: "בלי מגבלה בכלל",
          content: `while (true) {
  const response = await callModel(...)
  if (response.stop_reason !== "tool_use") break
  // ...מבצע כלי וממשיך ללא הגבלה
}`,
          outcome: "אם המודל 'נתקע' (מבקש שוב ושוב את אותו כלי בלי להתקדם), הלולאה רצה לנצח — עלות API בלתי מוגבלת, ואולי גם timeout בשרת.",
        }}
        good={{
          label: "מגבלה מפורשת + זיהוי תקיעות",
          content: `const MAX_ROUNDS = 4
for (let round = 0; round < MAX_ROUNDS; round++) {
  const response = await callModel(...)
  if (response.stop_reason !== "tool_use") break
  // ...מבצע כלי
}
// אחרי הלולאה: אם עדיין לא סיימנו — תשובת "נעצר ליתר ביטחון"`,
          outcome: "בדיוק התבנית שכבר קיימת ב-/api/ai/tool-chat — מגבלה קשיחה + תשובת fallback ברורה כשהמגבלה מגיעה, במקום קריסה שקטה או ריצה אינסופית.",
        }}
        takeaway="מגבלת סיבובים היא לא 'תוספת יפה' — היא תנאי סף לכל סוכן שרץ ב-production. בלעדיה, כל באג בלוגיקת העצירה של הסוכן הופך מיד לבעיית עלות/יציבות אמיתית."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="לולאת Think-Act-Observe קיימת כי משימות אמיתיות דורשות מספר לא-ידוע-מראש של צעדים — אי אפשר לכתוב מראש 'תמיד תריץ בדיוק 2 כלים', כי לפעמים צריך 1 ולפעמים 5."
        alternatives="חלופה: workflow קבוע מראש (pipeline דטרמיניסטי, כמו RAG שבנית) — פשוט יותר, צפוי יותר, אבל לא מתמודד עם משימות שדורשות החלטה דינמית על הצעדים."
        whenNotTo="אם המשימה תמיד דורשת בדיוק אותו רצף צעדים (כמו RAG: retrieve→augment→generate, תמיד באותו סדר) — אין צורך בסוכן; pipeline קבוע פשוט וזול יותר."
        commonMistakes="לבנות סוכן 'כי זה מגניב' למשימה שבאמת הייתה pipeline קבוע — סוכן מוסיף מורכבות (ניהול לולאה, הגנות, ניטור) שלא מוצדקת אם הרצף תמיד זהה."
        cost="כל סיבוב בלולאה הוא קריאת API נוספת — סוכן שדורש 5 סיבובים עולה פי 5 מקריאה בודדת. זו הסיבה שמגבלת סיבובים היא גם הגנת עלות, לא רק הגנת יציבות. כל ההקשר (כל הצעדים הקודמים) נשלח מחדש בכל סיבוב, כך שהעלות של הסיבוב החמישי גבוהה מזו של הראשון — הצמיחה כמעט ריבועית, לא ליניארית."
        security="שלב ה-Act הוא שבו הסוכן קורא לכלים — כאן חייבים גבולות: כלי write/מחיקה צריכים אישור אנושי (human-in-the-loop), פרמטרים שהמודל בונה חייבים ולידציה לפני ביצוע (המודל עלול להזות ארגומנטים), וה-tool_result שחוזר ב-Observe לא צריך לכלול סודות/מפתחות. אל תסמוך על 'המודל לא יקרא לכלי מסוכן' — אכוף זאת בקוד."
        maintenance="הלולאה חייבת להיות observable: לוג של כל סיבוב (מה ה-Think, איזה כלי, אילו פרמטרים, מה חזר) — בלי זה, דיבוג של 'למה הסוכן עשה X' הופך לניחוש. תעד את סיבת העצירה (מטרה/תקציב/תקיעות) בכל ריצה — זה מה שמאפשר לתחזק ולשפר את הסוכן לאורך זמן."
        realWorld="בפרויקט המודול תבנה בדיוק את זה: סוכן ב-AtlasDesk שמחליט בעצמו כמה כלים להפעיל (לא כמו tool-chat הנוכחי, שרץ עד 4 סיבובים בלי 'להבין' אם זה נחוץ)."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות פרודקשן נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר סוכנים בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>לולאה בלי מגבלת סיבובים — סוכן תקוע רץ עד timeout וצובר עלות API בלתי מוגבלת.</li>
            <li>מחזירים ב-Observe שגיאה גולמית (stack trace) — המודל חוזר על אותה קריאה כושלת שוב ושוב.</li>
            <li>סומכים על המודל שיפסיק לבד — בלי תנאי עצירה מפורש בקוד, סוכן עלול ”לחשוב” שהוא עדיין לא סיים.</li>
            <li>אין לוג של הסיבובים — כשמשהו משתבש אי אפשר לשחזר איזה כלי נקרא עם אילו פרמטרים.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מגבלת סיבובים קשיחה (MAX_ROUNDS) + תשובת fallback ברורה כשהמגבלה מגיעה.</li>
            <li>ממפים שגיאות כלי להודעה קצרה ופעולתית לפני שהן חוזרות למודל.</li>
            <li>מזהים תקיעות (אותה קריאה פעמיים ברצף) ועוצרים ל-human-in-the-loop.</li>
            <li>מלוגגים כל סיבוב + סיבת העצירה — הלולאה observable מהיום הראשון.</li>
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
          ["Agent Loop", "לולאת Think-Act-Observe שבה המודל מחליט בעצמו על מספר הסיבובים."],
          ["Think", "שלב שבו המודל מתכנן מה הצעד הבא הדרוש."],
          ["Act", "שלב ביצוע הפעולה — בדרך כלל קריאת כלי."],
          ["Observe", "שלב קליטת התוצאה ועדכון התכנית."],
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
        id="single-agent-agent-loop-anatomy"
        title="נתח את לולאת ה-tool-chat הקיימת של AtlasDesk כ'סוכן חלקי'"
        context="עבוד מול app/api/ai/tool-chat/route.ts — הקוד הזה כבר מכיל לולאה, אבל היא לא 'סוכן מלא' עדיין."
        steps={[
          "קרא עם Claude Code את הלולאה ב-tool-chat/route.ts, וזהה: איפה ה-Think? איפה ה-Act? איפה ה-Observe?",
          "שאל את Claude Code: מה חסר כאן כדי שזה יהיה 'סוכן' לפי ההגדרה בשיעור (לא רק tool calling עם מגבלת סיבובים)?",
          "דון עם הסוכן: האם משימה כמו 'מה הסטטוס של AD-1042 וגם מה מחיר Enterprise' תעבוד נכון עם הקוד הקיים? למה כן/לא?",
          "דיבוג: בקש מ-Claude Code להוריד זמנית את מגבלת הסיבובים ולהזין קלט שהמודל 'לא יודע' לענות עליו (פנייה שלא קיימת). הרץ, צפה בלולאה חוזרת על עצמה, והחזר את המגבלה — הסבר בדיוק איזה שורה בקוד מנעה ריצה אינסופית.",
        ]}
        successCriteria={[
          "אתה יודע להצביע בקוד הקיים על כל אחד משלושת שלבי הלולאה",
          "אתה מבין מה ההבדל בין 'tool calling עם לולאה' לבין 'agent' אמיתי, לא רק באופן תיאורטי",
          "ראית בעיניך מה קורה בלי מגבלת סיבובים, ואתה יודע להצביע על השורה שמגינה מפני זה",
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
          חשוב על משימה יומיומית שלך (לא קשורה לתכנות) שדורשת מספר לא-ידוע-מראש של צעדים
          (למשל: לתכנן מסלול נסיעה עם כמה עצירות). פרק אותה בכתב לשלבי Think/Act/Observe —
          זו בדיוק הצורה שסוכן AI היה ניגש למשימה הזו.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
