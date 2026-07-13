"use client";

import { GitCommit, GitBranch, GitPullRequest, Eye, ShieldAlert, History } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "engineering-discipline",
  lessonSlug: "git-workflows-with-claude-code",
  title: "תהליכי Git עם Claude Code",
  objectives: [
    "לתרגל commits קטנים ותכופים והודעות קומיט שמסבירות 'למה', לא רק 'מה'",
    "לתת ל-Claude Code לכתוב הודעות commit ו-PR — אבל לסקור אותן לפני שמאשרים",
    "לעולם לא לקמט diff של AI שלא קראת ולא הבנת — ולהבין את הסכנה בפעולות git 'עיוורות'",
    "להבין ניהול branches בעבודה עם סוכן AI, ואת זרימת ה-PR מ-commit ועד review",
  ],
  estMinutes: 30,
  difficulty: "בינוני",
  prerequisites: ["פרויקט מודול: הרחבת AtlasDesk תוך שמירה על ארכיטקטורה"],
};

const SLIDES: Slide[] = [
  {
    title: "מודול אחרון בטראק: המשמעת שמחזיקה הכל ביחד",
    bullets: [
      "כל מה שבנית לאורך הטראק (AtlasDesk עם 7 יכולות אמיתיות) קיים בזכות היסטוריית git מסודרת — כל commit מתעד גם 'מה' וגם 'למה', כדי שסשן עתידי (שלך או של מישהו אחר) יבין את ההקשר בלי לשאול שוב.",
      "git הוא לא 'טקס' — הוא רשת הביטחון שמאפשרת לעבוד מהר עם סוכן AI: אם commit אחד שבר משהו, אתה חוזר צעד אחד אחורה במקום לשחזר שעות עבודה.",
    ],
  },
  {
    title: "Commit קטן ותכוף — במיוחד עם AI",
    bullets: [
      "commit קטן = diff שאפשר לקרוא ולהבין בכמה דקות. commit ענק של 40 קבצים מ-Claude Code הוא בלתי-אפשרי לסקור באמת — אז לא סוקרים, וזה בדיוק איך באגים נכנסים.",
      "כלל אצבע: כל יחידת עבודה לוגית (יכולת אחת, תיקון אחד) = commit אחד. אם אתה מתקשה לנסח את ה'למה' במשפט אחד, כנראה דחפת יותר מדי לתוך commit אחד.",
      "commit תכוף גם נותן לך נקודות שחזור צפופות — כשעובדים עם סוכן שמשנה הרבה קבצים במהירות, זה ההבדל בין 'undo של צעד' ל'איבדתי בוקר שלם'.",
    ],
  },
  {
    title: "Claude Code כותב — אתה מאשר. תמיד.",
    bullets: [
      "Claude Code מצוין בניסוח הודעות commit ותיאורי PR: הוא רואה את ה-diff ומסכם אותו היטב. תן לו לעשות את זה — זה חוסך זמן.",
      "אבל: הודעה שנכתבה על ידי AI היא טיוטה, לא אמת. הסוכן מתאר מה הוא *חושב* שהקוד עושה; רק אתה יודע *למה* ביקשת אותו ואם הוא באמת עשה זאת.",
      "החוק הבלתי-מתפשר: לעולם אל תקמט diff שלא קראת. 'git add . && commit' על שינוי של סוכן שלא בדקת = אתה חותם על קוד שאתה לא מבין.",
    ],
  },
];

const PR_FLOW_STEPS: DiagramStep[] = [
  {
    icon: GitBranch,
    label: "Branch",
    detail: "פותחים branch ייעודי לשינוי ('feat/memory-store'). כך ה-main נשאר יציב, ואפשר לנטוש את השינוי בלי סיכון אם משהו משתבש. עם סוכן שמשנה הרבה — branch נפרד הוא ההבדל בין ניסוי בטוח לפגיעה בקוד היציב.",
  },
  {
    icon: GitCommit,
    label: "Commit",
    detail: "commits קטנים ותכופים, כל אחד עם 'מה+למה'. Claude Code יכול לנסח את ההודעה — אתה קורא ומאשר. כל commit הוא נקודת שחזור.",
  },
  {
    icon: Eye,
    label: "Review",
    detail: "לפני שדוחפים: קוראים את ה-diff המלא (git diff), לא רק את סיכום הסוכן. מחפשים שינויים שלא ביקשת, קבצים שנגעו בהם בטעות, או 'עודף יצירתיות' של הסוכן.",
  },
  {
    icon: GitPullRequest,
    label: "PR",
    detail: "פותחים Pull Request. Claude Code יכול לכתוב את התיאור — אתה מוודא שהוא מדויק. ה-PR הוא נקודת הביקורת האחרונה לפני שהקוד נכנס ל-main, גם כשעובדים לבד.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "למה הודעת commit טובה צריכה להסביר גם 'למה' ולא רק 'מה'?",
    options: [
      "זה לא באמת חשוב, 'מה' מספיק",
      "כי 'מה' משתנה אפשר לראות מה-diff עצמו; 'למה' הוא המידע שאף פעם לא רואים בקוד עצמו, ונעלם אם לא נכתב",
      "כי git דורש הודעה ארוכה טכנית",
      "כדי שהודעת ה-commit תהיה ארוכה יותר",
    ],
    correctIndex: 1,
    explanation:
      "ה-diff כבר מראה 'מה השתנה' — הערך המוסף האמיתי של הודעת commit הוא ההקשר וההנמקה שלא נראים בקוד עצמו. בעבודה עם AI זה קריטי כפליים: סשן עתידי קורא את git log כדי להבין למה החלטה התקבלה, לפני שהוא 'מתקן' משהו שנעשה בכוונה.",
    optionNotes: [
      "לא נכון: זה קריטי במיוחד בעבודה עם AI — בלי ה'למה', סשן עתידי לא יודע אם מותר לשנות את ההחלטה.",
      "התשובה הנכונה: git diff כבר מראה את ה'מה' — 'למה' הוא המידע היחיד שהודעת הקומיט מוסיפה שלא ניתן לראות בקוד עצמו.",
      "לא נכון: git לא דורש שום פורמט מסוים — זו מוסכמה הנדסית טובה, לא דרישה טכנית.",
      "לא נכון: אורך אינו המטרה — תמציתיות עם תוכן משמעותי עדיפה על אריכות ריקה.",
    ],
  },
  {
    id: "q2",
    question: "Claude Code סיים משימה ושינה 12 קבצים. הוא מציע: 'ארשום את הכל בקומיט אחד עם הודעה שאכתוב?'. מה הגישה ההנדסית הנכונה?",
    options: [
      "לאשר מיד — הסוכן ראה את השינויים, הוא יודע מה הוא עשה",
      "לקרוא את git diff המלא בעצמך, לוודא שכל שינוי הוא מה שביקשת, ורק אז לאשר (ואולי לפצל ליותר מקומיט אחד)",
      "לדחות ולכתוב את כל הקוד ידנית מחדש",
      "לאשר, אבל למחוק את הודעת הקומיט שהסוכן כתב ולכתוב 'update'",
    ],
    correctIndex: 1,
    explanation:
      "הכלל הבלתי-מתפשר: לא מקמטים diff שלא קראת. הסוכן מתאר מה הוא *חושב* שעשה, אבל רק קריאת ה-diff מגלה שינויים שלא ביקשת (קובץ שנגע בו בטעות, 'שיפור' שלא ביקשת). 12 קבצים גם מרמזים שכדאי לפצל למספר commits לוגיים — כל אחד עם 'למה' משלו.",
    optionNotes: [
      "לא נכון: אמון עיוור בסוכן הוא בדיוק איך שינויים לא-מכוונים נכנסים ל-main. הסוכן לא יודע מה לא ביקשת.",
      "התשובה הנכונה: קריאת ה-diff המלא היא הביקורת שלך, לא של הסוכן. פיצול ל-commits לוגיים הופך את ההיסטוריה לקריאה.",
      "לא נכון: אין צורך לזרוק את עבודת הסוכן — הבעיה היא בהיעדר סקירה, לא בעצם השימוש ב-AI.",
      "לא נכון: הודעה גנרית ('update') זורקת בדיוק את ה'למה' שהסוכן דווקא כתב היטב. סוקרים ומשפרים, לא מוחקים.",
    ],
  },
  {
    id: "q3",
    question: "אתה עובד ישירות על main, מבקש מ-Claude Code רפקטור גדול, וחצי מזה מתגלה כשגוי. מה היה מונע את הכאב מלכתחילה?",
    options: [
      "כלום — פשוט צריך לתקן קדימה, זה קורה",
      "לעבוד ב-branch נפרד עם commits קטנים ותכופים: אז אפשר לנטוש את ה-branch או לחזור ל-commit היציב האחרון בלי לגעת ב-main",
      "לבקש מהסוכן להבטיח שלא יהיו באגים",
      "להריץ git push --force על main כדי לנקות את ההיסטוריה",
    ],
    correctIndex: 1,
    explanation:
      "branch נפרד + commits קטנים הם בדיוק רשת הביטחון של עבודה עם סוכן: כל commit הוא נקודת שחזור, וה-branch מבודד את הניסוי מהקוד היציב. אם רפקטור השתבש — git reset ל-commit הטוב, או נטישת ה-branch כולו, בלי דרמה. פעולות git 'עיוורות' (force על main) הן ההפך הגמור — הן מוחקות בדיוק את רשת הביטחון הזו.",
    optionNotes: [
      "לא נכון: 'לתקן קדימה' על main שבור הוא בדיוק המצב שאפשר היה למנוע. הכלים קיימים בשביל זה.",
      "התשובה הנכונה: בידוד (branch) + נקודות שחזור צפופות (commits קטנים) הופכים כישלון של סוכן מאסון לצעד אחורה שגרתי.",
      "לא נכון: אי אפשר 'להבטיח אפס באגים' — הנחת העבודה הנכונה היא שדברים ישתבשו, ולכן בונים לזה רשת ביטחון.",
      "לא נכון: force-push על main הוא פעולה מסוכנת שמוחקת היסטוריה — בדיוק סוג ה'פעולת git עיוורת' שהשיעור מזהיר מפניה.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: Git כמנגנון זיכרון ורשת ביטחון", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "pr-flow",
    label: "זרימת העבודה: Branch → Commit → Review → PR",
    content: (
      <div>
        <p className="mb-4 text-sm text-muted">
          זו הזרימה שמהנדס בכיר משתמש בה גם כשעובד לבד עם סוכן AI. כל שלב הוא נקודת ביקורת שמונעת
          שגיאה מלהגיע ל-main. עבור על השלבים:
        </p>
        <StepDiagram steps={PR_FLOW_STEPS} />
      </div>
    ),
  },
  {
    id: "comparison",
    label: "השוואה: קומיט חלש מול חזק (דוגמאות אמיתיות מהאקדמיה)",
    content: (
      <PromptComparisonLab
        title="תיעוד שינוי אמיתי מהיסטוריית האקדמיה"
        unitLabel="הודעת commit"
        bad={{
          label: "רק 'מה', ולא נקרא לפני קימוט",
          content: `"fix bug in support-chat.tsx"
(הודעה שהסוכן ניסח, אושרה בלי לקרוא את ה-diff)`,
          outcome:
            "לא ברור איזה באג, למה הוא קרה, או למה הפתרון הזה נבחר. וגרוע יותר — מכיוון שה-diff לא נקרא לפני הקימוט, אף אחד לא שם לב שהסוכן שינה גם קובץ שני שלא היה קשור.",
        }}
        good={{
          label: "'מה' + 'למה', אחרי סקירת ה-diff",
          content: `"fix: lesson completion check used the full lessonKey
instead of the bare lessonSlug that the progress store
actually saves — button never flipped to 'completed'"`,
          outcome:
            "כל מי שקורא את זה מבין מיד את הבאג, את שורש הבעיה, ולמה התיקון נכון — בלי לחפור בקוד מחדש. וה-diff נסקר, אז ה-commit נוגע רק במה שצריך.",
        }}
        takeaway="הודעת commit היא תיעוד ל'סשן העתידי', בין אם זה אתה בעוד חודש או Claude Code בסשן חדש שקורא git log. תן לסוכן לנסח — אבל קרא את ה-diff ואשר בעצמך. השילוב הזה הוא כל השיעור."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="הודעות commit מפורטות + commits קטנים קיימים כי git log הוא תיעוד שאף אחד לא צריך לתחזק בנפרד — הוא נכתב ברגע שההקשר הכי טרי, ומשמש גם כרשת ביטחון לשחזור."
        alternatives="לתעד החלטות במסמך נפרד (design doc) — עובד להחלטות גדולות, אבל overhead מיותר לרוב השינויים היומיומיים; commit message הוא 'התיעוד הזול' לרוב המקרים. חלופה לניהול סיכון: לעבוד תמיד על main בלי branches — פשוט יותר לפרויקט של אדם אחד, אבל מסוכן ברגע שסוכן משנה הרבה קבצים בבת אחת."
        whenNotTo="לתיקון טריוויאלי (typo) — הודעת commit קצרה מספיקה, אין צורך בפסקת 'למה' או ב-branch נפרד לכל שינוי. משמעת git היא כלי לניהול סיכון, לא טקס שמפעילים באדיקות על כל שינוי זעיר."
        commonMistakes="לקמט diff של סוכן בלי לקרוא אותו ('git add . && commit'); לכתוב הודעות גנריות ('update', 'fix', 'wip'); לדחוף commit ענק של 40 קבצים שאי אפשר לסקור; להריץ פעולות git מסוכנות (reset --hard, push --force) שהסוכן הציע בלי להבין מה הן עושות."
        performance="commits קטנים ותכופים מייצרים היסטוריה קריאה ונקודות שחזור צפופות — git bisect (חיפוש בינארי של ה-commit ששבר משהו) עובד רק אם כל commit הוא יחידה לוגית אחת ולא ערבוב של חמישה שינויים."
        security="diff של סוכן עלול לכלול בטעות סוד שנוסף לקוד (מפתח API, טוקן) או מחיקת בדיקת הרשאה. קריאת ה-diff לפני הקימוט היא גם ביקורת אבטחה — סוד שנכנס ל-git history קשה מאוד להסיר בדיעבד."
        cost="הודעת commit טובה עולה כמה שניות; קריאת diff עולה כמה דקות. שתיהן חוסכות שעות של חקירה מאוחרת — או של שחזור אחרי ש-diff לא-מבוקר שבר את main."
        maintenance="ההיסטוריה היא נכס לטווח ארוך: בעוד שנה, git log וה-PRs הם המקום היחיד שמסביר למה המערכת בנויה כמו שהיא. commits מבולגנים היום = חוב תחזוקה שמישהו (כנראה אתה) ישלם עליו כשינסה להבין קוד ישן."
        realWorld="כל הקומיטים באקדמיה הזו (אם תסתכל בהיסטוריית ה-git) עוקבים אחר התבנית הזו: קטנים, 'מה+למה', נסקרו לפני קימוט. זו לא תיאוריה, זו העבודה בפועל — כולל השינויים ש-Claude Code עצמו ניסח כאן."
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
            <ShieldAlert size={16} /> מה שובר מערכות בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>&apos;git add . &amp;&amp; commit&apos; על שינוי של סוכן שלא נקרא — קוד שאתה חותם עליו בלי להבין.</li>
            <li>commit ענק שמערבב חמישה שינויים לוגיים — בלתי-אפשרי לסקור, ומקלקל את git bisect.</li>
            <li>הרצת פעולת git שהסוכן הציע (reset --hard, push --force) בלי להבין מה היא מוחקת.</li>
            <li>עבודה ישירות על main על רפקטור גדול של סוכן — אין לאן לחזור כשחצי ממנו שגוי.</li>
            <li>הודעות גנריות (&apos;update&apos;, &apos;wip&apos;) — בעוד חודש אף אחד לא זוכר מה זה היה.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <History size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>קוראים את git diff המלא לפני כל קימוט — הסקירה היא שלך, לא של הסוכן.</li>
            <li>commits קטנים ותכופים, כל אחד יחידה לוגית אחת עם &apos;מה+למה&apos;.</li>
            <li>נותנים ל-Claude Code לנסח הודעת commit/PR — ומשפרים אותה, לא מאשרים עיוור.</li>
            <li>עובדים ב-branch נפרד לשינויים גדולים; main נשאר תמיד יציב.</li>
            <li>מבינים כל פעולת git לפני שמריצים אותה — במיוחד את ההרסניות.</li>
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
        id="engineering-discipline-git-workflows"
        title="עבוד ב-branch, תן לסוכן לנסח commit — וסקור לפני שתאשר"
        context="פתח את Claude Code על כל פרויקט git (כולל AtlasDesk אם יש לך גישה). נתרגל את הזרימה המלאה על שינוי אמיתי קטן."
        steps={[
          "צור branch חדש: 'git checkout -b feat/small-change'. אל תעבוד על main.",
          "בקש מ-Claude Code לבצע שינוי קטן וברור (למשל להוסיף הערת קוד או פונקציית עזר קטנה).",
          "לפני שאתה מקמט: הרץ 'git diff' וקרא את כל השינוי בעצמך. ודא שהסוכן נגע *רק* במה שביקשת.",
          "בקש מ-Claude Code לכתוב הודעת commit ב'מה+למה'. קרא אותה — אם ה'למה' לא מדויק, תקן אותו לפני שאתה מאשר.",
          "צעד דיבוג: בכוונה בקש מהסוכן שינוי שנוגע גם בקובץ שני לא-רלוונטי. הרץ 'git diff' שוב וזהה את הקובץ העודף — זו בדיוק הסיבה שקוראים את ה-diff.",
        ]}
        successCriteria={[
          "עבדת ב-branch נפרד, לא על main",
          "קראת את ה-diff המלא לפני הקימוט — ולא רק את סיכום הסוכן",
          "הודעת ה-commit כוללת 'למה' מדויק שאתה עומד מאחוריו",
          "בצעד הדיבוג זיהית שינוי לא-מכוון של הסוכן לפני שהוא נכנס להיסטוריה",
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
          בקומיט הבא שלך (בכל פרויקט), נסה במודע לכתוב שורה אחת של &apos;למה&apos; לפני שאתה כותב &apos;מה&apos;,
          ותמיד להריץ &apos;git diff&apos; לפני הקימוט. שים לב אם הסקירה תפסה משהו שהיית מקמט אחרת עיוור.
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          git log שומר את ה&apos;למה&apos; של כל שינוי — אבל מה עם ההחלטות הגדולות שלא נכנסות לקומיט אחד?
          בשיעור הבא, &quot;תהליכי תיעוד תוך כדי עבודה&quot;, נלמד לתעד החלטות ארכיטקטוניות כשההקשר עוד טרי.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
