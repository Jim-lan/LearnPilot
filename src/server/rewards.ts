import type Database from "better-sqlite3";

// Encouragement has no input into the learning policy or independent-evidence rules.
export function awardCorrectAnswer(db: Database.Database, attemptId: string): void {
  db.prepare(`INSERT INTO reward_awards (attempt_id, student_id, item_id, item_version, points, policy_version, awarded_at)
    SELECT id, student_id, item_id, item_version, 10, 'correct-answer-v1', submitted_at
    FROM attempts WHERE id = ? AND score_status = 'correct' AND score_source = 'deterministic-v0.1'
    ON CONFLICT DO NOTHING`).run(attemptId);
}

export function rewardTotals(db: Database.Database, studentId: string): { points: number; correctAnswers: number } {
  return db.prepare(`SELECT COALESCE(SUM(r.points), 0) AS points, COUNT(*) AS correctAnswers
    FROM reward_awards r JOIN attempts a ON a.id = r.attempt_id AND a.student_id = r.student_id
    AND a.item_id = r.item_id AND a.item_version = r.item_version
    WHERE r.student_id = ? AND a.score_status = 'correct'`).get(studentId) as { points: number; correctAnswers: number };
}

export function attemptReward(db: Database.Database, attemptId: string): number {
  return (db.prepare(`SELECT r.points FROM reward_awards r JOIN attempts a ON a.id = r.attempt_id
    WHERE r.attempt_id = ? AND a.score_status = 'correct'`).get(attemptId) as { points: number } | undefined)?.points ?? 0;
}
