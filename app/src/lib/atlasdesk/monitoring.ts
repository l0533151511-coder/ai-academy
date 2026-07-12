// שכבת ניטור בסיסית ל-AtlasDesk — מודול Monitoring & Scale.
// הערה: מאגר in-memory לצורך הדגמה בלבד — בפרודקשן אמיתי זה חייב להיות ב-DB (Supabase),
// אחרת הנתונים נעלמים בכל restart/deploy ולא נצברים נכון על פני כמה instances של השרת.

export interface AtlasDeskEvent {
  route: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  latencyMs: number;
  timestamp: number;
}

const events: AtlasDeskEvent[] = [];
const MAX_EVENTS = 500; // מגבלת זיכרון פשוטה — לא לתפוח לנצח

export function logEvent(event: AtlasDeskEvent) {
  events.push(event);
  if (events.length > MAX_EVENTS) events.shift();
}

export function getStats() {
  if (events.length === 0) {
    return { totalCalls: 0, totalCostUsd: 0, avgLatencyMs: 0, byRoute: {} };
  }
  const totalCostUsd = events.reduce((sum, e) => sum + e.costUsd, 0);
  const avgLatencyMs = Math.round(events.reduce((sum, e) => sum + e.latencyMs, 0) / events.length);

  const byRoute: Record<string, { calls: number; costUsd: number }> = {};
  for (const e of events) {
    if (!byRoute[e.route]) byRoute[e.route] = { calls: 0, costUsd: 0 };
    byRoute[e.route].calls += 1;
    byRoute[e.route].costUsd += e.costUsd;
  }

  return { totalCalls: events.length, totalCostUsd, avgLatencyMs, byRoute };
}
