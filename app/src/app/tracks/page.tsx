import Link from "next/link";
import { CheckCircle2, Circle, Trophy } from "lucide-react";
import { TRACKS } from "@/lib/curriculum/data";

export const metadata = {
  title: "מסלולי לימוד",
  description: "כל מסלולי האקדמיה — מיסודות המחשב ועד בניית מוצרי AI בפרודקשן, מבוססי פרויקטים.",
};

export default function TracksPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-extrabold">מפת מסלולי הלימוד</h1>
      <p className="mt-2 text-muted">
        {TRACKS.length} מסלולים, מ”יסודות מחשב” ועד פרויקט גמר SaaS מלא — עם דגש מרכזי על הנדסת AI
        וClaude Code. עקוב אחרי הסדר — כל מסלול בונה על הקודם.
      </p>

      <ol className="mt-10 space-y-4">
        {TRACKS.map((track, i) => {
          const lessonsBuilt = track.modules.reduce((s, m) => s + m.lessons.length, 0);
          const isReady = lessonsBuilt > 0;
          return (
            <li key={track.slug}>
              <Link
                href={`/tracks/${track.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: track.color }}
                >
                  {i}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold">
                    {track.title}
                    {track.modules.some((m) => m.isCapstone) && (
                      <Trophy size={14} className="text-warning" />
                    )}
                  </div>
                  <div className="text-sm text-muted">{track.goal}</div>
                </div>
                <div className="hidden shrink-0 text-left sm:block">
                  <div className="text-xs text-muted">{track.modules.length} מודולים</div>
                </div>
                {isReady ? (
                  <CheckCircle2 size={20} className="shrink-0 text-success" />
                ) : (
                  <Circle size={20} className="shrink-0 text-border" />
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
