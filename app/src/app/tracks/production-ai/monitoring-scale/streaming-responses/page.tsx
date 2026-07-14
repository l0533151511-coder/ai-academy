"use client";

import { Radio, Cpu, Split, MonitorPlay, Timer, AlertTriangle, Ban, ShieldAlert, XCircle, Braces } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "monitoring-scale",
  lessonSlug: "streaming-responses",
  title: "תגובות בזרימה (Streaming)",
  objectives: [
    "להבין מהו streaming — מסירת התשובה טוקן-אחר-טוקן בזמן שהיא נוצרת — ולמה time-to-first-token שולט בחוויית המשתמש",
    "להכיר את המנגנון מקצה-לקצה: השרת שולח chunks ב-SSE, הלקוח מוסיף ומרנדר בהדרגה, כולל flush ו-backpressure",
    "לדעת מתי לא לזרום — כשצריך פלט שלם כדי לוודא/לפרסר JSON לפני פעולה — ואיך לטפל בניתוק ובביטול באמצע הזרם",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["caching-strategies-for-ai"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: המשתמש בוהה במסך ריק 8 שניות",
    bullets: [
      "מודל שמייצר תשובה ארוכה יכול לקחת כמה שניות עד שהיא מוכנה. בגישה הרגילה — request/response — המשתמש רואה מסך ריק או ספינר עד שהתשובה כולה חוזרת בבת אחת.",
      "streaming = למסור את התשובה טוקן-אחר-טוקן, ברגע שכל חלק נוצר, במקום להמתין לסיום המלא. המשתמש רואה מילים מופיעות תוך פחות משנייה.",
      "השאלה ההנדסית אינה ’כמה זמן לוקח לייצר את כל התשובה’ אלא ’תוך כמה זמן המשתמש רואה את הטוקן הראשון’ — וזה משנה את כל תחושת המערכת.",
    ],
  },
  {
    title: "למה זה עובד: latency נתפס מול latency בפועל",
    bullets: [
      "הזמן הכולל לייצר תשובה כמעט זהה עם streaming ובלעדיו — המודל עדיין מייצר את אותם טוקנים באותו קצב.",
      "מה שמשתנה הוא ה-latency הנתפס: time-to-first-token (TTFT) יורד מ’כל התשובה’ ל’הטוקן הראשון’. המוח קורא את הטקסט תוך כדי שהוא זורם, אז ההמתנה מרגישה קצרה בהרבה.",
      "זו הסיבה שכל ממשק צ’אט מודרני (Claude, ChatGPT וכולם) זורם: לא כדי לסיים מהר יותר, אלא כדי *להרגיש* מהיר יותר — וזה מה שקובע אם המשתמש נשאר.",
    ],
  },
  {
    title: "המחיר: פלט חלקי הוא פלט שאי אפשר תמיד לסמוך עליו",
    bullets: [
      "אם אתה זורם, בכל רגע נתון יש לך רק חלק מהתשובה. זה מצוין להצגה — אבל בעייתי אם אתה צריך לפרסר את הפלט (JSON, קריאת כלי) לפני שאתה פועל עליו.",
      "הזרם יכול גם להיקטע באמצע: החיבור נופל אחרי חצי תשובה. אתה חייב לטפל בתשובה חצי-גמורה במקום להניח שהיא תמיד שלמה.",
      "והמשתמש יכול לעצור באמצע — ואז אתה רוצה לבטל את הבקשה כדי לא לשלם על טוקנים שאיש לא יקרא. streaming פותח UX מעולה אבל דורש טיפול קפדני בקצוות.",
    ],
  },
];

const FLOW_STEPS: DiagramStep[] = [
  {
    icon: Cpu,
    label: "Generate",
    detail: "המודל מייצר את התשובה טוקן-אחר-טוקן. במקום להמתין לסיום, ה-API של Claude מחזיר אירועי stream ברגע שכל טוקן מוכן — עם הדגל stream=true.",
  },
  {
    icon: Split,
    label: "Chunk",
    detail: "כל טוקן (או קבוצת טוקנים) נארז כ-chunk קטן. השרת שלך לא צובר את כולם — הוא מעביר כל chunk הלאה מיד, כדי לא לאבד את יתרון ה-TTFT.",
  },
  {
    icon: Radio,
    label: "SSE / stream",
    detail: "השרת שומר את החיבור פתוח ושולח כל chunk כאירוע Server-Sent Events (text/event-stream), עם flush מפורש כדי שה-chunk יעזוב את השרת מיד ולא ייתקע ב-buffer.",
  },
  {
    icon: MonitorPlay,
    label: "Render בהדרגה",
    detail: "הלקוח קורא את הזרם, מוסיף כל chunk לטקסט המצטבר ומרנדר מיד. המשתמש רואה את התשובה ’נכתבת’ בזמן אמת — זו כל מהות ה-streaming.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "אם הזמן הכולל לייצר תשובה כמעט זהה עם streaming ובלעדיו, מדוע בכל זאת streaming משפר משמעותית את חוויית המשתמש?",
    options: [
      "כי streaming גורם למודל לייצר את הטוקנים מהר יותר בפועל",
      "כי הוא מקטין את ה-latency הנתפס: time-to-first-token יורד דרמטית, והמשתמש קורא את התשובה תוך כדי שהיא זורמת במקום לבהות במסך ריק",
      "כי streaming מדלג על טוקנים מיותרים ולכן התשובה קצרה יותר",
      "כי הוא מפחית את עלות הטוקנים של הקריאה",
    ],
    correctIndex: 1,
    explanation:
      "streaming לא מזרז את הייצור ולא משנה את התוכן או העלות — המודל מייצר את אותם טוקנים באותו קצב. מה שמשתנה הוא ה-latency הנתפס: במקום להמתין לכל התשובה, המשתמש רואה את הטוקן הראשון תוך פחות משנייה וקורא תוך כדי זרימה. ההמתנה מרגישה קצרה בהרבה גם כשהזמן הכולל זהה.",
    optionNotes: [
      "שגוי: הייצור עצמו לא מואץ; אותו מספר טוקנים באותו קצב. רק זמן ההצגה הראשוני משתנה.",
      "נכון: זהו בדיוק העיקרון — שיפור ב-latency הנתפס דרך TTFT נמוך, לא בזמן הכולל.",
      "שגוי: streaming לא מקצר את התשובה ולא מדלג על טוקנים; אותה תשובה בדיוק, רק מוצגת בהדרגה.",
      "שגוי: העלות תלויה במספר הטוקנים, וזה זהה עם streaming ובלעדיו.",
    ],
  },
  {
    id: "q2",
    question: "בונים נתיב שמבקש מ-Claude להחזיר JSON, וקוד שרת מפרסר אותו ומעדכן מסד נתונים לפי השדות. האם כדאי לזרום את התשובה הזו למשתמש?",
    options: [
      "כן — תמיד עדיף לזרום, זה נותן UX טוב יותר בכל מקרה",
      "לא לצורך העיבוד: אי אפשר לפרסר חצי JSON, אז לפעולה צריך את הפלט השלם. אפשר לזרום להצגה בלבד, אך את הפרסור/הפעולה מבצעים רק כשהתשובה הושלמה",
      "כן — אפשר לפרסר כל chunk בנפרד כ-JSON עצמאי תוך כדי הזרם",
      "לא — Claude לא תומך ב-streaming כשמבקשים ממנו JSON",
    ],
    correctIndex: 1,
    explanation:
      "streaming מצוין להצגה לעין אנושית, אבל אי אפשר לפעול על פלט חלקי שדורש פרסור מבני. חצי-JSON אינו JSON תקין — לא ניתן לוודא אותו מול schema ולא לפעול עליו עד שהוא שלם. לכן כשהפלט נצרך תוכנתית (JSON, קריאת כלי) פועלים רק על התשובה המלאה; streaming נשאר אופציה להצגה בלבד, לא לעיבוד.",
    optionNotes: [
      "שגוי: ’תמיד לזרום’ מתעלם מכך שאי אפשר לפעול על פלט חלקי שצריך פרסור — כאן זה מזיק.",
      "נכון: מפרידים בין הצגה (אפשר לזרום) לבין עיבוד (דורש פלט שלם ותקין לפני פעולה).",
      "שגוי: chunk הוא נתח טוקנים שרירותי, לא אובייקט JSON שלם — פרסור chunk בנפרד ייכשל כמעט תמיד.",
      "שגוי: ה-API כן תומך ב-streaming גם עבור פלט JSON; המגבלה היא בעיבוד פלט חלקי, לא ביכולת לזרום.",
    ],
  },
  {
    id: "q3",
    question: "משתמש לחץ ’עצור’ באמצע תשובה זורמת ארוכה. מהי התגובה ההנדסית הנכונה בצד השרת?",
    options: [
      "להתעלם — ממילא כבר התחלנו, נחכה שהתשובה תסתיים ואז פשוט לא נציג אותה",
      "לבטל (abort) את בקשת ה-API למודל, כדי להפסיק את הייצור ולא לשלם על טוקנים שאיש לא יקרא",
      "לאתחל את השרת כדי לשחרר את החיבור",
      "להמשיך לייצר ולשמור את התשובה ל-cache — אולי מישהו ישאל שוב",
    ],
    correctIndex: 1,
    explanation:
      "כשמשתמש עוצר, הטוקנים שעדיין ייווצרו הם עבודה מבוזבזת שעולה כסף. הנכון הוא לבטל את הבקשה הפעילה למודל (למשל דרך AbortController שמעביר את הביטול הלאה ל-API), כך שהייצור נעצר מיד. זהו טיפול חובה בקצה של streaming: הזרם דו-כיווני מבחינת מחזור-החיים — גם ביטול צריך לזרום בחזרה.",
    optionNotes: [
      "שגוי: להמשיך לייצר ’סתם’ מבזבז טוקנים ועלות על תוכן שנזרק — בדיוק מה שביטול נועד למנוע.",
      "נכון: abort של הבקשה עוצר את הייצור וחוסך את עלות הטוקנים המיותרים.",
      "שגוי: אתחול שרת הוא פגיעה חמורה בכל המשתמשים בשביל בקשה אחת; מבטלים רק את הבקשה הרלוונטית.",
      "שגוי: תשובה חלקית שנקטעה אינה תשובה תקינה ל-cache, ובוודאי לא שווה את עלות ההמשך.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: למה לזרום", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "flow",
    label: "המנגנון מקצה-לקצה — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          streaming אינו קסם — הוא צינור של ארבעה שלבים, מהמודל שמייצר טוקן ועד ה-render בדפדפן. שים
          לב שבכל שלב היעד הוא אחד: לא לצבור, אלא להעביר כל chunk הלאה מיד. כל buffer מיותר הורג את
          יתרון ה-TTFT.
        </p>
        <StepDiagram steps={FLOW_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "בחירה הנדסית: לחסום עד סיום מול לזרום",
    content: (
      <PromptComparisonLab
        title="הצגת תשובת AI ארוכה ב-AtlasDesk"
        unitLabel="ארכיטקטורת מסירה"
        bad={{
          label: "block-until-done (בקשה/תגובה רגילה)",
          content: `const res = await claude.messages.create({ ... });
// השרת מחכה שכל התשובה תיווצר,
// ואז מחזיר אותה בבת אחת ללקוח
return res.content;`,
          outcome:
            "המשתמש רואה ספינר 6-8 שניות על תשובה ארוכה, ואז הכל קופץ בבת אחת. אחוז נטישה גבוה — אנשים חושבים שהמערכת תקועה. פשוט לכתוב, אבל חוויית המשתמש נפגעת בדיוק במקום שבו זה הכי מורגש.",
        }}
        good={{
          label: "streaming (SSE, chunk-by-chunk)",
          content: `const stream = await claude.messages.stream({ ... });
for await (const chunk of stream) {
  res.write(chunk.text); // flush מיד ללקוח
}
// הלקוח מוסיף כל chunk ומרנדר בהדרגה`,
          outcome:
            "הטוקן הראשון מופיע תוך פחות משנייה, והתשובה ’נכתבת’ מול העיניים. אותו זמן ייצור כולל — אבל התחושה מהירה ורציפה. בתמורה: צריך לטפל בניתוק ובביטול באמצע הזרם.",
        }}
        takeaway="זו לא שאלה של ’מי מהיר יותר’ — זמן הייצור זהה. זו בחירה הנדסית בין פשטות (חסימה) לבין latency נתפס טוב בהרבה (streaming), במחיר טיפול בקצוות: ניתוק מוקדם וביטול."
      />
    ),
  },
  {
    id: "edge-cases",
    label: "הקצוות שחייבים לטפל בהם",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Timer size={16} /> החיבור נשאר פתוח ו-flush
          </p>
          <p className="text-sm text-muted">
            streaming דורש להשאיר את החיבור פתוח לאורך כל הזרם, ולעשות flush מפורש לכל chunk. אם חסר
            flush, ה-chunks נתקעים ב-buffer של השרת/פרוקסי ומגיעים בבת אחת — איבדת את כל יתרון ה-TTFT
            בלי לדעת.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <AlertTriangle size={16} /> ניתוק באמצע הזרם
          </p>
          <p className="text-sm text-muted">
            החיבור יכול ליפול אחרי חצי תשובה. אסור להניח שהזרם תמיד מסתיים תקין: זהה סיום לא-שלם,
            החלט מה עושים עם הפלט החלקי (לשמור? לזרוק? לאפשר ניסיון חוזר?), ואל תיתן לקוד להתייחס
            לתשובה חתוכה כאילו היא שלמה.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <XCircle size={16} /> ביטול על-ידי המשתמש
          </p>
          <p className="text-sm text-muted">
            כשמשתמש עוצר, בטל את בקשת ה-API (AbortController שמועבר הלאה למודל). אחרת הייצור ממשיך
            ברקע — טוקנים שאיש לא יקרא, ועדיין עולים כסף. ביטול נכון הוא חלק מהחיסכון, לא רק מה-UX.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Split size={16} /> Backpressure
          </p>
          <p className="text-sm text-muted">
            אם המודל מייצר מהר יותר מכפי שהלקוח/הרשת מסוגלים לצרוך, ה-chunks נערמים. כבד את סימני
            ה-backpressure של הזרם (המתן ל-drain לפני כתיבה נוספת) כדי לא לנפח זיכרון בשרת בקנה מידה.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="streaming קיים כי ה-latency הנתפס — לא הזמן הכולל — הוא שקובע את חוויית המשתמש בצ’אט. TTFT נמוך הופך המתנה של שניות ל’מרגיש מיידי’, וזה ההבדל בין משתמש שנשאר לזה שנוטש."
        alternatives="בקשה/תגובה רגילה (חסימה עד סיום): פשוטה בהרבה, בלי טיפול בניתוק/ביטול/backpressure — ומתאימה מצוין ל-batch, לקריאות קצרות, או כשצריך את הפלט השלם לפני שעושים איתו משהו."
        whenNotTo="כשצריך את הפלט השלם כדי לפרסר/לוודא אותו לפני פעולה (JSON, קריאת כלי — אי אפשר לפעול על חצי JSON); בעבודות batch שאין להן צופה אנושי בזמן אמת; ובתורות tool-calling שבהן השרת צריך את הבקשה המלאה של הכלי כדי להריצו."
        commonMistakes="שכחת flush — ה-chunks נתקעים ב-buffer ומגיעים בבת אחת; התייחסות לזרם שנקטע כאילו הושלם; אי-ביטול הבקשה כשמשתמש עוצר (בזבוז טוקנים); ניסיון לפרסר chunk בודד כ-JSON שלם; התעלמות מ-backpressure שמנפח זיכרון בעומס."
        performance="המדד המרכזי הוא time-to-first-token (TTFT), לא רק זמן כולל. streaming לא מקטין את הזמן הכולל אך חותך את ה-TTFT הנתפס דרמטית. מדוד TTFT ו-p95 שלו בנפרד מזמן ההשלמה המלא — הם מספרים סיפורים שונים."
        cost="הזמן הכולל והעלות בטוקנים כמעט זהים בין streaming לחסימה — אותם טוקנים נוצרים. החיסכון האמיתי מגיע מביטול מוקדם: משתמש שעוצר וה-abort מפסיק את הייצור חוסך את כל הטוקנים שלא ייווצרו."
        security="הזרם עובר דרך השרת שלך; אם אתה מסנן/מצנזר פלט, זכור שאתה רואה אותו chunk-אחר-chunk — פילטר שמניח פלט שלם עלול לפספס תוכן שנחתך בין chunks. ולמסירה ללקוח, ודא שה-SSE עובר על חיבור מאובטח."
        realWorld="כל ממשק צ’אט מודרני זורם — Claude, ChatGPT וכל השאר. ב-AtlasDesk, נתיבי הצ’אט מול המשתמש יזרמו (TTFT), בעוד שנתיבי הפעולה (חילוץ JSON, קריאת כלים, batch לילי) יעבדו על תשובה שלמה — בדיוק אותה מערכת, שתי אסטרטגיות מסירה לפי הצורך."
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
            <li>אין flush — ה-chunks נתקעים ב-buffer של פרוקסי/שרת ומגיעים בבת אחת; ’streaming’ שלא זורם.</li>
            <li>מתייחסים לזרם שנקטע באמצע כאילו הושלם — הקוד פועל על תשובה חתוכה.</li>
            <li>משתמש עוצר, אבל הבקשה למודל ממשיכה ברקע — טוקנים שנשרפים על תוכן שנזרק.</li>
            <li>מנסים לפרסר JSON תוך כדי זרם ופועלים על חצי-אובייקט לא-תקין.</li>
            <li>מתעלמים מ-backpressure — בעומס, chunks נערמים בזיכרון והשרת מתנפח.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>flush מפורש לכל chunk, ומוודאים שאין buffering בפרוקסי בדרך ללקוח.</li>
            <li>מזהים סיום לא-שלם, ומחליטים במפורש מה עושים עם פלט חלקי.</li>
            <li>AbortController שמעביר את הביטול עד ל-API — כשמשתמש עוצר, הייצור נעצר.</li>
            <li>זורמים להצגה בלבד; פרסור/ולידציה/פעולה — רק על התשובה המלאה.</li>
            <li>מכבדים backpressure (ממתינים ל-drain) ומודדים TTFT ו-p95 בנפרד מזמן ההשלמה.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "not-to-stream",
    label: "מתי לא לזרום — הצד השני של ה-trade-off",
    content: (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-3 flex items-center gap-2 font-bold text-primary">
          <Ban size={16} /> streaming-UX מול עיבוד מבני — שני צדדים של אותה החלטה
        </p>
        <p className="mb-3 text-muted">
          streaming משפר את ה-UX אבל נותן לך רק פלט חלקי בכל רגע. כשהצורך הוא לעבד את הפלט תוכנתית,
          החלקיות הזו הופכת מיתרון לחיסרון. שקול לא לזרום כאשר:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Braces size={16} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <strong>צריך פלט שלם כדי לפרסר/לוודא JSON.</strong> אי אפשר לפעול על חצי JSON — הוא
              אינו תקין עד שהוא נסגר. פעל רק על התשובה המלאה, ולוודא מול schema.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Cpu size={16} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <strong>תורות tool-calling.</strong> השרת צריך את בקשת הכלי המלאה (שם + ארגומנטים)
              כדי להריץ אותה — חצי קריאת-כלי היא חסרת-משמעות.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <strong>עבודות batch ללא צופה אנושי.</strong> אם אין מי שקורא בזמן אמת, ה-TTFT חסר
              ערך — והחסימה הפשוטה עדיפה כי אין בה קצוות לטפל בהם.
            </span>
          </li>
        </ul>
        <p className="mt-3 text-muted">
          הכלל: זרום כשיש עין אנושית שממתינה לטקסט; אל תזרום כשהקוד הוא ה’קורא’ והוא זקוק לפלט שלם
          ותקין לפני שהוא פועל.
        </p>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="monitoring-streaming-responses"
        title="בנה CLI שזורם תשובה מ-Claude — וטפל בביטול באמצע הזרם"
        context="פתח את Claude Code בתיקייה חדשה. תבנה סקריפט CLI קטן (Node/Python) שקורא ל-Claude API עם streaming ומדפיס את התשובה תוך כדי זרימה."
        steps={[
          "בקש מ-Claude Code ליצור סקריפט CLI שמקבל שאלה כארגומנט, קורא ל-Claude API עם stream=true, ומדפיס כל chunk למסך ברגע שהוא מגיע (בלי לצבור את כל התשובה קודם).",
          "מדוד time-to-first-token: הדפס חותמת זמן כשהתחלת, וחותמת נוספת כשהגיע ה-chunk הראשון. הרץ, וראה כמה מהר מופיע הטוקן הראשון לעומת זמן הסיום המלא.",
          "הוסף טיפול בביטול: לכוד Ctrl+C, ובאמצעות AbortController (או המקבילה) בטל את בקשת ה-API כך שהייצור נעצר מיד — לא רק שהתוכנית יוצאת.",
          "דיבוג הקצה: הזרם נקטע באמצע (סמלץ ניתוק, למשל עצור את הרשת או זרוק שגיאה אחרי כמה chunks). ודא שהקוד מזהה סיום לא-שלם ומדפיס הודעה ברורה במקום לקרוס או להתייחס לפלט החתוך כשלם.",
          "השווה: הוסף מצב שני, ללא streaming (המתן לתשובה המלאה ואז הדפס). הרץ את שניהם על אותה שאלה ארוכה ותאר את ההבדל בתחושה — למרות שזמן הסיום דומה.",
        ]}
        successCriteria={[
          "הטוקן הראשון מודפס תוך פחות משנייה, ואתה יכול להצביע על ה-TTFT הנמדד מול זמן הסיום המלא",
          "Ctrl+C מבטל בפועל את בקשת ה-API (הייצור נעצר), ולא רק סוגר את התוכנית",
          "ניתוק/שגיאה באמצע הזרם מזוהה ומטופל — הקוד לא קורס ולא מתייחס לפלט חלקי כאילו הוא שלם",
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
          ["Streaming", "מסירת התשובה טוקן-אחר-טוקן בזמן שהיא נוצרת, במקום להמתין לפלט השלם."],
          ["Time-to-first-token (TTFT)", "הזמן עד שהטוקן הראשון מגיע למשתמש; המדד שקובע את ה-latency הנתפס."],
          ["SSE", "Server-Sent Events — ערוץ חד-כיווני שבו השרת דוחף chunks ללקוח על חיבור פתוח (text/event-stream)."],
          ["Chunk", "נתח קטן של הפלט (טוקן או קבוצת טוקנים) שנשלח מיד, לפני שהתשובה כולה מוכנה."],
          ["Flush", "דחיפה מפורשת של chunk החוצה מה-buffer מיד, כדי שלא ייתקע וייאבד יתרון ה-TTFT."],
          ["Backpressure", "מצב שבו הייצור מהיר מהצריכה; מכבדים אותו כדי לא לנפח זיכרון בשרת."],
          ["Abort / cancellation", "ביטול בקשת ה-API באמצע הזרם (למשל AbortController) כשהמשתמש עוצר — חוסך טוקנים."],
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
          <Radio size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>streaming לא מזרז את הייצור — הוא מקטין את ה-<strong>latency הנתפס</strong> דרך TTFT נמוך.</li>
          <li>המנגנון: השרת שולח <strong>chunks ב-SSE עם flush</strong>, הלקוח מוסיף ומרנדר בהדרגה.</li>
          <li>טפל בקצוות: <strong>ניתוק</strong> באמצע (פלט חלקי), <strong>ביטול</strong> (abort לחיסכון), ו-<strong>backpressure</strong>.</li>
          <li>אל תזרום כשצריך <strong>פלט שלם לפרסור/ולידציה</strong> (JSON, tool-calling) או ב-batch ללא צופה אנושי.</li>
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
          קח את ה-CLI מהמשימה והוסף מדידה: הרץ אותו 10 פעמים על אותה שאלה ורשום את ה-TTFT בכל
          הרצה, ובנפרד את זמן ההשלמה המלא. חשב את ה-p95 של כל אחד. מה גדל יותר בין ההרצות — TTFT או
          זמן הסיום? מה זה אומר על מה שכדאי לנטר בפרודקשן?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          מדדנו עלות, חסכנו עם caching, וזרמנו לחוויית משתמש מהירה. בפרויקט המסכם של המודול נחבר את
          הכל: AtlasDesk יקבל נתיבי צ’אט זורמים עם ניטור TTFT, לצד נתיבי-פעולה שעובדים על פלט שלם —
          ותראה מתי כל אסטרטגיה היא הבחירה הנכונה.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
