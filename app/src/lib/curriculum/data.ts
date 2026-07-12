import type { TrackSummary } from "./types";

// מקור אמת: F:\AI_Academy\docs\01-curriculum.md
// שים לב: מודול 0.1 בלבד בנוי לעומק מלא (שיעורים אמיתיים) — שאר המודולים כרגע ברמת מפה/תכנון
// ויתמלאו בשיעורים מלאים בהתאם לסדר ב-03-roadmap.md.

export const TRACKS: TrackSummary[] = [
  {
    slug: "foundations",
    order: 0,
    title: "יסודות (Foundations)",
    goal: "הבנה אמיתית של איך מחשב, אינטרנט וכלי פיתוח עובדים",
    color: "#5b5bf6",
    modules: [
      {
        slug: "computer-basics",
        title: "יסודות מחשב",
        description: "CPU, זיכרון, איך קוד הופך לתוכנה רצה, ייצוג מידע בינארי",
        projectBrief: "דמיית 'מחשב צעצוע' ויזואלית בדפדפן",
        lessons: [
          {
            slug: "what-is-a-computer",
            title: "מה זה בכלל מחשב",
            objectives: [
              "להבין את תפקיד ה-CPU, הזיכרון (RAM) והאחסון",
              "לעקוב אחרי מסלול הרצת תוכנית פשוטה מהלחיצה ועד התוצאה",
              "להבין למה 'מהירות מעבד' ו'זיכרון' משפיעים על ביצועים",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: [],
          },
          {
            slug: "os-processes-memory",
            title: "מערכות הפעלה, תהליכים וזיכרון",
            objectives: [
              "להבין מהו תהליך (process) ומה ההבדל מ-thread",
              "להבין ניהול זיכרון בסיסי ומהי דליפת זיכרון",
              "לצפות בתהליכים רצים במערכת ההפעלה שלך",
            ],
            estMinutes: 30,
            difficulty: "מתחיל",
            prerequisites: ["what-is-a-computer"],
          },
          {
            slug: "compilation-vs-interpretation",
            title: "איך קוד הופך לתוכנה רצה",
            objectives: [
              "להבין את ההבדל בין קומפילציה לאינטרפרטציה",
              "להבין מה זה קוד מכונה ואסמבלי ברמת עקרון",
              "להריץ דוגמה אחת דרך שתי השיטות ולהשוות",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: ["os-processes-memory"],
          },
          {
            slug: "binary-representation",
            title: "ייצוג מידע: בינארי, טקסט, תמונה, קול",
            objectives: [
              "להמיר בין בינארי, עשרוני והקסדצימלי",
              "להבין קידוד ASCII/Unicode",
              "להבין איך תמונה וקול מיוצגים כמספרים",
            ],
            estMinutes: 30,
            difficulty: "מתחיל",
            prerequisites: ["compilation-vs-interpretation"],
          },
          {
            slug: "project-toy-computer",
            title: "פרויקט: מחשב צעצוע ויזואלי",
            objectives: [
              "לבנות דמיית מחשב מינימלי עם 'זיכרון' ו'רגיסטרים'",
              "להריץ עליו 3-4 פקודות בסיסיות ולראות את הזיכרון משתנה בזמן אמת",
            ],
            estMinutes: 45,
            difficulty: "בינוני",
            prerequisites: ["binary-representation"],
          },
        ],
      },
      {
        slug: "how-internet-works",
        title: "איך האינטרנט עובד",
        description: "רשתות, DNS, HTTP/HTTPS, שרתים ולקוחות",
        projectBrief: "מפה אינטראקטיבית של מסע בקשת HTTP",
        lessons: [
          {
            slug: "ip-dns-journey",
            title: "רשתות, כתובות IP ו-DNS",
            objectives: [
              "להבין מהי כתובת IP ולמה כל מכשיר ברשת צריך אחת",
              "להבין איך DNS מתרגם שמות דומיין (google.com) לכתובות IP",
              "לעקוב אחרי מסע חבילת מידע שלב-אחר-שלב מהדפדפן ועד השרת ובחזרה",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: ["project-toy-computer"],
          },
          {
            slug: "http-protocol",
            title: "פרוטוקול HTTP/HTTPS: בקשה ותגובה",
            objectives: [
              "להבין את מבנה בקשת HTTP (method, headers, body)",
              "להבין קודי סטטוס נפוצים (200, 404, 500 ועוד) ומה כל אחד אומר",
              "לשלוח בקשות אמיתיות למעבדת HTTP אינטראקטיבית ולפרש את התגובה",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: ["ip-dns-journey"],
          },
          {
            slug: "servers-clients-browsers",
            title: "שרתים, לקוחות, ודפדפנים — מי עושה מה",
            objectives: [
              "להבין את תפקיד הדפדפן כ'לקוח' וה-Server כ'ספק שירות'",
              "להבין את מחזור החיים המלא של טעינת עמוד אינטרנט",
              "לזהות אילו שלבים קורים בצד הלקוח ואילו בצד השרת",
            ],
            estMinutes: 20,
            difficulty: "מתחיל",
            prerequisites: ["http-protocol"],
          },
          {
            slug: "tls-security",
            title: "אבטחת תשתית בסיסית: TLS, תעודות, HTTPS",
            objectives: [
              "להבין למה HTTP רגיל לא בטוח וHTTPS פותר את זה",
              "להבין את השלבים הבסיסיים ב-TLS Handshake",
              "להבין מהי תעודה דיגיטלית ומי 'מאשר' אותה",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["servers-clients-browsers"],
          },
          {
            slug: "project-http-map",
            title: "פרויקט מודול: מפת מסע בקשת HTTP מלאה",
            objectives: [
              "לחבר בין DNS, TCP, TLS ו-HTTP למסע אחד רציף שאתה שולט בו",
              "לבצע בקשות אמיתיות במעבדת ה-HTTP ולראות את השפעתן",
            ],
            estMinutes: 45,
            difficulty: "בינוני",
            prerequisites: ["tls-security"],
          },
        ],
      },
      {
        slug: "terminal-linux",
        title: "טרמינל ו-Linux (ממוקד AI)",
        description: "בדיוק מה שצריך משורת הפקודה כדי לעבוד יעיל עם Claude Code",
        projectBrief: "פתרון משימה אמיתית בטרמינל אינטראקטיבי",
        lessons: [
          {
            slug: "terminal-essentials",
            title: "טרמינל: ניווט וקבצים",
            objectives: [
              "להבין למה כל עבודה עם Claude Code עוברת דרך הטרמינל",
              "לנווט בין תיקיות ולנהל קבצים עם pwd/ls/cd/mkdir/touch/rm",
              "לתרגל בטרמינל אמיתי (מדומה) באתר",
            ],
            estMinutes: 20,
            difficulty: "מתחיל",
            prerequisites: ["project-http-map"],
          },
          {
            slug: "terminal-pipes-search",
            title: "צפייה בקבצים וחיפוש: cat, grep, echo",
            objectives: [
              "לקרוא תוכן קבצים מהטרמינל עם cat",
              "לחפש טקסט בתוך קבצים עם grep — כלי שתשתמש בו כל הזמן עם AI-generated code",
              "להבין למה זה חשוב: Claude Code 'רואה' את הפרויקט שלך דרך אותם כלים בדיוק",
            ],
            estMinutes: 20,
            difficulty: "מתחיל",
            prerequisites: ["terminal-essentials"],
          },
          {
            slug: "project-terminal-task",
            title: "פרויקט מודול: פתרון משימה אמיתית בטרמינל",
            objectives: [
              "לשלב ניווט, יצירת קבצים וחיפוש כדי לפתור משימה מקצה לקצה",
              "לבנות ביטחון בעבודה עם שורת פקודה לפני שממשיכים ל-Git",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["terminal-pipes-search"],
          },
        ],
      },
      {
        slug: "git-github",
        title: "Git ו-GitHub (ממוקד AI)",
        description: "בדיוק מה שצריך מ-Git כדי לעבוד בזרימת עבודה עם Claude Code",
        projectBrief: "תיק עבודות דיגיטלי ראשון בגיט",
        lessons: [
          {
            slug: "git-commits-basics",
            title: "למה Git קיים + init/add/commit",
            objectives: [
              "להבין את הבעיה ש-Git פותר (היסטוריה, בטיחות, שיתוף פעולה)",
              "להבין את המחזור הבסיסי: init → add → commit",
              "לעקוב אחרי עץ קומיטים מתפתח בסימולטור ויזואלי",
            ],
            estMinutes: 20,
            difficulty: "מתחיל",
            prerequisites: ["project-terminal-task"],
          },
          {
            slug: "git-branches-merge",
            title: "ענפים ומיזוג — איך Claude Code עובד בענפים",
            objectives: [
              "להבין למה עובדים על ענף (branch) נפרד במקום ישירות על main",
              "לראות ויזואלית איך merge מאחד שני ענפים",
              "להבין את זרימת ה-PR הבסיסית שגם agentic coding tools משתמשים בה",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["git-commits-basics"],
          },
          {
            slug: "project-git-portfolio",
            title: "פרויקט מודול + קפסטון #1: תיק עבודות ראשון בגיט",
            objectives: [
              "לבנות היסטוריית קומיטים נקייה עם הודעות ברורות",
              "לדמות זרימת עבודה מלאה: branch → commits → merge",
            ],
            estMinutes: 40,
            difficulty: "בינוני",
            prerequisites: ["git-branches-merge"],
          },
        ],
        isCapstone: true,
      },
    ],
  },
  {
    slug: "programming-essentials-ai",
    order: 1,
    title: "יסודות תכנות ל-AI",
    goal: "בדיוק מספיק JavaScript/TypeScript ו-APIs כדי לבנות ולהבין מערכות AI",
    color: "#22d3ee",
    modules: [
      {
        slug: "js-ts-for-ai",
        title: "JavaScript ו-TypeScript ל-AI",
        description: "משתנים, פונקציות, async/fetch, טיפוסים — מה שצריך כדי לקרוא ולכתוב קוד עם Claude Code",
        projectBrief: "סקריפט שקורא ל-API אמיתי ומעבד תשובה",
        lessons: [
          {
            slug: "javascript-essentials",
            title: "JavaScript: משתנים, פונקציות, מבני נתונים",
            objectives: [
              "לכתוב ולהבין קוד JS בסיסי: משתנים, פונקציות, תנאים, לולאות",
              "לעבוד עם מערכים ואובייקטים — מבני הנתונים שכל API מחזיר",
              "להריץ ולנפות קוד במעבדת קוד חיה",
            ],
            estMinutes: 30,
            difficulty: "מתחיל",
            prerequisites: ["פרויקט מודול + קפסטון #1: תיק עבודות ראשון בגיט"],
          },
          {
            slug: "async-fetch-apis",
            title: "Async JavaScript ו-fetch — לדבר עם שירותים חיצוניים",
            objectives: [
              "להבין Promises ו-async/await — איך JS מתמודד עם פעולות שלוקחות זמן",
              "להשתמש ב-fetch כדי לקרוא ל-API אמיתי ולקבל תשובה",
              "להבין את זה כתשתית הכרחית לכל אינטגרציה עם LLM API בהמשך",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["javascript-essentials"],
          },
          {
            slug: "typescript-essentials",
            title: "TypeScript: טיפוסים שתופסים באגים לפני שהם קורים",
            objectives: [
              "להבין למה קוד שנוצר על ידי AI (וכלים כמו Claude Code) לרוב כתוב ב-TypeScript",
              "לכתוב טיפוסים בסיסיים, interfaces, ו-union types",
              "לזהות שגיאות טיפוסים לפני שהקוד בכלל רץ",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["async-fetch-apis"],
          },
          {
            slug: "project-api-caller",
            title: "פרויקט מודול: קריאה אמיתית ל-AI Mentor API",
            objectives: [
              "לכתוב סקריפט TypeScript שקורא ל-API של המנטור באתר ומעבד את התשובה",
              "לחבר בין כל מה שנלמד: async/fetch/טיפוסים בפרויקט עובד אחד",
            ],
            estMinutes: 40,
            difficulty: "בינוני",
            prerequisites: ["typescript-essentials"],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-foundations",
    order: 2,
    title: "יסודות AI",
    goal: "למידת מכונה, רשתות נוירונים, LLMs",
    color: "#f472b6",
    modules: [
      {
        slug: "ml-intro",
        title: "מבוא ל-AI ולמידת מכונה",
        description: "סוגי למידה, מדדי הצלחה",
        projectBrief: "מסווג ספאם אינטראקטיבי",
        lessons: [
          {
            slug: "what-is-ai",
            title: "מהי בינה מלאכותית — AI מול ML מול DL מול LLM",
            objectives: [
              "להבחין בין AI (המושג הרחב), ML (למידת מכונה), DL (למידה עמוקה) ו-LLM (מודלי שפה)",
              "להבין שכל 'עיגול' הוא תת-קבוצה של הקודם לו",
              "להבין למה Claude הוא LLM ולא סתם 'תוכנה חכמה'",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: ["פרויקט מודול: קריאה אמיתית ל-AI Mentor API"],
          },
          {
            slug: "types-of-learning",
            title: "סוגי למידה: מונחית, לא-מונחית, חיזוקית",
            objectives: [
              "להבין למידה מונחית (supervised) — לומדים מדוגמאות מתויגות",
              "להבין למידה לא-מונחית (unsupervised) — מוצאים דפוסים בלי תיוג",
              "להבין למידת חיזוק (reinforcement) — לומדים מניסוי וטעייה עם פרס/עונש",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: ["what-is-ai"],
          },
          {
            slug: "success-metrics",
            title: "מדדי הצלחה: Accuracy, Precision, Recall, Overfitting",
            objectives: [
              "להבין למה 'accuracy' לבד יכול להטעות (למשל בזיהוי מחלה נדירה)",
              "להבין Precision ו-Recall ומתי כל אחד חשוב יותר",
              "להבין Overfitting — כשמודל 'משנן' במקום 'מבין'",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["types-of-learning"],
          },
          {
            slug: "project-spam-classifier",
            title: "פרויקט מודול: בניית מסווג ספאם אינטראקטיבי",
            objectives: [
              "לכוונן משקלים (weights) של מילות מפתח ולראות איך זה משפיע על דיוק המודל",
              "לחוות באופן מוחשי מהו 'אימון' ולמה איזון (לא overfitting) קריטי",
            ],
            estMinutes: 35,
            difficulty: "בינוני",
            prerequisites: ["success-metrics"],
          },
        ],
      },
      {
        slug: "deep-learning",
        title: "למידה עמוקה ורשתות נוירונים",
        description: "נוירון, שכבות, forward pass, backprop, gradient descent",
        projectBrief: "זיהוי ספרות בכתב יד בדפדפן",
        lessons: [
          {
            slug: "neuron-and-network",
            title: "הנוירון המלאכותי ורשת מלאה",
            objectives: [
              "להבין מהו נוירון מלאכותי: קלטים, משקלים, סכימה, פונקציית אקטיבציה",
              "להבין איך נוירונים מתחברים לשכבות ובונים רשת",
              "להריץ forward pass אינטראקטיבי ולראות איך קלט הופך לפלט",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: בניית מסווג ספאם אינטראקטיבי"],
          },
          {
            slug: "training-gradient-descent",
            title: "איך רשת 'לומדת': Loss, Backpropagation, Gradient Descent",
            objectives: [
              "להבין מהי פונקציית loss ולמה מודל שואף למזער אותה",
              "להבין את הרעיון מאחורי gradient descent — צעד-צעד לכיוון מינימום",
              "להבין את ההשפעה הקריטית של learning rate על יציבות האימון",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["neuron-and-network"],
          },
          {
            slug: "project-digit-recognizer",
            title: "פרויקט מודול: זיהוי ספרות בכתב יד",
            objectives: [
              "לבנות מסווג ספרות עובד בדפדפן ולהבין את שיקולי הבחירה בגישה (kNN מול רשת עמוקה מלאה)",
              "לחוות את המגבלות והיתרונות של גישות שונות לבעיה זהה",
            ],
            estMinutes: 40,
            difficulty: "בינוני",
            prerequisites: ["training-gradient-descent"],
          },
        ],
      },
      {
        slug: "llms",
        title: "מודלי שפה גדולים (LLMs)",
        description: "טוקניזציה, טרנספורמר, Attention, context window, עלויות",
        projectBrief: "מחשבון טוקנים ועלויות אינטראקטיבי",
        lessons: [
          {
            slug: "tokenization",
            title: "טוקניזציה — איך טקסט הופך למספרים",
            objectives: [
              "להבין מהו טוקן ולמה מודלים לא 'רואים' אותיות אלא טוקנים",
              "להבין למה עברית ושפות אחרות לרוב 'יקרות' יותר בטוקנים מאנגלית",
              "לנתח טקסט אמיתי ולראות איך הוא מתפרק לטוקנים",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: ["פרויקט מודול: זיהוי ספרות בכתב יד"],
          },
          {
            slug: "transformer-attention",
            title: "ארכיטקטורת הטרנספורמר ומנגנון ה-Attention",
            objectives: [
              "להבין ברמת עקרון איך טרנספורמר מעבד רצף טקסט שלם במקביל",
              "להבין את רעיון ה-Attention: כל מילה 'מסתכלת' על כל שאר המילים בעוצמות שונות",
              "להבין למה הארכיטקטורה הזו החליפה מודלים קודמים (RNN/LSTM)",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["tokenization"],
          },
          {
            slug: "context-window-limits",
            title: "Context Window, יכולות ומגבלות",
            objectives: [
              "להבין מהו חלון הקשר ומה קורה כשחורגים ממנו",
              "להבין הזיות (hallucinations) ומקורן",
              "להבין הטיות (biases) ומגבלות ידע (knowledge cutoff)",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["transformer-attention"],
          },
          {
            slug: "project-token-cost-calculator",
            title: "פרויקט מודול: מחשבון טוקנים ועלויות",
            objectives: [
              "לבנות כלי שמעריך עלות בפועל של קריאות API בהתאם למודל, לנפח, ולתדירות",
              "להבין שיקולי עלות כחלק בלתי נפרד מתכנון מוצר AI",
            ],
            estMinutes: 35,
            difficulty: "בינוני",
            prerequisites: ["context-window-limits"],
          },
        ],
      },
    ],
  },
  {
    slug: "prompt-ai-dev",
    order: 3,
    title: "הנדסת Prompt ופיתוח בעזרת AI",
    goal: "לכתוב פרומפטים מקצועיים ולפתח עם Claude Code",
    color: "#a78bfa",
    modules: [
      {
        slug: "prompt-engineering",
        title: "הנדסת Prompt מקצועית",
        description: "אנטומיית פרומפט, few-shot, chain-of-thought, system prompts",
        projectBrief: "AtlasDesk שלב 1: מנוע השיחה הבסיסי",
        lessons: [
          {
            slug: "prompt-anatomy",
            title: "אנטומיה של פרומפט מקצועי",
            objectives: [
              "להבין את רכיבי הפרומפט: context, task, format, constraints",
              "להבין את ההבדל בין system prompt להודעת משתמש",
              "לכתוב ולהריץ פרומפטים אמיתיים במעבדה אינטראקטיבית",
            ],
            estMinutes: 30,
            difficulty: "מתחיל",
            prerequisites: ["פרויקט מודול: מחשבון טוקנים ועלויות"],
          },
          {
            slug: "few-shot-chain-of-thought",
            title: "Few-shot Prompting ו-Chain-of-Thought",
            objectives: [
              "להבין את ההבדל בין zero-shot, few-shot ו-CoT",
              "לראות איך דוגמאות בפרומפט משפרות עקביות תשובות",
              "להבין מתי chain-of-thought עוזר ומתי הוא רק מבזבז טוקנים",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["prompt-anatomy"],
          },
          {
            slug: "grounding-hallucinations",
            title: "מניעת הזיות: Grounding ו-Self-Verification",
            objectives: [
              "להבין טכניקות לביסוס תשובות בעובדות (grounding)",
              "להבין איך לעודד את המודל להודות באי-ודאות במקום להמציא",
              "להשוות תשובה עם ובלי טכניקות grounding על אותה שאלה",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["few-shot-chain-of-thought"],
          },
          {
            slug: "project-atlasdesk-conversation-engine",
            title: "פרויקט מודול: AtlasDesk — מנוע השיחה הבסיסי",
            objectives: [
              "לבנות את הליבה הראשונה של AtlasDesk — מערכת תמיכת לקוחות AI אמיתית",
              "לחבר system prompt מובנה + היסטוריית שיחה אמיתית מול Claude API",
              "להבין את שיקולי ההנדסה של הפרויקט הראשון בפלטפורמה מסחרית אמיתית",
            ],
            estMinutes: 45,
            difficulty: "בינוני",
            prerequisites: ["grounding-hallucinations"],
          },
        ],
      },
    ],
  },
  {
    slug: "claude-code-mastery",
    order: 4,
    title: "שליטה מלאה ב-Claude Code",
    goal: "מהתקנה ועד הנדסת production אמיתית — האקדמיה המקיפה ל-Claude Code (ראה docs/14-claude-code-track.md)",
    color: "#f97316",
    modules: [
      {
        slug: "foundations-setup",
        title: "יסודות ותשתית",
        description: "התקנה, CLAUDE.md, ניהול context",
        projectBrief: "קליטת AtlasDesk ל-Claude Code",
        lessons: [
          {
            slug: "installation-configuration",
            title: "התקנה והגדרה של Claude Code",
            objectives: [
              "להתקין את Claude Code ולהבין את מודל האימות (auth) שלו",
              "להבין את ההבדל בין הגדרות גלובליות (~/.claude) להגדרות פרויקט",
              "להכיר את אינטגרציות ה-IDE העיקריות ומתי להשתמש בכל אחת",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: [],
          },
          {
            slug: "project-structure-claude-md",
            title: "מבנה פרויקט ו-CLAUDE.md",
            objectives: [
              "להבין מה תפקיד קובץ CLAUDE.md ומה כדאי/לא כדאי לשים בו",
              "לכתוב CLAUDE.md ראשון לפרויקט אמיתי",
              "להבין איך מבנה תיקיות וקונבנציות משפיעים על איכות עבודת ה-AI",
            ],
            estMinutes: 30,
            difficulty: "מתחיל",
            prerequisites: ["installation-configuration"],
          },
          {
            slug: "context-management-fundamentals",
            title: "יסודות ניהול Context בסשן פיתוח",
            objectives: [
              "להבין איך context window מתמלא בפועל תוך כדי סשן עבודה",
              "לדעת מתי ואיך לנקות/לרענן context (compact, סשן חדש)",
              "להבין את הפשרה בין 'לתת הרבה הקשר' ל'לשמור על מיקוד'",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["project-structure-claude-md"],
          },
          {
            slug: "project-atlasdesk-onboarding",
            title: "פרויקט מודול: קליטת AtlasDesk ל-Claude Code",
            objectives: [
              "לכתוב CLAUDE.md אמיתי לפרויקט AtlasDesk",
              "לבצע סבב תכנון ראשון עם Claude Code על קוד אמיתי בפרודקשן",
              "לתעד את ה-onboarding כתהליך חוזר לכל פרויקט עתידי",
            ],
            estMinutes: 40,
            difficulty: "בינוני",
            prerequisites: ["context-management-fundamentals"],
          },
        ],
      },
      {
        slug: "planning-architecture",
        title: "חשיבה לפני קוד: תכנון וארכיטקטורה",
        description: "prompt design, planning, architecture-first, decomposition",
        projectBrief: "תוכנית ארכיטקטורה + מימוש פיצ'ר ב-AtlasDesk",
        lessons: [
          {
            slug: "prompt-design-for-code",
            title: "עיצוב פרומפטים למשימות קוד",
            objectives: [
              "להבין למה פרומפט מעורפל למשימת קוד יוצר עבודה כפולה",
              "לזהות את מרכיבי הפרומפט ההנדסי הטוב: מטרה, אילוצים, קריטריון הצלחה",
              "להשוות פרומפט חלש מול פרומפט חזק על אותה משימה בדיוק",
            ],
            estMinutes: 25,
            difficulty: "מתחיל",
            prerequisites: ["פרויקט מודול: קליטת AtlasDesk ל-Claude Code"],
          },
          {
            slug: "planning-workflows",
            title: "תהליכי תכנון (Planning Workflows)",
            objectives: [
              "להבין את הרעיון של 'תוכנית לפני ביצוע' — plan mode",
              "לתרגל אישור/דחיית תוכנית לפני שקוד נכתב בפועל",
              "להבין מתי תכנון מפורש חוסך זמן ומתי הוא overhead מיותר",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["prompt-design-for-code"],
          },
          {
            slug: "architecture-first-development",
            title: "פיתוח Architecture-First",
            objectives: [
              "להבין למה לתכנן ממשקים/מבנה לפני מימוש מונע 'בלגן' בקוד שנוצר ע\"י AI",
              "לתרגל הגדרת חוזה (interface) לפני שמבקשים מימוש",
              "להשוות תוצאה עם ובלי תכנון ארכיטקטוני מקדים",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["planning-workflows"],
          },
          {
            slug: "decomposition-large-tasks",
            title: "פירוק משימות גדולות (Decomposition)",
            objectives: [
              "לתרגל פירוק feature גדול לצעדים קטנים שכל אחד ניתן לאימות בנפרד",
              "להבין למה 'משימת ענק' אחת מסוכנת יותר מסדרת משימות קטנות",
              "לבנות תוכנית פירוק אמיתית לפיצ'ר ב-AtlasDesk",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["architecture-first-development"],
          },
          {
            slug: "project-atlasdesk-feature-architecture",
            title: "פרויקט מודול: תוכנית ארכיטקטורה + מימוש ב-AtlasDesk",
            objectives: [
              "לתכנן ולתעד ארכיטקטורה לפיצ'ר אמיתי: זיכרון שיחה persistent",
              "לפרק את הפיצ'ר לצעדים קטנים ולממש אותו בעזרת Claude Code צעד-אחר-צעד",
              "לאמת שהתוצאה תואמת את התוכנית המקורית",
            ],
            estMinutes: 50,
            difficulty: "מתקדם",
            prerequisites: ["decomposition-large-tasks"],
          },
        ],
      },
      {
        slug: "core-dev-workflows",
        title: "תהליכי פיתוח ליבה",
        description: "בנייה, refactoring, debugging, TDD",
        projectBrief: "פיצ'ר AtlasDesk בגישת TDD",
        lessons: [
          {
            slug: "building-features-workflow",
            title: "workflow מלא לבניית פיצ'ר מאפס",
            objectives: [
              "לתרגל את התהליך המלא: תכנון→שלד→מימוש→בדיקה עם Claude Code",
              "להבין למה 'שלד קודם, מימוש אחר כך' מייצר קוד יציב יותר",
              "לזהות נקודות עצירה טבעיות לאימות תוך כדי בנייה",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: AtlasDesk מקבל סוכן עם החלטה אוטונומית"],
          },
          {
            slug: "safe-refactoring-workflows",
            title: "תהליכי Refactoring בטוחים",
            objectives: [
              "להבין את העיקרון: refactoring לא משנה התנהגות, רק מבנה",
              "לתרגל refactoring מודרך עם בדיקות לפני/אחרי",
              "לזהות מתי refactoring 'גדול מדי' דורש פירוק לצעדים",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["building-features-workflow"],
          },
          {
            slug: "debugging-with-claude-code",
            title: "תהליכי Debugging יעילים",
            objectives: [
              "לתת ל-Claude Code הקשר שגיאה נכון (הודעה מלאה, לא רק 'זה לא עובד')",
              "לתרגל debugging מונחה-השערה (hypothesis-driven)",
              "להבין מתי לתת ל-Claude Code לחקור בעצמו ומתי לצמצם את החיפוש בעצמך",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["safe-refactoring-workflows"],
          },
          {
            slug: "tdd-with-claude-code",
            title: "TDD עם Claude Code",
            objectives: [
              "לתרגל כתיבת טסטים לפני מימוש, ולתת ל-Claude Code לממש עד שהם עוברים",
              "להבין למה TDD עם AI שונה מ-TDD אנושי (מי כותב את הטסט, מי בודק אותו)",
              "לזהות מתי TDD משתלם ומתי הוא overhead מיותר",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["debugging-with-claude-code"],
          },
          {
            slug: "project-atlasdesk-tdd-feature",
            title: "פרויקט מודול: פיצ'ר AtlasDesk בגישת TDD מלאה",
            objectives: [
              "לבנות פיצ'ר אמיתי ב-AtlasDesk תוך שימוש בכל 4 ה-workflows שנלמדו",
              "לכתוב טסטים לפני מימוש ולוודא שהם מכוונים את הפיתוח",
              "לתעד את התהליך כתבנית חוזרת לפרויקטים עתידיים",
            ],
            estMinutes: 45,
            difficulty: "מתקדם",
            prerequisites: ["tdd-with-claude-code"],
          },
        ],
      },
      {
        slug: "existing-large-codebases",
        title: "עבודה עם קוד קיים ופרויקטים גדולים",
        description: "incremental changes, ארגון פרויקט, code review",
        projectBrief: "הרחבת AtlasDesk תוך שמירה על ארכיטקטורה",
        lessons: [
          {
            slug: "onboarding-to-existing-code",
            title: "להכיר קוד זר לפני שנוגעים בו",
            objectives: [
              "לתרגל 'סיור היכרות' עם קוד לא-מוכר לפני כל שינוי",
              "להבין למה לשנות קוד בלי להבין אותו קודם הוא הדרך הכי בטוחה לשבור דברים",
              "לזהות מוסכמות קיימות (naming, מבנה תיקיות) ולהתאים אליהן",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: פיצ'ר AtlasDesk בגישת TDD מלאה"],
          },
          {
            slug: "incremental-safe-changes",
            title: "פיתוח פיצ'רים אינקרמנטלי",
            objectives: [
              "להעדיף שינויים קטנים ובטוחים על פני 'מהפכות' גדולות",
              "להבין למה שינוי קטן שקל לבדוק עדיף על שינוי גדול שקשה לאמת",
              "לתרגל פיצול פיצ'ר גדול לסדרת PR/commits קטנים ועצמאיים",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["onboarding-to-existing-code"],
          },
          {
            slug: "large-project-organization",
            title: "ארגון פרויקטים גדולים",
            objectives: [
              "להבין מוסכמות שמסייעות ל-AI (ולבני אדם) לנווט בפרויקט גדול",
              "לזהות מתי מבנה תיקיות 'התפוצץ' ודורש ריענון",
              "להכיר את העיקרון: מודולריות טובה = כל שינוי נוגע במעט קבצים",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["incremental-safe-changes"],
          },
          {
            slug: "ai-assisted-code-review",
            title: "תהליכי Code Review עם Claude Code",
            objectives: [
              "לבקש מ-Claude Code לבקר קוד — גם קוד שהוא עצמו כתב",
              "לבנות checklist ביקורת עקבי (אבטחה, ביצועים, קריאות, כיסוי בדיקות)",
              "להבין את המגבלה: AI reviewer לא מחליף ביקורת אנושית, הוא משלים אותה",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["large-project-organization"],
          },
          {
            slug: "project-atlasdesk-safe-extension",
            title: "פרויקט מודול: הרחבת AtlasDesk תוך שמירה על ארכיטקטורה",
            objectives: [
              "להוסיף יכולת משמעותית ל-AtlasDesk בלי לשבור מוסכמות קיימות",
              "לבצע code review עצמי (עם Claude Code) לפני commit",
              "לתעד את ההרחבה בהתאם למוסכמות התיעוד הקיימות בפרויקט",
            ],
            estMinutes: 45,
            difficulty: "מתקדם",
            prerequisites: ["ai-assisted-code-review"],
          },
        ],
      },
      {
        slug: "engineering-discipline",
        title: "משמעת הנדסית ופרודוקטיביות",
        description: "Git workflows, תיעוד, ניהול סשן, ספריות פרומפטים",
        projectBrief: "prompt-library מתועד לפרויקט",
        lessons: [
          {
            slug: "git-workflows-with-claude-code",
            title: "תהליכי Git עם Claude Code",
            objectives: [
              "לתרגל commits משמעותיים והודעות קומיט שמסבירות 'למה', לא רק 'מה'",
              "להבין ניהול branches בעבודה עם סוכן AI",
              "להכיר את זרימת ה-PR: מ-commit ועד review",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: הרחבת AtlasDesk תוך שמירה על ארכיטקטורה"],
          },
          {
            slug: "documentation-workflows",
            title: "תהליכי תיעוד תוך כדי עבודה",
            objectives: [
              "לתעד החלטות ארכיטקטוניות תוך כדי הפיתוח, לא בדיעבד",
              "להבין את ההבדל בין תיעוד ל-AI (CLAUDE.md) לתיעוד לבני אדם (README)",
              "לזהות מתי תיעוד מתיישן ודורש עדכון",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["git-workflows-with-claude-code"],
          },
          {
            slug: "session-context-preservation",
            title: "ניהול סשן ושימור Context לטווח ארוך",
            objectives: [
              "לנהל סשנים ארוכי-טווח על פרויקט שממשיך לגדול",
              "להבין מתי לפצל לסשן חדש ומתי להמשיך (מחבר למודול 1)",
              "לתעד החלטות בין סשנים כדי לא 'לאבד' הקשר",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["documentation-workflows"],
          },
          {
            slug: "reusable-prompt-libraries",
            title: "ספריות פרומפטים ותבניות לשימוש חוזר",
            objectives: [
              "לבנות 'playbook' אישי של פרומפטים שחוזרים על עצמם",
              "להבין מתי כדאי להפוך פרומפט חד-פעמי לתבנית מתועדת",
              "לתעד תבניות בצורה שקל לשתף עם צוות",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["session-context-preservation"],
          },
          {
            slug: "project-atlasdesk-prompt-library",
            title: "פרויקט מודול: prompt-library מתועד ל-AtlasDesk",
            objectives: [
              "לבנות prompt-library אמיתי לפרויקט AtlasDesk, מבוסס על כל הפרומפטים שנוצרו לאורך הטראק",
              "לתעד כל תבנית עם הקשר שימוש והדוגמה שהובילה אליה",
              "ליצור CONTRIBUTING.md שמנחה תורם עתידי איך לעבוד עם Claude Code על הפרויקט",
            ],
            estMinutes: 40,
            difficulty: "מתקדם",
            prerequisites: ["reusable-prompt-libraries"],
          },
        ],
      },
      {
        slug: "advanced-production",
        title: "הנדסת Production מתקדמת",
        description: "ביצועים, התאוששות משגיאות, דיפלוי, טעויות נפוצות",
        projectBrief: "קפסטון: AtlasDesk production-ready",
        lessons: [
          {
            slug: "performance-optimization-workflows",
            title: "אופטימיזציית ביצועים עם Claude Code",
            objectives: [
              "לזהות צווארי בקבוק אמיתיים (לא ניחושים) לפני אופטימיזציה",
              "לתרגל מדידה לפני ואחרי כל שינוי ביצועים",
              "להבין את הפשרה בין קריאות מקבילות למקורות מוגבלים",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["פרויקט מודול: prompt-library מתועד ל-AtlasDesk"],
          },
          {
            slug: "error-recovery-long-sessions",
            title: "התאוששות משגיאות וסשנים ארוכים",
            objectives: [
              "לזהות מתי Claude Code 'סוטה' מהמשימה בסשן ארוך",
              "לתרגל checkpoint strategy — נקודות עצירה לאימות באמצע עבודה ארוכה",
              "להבין מתי לאתחל סשן לעומת לתקן תוך כדי",
            ],
            estMinutes: 25,
            difficulty: "מתקדם",
            prerequisites: ["performance-optimization-workflows"],
          },
          {
            slug: "production-deployment-workflows",
            title: "תהליכי דיפלוי לפרודקשן",
            objectives: [
              "לשלב Claude Code בצינור build→test→deploy→verify",
              "להבין את החשיבות של אימות פוסט-דיפלוי (לא רק 'זה נדחף')",
              "להכיר אסטרטגיית rollback כשמשהו משתבש בפרודקשן",
            ],
            estMinutes: 25,
            difficulty: "מתקדם",
            prerequisites: ["error-recovery-long-sessions"],
          },
          {
            slug: "common-mistakes-anti-patterns",
            title: "טעויות נפוצות ואנטי-פטרנים",
            objectives: [
              "לזהות את חמשת האנטי-פטרנים הנפוצים ביותר בעבודה עם Claude Code",
              "להבין למה 'אמון עיוור' בפלט AI הוא הטעות הכי יקרה",
              "לבנות הרגלי בדיקה שמונעים את רוב הטעויות הנפוצות",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["production-deployment-workflows"],
          },
          {
            slug: "capstone-atlasdesk-production-ready",
            title: "קפסטון: AtlasDesk מגיע ל-production-ready אמיתי",
            objectives: [
              "לבצע audit מלא על AtlasDesk: ביצועים, יציבות, תיעוד, אבטחה",
              "לתקן את הפערים המשמעותיים ביותר שנמצאו",
              "לסכם את כל הטראק כ'סיפור הנדסי' אחד שלם",
            ],
            estMinutes: 50,
            difficulty: "מתקדם",
            prerequisites: ["common-mistakes-anti-patterns"],
          },
        ],
        isCapstone: true,
      },
    ],
  },
  {
    slug: "ai-integration",
    order: 5,
    title: "הנדסת אינטגרציית AI",
    goal: "MCP, embeddings, RAG, fine-tuning",
    color: "#60a5fa",
    modules: [
      {
        slug: "mcp-tools",
        title: "MCP ו-Tool/Function Calling",
        description: "פרוטוקול MCP, schema של כלים",
        projectBrief: "AtlasDesk מקבל כלי אמיתי: בדיקת סטטוס פנייה",
        lessons: [
          {
            slug: "tool-function-calling-basics",
            title: "יסודות Tool/Function Calling",
            objectives: [
              "להבין איך מודל 'מבקש' להריץ פונקציה במקום לענות ישירות",
              "להבין את מבנה ה-tool schema (name, description, input_schema)",
              "לעקוב אחרי מחזור חיים מלא: בקשה→tool_use→ביצוע→tool_result→תשובה סופית",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: תוכנית ארכיטקטורה + מימוש ב-AtlasDesk"],
          },
          {
            slug: "mcp-protocol-architecture",
            title: "פרוטוקול MCP: קונספט וארכיטקטורה",
            objectives: [
              "להבין את התפקיד של MCP כפרוטוקול סטנדרטי לחיבור כלים ל-AI",
              "להבין את ההבדל בין MCP server נפרד (עם transport משלו) ל-tool calling מובנה ב-API",
              "להכיר את שלושת סוגי היכולות ב-MCP: tools, resources, prompts",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["tool-function-calling-basics"],
          },
          {
            slug: "building-first-mcp-server",
            title: "בניית שרת MCP ראשון עם Claude Code",
            objectives: [
              "לתכנן ולממש שרת MCP מינימלי (כלי בודד) בעזרת Claude Code",
              "להבין מתי MCP server נפרד עדיף על tool calling מובנה, ומתי לא",
              "לחבר את השרת ל-Claude Code עצמו ולבדוק אותו בסשן אמיתי",
            ],
            estMinutes: 40,
            difficulty: "מתקדם",
            prerequisites: ["mcp-protocol-architecture"],
          },
          {
            slug: "project-atlasdesk-tool-calling",
            title: "פרויקט מודול: AtlasDesk מקבל כלי אמיתי",
            objectives: [
              "לנתח את מימוש ה-Tool Calling האמיתי שכבר קיים ב-AtlasDesk (check_ticket_status)",
              "להרחיב את AtlasDesk בעזרת Claude Code עם כלי שני משלך",
              "להבין את שיקולי האבטחה של הרצת כלים שמודל AI מבקש (validation, אילוצים)",
            ],
            estMinutes: 45,
            difficulty: "מתקדם",
            prerequisites: ["building-first-mcp-server"],
          },
        ],
      },
      {
        slug: "embeddings-vector-db",
        title: "Embeddings ומסדי נתונים וקטוריים",
        description: "similarity search, pgvector",
        projectBrief: "AtlasDesk מקבל חיפוש סמנטי במאמרי עזרה",
        lessons: [
          {
            slug: "what-are-embeddings",
            title: "מהם Embeddings",
            objectives: [
              "להבין איך טקסט הופך לוקטור מספרים שמייצג משמעות",
              "להבין את המושג similarity (cosine similarity) ולמה הוא מודד קרבה סמנטית",
              "להתנסות בוויזואלייזר embeddings אינטראקטיבי",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: AtlasDesk מקבל כלי אמיתי"],
          },
          {
            slug: "vector-databases",
            title: "מסדי נתונים וקטוריים",
            objectives: [
              "להבין למה צריך מסד נתונים ייעודי לחיפוש בין וקטורים",
              "להכיר את pgvector כתוסף ל-Postgres/Supabase",
              "להבין אינדקסים וקטוריים ברמת עקרון (למה חיפוש מדויק לא סקלבילי)",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["what-are-embeddings"],
          },
          {
            slug: "project-atlasdesk-semantic-search",
            title: "פרויקט מודול: חיפוש סמנטי במאמרי העזרה של AtlasDesk",
            objectives: [
              "לתכנן ולממש embeddings + pgvector עבור מאמרי עזרה ב-AtlasDesk",
              "לבנות endpoint חיפוש סמנטי אמיתי (לא רק התאמת מילות מפתח)",
              "להשוות תוצאות חיפוש מילולי מול חיפוש סמנטי על אותה שאילתה",
            ],
            estMinutes: 45,
            difficulty: "מתקדם",
            prerequisites: ["vector-databases"],
          },
        ],
      },
      {
        slug: "rag",
        title: "RAG",
        description: "chunking, retrieval, ranking",
        projectBrief: "AtlasDesk עונה מתוך בסיס הידע האמיתי שלו",
        lessons: [
          {
            slug: "rag-anatomy",
            title: "אנטומיית RAG: Retrieval-Augmented Generation",
            objectives: [
              "להבין את ארבעת השלבים: chunking, retrieval, augmentation, generation",
              "להבין למה RAG פותר את בעיית 'הידע הקבוע' של מודל שפה",
              "לראות את ההבדל בין תשובה מהידע הכללי של המודל לתשובה מבוססת-מסמכים",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: חיפוש סמנטי במאמרי העזרה של AtlasDesk"],
          },
          {
            slug: "chunking-retrieval-strategies",
            title: "אסטרטגיות Chunking ו-Retrieval",
            objectives: [
              "להבין למה גודל chunk משפיע דרמטית על איכות RAG",
              "להכיר אסטרטגיות overlap ו-re-ranking",
              "להשוות chunking נאיבי (לפי אורך קבוע) מול chunking מודע-מבנה",
            ],
            estMinutes: 30,
            difficulty: "בינוני",
            prerequisites: ["rag-anatomy"],
          },
          {
            slug: "evaluating-rag-quality",
            title: "הערכת איכות RAG: Grounding ו-Hallucination Detection",
            objectives: [
              "לחבר בין grounding (ממודול Prompt Engineering) לבין RAG בפועל",
              "להבין מדדי הערכה בסיסיים ל-RAG (רלוונטיות retrieval, נאמנות תשובה למקור)",
              "לזהות מתי RAG 'ממציא' למרות שיש לו מסמכים רלוונטיים",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["chunking-retrieval-strategies"],
          },
          {
            slug: "project-atlasdesk-rag",
            title: "פרויקט מודול: AtlasDesk עונה מתוך בסיס הידע האמיתי שלו",
            objectives: [
              "לחבר את חיפוש הסמנטי הקיים ל-pipeline RAG מלא בתוך SupportChat",
              "לוודא שתשובות מבוססות על תוכן המאמרים בפועל, עם ציטוט מקור",
              "לבדוק מקרה שבו אין מסמך רלוונטי, ולוודא שהמערכת מודה בכך במקום להמציא",
            ],
            estMinutes: 45,
            difficulty: "מתקדם",
            prerequisites: ["evaluating-rag-quality"],
          },
        ],
      },
      {
        slug: "fine-tuning",
        title: "מושגי Fine-tuning",
        description: "LoRA, evaluation",
        projectBrief: "הערכת מודל מותאם מול RAG/פרומפט",
        lessons: [
          {
            slug: "fine-tuning-vs-rag-vs-prompting",
            title: "Fine-tuning מול RAG מול Prompt Engineering",
            objectives: [
              "להבין מתי fine-tuning נחוץ ומתי RAG/פרומפט מספיקים (ולמה זה כמעט תמיד האחרון)",
              "להכיר LoRA כשיטה יעילה יותר מ-fine-tuning מלא",
              "להבין את העלות והזמן הגבוהים של fine-tuning יחסית לחלופות",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["פרויקט מודול: AtlasDesk מקבל אוטומציה מונעת-webhook"],
          },
          {
            slug: "evaluating-fine-tuned-models",
            title: "הערכת מודלים מותאמים",
            objectives: [
              "להכיר מדדי הערכה בסיסיים (accuracy, human eval, A/B testing מול המודל הבסיסי)",
              "להבין את הסיכון של overfitting על סט הדוגמאות שאומן עליו",
              "לזהות מתי מודל מותאם 'משתפר' רק על הנייר אך לא בפועל",
            ],
            estMinutes: 25,
            difficulty: "מתקדם",
            prerequisites: ["fine-tuning-vs-rag-vs-prompting"],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-agents",
    order: 6,
    title: "AI Agents ואוטומציה",
    goal: "סוכן בודד, רב-סוכנים, אוטומציה עסקית",
    color: "#fb923c",
    modules: [
      {
        slug: "single-agent",
        title: "סוכן AI בודד",
        description: "לולאת agent, זיכרון, תכנון",
        projectBrief: "AtlasDesk מקבל סוכן אמיתי עם החלטה אוטונומית",
        lessons: [
          {
            slug: "agent-loop-anatomy",
            title: "אנטומיית לולאת Agent: Think-Act-Observe",
            objectives: [
              "להבין את ההבדל בין 'קריאת API בודדת' ל'סוכן' — לולאה איטרטיבית עם החלטות",
              "להכיר את שלבי הלולאה: תכנון (think), פעולה (act, בד\"כ tool call), תצפית (observe)",
              "להבין מתי סוכן עוצר (הגיע למטרה, מיצה תקציב, נתקע)",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["פרויקט מודול: AtlasDesk עונה מתוך בסיס הידע האמיתי שלו"],
          },
          {
            slug: "agent-memory-systems",
            title: "מערכות זיכרון לסוכנים",
            objectives: [
              "להבחין בין short-term memory (בתוך לולאה בודדת) ל-long-term memory (בין הרצות)",
              "להבין מתי RAG משמש כזיכרון long-term של סוכן",
              "לתכנן איזה מידע לשמר בזיכרון ואיזה 'לזרוק' כדי לא לפוצץ את חלון ההקשר",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["agent-loop-anatomy"],
          },
          {
            slug: "production-agent-case-study",
            title: "מקרה בוחן production: כשלים, התאוששות וניטור סוכנים",
            objectives: [
              "להכיר תרחישי כשל אופייניים לסוכנים (לולאה אינסופית, tool שגוי, drift מהמטרה)",
              "להבין אסטרטגיות התאוששות: budget מקסימלי, human-in-the-loop, circuit breakers",
              "להבין מה מנטרים בסוכן production (מספר סיבובים, עלות לריצה, אחוז השלמת משימה)",
            ],
            estMinutes: 35,
            difficulty: "מתקדם",
            prerequisites: ["agent-memory-systems"],
          },
          {
            slug: "project-atlasdesk-agent",
            title: "פרויקט מודול: AtlasDesk מקבל סוכן עם החלטה אוטונומית",
            objectives: [
              "לתכנן ולממש סוכן שמחליט בעצמו אילו כלים להפעיל ומתי לעצור",
              "להוסיף הגנות production (מגבלת סיבובים, מגבלת עלות, לוג מלא)",
              "לבדוק את הסוכן על מקרה שבו הוא צריך כמה סיבובי tool calling כדי לענות",
            ],
            estMinutes: 45,
            difficulty: "מתקדם",
            prerequisites: ["production-agent-case-study"],
          },
        ],
      },
      {
        slug: "multi-agent",
        title: "מערכות רב-סוכניות",
        description: "תיאום, orchestration",
        projectBrief: "AtlasDesk מקבל אסקלציה רב-סוכנית",
        lessons: [
          {
            slug: "multi-agent-architecture-patterns",
            title: "תבניות ארכיטקטורה רב-סוכניות",
            objectives: [
              "להכיר שלוש תבניות יסוד: orchestrator-worker, sequential, parallel",
              "להבין מתי סוכן בודד (מודול קודם) לא מספיק ומתי כמה סוכנים משתלמים",
              "לזהות את העלות הנוספת (תיאום, latency) של ריבוי סוכנים",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["פרויקט מודול: AtlasDesk מקבל סוכן עם החלטה אוטונומית"],
          },
          {
            slug: "agent-handoff-and-escalation",
            title: "העברת שליטה ואסקלציה בין סוכנים",
            objectives: [
              "להבין מתי סוכן כללי צריך 'להעביר' למומחה ייעודי",
              "לתכנן איך context עובר בין סוכנים בהעברה (handoff)",
              "לזהות סימנים שסוכן צריך לבקש אסקלציה במקום להמשיך לנחש",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["multi-agent-architecture-patterns"],
          },
          {
            slug: "project-atlasdesk-multi-agent-escalation",
            title: "פרויקט מודול: AtlasDesk מקבל אסקלציה רב-סוכנית",
            objectives: [
              "לממש אסקלציה אמיתית מסוכן תמיכה כללי לסוכן מומחה (חיוב/billing)",
              "להעביר context בצורה נקייה בין הסוכנים בהעברה",
              "לבדוק תרחיש אמיתי שמצריך אסקלציה ולוודא שהיא קורית בזמן הנכון",
            ],
            estMinutes: 45,
            difficulty: "מתקדם",
            prerequisites: ["agent-handoff-and-escalation"],
          },
        ],
      },
      {
        slug: "automation-scraping",
        title: "אוטומציה ו-Web Scraping",
        description: "scraping אחראי, webhooks",
        projectBrief: "AtlasDesk מקבל אוטומציה מונעת-webhook",
        lessons: [
          {
            slug: "responsible-scraping-principles",
            title: "עקרונות scraping אחראי",
            objectives: [
              "להבין את robots.txt, rate limiting, ותנאי שימוש כגבולות אתיים וחוקיים",
              "לזהות מתי API רשמי עדיף על scraping",
              "להבין את הסיכונים ההנדסיים של scraping (HTML שמשתנה, חסימות)",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["פרויקט מודול: AtlasDesk מקבל אסקלציה רב-סוכנית"],
          },
          {
            slug: "webhook-driven-automation",
            title: "אוטומציה מונעת-Webhooks",
            objectives: [
              "להבין webhooks כאירועים שמפעילים תגובה אוטומטית",
              "להכיר את עקרון ה-idempotency — טיפול בטוח באירועים כפולים",
              "לתכנן אבטחת webhook (אימות מקור, לא לסמוך על תוכן בלבד)",
            ],
            estMinutes: 25,
            difficulty: "בינוני",
            prerequisites: ["responsible-scraping-principles"],
          },
          {
            slug: "project-atlasdesk-webhook-automation",
            title: "פרויקט מודול: AtlasDesk מקבל אוטומציה מונעת-webhook",
            objectives: [
              "לממש endpoint webhook שמקבל אירוע חיצוני (פנייה חדשה) ומייצר טיוטת תשובה אוטומטית",
              "לשלב את ה-RAG הקיים בתהליך האוטומציה — לא רק בצ'אט האינטראקטיבי",
              "לתכנן idempotency ואבטחה בסיסית ל-endpoint",
            ],
            estMinutes: 40,
            difficulty: "מתקדם",
            prerequisites: ["webhook-driven-automation"],
          },
        ],
      },
    ],
  },
  {
    slug: "production-ai",
    order: 7,
    title: "מערכות AI בפרודקשן",
    goal: "ניטור, עלויות, אבטחה, best practices",
    color: "#ef4444",
    modules: [
      {
        slug: "monitoring-scale",
        title: "ניטור, לוגים וסקייל",
        description: "observability, caching",
        projectBrief: "AtlasDesk מקבל שכבת ניטור אמיתית",
        lessons: [
          {
            slug: "observability-fundamentals-for-ai",
            title: "יסודות Observability למערכות AI",
            objectives: [
              "להבין שלושת עמודי ה-observability: logs, metrics, traces",
              "להכיר מדדים ייחודיים ל-AI (טוקנים, עלות, latency, שיעור הצלחת כלים)",
              "לזהות מה חייבים לתעד בכל קריאת API בפרודקשן",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["פרויקט מודול: הערכת מודל מותאם מול RAG/פרומפט"],
          },
          {
            slug: "caching-strategies-for-ai",
            title: "אסטרטגיות Caching למערכות AI",
            objectives: [
              "להבין מתי אפשר לשמור תוצאה במטמון (caching) בקריאות AI",
              "להכיר prompt caching כתכונה ילידית של Claude API",
              "לזהות סיכוני caching (תשובות מיושנות, פרטיות)",
            ],
            estMinutes: 25,
            difficulty: "מתקדם",
            prerequisites: ["observability-fundamentals-for-ai"],
          },
          {
            slug: "project-atlasdesk-monitoring-layer",
            title: "פרויקט מודול: AtlasDesk מקבל שכבת ניטור אמיתית",
            objectives: [
              "לממש לוגינג מובנה לכל קריאות ה-API של AtlasDesk",
              "לבנות endpoint סטטיסטיקות שמסכם עלות/שימוש",
              "לזהות אנומליה (למשל קפיצה בעלות) מתוך הנתונים שנאספו",
            ],
            estMinutes: 40,
            difficulty: "מתקדם",
            prerequisites: ["caching-strategies-for-ai"],
          },
        ],
      },
      {
        slug: "cost-security",
        title: "אופטימיזציית עלויות ואבטחה",
        description: "Prompt Injection Defense",
        projectBrief: "AtlasDesk מקבל הגנת Prompt Injection",
        lessons: [
          {
            slug: "prompt-injection-defense",
            title: "הגנה מפני Prompt Injection",
            objectives: [
              "להבין מהו prompt injection ואיך תוקף מנצל אותו",
              "להכיר טכניקות הגנה: הפרדת הוראות ממידע, ולידציה, least-privilege לכלים",
              "לתרגל זיהוי ניסיון injection אמיתי",
            ],
            estMinutes: 30,
            difficulty: "מתקדם",
            prerequisites: ["פרויקט מודול: AtlasDesk מקבל שכבת ניטור אמיתית"],
          },
          {
            slug: "cost-optimization-at-scale",
            title: "אופטימיזציית עלויות בקנה מידה",
            objectives: [
              "להכיר טכניקות הוזלה: מודל קטן יותר למשימות פשוטות, prompt caching, batching",
              "להבין את הפשרה בין עלות לאיכות תשובה",
              "לחשב עלות חזויה לאלף משתמשים על סמך נתוני AtlasDesk",
            ],
            estMinutes: 25,
            difficulty: "מתקדם",
            prerequisites: ["prompt-injection-defense"],
          },
          {
            slug: "project-atlasdesk-security-hardening",
            title: "פרויקט מודול: הקשחת AtlasDesk מפני Prompt Injection",
            objectives: [
              "לבדוק את AtlasDesk מול ניסיונות injection אמיתיים (red-team עצמי)",
              "לחזק את ה-system prompts וה-tool validation נגד הזרקות",
              "לתעד את הממצאים והתיקונים כ'דוח אבטחה' קצר",
            ],
            estMinutes: 40,
            difficulty: "מתקדם",
            prerequisites: ["cost-optimization-at-scale"],
          },
        ],
      },
      {
        slug: "production-best-practices",
        title: "Best Practices לפרודקשן",
        description: "SLA, rollback, feature flags",
        projectBrief: "Runbook ו-Playbook תקריות ל-AtlasDesk",
        lessons: [
          {
            slug: "sla-reliability-targets",
            title: "SLA ויעדי אמינות",
            objectives: [
              "להבין SLA/SLO/SLI כשפה משותפת לתיאור אמינות",
              "לקבוע יעדי אמינות ריאליים למערכת AI (זמינות, latency, שיעור הצלחה)",
              "להבין את הפשרה בין אמינות גבוהה לעלות/מורכבות",
            ],
            estMinutes: 25,
            difficulty: "מתקדם",
            prerequisites: ["פרויקט מודול: הקשחת AtlasDesk מפני Prompt Injection"],
          },
          {
            slug: "feature-flags-safe-rollout",
            title: "Feature Flags ופריסה בטוחה",
            objectives: [
              "להבין feature flags ככלי לפריסה הדרגתית ובטוחה",
              "להכיר rollback כתגובה מהירה לתקלה בפרודקשן",
              "לתכנן אסטרטגיית פריסה ליכולת AI חדשה",
            ],
            estMinutes: 25,
            difficulty: "מתקדם",
            prerequisites: ["sla-reliability-targets"],
          },
          {
            slug: "project-atlasdesk-incident-runbook",
            title: "פרויקט מודול: Runbook ו-Playbook תקריות ל-AtlasDesk",
            objectives: [
              "לכתוב runbook תקרית אמיתי (מה עושים כשמפתח API נחסם/נגמר תקציב)",
              "להגדיר יעדי SLA ריאליים ל-AtlasDesk על בסיס מה שנבנה",
              "לסכם את כל טראק Production AI כמסמך מוכנות-לפרודקשן אחד",
            ],
            estMinutes: 40,
            difficulty: "מתקדם",
            prerequisites: ["feature-flags-safe-rollout"],
          },
        ],
        isCapstone: true,
      },
    ],
  },
  {
    slug: "saas-capstone",
    order: 8,
    title: "פיתוח SaaS ומסחור",
    goal: "פרויקט הגמר: פלטפורמת AI SaaS מלאה",
    color: "#facc15",
    modules: [
      { slug: "saas-planning", title: "תכנון מוצר SaaS AI", description: "מיפוי משתמשים, תמחור, MVP", projectBrief: "מסמך MVP מלא", lessons: [] },
      { slug: "saas-build", title: "בנייה מלאה", description: "שילוב כל מה שנלמד", projectBrief: "פלטפורמת SaaS מלאה", lessons: [], isCapstone: true },
      { slug: "saas-business", title: "עסקי: billing ואונבורדינג", description: "subscriptions, analytics", projectBrief: "מערכת חיוב פעילה", lessons: [] },
      { slug: "saas-launch", title: "השקה", description: "דיפלוי, ניטור, שיווק טכני", projectBrief: "השקה לפרודקשן אמיתית", lessons: [], isCapstone: true },
    ],
  },
];

export function findModule(trackSlug: string, moduleSlug: string) {
  const track = TRACKS.find((t) => t.slug === trackSlug);
  const module = track?.modules.find((m) => m.slug === moduleSlug);
  return { track, module };
}

export function findLesson(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const { track, module } = findModule(trackSlug, moduleSlug);
  const lesson = module?.lessons.find((l) => l.slug === lessonSlug);
  return { track, module, lesson };
}

export function totalLessons(): number {
  return TRACKS.reduce(
    (sum, t) => sum + t.modules.reduce((s, m) => s + m.lessons.length, 0),
    0
  );
}

export interface FlatLesson {
  trackSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  href: string;
}

/** כל השיעורים הקיימים, בסדר לימוד — לשימוש בהמלצה חכמה על "המשך למידה" ובחיפוש. */
export function allLessonsFlat(): FlatLesson[] {
  return TRACKS.flatMap((track) =>
    track.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        trackSlug: track.slug,
        moduleSlug: module.slug,
        lessonSlug: lesson.slug,
        title: lesson.title,
        href: `/tracks/${track.slug}/${module.slug}/${lesson.slug}`,
      }))
    )
  );
}

/** השיעור הראשון שהתלמיד עדיין לא השלים, לפי סדר הלימוד — או null אם הכל הושלם. */
export function findNextLesson(completedLessonSlugs: string[]): FlatLesson | null {
  return allLessonsFlat().find((l) => !completedLessonSlugs.includes(l.lessonSlug)) ?? null;
}
