"use client";

import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { SemanticSearchLab } from "@/components/playground/semantic-search-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "ai-integration",
  moduleSlug: "embeddings-vector-db",
  lessonSlug: "project-atlasdesk-semantic-search",
  title: "פרויקט מודול: חיפוש סמנטי במאמרי העזרה של AtlasDesk",
  objectives: [
    "לתכנן ולממש embeddings + pgvector עבור מאמרי עזרה ב-AtlasDesk",
    "לבנות endpoint חיפוש סמנטי אמיתי (לא רק התאמת מילות מפתח)",
    "להשוות תוצאות חיפוש מילולי מול חיפוש סמנטי על אותה שאילתה",
  ],
  estMinutes: 45,
  difficulty: "מתקדם",
  prerequisites: ["vector-databases"],
};

const SLIDES: Slide[] = [
  {
    title: "מה כבר נבנה, ומה עדיין שלך לעשות",
    bullets: [
      "כבר קיים: /api/ai/semantic-search — endpoint אמיתי שמחשב embeddings אמיתיים (OpenAI text-embedding-3-small) ומחזיר את מאמרי העזרה הכי דומים לשאילתה שלך.",
      "שים לב: זה דורש OPENAI_API_KEY (נפרד מ-ANTHROPIC_API_KEY שכבר מוגדר ל-AtlasDesk) — אם הוא לא מוגדר בסביבה שלך, תקבל הודעה ברורה שהחיפוש הסמנטי לא מחובר, בדיוק כמו שראית עם Claude API בתחילת האקדמיה.",
      "המשימה שלך: להבין את המימוש הקיים, ואז — עם Claude Code — להעביר את זה מ-'מחשב embeddings בכל בקשה' ל-'שומר embeddings מראש ב-pgvector' (זה מה שבאמת קורה בפרודקשן אמיתי).",
    ],
  },
  {
    title: "למה הפרויקט הזה, וה-trade-off המרכזי בו",
    bullets: [
      "למה זה שווה: זה מחבר שלושה שיעורים (embeddings, similarity, pgvector) לקוד production אחד שרץ באמת — וזו בדיוק התשתית שעליה ייבנה מודול ה-RAG הבא.",
      "ה-trade-off ההנדסי המרכזי: לחשב embeddings בזמן-אמת (פשוט, אך יקר ואיטי ככל שגדלים) מול לחשב-פעם-אחת-ולשמור (pre-compute) — מעט יותר תשתית (migration, סקריפט re-embed), תמורת חיפוש מהיר וזול בכל בקשה. המעבר לגישה השנייה הוא לב הפרויקט.",
      "מדד ההצלחה הוא לא 'זה עובד' אלא 'זה עובד בקנה מידה' — אותן תוצאות, בלי לשלוח את תוכן המאמרים ל-API בכל שאילתה.",
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה המימוש הנוכחי (/api/ai/semantic-search) לא אופטימלי לפרודקשן אמיתי בקנה מידה גדול?",
    options: [
      "הוא לא עובד בכלל, יש בו באג",
      "הוא מחשב embedding מחדש לכל מאמרי העזרה בכל בקשה, במקום לשמור אותם מראש (pre-computed) ב-pgvector ולחפש רק מול embedding השאילתה",
      "הוא לא תומך בעברית",
      "הוא לא משתמש ב-Claude API בכלל",
    ],
    correctIndex: 1,
    explanation: "בכל קריאה, המימוש הנוכחי שולח את כל טקסטי המאמרים ל-API חישוב embeddings מחדש — בזבזני וכן איטי; הפתרון הנכון לפרודקשן: לחשב embeddings פעם אחת (כשמאמר נוצר/מתעדכן) ולשמור ב-pgvector.",
    optionNotes: [
      "לא נכון: הקוד עובד כמתוכנן (עם מפתח OpenAI) — הבעיה היא יעילות, לא תקינות.",
      "התשובה הנכונה: זה בדיוק הפער בין 'הדגמה שעובדת' ל'ארכיטקטורת פרודקשן' — לחשב embeddings פעם אחת ולשמור, לא בכל בקשה.",
      "לא נכון: embeddings ו-cosine similarity לא תלויים בשפה — התהליך עובד על עברית בדיוק כמו על כל שפה אחרת.",
      "לא נכון: זה בכוונה לא משתמש ב-Claude (Anthropic אינו מספק embeddings) — זה נכון ומתועד, לא באג.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: הפרויקט המסכם של המודול", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "lab",
    label: "מעבדה חיה: חיפוש מילולי מול סמנטי על מאמרי AtlasDesk",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          נסה ”איך מבטלים מנוי” — שים לב שהחיפוש המילולי לא מוצא את המאמר הרלוונטי
          (”הליך סיום התחייבות חודשית”), אבל החיפוש הסמנטי כן (אם הוגדר OPENAI_API_KEY).
        </p>
        <SemanticSearchLab />
      </div>
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="פרויקט זה קיים כדי לחבר בין תיאוריה (embeddings, similarity, pgvector) לקוד production אמיתי שרץ ב-AtlasDesk — כולל ההחלטה ההנדסית להשתמש ב-OpenAI ל-embeddings לצד Anthropic לשיחה, כי כל שירות מתמחה במה שהוא הכי טוב בו."
        alternatives="אפשר היה לחכות ל-embeddings ילידיים מ-Anthropic (אם/כשיהיו) — אבל 'לחכות למוצר שאולי יגיע' הוא לרוב החלטה הנדסית גרועה יחסית לפתרון קיים ועובד היום."
        whenNotTo="למאגר קטן מאוד וקבוע (כמו 5 מאמרי העזרה בהדגמה כאן) — חישוב embeddings בכל בקשה בפועל לא נורא; זה נהיה בעיה אמיתית רק כשיש מאות/אלפי מאמרים."
        commonMistakes="לשלוח את כל תוכן האתר ל-API embeddings כל פעם שמשהו משתנה, במקום embeddings incremental (רק המסמכים שהשתנו) — בזבוז עלות וזמן."
        cost="כל קריאת embedding עולה טוקנים (זול משמעותית מקריאת שיחה מלאה, אבל לא חינם) — עדכון pgvector פעם אחת בכתיבה במקום בכל קריאה הוא גם חיסכון עלות משמעותי, לא רק ביצועים."
        realWorld="זו בדיוק הארכיטקטורה שמוצרי AI תמיכה אמיתיים (Intercom, Zendesk AI ודומיהם) משתמשים בה — RAG על בסיס embeddings שמורים מראש, לא מחושבים בזמן אמת."
      />
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "המשימה המרכזית של המודול",
    content: (
      <RealWorldTask
        id="embeddings-project-atlasdesk-semantic-search"
        title="שדרג את חיפוש AtlasDesk ל-embeddings שמורים מראש (pgvector)"
        context="עבוד מול הריפו האמיתי של AtlasDesk. המימוש הנוכחי (/api/ai/semantic-search) מחשב embeddings בכל בקשה — המשימה שלך: לשפר אותו."
        steps={[
          "בקש מ-Claude Code לתכנן migration ל-Supabase: טבלת help_articles עם עמודת embedding מסוג vector (pgvector), ולהסביר את הבחירה.",
          "בקש ממנו סקריפט חד-פעמי שמחשב embedding לכל מאמר קיים (מ-lib/atlasdesk/help-articles.ts) ושומר אותו בטבלה החדשה.",
          "עדכן את /api/ai/semantic-search כך שיחשב embedding רק לשאילתה, ויחפש מול הטבלה עם pgvector (ORDER BY embedding <-> query_embedding) — לא לחשב embeddings למאמרים בכל בקשה.",
          "בדוק שהתוצאות זהות במהות לגרסה הקודמת, אבל מהירות יותר ופחות בזבזניות בטוקנים.",
        ]}
        successCriteria={[
          "יש migration אמיתי לטבלה עם עמודת vector",
          "החיפוש בפועל לא שולח יותר את תוכן המאמרים ל-API embeddings בכל בקשה",
          "אתה מבין ויכול להסביר למה זו ארכיטקטורה נכונה יותר לפרודקשן",
        ]}
      />
    ),
  },
  {
    id: "homework",
    label: "סיכום מודול",
    content: (
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <p className="font-semibold">סיימת את מודול Embeddings ומסדי נתונים וקטוריים!</p>
        <p className="mt-1 text-muted">
          למדת: מהם embeddings, איך מסדי נתונים וקטוריים עובדים, ובנית חיפוש סמנטי אמיתי
          ב-AtlasDesk. במודול הבא (RAG) נשתמש בדיוק ביכולת הזו כדי ש-AtlasDesk יענה ללקוחות מתוך
          בסיס הידע האמיתי שלו — לא רק מהידע הכללי של המודל.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
