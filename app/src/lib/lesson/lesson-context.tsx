"use client";

// Context קליל שמעביר את מזהה השיעור הנוכחי (lessonKey) לרכיבים מקוננים כמו QuizEngine,
// כדי שיוכלו לרשום תוצאות למנוע האדפטיבי — בלי לחווט prop דרך ~100 עמודי שיעור.
// LessonShell הוא הספק; רכיבים צורכים דרך useLessonKey(). מחוץ לשיעור מחזיר null (no-op).

import * as React from "react";

const LessonKeyContext = React.createContext<string | null>(null);

export function LessonKeyProvider({
  lessonKey,
  children,
}: {
  lessonKey: string;
  children: React.ReactNode;
}) {
  return <LessonKeyContext.Provider value={lessonKey}>{children}</LessonKeyContext.Provider>;
}

/** מזהה השיעור הנוכחי בפורמט "track/module/lesson", או null אם לא בתוך שיעור. */
export function useLessonKey(): string | null {
  return React.useContext(LessonKeyContext);
}
