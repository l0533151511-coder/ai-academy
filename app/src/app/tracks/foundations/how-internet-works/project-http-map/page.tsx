"use client";

import { Laptop, BookOpenCheck, Server, ShieldCheck, Globe2 } from "lucide-react";
import { LessonShell, type LessonMeta, type LessonSection } from "@/components/lesson/lesson-shell";
import { SlideDeck, type Slide } from "@/components/slides/slide-deck";
import { NetworkJourney, type JourneyNode, type JourneyHop } from "@/components/simulators/network-journey";
import { HttpPlayground } from "@/components/simulators/http-playground";
import { QuizEngine, type QuizQuestion } from "@/components/quiz/quiz-engine";

const META: LessonMeta = {
  trackSlug: "foundations",
  moduleSlug: "how-internet-works",
  lessonSlug: "project-http-map",
  title: "פרויקט מודול: מפת מסע בקשת HTTP מלאה",
  objectives: [
    "לחבר בין DNS, TLS ו-HTTP למסע אחד רציף שאתה שולט בו",
    "לבצע בקשות אמיתיות במעבדת ה-HTTP ולראות את השפעתן",
  ],
  estMinutes: 45,
  difficulty: "בינוני",
  prerequisites: ["אבטחת תשתית בסיסית: TLS, תעודות, HTTPS"],
};

const SLIDES: Slide[] = [
  {
    title: "מה בונים בפרויקט הזה",
    bullets: [
      "עד עכשיו ראית כל שלב בנפרד: DNS, HTTP, לקוח-שרת, TLS.",
      "עכשיו נחבר את כולם למסע אחד רציף — בדיוק מה שקורה בפועל כשאתה נכנס ל-https://academy.ai",
      "בסוף תשתמש במעבדת ה-HTTP כדי לבצע את הבקשה 'האמיתית' בעצמך ולראות את כל שרשרת האירועים.",
    ],
  },
];

const NODES: JourneyNode[] = [
  { id: "browser", label: "הדפדפן שלך", icon: Laptop },
  { id: "dns", label: "שרת DNS", icon: BookOpenCheck },
  { id: "server", label: "שרת האתר", icon: Server },
  { id: "tls", label: "אבטחת TLS", icon: ShieldCheck },
  { id: "final", label: "עמוד מוצג", icon: Globe2 },
];

const HOPS: JourneyHop[] = [
  {
    fromNodeId: "browser",
    toNodeId: "dns",
    label: "1. שאילתת DNS",
    detail: "הדפדפן שואל: 'מה כתובת ה-IP של academy.ai?'",
  },
  {
    fromNodeId: "dns",
    toNodeId: "browser",
    label: "2. תשובת DNS",
    detail: "מתקבלת כתובת IP — עכשיו הדפדפן יודע לאן לפנות.",
  },
  {
    fromNodeId: "browser",
    toNodeId: "server",
    label: "3. חיבור ל-Server",
    detail: "הדפדפן פותח חיבור רשת (TCP) לכתובת ה-IP שהתקבלה.",
  },
  {
    fromNodeId: "server",
    toNodeId: "tls",
    label: "4. TLS Handshake",
    detail: "אם זה HTTPS — מתבצע handshake להסכמת מפתחות הצפנה ואימות תעודה.",
  },
  {
    fromNodeId: "tls",
    toNodeId: "server",
    label: "5. בקשת HTTP מוצפנת",
    detail: "הדפדפן שולח בקשת GET מוצפנת לעמוד המבוקש.",
  },
  {
    fromNodeId: "server",
    toNodeId: "final",
    label: "6. תגובה ורינדור",
    detail: "השרת מחזיר HTML/CSS/JS מוצפנים; הדפדפן מפענח, בונה DOM, ומציג את העמוד.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "מהו הסדר הנכון של השלבים במסע המלא?",
    options: [
      "HTTP → DNS → TLS",
      "DNS → חיבור לשרת → TLS → HTTP → רינדור",
      "רינדור → DNS → HTTP",
      "TLS → DNS → חיבור לשרת",
    ],
    correctIndex: 1,
    explanation: "קודם צריך לדעת לאן לפנות (DNS), אז מתחברים, מאבטחים את הערוץ (TLS), שולחים HTTP, ואז מרנדרים.",
  },
  {
    id: "q2",
    question: "אם שרת ה-DNS לא היה קיים, מה היה קורה?",
    options: [
      "שום דבר, HTTP היה עובד רגיל",
      "הדפדפן לא היה יודע לאיזו כתובת IP לפנות",
      "TLS היה נכשל אוטומטית",
      "העמוד היה נטען מהר יותר",
    ],
    correctIndex: 1,
    explanation: "בלי DNS, אין דרך לתרגם את השם הקריא (academy.ai) לכתובת IP הדרושה ליצירת חיבור.",
  },
];

const SECTIONS: LessonSection[] = [
  { id: "slides", label: "מה בונים", content: <SlideDeck slides={SLIDES} /> },
  {
    id: "full-journey",
    label: "המסע המלא — מ-DNS ועד עמוד מוצג",
    content: <NetworkJourney nodes={NODES} hops={HOPS} />,
  },
  {
    id: "hands-on",
    label: "עכשיו תורך: בצע את הבקשה בעצמך",
    content: (
      <div>
        <p className="mb-3 text-sm text-muted">
          מעבדת ה-HTTP למטה מדמה בדיוק את השלב האחרון של המסע (בקשת HTTP + תגובה). שלח כמה בקשות
          שונות ונסה לחזות את קוד הסטטוס לפני שאתה רואה את התוצאה.
        </p>
        <HttpPlayground />
      </div>
    ),
  },
  { id: "quiz", label: "בוחן ידע — סיכום המודול", content: <QuizEngine questions={QUIZ} /> },
  {
    id: "summary",
    label: "סיכום המודול",
    content: (
      <div className="rounded-xl bg-card p-5 text-sm">
        <p className="mb-2 font-bold">מה כיסינו במודול ”איך האינטרנט עובד”</p>
        <ul className="space-y-1.5">
          <li>✅ כתובות IP ו-DNS — איך שם דומיין הופך לכתובת שאפשר לפנות אליה</li>
          <li>✅ פרוטוקול HTTP/HTTPS — אנטומיה של בקשה ותגובה, קודי סטטוס</li>
          <li>✅ תפקידי Client מול Server במחזור חיים של עמוד</li>
          <li>✅ TLS ואבטחת תשתית — למה HTTPS קריטי</li>
          <li>✅ חיברת הכל למסע אחד רציף ובחנת אותו בעצמך במעבדה</li>
        </ul>
        <p className="mt-3 text-muted">
          במודול הבא (”טרמינל ו-Linux”) נעבור מהבנת התשתית לשליטה ישירה במחשב דרך שורת הפקודה —
          הכלי שבו כל מפתח מקצועי חי.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <LessonShell meta={META} sections={SECTIONS} />;
}
