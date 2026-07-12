import { NextResponse } from "next/server";
import { getStats } from "@/lib/atlasdesk/monitoring";

export const runtime = "nodejs";

/**
 * Endpoint סטטיסטיקות ל-AtlasDesk — מודול Monitoring & Scale. מציג עלות/שימוש מצטבר שנאסף
 * מ-logEvent (ראה lib/atlasdesk/monitoring.ts). in-memory בלבד לצורך הדגמה — ראה הערה בקובץ
 * המקור לגבי המעבר הנדרש ל-DB בפרודקשן אמיתי.
 */
export async function GET() {
  return NextResponse.json(getStats());
}
