// תוויות וצבעים לסטטוסי שליטה — משותף לכל רכיבי ה-UI האדפטיביים.

import type { MasteryStatus } from "./mastery";

export const STATUS_LABEL: Record<MasteryStatus, string> = {
  "not-started": "טרם התחלת",
  learning: "בלמידה",
  proficient: "שליטה טובה",
  mastered: "שליטה מלאה",
  "needs-review": "דורש רענון",
};

/** מחלקות Tailwind לרקע/טקסט של תג סטטוס. */
export const STATUS_BADGE: Record<MasteryStatus, string> = {
  "not-started": "bg-muted/10 text-muted",
  learning: "bg-warning/10 text-warning",
  proficient: "bg-primary/10 text-primary",
  mastered: "bg-success/10 text-success",
  "needs-review": "bg-danger/10 text-danger",
};

/** צבע מילוי לפס השליטה. */
export const STATUS_BAR: Record<MasteryStatus, string> = {
  "not-started": "bg-muted/40",
  learning: "bg-warning",
  proficient: "bg-primary",
  mastered: "bg-success",
  "needs-review": "bg-danger",
};
