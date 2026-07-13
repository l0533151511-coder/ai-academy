# תקן איכות שיעור — "רף הזהב" של אקדמיית AI

מסמך זה הוא התדריך המחייב לכל שכתוב/העמקה של שיעור. המטרה: כל שיעור ירגיש כמו קורס
אוניברסיטאי-פרימיום בהנדסת AI — לא רשימת הגדרות.

**שיעור ייחוס (gold standard):**
`app/src/app/tracks/prompt-ai-dev/prompt-engineering/prompt-anatomy/page.tsx`
וגם `app/src/app/tracks/foundations/computer-basics/what-is-a-computer/page.tsx`.
קרא אותם לפני כל שכתוב.

## כל שיעור חייב לענות על

Why? · How? · When? · When NOT? · What breaks? · איך מקצוענים פותרים זאת? · מה Claude Code
היה מייצר בפועל? · איך מהנדס AI בכיר היה ניגש לזה?

## מבנה מקטעים מומלץ (LessonSection[])

1. **slides** — SlideDeck: 3-4 שקפים. הראשון תמיד "איזו בעיה זה פותר / למה זה קיים".
2. **diagram** — StepDiagram או סימולטור אינטראקטיבי קיים, אם משפר הבנה מעל טקסט.
3. **comparison** — PromptComparisonLab: "רע מול טוב" (פרומפט/ארכיטקטורה/workflow) עם outcome אמיתי לכל צד.
4. **engineering** — EngineeringInsights: מלא כמה שיותר משדות why/alternatives/whenNotTo/commonMistakes/performance/security/cost/maintenance/realWorld.
5. **mistakes** — גריד "מה שובר בפרודקשן" מול "איך מקצוענים עושים".
6. **quiz** — QuizEngine: 3-4 שאלות, **תמיד** עם `optionNotes` (נימוק לכל אופציה) ו-`explanation` מעמיק. הסח-דעת חייב להיות סביר, לא טיפשי.
7. **debug-task / real-world-task** — RealWorldTask: תרגיל אמיתי עם Claude Code (לא שינון) — כולל צעד דיבוג.
8. **glossary** — dl של מונחים.
9. **recap** — סיכום ממוקד לפני המשך.
10. **homework** — כולל משפט "מוביל לשיעור הבא" שמחבר לרצף הלמידה.

לא כל מקטע חובה בכל שיעור, אבל שיעור עומק טיפוסי מכיל 8+ מקטעים ו-≥200 שורות.

## תוכן חובה להוסיף כשחסר

real production examples · trade-off analysis · common production mistakes · performance ·
security · scalability · cost · maintenance · debugging · architecture discussion ·
"סיפור מהשטח" קצר כשמתאים · מה Claude Code היה מייצר.

## חוקי בטיחות-build (מחייבים — הפרה שוברת דיפלוי)

- הקובץ נשאר `"use client";` בראש, ומייצא `export default function Page() { return <LessonShell meta={META} sections={SECTIONS} />; }`.
- **אין לשנות** את `META.trackSlug/moduleSlug/lessonSlug` — הם המזהים בראוטינג ובמנוע האדפטיבי.
- להשתמש **רק** ברכיבים הקיימים (ראה API למטה) ובאייקוני `lucide-react`. אין לייבא רכיבים שלא קיימים.
- כל טקסט בעברית. מחרוזות עם גרשיים — להשתמש ב-`&quot;`/`&apos;` בתוך JSX text, או במחרוזות JS רגילות.
- בלוקי קוד באנגלית בתוך `content`/`pre` — תקין; שאר התוכן עברית.
- אין להריץ build (השרת מריץ אותו מרוכז). כן לוודא ש-JSX מאוזן ותקין.

## API של הרכיבים

- `SlideDeck({ slides: Slide[] })` · `Slide = { title: string; bullets?: string[]; visual?: ReactNode }`
- `StepDiagram({ steps: DiagramStep[] })` · `DiagramStep = { icon: LucideIcon; label: string; detail: string }`
- `PromptComparisonLab({ title, unitLabel?, bad, good, takeaway })` · `ComparisonSide = { label: string; content: string; outcome: string }`
- `EngineeringInsights({ why?, alternatives?, whenNotTo?, commonMistakes?, performance?, cost?, security?, maintenance?, realWorld? })` — כולם string אופציונליים.
- `QuizEngine({ questions: QuizQuestion[] })` · `QuizQuestion = { id, question, options: string[], correctIndex, explanation, optionNotes?: string[] }`
- `RealWorldTask({ id, title, context, steps: string[], successCriteria: string[] })`
- `LessonShell({ meta: LessonMeta, sections: LessonSection[] })` · `LessonSection = { id, label, content: ReactNode }`
- סימולטורים קיימים לשימוש חוזר (ב-`app/src/components/...`): prompt-playground, code-playground, token-visualizer, context-window-visualizer, attention-visualizer, token-cost-calculator, embedding-explorer, semantic-search-lab, agent-loop-visualizer, api-caller-lab, spam-classifier-lab, confusion-matrix-lab, digit-recognizer-lab, ועוד.

## שיעורי פרויקט (project-*)

אלה תמצית פרויקט, לא שיעור מלא — לא להפוך אותם לשיעור. כן להוסיף: נימוק הנדסי (why this project),
זווית ארכיטקטורה/trade-off אחת, ורשימת "מה נחשב הצלחה". לשמור אותם ממוקדי-מעשה.
