import { NextRequest, NextResponse } from "next/server";
import {
  GENERAL_AGENT_SYSTEM_PROMPT,
  BILLING_SPECIALIST_SYSTEM_PROMPT,
  ESCALATION_TOOL,
} from "@/lib/atlasdesk/multi-agent";
import { createAnthropicClient, extractTextBlock, missingApiKeyResponse } from "@/lib/api-routes/anthropic-helpers";

export const runtime = "nodejs";

/**
 * מערכת רב-סוכנית ל-AtlasDesk — מודול Multi-Agent. סוכן כללי (GENERAL_AGENT_SYSTEM_PROMPT) מטפל
 * בשאלות רגילות; אם הוא מזהה שאלת חיוב מורכבת, הוא קורא לכלי escalate_to_billing_specialist,
 * ואז מתבצע handoff מלא (כל ההיסטוריה + הסיבה) לסוכן מומחה נפרד (BILLING_SPECIALIST_SYSTEM_PROMPT)
 * שממשיך את השיחה בפועל — לא רק "מחזיר תשובה", אלא מייצר את התשובה הסופית עצמה.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  if (!apiKey) {
    return missingApiKeyResponse(
      "אין עדיין חיבור ל-Claude API (חסר ANTHROPIC_API_KEY בסביבת השרת). הוסף מפתח כדי להפעיל את המערכת הרב-סוכנית במלואה."
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const client = createAnthropicClient(apiKey);

  try {
    // שלב 1: הסוכן הכללי מקבל את השיחה, עם אפשרות להסלים
    const generalResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: GENERAL_AGENT_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      tools: [ESCALATION_TOOL],
    });

    const escalationBlock = generalResponse.content.find(
      (b) => b.type === "tool_use" && b.name === "escalate_to_billing_specialist"
    );

    if (!escalationBlock || escalationBlock.type !== "tool_use") {
      // אין אסקלציה — הסוכן הכללי עונה ישירות
      return NextResponse.json({
        connected: true,
        content: extractTextBlock(generalResponse.content),
        agent: "general",
        usage: {
          inputTokens: generalResponse.usage.input_tokens,
          outputTokens: generalResponse.usage.output_tokens,
        },
      });
    }

    // שלב 2: handoff מלא לסוכן המומחה — כל ההיסטוריה + סיבת האסקלציה
    const reason = (escalationBlock.input as { reason?: string }).reason ?? "שאלת חיוב מורכבת";
    const specialistResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: `${BILLING_SPECIALIST_SYSTEM_PROMPT}\n\nסיבת האסקלציה מהנציג הכללי: ${reason}`,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return NextResponse.json({
      connected: true,
      content: extractTextBlock(specialistResponse.content),
      agent: "billing-specialist",
      escalationReason: reason,
      usage: {
        inputTokens: generalResponse.usage.input_tokens + specialistResponse.usage.input_tokens,
        outputTokens: generalResponse.usage.output_tokens + specialistResponse.usage.output_tokens,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { content: `שגיאה במערכת הרב-סוכנית: ${(e as Error).message}`, connected: true, usage: null },
      { status: 200 }
    );
  }
}
