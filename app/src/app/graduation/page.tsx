import Link from "next/link";
import {
  GraduationCap,
  Code2,
  Wrench,
  Bug,
  Building2,
  Boxes,
  Terminal,
  Rocket,
  ShieldCheck,
  TestTube2,
  Activity,
  MessagesSquare,
  Hammer,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { TRACKS, allLessonsFlat } from "@/lib/curriculum/data";

export const metadata = {
  title: "תקן הבוגר — מה תדע לבנות",
  description:
    "מה בוגר אקדמיית ה-AI יודע לעשות: לבנות, לאבטח, לבדוק, לפרוס ולתחזק מערכות AI בפרודקשן.",
};

type Cat = { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; points: string[] };

const CATEGORIES: Cat[] = [
  {
    icon: Code2,
    title: "כישורים טכניים",
    points: [
      "קריאה נכונה ל-Claude API: system/user, streaming, tool_use, טיפול בשגיאות ו-rate-limits",
      "פלט מובנה (JSON) עם schema + ולידציה + retry — לא לסמוך על המודל",
      "RAG מקצה-לקצה + הערכת רטריבל וגנרציה בנפרד",
      "בחירה מנומקת בין prompting → RAG → fine-tuning",
    ],
  },
  {
    icon: Wrench,
    title: "כישורים הנדסיים",
    points: [
      "פירוק משימה גדולה למשימות קטנות, הפיכות וניתנות-לסקירה",
      "עבודה מאחורי טסטים; אימות build+typecheck+בדיקה חיה לפני commit",
      "החלטות trade-off מודעות (עלות/ביצועים/מורכבות) עם תיעוד ה'למה'",
    ],
  },
  {
    icon: Bug,
    title: "יכולת דיבוג",
    points: [
      "repro + השערות לפני תיקון; טסט שמשחזר את הבאג",
      "ניפוי מערכת לא-דטרמיניסטית: באג בקוד מול פרומפט חלש מול רטריבל גרוע",
      "קריאת diff שנוצר ב-AI בעין ביקורתית — לזהות מה בור/מומצא",
    ],
  },
  {
    icon: Building2,
    title: "ארכיטקטורה",
    points: [
      "תכנון architecture-first: גבולות, זרימת-נתונים ונקודות-כשל לפני קוד",
      "בחירת בידוד נכון (multi-tenancy) ונימוק blast-radius",
      "מתי single-agent מספיק ומתי multi-agent מוצדק (ומתי over-engineering)",
    ],
  },
  {
    icon: Boxes,
    title: "עיצוב מוצר AI",
    points: [
      "מיפוי persona ו-jobs-to-be-done; לא לבנות 'לכולם'",
      "תמחור עם מודעות ל-margin (עלות טוקן משתנה מול הכנסה קבועה)",
      "הגדרת MVP, מדד-הפעלה ו-time-to-value",
    ],
  },
  {
    icon: Terminal,
    title: "שליטה ב-Claude Code",
    points: [
      "ניווט codebase גדול ולא-מוכר לפני שינוי (מפת-ארכיטקטורה, נקודות-כניסה)",
      "ניהול הקשר (CLAUDE.md, scoping) ומניעת context rot",
      "הובלה בפרומפט-חזק, סקירת הפלט, ושילוח בבטחה — עבודה יומית אמיתית",
    ],
  },
  {
    icon: ShieldCheck,
    title: "מוכנות לפרודקשן",
    points: [
      "הבחנה בין 'עובד' ל'מוכן ללקוחות משלמים'",
      "graceful degradation — עובד/נכשל-בחן גם כשה-AI לא זמין",
      "הגנת prompt injection + guardrails + red-teaming; פיתוח אחראי",
    ],
  },
  {
    icon: Rocket,
    title: "פריסה",
    points: [
      "pipeline: build→test→verify→deploy→verify-prod→rollback",
      "staging, feature flags, canary — לעולם לא פלט-AI לא-מאומת",
      "גלגול-אחורה של פרומפט/מודל גרוע בלי redeploy",
    ],
  },
  {
    icon: TestTube2,
    title: "בדיקות",
    points: [
      "evals (golden set) למערכת לא-דטרמיניסטית במקום assert-equals",
      "regression על כל שינוי פרומפט/מודל + gate ב-CI",
      "הרחבת ה-golden set מכשלי-פרודקשן אמיתיים",
    ],
  },
  {
    icon: Activity,
    title: "ניטור",
    points: [
      "לוגינג מובנה לכל קריאה (עלות, טוקנים, latency, הצלחת-כלים)",
      "מדדים ייחודיים ל-AI + התרעה על קפיצות",
      "זיהוי אנומליה מנתונים, לא מתחושת-בטן",
    ],
  },
  {
    icon: MessagesSquare,
    title: "תקשורת",
    points: [
      "כתיבת מפרט, runbook תקרית ודוח-אבטחה ברורים",
      "הסבר trade-off הנדסי למי-שאינו-מהנדס",
      "תיעוד החלטות כך שמהנדס אחר יבין את ה'למה' בעוד חצי שנה",
    ],
  },
  {
    icon: Hammer,
    title: "תחזוקה",
    points: [
      "טיפול ב-drift: זיהוי שינוי איכות/עלות ורענון (נתונים/פרומפט/מודל)",
      "עבודה עם קוד legacy וקוד-AI לא-מושלם: שיפור הדרגתי מאחורי טסטים",
      "ניהול חוב-טכני מודע: לתקן את הקריטי, לתעד את השאר",
    ],
  },
];

export default function GraduationPage() {
  // מסע AtlasDesk + סולם הפרויקטים — נגזרים מהקוריקולום (מקור אמת יחיד)
  const projects = allLessonsFlat().filter(
    (l) => l.lessonSlug.startsWith("project-") || l.lessonSlug.startsWith("capstone-")
  );
  const atlasProjects = projects.filter(
    (l) => l.lessonSlug.includes("atlasdesk") || l.lessonSlug.includes("academy-synthesis")
  );
  const trackColor = (slug: string) => TRACKS.find((t) => t.slug === slug)?.color ?? "#5b5bf6";

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      {/* Hero */}
      <div className="text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted">
          <GraduationCap size={15} className="text-primary" /> תקן הבוגר
        </span>
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          מה תדע <span className="text-primary">לבנות</span> בסיום
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          בוגר האקדמיה לא מציג תעודה — הוא מציג יכולת מוכחת: לקחת רעיון למוצר AI, לתכנן, לבנות עם
          Claude Code, לאבטח, לבדוק, לפרוס, לנטר ולתחזק אותו בפרודקשן — בביטחון, ולבד.
        </p>
      </div>

      {/* 12 capability categories */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon size={18} />
              </span>
              <h2 className="font-bold">{c.title}</h2>
            </div>
            <ul className="space-y-1.5 text-sm text-muted">
              {c.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* AtlasDesk journey */}
      <div className="mt-16">
        <div className="mb-2 flex items-center gap-2">
          <Trophy size={20} className="text-warning" />
          <h2 className="text-2xl font-extrabold">מסע AtlasDesk — הקפסטון המתמשך</h2>
        </div>
        <p className="mb-6 max-w-3xl text-muted">
          לאורך כל האקדמיה אתה בונה מוצר AI אחד שגדל שלב-אחר-שלב — מ-system prompt בודד ועד מוצר
          SaaS מנוטר ומאובטח. זו ההוכחה החיה שאתה יכול לבנות מערכת אמיתית, לא דוגמת-צעצוע.
        </p>
        <ol className="relative space-y-2 border-r-2 border-border pr-5">
          {atlasProjects.map((p) => (
            <li key={p.href} className="relative">
              <span
                className="absolute -right-[27px] top-2 size-3 rounded-full ring-4 ring-background"
                style={{ backgroundColor: trackColor(p.trackSlug) }}
              />
              <Link
                href={p.href}
                className="block rounded-xl border border-border bg-card p-3 text-sm transition hover:border-primary"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <h2 className="text-xl font-bold">הרף ברור. הדרך בנויה. נשאר רק לבנות.</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          כל שיעור מקרב אותך לתקן הזה. עקוב אחר השליטה שלך במפת-הכישורים, והמשך מהמקום שבו הפסקת.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            המשך למידה <ArrowLeft size={16} />
          </Link>
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-card"
          >
            מפת הכישורים שלי
          </Link>
        </div>
      </div>
    </div>
  );
}
