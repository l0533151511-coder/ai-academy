# דו"ח מוכנות להשקה — Launch Readiness Report

תאריך: 2026-07-14 · פרודקשן: https://ai-academy-three-olive.vercel.app · 149 routes, build ירוק.
בוצע: ביקורת איכות-פרודקשן מלאה (functional QA, UI/UX, נגישות, מובייל, ביצועים, production-eng,
SEO/PWA, code-quality). מסמך זה כן ומלא — כולל מה שלא תוקן.

---

## 1. בעיות שהתגלו ותוקנו

### קריטי / production-risk (תוקן)
- **`/api/mentor` ללא הגנה כלל** — `req.json()` ו-`messages.create()` בלי try/catch → 500 עם דליפת stack. **תוקן:** try/catch + ולידציית קלט (400 על גוף פגום).
- **`/api/atlasdesk/stats` נכשל-פתוח** — בהיעדר `ATLASDESK_ADMIN_KEY` החזיר נתוני עלות רגישים ל-כולם. **תוקן:** fail-closed (503).
- **webhook new-ticket** — `JSON.parse` + גישת-שדות מחוץ ל-try; `eventId` חסר שבר idempotency. **תוקן:** parse+ולידציה בתוך try (400).
- **תמונת OG חסרה** — twitter `summary_large_image` בלי תמונה → כרטיס שיתוף ריק. **תוקן:** `opengraph-image.tsx` דינמי 1200×630.

### פונקציונלי / UX (תוקן)
- **ניווט מובייל נעדר לגמרי** (<768px) — כל התפריט הוסתר בלי המבורגר. **תוקן:** `MobileNav` (המבורגר + מגירה + Escape).
- **`res.ok` לא נבדק** ב-support-chat / prompt-playground / mentor-widget → בועה ריקה / עלות מיושנת ב-4xx/5xx. **תוקן** בשלושתם.
- **support-chat** — שמירת localStorage לא מוגנת (מצב פרטי/quota מפיל את הרכיב); `similarity.toFixed` על ערך אפשרי לא-מספרי. **תוקן.**
- **lesson-shell** — ההערה לא התאפסה במעבר בין שיעורים (ref חד-פעמי). **תוקן:** איפוס לפי lessonSlug.
- **skills page** — התעלם מ-`ready` והציג מפה אפסית מטעה. **תוקן:** מצב-ריק ידידותי.
- **עמוד הבית** — כפתור "התחל שיעור ראשון" הצביע למודול לא-קיים (404). **תוקן** (בסבב קודם) דרך `allLessonsFlat()[0]`.

### נגישות (תוקן)
- מיקוד-מקלדת בלתי-נראה → `:focus-visible` גלובלי; `--muted` הוכהה ל-WCAG AA.
- transcripts של צ'אט/מנטור בלי live-region → `role=log aria-live`.
- בוחן: `radiogroup/radio`+`aria-checked`, טקסט sr-only "נכון/שגוי", תוצאה `role=status`.
- פסי-התקדמות: `role=progressbar`+`aria-value*`.
- טפסי auth: קישור label↔input + `role=alert`.
- global-search: `role=dialog`+`aria-modal`+listbox.
- SVG/ויזואליזציות: `role=img`+aria-label; אייקונים דקורטיביים `aria-hidden`.
- SVG אינטראקטיביים (nested-circles, pixel-draw-pad): הופעלו במקלדת (Enter/Space) + מגע.

### SEO/PWA (תוקן)
- metadata לדשבורד (עמוד client בלי layout); descriptions לעמודי-אב; JSON-LD `EducationalOrganization`.
- sitemap↔robots: הוסרו `/dashboard` ו-`/auth/*` החסומים מה-sitemap.
- Service Worker: bump cache v2 + stale-while-revalidate (מונע נכס מיושן אחרי דיפלוי).

### קורקטנס API (תוקן)
- rag-chat: parse בטוח + guard למערך messages לפני `.reverse()`; `usage:null` בשגיאה.
- multi-agent-chat: `usage:null` בשגיאה (עקביות חוזה-תגובה).

---

## 2. חוב טכני שנותר (מודע, מתועד)

- **`/api/mentor` עדיין משכפל** helpers (יוצר Anthropic client ידנית במקום `anthropic-helpers`) ומחזיר מבנה שונה (`{role,content}`). עובד, אך לא-DRY. עדיפות נמוכה.
- **שאר נתיבי ה-AI** מבצעים `await req.json()` מחוץ ל-try (אך מוודאים את התוצאה) — גוף פגום → 500 במקום 400. לא מסוכן (הם מאחורי לקוח משלנו), אך לא אחיד. עדיפות נמוכה.
- **`in-memory` state**: `processedEventIds` (webhook) ו-`monitoring` (stats) הם in-memory — לא שורדים restart/multi-instance. **מודע ומתועד בקוד** (הדגמה חינוכית; בפרודקשן אמיתי → DB).
- **אין `<Button>`/`<Card>` primitive** — ~200 מופעי `rounded-*` מפוזרים. עקבי-בהקשר אך לא מקודד. שיפור תחזוקתיות עתידי.
- **manifest icons**: SVG בלבד; חסרים PNG 192/512 + apple-touch 180 (חלק מלאנצ'רים של אנדרואיד/iOS מעדיפים raster).
- **canonical URLs**: לא מוגדרים per-page (סיכון duplicate-content נמוך באתר טרי).
- **`optionNotes` לשאלות quiz ישנות** (טראקים מוקדמים) — חלקן עדיין בלי per-option notes (משימה #33).
- **hydration flash** בדשבורד (0%→ערך אמיתי לפרסוק אחד) — skills תוקן; דשבורד עדיין מהבהב קלות (לא skeleton מלא).

## 3. סיכונים שנותרו

- **תלות ב-Vercel Hobby/quota** — הפרויקט הועבר לחשבון חדש בגלל מיצוי התוכנית הקודמת. תעבורה גבוהה עלולה למצות שוב.
- **מפתחות AI אופציונליים** — בלי `ANTHROPIC_API_KEY`/`OPENAI_API_KEY` כל תכונות ה-AI מחזירות graceful-degradation (עובד, אך "לא מחובר"). בהשקה אמיתית צריך מפתחות + ניטור עלות.
- **אין auth אמיתי** לאזורים "פרטיים" (dashboard) — הם client-side בלבד; ה-gate של stats הוא API-key משותף, לא הרשאות משתמש. מתאים לאקדמיה, לא ל-SaaS רב-משתמשים.
- **בדיקות אוטומטיות** — אין suite טסטים (unit/e2e). האימות מבוסס build + QA ידני/סוכני. סיכון רגרסיה עתידי.

## 4. הערכת מוכנות להשקה

| תחום | ציון | הערה |
|------|:---:|------|
| תוכן חינוכי | ✅ מוכן | 100+ שיעורים ברף-זהב, ניקוד ≥9.5 |
| יציבות פונקציונלית | ✅ מוכן | route/data מאומת, API מוקשח, build ירוק |
| נגישות | ✅ טוב | blockers עיקריים תוקנו; ליטוש-קצה נותר |
| מובייל | ✅ טוב | ניווט+touch-targets תוקנו |
| SEO/PWA | ✅ מוכן | metadata/OG/JSON-LD/SW תקינים |
| ביצועים | ✅ סביר | SSG סטטי, אזור fra1; אין suite מדידה |
| אבטחה | ⚠️ מספיק-לאקדמיה | fail-closed + injection-defense; **אין auth רב-משתמשים** |
| בדיקות | ⚠️ פער | אין suite אוטומטי |

**פסק-דין:** **מוכן להשקה ציבורית כאקדמיית-לימוד** (תוכן חינם, נתונים מקומיים/אופציונליים).
**לא מוכן** כ-SaaS מסחרי רב-משתמשים עם נתונים רגישים — לשם כך נדרשים auth אמיתי, DB לניטור/idempotency,
ו-suite בדיקות. זה תואם למטרת הפרויקט (אקדמיה, לא מוצר-SaaS חי) — הפער מודע ומכוון.

## 5. המלצות לפני חשיפה ציבורית רחבה

1. הגדרת `ANTHROPIC_API_KEY` (+`OPENAI_API_KEY` ל-RAG) + ניטור-עלות/מכסה ב-Vercel.
2. הוספת PNG icons (192/512/apple-touch) ל-manifest.
3. suite טסטים מינימלי: smoke e2e ל-3 המסכים המרכזיים + eval ל-endpoints של AtlasDesk.
4. אם עוברים ל-SaaS: auth אמיתי (Supabase כבר מחובר), DB ל-monitoring+idempotency, RBAC ל-stats.
5. סגירת חוב קל: DRY ל-`/api/mentor`, per-page canonical, `optionNotes` לשאלות הישנות (#33).

*כל הפריטים בסעיפים 1-3 אומתו חיים בפרודקשן (build+deploy+curl) לאורך הביקורת.*
