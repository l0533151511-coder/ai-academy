# תוכנית קוריקולום מלאה — כל 12 הטראקים (מאושר על ידי המשתמש)

מסמך זה ממשיך את [16-full-academy-roadmap.md](16-full-academy-roadmap.md) לאחר קבלת החלטה:
**סדר בנייה: MCP → RAG → Agents → Multi-Agent → שאר הנושאים העסקיים. הכל בתוך AtlasDesk (אין
עוגן עסקי שני). מתוכנן במפורש כל ה-12 טראקים מראש**, לא רק MVP ראשון.

כל הטראקים החדשים ממופים על המבנה הקיים ב-`data.ts` (במקום ליצור טראקים-על חדשים) — רובם כבר
קיימים כמודולי-שלד (`lessons: []`) בתוך `ai-integration`, `ai-agents`, `production-ai`,
`saas-capstone`. כל שיעור: SlideDeck + דיאגרמה/ויזואלייזר + PromptComparisonLab/RealWorldTask
היכן שרלוונטי + EngineeringInsights + QuizEngine (עם `optionNotes` מלאים מהיום הראשון — לא נחזור
לחוב הישן) + מונחון + שיעורי בית. כל מודול מסתיים בהרחבה אמיתית ל-AtlasDesk.

## טראק ai-integration (order 5) — MCP, Embeddings, RAG, Fine-tuning

### מודול mcp-tools — MCP ו-Tool/Function Calling (בנייה הבאה, מיידית)
1. **מה זה Tool/Function Calling** — איך מודל "מבקש" להריץ פונקציה, schema של כלי, תוצאה חוזרת
2. **פרוטוקול MCP: קונספט וארכיטקטורה** — client/server, resources/tools/prompts
3. **בניית שרת MCP ראשון** — עם Claude Code, כלי אמיתי (בדיקת מזג אוויר/סטטוס)
4. **חיבור MCP ל-AtlasDesk** — כלי "בדוק סטטוס הזמנה" אמיתי שה-support agent יכול לקרוא לו
5. **פרויקט מודול**: AtlasDesk מקבל יכולת #4 מהטבלה ב-13-atlasdesk-features.md

### מודול embeddings-vector-db — Embeddings ומסדי נתונים וקטוריים
1. **מהם Embeddings** — וקטורים סמנטיים, similarity, מעבדת embeddings אינטראקטיבית (ויזואלייזר חדש: EmbeddingExplorer)
2. **מסדי נתונים וקטוריים** — pgvector על Supabase, אינדקסים, cosine similarity בפועל
3. **בניית מנוע חיפוש סמנטי** — עם Claude Code, על תוכן AtlasDesk (מאמרי עזרה)
4. **פרויקט מודול**: חיפוש סמנטי במסמכי עזרה של AtlasDesk

### מודול rag — RAG (Retrieval-Augmented Generation)
1. **אנטומיית RAG** — chunking, retrieval, augmentation, generation — RAGPipelineVisualizer חדש
2. **אסטרטגיות chunking וretrieval** — גודל chunk, overlap, re-ranking
3. **בניית RAG אמיתי** — עם Claude Code, ידע מוצר אמיתי (docs/13-atlasdesk-features.md כ-knowledge base לדוגמה)
4. **הערכת איכות RAG** — grounding, hallucination detection, מדדים
5. **פרויקט מודול**: AtlasDesk עונה מתוך בסיס ידע אמיתי (יכולת #6 בטבלה)

### מודול fine-tuning — מושגי Fine-tuning (קצר, תיאורטי-רוב)
1. **מתי Fine-tuning נחוץ ומתי RAG/Prompting מספיקים** — טבלת החלטה
2. **LoRA ושיטות יעילות** — ברמת מושג, לא מימוש מלא (עלות חישובית לא ריאלית לאקדמיה בדפדפן)
3. **הערכת מודל מותאם** — benchmarks, A/B מול המודל הבסיסי

## טראק ai-agents (order 6) — סוכנים ואוטומציה

### מודול single-agent — סוכן AI בודד
1. **לולאת Agent** — think→act→observe, AgentPlaygroundVisualizer חדש
2. **זיכרון סוכן** — short-term (שיחה) מול long-term (persisted), קשר לזיכרון AtlasDesk שכבר נבנה
3. **תכנון בתוך agent loop** — sub-goals, self-correction
4. **פרויקט מודול**: AtlasDesk מקבל סוכן עם זיכרון שיחה מלא (יכולת #7)

### מודול multi-agent — מערכות רב-סוכניות
1. **דפוסי תיאום** — hand-off, supervisor/worker, debate
2. **Multi-Agent Visualizer** — ויזואליזציה של תקשורת בין סוכנים
3. **בניית אסקלציה רב-סוכנית** — עם Claude Code
4. **פרויקט מודול**: AtlasDesk — סוכן ראשוני מסלים לסוכן מומחה (יכולת #8)

### מודול automation-scraping — אוטומציה, Browser Automation ואינטגרציות API
1. **Browser Automation אחראי** — Playwright/Puppeteer concepts, מתי מותר/אסור scraping
2. **OCR ועיבוד מסמכים** — טקסט מתוך תמונות/PDF סרוקים (בהשראת [[lexcore-scanned-ocr]])
3. **אינטגרציות API חיצוניות** — webhooks, auth מול API צד ג', retry/idempotency
4. **Word/Office Add-ins** — יסודות (concept-level; מימוש מלא מחוץ להיקף דפדפן)
5. **פרויקט מודול**: AtlasDesk מייבא פניות לקוח מקובץ/מייל סרוק אוטומטית

## טראק production-ai (order 7) — הרחבה: אבטחה, בדיקות, ניטור, סקייל

### מודול חדש: security-auth — אבטחה, Auth ו-Multi-tenancy (נוסף למודול הקיים cost-security)
1. **Authentication יסודות** — sessions/JWT, מה ההבדל, מתי כל אחד
2. **Authorization ו-RBAC** — תפקידים/הרשאות, איך מונעים גישה לא מורשית
3. **Multi-tenancy** — בידוד דיירים (tenants) באותו מסד נתונים
4. **פרויקט מודול**: AtlasDesk מקבל auth אמיתי + הפרדת ארגונים (יכולת #10)

### מודול חדש: testing-refactoring — בדיקות ו-Refactoring בקנה מידה (מרחיב את מודול 3 של Claude Code Mastery)
1. **פירמידת בדיקות** — unit/integration/e2e, מה שווה לבדוק ומה לא
2. **Refactoring גדול בטוח עם Claude Code** — אסטרטגיית safety net לפני שינוי מבני
3. **פרויקט מודול**: כיסוי בדיקות אמיתי לחלקים הקריטיים של AtlasDesk

### מודול קיים monitoring-scale — ניטור, לוגים וסקייל (כפי שתוכנן)
1. **Observability**: לוגים מובנים, מדדים, traces
2. **Background workers ו-Queues** — עיבוד אסינכרוני (עיבוד מסמך שהועלה)
3. **Event-driven architecture** — יסודות, מתי מתאים
4. **Caching וביצועים** — cache invalidation, N+1, load testing בסיסי
5. **פרויקט מודול**: ניטור אמיתי + עיבוד רקע ל-AtlasDesk (יכולת #9)

### מודול קיים production-best-practices — כפי שתוכנן (SLA, rollback, feature flags, runbooks)

## טראק saas-capstone (order 8) — עסקי וסגירה

### מודול saas-business — הרחבה: Billing ו-Payments
1. **מודלי תמחור SaaS** — subscription/usage-based/hybrid
2. **סימולציית Billing** — Stripe-like, לא אינטגרציה אמיתית לתשלומים (מחוץ להיקף פדגוגי בטוח)
3. **פרויקט מודול**: AtlasDesk מקבל billing simulation (יכולת #10 המשך)

### saas-planning / saas-build / saas-launch — כפי שתוכננו, קפסטון סופי: AtlasDesk כמוצר שלם

## מודול Cursor מול Claude Code
שיעור בודד (לא מודול שלם) שיתווסף לתוך `claude-code-mastery/advanced-production` — השוואה
מעשית: IDE-agentic (Cursor) מול CLI-agentic (Claude Code), יתרונות/חסרונות, מתי לשלב.

## סדר ביצוע בפועל (מאושר)
1. **עכשיו**: mcp-tools (4-5 שיעורים) → embeddings-vector-db → rag → fine-tuning
2. **אחר כך**: single-agent → multi-agent → automation-scraping
3. **אחר כך**: security-auth (חדש) → testing-refactoring (חדש) → monitoring-scale → production-best-practices
4. **אחר כך**: saas-business (billing) → saas-planning/build/launch (קפסטון)
5. **במקביל/בהפסקות**: להשלים את מודולים 3-6 של Claude Code Mastery שהושהו, ולשחזר את 73 שאלות
   הבוחן הישנות (חוב טכני מ-[15-product-review.md](15-product-review.md)) — לא לזנוח לצמיתות.
