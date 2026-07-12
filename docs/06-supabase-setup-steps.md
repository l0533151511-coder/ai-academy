# הפעלת Supabase — צעדים לביצוע לאחר קבלת פרטי חיבור

1. פתח את [F:\AI_Academy\app\.env.local.example](../app/.env.local.example), העתק לקובץ חדש בשם `.env.local` באותה תיקייה, ומלא:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY` (להפעלת ה-AI Mentor במלואו)
2. ב-Supabase Dashboard → SQL Editor: הרץ את התוכן המלא של [supabase-schema.sql](supabase-schema.sql).
3. אפשר Email confirmations לפי הצורך ב-Authentication → Providers → Email.
4. הפעל מחדש את שרת הפיתוח כדי שמשתני הסביבה החדשים ייטענו.
5. בדיקת קבלה: הרשמה ב-`/auth/signup`, השלמת שיעור ב-`/tracks/foundations/computer-basics/what-is-a-computer`, ווידוא שהנתונים מופיעים בטבלאות `profiles` ו-`lesson_progress` ב-Supabase.
