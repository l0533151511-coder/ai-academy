import { NextRequest, NextResponse } from "next/server";
import { getStats } from "@/lib/atlasdesk/monitoring";

export const runtime = "nodejs";

/**
 * Endpoint סטטיסטיקות ל-AtlasDesk — מודול Monitoring & Scale, מוקשח במודול SaaS/Build.
 * מציג עלות/שימוש מצטבר שנאסף מ-logEvent (ראה lib/atlasdesk/monitoring.ts). in-memory בלבד
 * לצורך הדגמה — ראה הערה בקובץ המקור לגבי המעבר הנדרש ל-DB בפרודקשן אמיתי.
 *
 * הגנת גישה בסיסית (מודול saas-build): נתוני עלות/שימוש הם מידע עסקי רגיש (מנהל טכני/persona
 * בלבד, ראה מודול saas-planning) — לא אמורים להיות פומביים לחלוטין. זו הגנה בסיסית עם API key
 * משותף, לא auth מלא — ראה docs/13-atlasdesk-features.md להרחבה על הפער שנותר.
 */
export async function GET(req: NextRequest) {
  const adminKey = process.env.ATLASDESK_ADMIN_KEY;

  // fail-closed: היעדר סוד = חסימה, לא חשיפה. נתוני עלות/שימוש לא נחשפים ללא הגנה מוגדרת.
  if (!adminKey) {
    return NextResponse.json(
      {
        connected: false,
        message:
          "הגנת הגישה אינה מוגדרת (חסר ATLASDESK_ADMIN_KEY בסביבת השרת). מטעמי אבטחה הנתונים חסומים עד שתוגדר.",
      },
      { status: 503 }
    );
  }

  const providedKey = req.headers.get("x-atlasdesk-admin-key");
  if (providedKey !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getStats());
}
