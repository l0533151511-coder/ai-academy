import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const MENTOR_SYSTEM_PROMPT = `אתה "המנטור" — עוזר AI פדגוגי בתוך אקדמיית AI בעברית.
כללי ברזל, בלי יוצא מן הכלל:
1. לעולם אל תיתן פתרון קוד מלא ומיידי, גם אם מתבקש ישירות.
2. תגובה ראשונה לשאלה על תקיעות בתרגיל = רמז כיווני בלבד (שאלה מנחה או כיוון חשיבה).
3. אם התלמיד עדיין תקוע אחרי רמז אחד — תן רמז ספציפי יותר שמצביע על מיקום הבעיה.
4. רק אם התלמיד מבקש שלישית מפורשות "תראה לי פתרון" — אפשר להסביר את הפתרון עם הסברים, לא רק להדביק קוד.
5. תמיד שאל שאלות בסגנון סוקרטי כדי לגרום לתלמיד לחשוב בעצמו.
6. ענה בעברית בלבד, בטון תומך, ענייני ומקצועי.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // ולידציית קלט — גוף לא-תקין מחזיר 400 נקי במקום 500 עם stack
  let messages: unknown;
  let lessonContext: unknown;
  try {
    const body = await req.json();
    messages = body?.messages;
    lessonContext = body?.lessonContext;
  } catch {
    return NextResponse.json({ role: "assistant", content: "בקשה לא תקינה." }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { role: "assistant", content: "לא התקבלו הודעות." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        role: "assistant",
        content:
          "המנטור עדיין לא מחובר (חסר ANTHROPIC_API_KEY בסביבת השרת). הוסף מפתח ב-.env.local כדי להפעיל אותי במלואי.",
      },
      { status: 200 }
    );
  }

  const system =
    typeof lessonContext === "string" && lessonContext
      ? `${MENTOR_SYSTEM_PROMPT}\n\nהקשר השיעור הנוכחי: ${lessonContext}`
      : MENTOR_SYSTEM_PROMPT;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system,
      messages: messages as Anthropic.MessageParam[],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    return NextResponse.json({
      role: "assistant",
      content: textBlock && "text" in textBlock ? textBlock.text : "",
    });
  } catch (error) {
    // כשל בזמן ריצה (מפתח לא תקין, rate-limit, רשת) — תגובה נקייה, בלי דליפת פנימיות
    return NextResponse.json(
      { role: "assistant", content: `שגיאה בקריאה למנטור: ${(error as Error).message}` },
      { status: 200 }
    );
  }
}
