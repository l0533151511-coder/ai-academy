# פריסה (Deployment)

## סטטוס — פרוס ופעיל ✅
- **אתר חי:** https://ai-academy-three-olive.vercel.app
- **ריפו:** https://github.com/f025954954-coder/ai-academy
- ✅ פרויקט Git מקומי מסודר עם היסטוריית קומיטים ברורה, נדחף ל-GitHub (branch `main`)
- ✅ מחובר ל-Vercel (Root Directory = `app`, Framework: Next.js, זוהה אוטומטית)
- ✅ `npm run build` עבר נקי — 55 עמודים, 0 שגיאות; ה-build האמיתי ב-Vercel הושלם ב-39 שניות
- ✅ נבדק בפועל בפרודקשן: דף הבית, מפת מסלולים, שיעור LLM עם TokenVisualizer חי, סימולטור Git חי (הרצתי `git init` בפועל) — הכל עובד, 0 שגיאות קונסולה

## פלטפורמת האחסון: Vercel
Vercel היא היצרנית של Next.js — תמיכה מלאה ב-App Router, Server Components, Route Handlers (ה-API
של ה-Mentor), ללא קונפיגורציה נוספת. אין `vercel.json` — Next.js זוהה אוטומטית.

## מה זמין כרגע באתר החי
כל הפלטפורמה עובדת במלואה **ללא** משתני סביבה של Supabase/Anthropic:
- כל 27 השיעורים (טראק יסודות מלא + טראק יסודות תכנות ל-AI + טראק AI Foundations מלא)
- כל הסימולטורים/מעבדות (טרמינל, Git, HTTP, רשת נוירונים, gradient descent, טוקניזציה, attention, context window, מחשבון עלויות)
- מעקב התקדמות/XP/סטריק — local-first (localStorage בדפדפן)
- AI Mentor — מציג הודעה ברורה שחסר מפתח, לא שובר את שאר האתר

## מה עדיין דורש הגדרה (אופציונלי)
כדי להפעיל את אלה, יש להוסיף ב-Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — התחברות אמיתית + שמירת התקדמות ב-DB (ראה [06-supabase-setup-steps.md](06-supabase-setup-steps.md))
- `ANTHROPIC_API_KEY` — AI Mentor מלא

לאחר הוספת משתנה סביבה יש ל-Redeploy (Vercel Dashboard → Deployments → ⋯ → Redeploy) כדי שהוא ייכנס לתוקף.

## פריסות עתידיות (Continuous Deployment)
כל `git push` ל-`main` יגרום ל-deploy אוטומטי חדש ב-Vercel — אין צורך בפעולה נוספת. Vercel גם יוצר
Preview Deployment נפרד לכל branch/PR.

## תהליך שביצעתי (לתיעוד)
1. `git init` ב-`F:\AI_Academy`, 12 קומיטים מאורגנים לפי שלב פיתוח
2. יצרתי ריפו GitHub ריק (`ai-academy`) דרך הדפדפן (התחברות דרך תוסף Chrome המחובר לחשבון)
3. `git remote add origin` + `git push -u origin main` — הצליח (SSH כבר היה מאומת מפרויקטים קודמים)
4. יבוא הריפו ל-Vercel דרך הדפדפן, הגדרת Root Directory ל-`app`, לחיצת Deploy
5. אימות: נבדק שהאתר עולה, שאין שגיאות קונסולה, ושסימולטורים אינטראקטיביים (Git, טוקנייזר) עובדים בפועל בפרודקשן
