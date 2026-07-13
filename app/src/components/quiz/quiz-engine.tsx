"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress/store";
import { useLessonKey } from "@/lib/lesson/lesson-context";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** הסבר כללי שמעמיק את ההבנה — מוצג תמיד אחרי שליחה, לא רק "למה זה נכון" */
  explanation: string;
  /**
   * הסבר ספציפי לכל אופציה (אותו סדר כמו options) — למה היא נכונה/שגויה.
   * אופציונלי: שאלות ישנות בלי זה עדיין עובדות עם explanation הכללי בלבד.
   */
  optionNotes?: string[];
}

function shuffledIndices(length: number, seed: string): number[] {
  // shuffle יציב לכל שאלה (seed = מזהה השאלה) כדי שהסדר לא יקפוץ תוך כדי מענה,
  // אבל שונה בין שאלות ובין טעינות עמוד — כדי שהתשובה הנכונה לא תהיה תמיד באותו מיקום.
  let seedNum = 0;
  for (let i = 0; i < seed.length; i++) seedNum = (seedNum * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    seedNum = (seedNum * 1103515245 + 12345) >>> 0;
    return seedNum / 0xffffffff;
  };
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function QuizEngine({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  // מפתח rebuild אקראי כדי שכל טעינת עמוד/ניסיון חוזר יקבל סדר אחר, אך יציב תוך כדי מענה
  const [sessionSeed] = React.useState(() => Math.random().toString(36).slice(2));
  const lessonKey = useLessonKey();
  const { recordQuiz } = useProgress();

  const score = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  const handleSubmit = () => {
    setSubmitted(true);
    // רישום לתוך המנוע האדפטיבי — רק כשהבוחן בתוך שיעור (יש lessonKey)
    if (lessonKey) recordQuiz(lessonKey, score, questions.length);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        const order = shuffledIndices(q.options.length, sessionSeed + q.id);
        return (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-semibold">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-3 space-y-2">
              {order.map((oi) => {
                const opt = q.options[oi];
                const isChosen = chosen === oi;
                const isCorrectOption = oi === q.correctIndex;
                const isCorrect = submitted && isCorrectOption;
                const isWrongChoice = submitted && isChosen && !isCorrectOption;
                const note = q.optionNotes?.[oi];
                return (
                  <div key={oi}>
                    <button
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-right text-sm transition",
                        isChosen && !submitted && "border-primary bg-primary/5",
                        !isChosen && !submitted && "border-border hover:bg-background",
                        isCorrect && "border-success bg-success/10 text-success",
                        isWrongChoice && "border-danger bg-danger/10 text-danger"
                      )}
                    >
                      {opt}
                      {isCorrect && <CheckCircle2 size={16} />}
                      {isWrongChoice && <XCircle size={16} />}
                    </button>
                    {submitted && note && (isChosen || isCorrectOption) && (
                      <p
                        className={cn(
                          "mt-1 px-3 text-xs",
                          isCorrectOption ? "text-success" : "text-danger"
                        )}
                      >
                        {note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 rounded-lg bg-background p-3 text-xs text-muted">
                <span className="font-semibold text-primary">להעמיק: </span>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground disabled:opacity-40"
        >
          שלח בוחן
        </button>
      ) : (
        <div className="rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary">
          התוצאה שלך: {score}/{questions.length}
        </div>
      )}
    </div>
  );
}
