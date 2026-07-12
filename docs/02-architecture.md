# ארכיטקטורת מערכת — אקדמיית AI

## סטאק טכנולוגי
- **Frontend/Full-stack:** Next.js 14+ (App Router), TypeScript, React Server Components
- **עיצוב:** Tailwind CSS + shadcn/ui (מותאם RTL מלא), Framer Motion לאנימציות, Radix Primitives לנגישות
- **דיאגרמות/ויזואליזציה:** Excalidraw-style custom SVG components, D3.js לגרפים אינטראקטיביים, Lottie לאנימציות מוכנות
- **מסד נתונים:** PostgreSQL (Supabase) — עקבי עם שאר הפרויקטים של המשתמש
- **Auth:** Supabase Auth / NextAuth — התחברות, הרשאות תפקיד (student/instructor/admin)
- **קוד בדפדפן:** Monaco Editor (VS Code engine) + WebContainers (StackBlitz) להרצת קוד אמיתי בדפדפן ללא שרת
- **AI Mentor:** Claude API (function calling, streaming), עם system prompt ייעודי שאוסר מתן פתרון ישיר
- **PWA:** next-pwa / manifest+service worker ידני, offline caching ל-lesson content
- **תשתית:** Vercel (deploy), Supabase Storage (וידאו/קבצים), Edge Functions לפעולות מהירות

## מודלי נתונים עיקריים (סכמה)
```
users (id, name, email, role, xp, level, streak, created_at)
tracks (id, title, order, description)
modules (id, track_id, title, order, project_brief)
lessons (id, module_id, title, order, objectives, difficulty, est_minutes, content_json)
lesson_progress (user_id, lesson_id, status, score, completed_at)
exercises (id, lesson_id, prompt, starter_code, solution_code, validator_fn, hints[])
exercise_attempts (user_id, exercise_id, code, passed, attempts_count)
quizzes (id, lesson_id, questions_json)
quiz_results (user_id, quiz_id, score, answers_json)
projects (id, module_id, brief, rubric_json)
project_submissions (user_id, project_id, repo_url/files, status, feedback)
achievements (id, key, title, icon, criteria_json)
user_achievements (user_id, achievement_id, earned_at)
notes (user_id, lesson_id, content)
bookmarks (user_id, lesson_id)
ai_mentor_sessions (id, user_id, lesson_id, messages_json)
certificates (id, user_id, track_id/capstone_id, issued_at, verify_hash)
```

## מבנה עמודים (App Router)
```
/                          נחיתה שיווקית + הרשמה
/dashboard                 לוח בקרה אישי: התקדמות, המשך לימוד, סטטיסטיקות, סטריק
/tracks                    מפת כל הטראקים
/tracks/[track]/[module]/[lesson]   עמוד שיעור מלא (הכל בטמפלט אחיד)
/playground/prompt         Prompt Playground
/playground/mcp            MCP Playground
/playground/rag            RAG Playground
/playground/agent          Agent Playground
/playground/code           סביבת קוד כללית (editor+terminal+preview)
/mentor                    צ'אט AI Mentor גלובלי (נגיש מכל עמוד כ-widget צף)
/profile                   פרופיל, הישגים, תעודות, פורטפוליו
/admin                     ניהול תוכן (למחבר הקורס בלבד)
```

## רכיבי ליבה לשימוש חוזר
- `LessonShell` — הטמפלט האחיד לכל שיעור (הרכבה של כל תת-הרכיבים)
- `SlideDeck` — מציג מצגת (JSON → שקפים אנימטיביים)
- `InteractiveDiagram` — SVG/D3 עם שכבות אנימציה בשליטת scroll/click
- `CodePlayground` — Monaco + WebContainer + Console + Preview
- `ExerciseValidator` — מריץ בדיקות אוטומטיות על קוד התלמיד, מחזיר PASS/FAIL + רמז הבא
- `QuizEngine` — שאלות אמריקאיות/קוד/גרירה, ניקוד מיידי
- `AIHintBot` — שכבת רמזים מדורגת מעל Claude API (never reveal full solution עד המיצוי)
- `ProgressRing` / `XPBar` / `StreakCalendar` / `AchievementToast`
- `VideoPackageViewer` — מציג storyboard/script גם כשאין וידאו אמיתי מוקלט

## מנגנון "לא לתת פתרון מיד"
שכבת state לכל תרגיל: `attempts=0` → hint1 (רמז כיווני) → `attempts=1` נכשל שוב → hint2 (רמז ספציפי יותר) → `attempts=2` → הסבר הטעות המדויקת → `attempts=3+` → כפתור "הראה פתרון" נחשף (עם אזהרה שזה פוגע בלמידה). ה-AI Mentor מקבל את כל ה-context הזה ונאסר עליו לדלג שלבים.

## PWA ו-offline
Service Worker שמשמור: תוכן שיעור טקסטואלי + תמונות + JSON של תרגילים לצפייה offline. הרצת קוד (WebContainer) דורשת רשת בפעם הראשונה (npm install) אך תומכת cache לאחר מכן. התקדמות נשמרת local-first ומסתנכרנת ל-Supabase כשיש רשת (עקבי עם דפוס ה-sync שנבנה כבר בפרויקטים קודמים של המשתמש).

## אבטחה
Row Level Security ב-Supabase (בניגוד ל-LexCore — כאן יש הרבה משתמשים אמיתיים אז RLS נדרש), הרשאות admin נפרדות, sandboxing להרצת קוד תלמידים (WebContainer רץ client-side מבודד — אין הרצת קוד תלמיד בשרת).
