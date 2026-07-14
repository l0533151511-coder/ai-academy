"use client";

import { Database, Layers, Search, Fingerprint, AlertTriangle, Timer, Zap, ShieldAlert } from "lucide-react";
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
  lessonSlug: "caching-strategies-for-ai",
  title: "אסטרטגיות Caching למערכות AI",
  objectives: [
    "להבחין בין שלושת סוגי ה-caching: prompt caching, exact-match caching, ו-semantic caching",
    "להכיר prompt caching כתכונה ילידית של Claude API — ומה החיסכון האמיתי שהוא נותן",
    "להבין את חילופי-התמורה (trade-offs): staleness, cache invalidation, ו-false hits בקאש סמנטי",
    "לזהות מתי caching מסוכן — תוכן מותאם-אישית, תלוי-זמן, או רגיש",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["observability-fundamentals-for-ai"],
};

const SLIDES: Slide[] = [
  {
    title: "הבעיה: אתה משלם שוב ושוב על אותה עבודה",
    bullets: [
      "בשיעור הקודם מדדנו עלות וטוקנים. עכשיו מסתכלים בנתונים ורואים: אותו system prompt בן 2,000 טוקנים נשלח מחדש בכל קריאה, ואותן שאלות נפוצות נענות שוב ושוב מאפס.",
      "Caching = לא לחזור על עבודה שכבר עשית. אבל ב-AI זה עדין: תשובה שמורה יכולה להיות שגויה אם המידע מאחוריה השתנה.",
      "השאלה ההנדסית אינה ’האם ל-cache’ אלא ’מה בדיוק קבוע מספיק כדי לשמור, ומה חייב להיות טרי’.",
    ],
  },
  {
    title: "שלוש שכבות caching — מהזול-והבטוח לחכם-והמסוכן",
    bullets: [
      "Prompt caching (ילידי ב-Claude API) — שומר את קידוד החלק הקבוע של הפרומפט (system prompt ארוך, מסמכי context). המודל עדיין מחשב תשובה טרייה. חיסכון גדול, כמעט בלי סיכון.",
      "Exact-match caching — אם בדיוק אותה שאלה נשאלה, החזר את התשובה השמורה. פשוט ובטוח יחסית, אבל תופס רק חזרות מדויקות מילה-במילה.",
      "Semantic caching — אם שאלה דומה משמעותית נשאלה (לפי embedding), החזר את אותה תשובה. חוסך הכי הרבה — אבל מכניס סיכון של ’פגיעה שקרית’ (false hit) על שאלות שרק נראות דומות.",
    ],
  },
  {
    title: "החיסכון אמיתי — וכך גם הסיכון",
    bullets: [
      "prompt caching על system prompt של 2K טוקנים שחוזר אלפי פעמים ביום = חיסכון עלות/latency דרמטי על החלק שממילא זהה.",
      "response caching (exact/semantic) על שאלות FAQ נפוצות = תשובה מיידית בעלות אפס — כשהמידע יציב.",
      "אבל: מאמר עזרה מתעדכן, מדיניות משתנה, או שני משתמשים שונים — וה-cache מגיש מידע מיושן/שגוי/של מישהו אחר. staleness ו-false hit הם המחיר.",
    ],
  },
];

const CACHE_STEPS: DiagramStep[] = [
  {
    icon: Layers,
    label: "Prompt caching",
    detail: "שומר את קידוד החלק הקבוע (system prompt, מסמכי context). המודל עדיין מייצר תשובה טרייה — לכן אין סיכון staleness בתשובה. הבטוח והמשתלם ביותר להתחיל ממנו.",
  },
  {
    icon: Fingerprint,
    label: "Exact-match",
    detail: "מפתח = השאלה המדויקת. אם אותה מחרוזת בדיוק חוזרת — מחזירים תשובה שמורה. בטוח יחסית, אבל ’איך מבטלים חשבון?’ ו’איך אני מבטל חשבון?’ ייחשבו שונים.",
  },
  {
    icon: Search,
    label: "Semantic",
    detail: "מפתח = embedding של השאלה. שאלה קרובה-מספיק מקבלת את התשובה השמורה. חוסך הכי הרבה — אבל סף-דמיון רופף מדי גורם ל-false hit: תשובה נכונה לשאלה קצת אחרת.",
  },
  {
    icon: Timer,
    label: "Invalidation / TTL",
    detail: "כל cache חייב מנגנון תפוגה: TTL (זמן חיים) קצר מספיק, או invalidation יזום כשהמקור משתנה. בלי זה — מידע מיושן שנראה תקין. זה החלק הקשה באמת ב-caching.",
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
      "response caching תמיד בטוח לשימוש בכל מקרה",
    ],
    correctIndex: 1,
    explanation:
      "response caching חוסך את כל הקריאה (ולכן מסוכן אם המידע השתנה — התשובה השמורה כבר שגויה); prompt caching חוסך רק את עיבוד החלק הקבוע, בעוד שהמודל עדיין ’חושב’ תשובה טרייה על סמך השאלה הנוכחית. לכן prompt caching בטוח בהרבה מבחינת staleness.",
    optionNotes: [
      "לא נכון: יש הבדל מהותי גם במה שנשמר (תשובה מול קידוד context) וגם בסיכון של כל שיטה.",
      "התשובה הנכונה: זו בדיוק ההבחנה — response caching שומר תוצאה סופית, prompt caching שומר רק את קידוד ה-context הקבוע והתשובה נשארת טרייה.",
      "לא נכון: prompt caching הוא תכונה ילידית קיימת ב-Claude API עצמו.",
      "לא נכון: response caching מסוכן דווקא כשהתוכן דינמי (כמו RAG על מאמרים שמתעדכנים) — הוא לא ’תמיד בטוח’.",
    ],
  },
  {
    id: "q2",
    question: "מהו הסיכון הייחודי של semantic caching שאין ב-exact-match caching?",
    options: [
      "הוא צורך יותר מקום בדיסק",
      "’פגיעה שקרית’ (false hit): שתי שאלות נראות דומות לפי embedding אך דורשות תשובה שונה — והמשתמש מקבל תשובה שגויה לשאלה שלו",
      "הוא לא עובד בעברית",
      "אין לו סיכון כלשהו, הוא תמיד מדויק יותר",
    ],
    correctIndex: 1,
    explanation:
      "exact-match מחזיר תשובה שמורה רק כשהשאלה זהה מילה-במילה, ולכן כמעט לא טועה בזיהוי. semantic cache מתאים לפי דמיון embedding — וסף רופף מדי גורם לכך ש’איך מאפסים סיסמה’ יקבל את התשובה של ’איך משנים סיסמה’, שאלות שנראות דומות אך דורשות מהלך אחר. זה ה-false hit.",
    optionNotes: [
      "לא נכון: מקום בדיסק זניח; הסיכון האמיתי הוא נכונות התשובה.",
      "התשובה הנכונה: false hit — התאמה סמנטית שגויה — הוא הסיכון הייחודי של קאש סמנטי.",
      "לא נכון: הבעיה אינה שפה; היא סף-הדמיון והדמיון המדומה בין שאלות.",
      "לא נכון: דווקא הגמישות הסמנטית היא שמכניסה את סיכון ה-false hit.",
    ],
  },
  {
    id: "q3",
    question: "באילו מקרים caching של תשובות (response caching) מסוכן ולא כדאי?",
    options: [
      "רק כשאין מספיק זיכרון בשרת",
      "כשהתשובה מותאמת-אישית למשתמש, תלוית-זמן, או נשענת על מקור שמתעדכן — cache עלול להגיש מידע מיושן, שגוי, או של משתמש אחר",
      "caching של תשובות אף פעם לא מסוכן",
      "רק כשמשתמשים ב-Claude ולא במודל אחר",
    ],
    correctIndex: 1,
    explanation:
      "response caching בטוח כשהתשובה זהה עבור כולם ויציבה בזמן (למשל שאלת FAQ על תכונה קבועה). הוא מסוכן כשהתשובה אישית (’מה יתרת החשבון שלי’), תלוית-זמן (’מה מזג האוויר’), או נשענת על מקור משתנה (RAG על מדיניות שהתעדכנה). במקרים אלה מעדיפים prompt caching בלבד, או TTL קצר מאוד עם invalidation יזום.",
    optionNotes: [
      "לא נכון: זיכרון הוא שיקול תפעולי, לא הסיכון המהותי של תשובה שגויה.",
      "התשובה הנכונה: אישי / תלוי-זמן / מקור-משתנה — שלושת המצבים שבהם תשובה שמורה הופכת לשגויה.",
      "לא נכון: response caching בהחלט מסוכן במצבים דינמיים/אישיים.",
      "לא נכון: הסיכון נובע מטבע התוכן, לא מזהות ספק המודל.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: caching בזהירות", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "layers",
    label: "שכבות ה-caching — דיאגרמה",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          לא כל caching נולד שווה. סדר אותם מהבטוח-והזול (prompt caching) אל החכם-והמסוכן (semantic),
          וזכור שהחלק הקשה תמיד הוא לא ה-hit — אלא ה-invalidation.
        </p>
        <StepDiagram steps={CACHE_STEPS} />
      </div>
    ),
  },
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
בלי קשר לתוכן ובלי invalidation כשמאמר מתעדכן`,
          outcome:
            "כשמאמר עזרה מתעדכן (מדיניות ההחזרים השתנתה), משתמשים ימשיכו לקבל את התשובה מהמטמון הישן עד 24 שעות — מידע שגוי בפועל, שנראה תקין לחלוטין.",
        }}
        good={{
          label: "prompt caching על החלק הקבוע בלבד",
          content: `Claude API prompt caching על system prompt +
מאמרי העזרה (מתעדכנים לעתים רחוקות). השאלה
עצמה תמיד מעובדת טרייה, ו-invalidation יזום
מנקה את ה-cache כשמאמר משתנה`,
          outcome:
            "חוסכים עלות/זמן על החלק שבאמת קבוע, בעוד שהתשובה בפועל מחושבת מחדש בכל פעם על סמך השאלה הספציפית — ותמיד משקפת את המידע העדכני.",
        }}
        takeaway="caching טוב חוסך בדיוק את החלק שבאמת לא משתנה, ולא נוגע בחלק הדינמי — זה ההבדל בין חיסכון בטוח לבין סיכון של מידע מיושן שנראה תקין."
      />
    ),
  },
  {
    id: "tradeoffs",
    label: "חילופי-התמורה שחייבים לשקול",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Zap size={16} /> החיסכון (הצד המפתה)
          </p>
          <p className="text-sm text-muted">
            prompt caching על context קבוע: חיסכון עלות/latency דרמטי על טוקנים שחוזרים. response
            caching על FAQ נפוץ: תשובה מיידית כמעט בעלות אפס. בקנה מידה של אלפי קריאות/יום — משמעותי מאוד.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Timer size={16} /> Staleness (מידע מיושן)
          </p>
          <p className="text-sm text-muted">
            תשובה שמורה נכונה רק כל עוד המקור לא השתנה. TTL קצר מפחית סיכון אך גם מפחית חיסכון;
            invalidation יזום מדויק יותר אך דורש ’לדעת’ מתי המקור משתנה — וזה לא תמיד קל.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Search size={16} /> False hits (קאש סמנטי)
          </p>
          <p className="text-sm text-muted">
            סף-דמיון גבוה מדי = כמעט אף פעם לא פוגע (אין חיסכון). נמוך מדי = מגיש תשובה של שאלה
            אחרת. הכיול הזה הוא ההבדל בין קאש סמנטי מועיל למסוכן — ומודדים אותו מול נתונים אמיתיים.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <ShieldAlert size={16} /> פרטיות ובידוד משתמשים
          </p>
          <p className="text-sm text-muted">
            cache משותף חייב מפתח שכולל את זהות/הרשאות המשתמש כשהתשובה אישית — אחרת תשובתו של משתמש
            אחד תדלוף למשתמש אחר. לתוכן אישי, לרוב עדיף לוותר על response caching לגמרי.
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
        why="caching קיים כי חלקים מסוימים בעבודה עם AI (system prompts ארוכים, מסמכי context קבועים, שאלות FAQ חוזרות) חוזרים על עצמם — ואין טעם לשלם עבור אותה עבודה שוב ושוב."
        alternatives="בלי caching בכלל — פשוט ובטוח יותר (אין staleness ואין false hits), אבל יקר יותר בקנה מידה. ההחלטה תלויה ביחס בין תדירות החזרות לסיכון של תשובה מיושנת."
        whenNotTo="לתוכן שמשתנה בתדירות גבוהה, תלוי-זמן, או אישי-למשתמש (שיחה עם היסטוריה, יתרת חשבון) — response caching שם מסוכן יותר משהוא שווה. במקרים אלה השאר את prompt caching בלבד."
        commonMistakes="response caching על תוכן דינמי (RAG) בלי TTL/invalidation — תשובות מיושנות שנראות תקינות; סף-דמיון רופף בקאש סמנטי שמייצר false hits; cache משותף בלי מפתח-משתמש שמדליף תשובות אישיות."
        performance="prompt caching מקצץ latency על החלק הקבוע (המודל לא מקודד מחדש context ארוך); response cache hit מחזיר בזמן אפס-מודל. p95 משתפר משמעותית כשה-hit-rate גבוה — מדוד את ה-hit-rate, לא רק את הקיום."
        cost="prompt caching על system prompt ארוך שחוזר אלפי פעמים ביום הוא החיסכון הגדול והבטוח ביותר — משתלם בדיוק ב-AtlasDesk שיש לו system prompts ייעודיים לכל מצב (tools/RAG/agent)."
        security="cache הוא מאגר תשובות — אם התשובות מכילות מידע אישי, ה-cache הוא וקטור דליפה. הפרד לפי זהות/הרשאות, אל תשתף בין משתמשים תשובות אישיות, והחל retention על תוכן רגיש."
        realWorld="Claude API מציע prompt caching מובנה; מסביב ל-response/semantic caching צצו כלים (GPTCache ודומיו) שבונים cache סמנטי מעל embeddings. בפרויקט המודול תזהה איפה ב-AtlasDesk כדאי להפעיל את זה."
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
            <li>response caching על RAG בלי invalidation — מדיניות משתנה, ה-cache עדיין מגיש את הישנה.</li>
            <li>קאש סמנטי עם סף רופף — false hits שמגישים תשובה קרובה אך שגויה.</li>
            <li>cache משותף בלי מפתח-משתמש — תשובה אישית של אחד דולפת לאחר.</li>
            <li>מודדים ’יש cache’ אך לא את ה-hit-rate — cache שכמעט לא פוגע חוסך אפס.</li>
            <li>מתאמצים לעשות response caching מסוכן, במקום prompt caching בטוח שנותן רוב החיסכון.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 font-bold text-success">איך מקצוענים עושים זאת</p>
          <ul className="space-y-1.5 text-sm">
            <li>מתחילים מ-prompt caching על ה-context הקבוע — רוב החיסכון, כמעט בלי סיכון.</li>
            <li>response caching רק על תוכן יציב ולא-אישי, עם TTL/invalidation מוגדר.</li>
            <li>מכיילים סף-דמיון סמנטי מול נתונים אמיתיים ומודדים false-hit-rate.</li>
            <li>ממפתחים cache לפי משתמש/הרשאות כשהתשובה אישית — או מוותרים עליו.</li>
            <li>מנטרים hit-rate ו-staleness כמדד, בדיוק כמו עלות ו-latency.</li>
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
          ["Prompt caching", "שמירת קידוד החלק הקבוע בפרומפט (system/context) בין קריאות; התשובה עצמה נשארת טרייה."],
          ["Response caching", "שמירת תשובה שלמה לשאלה; חוסך את כל הקריאה אך מסוכן כשהמידע משתנה."],
          ["Exact-match", "החזרת תשובה שמורה רק כשהשאלה זהה מילה-במילה; בטוח יחסית, תופס פחות חזרות."],
          ["Semantic caching", "התאמת שאלה לפי דמיון embedding; חוסך יותר אך מסתכן ב-false hit."],
          ["Staleness", "מצב שבו התשובה השמורה כבר לא תואמת את המקור שהתעדכן — מידע מיושן."],
          ["Invalidation / TTL", "מנגנון תפוגה: ניקוי יזום כשהמקור משתנה, או זמן-חיים קצוב לכל רשומה."],
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
          <Database size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li>התחל מ-prompt caching — רוב החיסכון, כמעט בלי סיכון, כי התשובה נשארת טרייה.</li>
          <li>response caching (exact/semantic) חזק יותר אך מכניס staleness ו-false hits.</li>
          <li>החלק הקשה אינו ה-hit אלא ה-invalidation — TTL קצר או ניקוי יזום כשהמקור משתנה.</li>
          <li>לתוכן אישי/תלוי-זמן/משתנה — cache מסוכן; העדף prompt caching בלבד או ותר.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="monitoring-caching-strategies-for-ai"
        title="זהה הזדמנויות caching ב-AtlasDesk"
        context="עבוד מול הריפו האמיתי של AtlasDesk."
        steps={[
          "עם Claude Code, עברו על כל נתיבי ה-API של AtlasDesk וזהו: אילו חלקים מה-system prompts קבועים וחוזרים בכל קריאה (מועמדים ל-prompt caching)?",
          "חפשו נתיב אחד שבו התשובה יציבה ולא-אישית (מועמד ל-response caching) ואחד שבו היא אישית/דינמית (שבו caching מסוכן) — הסבירו את ההבדל.",
          "אם היה שם קאש סמנטי, הציעו סף-דמיון התחלתי ואיך הייתם מודדים אם הוא מייצר false hits.",
          "דון: לכל מועמד — האם ה-caching משתלם? חשבו את התדירות (כמה פעמים ביום זה נקרא) מול סיכון ה-staleness.",
        ]}
        successCriteria={[
          "זיהית לפחות חלק קבוע אחד שמתאים ל-prompt caching",
          "הבחנת בין נתיב שבטוח ל-response caching לנתיב שבו הוא מסוכן, עם נימוק",
          "יש לך הערכה (גסה) אם זה משתלם כלכלית, ומחשבה על invalidation",
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
          חשוב על אפליקציה שאתה מכיר שסובלת מ’מידע מיושן’ (cache שלא התעדכן). מה היה הפתרון
          הנכון — TTL קצר יותר, או invalidation יזום כשהמידע משתנה — ולמה?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          מדדנו (observability) וחסכנו (caching). בפרויקט המסכם של המודול נחבר את הכל: AtlasDesk יקבל
          שכבת ניטור אמיתית שרושמת עלות/טוקנים לכל נתיב — ונשתמש בה כדי לזהות היכן caching היה חוסך.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
