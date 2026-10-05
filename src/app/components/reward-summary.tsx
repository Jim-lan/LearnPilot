export function RewardSummary({ points, correctAnswers }: { points: number; correctAnswers: number }) {
  return <aside className="reward-summary" aria-label="Your learning points">
    <span className="reward-emblem" aria-hidden="true">★</span>
    <div><strong>{points} learning points</strong><p>{correctAnswers} correct quiz answer{correctAnswers === 1 ? "" : "s"} · 10 points each</p>
      <small>Celebrate each success. Points are separate from understanding; using help is welcome.</small></div>
  </aside>;
}
