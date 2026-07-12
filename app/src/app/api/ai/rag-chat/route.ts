import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { HELP_ARTICLES } from "@/lib/atlasdesk/help-articles";
import { embed, cosineSimilarity } from "@/lib/atlasdesk/embeddings";

export const runtime = "nodejs";

/**
 * RAG מלא ל-AtlasDesk — מודול RAG. משלב את שני השירותים שכבר קיימים:
 * Retrieval (embeddings, מודול הקודם) + Generation (Claude, מודול Prompt Engineering) +
 * Augmentation (הזרקת ה-chunks שנמצאו לתוך system prompt עם הנחיית grounding קפדנית).
 *
 * דורש גם OPENAI_API_KEY (embeddings) וגם ANTHROPIC_API_KEY (generation) — אם אחד מהם חסר,
 * מוחזרת הודעת graceful-degradation ברורה, בדיוק כמו בכל שאר תכונות AtlasDesk.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const RAG_SYSTEM_PROMPT = `אתה נציג תמיכת הלקוחות של AtlasDesk. ענה אך ורק בהתבסס על מאמרי העזרה
המצורפים למטה. אם המידע הדרוש לא מופיע בהם במפורש, אמור בבירור "אין לי מידע מדויק על כך
במאמרי העזרה שלנו" — אל תשלים פרטים בעצמך ואל תנחש. ענה בעברית, בקצרה וברור.`;

export async function POST(req: NextRequest) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  if (!openaiKey || !anthropicKey) {
    const missing = [!openaiKey && "OPENAI_API_KEY", !anthropicKey && "ANTHROPIC_API_KEY"]
      .filter(Boolean)
      .join(" ו-");
    return NextResponse.json(
      {
        connected: false,
        content: `אין עדיין חיבור מלא ל-RAG (חסר ${missing} בסביבת השרת). הוסף את המפתחות כדי להפעיל את היכולת הזו במלואה.`,
      },
      { status: 200 }
    );
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMessage) {
    return NextResponse.json({ error: "no user message found" }, { status: 400 });
  }

  try {
    const articleTexts = HELP_ARTICLES.map((a) => `${a.title}: ${a.content}`);
    const [queryVec, ...articleVecs] = await embed([lastUserMessage.content, ...articleTexts], openaiKey);

    const ranked = HELP_ARTICLES.map((article, i) => ({
      ...article,
      similarity: cosineSimilarity(queryVec, articleVecs[i]),
    })).sort((a, b) => b.similarity - a.similarity);

    // Augmentation: רק המאמרים עם similarity סביר נכנסים ל-context — אם כלום לא רלוונטי מספיק,
    // המודל יקבל את זה ריק ויאלץ להודות שאין לו מידע (grounding אמיתי, לא רק בתיאוריה).
    const relevant = ranked.filter((r) => r.similarity > 0.3).slice(0, 3);
    const contextBlock =
      relevant.length > 0
        ? relevant.map((r) => `[${r.title}]\n${r.content}`).join("\n\n")
        : "(לא נמצאו מאמרי עזרה רלוונטיים לשאלה זו)";

    const client = new Anthropic({ apiKey: anthropicKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: `${RAG_SYSTEM_PROMPT}\n\nמאמרי עזרה רלוונטיים:\n${contextBlock}`,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return NextResponse.json({
      connected: true,
      content: textBlock && "text" in textBlock ? textBlock.text : "",
      sources: relevant.map((r) => ({ title: r.title, similarity: r.similarity })),
      usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
    });
  } catch (e) {
    return NextResponse.json(
      { connected: true, content: `שגיאה ב-RAG: ${(e as Error).message}` },
      { status: 200 }
    );
  }
}
