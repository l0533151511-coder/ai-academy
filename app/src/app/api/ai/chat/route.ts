import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

/**
 * נתיב Claude API גנרי — משמש את Prompt Playground, AtlasDesk, ופלייגראונדים עתידיים (MCP/RAG/Agent).
 * לא מחזיק state/היסטוריה בשרת — הקליינט שולח את כל השיחה בכל פעם (בדיוק כמו Claude API האמיתי).
 * מחזיר usage אמיתי (טוקני קלט/פלט בפועל) — לא הערכה — לשימוש במחשבוני עלות מדויקים.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const { system, messages, maxTokens = 1024 } = (await req.json()) as {
    system?: string;
    messages: ChatMessage[];
    maxTokens?: number;
  };

  if (!apiKey) {
    return NextResponse.json(
      {
        content:
          "אין עדיין חיבור ל-Claude API (חסר ANTHROPIC_API_KEY בסביבת השרת). הוסף מפתח כדי להפעיל את המעבדה הזו במלואה — כל שאר האתר ממשיך לעבוד כרגיל.",
        usage: { inputTokens: 0, outputTokens: 0 },
        connected: false,
      },
      { status: 200 }
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: maxTokens,
      system,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return NextResponse.json({
      content: textBlock && "text" in textBlock ? textBlock.text : "",
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      connected: true,
    });
  } catch (e) {
    return NextResponse.json(
      { content: `שגיאה בקריאה ל-Claude API: ${(e as Error).message}`, usage: null, connected: true },
      { status: 200 }
    );
  }
}
