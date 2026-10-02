import type Database from "better-sqlite3";
import { LEARNING_POLICY_VERSION, summarizeLearning, type Observation } from "@/domain/learning";

export function loadObservations(db: Database.Database, studentId: string, conceptId: string): Observation[] {
  const attempts = db.prepare(`SELECT a.id, a.score_status, a.assistance_status, a.prior_exposure, a.submitted_at
    FROM attempts a JOIN items i ON i.id = a.item_id AND i.version = a.item_version
    WHERE a.student_id = ? AND i.concept_id = ? AND a.score_status <> 'pending'`)
    .all(studentId, conceptId) as { id: string; score_status: string; assistance_status: Observation["assistance"]; prior_exposure: number; submitted_at: string }[];
  const manual = db.prepare(`SELECT r.id, r.mark, r.assistance_status, r.created_at
    FROM evidence e JOIN evidence_revisions r ON r.id = e.current_revision_id
    WHERE e.student_id = ? AND r.concept_id = ? AND e.status = 'reviewed' AND r.review_status = 'reviewed'`)
    .all(studentId, conceptId) as { id: string; mark: string | null; assistance_status: Observation["assistance"]; created_at: string }[];
  return [
    ...attempts.map(row => ({ id: row.id, result: row.score_status === "correct" ? "correct" : ["wrong_value", "wrong_unit", "missing_unit"].includes(row.score_status) ? "incorrect" : "unknown", assistance: row.assistance_status, unseen: row.prior_exposure === 0, observedAt: row.submitted_at } as Observation)),
    ...manual.map(row => ({ id: row.id, result: row.mark === "correct" ? "correct" : row.mark === "incorrect" ? "incorrect" : "unknown", assistance: row.assistance_status, unseen: false, observedAt: row.created_at } as Observation)),
  ];
}

export function rebuildSummary(db: Database.Database, studentId: string, conceptId: string, now = new Date()) {
  const observations = loadObservations(db, studentId, conceptId);
  const summary = summarizeLearning(observations, now);
  const coverage = db.prepare("SELECT state FROM coverage_observations WHERE student_id = ? AND concept_id = ? ORDER BY observed_at DESC, rowid DESC LIMIT 1").get(studentId, conceptId) as { state: string } | undefined;
  db.prepare(`INSERT INTO learning_summaries (student_id, concept_id, policy_version, evidence_refs_json, coverage, observed_result, assistance, sufficiency, review_due_at, dirty, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    ON CONFLICT(student_id, concept_id) DO UPDATE SET policy_version=excluded.policy_version, evidence_refs_json=excluded.evidence_refs_json, coverage=excluded.coverage, observed_result=excluded.observed_result, assistance=excluded.assistance, sufficiency=excluded.sufficiency, review_due_at=excluded.review_due_at, dirty=0, updated_at=excluded.updated_at`)
    .run(studentId, conceptId, LEARNING_POLICY_VERSION, JSON.stringify(summary.evidenceRefs), coverage?.state ?? "unknown", summary.observedResult, summary.assistance, summary.sufficiency, summary.reviewDueAt, now.toISOString());
  return summary;
}
