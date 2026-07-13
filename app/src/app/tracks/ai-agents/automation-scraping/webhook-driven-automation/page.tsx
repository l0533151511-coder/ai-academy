"use client";

import { Radio, ShieldCheck, Copy, Zap, CheckCircle2, Layers } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-agents",
  moduleSlug: "automation-scraping",
  lessonSlug: "webhook-driven-automation",
  title: "אוטומציה מונעת-Webhooks",
  objectives: [
    "להבין webhooks כאירועים שמערכת חיצונית 'דוחפת' אליך — ולמה זה מתרחב טוב יותר מ-polling",
    "להכיר את עקרון ה-idempotency — טיפול בטוח באירועים כפולים",
    "לתכנן אבטחת webhook (אימות חתימת HMAC — לא לסמוך על תוכן בלבד)",
    "להבין למה handler חייב להחזיר 200 מהר ולעבד אסינכרונית, אחרת הספק מציף אותך ב-retries",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["responsible-scraping-principles"],
};

const SLIDES: Slide[] = [
  {
    title: "מה זה webhook — ולמה לא polling",
    bullets: [
      "webhook הוא בקשת HTTP שמערכת חיצונית שולחת אליך אוטומטית כשמשהו קורה אצלה ('פנייה חדשה נוצרה', 'תשלום בוצע'). זה ההפך מ-polling (לשאול שוב ושוב 'יש חדש?') — המערכת החיצונית 'דוחפת' אליך את המידע ברגע שהוא קורה.",
      "polling מבזבז: רוב הבקשות חוזרות עם 'אין חדש', ובכל זאת עולות קריאות ומוסיפות עיכוב בין קרות האירוע לזיהוי שלו. webhook מגיע רק כשיש משהו — אפס בקשות סרק, אפס עיכוב.",
      "ככל שיש יותר מקורות ויותר לקוחות, polling גדל ריבועית ('כולם שואלים את כולם כל הזמן'); webhooks נשארים ביחס ישר למספר האירועים האמיתי — ולכן מתרחבים טוב יותר.",
    ],
  },
  {
    title: "ארבעת עמודי ה-production של webhook",
    bullets: [
      "אימות חתימה (HMAC) — כדי שתסמוך שהשולח אמיתי ולא מתחזה.",
      "Idempotency — אותו אירוע עלול להגיע פעמיים; dedupe לפי event ID כדי לא לעבד כפול.",
      "החזרת 200 מהר + עיבוד אסינכרוני — קבל, אשר, ותעבד ברקע; אל תחזיק את הספק ממתין.",
      "Retry ו-timeout — ההנחה היא שהספק ינסה שוב אם לא ענית מהר; תכנן לכך, אל תיאבק בזה.",
    ],
  },
  {
    title: "Idempotency — הגנה מפני אירועים כפולים",
    bullets: [
      "מערכות webhook לפעמים שולחות את אותו אירוע פעמיים (בעיית רשת, retry אוטומטי, timeout שגוי). קוד idempotent מטפל בזה נכון — עיבוד כפול לא גורם לתוצאה כפולה (למשל: לא שולח שתי תשובות אוטומטיות לאותה פנייה, לא מחייב פעמיים).",
      "פתרון נפוץ: לשמור event ID שכבר טופל, ולבדוק לפני עיבוד אם הוא כבר קיים — ואם כן, להחזיר 200 בלי לעבד שוב.",
    ],
  },
  {
    title: "אבטחת webhook",
    bullets: [
      "לעולם לא לסמוך על תוכן הבקשה בלבד — כל אחד יכול לשלוח POST ל-endpoint הפומבי שלך ולהתחזות ל'אירוע אמיתי'.",
      "אימות מקור נפוץ: חתימה קריפטוגרפית (HMAC) שהשולח מחשב מעל גוף הבקשה עם סוד משותף, ומצרף בכותרת. אתה מחשב מחדש ומשווה — אם לא תואם, דוחה מיד (401).",
    ],
  },
];

const FLOW_STEPS: DiagramStep[] = [
  {
    icon: Radio,
    label: "אירוע נשלח",
    detail: "המערכת החיצונית (Stripe, GitHub, מערכת טיקטים) מזהה שקרה משהו ושולחת POST ל-endpoint שלך עם payload + חתימה בכותרת.",
  },
  {
    icon: ShieldCheck,
    label: "אימות חתימה",
    detail: "אתה מחשב HMAC מעל גוף הבקשה עם הסוד המשותף ומשווה לחתימה שהגיעה. לא תואם? דחה מיד (401) — זה מתחזה.",
  },
  {
    icon: Copy,
    label: "בדיקת כפילות",
    detail: "בדוק אם ה-eventId כבר טופל. אם כן — החזר 200 בלי לעבד שוב (idempotency). כך retry של הספק לא יוצר תוצאה כפולה.",
  },
  {
    icon: Zap,
    label: "החזר 200 מהר",
    detail: "אשר קבלה מיד ותעבד ברקע (queue/async). handler איטי גורם ל-timeout אצל הספק, והוא ישלח שוב — ואז שוב.",
  },
  {
    icon: CheckCircle2,
    label: "עיבוד ורישום",
    detail: "העבודה עצמה (RAG, שליחת תשובה) רצה ברקע; בסוף מסמנים את ה-eventId כ'טופל' כדי לחסום עיבוד חוזר.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה חשוב לטפל ב-idempotency בעיבוד webhooks?",
    options: [
      "זה לא באמת חשוב, webhooks תמיד מגיעים בדיוק פעם אחת",
      "כי מערכות webhook עלולות לשלוח את אותו אירוע פעמיים (retry ברשת) — בלי idempotency זה עלול לגרום לפעולה כפולה (כמו שתי תשובות אוטומטיות או חיוב כפול)",
      "כי HTTP דורש את זה מבחינה טכנית",
      "רק כדי לחסוך רוחב פס",
    ],
    correctIndex: 1,
    explanation:
      "webhooks יכולים להישלח יותר מפעם אחת עקב retry logic של השולח (ובמיוחד כשה-handler שלך היה איטי וגרם ל-timeout). idempotency — dedupe לפי event ID — מוודאת שזה לא גורם לתוצאה כפולה בפועל, כמו חיוב כפול או תשובה כפולה ללקוח.",
    optionNotes: [
      "שגוי: אירועים כפולים הם תרחיש נפוץ ולגיטימי (retry ברשת, timeout) — לא נדיר כלל.",
      "נכון: זה בדיוק התרחיש ש-idempotency מגן מפניו — עיבוד בטוח גם כשאירוע מגיע יותר מפעם אחת.",
      "שגוי: HTTP עצמו לא אוכף idempotency בעיבוד — זו בחירת עיצוב של הקוד שלך.",
      "שגוי: idempotency קשור לנכונות התוצאה, לא לחיסכון ברוחב פס.",
    ],
  },
  {
    id: "q2",
    question: "למה מסוכן לסמוך רק על תוכן הבקשה כדי לאמת שwebhook הגיע ממקור אמיתי?",
    options: [
      "אין סיכון, endpoint webhook הוא תמיד פרטי",
      "כי endpoint webhook הוא לרוב כתובת פומבית — כל אחד יכול לשלוח POST מזויף שנראה כמו אירוע אמיתי; בלי אימות (חתימת HMAC) אין דרך להבחין",
      "כי Vercel חוסם אוטומטית בקשות מזויפות",
      "זו בעיה רק אם ה-endpoint לא משתמש ב-HTTPS",
    ],
    correctIndex: 1,
    explanation:
      "כל endpoint webhook פומבי חשוף לבקשות מזויפות. רק אימות קריפטוגרפי (חתימת HMAC שחושבה עם סוד משותף) מבטיח שהבקשה אכן מגיעה מהמקור הצפוי — כי רק מי שמחזיק בסוד יכול לייצר חתימה תקינה.",
    optionNotes: [
      "שגוי: endpoint webhook הוא לרוב כתובת ציבורית — לא פרטי.",
      "נכון: בלי אימות, אין דרך להבחין בין אירוע אמיתי לבקשה מזויפת שמישהו שלח בכוונה.",
      "שגוי: פלטפורמת אירוח לא חוסמת אוטומטית בקשות שנראות תקינות טכנית — האימות באחריות הקוד שלך.",
      "שגוי: HTTPS מצפין את התעבורה אבל לא מוודא מי השולח — עדיין צריך אימות חתימה נפרד.",
    ],
  },
  {
    id: "q3",
    question: "ה-handler שלך מריץ עיבוד RAG כבד (5 שניות) לפני שהוא מחזיר 200. הספק מגדיר timeout של 3 שניות. מה יקרה?",
    options: [
      "כלום — הספק פשוט ימתין עד שתסיים",
      "הספק יראה timeout, יניח שנכשלת, וישלח את אותו אירוע שוב — ושוב יעבור ה-timeout, ותיווצר סופת retries שמעמיסה עליך",
      "הבקשה תיכשל לצמיתות ולא תגיע יותר",
      "העיבוד יעבור אוטומטית לרקע בלי לגעת בקוד",
    ],
    correctIndex: 1,
    explanation:
      "הדפוס הנכון הוא: אמת חתימה, בדוק כפילות, החזר 200 מיד, ותעבד ברקע (queue/async). handler שחוסם על עבודה כבדה חורג מה-timeout, הספק חושב שנכשלת ושולח שוב — וכל retry נכשל שוב, עד סופת retries. זו סיבה שכיחה לקריסת endpoints תחת עומס.",
    optionNotes: [
      "שגוי: הספק לא ממתין ללא-גבול — יש לו timeout, וחריגה ממנו נחשבת ככישלון.",
      "נכון: timeout ⟵ retry ⟵ timeout שוב = סופת retries. מונעים אותה בהחזרת 200 מהיר + עיבוד אסינכרוני.",
      "שגוי: רוב הספקים דווקא ינסו שוב (עם backoff), לא יוותרו לצמיתות.",
      "שגוי: עיבוד אסינכרוני לא קורה מעצמו — צריך לתכנן queue/async במפורש.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: webhooks כאוטומציה מונעת-אירועים", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "זרימת webhook תקין — חמישה שלבים",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          כך נראה handler ל-webhook שבנוי נכון. הסדר קריטי: אימות לפני עיבוד, בדיקת כפילות לפני עבודה,
          ו-200 מהיר לפני העבודה הכבדה. עבור על השלבים:
        </p>
        <StepDiagram steps={FLOW_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: טיפול webhook נאיבי מול בטוח",
    content: (
      <PromptComparisonLab
        title="קבלת webhook 'פנייה חדשה נוצרה'"
        unitLabel="גישה"
        bad={{
          label: "טיפול נאיבי",
          content: `app.post('/webhook', async (req, res) => {
  await sendAutoResponse(req.body.ticketId) // בלי אימות מקור,
  res.send('ok')                            // בלי בדיקת כפילות,
})                                          // ועבודה כבדה לפני התגובה`,
          outcome:
            "כל אחד יכול לשלוח בקשות מזויפות שיגרמו לתשובות אוטומטיות שגויות. אם הספק שולח את אותו אירוע פעמיים — נשלחות שתי תשובות זהות ללקוח. והעבודה הכבדה לפני התגובה גורמת ל-timeout וסופת retries.",
        }}
        good={{
          label: "אימות + idempotency + 200 מהיר",
          content: `app.post('/webhook', (req, res) => {
  if (!verifySignature(req)) return res.status(401).end() // אימות
  if (alreadyProcessed(req.body.eventId))
    return res.send('ok')            // idempotency: כבר טופל
  res.send('ok')                     // 200 מהיר — לפני העבודה
  enqueue(() => {                    // עיבוד אסינכרוני ברקע
    sendAutoResponse(req.body.ticketId)
    markProcessed(req.body.eventId)
  })
})`,
          outcome:
            "רק אירועים אמיתיים ומאומתים מעובדים; כל אירוע מטופל בדיוק פעם אחת גם אם הגיע כמה פעמים; והספק מקבל 200 מיד — בלי timeout ובלי סופת retries. העבודה הכבדה רצה ברקע.",
        }}
        takeaway="ארבע הגנות בסיסיות — אימות מקור, idempotency, 200 מהיר ועיבוד אסינכרוני — הופכות webhook endpoint מ'פרצה פוטנציאלית ומקור לסופת retries' למנגנון אוטומציה אמין."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="webhooks קיימים כי הם יעילים בהרבה מ-polling — במקום לשאול 'יש חדש?' כל דקה (ולקבל 'לא' ברוב המקרים), המערכת החיצונית מודיעה לך ברגע שיש משהו. אפס בקשות סרק, אפס עיכוב."
        alternatives="Polling (לשאול שוב ושוב) — פשוט יותר למימוש וטוב לתרחישים פשוטים, אבל מבזבז משאבים, מוסיף עיכוב, ומתרחב גרוע. SSE/WebSocket — לזרם אירועים דו-כיווני בזמן אמת, כשצריך חיבור מתמיד ולא רק push בודד."
        whenNotTo="אם המערכת החיצונית לא תומכת ב-webhooks בכלל — אז polling הוא האפשרות היחידה. גם כשקצב האירועים נמוך מאוד ותשתית קבלה תמידית היא מעל לצורך, polling תקופתי פשוט יותר לתחזוקה."
        commonMistakes="endpoint בלי אימות מקור (פרצה נפוצה); בלי idempotency (חיוב/תשובה כפולים); handler איטי שחורג מה-timeout ומצית סופת retries; החזרת 500 על אירוע שאתה לא מזהה במקום 200 — מה שגורם לספק לנסות שוב לנצח."
        performance="עיבוד אסינכרוני הוא לא מותרות — הוא תנאי. handler שמחזיר 200 תוך מילישניות ומעביר עבודה ל-queue שורד עומס; handler שחוסם על RAG/DB לכל אירוע קורס תחת פרץ אירועים. ה-p99 latency של ה-handler הוא המדד לנטר."
        cost="webhooks חוסכים משאבים לעומת polling (אין בקשות סרק) — אבל דורשים תשתית קבלה (endpoint שרץ תמיד), queue לעיבוד, ולוגיקת אבטחה/idempotency. זו עלות קבועה שמשתלמת ככל שנפח האירועים גדל."
        security="ה-endpoint פומבי ולכן תוקף. חובה: אימות חתימת HMAC (comparison בזמן-קבוע כדי למנוע timing attacks), דחיית בקשות ישנות (חותמת זמן + חלון קצר) כדי למנוע replay, וטיפול בסוד המשותף כמו בסיסמה (secret store, לא בקוד)."
        maintenance="webhook שנכשל בשקט הוא סיוט — האירוע פשוט 'לא מגיע' ואף אחד לא שם לב. מקצוענים מנטרים שיעור אימות-נכשל, אורך תור, ואירועים שלא הושלמו; ומחזיקים dead-letter queue לאירועים שנכשלו כדי לעבד אותם מחדש ידנית."
        realWorld="Stripe, GitHub ו-Slack כולם עובדים בדיוק כך: חתימת HMAC בכותרת, event ID לצורך dedupe, ודרישה מפורשת להחזיר 2xx מהר. בפרויקט המודול הבא תממש endpoint כזה ל-AtlasDesk — קבלת אירוע 'פנייה חדשה' וייצור תשובה אוטומטית מה-RAG הקיים."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר בפרודקשן מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>אין אימות חתימה — כל אחד יכול לזייף &quot;אירועים&quot; ולהפעיל את הלוגיקה שלך.</li>
            <li>אין idempotency — אירוע שהגיע פעמיים גורם לחיוב כפול או לשתי תשובות ללקוח.</li>
            <li>handler איטי שמעבד לפני שהוא מחזיר 200 — timeout אצל הספק, ואז סופת retries.</li>
            <li>מחזירים 500 על אירוע לא-מוכר — הספק מנסה שוב לנצח, והתור נסתם.</li>
            <li>webhook נכשל בשקט ואף אחד לא מנטר — אירועים פשוט &quot;נעלמים&quot;.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מאמתים חתימת HMAC בזמן-קבוע לפני כל עיבוד; לא תואם ⟵ 401 מיד.</li>
            <li>dedupe לפי event ID מול DB מתמשך — לא Set in-memory שנעלם ב-restart.</li>
            <li>מחזירים 200 תוך מילישניות ומעבירים את העבודה הכבדה ל-queue/רקע.</li>
            <li>מחזירים 200 גם על אירוע לא-מוכר (מתעדים אותו), כדי לא לעורר retries.</li>
            <li>מנטרים שיעור-כישלון + אורך-תור, ומחזיקים dead-letter queue לעיבוד חוזר.</li>
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
        id="automation-webhook-driven-automation"
        title="תכנן endpoint webhook מאובטח, אידמפוטנטי ומהיר-תגובה"
        context="עבוד עם Claude Code — תכנון וטיוטת קוד; המימוש המלא בפרויקט הבא."
        steps={[
          "בקש מ-Claude Code להציע מבנה payload ל-webhook 'פנייה חדשה נוצרה' (השדות: eventId, ticketId, content, timestamp).",
          "תכנן את אימות ה-HMAC: איך השולח מחשב חתימה, איפה הסוד המשותף נשמר, ואיך אתה מחשב מחדש ומשווה בזמן-קבוע.",
          "תכנן idempotency: איפה תשמור event IDs שכבר טופלו (ולמה DB ולא Set in-memory), ומה תחזיר על כפילות.",
          "תכנן את סדר ה-handler: אימות ⟵ בדיקת כפילות ⟵ 200 מהיר ⟵ עיבוד אסינכרוני ברקע.",
          "צעד דיבוג: הספק מדווח שהוא שולח את אותו אירוע שוב ושוב. נסח כיצד תאבחן — האם זה timeout (handler איטי) או תגובת-שגיאה שלך? ואיך תתקן כל אחד מהם.",
        ]}
        successCriteria={[
          "יש לך מבנה payload ברור עם eventId ו-timestamp",
          "יש לך תוכנית קונקרטית לאימות HMAC ול-idempotency מול DB — לא רק רעיון כללי",
          "ה-handler מחזיר 200 מהר ומעבד אסינכרונית, ואתה יודע לאבחן סופת retries",
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
          ["Webhook", "בקשת HTTP שמערכת חיצונית שולחת אליך אוטומטית כשאירוע קורה אצלה ('push')."],
          ["Polling", "לשאול מקור שוב ושוב 'יש חדש?'. פשוט אך מבזבז ומוסיף עיכוב; ההפך מ-webhook."],
          ["Idempotency", "תכונה שבה עיבוד אותו אירוע כמה פעמים מניב תוצאה זהה לעיבוד יחיד."],
          ["HMAC", "חתימה קריפטוגרפית מעל גוף הבקשה עם סוד משותף; מוכיחה שהשולח אמיתי."],
          ["Event ID", "מזהה ייחודי לאירוע; משמש ל-dedupe כדי לזהות כפילות."],
          ["Retry storm", "סופת ניסיונות חוזרים כשה-handler איטי/כושל — הספק שולח שוב ושוב."],
          ["Async processing", "החזרת 200 מיד ועיבוד העבודה הכבדה ברקע (queue), לא בתוך ה-handler."],
          ["Dead-letter queue", "תור לאירועים שנכשלו בעיבוד, לצורך אבחון ועיבוד חוזר ידני."],
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
          <li>webhook <strong>דוחף</strong> אירוע ברגע שהוא קורה; polling <strong>מושך</strong> שוב ושוב. push מתרחב טוב יותר.</li>
          <li>ארבעה עמודים: <strong>אימות HMAC · idempotency · 200 מהיר · עיבוד אסינכרוני</strong>.</li>
          <li>הכשלים הקלאסיים: בלי חתימה = <strong>ניתן-לזיוף</strong>; בלי idempotency = <strong>חיוב כפול</strong>; handler איטי = <strong>סופת retries</strong>.</li>
          <li>נטר: שיעור אימות-נכשל, אורך תור, ואירועים שלא הושלמו — webhook נכשל <strong>בשקט</strong>.</li>
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
          חפש שירות שאתה מכיר שמשתמש ב-webhooks (Stripe, GitHub, Slack) וקרא בקצרה איך הוא
          מממש אימות חתימה ואיזה event ID הוא שולח. השווה לתוכנית שהצעת בעצמך — מה הם עושים שלא חשבת עליו?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          עכשיו שאתה מבין אימות, idempotency ועיבוד אסינכרוני — בפרויקט המודול תממש בדיוק endpoint כזה
          ל-AtlasDesk, שמקבל אירוע &apos;פנייה חדשה&apos; ומייצר טיוטת תשובה אוטומטית מה-RAG הקיים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
