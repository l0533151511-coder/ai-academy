# אקדמיית AI

פלטפורמת לימוד אינטראקטיבית בעברית שמלמדת הנדסת AI מאפס ועד בניית מוצרי AI מסחריים — במיקוד על Claude Code, Prompt Engineering, MCP, RAG, Agents, ובניית מערכות AI אמיתיות.

## מבנה הריפו

```
app/     — אפליקציית Next.js (הפלטפורמה עצמה)
docs/    — תוכנית לימודים, ארכיטקטורה, סטטוס בנייה, החלטות עיצוב
```

## מסמכי יסוד (בסדר קריאה מומלץ)
1. [docs/00-vision.md](docs/00-vision.md) — חזון ועקרונות
2. [docs/08-ai-focused-restructure.md](docs/08-ai-focused-restructure.md) — מקור האמת הנוכחי לסדר העבודה (עדכני ביותר)
3. [docs/04-master-plan.md](docs/04-master-plan.md) — תוכנית אב מפורטת, שיעור-שיעור, עם סטטוס בנייה
4. [docs/05-platform-capabilities.md](docs/05-platform-capabilities.md) — מלאי יכולות פלטפורמה (Definition of Done)
5. [docs/02-architecture.md](docs/02-architecture.md) — ארכיטקטורת מערכת
6. [docs/10-known-issues.md](docs/10-known-issues.md) — בעיות ידועות ותובנות

## הרצה מקומית

```bash
cd app
npm install
npm run dev
```

פותח בכתובת `http://localhost:3000` (או פורט אחר לפי `-p`).

### משתני סביבה (אופציונליים)
העתק את `app/.env.local.example` ל-`app/.env.local` ומלא:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — להפעלת התחברות אמיתית ושמירת התקדמות ב-DB (ראה [docs/06-supabase-setup-steps.md](docs/06-supabase-setup-steps.md))
- `ANTHROPIC_API_KEY` — להפעלת ה-AI Mentor במלואו

**האתר עובד באופן מלא גם בלי משתני הסביבה האלה** — ההתקדמות נשמרת local-first (localStorage), וה-AI Mentor מציג הודעה ברורה אם אין מפתח מוגדר.

## פריסה (Deployment)
מפורט ב-[docs/11-deployment.md](docs/11-deployment.md).

## סטטוס
ראה [docs/04-master-plan.md](docs/04-master-plan.md) לסטטוס מפורט של כל מודול. עדכון אחרון: טראק היסודות (0.1-0.4) + טראק יסודות תכנות ל-AI + תחילת טראק AI Foundations (5.1-5.2) בנויים ומאומתים במלואם.
