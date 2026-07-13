"use client";

// Hook שמחבר את מצב ההתקדמות (useProgress) למנוע האדפטיבי הטהור (buildAdaptiveReport).
// ממוזכר לפי מצב ההתקדמות — המנוע רץ מחדש רק כשמשהו רלוונטי משתנה.

import { useMemo, useState } from "react";
import { useProgress } from "@/lib/progress/store";
import { buildAdaptiveReport, type AdaptiveReport } from "./engine";

export function useAdaptive(): { report: AdaptiveReport; ready: boolean } {
  const { state } = useProgress();
  // "now" יציב פר-mount — דעיכת השימור איטית (ימים), אין צורך לעדכן בכל רינדור
  const [now] = useState(() => Date.now());

  const report = useMemo(
    () =>
      buildAdaptiveReport({
        completedLessons: state.completedLessons,
        completedAt: state.completedAt,
        quizzes: state.quizzes,
        reviews: state.reviews,
        now,
      }),
    [state.completedLessons, state.completedAt, state.quizzes, state.reviews, now]
  );

  // "ready" — האם יש מספיק אות כדי שההמלצות יהיו משמעותיות
  const ready = state.completedLessons.length > 0;

  return { report, ready };
}
