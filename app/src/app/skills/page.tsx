"use client";

import Link from "next/link";
import { Lock, Network, ArrowLeft } from "lucide-react";
import { useAdaptive } from "@/lib/adaptive/use-adaptive";
import { isUnlockedBy } from "@/lib/adaptive/mastery";
import { MasteryBar } from "@/components/adaptive/mastery-bar";
import { getSkillById } from "@/lib/adaptive/skills";
import { cn } from "@/lib/utils";

export default function SkillsPage() {
  const { report } = useAdaptive();
  const { masteryList, masteryById, analytics } = report;

  // קיבוץ לפי טראק, בסדר הלימוד
  const byTrack = new Map<string, typeof masteryList>();
  for (const item of masteryList) {
    const key = item.skill.trackSlug;
    if (!byTrack.has(key)) byTrack.set(key, []);
    byTrack.get(key)!.push(item);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center gap-2">
        <Network size={22} className="text-primary" />
        <h1 className="text-3xl font-extrabold">מפת הכישורים שלי</h1>
      </div>
      <p className="mt-1 text-muted">
        גרף הידע של האקדמיה — כל מודול הוא כישור. השליטה נמדדת מהשלמת שיעורים, ביצועים בבחנים
        ושימור לאורך זמן. כישור נפתח כשדרישות-הקדם שלו בשליטה.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="כישורים שהתחלת" value={`${analytics.skillsStarted}/${analytics.totalSkills}`} />
        <MiniStat label="שליטה מלאה" value={String(analytics.skillsMastered)} />
        <MiniStat label="שליטה טובה" value={String(analytics.skillsProficient)} />
        <MiniStat label="דורשים רענון" value={String(analytics.skillsNeedingReview)} />
      </div>

      <div className="mt-10 space-y-10">
        {[...byTrack.entries()].map(([trackSlug, items]) => {
          const track = items[0].skill;
          return (
            <section key={trackSlug}>
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: track.trackColor }}
                />
                <h2 className="text-lg font-bold">{track.trackTitle}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map(({ skill, mastery }) => {
                  const prereqsMet = skill.prerequisiteSkillIds.every((pid) => {
                    const pm = masteryById.get(pid);
                    return pm ? isUnlockedBy(pm) : false;
                  });
                  const locked = mastery.lessonsDone === 0 && !prereqsMet && skill.prerequisiteSkillIds.length > 0;

                  return (
                    <div key={skill.id} className={cn(locked && "opacity-70")}>
                      <MasteryBar title={skill.title} mastery={mastery} />
                      {locked && (
                        <div className="mt-1 flex items-center gap-1.5 px-1 text-[11px] text-muted">
                          <Lock size={11} />
                          נעול — דורש:{" "}
                          {skill.prerequisiteSkillIds
                            .map((pid) => getSkillById(pid)?.title)
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          חזרה ללוח הבקרה <ArrowLeft size={14} />
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}
