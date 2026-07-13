"use client";

import { MessageSquare, Database, Cpu, ArrowDownWideNarrow, Repeat } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "fine-tuning",
  lessonSlug: "fine-tuning-vs-rag-vs-prompting",
  title: "Fine-tuning מול RAG מול Prompt Engineering",
  objectives: [
    "להבין מתי fine-tuning נחוץ ומתי RAG/פרומפט מספיקים (ולמה זה כמעט תמיד האחרון)",
    "להפנים ש-fine-tuning משנה התנהגות/סגנון/פורמט — ולא מוסיף ידע טרי (זו עבודת RAG)",
    "להכיר LoRA כשיטה יעילה יותר מ-fine-tuning מלא",
    "להבין את העלות, זמן ההכנה והתחזוקה הגבוהים של fine-tuning יחסית לחלופות",
  ],
  estMinutes: 35,
  difficulty: "מתקדם",
  prerequisites: ["פרויקט מודול: AtlasDesk מקבל אוטומציה מונעת-webhook"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: 'המודל לא מתנהג כמו שאני רוצה' — מה עושים?",
    bullets: [
      "יש שלוש דרכים להתאים מודל, והן נבדלות בשאלה אחת: מה בדיוק חסר — ניסוח? ידע? או התנהגות בסיסית?",
      "הבחירה הלא-נכונה יקרה: קפיצה ל-fine-tuning כשprompt טוב היה מספיק היא הטעות הכי נפוצה בשטח.",
      "לכן קודם צריך אבחון — מהי בעצם הבעיה — ורק אז לבחור כלי.",
    ],
  },
  {
    title: "שלוש דרכים ל'התאים' מודל, מהזולה ליקרה",
    bullets: [
      "1. Prompt Engineering (מודול 6.1) — לנסח בקשה טובה יותר. זול, מיידי, אין צורך באימון נוסף.",
      "2. RAG (מודול קודם) — להזין מידע ספציפי בזמן ריצה. פותר בעיית 'ידע חסר', לא משנה את 'התנהגות' המודל עצמו.",
      "3. Fine-tuning — לאמן מחדש (חלקית) את משקלי המודל על דוגמאות. משנה התנהגות/סגנון/פורמט — לא מוסיף ידע טרי.",
    ],
  },
  {
    title: "מה fine-tuning כן עושה — ומה הוא לא",
    bullets: [
      "כן: מקבע סגנון/טון/פורמט עקבי בקנה מידה, מקצר פרומפטים (חוסך latency ועלות טוקנים), חד לגמרי במשימה צרה.",
      "לא: לא מכניס עובדות חדשות בצורה אמינה — ידע שמשתנה, צורך בציטוטים, מקורות מתעדכנים = זו עבודת RAG.",
      "רוב המקרים (כולל AtlasDesk כולו!) לא מגיעים לרף — RAG + פרומפט טוב פותרים את רוב הבעיות בזול הרבה יותר.",
    ],
  },
  {
    title: "LoRA — fine-tuning יעיל יותר",
    bullets: [
      "LoRA (Low-Rank Adaptation) מאמן רק שכבות קטנות נוספות במקום כל משקלי המודל — הרבה יותר זול וזריז מ-fine-tuning מלא, בעודו משיג תוצאות דומות ברוב המקרים.",
      "גם עם LoRA, מרבית העלות האמיתית היא הכנת הדאטה (איסוף וניקוי אלפי דוגמאות איכותיות) — לא זמן ה-GPU.",
    ],
  },
];

const DECISION_STEPS: DiagramStep[] = [
  {
    icon: MessageSquare,
    label: "1. נסה Prompt קודם",
    detail: "נסח את ה-system prompt הכי טוב שאתה יכול, עם דוגמאות (few-shot). זול, מיידי, לרוב מספיק. אם זה פתר — עצור כאן.",
  },
  {
    icon: Database,
    label: "2. חסר ידע? → RAG",
    detail: "אם הבעיה היא 'המודל לא יודע X' (מסמכים פנימיים, מידע שמתעדכן, צורך בציטוטים) — הזרק אותו בזמן ריצה. RAG, לא fine-tuning.",
  },
  {
    icon: Cpu,
    label: "3. התנהגות עקבית בקנה מידה? → Fine-tuning",
    detail: "אם צריך סגנון/פורמט/טון קבוע על אלפי קריאות, או לקצר פרומפט ארוך שחוזר — ויש לך אלפי דוגמאות איכותיות — עכשיו fine-tuning מוצדק.",
  },
  {
    icon: ArrowDownWideNarrow,
    label: "4. שקול LoRA",
    detail: "אם בחרת fine-tuning, LoRA משיג תוצאה דומה בעלות וזמן נמוכים בהרבה מ-full fine-tuning — נקודת הפתיחה המעשית.",
  },
  {
    icon: Repeat,
    label: "5. תכנן תחזוקה",
    detail: "מדיניות משתנה או ההתפלגות נודדת (drift)? תצטרך לאמן מחדש. תמחר את המחזור הזה מראש — הוא חלק מעלות הבעלות.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה כמעט כל היכולות שנבנו ב-AtlasDesk (RAG, tool calling, agent) לא דרשו fine-tuning בכלל?",
    options: [
      "כי fine-tuning לא קיים עבור אף מודל מודרני",
      "כי הבעיות שנפתרו (ידע חסר, פעולה על כלים, החלטה בלולאה) נפתרות טוב באמצעות RAG/prompt engineering/tool calling — לא דורשות שינוי בהתנהגות הבסיסית של המודל עצמו",
      "כי fine-tuning זול מדי ולא היה שווה את זה",
      "כי AtlasDesk לא באמת צריך להיות מדויק",
    ],
    correctIndex: 1,
    explanation:
      "כל בעיה ב-AtlasDesk נפתרה בהזרקת מידע/יכולות בזמן ריצה (RAG, tools) — לא היה צורך לשנות את ה'אישיות' הבסיסית של המודל, מה ש-fine-tuning נועד לו.",
    optionNotes: [
      "לא נכון: fine-tuning קיים עבור מודלים רבים — זו לא הסיבה שהוא לא נדרש כאן.",
      "התשובה הנכונה: כל הבעיות שנפתרו היו בעיות 'ידע/יכולת חסרה', לא 'התנהגות בסיסית שגויה' — RAG ו-tools הם הכלי הנכון לזה.",
      "לא נכון: זה ההפך — fine-tuning יקר יותר מהחלופות, וזו בדיוק הסיבה שהוא לא נבחר, לא ש'הוא זול מדי'.",
      "לא נכון: AtlasDesk כן צריך להיות מדויק — אבל דיוק הושג דרך grounding ו-RAG, לא fine-tuning.",
    ],
  },
  {
    id: "q2",
    question: "צוות רוצה שהמודל 'ידע' את המדיניות הפנימית העדכנית של החברה, שמתעדכנת כל חודש. מה הכלי הנכון?",
    options: [
      "Fine-tuning — לאמן את המודל על מסמכי המדיניות",
      "RAG — לאחזר את המסמך הרלוונטי בזמן ריצה ולהזין אותו לפרומפט",
      "אין פתרון — המודל לא יכול לדעת מידע חברה",
      "להגדיל את חלון ההקשר בלבד",
    ],
    correctIndex: 1,
    explanation:
      "ידע שמשתנה תדיר הוא הדוגמה הקלאסית שבה fine-tuning הוא הכלי הלא-נכון: כל עדכון מדיניות ידרוש אימון מחדש, וגם אז המודל עלול 'להזות' פרטים. RAG מזין את המסמך העדכני בזמן ריצה, מאפשר ציטוט מקור, ומתעדכן ברגע שמחליפים קובץ.",
    optionNotes: [
      "לא נכון: fine-tuning על ידע שמשתנה חודשית = re-tune אינסופי, ועדיין נוטה להזיות. זה בדיוק מה שהוא לא טוב בו.",
      "התשובה הנכונה: RAG מאחזר את המדיניות העדכנית בזמן ריצה, מתעדכן מיידית ומאפשר ציטוט מקור.",
      "לא נכון: יש פתרון מצוין — RAG — המודל בהחלט יכול לענות על סמך מידע שמוזן לו.",
      "לא נכון: חלון הקשר גדול לבד לא פותר איזה מסמך רלוונטי להביא — צריך אחזור (retrieval).",
    ],
  },
  {
    id: "q3",
    question: "באיזה מקרה fine-tuning הוא כן הבחירה הנכונה, לא over-engineering?",
    options: [
      "כשצריך שהמודל יידע עובדה חדשה שהתגלתה אתמול",
      "כשצריך פורמט/טון פלט עקבי לחלוטין על אלפי קריאות, יש אלפי דוגמאות איכותיות, וגם רוצים לקצר פרומפט ארוך שחוזר בכל קריאה",
      "כשיש 30 דוגמאות אימון בלבד",
      "כשרוצים שהמודל יצטט מקורות מדויקים",
    ],
    correctIndex: 1,
    explanation:
      "fine-tuning זורח כשמדובר בהתנהגות (פורמט/סגנון/טון) שצריכה להיות עקבית בקנה מידה — ובמיוחד כשהוא מאפשר לקצר פרומפט ארוך שחוזר, וכך חוסך latency ועלות טוקנים. התנאי: מספיק דוגמאות איכותיות ללמידת דפוס אמיתי.",
    optionNotes: [
      "לא נכון: עובדה טרייה = RAG. fine-tuning לא מכניס ידע חדש בצורה אמינה.",
      "התשובה הנכונה: פורמט/טון עקבי בקנה מידה + קיצור פרומפט חוזר + מספיק דוגמאות = בדיוק המקרה של fine-tuning.",
      "לא נכון: 30 דוגמאות מעט מדי — המודל 'ירעיש' במקום ללמוד דפוס (overfitting).",
      "לא נכון: ציטוט מקורות מדויק דורש אחזור מסמך אמיתי בזמן ריצה — זו עבודת RAG.",
    ],
  },
  {
    id: "q4",
    question: "מה היתרון המרכזי של LoRA על פני full fine-tuning?",
    options: [
      "הוא מוסיף ידע חדש שלא ניתן להוסיף אחרת",
      "הוא מאמן רק שכבות קטנות נוספות במקום כל משקלי המודל — זול וזריז בהרבה, בתוצאה דומה ברוב המקרים",
      "הוא לא דורש שום דוגמאות אימון",
      "הוא מבטל לחלוטין את הסיכון ל-overfitting",
    ],
    correctIndex: 1,
    explanation:
      "LoRA (Low-Rank Adaptation) מקפיא את רוב המשקלים ומאמן רק מטריצות קטנות נוספות — פחות זיכרון, פחות זמן, ותוצאה דומה ל-full fine-tuning ברוב המשימות. הוא לא משנה את מהות ה-fine-tuning (עדיין התנהגות, לא ידע) ולא מבטל את הצורך בדוגמאות איכותיות.",
    optionNotes: [
      "לא נכון: LoRA הוא עדיין fine-tuning — הוא לא מוסיף ידע טרי, זה תפקיד RAG.",
      "התשובה הנכונה: אימון שכבות קטנות בלבד = חיסכון גדול במשאבים בתוצאה דומה.",
      "לא נכון: LoRA עדיין דורש דוגמאות אימון איכותיות — זה חלק הארי של העלות.",
      "לא נכון: LoRA מקטין עומס אימון אך לא מחסן מפני overfitting — עדיין צריך סט בדיקה נפרד.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: שלוש דרכים להתאמת מודל", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "מסגרת ההחלטה: פרומפט → RAG → fine-tuning",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          זה לב השיעור: עץ החלטה שמנחה מהזול ליקר. השאלה בכל צומת היא &quot;מה בדיוק חסר&quot; —
          ניסוח, ידע, או התנהגות. עבור על הצעדים לפי הסדר, ואל תדלג:
        </p>
        <StepDiagram steps={DECISION_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: מתי לבחור fine-tuning מול פרומפט",
    content: (
      <PromptComparisonLab
        title="AtlasDesk צריך לענות תמיד בטון מותג ספציפי מאוד"
        unitLabel="גישה"
        bad={{
          label: "fine-tuning ישר (over-engineering)",
          content: `אימון מודל מותאם על אלפי דוגמאות שיחה כדי
"ללמד" אותו את הטון — עלות גבוהה, זמן הכנה ארוך,
ותחזוקה מתמשכת (לאמן מחדש בכל שינוי מדיניות)`,
          outcome:
            "השקעה גדולה לפני שבכלל בדקו אם system prompt טוב היה פותר את זה — ברוב המקרים, זה היה.",
        }}
        good={{
          label: "לנסות פרומפט קודם (מה שנעשה בפועל ב-AtlasDesk)",
          content: `ATLASDESK_SYSTEM_PROMPT מגדיר טון מפורש: "טון
מקצועי, חם וממוקד-פתרון... תשובות קצרות וברורות"
— הושג בלי שום fine-tuning`,
          outcome:
            "הטון הרצוי הושג במלואו רק דרך ניסוח system prompt קפדני — אין צורך ב-fine-tuning כלל למקרה הזה.",
        }}
        takeaway="הכלל המעשי: תמיד תתחיל בפרומפט הכי טוב שאתה יכול לנסח, ואז RAG אם חסר ידע — fine-tuning הוא המוצא האחרון, לא הראשון, בגלל העלות והזמן הגבוהים שלו."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הסדר (פרומפט → RAG → fine-tuning) קיים כי כל שלב עולה יותר ולוקח יותר זמן מהקודם — תמיד משתלם לנסות את הזול והמהיר קודם. מאחורי הסדר יש עיקרון: fine-tuning משנה התנהגות, RAG מוסיף ידע, פרומפט מכוון ניסוח — לכל בעיה הכלי המתאים לה."
        alternatives="לקפוץ ישר ל-fine-tuning 'כי זה נשמע מתקדם יותר' — כמעט תמיד טעות; רוב הבעיות שנראות כמו 'המודל לא מתנהג נכון' הן בעיות פרומפט/ידע, לא בעיות שדורשות שינוי משקלים. חלופה ביניים חשובה: prompt caching מקצר עלות של פרומפט ארוך חוזר בלי שום אימון."
        whenNotTo="כשהידע משתנה (מדיניות/מחירים/מלאי) — זו עבודת RAG; כשצריך ציטוט מקור מדויק — RAG; כשיש מעט מאוד דוגמאות (פחות מכמה מאות) — fine-tuning לא ילמד דפוס אמיתי, רק ירעיש; כשעוד לא מיצית system prompt טוב."
        commonMistakes="לבצע fine-tuning בלי לבדוק קודם אם system prompt משופר או RAG פותרים את הבעיה בזול; לצפות מ-fine-tuning להוסיף ידע (הוא לא — הוא ישנן ויתחיל להזות); לאמן על דאטה מלוכלך/לא-עקבי ואז לתהות למה הפלט לא-עקבי."
        performance="fine-tuning יכול דווקא לשפר latency ועלות: מודל שאומן לפורמט מסוים לא צריך פרומפט ארוך שמסביר אותו בכל קריאה — פחות טוקנים בכל בקשה. זה אחד המקרים הלגיטימיים לבחור בו."
        cost="fine-tuning דורש: איסוף/ניקוי דוגמאות (החלק היקר!), זמן אימון, ותשתית הרצה — סדרי גודל מעל פרומפט/RAG. LoRA מוזיל את האימון, אבל הכנת הדאטה נשארת עיקר העלות."
        maintenance="מודל מותאם אינו 'פעם אחת': כשהמדיניות משתנה או ההתפלגות נודדת (drift) — צריך לאמן מחדש ולהעריך מחדש. RAG לעומת זאת מתעדכן בהחלפת קובץ. תמחר את מחזור ה-re-tune לפני שאתה מתחייב."
        realWorld="AtlasDesk הוא הדוגמה החיה: כל 8 היכולות שנבנו (כולל טון עקבי, ידע ספציפי, כלים, אסקלציה) הושגו בלי שום fine-tuning. הרבה צוותים בשטח מגיעים ל-fine-tuning מוקדם מדי, לפני שמיצו prompt+RAG, ומשלמים על מורכבות שלא הייתה נחוצה."
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
            <li>קופצים ל-fine-tuning לפני שמיצו system prompt — מורכבות ועלות מיותרות.</li>
            <li>מנסים &quot;ללמד&quot; ידע שמשתנה דרך fine-tuning — המודל מזיז ומתיישן מיד.</li>
            <li>מאמנים על 30-50 דוגמאות — רעש במקום דפוס (overfitting).</li>
            <li>דאטה מלוכלך/לא-עקבי → פלט מותאם אך לא-עקבי, ומאשימים את המודל.</li>
            <li>לא מתמחרים את מחזור ה-re-tune — עלות התחזוקה מפתיעה אחר-כך.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מיצוי prompt (כולל few-shot) קודם — לרוב זה כבר פותר.</li>
            <li>ידע שמשתנה או שדורש ציטוט → RAG, לא אימון.</li>
            <li>fine-tuning רק לפורמט/טון עקבי בקנה מידה, עם אלפי דוגמאות איכותיות.</li>
            <li>משקיעים בעיקר בניקוי הדאטה — שם נמצאת האיכות (והעלות).</li>
            <li>מתחילים ב-LoRA, ומתכננים מראש מחזור אימון-מחדש על drift.</li>
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
          ["Prompt Engineering", "ניסוח טוב יותר של הבקשה — הכלי הזול והמיידי, מכוון את הניסוח."],
          ["RAG", "אחזור מידע בזמן ריצה והזרקתו לפרומפט — הכלי לידע חסר/משתנה, מאפשר ציטוט מקור."],
          ["Fine-tuning", "אימון מחדש (חלקי) של משקלי מודל על דוגמאות — משנה התנהגות/סגנון/פורמט, לא מוסיף ידע."],
          ["LoRA", "שיטת fine-tuning יעילה שמאמנת שכבות קטנות נוספות במקום כל המודל."],
          ["Overfitting", "מודל ש'משנן' את דוגמאות האימון במקום להכליל לתרחישים חדשים."],
          ["Drift", "נדידת התפלגות הקלט בפרודקשן עם הזמן — מחייבת אימון-מחדש של מודל מותאם."],
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
          <ArrowDownWideNarrow size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>הסדר קדוש: <strong>פרומפט → RAG → fine-tuning</strong>, מהזול ליקר. אל תדלג.</li>
          <li>fine-tuning משנה <strong>התנהגות</strong>; ידע חסר/משתנה זו עבודת <strong>RAG</strong>.</li>
          <li>הוא מוצדק ל<strong>פורמט/טון עקבי בקנה מידה</strong> + קיצור פרומפט חוזר, עם <strong>אלפי דוגמאות</strong> נקיות.</li>
          <li>עיקר העלות היא <strong>הכנת הדאטה</strong> והתחזוקה (re-tune על drift) — לא זמן ה-GPU.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="fine-tuning-vs-rag-vs-prompting"
        title="נתח החלטה של 'פרומפט מול RAG מול fine-tuning' על מקרה אמיתי"
        context="עבוד עם Claude Code — דיון ותכנון, לא מימוש."
        steps={[
          "חשוב על תרחיש (בדיוני או אמיתי) שבו 'נראה' שצריך fine-tuning.",
          "אבחן: האם החוסר הוא ניסוח, ידע, או התנהגות? בקש מ-Claude Code לעזור לסווג את הבעיה לפי עץ ההחלטה.",
          "אם זה נראה כמו 'ידע חסר' — הראה איך RAG פותר. אם 'ניסוח' — נסח system prompt משופר. תעד את התוצאה של כל חלופה זולה.",
          "רק אם עדיין נראה ש-fine-tuning נחוץ: כמה דוגמאות איכותיות תצטרך? מהי מדיניות ה-re-tune על drift?",
          "כתוב את ההחלטה הסופית עם נימוק כלכלי: מה מצדיק (או לא) את עלות ה-fine-tuning כאן.",
        ]}
        successCriteria={[
          "סיווגת את הבעיה נכון (ניסוח/ידע/התנהגות) לפי עץ ההחלטה",
          "בדקת חלופה זולה יותר (פרומפט/RAG) לפני שקבעת שצריך fine-tuning",
          "יש לך נימוק ברור, כולל עלות ותחזוקה, למה fine-tuning כן/לא נחוץ במקרה הספציפי",
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
          חפש דוגמה אמיתית (בלוג/מאמר) של חברה שהשתמשה ב-fine-tuning בפועל. מה הביא אותם
          למסקנה שפרומפט/RAG לא מספיקים במקרה שלהם? נסה לזהות: האם זו הייתה בעיית התנהגות/פורמט (מוצדק)
          או שידע חסר שהיה עדיף לפתור ב-RAG.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          החלטת ש-fine-tuning מוצדק? עכשיו השאלה הקריטית: איך תדע שהוא באמת עבד ולא רק &quot;מרגיש&quot; טוב.
          בשיעור הבא — הערכת מודלים מותאמים.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
