import Link from "next/link";
import { ArrowLeft, Sparkles, Layers, Bot, Trophy } from "lucide-react";
import { TRACKS, totalLessons, allLessonsFlat } from "@/lib/curriculum/data";

// קישור לשיעור הראשון האמיתי (אין עמוד ברמת מודול — היה מוביל ל-404)
const FIRST_LESSON_HREF = allLessonsFlat()[0]?.href ?? "/tracks";

const STATS = [
  { label: "מסלולי לימוד", value: TRACKS.length.toString() },
  { label: "מודולים", value: TRACKS.reduce((s, t) => s + t.modules.length, 0).toString() },
  { label: "פרויקטי קפסטון", value: "9" },
  { label: "שיעורים בנויים", value: totalLessons().toString() },
];

const FEATURES = [
  {
    icon: Layers,
    title: "כל שיעור בונה משהו אמיתי",
    desc: "לא הגדרות ותיאוריה — כל שיעור מסתיים בקוד שרץ, בתרשים אינטראקטיבי ובתרגיל אמיתי.",
  },
  {
    icon: Bot,
    title: "AI Mentor שלא פותר בשבילך",
    desc: "רמז → רמז נוסף → הסבר הטעות → פתרון. המנטור בונה חשיבה עצמאית, לא העתקה.",
  },
  {
    icon: Trophy,
    title: "9 קפסטונים + פרויקט גמר SaaS",
    desc: "בכל 5 מודולים פרויקט פורטפוליו גדול. בסוף — פלטפורמת AI SaaS מלאה בפרודקשן.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted">
          <Sparkles size={14} className="text-primary" /> מ-0 מוחלט ועד מהנדס AI מקצועי
        </span>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
          האקדמיה שהופכת אותך
          <br />
          <span className="text-primary">לבונה מוצרי AI אמיתיים</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          לא עוד קורס וידאו. פלטפורמת לימוד אינטראקטיבית מלאה בעברית — מצגות, סימולציות, מעבדות
          קוד חיות, מנטור AI אישי, ופרויקטים אמיתיים מהיום הראשון ועד בניית SaaS מלא.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={FIRST_LESSON_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            התחל את השיעור הראשון <ArrowLeft size={18} />
          </Link>
          <Link
            href="/tracks"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-card"
          >
            צפה בכל מסלולי הלימוד
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-24 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon size={22} />
            </div>
            <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
            <p className="text-sm text-muted">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
