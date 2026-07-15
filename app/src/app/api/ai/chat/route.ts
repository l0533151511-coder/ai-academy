import { NextRequest, NextResponse } from "next/server";
import { createAnthropicClient, extractTextBlock, missingApiKeyResponse, apiCallErrorResponse } from "@/lib/api-routes/anthropic-helpers";
import { logEvent } from "@/lib/atlasdesk/monitoring";
import { estimateCallCost } from "@/lib/simulators/pricing";

export const runtime = "nodejs";

/**
 * נתיב Claude API גנרי — משמש את Prompt Playground, AtlasDesk, ופלייגראונדים עתידיים.
 * לא מחזיק state/היסטוריה בשרת — הקליינט שולח את כל השיחה בכל פעם (בדיוק כמו Claude API האמיתי).
 * מחזיר usage אמיתי (טוקני קלט/פלט בפועל) — לא הערכה — לשימוש במחשבוני עלות מדויקים.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let system: string | undefined;
  let messages: ChatMessage[];
  let maxTokens = 1024;
  try {
    const body = (await req.json()) as { system?: string; messages: ChatMessage[]; maxTokens?: number };
    system = body.system;
    messages = body.messages;
    maxTokens = body.maxTokens ?? 1024;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!apiKey) {
    return missingApiKeyResponse(
      "אין עדיין חיבור ל-Claude API (חסר ANTHROPIC_API_KEY בסביבת השרת). הוסף מפתח כדי להפעיל את המעבדה הזו במלואה — כל שאר האתר ממשיך לעבוד כרגיל."
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const client = createAnthropicClient(apiKey);
  const startedAt = Date.now();

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: maxTokens,
      system,
      messages,
    });

    logEvent({
      route: "chat",
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      costUsd: estimateCallCost(response.usage.input_tokens, response.usage.output_tokens),
      latencyMs: Date.now() - startedAt,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      content: extractTextBlock(response.content),
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      connected: true,
    });
  } catch (e) {
    return apiCallErrorResponse(e);
  }
}
