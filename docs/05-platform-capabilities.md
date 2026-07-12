# מלאי יכולות פלטפורמה — Definition of Done

סטטוס: ✅ בנוי ועובד · 🟡 בנוי חלקית · ⬜ מתוכנן

## תבנית שיעור אחידה (חובה בכל שיעור)
- ✅ יעדי למידה, זמן משוער, רמת קושי, דרישות קדם
- ✅ מצגת מקצועית (SlideDeck)
- ✅ אנימציה/דיאגרמה אינטראקטיבית (StepDiagram / D3)
- 🟡 אינפוגרפיקות ואיורים ייעודיים (כרגע רק אייקונים+SVG גנרי — צריך שכבת illustration ייעודית)
- ✅ הליכת קוד ודוגמאות חיות
- ✅ חבילת וידאו: סטוריבורד+תסריט+חלוקת סצנות+הוראות צילום+כתוביות (טקסטואלי, ללא רינדור וידאו אמיתי)
- ✅ תרגיל אינטראקטיבי עם ולידציה אוטומטית (תומך גם בבדיקות אסינכרוניות — check() יכול להיות async, נדרש עבור תרגילי fetch/API אמיתיים)
- ✅ מערכת רמזים מדורגת לפני חשיפת פתרון
- ✅ סימולטורים ייעודיים: ממיר בינארי, מחשב צעצוע CPU/זיכרון, NetworkJourney, HttpPlayground, RoleSort (רכיב כללי — משמש גם ל-client/server וגם לסוגי למידה), TerminalSimulator, GitSimulator, ApiCallerLab, NestedCircles, ConfusionMatrixLab, SpamClassifierLab, **NeuralNetworkVisualizer** (forward pass אינטראקטיבי, כללי לכל מספר שכבות), **GradientDescentVisualizer** (אנימציית ירידת גרדיאנט), **PixelDrawPad** (רכיב קנבס-ציור-פיקסלים כללי לשימוש חוזר בכל שיעור עתידי), **DigitRecognizerLab**; ⬜ Docker/DB playground — ימתינו לטראק ה-DevOps/Backend הקצר בעתיד
- ✅ **EngineeringInsights** — רכיב תוכן אחיד חדש ("לחשוב כמו מהנדס AI"): למה/חלופות/מתי לא/טעויות/ביצועים/עלות/אבטחה/תחזוקה/מערכות אמיתיות. ישולב מעכשיו בכל שיעור AI מרכזי (Claude Code, MCP, RAG, Agents) לעקביות
- ✅ **TokenVisualizer**, **AttentionVisualizer**, **ContextWindowVisualizer**, **TokenCostCalculator** — רביעיית ויזואלייזרים ל-LLM internals, כולם כלליים לשימוש חוזר בשיעורי Prompt Engineering/RAG/Agents הבאים
- ✅ בוחן ידע (QuizEngine)
- ✅ שיעורי בית
- ✅ מיני/פרויקט מודול
- ✅ סיכום + מונחון + שו"ת
- ⬜ הערות להדפסה (PDF export)
- ✅ מעקב התקדמות ו-XP

## תשתית ומערכת
- ✅ Next.js 16 + TypeScript + Tailwind, RTL מלא, עברית מלאה
- ✅ מצב כהה/בהיר
- ✅ PWA מלא: manifest עם אייקון SVG (any+maskable), **Service Worker אמיתי** (network-first לניווט, cache-first לנכסים סטטיים, אף פעם לא מקאש /api/)
- ✅ SEO: metadataBase, Open Graph, Twitter cards, robots.ts, sitemap.ts דינמי (נוצר אוטומטית מכל השיעורים הקיימים)
- ✅ נגישות: קישור "דלג לתוכן הראשי" (skip-link), landmarks סמנטיים, aria-labels על כפתורי אייקון
- ✅ **חיפוש גלובלי** (Ctrl+K / לחיצה בכותרת) — מחפש בכל תוכנית הלימודים, כולל נירמול אותיות סופיות (ך/ם/ן/ף/ץ) בעברית
- ✅ **הערות אישיות ומועדפים** — כל שיעור: כפתור "שמור למועדפים" + תיבת הערות אישיות (נשמר local + Supabase אם מחובר); לוח הבקרה מציג את כל השיעורים השמורים
- ✅ **המלצת "המשך למידה" חכמה** — מוצא את השיעור הבנוי הראשון שטרם הושלם לפי סדר הלימוד האמיתי (לא תמיד השיעור הראשון בטראק הראשון)
- ✅ **Prompt Playground** — רכיב פלטפורמה כללי (`components/playground/prompt-playground.tsx`) לקריאה אמיתית ל-Claude API עם system prompt ניתן לעריכה, מוצג טוקנים/עלות אמיתיים
- ✅ **`/api/ai/chat`** — נתיב Claude API גנרי לשימוש חוזר בכל פלייגראונד/AtlasDesk עתידי (לא ספציפי למנטור)
- ✅ **AtlasDesk v0.1** — מוצר נפרד ב-`/atlasdesk`, מנוע שיחה עם "מצב מפתח" (עלות/טוקנים אמיתיים לכל הודעה) — ראה [13-atlasdesk-features.md](13-atlasdesk-features.md)
- ⬜ Supabase (DB אמיתי, Auth, RLS) — בתהליך חיבור
- ✅ AI Mentor מחובר ל-Claude API עם מדיניות "רמזים לפני פתרון"
- 🟡 מעבדות: קוד (✅ Monaco+iframe), Prompt/MCP/RAG/Agent (⬜ placeholder בלבד)
- ✅ Dashboard: XP, רמות, סטריק, אחוז התקדמות, המשך למידה
- ✅ מפת מסלולים + עמוד מסלול עם רשימת מודולים/שיעורים
- ⬜ חיפוש גלובלי
- ⬜ הישגים/Badges (מנגנון XP קיים, badges טרם)
- ⬜ תעודות סיום (certificates) עם verify hash
- ⬜ פרופיל משתמש ופורטפוליו
- ⬜ פאנל ניהול תוכן (admin)
- ⬜ ניתוח למידה (learning analytics) מתקדם
- ⬜ קיצורי מקלדת
- ⬜ נגישות מלאה (audit WCAG)

## תשתית קוד ל-Backend/AI (בשימוש בטראקים 3, 7-9)
- ⬜ Terminal simulator באתר
- ⬜ Git simulator באתר
- ⬜ Docker/deployment simulator
- ⬜ API testing tool מובנה
- ⬜ JSON viewer
- ⬜ Database playground (SQL אינטראקטיבי)
- ⬜ GitHub simulator (PR/review flow מודמה)

## עדיפויות בנייה (לפי 03-roadmap.md)
1. חיבור Supabase אמיתי (DB+Auth+Progress+Achievements)
2. השלמת מודול 0.1 (שיעורים 2-5) ← המשך טראק 0
3. הוספת סימולטור טרמינל (נדרש למודול 0.3)
4. הוספת מנגנון Badges/Certificates לפני קפסטון #1
