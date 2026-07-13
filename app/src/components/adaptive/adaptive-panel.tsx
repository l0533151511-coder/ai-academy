"use client";

import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAdaptive } from "@/lib/adaptive/use-adaptive";
import { STATUS_BADGE, STATUS_LABEL } from "@/lib/adaptive/labels";
import { cn } from "@/lib/utils";

/**
 * הפאנל האדפטיבי של לוח הבקרה: המסלול המותאם אישית ללומד —
 * המלצות המשך חכמות, חולשות לחיזוק, וחזרות שבשלו. נגזר כולו ממנוע הלמידה.
 */
export function AdaptivePanel() {
  const { report, ready } = useAdaptive();

  if (!ready) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted">
        <div className="mb-1 flex items-center gap-2 font-bold text-foreground">
          <Compass size={18} className="text-primary" /> המסלול המותאם אישית שלך
        </div>
        השלם את השיעור הראשון שלך — ומכאן המערכת תתחיל להתאים לך המלצות למידה, לזהות חולשות,
        ולתזמן חזרות אישיות.
      </div>
    );
  }

  const { recommendations, weaknesses, reviews, analytics } = report;

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center gap-2">
        <Compass size={20} className="text-primary" />
        <h2 className="text-xl font-bold">המסלול המותאם אישית שלך</h2>
      </div>

      {/* אנליטיקת למידה — תקציר */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="שליטה ממוצעת" value={`${Math.round(analytics.averageMastery * 100)}%`} icon={TrendingUp} />
        <Stat label="כישורים בשליטה מלאה" value={`${analytics.skillsMastered}/${analytics.totalSkills}`} icon={Sparkles} />
        <Stat
          label="דיוק בבחנים"
          value={analytics.overallQuizAccuracy === null ? "—" : `${Math.round(analytics.overallQuizAccuracy * 100)}%`}
          icon={TrendingUp}
        />
        <Stat label="חזרות שבשלו" value={String(reviews.length)} icon={RotateCcw} />
      </div>

      {/* המלצות המשך */}
      {recommendations.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Sparkles size={16} className="text-primary" /> הצעד הבא המומלץ עבורך
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <Link
                key={rec.lesson.href}
                href={rec.lesson.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-primary"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{rec.lesson.title}</div>
                  <div className="truncate text-xs text-muted">
                    {rec.skill.trackTitle} · {rec.reason}
                  </div>
                </div>
                <ArrowLeft size={16} className="shrink-0 text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* חזרות מרווחות שבשלו */}
      {reviews.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
            <RotateCcw size={16} className="text-danger" /> זמן לרענן — חזרה מרווחת
          </h3>
          <div className="space-y-2">
            {reviews.slice(0, 5).map((r) => (
              <Link
                key={r.lessonSlug}
                href={r.lesson?.href ?? "#"}
                className="flex items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger/5 p-3 transition hover:border-danger"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {r.lesson?.title ?? r.lessonSlug}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {r.skill?.trackTitle ?? ""}
                    {r.overdueDays > 0 ? ` · באיחור ${r.overdueDays} ימים` : " · להיום"}
                  </div>
                </div>
                <ArrowLeft size={16} className="shrink-0 text-danger" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* חולשות לחיזוק */}
      {weaknesses.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
            <AlertTriangle size={16} className="text-warning" /> כדאי לחזק
          </h3>
          <div className="space-y-2">
            {weaknesses.map((w) => (
              <div
                key={w.skill.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{w.skill.title}</div>
                  <div className="truncate text-xs text-muted">{w.reason}</div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    STATUS_BADGE[w.mastery.status]
                  )}
                >
                  {STATUS_LABEL[w.mastery.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link
        href="/skills"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        מפת הכישורים המלאה שלי <ArrowLeft size={14} />
      </Link>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted">
        <Icon size={13} /> {label}
      </div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
    </div>
  );
}
