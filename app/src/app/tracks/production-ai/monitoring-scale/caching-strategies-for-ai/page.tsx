"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "monitoring-scale",
  lessonSlug: "caching-strategies-for-ai",
  title: "אסטרטגיות Caching למערכות AI",
  objectives: [
    "להבין מתי אפשר לשמור תוצאה במטמון (caching) בקריאות AI",
    "להכיר prompt caching כתכונה ילידית של Claude API",
    "לזהות סיכוני caching (תשובות מיושנות, פרטיות)",
  ],
  estMinutes: 25,
  difficulty: "מתקדם",
  prerequisites: ["observability-fundamentals-for-ai"],
};

const SLIDES: Slide[] = [
  {
    title: "שני סוגי caching שונים",
    bullets: [
      "Response caching — שמירת תשובה שלמה לשאלה שכבר נשאלה בעבר. מסוכן עם תוכן דינמי (חיפוש סמנטי, נתונים משתנים) — תשובה ישנה עלולה להיות שגויה.",
      "Prompt caching (תכונה ילידית של Claude API) — שומר חלקים קבועים של הפרומפט (כמו system prompt ארוך) בין קריאות, כדי לא לעבד אותם מחדש כל פעם — חוסך עלות/זמן בלי הסיכון של תשובה מיושנת.",
    ],
  },
  {
    title: "מתי לא ל-cache",
    bullets: [
      "כל תוכן שתלוי בזמן/הקשר אישי (כמו RAG על מאמרי עזרה שמתעדכנים, או שיחה עם היסטוריה אישית) — cache עלול להחזיר מידע מיושן.",
      "מידע פרטי של משתמש אחד לא אמור 'לדלוף' דרך cache משותף למשתמש אחר.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה ההבדל בין response caching ל-prompt caching?",
    options: [
      "אין הבדל, שני המונחים מתארים את אותו דבר",
      "response caching שומר תשובה שלמה לשאלה (מסוכן עם תוכן דינמי); prompt caching שומר רק חלקים קבועים של הפרומפט (כמו system prompt) כדי לחסוך עיבוד חוזר, בלי לשמור את התשובה עצמה",
      "prompt caching קיים רק ב-GPT, לא ב-Claude",
      "response caching תמיד בטוח לשימוש בכל מקרה"
    ],
    correctIndex: 1,
    explanation: "response caching חוסך את כל הקריאה (מסוכן אם המידע משתנה); prompt caching חוסך רק את עיבוד החלק הקבוע, המודל עדיין 'חושב' תשובה טרייה.",
    optionNotes: [
      "לא נכון: יש הבדל מהותי במה שנשמר ומה הסיכון של כל שיטה.",
      "התשובה הנכונה: זו בדיוק ההבחנה — response caching שומר תוצאה סופית, prompt caching שומר רק את קידוד ה-context הקבוע.",
      "לא נכון: prompt caching הוא תכונה קיימת ב-Claude API עצמו.",
      "לא נכון: response caching מסוכן בדיוק כשהתוכן דינמי (כמו RAG) — הוא לא 'תמיד בטוח'.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: caching בזהירות", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "comparison",
    label: "השוואה: response caching נאיבי מול מודע-לסיכון",
    content: (
      <PromptComparisonLab
        title="Caching על חיפוש RAG ב-AtlasDesk"
        unitLabel="גישת caching"
        bad={{
          label: "response caching נאיבי על כל שאלה",
          content: `cache.set(question, ragResponse) // ל-24 שעות,
בלי קשר לתוכן`,
          outcome: "אם מאמר עזרה מתעדכן (מדיניות השתנתה), משתמשים ימשיכו לקבל תשובה מהמטמון הישן עד 24 שעות — מידע שגוי בפועל.",
        }}
        good={{
          label: "prompt caching על החלק הקבוע בלבד",
          content: `Claude API prompt caching על system prompt +
מאמרי העזרה (שמתעדכנים לעתים רחוקות) — השאלה
עצמה תמיד מעובדת טרייה`,
          outcome: "חוסך עלות/זמן על החלק שבאמת קבוע, בעוד שהתשובה בפועל תמיד מחושבת מחדש על סמך השאלה הספציפית ועדכנית למידע הנוכחי.",
        }}
        takeaway="caching טוב חוסך בדיוק את החלק שבאמת לא משתנה, ולא נוגע בחלק הדינמי — זה ההבדל בין חיסכון בטוח לסיכון של מידע מיושן."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="caching קיים כי חלקים מסוימים בעבודה עם AI (system prompts ארוכים, מסמכי context קבועים) חוזרים על עצמם בכל קריאה — אין טעם לעבד אותם מחדש בכל פעם."
        alternatives="בלי caching בכלל — פשוט יותר ובטוח יותר (אין סיכון תשובה מיושנת), אבל יקר יותר בקנה מידה."
        whenNotTo="לתוכן שמשתנה בתדירות גבוהה או תלוי-משתמש (כמו שיחה אישית) — caching שם מסוכן יותר משהוא שווה."
        commonMistakes="להשתמש ב-response caching על תוכן דינמי (כמו RAG) בלי TTL (זמן תפוגה) קצר מספיק — תשובות מיושנות שנראות 'תקינות' אבל שגויות."
        cost="prompt caching חוסך משמעותית בעלות עבור system prompts ארוכים שחוזרים על עצמם — משתלם בדיוק ב-AtlasDesk שיש לו system prompts ייעודיים לכל מצב (tools/RAG/agent)."
        realWorld="בפרויקט המודול הבא, כשתוסיף ניטור עלויות ל-AtlasDesk, תראה בדיוק כמה prompt caching היה יכול לחסוך."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="monitoring-caching-strategies-for-ai"
        title="זהה הזדמנויות caching ב-AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk."
        steps={[
          "עם Claude Code, עברו על כל נתיבי ה-API של AtlasDesk וזהו: אילו חלקים מה-system prompts קבועים וחוזרים בכל קריאה?",
          "דון: האם prompt caching היה משתלם על אחד מהם? חשבו את התדירות (כמה פעמים ביום זה נקרא).",
        ]}
        successCriteria={[
          "זיהית לפחות חלק אחד קבוע שמתאים ל-caching",
          "יש לך הערכה (גסה) אם זה משתלם כלכלית",
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
          חשוב על אפליקציה שאתה מכיר שסובלת מ'מידע מיושן' (cache שלא התעדכן). מה היה הפתרון
          הנכון — TTL קצר יותר, או invalidation יזום כשהמידע משתנה?
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
