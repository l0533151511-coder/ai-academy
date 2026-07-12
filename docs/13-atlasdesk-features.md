# AtlasDesk — מעקב יכולות שנבנו

מוצר הלימוד המתמשך (ראה [12-continuous-capstone.md](12-continuous-capstone.md)). טבלה זו מתעדכנת
בסוף כל מודול שמוסיף יכולת. **נסה בעצמך:** `/atlasdesk`

| # | יכולת | טראק/מודול מקור | סטטוס | קובץ מרכזי |
|---|---|---|---|---|
| 1 | מנוע שיחה בסיסי + system prompt מובנה | Prompt Engineering (6.1) | ✅ | `components/atlasdesk/support-chat.tsx`, `lib/atlasdesk/config.ts` |
| 2 | מצב מפתח: טוקנים/עלות אמיתיים לכל הודעה | Prompt Engineering (6.1) | ✅ | `components/atlasdesk/support-chat.tsx` |
| 2.5 | זיכרון שיחה persistent (localStorage, שורד רענון דף) | Claude Code Mastery — תכנון וארכיטקטורה (6.2מ2) | ✅ | `components/atlasdesk/support-chat.tsx` |
| 3 | Claude Code agentic workflows (התקנה, CLAUDE.md, context, תכנון) | Claude Code Mastery (מודולים 1-2) | ✅ | `docs/14-claude-code-track.md`, `tracks/claude-code-mastery/**` |
| 4 | MCP + Tool Calling (בדיקת סטטוס פנייה אמיתי) | MCP (ai-integration/mcp-tools) | ✅ | `app/api/ai/tool-chat/route.ts`, `lib/atlasdesk/tools.ts`, `components/atlasdesk/support-chat.tsx` ("כלים מחוברים") |
| 5 | Embeddings + חיפוש סמנטי (מאמרי עזרה) | ai-integration/embeddings-vector-db | ✅ | `app/api/ai/semantic-search/route.ts`, `lib/atlasdesk/embeddings.ts`, `components/playground/semantic-search-lab.tsx` |
| 6 | RAG — תשובות מבוססות מאמרי עזרה + ציטוט מקור | ai-integration/rag | ✅ | `app/api/ai/rag-chat/route.ts`, `components/atlasdesk/support-chat.tsx` ("RAG מופעל") |
| 7 | סוכן AI עם זיכרון שיחה | ai-agents/single-agent | ⬜ | — |
| 8 | אסקלציה רב-סוכנית | ai-agents/multi-agent | ⬜ | — |
| 9 | ניטור/דשבורד שיחות | production-ai/monitoring-scale | ⬜ | — |
| 10 | Auth + ניהול משתמשים/ארגונים | production-ai/security-auth (חדש), saas-capstone | ⬜ | — |

הערה: יכולת #4 (Tool Calling) מדגימה function calling אמיתי דרך Claude API (`tools` param, `tool_use`/`tool_result`
round-trip) — לא MCP protocol מילולי (client/server נפרד עם transport משלו), כי זה לא מתאים לאפליקציית
Vercel serverless. השיעורים ב-mcp-tools מסבירים את ההבדל הזה במפורש כתובנה הנדסית.
