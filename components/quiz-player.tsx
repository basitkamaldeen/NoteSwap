// components/quiz-player.tsx
"use client";
import { useState } from "react";

export function QuizPlayer({ quiz }: { quiz: any[] }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  if (!quiz || !quiz.length) return null;

  function choose(opt: string) {
    if (opt === quiz[index].answer) setScore((s) => s + 1);
    setIndex((i) => i + 1);
  }

  if (index >= quiz.length) {
    return <div>Finished! Score: {score}/{quiz.length}</div>;
  }

  const q = quiz[index];
  return (
    <div className="p-3 border rounded">
      <h3 className="font-semibold">{q.question}</h3>
      <div className="mt-2 flex flex-col gap-2">
        {q.options.map((o: string) => (
          <button key={o} onClick={() => choose(o)} className="p-2 border rounded">
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
