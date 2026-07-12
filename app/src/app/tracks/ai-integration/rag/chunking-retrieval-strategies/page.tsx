"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "rag",
  lessonSlug: "chunking-retrieval-strategies",
  title: "אסטרטגיות Chunking ו-Retrieval",
  objectives: [
    "להבין למה גודל chunk משפיע דרמטית על איכות RAG",
    "להכיר אסטרטגיות overlap ו-re-ranking",
    "להשוות chunking נאיבי (לפי אורך קבוע) מול chunking מודע-מבנה",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["rag-anatomy"],
};

const SLIDES: Slide[] = [
  {
    title: "הדילמה: chunk גדול מול chunk קטן",
    bullets: [
      "chunk קטן מדי (משפט בודד) — מאבד context. 'הוא סירב' — מי זה 'הוא'? בלי המשפט הקודם, ה-chunk חסר משמעות.",
      "chunk גדול מדי (עמוד שלם) — 'מדלל' את הרלוונטיות. אם רק משפט אחד מתוך העמוד רלוונטי לשאלה, שאר העמוד הוא 'רעש' שתופס מקום ב-context ועלול להטעות.",
      "אין 'גודל נכון' אוניברסלי — זה תלוי בסוג התוכן (פסקאות טכניות קצרות מול נרטיב ארוך) ובאורך התשובה הצפוי.",
    ],
  },
  {
    title: "Overlap — חפיפה בין chunks סמוכים",
    bullets: [
      "אם מפצלים חופשי בדיוק כל 500 מילים, מידע קריטי עלול 'להיחתך' בדיוק על הגבול בין שני chunks — ואז אף chunk לא מכיל את המידע השלם.",
      "פתרון: overlap — כל chunk חדש מתחיל קצת לפני שהקודם נגמר (למשל 50 מילים חפיפה), כדי שמידע לא ייחתך בדיוק על התפר.",
    ],
  },
  {
    title: "Re-ranking — שיפור סדר התוצאות",
    bullets: [
      "retrieval ראשוני (embeddings) מהיר אבל לא תמיד מדויק לחלוטין — לפעמים ה-chunk הכי רלוונטי באמת הוא לא בהכרח הכי גבוה ב-similarity הראשוני.",
      "re-ranking: לוקחים את ה-K תוצאות המובילות (למשל top-20) ומריצים עליהן מודל 'שני', מדויק יותר (אך יקר יותר), שממיין מחדש רק את הקבוצה הקטנה הזו.",
      "זו פשרת עלות/דיוק קלאסית: retrieval ראשוני זול על הרבה מסמכים, re-ranking יקר יותר אבל רק על קבוצה קטנה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה overlap בין chunks סמוכים חשוב?",
    options: [
      "כדי לחסוך מקום אחסון",
      "כדי למנוע מצב שמידע קריטי נחתך בדיוק על הגבול בין שני chunks ונאבד מכל אחד מהם",
      "כדי להאיץ את חישוב ה-embeddings",
      "זה לא באמת משנה, ניתן לדלג עליו תמיד",
    ],
    correctIndex: 1,
    explanation: "בלי overlap, פיצול 'עיוור' עלול לחתוך משפט/רעיון בדיוק בגבול, כך שאף chunk לא מכיל את המידע השלם.",
    optionNotes: [
      "לא נכון: overlap דווקא מוסיף מקום אחסון (יש כפילות מכוונת בין chunks), לא חוסך.",
      "התשובה הנכונה: overlap הוא בדיוק ההגנה מפני 'קיטוע' מידע שקורה בגבול בין chunks סמוכים.",
      "לא נכון: overlap לא משפיע על מהירות חישוב embeddings — הוא משפיע על שלמות המידע בכל chunk.",
      "לא נכון: overlap כן משנה משמעותית — דילוג עליו יכול לגרום לאיבוד מידע קריטי שנחתך בין chunks.",
    ],
  },
  {
    id: "q2",
    question: "מה תפקיד ה-re-ranking בשלב הretrieval?",
    options: [
      "להחליף לגמרי את חיפוש ה-embeddings",
      "לקחת קבוצה קטנה של מועמדים מובילים ולמיין אותם מחדש במודל מדויק (ויקר) יותר, כפשרת עלות/דיוק",
      "לפצל מסמכים ל-chunks קטנים יותר",
      "לחשב embeddings מהר יותר",
    ],
    correctIndex: 1,
    explanation: "re-ranking הוא שלב נוסף, לא תחליף — retrieval ראשוני זול על הרבה מסמכים, ואז re-ranking יקר יותר רק על קבוצה קטנה שכבר סוננה.",
    optionNotes: [
      "לא נכון: re-ranking בא בנוסף לretrieval הראשוני, לא במקומו — retrieval עדיין נחוץ כדי לצמצם את מרחב החיפוש קודם.",
      "התשובה הנכונה: זו בדיוק הפשרה — retrieval זול על כמות גדולה, re-ranking יקר יותר אבל רק על קבוצה קטנה שכבר סוננה.",
      "לא נכון: זה תפקיד ה-chunking, לא ה-re-ranking.",
      "לא נכון: re-ranking בדרך כלל מוסיף עלות חישובית (מודל שני), לא מאיץ את חישוב ה-embeddings.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: אסטרטגיות chunking ו-retrieval", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: chunking נאיבי מול מודע-מבנה",
    content: (
      <PromptComparisonLab
        title="פיצול מאמר עזרה ארוך לchunks"
        unitLabel="אסטרטגיית chunking"
        bad={{
          label: "פיצול נאיבי (כל 500 תווים בדיוק)",
          content: `מאמר: "... כדי לבטל מנוי, פנה להגדרות
החשבון ולחץ" | "על 'ביטול מנוי'. שים לב שהביטול
ייכנס לתוקף ..."`,
          outcome: "המשפט 'לחץ על ביטול מנוי' נחתך בדיוק על הגבול — chunk אחד מסתיים ב'ולחץ', השני מתחיל ב'על ביטול מנוי'. שניהם חסרי משמעות בפני עצמם.",
        }}
        good={{
          label: "פיצול מודע-מבנה (לפי פסקאות/כותרות) + overlap",
          content: `Chunk 1: "כדי לבטל מנוי, פנה להגדרות החשבון
ולחץ על 'ביטול מנוי'."
Chunk 2 (עם overlap): "...לחץ על 'ביטול מנוי'.
שים לב שהביטול ייכנס לתוקף בסוף מחזור החיוב."`,
          outcome: "כל chunk הוא יחידת מידע שלמה ומובנת בפני עצמה — retrieval ימצא chunk שלם ורלוונטי, לא חצי-משפט חסר הקשר.",
        }}
        takeaway="chunking נאיבי (רק לפי אורך) הוא הכי קל למימוש, אבל chunking מודע-מבנה (לפי פסקאות/כותרות טבעיות) + overlap מייצר chunks שהם באמת יחידות מידע שלמות — ההבדל הזה קובע את איכות ה-RAG כולו."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="אסטרטגיית chunking קיימת כי retrieval יכול להיות טוב רק כמו איכות ה-chunks שהוא בוחר מתוכם — 'garbage in, garbage out' חל כאן במלואו."
        alternatives="chunking נאיבי (לפי אורך קבוע) הוא הכי מהיר למימוש ועובד סביר לתוכן פשוט — chunking מודע-מבנה (לפי כותרות/פסקאות) דורש יותר עבודה אבל מייצר תוצאות משמעותית טובות יותר לתוכן מובנה."
        whenNotTo="למסמכים קצרים מאוד (פסקה אחת, FAQ בודד) — chunking בכלל מיותר, אפשר להזרים את המסמך השלם כ-chunk יחיד."
        commonMistakes="לבחור גודל chunk אחד קבוע לכל סוגי התוכן — מסמך טכני צפוף ומאמר נרטיבי ארוך צריכים גדלי chunk שונים לגמרי כדי לשמר משמעות."
        cost="chunks קטנים יותר = יותר embeddings לחשב (יקר יותר מראש) אבל retrieval מדויק יותר; chunks גדולים = פחות embeddings אבל retrieval פחות ממוקד. אין 'חינם' — כל בחירה משלמת מחיר במקום אחר."
        realWorld="בפרויקט המודול תבחן את מאמרי העזרה של AtlasDesk — הם קצרים מספיק (כמה משפטים) שלא צריך chunking מורכב, אבל ההבנה כאן קריטית ברגע שמוסיפים תיעוד ארוך יותר."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "glossary",
    label: "מונחון",
    content: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Overlap", "חפיפה מכוונת בין chunks סמוכים כדי למנוע קיטוע מידע."],
          ["Re-ranking", "מיון מחדש של תוצאות retrieval ראשוניות במודל מדויק יותר."],
          ["Chunking מודע-מבנה", "פיצול לפי יחידות טבעיות (פסקאות/כותרות) במקום אורך קבוע."],
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
        id="rag-chunking-retrieval-strategies"
        title="תרגל אסטרטגיית chunking על תוכן אמיתי"
        context="קח מסמך ארוך אמיתי (README גדול, מאמר, תיעוד) — לא חייב להיות קשור ל-AtlasDesk."
        steps={[
          "בקש מ-Claude Code לפצל את המסמך ל-chunks לפי אורך קבוע (למשל 300 מילים) — בלי מודעות למבנה.",
          "עבור על התוצאות: מצא לפחות chunk אחד שנחתך באמצע רעיון/משפט בצורה שפוגעת בהבנה.",
          "בקש מ-Claude Code לפצל מחדש לפי כותרות/פסקאות טבעיות, עם overlap קטן.",
          "השווה את שתי הגרסאות: איזו מהן מייצרת יחידות מידע שלמות יותר?",
        ]}
        successCriteria={[
          "מצאת בפועל דוגמה לבעיית קיטוע ב-chunking נאיבי",
          "יש לך גרסת chunking שנייה, מודעת-מבנה, לאותו מסמך",
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
          כתוב לעצמך כלל אצבע: איזה גודל chunk והאם overlap היית משתמש עבור (א) תיעוד API טכני,
          (ב) פוסטים בבלוג, (ג) שאלות נפוצות קצרות. נמק כל בחירה במשפט אחד.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
