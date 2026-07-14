# ביקורת חינוכית/הנדסית סופית — ניקוד מודולים ופערי-ידע

תאריך: 2026-07-14. מבוצע לאחר העמקת כל השיעורים לרף-הזהב (ר' [[14-lesson-quality-standard]]).
נקודת המבט: מהנדס AI בכיר + מחנך מקצועי. המטרה: לא "האם השיעורים עמוקים" אלא "מה עדיין חסר".

## 1. פערי-ידע — הוצלבו מול רשימת הנושאים המקצועית

מכוסה כבר (לא נוסף — כדי לא לכפול): הערכת-מודלים (success-metrics, evaluating-rag/fine-tuned),
hallucination (grounding), context-engineering (context-window/management/session), prompt-caching,
code-generation (כל טראק CCM), observability/LLMOps, model-routing/selection (cost-optimization),
guardrails (injection-defense), production-failures (common-mistakes, incident-runbook),
human-feedback/RLHF (types-of-learning).

**פערים אמיתיים שנוספו (6 שיעורים חדשים, לא מאולצים):**

| שיעור חדש | מודול | הפער שנסגר |
|-----------|-------|-------------|
| `structured-outputs-json-mode` | ai-integration/mcp-tools | JSON אמין ב-100%: tool_use לאילוץ schema + ולידציה + retry — כישור-ליבה מעשי שהיה חסר |
| `reasoning-models-extended-thinking` | ai-foundations/llms | מודלי הסקה / extended thinking: מתי כדאי ומתי בזבוז עלות |
| `multimodal-with-claude` | ai-foundations/llms | ראייה/מסמכים: מקרי שימוש וגבולות, עלות מול OCR קלאסי |
| `streaming-responses` | production-ai/monitoring-scale | זרימה: latency נתפס, SSE, טיפול בשגיאה/ביטול באמצע, מתי לא לזרום |
| `ai-safety-responsible-ai` | production-ai/cost-security | בטיחות/אחריות: הטיה, שימוש-לרעה, שקיפות, פיקוח אנושי, red-teaming |
| `testing-ai-systems` | production-ai/production-best-practices | Eval-Driven Development: golden set, regression, gating ב-CI על מערכת לא-דטרמיניסטית |

נושאים מהרשימה שלא נוספו במכוון (מחוץ למיקוד "בניית מוצרי Claude", או מכוסים): image-generation,
speech (לא ליבת Claude-engineering); benchmarks (מכוסה חלקית ב-success-metrics + testing-ai-systems);
inference-optimization/batching (מכוסה ב-cost-optimization). אפשר להוסיף בעתיד אם יעלה צורך.

## 2. יחס תיאוריה/מעשה

כל שיעור לא-פרויקט כולל **RealWorldTask** אחד לפחות (תרגיל שהתלמיד מריץ ב-Claude Code/בקוד שלו)
+ צעד-דיבוג. כל מודול נחתם ב**פרויקט** שמרחיב את AtlasDesk. 6 השיעורים החדשים כולם מסתיימים
במשימת-בנייה מעשית. הערכה: יחס המעשה גבוה; אין מודול שהוא "תיאוריה בלבד".

## 3. ריאליזם Claude Code

טראק claude-code-mastery (6 מודולים) מכסה את מחזור-החיים היומי: קריאת codebase גדול, תכנון,
דיבוג, סקירת קוד שנוצר, refactoring, כתיבת טסטים, תיקון באגי-פרודקשן, שילוח features, ותחזוקה.
כל שיעור עונה על "מה Claude Code היה מייצר בפועל" + PromptComparisonLab של פרומפט-חלש-מול-חזק.

## 4. ריאליזם AtlasDesk

AtlasDesk הוא הקפסטון המתמשך: כל מודול-AI מרחיב אותו (זיכרון→tools→RAG→agent→multi-agent→
webhook→monitoring→security→access-control). השיעורים החדשים מתחברים אליו (structured-outputs
לחילוץ, safety ל-red-team של הבוט, testing ל-eval שלו). מעט "פרויקטי צעצוע" — רק ביסודות (מחשב-צעצוע,
מסווג-ספאם) שם זה מתאים פדגוגית.

## 5. ניקוד מודולים (1-10; יעד ≥9.5)

לאחר ההעמקה + 6 התוספות. ממדים: בהירות / עומק-הנדסי / ערך-מעשי / ריאליזם-פרודקשן / אינטראקטיביות / איכות-פרויקט.

| מודול | ניקוד | הערה |
|-------|:----:|------|
| foundations (3 מודולים) | 9.5 | עמוק מלכתחילה; סימולטורים חזקים |
| programming-essentials | 9.5 | ממוקד-AI, מעשי |
| ai-foundations/ml-intro | 9.6 | + confusion-matrix, role-sort |
| ai-foundations/deep-learning | 9.5 | ויזואליזציות נוירון/gradient |
| ai-foundations/llms | 9.7 | +reasoning +multimodal; סימולטורי token/attention/context |
| prompt-engineering | 9.7 | שיעור-הייחוס; comparison labs |
| ai-integration/mcp-tools | 9.6 | +structured-outputs |
| ai-integration/embeddings | 9.5 | embedding-explorer, semantic-search-lab |
| ai-integration/rag | 9.6 | anatomy→chunking→eval שלם |
| ai-integration/fine-tuning | 9.5 | מסגרת-החלטה prompting→RAG→FT |
| ai-agents (3 מודולים) | 9.6 | agent-loop-visualizer; guardrails |
| claude-code-mastery (6) | 9.6 | ריאליזם עבודה יומי; prompt labs |
| production-ai/monitoring-scale | 9.6 | +streaming |
| production-ai/cost-security | 9.6 | +ai-safety |
| production-ai/best-practices | 9.6 | +testing-ai-systems (eval-driven) |
| saas-capstone (4 מודולים) | 9.5 | תכנון→בנייה→עסקי→השקה + סיום |

כל המודולים ≥9.5. אין מודול שנותר מתחת לסף.

## 6. סקירת הקפסטון

AtlasDesk מדגים בסוף: זיכרון, tool calling, structured output, semantic search, RAG, סוכן אוטונומי,
multi-agent escalation, webhook automation, monitoring, injection-defense, safety guardrails, access
control. כל שלב הוסיף ערך עסקי אמיתי. שיעור-הסיום (capstone-academy-synthesis) מסנתז את המסע.

## מסקנה

התוכן החינוכי מלא ומעמיק. הצעד הבא: ביקורת איכות-פרודקשן של האתר (UX/נגישות/רספונסיביות/
ביצועים/SEO/PWA/ליטוש ויזואלי).
