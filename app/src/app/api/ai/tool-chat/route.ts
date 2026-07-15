import { NextRequest, NextResponse } from "next/server";
import { ATLASDESK_TOOLS, executeTool } from "@/lib/atlasdesk/tools";
import { createAnthropicClient, extractTextBlock, missingApiKeyResponse } from "@/lib/api-routes/anthropic-helpers";

export const runtime = "nodejs";

/**
 * נתיב Claude API עם Tool/Function Calling אמיתי — הליבה שגם MCP server וגם Claude Code
 * עצמו בנויים סביבה. מדגים את הלולאה המלאה: המודל מבקש להריץ כלי -> אנחנו מריצים אותו
 * בפועל (tools.ts) -> שולחים את התוצאה בחזרה -> המודל מנסח תשובה סופית לאדם.
 *
 * הבדל מ-/api/ai/chat: זה כן שומר "תור" קצר של round-trips (עד שהמודל מפסיק לבקש כלים),
 * ומחזיר גם את "יומן הכלים" (toolLog) כדי שהלקוח יוכל להציג שקיפות מלאה על מה שקרה.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ToolLogEntry {
  tool: string;
  input: Record<string, unknown>;
  result: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let system: string | undefined;
  let messages: ChatMessage[];
  try {
    const body = (await req.json()) as { system?: string; messages: ChatMessage[] };
    system = body.system;
    messages = body.messages;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!apiKey) {
    return missingApiKeyResponse(
      "אין עדיין חיבור ל-Claude API (חסר ANTHROPIC_API_KEY בסביבת השרת). הוסף מפתח כדי להפעיל את מעבדת ה-Tool Calling במלואה."
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const client = createAnthropicClient(apiKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversation: any[] = messages.map((m) => ({ role: m.role, content: m.content }));
  const toolLog: ToolLogEntry[] = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  try {
    // מקסימום 4 round-trips כדי למנוע לולאה אינסופית אם המודל "נתקע" מבקש כלים שוב ושוב
    for (let round = 0; round < 4; round++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system,
        messages: conversation,
        tools: ATLASDESK_TOOLS,
      });

      totalInputTokens += response.usage.input_tokens;
      totalOutputTokens += response.usage.output_tokens;

      if (response.stop_reason !== "tool_use") {
        return NextResponse.json({
          content: extractTextBlock(response.content),
          toolLog,
          usage: { inputTokens: totalInputTokens, outputTokens: totalOutputTokens },
          connected: true,
        });
      }

      conversation.push({ role: "assistant", content: response.content });

      const toolResults = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = executeTool(block.name, block.input as Record<string, unknown>);
          toolLog.push({ tool: block.name, input: block.input as Record<string, unknown>, result });
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        }
      }
      conversation.push({ role: "user", content: toolResults });
    }

    return NextResponse.json({
      content: "המודל ביקש להריץ כלים יותר מדי פעמים ברצף — נעצר כאן ליתר ביטחון.",
      toolLog,
      usage: { inputTokens: totalInputTokens, outputTokens: totalOutputTokens },
      connected: true,
    });
  } catch (e) {
    return NextResponse.json(
      { content: `שגיאה בקריאה ל-Claude API: ${(e as Error).message}`, toolLog, usage: null, connected: true },
      { status: 200 }
    );
  }
}
