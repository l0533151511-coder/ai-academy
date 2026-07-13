"use client";

import { Flag, Undo2, RefreshCw, Anchor, Compass, AlertTriangle, ShieldCheck } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { StepDiagram, type DiagramStep } from "@/components/diagrams/step-diagram";
import { PromptComparisonLab } from "@/components/comparisons/prompt-comparison-lab";
import { EngineeringInsights } from "@/components/lesson/engineering-insights";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";
import { RealWorldTask } from "@/components/exercises/real-world-task";

const META: LessonMeta = {
  trackSlug: "claude-code-mastery",
  moduleSlug: "advanced-production",
  lessonSlug: "error-recovery-long-sessions",
  title: "התאוששות משגיאות וסשנים ארוכים",
  objectives: [
    "לזהות מתי Claude Code 'סוטה' מהמשימה או צובר context-rot בסשן ארוך",
    "לתרגל checkpoint strategy — נקודות עצירה לאימות ולעיגון מחדש עם CLAUDE.md",
    "להחליט במודע: מתי לבצע undo/reset של סשן לעומת לתקן כיוון תוך כדי",
  ],
  estMinutes: 30,
  difficulty: "מתקדם",
  prerequisites: ["performance-optimization-workflows"],
};

const SLIDES: Slide[] = [
  {
    title: "goal drift ו-context rot קורים גם בסשן פיתוח",
    bullets: [
      "במודול הסוכנים למדת על goal drift — סוכן שסוטה מהמטרה. אותה תופעה קורית בסשן Claude Code ארוך: אחרי שעה על תיקון קטן, פתאום אתה ב'שכתוב מלא' של קובץ שלם.",
      "context rot: ככל שהסשן מתארך, ה-context מתמלא בניסיונות שנכשלו, קבצים לא-רלוונטיים, וכיוונים שנזנחו. ה-AI מתחיל לשקלל 'רעש' ישן ומאבד את המטרה המקורית.",
      "שני הכשלים האלו שקטים: הם לא מפילים build. הם פשוט מסיטים את הסשן לאט לאט עד שהתוצאה כבר לא מה שרצית.",
    ],
  },
  {
    title: "שלוש התרופות: checkpoint, re-ground, reset",
    bullets: [
      "checkpoint: כל 15-20 דקות (או אחרי כל שינוי משמעותי), לעצור ולשאול: 'האם זה עדיין מה שהתכוונתי?' + typecheck קצר.",
      "re-ground (עיגון מחדש): להפנות את Claude Code בחזרה למקור-האמת — CLAUDE.md, קובץ התכנון, או הגדרת המשימה המקורית — כדי לנקות את הרעש שהצטבר.",
      "reset: כשהסשן 'הרעיל' את עצמו יותר מדי, לפתוח סשן חדש נקי (עם תקציר התובנות) יעיל יותר מלנסות לתקן context מוצף.",
    ],
  },
  {
    title: "מתי undo ומתי continue — ההחלטה ההנדסית",
    bullets: [
      "undo/reset עדיף כשהסחיפה עמוקה: הרבה קבצים שונו למטרות שהתרחבו, וקשה כבר להפריד 'נחוץ' מ'תוספת'. לרוב git checkout/reset של השינויים + סשן חדש מנצח.",
      "continue (תיקון תוך כדי) עדיף כשהסחיפה רדודה: זיהית אותה מוקדם, רוב העבודה תקינה, ואפשר להחזיר כיוון בהודעה אחת ברורה.",
      "המלכודת: sunk cost — 'כבר השקעתי שעה, חבל לזרוק'. לפעמים דווקא הזריקה + התחלה-מחדש (עם מה שלמדת) היא המהירה יותר.",
    ],
  },
];

const RECOVERY_STEPS: DiagramStep[] = [
  { icon: Flag, label: "1. הגדר מטרה", detail: "לפני שמתחילים סשן ארוך: משפט אחד מה המטרה המדויקת. זו אבן-הבוחן לכל checkpoint אחר כך." },
  { icon: Compass, label: "2. Checkpoint", detail: "כל 15-20 דקות: 'האם עדיין על אותה מטרה?' + typecheck קצר. תופס סחיפה מוקדם, כשהיא עדיין זולה לתיקון." },
  { icon: Anchor, label: "3. Re-ground", detail: "זיהית סחיפה רדודה? הפנה את Claude Code בחזרה ל-CLAUDE.md / קובץ התכנון / הגדרת המשימה — לנקות רעש שהצטבר." },
  { icon: Undo2, label: "4. Undo (אם צריך)", detail: "סחיפה עמוקה? git checkout/reset של השינויים המסטים. עדיף לחזור למצב נקי מאשר לתקן על גבי בלגן." },
  { icon: RefreshCw, label: "5. Reset session", detail: "context מורעל מדי? פתח סשן חדש עם תקציר התובנות. נקי מנצח מוצף — גם אם 'חבל על הזמן שהושקע'." },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מה הקשר בין 'goal drift' שנלמד במודול הסוכנים לבין סשן Claude Code ארוך?",
    options: [
      "אין קשר, אלו תופעות שונות לגמרי",
      "אותה תופעה בדיוק: לאורך זמן/סיבובים רבים, המיקוד המקורי עלול 'להיסחף' — בין אם זה סוכן אוטונומי או סשן פיתוח אנושי-מודרך",
      "goal drift קורה רק לסוכנים אוטונומיים, לא לסשן רגיל",
      "checkpoint strategy קיימת רק כדי לחסוך טוקנים",
    ],
    correctIndex: 1,
    explanation:
      "העיקרון זהה: ככל שנצבר יותר context/זמן, יש יותר סיכוי ל'סחיפה' מהמטרה המקורית — לכן checkpoints נחוצים בשני המקרים. ההבדל היחיד: בסוכן, מגבלת-הסיבובים בקוד מפעילה את העצירה; בסשן פיתוח, אתה מפעיל אותה.",
    optionNotes: [
      "לא נכון: יש קשר ישיר — זו אותה תופעה בהקשרים שונים.",
      "נכון: goal drift הוא תופעה כללית של תהליכים ארוכי-סיבוב, לא ייחודית לסוכנים אוטונומיים בלבד.",
      "לא נכון: זה קורה גם בסשן פיתוח מודרך על ידי אדם, לא רק בסוכן אוטונומי.",
      "לא נכון: checkpoints נועדו בעיקר לזהות סחיפה ולתקן כיוון; חיסכון טוקנים הוא יתרון נלווה, לא המטרה.",
    ],
  },
  {
    id: "q2",
    question:
      "אחרי שעה של סשן, שינית 12 קבצים למטרות שהתרחבו הרבה מעבר לתיקון המקורי, וקשה כבר להפריד 'נחוץ' מ'תוספת'. מה הגישה הנכונה לרוב?",
    options: [
      "להמשיך — כבר השקעת שעה, חבל לזרוק את העבודה",
      "לבצע undo/reset (git checkout של השינויים) ולפתוח סשן חדש נקי עם תקציר התובנות, כי סחיפה עמוקה זולה יותר לזרוק מאשר לתקן על גבי בלגן",
      "לבקש מ-Claude Code פשוט 'לתקן הכל' בהודעה אחת",
      "למחוק את כל הריפו ולהתחיל את הפרויקט מאפס",
    ],
    correctIndex: 1,
    explanation:
      "כשהסחיפה עמוקה, ה-context עצמו כבר מורעל וקשה להפריד את הנחוץ מהמיותר. git checkout/reset של השינויים + סשן חדש עם תקציר התובנות לרוב מהיר ובטוח יותר מלנסות לתקן על גבי בלגן. המלכודת היא sunk cost — הזמן שהושקע כבר אבוד בכל מקרה.",
    optionNotes: [
      "לא נכון: זו בדיוק מלכודת ה-sunk cost. הזמן שהושקע לא חוזר בין אם תמשיך ובין אם לא.",
      "נכון: לסחיפה עמוקה, undo + סשן נקי (עם תקציר התובנות) מנצח תיקון על גבי context מורעל.",
      "לא נכון: 'תקן הכל' בהודעה אחת על 12 קבצים סחופים הוא בדיוק פרומפט ענק לא-מתוחם — יחמיר את המצב.",
      "לא נכון: תגובת-יתר הרסנית. git checkout מבטל את השינויים בלי לאבד את הריפו.",
    ],
  },
  {
    id: "q3",
    question: "מהו 're-grounding' (עיגון מחדש) עם CLAUDE.md, ומתי הוא הכלי הנכון?",
    options: [
      "מחיקת ה-context לגמרי בכל הודעה, כדי שה-AI לא יזכור כלום",
      "הפניית Claude Code בחזרה למקור-אמת (CLAUDE.md / קובץ תכנון / הגדרת המשימה) כדי לנקות רעש שהצטבר — כלי מתאים לסחיפה רדודה שנתפסה מוקדם",
      "החלפת המודל למודל חזק יותר באמצע הסשן",
      "טכניקה שרלוונטית רק לסוכנים אוטונומיים, לא לסשן פיתוח",
    ],
    correctIndex: 1,
    explanation:
      "re-grounding הוא לתת ל-Claude Code עוגן חוזר: 'נזכיר לעצמנו — המטרה, לפי CLAUDE.md, היא X'. זה מרכז את ה-context מחדש סביב מקור-האמת ומנקה רעש שהצטבר. הוא מתאים לסחיפה רדודה; לסחיפה עמוקה, undo/reset עדיף.",
    optionNotes: [
      "לא נכון: re-grounding לא מוחק את ה-context — הוא ממקד אותו מחדש סביב מקור-אמת.",
      "נכון: הפניה חזרה למקור-אמת מנקה רעש ומחזירה מיקוד — הכלי הנכון לסחיפה רדודה.",
      "לא נכון: החלפת מודל לא פותרת סחיפה שנובעת מ-context מוצף — הבעיה בהקשר, לא במודל.",
      "לא נכון: CLAUDE.md ועיגון-מחדש רלוונטיים במיוחד לסשן פיתוח מודרך, לא רק לסוכנים.",
    ],
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מצגת: goal drift ו-context rot בסשן פיתוח", content: <SlideDeck slides={SLIDES} /> },
  { id: "recovery", label: "רצף ההתאוששות — דיאגרמה", content: <StepDiagram steps={RECOVERY_STEPS} /> },
  {
    id: "comparison",
    label: "רע מול טוב: סשן ארוך בלי checkpoints מול עם",
    content: (
      <PromptComparisonLab
        title="שעה של עבודה על שיפור ביצועים ב-AtlasDesk"
        unitLabel="גישה"
        bad={{
          label: "בלי checkpoints",
          content: `סשן רציף בן שעה, בלי עצירות — מתחיל בתיקון קטן,
ממשיך "כי כבר פה" לשכתב עוד ועוד קבצים.
ה-context מתמלא בניסיונות שנזנחו.`,
          outcome:
            "בסוף השעה יש 15 קבצים ששונו למטרות שהתרחבו הרבה מעבר לכוונה. ה-context 'הרעיל' את עצמו, קשה לדעת מה נחוץ ומה תוספת לא-מתוכננת, ותיקון על גבי הבלגן רק מסבך.",
        }}
        good={{
          label: "checkpoints + re-ground",
          content: `כל 15-20 דקות: "נעצור לרגע — האם השינויים
עד כה עדיין תואמים למטרה ב-CLAUDE.md? נריץ typecheck.
אם סטינו — נחזור לעוגן לפני שממשיכים."`,
          outcome:
            "כל checkpoint תופס סחיפה מוקדם, כשהיא עדיין רדודה וזולה. re-grounding אל CLAUDE.md מנקה רעש, והמטרה נשארת חדה לאורך כל השעה — בלי להגיע למצב שדורש reset.",
        }}
        takeaway="checkpoints הם בדיוק אותה הגנה כמו מגבלת-הסיבובים בסוכן (מודול Agents) — רק שכאן אתה, לא הקוד, מפעיל את העצירה. עצירה קטנה כל 20 דקות מונעת reset גדול בסוף."
      />
    ),
  },
  {
    id: "engineering",
    label: "לחשוב כמו מהנדס AI",
    content: (
      <EngineeringInsights
        why="checkpoint strategy קיימת כי תהליכים ארוכים (סוכן אוטונומי או סשן פיתוח) צוברים סטייה מצטברת ו-context rot. עצירות תקופתיות מגבילות את הנזק כשהוא עדיין רדוד וזול לתיקון."
        alternatives="לסמוך על אינטואיציה לדעת מתי לעצור — עובד למפתחים מנוסים מאוד, אבל checkpoints קבועים הם רשת-ביטחון עקבית. חלופה נוספת: להישען על undo תמיד — יעיל אבל מבזבז את העבודה שכן הייתה תקינה."
        whenNotTo="למשימה קצרה (פחות מ-10 דקות) — checkpoints הם overhead מיותר. וכשהסחיפה עדיין רדודה מאוד, re-grounding מהיר עדיף על reset מלא — לא כל סטייה מצדיקה לזרוק את הסשן."
        commonMistakes="להמשיך סשן שכבר 'הרגיש' לא נכון כי כבר הושקע בו זמן (sunk cost); לבלבל בין סחיפה רדודה (שמתקנים ב-re-ground) לעמוקה (שדורשת reset); ולשכוח שאפשר git checkout את השינויים ולהתחיל נקי."
        performance="context מוצף לא רק מסיט את המטרה — הוא גם מאט את המודל ומייקר כל הודעה (יותר טוקנים לעבד). reset לסשן נקי משפר גם את המיקוד וגם את הביצועים."
        security="סשן ארוך וסחוף עלול להכניס שינויים לא-מכוונים בקבצים רגישים (config, מפתחות, הרשאות) בלי שתשים לב. checkpoint עם git diff הוא גם בדיקת-אבטחה: מה בדיוק השתנה, ולמה."
        cost="checkpoint עולה כמה דקות עצירה. הוא חוסך שעות של תיקון עבודה שסטתה — ומונע את התרחיש היקר שבו סחיפה עמוקה מאלצת reset מלא של שעה שלמה."
        maintenance="הפניה חוזרת ל-CLAUDE.md כעוגן היא בדיוק הסיבה שמתחזקים אותו: קובץ עיגון עדכני הופך re-grounding למהיר ואמין. CLAUDE.md מיושן שולח את ה-AI לכיוון הלא-נכון."
        realWorld="בפרויקט הקפסטון (השיעור המסכם בטראק) תשתמש בדיוק בגישה הזו: audit מלא עם checkpoints ברורים בין שלבים, ועיגון חוזר ל-CLAUDE.md ולתיעוד — כדי שהסשן הארוך לא יסטה מהמטרה."
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
            <AlertTriangle size={16} /> מה שובר סשנים בפועל
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>סשן רציף של שעות בלי עצירה — הסחיפה מצטברת עד שקשה להפריד נחוץ ממיותר.</li>
            <li>ממשיכים סשן שכבר &quot;הרגיש&quot; לא נכון בגלל sunk cost (&quot;חבל על הזמן&quot;).</li>
            <li>מנסים לתקן סחיפה עמוקה על גבי context מורעל, במקום להתחיל נקי.</li>
            <li>מבקשים &quot;תקן הכל&quot; בהודעה אחת על עשרות קבצים סחופים — פרומפט ענק שמחמיר.</li>
            <li>CLAUDE.md מיושן, אז אין עוגן אמין לחזור אליו.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-success">
            <ShieldCheck size={16} /> איך מקצוענים עושים זאת
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>מגדירים מטרה במשפט אחד בתחילת סשן — אבן-בוחן לכל checkpoint.</li>
            <li>עוצרים כל 15-20 דקות: &quot;עדיין על המטרה?&quot; + typecheck + git diff.</li>
            <li>סחיפה רדודה → re-grounding אל CLAUDE.md; סחיפה עמוקה → undo/reset.</li>
            <li>לא מפחדים לזרוק סשן: נקי מנצח מוצף, גם אם הושקע זמן.</li>
            <li>מתחזקים CLAUDE.md עדכני כדי שהעיגון-מחדש יהיה אמין.</li>
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
        id="advanced-production-error-recovery-long-sessions"
        title="תרגל checkpoint, re-ground, ו-undo בסשן ארוך אמיתי"
        context="עבוד על משימה שדורשת יותר מ-20 דקות עבודה עם Claude Code (בכל פרויקט, למשל AtlasDesk)."
        steps={[
          "לפני שמתחילים, כתוב משפט אחד: מה המטרה המדויקת של הסשן הזה? ודא שהיא תואמת ל-CLAUDE.md.",
          "כל 15-20 דקות, עצור ובדוק: האם עדיין עובדים על אותה מטרה? הרץ typecheck ו-git diff.",
          "אם זיהית סחיפה רדודה — תרגל re-grounding: הפנה את Claude Code בחזרה ל-CLAUDE.md או להגדרת המשימה.",
          "צור בכוונה 'סחיפה' קטנה (בקש שינוי לא-קשור), ואז תרגל undo: git checkout של השינוי, וחזרה למסלול.",
          "החלט במודע לגבי הסשן: להמשיך, לתקן כיוון, או לפתוח סשן חדש — ותעד למה.",
        ]}
        successCriteria={[
          "ביצעת לפחות checkpoint אחד אמיתי עם typecheck/git diff בפועל",
          "תרגלת re-grounding אל CLAUDE.md ו-undo של שינוי אחד לפחות",
          "אתה יכול לדווח אם הייתה סחיפה, וכיצד החלטת לטפל בה (continue מול reset)",
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
          ["Goal drift", "סטייה הדרגתית מהמטרה המקורית לאורך תהליך ארוך — בסוכן או בסשן פיתוח."],
          ["Context rot", "הצטברות 'רעש' (ניסיונות שנזנחו, קבצים לא-רלוונטיים) שמסיטה את מיקוד ה-AI."],
          ["Checkpoint", "עצירה יזומה כל 15-20 דקות לאימות שהסשן עדיין על המטרה."],
          ["Re-grounding", "הפניית ה-AI בחזרה למקור-אמת (CLAUDE.md/תכנון) לניקוי רעש ומיקוד מחדש."],
          ["Reset session", "פתיחת סשן חדש נקי (עם תקציר תובנות) כשה-context מורעל מדי."],
          ["Sunk cost", "מלכודת: להמשיך רק כי כבר הושקע זמן — גם כשעדיף לזרוק ולהתחיל נקי."],
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
          <Compass size={16} className="text-primary" /> מה שחשוב לזכור
        </p>
        <ol className="list-decimal space-y-1.5 pr-5">
          <li><strong>goal drift ו-context rot</strong> הם כשלים שקטים — הם לא מפילים build, רק מסיטים.</li>
          <li><strong>checkpoint</strong> כל 15-20 דקות תופס סחיפה כשהיא עדיין רדודה וזולה.</li>
          <li>סחיפה רדודה → <strong>re-ground</strong> ל-CLAUDE.md; סחיפה עמוקה → <strong>undo/reset</strong>.</li>
          <li>היזהר מ-<strong>sunk cost</strong>: נקי מנצח מוצף, גם אם הושקע זמן.</li>
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
          חשוב על סשן עבודה ארוך שהיה לך לאחרונה (בכל הקשר, לא רק תכנות). היכן היו checkpoints
          עוזרים לתפוס סחיפה מוקדם יותר? ובאיזו נקודה, בדיעבד, reset היה חוסך לך זמן?
        </p>
        <p className="mt-3 font-semibold">מוביל לשיעור הבא:</p>
        <p className="mt-1 text-muted">
          למדת לייצב סשן פיתוח מפני סחיפה. בשיעור הבא (תהליכי דיפלוי לפרודקשן) ניקח את הקוד היציב
          הזה ונעביר אותו בבטחה כל הדרך עד production — כולל אימות ו-rollback.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
