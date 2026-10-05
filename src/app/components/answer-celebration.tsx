"use client";

import { useEffect, useState } from "react";

export function AnswerCelebration({ attemptId, points, animate }: { attemptId: string; points: number; animate: boolean }) {
  const [celebrating, setCelebrating] = useState(false);
  useEffect(() => {
    if (!animate) return;
    const key = `learnpilot:celebrated:${attemptId}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch { /* A blocked storage preference must never prevent feedback. */ }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      try { sessionStorage.setItem(key, "1"); } catch { /* Feedback still works without browser storage. */ }
      setCelebrating(true);
      timer = setTimeout(() => setCelebrating(false), 1500);
    });
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [attemptId, animate]);

  return <div className={`answer-celebration${celebrating ? " is-celebrating" : ""}`} role="status">
    <svg className="success-star" viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#fff0bd" />
      <path d="m32 10 6.7 13.6 15 2.2-10.8 10.5 2.6 14.9L32 44.2l-13.5 7 2.6-14.9L10.3 25.8l15-2.2z" fill="#c48108" />
      <path d="m24 32 5 5 11-12" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div><strong>Correct — nice work!</strong><p>+{points} learning points. One more success to build on.</p></div>
    <div className="celebration-sparks" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--spark-index": index } as React.CSSProperties} />)}</div>
  </div>;
}
