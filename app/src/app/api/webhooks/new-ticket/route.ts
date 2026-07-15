import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { HELP_ARTICLES } from "@/lib/atlasdesk/help-articles";
import { embed, cosineSimilarity } from "@/lib/atlasdesk/embeddings";
import { createAnthropicClient, extractTextBlock } from "@/lib/api-routes/anthropic-helpers";

export const runtime = "nodejs";

/**
 * Webhook endpoint ל-AtlasDesk — מודול Automation. מדמה מערכת טיקטים חיצונית ששולחת "פנייה
 * חדשה נוצרה", ו-AtlasDesk מייצר טיוטת תשובה אוטומטית מה-RAG הקיים — בלי שאדם צריך לפתוח
 * את הצ'אט בכלל. זו אוטומציה אמיתית: אירוע חיצוני -> תגובה אוטומטית מבוססת בסיס הידע.
 *
 * שתי הגנות production מהשיעור הקודם:
 * 1. אימות חתימה (HMAC) — לא סומכים על תוכן הבקשה בלבד.
 * 2. Idempotency — event ID שכבר טופל לא מעובד פעם שנייה.
 *
 * הערה: מאגר ה-event IDs כאן הוא in-memory (Set) לצורך הדגמה — בפרודקשן אמיתי זה היה
 * שורה בטבלת DB, כי in-memory לא שורד restart של השרת/מספר instances.
 */

const processedEventIds = new Set<string>();
const WEBHOOK_SECRET = process.env.ATLASDESK_WEBHOOK_SECRET;

interface NewTicketPayload {
  eventId: string;
  ticketId: string;
  subject: string;
  content: string;
}

function verifySignature(payloadRaw: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(payloadRaw).digest("hex");
  // timingSafeEqual מונע timing attack שמנצל כמה זמן לוקח להשוות חתימות
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        connected: false,
        message:
          "אין עדיין חיבור מלא ל-webhook (חסר ATLASDESK_WEBHOOK_SECRET בסביבת השרת). הוסף מפתח סודי כדי להפעיל את האוטומציה במלואה.",
      },
      { status: 200 }
    );
  }

  const signature = req.headers.get("x-atlasdesk-signature");
  if (!verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  // parse + ולידציית שדות: גוף חתום-אך-פגום מחזיר 400, ו-eventId חסר לא שובר את ה-idempotency
  let payload: NewTicketPayload;
  try {
    const parsed = JSON.parse(rawBody);
    if (
      !parsed ||
      typeof parsed.eventId !== "string" ||
      typeof parsed.ticketId !== "string" ||
      typeof parsed.subject !== "string" ||
      typeof parsed.content !== "string"
    ) {
      return NextResponse.json({ error: "missing or invalid fields" }, { status: 400 });
    }
    payload = parsed as NewTicketPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (processedEventIds.has(payload.eventId)) {
    return NextResponse.json({ status: "already_processed", eventId: payload.eventId });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!openaiKey || !anthropicKey) {
    return NextResponse.json(
      {
        connected: false,
        message: "חסרים OPENAI_API_KEY ו/או ANTHROPIC_API_KEY — לא ניתן לייצר טיוטת תשובה אוטומטית.",
      },
      { status: 200 }
    );
  }

  try {
    const articleTexts = HELP_ARTICLES.map((a) => `${a.title}: ${a.content}`);
    const [queryVec, ...articleVecs] = await embed(
      [`${payload.subject} ${payload.content}`, ...articleTexts],
      openaiKey
    );
    const relevant = HELP_ARTICLES.map((article, i) => ({
      ...article,
      similarity: cosineSimilarity(queryVec, articleVecs[i]),
    }))
      .sort((a, b) => b.similarity - a.similarity)
      .filter((a) => a.similarity > 0.3)
      .slice(0, 3);

    const contextBlock =
      relevant.length > 0
        ? relevant.map((r) => `[${r.title}]\n${r.content}`).join("\n\n")
        : "(לא נמצאו מאמרי עזרה רלוונטיים)";

    const client = createAnthropicClient(anthropicKey);
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 512,
      system: `אתה מנסח טיוטת תשובה ראשונית אוטומטית לפניית תמיכה חדשה ב-AtlasDesk, בהתבסס אך ורק על מאמרי העזרה המצורפים. אם אין מידע רלוונטי, כתוב במפורש שהפנייה דורשת טיפול אנושי. זו טיוטה שנציג יבדוק לפני שליחה בפועל — לא תשובה סופית ללקוח.\n\nמאמרי עזרה רלוונטיים:\n${contextBlock}`,
      messages: [{ role: "user", content: `נושא: ${payload.subject}\n\nתוכן: ${payload.content}` }],
    });

    processedEventIds.add(payload.eventId);

    return NextResponse.json({
      status: "draft_generated",
      ticketId: payload.ticketId,
      draftResponse: extractTextBlock(response.content),
      sources: relevant.map((r) => r.title),
    });
  } catch (e) {
    return NextResponse.json({ error: `webhook processing failed: ${(e as Error).message}` }, { status: 500 });
  }
}
