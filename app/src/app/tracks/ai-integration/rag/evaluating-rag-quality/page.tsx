"use client";

import { Search, ShieldCheck, Split, Gauge, Layers } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "rag",
  lessonSlug: "evaluating-rag-quality",
  title: "הערכת איכות RAG: מדידה נפרדת של Retrieval מול Generation",
  objectives: [
    "לחבר בין grounding (ממודול Prompt Engineering) לבין RAG בפועל",
    "להבין למה חובה למדוד את שלב ה-retrieval ואת שלב ה-generation בנפרד",
    "להכיר מדדי retrieval (recall@k, precision@k) ומדדי generation (faithfulness, answer-relevance)",
    "לזהות את הכישלון הקלאסי: תשובה שוטפת ומשכנעת שנשענה על context שגוי",
    "לבנות eval set קטן ולמדוד איתו את שני השלבים בנפרד",
  ],
  estMinutes: 35,
  difficulty: "בינוני",
  prerequisites: ["chunking-retrieval-strategies"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: 'התשובה נשמעה מצוין' זה לא מדד",
    bullets: [
      "מערכת RAG יכולה להחזיר תשובה מנוסחת להפליא, שוטפת ומשכנעת — ובכל זאת להיות שגויה לחלוטין, כי ה-context ששלפנו היה לא-רלוונטי.",
      "זה הכישלון הכי מסוכן ב-RAG: הוא לא נראה כמו כישלון. משתמש (ומפתח) קורא תשובה מנומקת ומאמין לה — בלי לדעת שהמקור שמאחוריה היה שגוי.",
      "לכן 'זה עבד על השאלה שבדקתי' הוא לא הוכחה. צריך מדדים אובייקטיביים שאומרים כמה טוב ה-retrieval וכמה נאמנה ה-generation — בנפרד.",
    ],
  },
  {
    title: "תזכורת: Grounding ממודול Prompt Engineering",
    bullets: [
      "כבר למדת (מודול 6.1) שגרונדינג הוא לבסס תשובות בעובדות במקום לתת למודל 'לנחש'. RAG הוא בדיוק המימוש המעשי של גרונדינג: להזין מקורות אמיתיים לפני שהמודל עונה.",
      "אבל RAG לא 'פותר' הזיות אוטומטית — גם עם מסמכים רלוונטיים בפרומפט, המודל עדיין יכול 'לסטות' מהם ולהוסיף פרטים שלא כתובים שם.",
      "המסקנה: RAG טוב הוא לא רק 'להזין מסמכים' — הוא לוודא, בעזרת מדידה, שהמסמכים הנכונים נשלפו ושהתשובה באמת נצמדה אליהם.",
    ],
  },
  {
    title: "שני שלבים, שני סוגי כישלון — חובה למדוד בנפרד",
    bullets: [
      "כישלון Retrieval — לא נמצא המסמך הנכון (או נמצא מסמך לא-רלוונטי). המידע הנכון בכלל לא הגיע לפרומפט. פתרון: שיפור embeddings / chunking / re-ranking.",
      "כישלון Generation (Faithfulness) — המסמך הנכון כן נמצא ונשלח, אבל המודל בכל זאת מוסיף/משנה פרטים שלא כתובים בו. פתרון: שיפור ה-system prompt וההנחיות ל-grounding.",
      "אם תמדוד רק את התשובה הסופית, לא תדע איזה שלב נכשל — ותתקן את הדבר הלא-נכון (למשל תשפר פרומפט כשהבעיה האמיתית היא embeddings גרועים).",
    ],
  },
];

const METRIC_STEPS: DiagramStep[] = [
  {
    icon: Search,
    label: "Retrieval — recall@k",
    detail: "מבין המסמכים שבאמת רלוונטיים לשאלה, כמה מהם הופיעו ב-top-k שנשלפו? recall נמוך = המידע הנכון לא הגיע לפרומפט בכלל.",
  },
  {
    icon: Gauge,
    label: "Retrieval — precision@k",
    detail: "מבין ה-k שנשלפו, כמה באמת רלוונטיים? precision נמוך = הזרקנו רעש ל-context שמדלל את המידע הנכון ומייקר.",
  },
  {
    icon: ShieldCheck,
    label: "Generation — faithfulness",
    detail: "האם כל טענה בתשובה נתמכת בפועל ב-context שסופק? faithfulness נמוך = 'הזיה' — המודל המציא פרט שלא כתוב במקור.",
  },
  {
    icon: Split,
    label: "Generation — answer-relevance",
    detail: "האם התשובה בכלל עונה על מה שנשאל? אפשר להיות נאמן למקור אך לענות על שאלה אחרת — נאמנות ורלוונטיות הן שני דברים שונים.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין כישלון 'Retrieval' לכישלון 'Faithfulness' ב-RAG?",
    options: [
      "אין הבדל, שניהם אותה בעיה בשם אחר",
      "Retrieval נכשל כשלא נמצא המסמך הנכון בכלל; Faithfulness נכשל כשהמסמך הנכון כן נמצא אבל המודל בכל זאת סוטה ממנו/ממציא פרטים",
      "Retrieval קורה רק בעברית, Faithfulness רק באנגלית",
      "שניהם נפתרים תמיד באותו אופן — שיפור ה-embedding model",
    ],
    correctIndex: 1,
    explanation: "אלו שני שלבים שונים בפייפליין שיכולים להיכשל בנפרד — חשוב לאבחן איזה מהם קרה כדי לתקן את הדבר הנכון.",
    optionNotes: [
      "לא נכון: אלו שני כשלים שונים לחלוטין, בשלבים שונים של ה-pipeline (retrieval לפני generation, faithfulness בזמן generation).",
      "התשובה הנכונה: retrieval נכשל 'לפני' שהמודל בכלל התחיל לענות (לא הגיע לו המידע הנכון); faithfulness נכשל 'אחרי' — יש לו המידע הנכון אבל הוא לא נצמד אליו.",
      "לא נכון: אין קשר לשפה — שני סוגי הכישלון יכולים לקרות בכל שפה.",
      "לא נכון: תיקון retrieval שגוי דורש שיפור embeddings/chunking; תיקון faithfulness שגוי דורש שיפור בהנחיות (system prompt) — פתרונות שונים לגמרי.",
    ],
  },
  {
    id: "q2",
    question: "למה חובה למדוד את שלב ה-retrieval ואת שלב ה-generation בנפרד, ולא רק את איכות התשובה הסופית?",
    options: [
      "כי מדידה נפרדת רצה מהר יותר",
      "כי אם תמדוד רק את התשובה הסופית, לא תדע איזה שלב אחראי לכישלון — ותשקיע בתיקון הרכיב הלא-נכון",
      "כי generation תמיד תקין, אז אין טעם למדוד אותו",
      "כי retrieval לא ניתן למדידה כמותית",
    ],
    correctIndex: 1,
    explanation:
      "אות אחת של 'תשובה גרועה' יכולה לנבוע משני מקורות שונים לגמרי. בלי הפרדה, אתה עלול לשפר את ה-system prompt במשך שבוע כשהבעיה האמיתית היא ש-recall@k נמוך — המידע הנכון בכלל לא נשלף. מדידה נפרדת מפנה אותך ישר לרכיב הפגום.",
    optionNotes: [
      "לא נכון: מהירות היא לא הסיבה — הסיבה היא אבחון. הפרדה אומרת לך היכן הבעיה.",
      "התשובה הנכונה: מדד סופי אחד מסתיר את השורש. הפרדה בין recall/precision (retrieval) ל-faithfulness (generation) מצביעה על הרכיב לתקן.",
      "לא נכון: generation בהחלט נכשל — faithfulness ו-answer-relevance הם בדיוק המדדים שתופסים את זה.",
      "לא נכון: retrieval דווקא ניתן למדידה כמותית מדויקת (recall@k / precision@k) מול סט שאלות עם תשובות ידועות.",
    ],
  },
  {
    id: "q3",
    question: "מהו הכישלון הקלאסי והמסוכן ביותר ב-RAG, שדווקא קשה לתפוס בעין?",
    options: [
      "המערכת מחזירה שגיאת קריסה ולא עונה בכלל",
      "התשובה שוטפת, משכנעת ומנוסחת היטב — אבל מבוססת על context שגוי או לא-רלוונטי שנשלף",
      "התשובה איטית מדי",
      "התשובה מנוסחת בשפה לא נכונה",
    ],
    correctIndex: 1,
    explanation:
      "קריסה גלויה קל לתפוס. הכישלון המסוכן הוא הפוך: תשובה מלוטשת שנשמעת אמינה, אבל ה-retrieval שלף chunk שגוי — והמודל 'נימק יפה' סביב מקור לא-נכון. משתמש מאמין לה, ואף אחד לא יודע שהיא שגויה. רק מדידת faithfulness מול המקור שנשלף חושפת אותה.",
    optionNotes: [
      "לא נכון: קריסה גלויה היא הכישלון הקל לתפוס — היא צועקת. המסוכן הוא זה שנראה תקין.",
      "התשובה הנכונה: תשובה שוטפת על context שגוי היא ה'הזיה בטוחה-עצמית' — נראית אמינה ולכן עוברת מתחת לרדאר. מדידה נפרדת חושפת אותה.",
      "לא נכון: latency היא בעיית ביצועים, לא בעיית נכונות — ולא 'מסתתרת' כמו תשובה שגויה משכנעת.",
      "לא נכון: שפה שגויה גלויה מיד למשתמש; היא לא הכישלון ה'נסתר' שמדובר בו.",
    ],
  },
  {
    id: "q4",
    question: "מדדת recall@k = 0.9 (המסמך הנכון נשלף כמעט תמיד) אבל faithfulness נמוך. מה השורש ההנדסי ואיך תתקן?",
    options: [
      "צריך להחליף את ה-embedding model — הבעיה ב-retrieval",
      "ה-retrieval דווקא תקין; הבעיה ב-generation — המודל לא נצמד ל-context. התיקון: לחזק grounding ב-system prompt ('ענה רק לפי המקור, אחרת אמור שאין מידע')",
      "צריך להקטין את גודל ה-chunks",
      "אין מה לעשות, זה מגבלה של המודל",
    ],
    correctIndex: 1,
    explanation:
      "recall גבוה אומר שהמידע הנכון כן הגיע לפרומפט — אז הבעיה אינה ב-retrieval. faithfulness נמוך מצביע שהמודל סוטה מהמקור. זו בדיוק המסקנה שהפרדת המדדים מאפשרת: לא לגעת ב-embeddings/chunking, אלא לחזק את ההנחיה ל-grounding ואולי להוסיף שלב אימות שכל טענה נתמכת במקור.",
    optionNotes: [
      "לא נכון: recall@k = 0.9 מוכיח שה-retrieval עובד. החלפת embeddings תתקן רכיב שאינו שבור.",
      "התשובה הנכונה: recall גבוה + faithfulness נמוך = הבעיה ב-generation. מחזקים grounding ב-system prompt, לא נוגעים ב-retrieval.",
      "לא נכון: גודל chunk הוא כלי retrieval; כאן ה-retrieval כבר מוצלח (recall 0.9), אז זה לא המקום לתקן.",
      "לא נכון: זו לא 'מגבלת מודל' בלתי-פתירה — הנחיית grounding קפדנית מפחיתה דרמטית סטייה מהמקור.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: למה 'נשמע טוב' זה לא מדד", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "metrics",
    label: "ארבעת המדדים — retrieval מול generation",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          הערכת RAG מתחלקת לשתי משפחות מדדים, אחת לכל שלב. שים לב: שתי המשפחות הראשונות מודדות את
          <strong> ה-retrieval </strong>(האם נשלף המידע הנכון), ושתי האחרונות את <strong>ה-generation</strong>
          {" "}(מה המודל עשה עם המידע). זו בדיוק ההפרדה שמאפשרת אבחון:
        </p>
        <StepDiagram steps={METRIC_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: system prompt חלש מול חזק למניעת הזיה למרות RAG תקין",
    content: (
      <PromptComparisonLab
        title="למודל יש את המסמך הנכון — אבל האם הוא נצמד אליו?"
        unitLabel="System prompt"
        bad={{
          label: "בלי הנחיה מפורשת ל-grounding",
          content: `"ענה על שאלות לקוחות בהתבסס על המסמכים המצורפים."`,
          outcome: "המודל עלול 'למלא פערים' בעצמו אם המסמך לא מכסה הכל — למשל להוסיף פרטים סבירים-נשמעים שלא כתובים במפורש במסמך שסופק. faithfulness יורד, אבל התשובה נשמעת מצוין.",
        }}
        good={{
          label: "עם הנחיית grounding מפורשת (כמו במודול Prompt Engineering)",
          content: `"ענה אך ורק בהתבסס על המסמכים המצורפים. אם המידע
הדרוש לא מופיע בהם במפורש, אמור בבירור: 'אין לי מידע
מדויק על כך במאמרי העזרה' — אל תשלים פרטים בעצמך."`,
          outcome: "המודל נצמד בקפדנות למה שכתוב בפועל, ומודה כשאין לו תשובה — faithfulness עולה, וכשמודדים אותו זה נמדד בפועל.",
        }}
        takeaway="RAG טוב = retrieval טוב + system prompt שמכריח grounding קפדני. שני התנאים נחוצים יחד — retrieval מצוין עם system prompt חלש עדיין יכול להוליד הזיות, ורק מדידה נפרדת חושפת איזה מהשניים אשם."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הערכת RAG קיימת כי 'זה עובד על הדוגמה שבדקתי' לא אומר 'זה עובד תמיד' — כמו כל מערכת production, RAG צריך מדדים אובייקטיביים כדי לדעת מתי הוא נכשל ולמה, ובאיזה משני השלבים."
        alternatives="הערכה ידנית (לבדוק כמה דוגמאות בעין) — מהירה להתחיל, אבל לא סקלבילית ולא עקבית; מסגרות הערכה אוטומטיות (כמו RAGAS) מודדות recall/precision של retrieval ו-faithfulness/answer-relevance של generation בצורה שיטתית — לרוב בעזרת מודל 'שופט' (LLM-as-judge) שמקבל את השאלה, ה-context שנשלף והתשובה, ומדרג כל מדד."
        whenNotTo="למערכת RAG פנימית קטנה עם מעט שאלות סטנדרטיות — eval set ידני של כמה עשרות דוגמאות עשוי להספיק, בלי צורך במסגרת הערכה אוטומטית מלאה. גם 'שופט LLM' הוא overhead מיותר כשמדגם קטן וקבוע."
        commonMistakes="לבדוק רק את 'איכות התשובה הסופית' בלי להפריד בין retrieval ל-faithfulness — זה מוביל לתיקון הדבר הלא נכון (לשפר system prompt כשהבעיה היא embeddings גרועים, או להיפך). טעות נוספת: eval set שכולו שאלות 'קלות' עם כיסוי מלא — הוא לא בודק את המקרה החשוב באמת: שאלה בלי כיסוי, שבה המערכת חייבת להודות 'אין לי מידע'."
        performance="recall@k הוא לרוב צוואר הבקבוק: אם המסמך הנכון לא ב-top-k, שום שיפור ב-generation לא יעזור. לכן מודדים retrieval ראשון — הוא מגדיר את התקרה של כל השאר. אחרי שהוא טוב, מודדים ומשפרים generation."
        cost="הערכה אוטומטית עם מודל 'שופט' עולה קריאות API נוספות (אחת לכל מדד לכל דוגמה) — משתלם כשהמערכת חשובה מספיק והמדגם גדול, לא לפרויקט הדגמה קטן. eval set ידני קטן הוא כמעט חינם ומספק לרוב הפרויקטים בשלב מוקדם."
        security="eval set הוא גם רשת ביטחון נגד רגרסיה: כל שינוי ב-chunking/embeddings/prompt מורץ מולו לפני deploy, כדי לוודא ששיפור בשאלה אחת לא שבר חמש אחרות. בלעדיו, 'שיפור' עלול להיות נסיגה שקטה."
        realWorld="מערכות תמיכה AI אמיתיות (Intercom Fin, Zendesk AI) מריצות eval sets מתמשכים שמפרידים retrieval מ-generation — כי בקנה מידה מסחרי, הזיה שוטפת שנשענה על מקור שגוי היא נזק אמיתי ללקוח ולמותג."
      />
    ),
  },
  {
    id: "mistakes",
    label: "טעויות פרודקשן נפוצות",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 font-bold text-danger">מה שובר הערכת RAG בפועל</p>
          <ul className="space-y-1.5 text-sm">
            <li>מודדים רק ”התשובה נשמעה טובה” — מדד סובייקטיבי שמסתיר איזה שלב נכשל.</li>
            <li>לא מפרידים retrieval מ-generation — מתקנים את הרכיב הלא-נכון וחוזרים על הטעות.</li>
            <li>eval set כולו שאלות קלות עם כיסוי מלא — לא בודק את המקרה הקריטי של שאלה בלי כיסוי.</li>
            <li>סומכים על תשובה שוטפת ומשכנעת בלי לבדוק שהיא באמת נתמכת ב-context שנשלף.</li>
            <li>משנים chunking/embeddings/prompt בלי להריץ מחדש את ה-eval set — רגרסיה שקטה.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>בונים eval set קטן עם תשובות ידועות, כולל שאלות ללא כיסוי במכוון.</li>
            <li>מודדים recall@k / precision@k ל-retrieval בנפרד מ-faithfulness / answer-relevance ל-generation.</li>
            <li>מתקנים recall נמוך ב-embeddings/chunking/re-ranking, ו-faithfulness נמוך ב-system prompt.</li>
            <li>בודקים במפורש שכל טענה בתשובה נתמכת בציטוט מהמקור שנשלף.</li>
            <li>מריצים את ה-eval set כבדיקת רגרסיה לפני כל שינוי ב-pipeline.</li>
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
          ["recall@k", "מבין המסמכים הרלוונטיים באמת, איזה חלק הופיע ב-top-k שנשלפו. מודד אם המידע הנכון בכלל הגיע לפרומפט."],
          ["precision@k", "מבין ה-k שנשלפו, איזה חלק באמת רלוונטי. precision נמוך = רעש ב-context."],
          ["Faithfulness", "מידת הנאמנות של תשובת המודל למקורות שסופקו לו בפועל — כמה מהטענות נתמכות ב-context."],
          ["Answer-relevance", "האם התשובה בכלל עונה על מה שנשאל, בנפרד מהשאלה אם היא נאמנה למקור."],
          ["Retrieval failure", "כישלון במציאת המסמך הרלוונטי לשאלה — המידע הנכון לא הגיע לפרומפט."],
          ["Faithfulness failure", "המודל סוטה מהמקור שכן נמצא ומוסיף/משנה פרטים — 'הזיה' למרות context נכון."],
          ["Eval set", "אוסף שאלות עם תשובות/מקורות ידועים, שמריצים מולו את ה-pipeline למדידה עקבית ובדיקת רגרסיה."],
          ["LLM-as-judge", "שימוש במודל נוסף כ'שופט' שמדרג faithfulness/relevance של תשובה מול ה-context — הערכה אוטומטית שמחליפה בדיקה ידנית."],
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
    label: "משימה מעשית: בנה eval set ומדוד את שני השלבים בנפרד",
    content: (
      <RealWorldTask
        id="rag-evaluating-rag-quality"
        title="בנה eval set קטן ומדוד retrieval מול generation בנפרד"
        context="עבוד מול AtlasDesk (או כל מערכת RAG/chat שיש לך גישה אליה) יחד עם Claude Code. המטרה: להפסיק 'להתרשם' ולהתחיל למדוד — ולראות בעצמך שכישלון retrieval וכישלון generation דורשים תיקון שונה."
        steps={[
          "עם Claude Code, נסח eval set קטן של 8-10 שאלות: כמה עם תשובה מלאה במסמכים, כמה עם תשובה חלקית, ולפחות 2 שאלות שבמכוון אין להן כיסוי כלל. לכל שאלה רשום מראש איזה מסמך אמור להישלף (או 'אף אחד').",
          "הרץ כל שאלה. לכל אחת רשום שתי עמדות בנפרד: (א) retrieval — האם נשלף המסמך שציפית לו (זו מדידת recall בפועל, ידנית)? (ב) generation — האם התשובה נצמדה בדיוק למה שנשלף, בלי להוסיף פרטים (faithfulness)?",
          "מיין את הכישלונות לשתי ערימות: כישלונות retrieval (המסמך הנכון לא נשלף) מול כישלונות faithfulness (המסמך כן נשלף אבל המודל סטה ממנו).",
          "בדוק במיוחד את שאלות ה'ללא כיסוי': האם המערכת הודתה שאין מידע, או שהיא 'מילאה פער' בתשובה שוטפת ומשכנעת? זה בדיוק הכישלון המסוכן שלמדנו.",
          "בחר תיקון לפי הערימה הגדולה יותר: אם רוב הכשלים ב-retrieval — בקש מ-Claude Code לשפר chunking/embeddings/סף similarity. אם רובם ב-faithfulness — חזק את הנחיית ה-grounding ב-system prompt.",
          "הרץ את אותו eval set שוב אחרי התיקון, והשווה: השתפר המדד שכיוונת אליו? האם משהו אחר נסוג (רגרסיה)?",
        ]}
        successCriteria={[
          "יש לך eval set כתוב עם 8-10 שאלות, כולל שאלות ללא כיסוי, ולכל אחת מקור צפוי",
          "מדדת retrieval ו-generation בנפרד, ויודעת לומר על כל כישלון לאיזו משתי הקטגוריות הוא שייך",
          "מצאת לפחות מקרה אחד של 'תשובה שוטפת על מקור שגוי/חסר' ותפסת אותו במדידה, לא בהתרשמות",
          "התיקון שבחרת התאים לקטגוריית הכישלון הנפוצה, והרצת eval מחדש אישרה שיפור בלי רגרסיה",
        ]}
      />
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
          <li><strong>”נשמע טוב” זה לא מדד.</strong> תשובה שוטפת יכולה להישען על context שגוי — הכישלון המסוכן ביותר כי הוא לא נראה ככישלון.</li>
          <li>שני שלבים, שני כשלים: <strong>Retrieval</strong> (לא נשלף המידע הנכון) מול <strong>Generation/Faithfulness</strong> (נשלף אך המודל סטה ממנו).</li>
          <li>מודדים אותם <strong>בנפרד</strong>: recall@k / precision@k ל-retrieval, faithfulness / answer-relevance ל-generation — כדי לתקן את הרכיב הנכון.</li>
          <li>בונים <strong>eval set</strong> קטן (כולל שאלות ללא כיסוי) ומריצים אותו כבדיקת רגרסיה לפני כל שינוי ב-pipeline.</li>
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
          נסח 5 שאלות מקרה-קצה למערכת RAG שאתה מכיר או בונה — שאלות שבכוונה לא מכוסות במלואן
          במסמכים הקיימים. לכל שאלה רשום מה התשובה ה”נכונה” היא (לרוב: ”אין לי מידע על כך”).
          אלו יהיו ”בדיקות רגרסיה” שתוכל לחזור אליהן בכל פעם שאתה משנה את ה-pipeline.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          עכשיו שאתה יודע למדוד RAG — בפרויקט המסכם של המודול תחבר את הכל: תבדוק את ה-RAG החי של
          AtlasDesk על שלושת סוגי המקרים (כיסוי מלא / חלקי / ללא כיסוי), ותשפר אותו על סמך מה שמדדת.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
