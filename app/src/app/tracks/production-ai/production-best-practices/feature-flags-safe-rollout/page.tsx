"use client";

import { ToggleRight, Rocket, Users, FlaskConical, Split, Power, Ban, GitBranch } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "production-ai",
  moduleSlug: "production-best-practices",
  lessonSlug: "feature-flags-safe-rollout",
  title: "Feature Flags ופריסה בטוחה",
  objectives: [
    "להבין איך feature flags מפרידים בין deploy (הקוד בשרת) ל-release (המשתמש רואה) — שני אירועים שונים",
    "לתכנן פריסה הדרגתית (canary): 5% → 25% → 100%, ולמדוד לפני שמרחיבים",
    "להכיר kill switch ו-rollback מיידי בלי redeploy, ו-A/B לפיצ'רי AI",
    "להבין למה לעולם לא משחררים שינוי AI ל-100% בבת אחת — אי-דטרמיניזם דורש מדידה על פרוסה קודם",
  ],
  estMinutes: 35,
  difficulty: "מתקדם",
  prerequisites: ["sla-reliability-targets"],
};

const SLIDES: Slide[] = [
  {
    title: "איזו בעיה זה פותר: deploy ≠ release",
    bullets: [
      "עד כה, כל יכולת חדשה ב-AtlasDesk (RAG, סוכן, אסקלציה) הופעלה לכולם ברגע ה-push. באקדמיה זה עבד — אין משתמשים אמיתיים תלויים. במוצר production אמיתי, זה הימור.",
      "feature flag מפריד שני אירועים שהיו כרוכים יחד: deploy (הקוד עלה לשרת) ו-release (המשתמש רואה את הפיצ’ר). הקוד יכול להיות בשרת כבר שבוע — כבוי — ואתה מדליק אותו בזמן שבחרת, למי שבחרת.",
      "פתאום 'לשחרר' זו החלטה של שנייה (toggle), לא של דיפלוי — ו'לבטל' זו החלטה של שנייה גם כן.",
    ],
  },
  {
    title: "פריסה הדרגתית (canary) ו-kill switch",
    bullets: [
      "canary: מפעילים את הפיצ’ר קודם ל-5% מהמשתמשים, מודדים (שגיאות? עלות? latency?), ורק אם יציב — מרחיבים ל-25%, ואז ל-100%. הבעיה מתגלה על 5%, לא על כולם.",
      "kill switch: מתג חירום שמכבה את הפיצ’ר מיידית כשמשהו משתבש — בלי commit, בלי deploy, בלי המתנה לצינור. שניות, לא דקות.",
      "rollback דרך flag הוא מיידי; git revert דורש commit → push → build → deploy — איטי בדיוק כשהזמן קריטי ביותר.",
    ],
  },
  {
    title: "למה AI שונה: אי-דטרמיניזם דורש מדידה על פרוסה",
    bullets: [
      "שינוי בקוד רגיל דטרמיניסטי — אם עבר טסטים, יתנהג זהה בפרודקשן. שינוי בפרומפט/מודל אינו כזה: אותו prompt מחזיר פלטים שונים, ואיכות נמדדת סטטיסטית על מגוון קלטים אמיתיים.",
      "לכן אי אפשר 'לוודא שפרומפט חדש טוב' על שולחן העבודה. חייבים למדוד אותו על תעבורה אמיתית — אבל על פרוסה קטנה, כדי שאם הוא גרוע, רק 5% נפגעים.",
      "מכאן הכלל הברזל: לעולם לא משחררים שינוי AI ל-100% בבת אחת. פרוסה → מדידה → הרחבה.",
    ],
  },
];

const ROLLOUT_STEPS: DiagramStep[] = [
  {
    icon: ToggleRight,
    label: "Flag",
    detail: "עוטפים את הפיצ'ר בתנאי (משתנה סביבה / שירות flags). הקוד עולה לשרת כבוי — deploy קרה, release עדיין לא.",
  },
  {
    icon: Rocket,
    label: "Canary 5%",
    detail: "מדליקים לפרוסה קטנה בלבד. אם משהו רע — רק 5% נפגעים, וזה מספיק גדול כדי לחשוף בעיה אמיתית בתעבורה חיה.",
  },
  {
    icon: Users,
    label: "מדוד והרחב",
    detail: "משווים מדדים בין הפרוסה לשאר (שגיאות, עלות, latency, שביעות רצון). יציב? מרחיבים 25% → 100%. גרוע? עוצרים.",
  },
  {
    icon: Power,
    label: "Kill Switch",
    detail: "אם מתגלה בעיה בכל שלב — מכבים את המתג מיידית. rollback בשניות, בלי commit ובלי redeploy.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה feature flag הופך rollback למהיר יותר מ-git revert רגיל?",
    options: [
      "אין הבדל, שניהם לוקחים אותו זמן",
      "כי כיבוי feature flag הוא שינוי מיידי (toggle) בלי צורך ב-deploy חדש; git revert דורש commit, push, build ודיפלוי מחדש — תהליך איטי יותר בדיוק בזמן משבר",
      "git revert לא עובד על קוד AI",
      "feature flags דורשים שרת נפרד",
    ],
    correctIndex: 1,
    explanation:
      "feature flag הוא מתג שכבר קיים בקוד הפרוס — כיבויו מיידי. git revert דורש מעבר דרך כל צינור הדיפלוי מחדש (commit→push→build→deploy), מה שלוקח יותר זמן בדיוק כשהזמן הכי קריטי (תקרית פעילה, משתמשים נפגעים כל שנייה).",
    optionNotes: [
      "שגוי: יש הבדל משמעותי במהירות — flag מיידי, git revert עובר בכל צינור הדיפלוי מחדש.",
      "נכון: זה בדיוק היתרון — תגובה מיידית בלי לחכות לצינור דיפלוי שלם בזמן משבר.",
      "שגוי: git revert עובד על כל קוד, כולל קוד AI — זו לא הסיבה להבדל.",
      "שגוי: feature flags יכולים להיות משתני-סביבה פשוטים, בלי שום שרת נפרד.",
    ],
  },
  {
    id: "q2",
    question: "מהו ההבדל המהותי בין 'deploy' ל'release' שפיצ’ר-פלאגים מאפשרים?",
    options: [
      "אין הבדל — deploy זה release",
      "deploy = הקוד עלה לשרת; release = המשתמש בפועל רואה/מקבל את הפיצ'ר. flag מפריד ביניהם: אפשר לפרוס קוד כבוי ולשחרר אותו מאוחר יותר, בהדרגה, למי שרוצים",
      "deploy רלוונטי רק ל-AI ו-release רק לקוד רגיל",
      "release קורה תמיד לפני deploy",
    ],
    correctIndex: 1,
    explanation:
      "בלי flags, push גורם לשני האירועים בבת אחת — הקוד עולה וכולם רואים אותו מיד. flag מנתק אותם: אפשר לפרוס קוד לשרת בעוד הפיצ'ר כבוי, ואז לשחרר בזמן ובקצב שבוחרים. זו ההפרדה שמאפשרת canary, kill switch, ו-A/B.",
    optionNotes: [
      "שגוי: זה בדיוק ההבדל שהשיעור מלמד — הם שני אירועים נפרדים ש-flag מפריד.",
      "נכון: deploy=קוד בשרת, release=המשתמש רואה. flag מנתק ומאפשר שליטה מלאה בתזמון ובקהל.",
      "שגוי: ההבחנה חלה על כל סוג קוד, לא רק AI מול רגיל.",
      "שגוי: release תמיד אחרי (או בו-זמנית עם) deploy — הקוד חייב להיות בשרת כדי שאפשר לשחררו.",
    ],
  },
  {
    id: "q3",
    question: "למה לעולם לא משחררים שינוי פרומפט/מודל ל-100% מהמשתמשים בבת אחת?",
    options: [
      "כי זה עולה יותר טוקנים",
      "כי פלט AI אינו דטרמיניסטי — אי אפשר לוודא באופן מלא בבדיקות מקומיות שהשינוי טוב; חייבים למדוד אותו על תעבורה אמיתית, ולכן עדיף על פרוסה קטנה כדי שאם הוא גרוע, רק מיעוט נפגע",
      "כי המשתמשים לא אוהבים שינויים",
      "כי 100% תמיד אסור בכל סוג פריסה",
    ],
    correctIndex: 1,
    explanation:
      "קוד רגיל שעבר טסטים יתנהג זהה בפרודקשן. פרומפט/מודל שונה — אותו קלט מחזיר פלטים שונים, והאיכות נמדדת סטטיסטית על מגוון קלטים אמיתיים. אי אפשר להיות בטוח על שולחן העבודה. פורסים לפרוסה קטנה, מודדים איכות/עלות/שגיאות על תעבורה אמיתית, ורק אם טוב — מרחיבים. כך שגיאת פרומפט פוגעת ב-5%, לא בכולם.",
    optionNotes: [
      "שגוי: העלות אינה הסיבה — הבעיה היא ודאות האיכות, לא מספר הטוקנים.",
      "נכון: אי-דטרמיניזם מחייב מדידה על תעבורה אמיתית, ופרוסה קטנה מגבילה את הנזק אם השינוי גרוע.",
      "שגוי: זה לא עניין של טעם — זה עניין של מדידת איכות אמינה לפני חשיפה מלאה.",
      "שגוי: לפיצ'רים דטרמיניסטיים ובדוקים לגמרי פריסה ל-100% לגיטימית; הכלל מחמיר במיוחד ל-AI.",
    ],
  },
  {
    id: "q4",
    question: "מהו סיכון ה-'flag debt' שמלווה שימוש נרחב ב-feature flags?",
    options: [
      "flags צורכים יותר מדי זיכרון בשרת",
      "flags שנשארים בקוד לנצח אחרי שהפיצ'ר יציב מצטברים לקוד מת מותנה — מסבכים כל קריאה, מקשים על הבנה ובדיקה, ולפעמים מדליקים בטעות נתיב ישן",
      "flags מאטים את ה-build באופן דרמטי",
      "flags לא עובדים יותר מ-10 בקוד",
    ],
    correctIndex: 1,
    explanation:
      "flag נועד לחיות זמן קצר — עד שהפיצ'ר יציב. אם שוכחים להסירו, נשארים בקוד עשרות תנאי if שמסתעפים לנתיבים ישנים. זה חוב טכני: הקוד קשה יותר לקריאה, מספר מצבי הבדיקה מתפוצץ (2^N שילובים), ותקלה יכולה להדליק בטעות נתיב מת. מקצוענים מנקים flags יציבים כחלק מהתחזוקה.",
    optionNotes: [
      "שגוי: צריכת הזיכרון של flag זניחה — הבעיה היא הצטברות קוד, לא משאבים.",
      "נכון: flags נשכחים הופכים לקוד מת מותנה — חוב טכני שמסבך קריאה, בדיקה ותחזוקה.",
      "שגוי: flag הוא תנאי if פשוט — השפעתו על ה-build זניחה.",
      "שגוי: אין מגבלה מספרית — הבעיה איכותית (חוב), לא כמותית.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: פריסה הדרגתית ובטוחה", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "diagram",
    label: "מסלול הפריסה הבטוחה: flag → canary → הרחבה → kill switch",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          פריסה בטוחה היא מסלול, לא אירוע יחיד. שים לב שבכל שלב יש נקודת נסיגה — ה-kill switch תמיד
          בהישג יד. זה מה שמאפשר להעז לשחרר בביטחון:
        </p>
        <StepDiagram steps={ROLLOUT_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: פריסה מיידית מול הדרגתית",
    content: (
      <PromptComparisonLab
        title="פריסת יכולת AI חדשה ל-AtlasDesk"
        unitLabel="אסטרטגיית פריסה"
        bad={{
          label: "'הכל או כלום' (מה שנעשה עד כה באקדמיה)",
          content: `push -> deploy -> כל המשתמשים מקבלים את היכולת
החדשה מיידית, בלי אפשרות לכבות רק אותה.
prompt חדש? כולם מקבלים אותו בו-זמנית.`,
          outcome:
            "אם היכולת מתגלה כבעייתית (עלות גבוהה מהצפוי, פרומפט שמחזיר תשובות שגויות) — הפתרון היחיד הוא git revert מלא + דיפלוי מחדש. לוקח דקות יקרות בזמן ש-100% מהמשתמשים חווים את הבעיה.",
        }}
        good={{
          label: "פריסה הדרגתית עם feature flag",
          content: `const rolloutPct = Number(process.env.NEW_PROMPT_PCT ?? 0)
const useNew = hashUser(userId) % 100 < rolloutPct
const prompt = useNew ? NEW_PROMPT : STABLE_PROMPT
// מתחילים ב-NEW_PROMPT_PCT=5, מודדים, מרחיבים.
// בעיה? מגדירים NEW_PROMPT_PCT=0 — kill switch מיידי.`,
          outcome:
            "השינוי מגיע קודם ל-5%. מודדים איכות/עלות עליהם מול השאר. יציב? מרחיבים. גרוע? מגדירים 0 — rollback בשניות, בלי deploy. שגיאת פרומפט פגעה ב-5%, לא בכולם.",
        }}
        takeaway="פריסה הדרגתית עם feature flags היא בדיוק אותו עיקרון כמו incremental changes (מודול Claude Code Mastery) — שינויים קטנים ומדודים, לא 'הכל בבת אחת', רק ברמת הפריסה במקום ברמת הקוד. ל-AI זה קריטי כפליים כי הפלט לא דטרמיניסטי."
      />
    ),
  },
  {
    id: "flag-types",
    label: "לא כל flag נולד שווה: ארבעה סוגים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Rocket size={16} /> Release flag
          </p>
          <p className="text-sm text-muted">
            מפריד deploy מ-release ומאפשר canary. קצר-חיים: כשהפיצ’ר ב-100% ויציב — מסירים אותו.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Power size={16} /> Kill switch (ops flag)
          </p>
          <p className="text-sm text-muted">
            מתג חירום לכבות תת-מערכת יקרה/שברירית (למשל קריאות סוכן) כשעומס או תקלה. יכול להישאר לאורך זמן.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <FlaskConical size={16} /> Experiment (A/B)
          </p>
          <p className="text-sm text-muted">
            מפצל משתמשים לשתי גרסאות פרומפט/מודל ומודד איזו טובה יותר על מדד אמיתי (דיוק, שביעות רצון, עלות).
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Users size={16} /> Permission flag
          </p>
          <p className="text-sm text-muted">
            מפעיל יכולת רק לקהל מסוים (beta, לקוחות premium). ארוך-חיים, חלק מהמוצר — לא נועד להסרה.
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
        why="feature flags קיימים כי פריסה מיידית ל-100% היא הימור גדול — אם יש בעיה, כולם חווים אותה בו-זמנית. ה-flag מפריד deploy מ-release כדי לשלוט בדיוק במי רואה מה, ומתי."
        alternatives="בלי flags (מה שנעשה באקדמיה עד כה) — פשוט יותר למימוש, מקובל לפרויקט לימודי בלי משתמשים אמיתיים. חלופה כבדה יותר: שירות flags ייעודי (LaunchDarkly, Unleash) — שווה כשיש הרבה flags וקהל גדול, overkill לפרויקט קטן."
        whenNotTo="לפרויקט לימודי/דמו בלי משתמשים אמיתיים — flags הם overhead מיותר. גם לשינוי טריוויאלי והפיך בקלות (תיקון טקסט) — canary מלא זה טקס מוגזם."
        commonMistakes="להוסיף flag ולשכוח להסירו אחרי שהפיצ'ר יציב (flag debt — קוד מת מותנה); לשחרר שינוי פרומפט ישר ל-100% 'כי בדקתי מקומית'; לפרוס canary בלי להגדיר מראש איזה מדד יחליט אם להרחיב או לעצור."
        performance="הבדיקה עצמה (תנאי if / hash של userId) זולה וזניחה. הרווח: canary מגביל את רדיוס הנזק — בעיית ביצועים/עלות מתגלה על 5%, לא על כל התעבורה, לפני שהיא נהיית יקרה."
        cost="flags חוסכים כסף כפול: kill switch מכבה יכולת יקרה בעומס לפני שהחשבון מתפוצץ, ו-A/B מגלה אם פרומפט חדש (יקר יותר בטוקנים) באמת שווה את התוספת — או רק מבזבז."
        security="kill switch הוא כלי אבטחה מדרגה ראשונה: אם מתגלה prompt injection או ניצול בפיצ'ר AI, מכבים אותו מיידית בלי להמתין ל-deploy. flag גם מאפשר לחשוף יכולת רגישה רק לקהל מהימן תחילה."
        maintenance="flag הוא חוב טכני מהרגע שנולד — נהלים טובים: שם ברור, בעלים, ותאריך תפוגה. חלק מ-definition-of-done של פיצ'ר יציב הוא הסרת ה-flag שלו. שירות flags מנוהל מרכז את המצב במקום שקוד לא יתפזר."
        realWorld="שירותים כמו Vercel, GitHub ו-Anthropic משחררים כמעט הכל מאחורי flags עם canary. בפרויקט המסכם תשקול אילו מיכולות AtlasDesk העתידיות (פרומפט חדש, מודל חדש) ראויות לפריסה הדרגתית עם flag ו-kill switch."
      />
    ),
  },
  {
    id: "mistakes",
    label: "מה שובר בפרודקשן מול איך מקצוענים עושים",
    content: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-danger">
            <Ban size={16} /> מה שובר מערכות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>שחרור פרומפט חדש ל-100% ”כי בדקתי על 3 דוגמאות” — נשבר על קלטים אמיתיים אצל כולם.</li>
            <li>אין kill switch — כשהפיצ’ר משתגע, הפתרון היחיד הוא git revert איטי תחת לחץ.</li>
            <li>canary בלי מדד החלטה מוגדר מראש — מרחיבים לפי תחושה, לא לפי נתונים.</li>
            <li>flags נשכחים מצטברים לעשרות — 2^N מצבים שאי אפשר לבדוק, נתיב מת מודלק בטעות.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <Split size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>כל שינוי AI יוצא בהדרגה: 5% → מדידה → 25% → 100%, לעולם לא בבת אחת.</li>
            <li>לכל פיצ’ר מסוכן יש kill switch — rollback בשניות בלי redeploy.</li>
            <li>מגדירים מראש את מדד ההחלטה (שגיאות/עלות/דיוק) שקובע אם להרחיב או לעצור.</li>
            <li>מתייחסים ל-flag כמו לחוב: שם, בעלים, תפוגה — ומסירים אותו כשהפיצ’ר יציב.</li>
          </ul>
        </div>
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "real-world-task",
    label: "משימה מעשית",
    content: (
      <RealWorldTask
        id="production-best-practices-feature-flags-safe-rollout"
        title="עצב פריסה הדרגתית + kill switch לפרומפט חדש ב-AtlasDesk"
        context="עבוד עם Claude Code — תכנון ועיצוב, לא מימוש מלא בפועל."
        steps={[
          "בחר שינוי AI עתידי ל-AtlasDesk (למשל: פרומפט מערכת חדש שאמור לשפר דיוק, או מעבר למודל אחר).",
          "בקש מ-Claude Code להציע מבנה feature flag מבוסס-אחוזים (משתנה סביבה + hash של userId) שמפעיל את השינוי החדש רק ל-N% מהמשתמשים.",
          "הוסף kill switch: איך מגדירים את האחוז ל-0 ומחזירים לפרומפט היציב מיידית, בלי deploy?",
          "הגדר את מדד ההחלטה מראש: איך תמדוד אם 5% הראשונים חווים בעיה (שגיאות? עלות לבקשה? דיוק/grounding מ-/api/atlasdesk/stats?) לפני שתרחיב ל-25% ואז ל-100%?",
          "דון: למה כאן canary קריטי אפילו יותר מאשר לשינוי קוד רגיל? (רמז: אי-דטרמיניזם — אי אפשר לוודא איכות פרומפט מלאה על שולחן העבודה).",
        ]}
        successCriteria={[
          "יש לך מבנה feature flag קונקרטי מבוסס-אחוזים, לא רק רעיון",
          "יש לך kill switch שמחזיר לפרומפט היציב בשניות בלי redeploy",
          "יש לך מדד החלטה מוגדר מראש שקובע מתי להרחיב ומתי לעצור",
          "אתה יכול להסביר למה שינוי AI לעולם לא יוצא ל-100% בבת אחת",
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
          ["Feature Flag", "מתג בקוד שמפעיל/מכבה פיצ'ר בזמן ריצה, בלי deploy — מפריד בין deploy ל-release."],
          ["Deploy vs Release", "deploy=הקוד עלה לשרת; release=המשתמש רואה את הפיצ'ר. flag מנתק ביניהם."],
          ["Canary", "פריסה הדרגתית: מפעילים לפרוסה קטנה (5%) קודם, מודדים, ורק אז מרחיבים."],
          ["Kill Switch", "מתג חירום שמכבה פיצ'ר מיידית בעת תקלה — rollback בשניות, בלי redeploy."],
          ["A/B Test", "פיצול משתמשים לשתי גרסאות (למשל שני פרומפטים) ומדידה איזו טובה יותר על מדד אמיתי."],
          ["Rollback", "חזרה למצב יציב קודם. דרך flag=מיידי; דרך git revert=עובר בכל צינור הדיפלוי."],
          ["Flag Debt", "flags שנשכחו בקוד אחרי שהתייצבו — קוד מת מותנה שמסבך בדיקה ותחזוקה."],
          ["Blast Radius", "רדיוס הנזק: כמה משתמשים נפגעים כשמשהו משתבש. canary מקטין אותו ל-5%."],
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
          <GitBranch size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>deploy ≠ release</strong>: flag מנתק את שני האירועים ונותן לך שליטה במי רואה מה, ומתי.</li>
          <li><strong>canary</strong>: 5% → מדידה → 25% → 100%. הבעיה מתגלה על פרוסה, לא על כולם.</li>
          <li><strong>kill switch</strong>: rollback בשניות בלי redeploy — מהיר בדיוק כשהזמן קריטי.</li>
          <li><strong>AI לעולם לא ל-100% בבת אחת</strong>: אי-דטרמיניזם מחייב מדידה על תעבורה אמיתית, על פרוסה קטנה תחילה.</li>
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
          חשוב על פעם שפריסת קוד (בכל פרויקט) גרמה לתקלה שהייתה נמנעת עם feature flag ופריסה
          הדרגתית. מה בדיוק היה קורה אחרת — כמה משתמשים היו נפגעים, וכמה מהר היית מתאושש?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          יש לך יעדי אמינות (שיעור קודם) ופריסה בטוחה — אבל מה עושים כשתקרית בכל זאת קורית? בפרויקט
          המסכם נכתוב runbook תקריות ל-AtlasDesk ונאגד את כל הטראק למסמך מוכנות-לפרודקשן אחד.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
