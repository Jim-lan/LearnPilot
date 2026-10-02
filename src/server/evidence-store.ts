import { randomUUID } from "node:crypto";
import type Database from "better-sqlite3";
import { rebuildSummary } from "./learning-store";
import { DEMO_STUDENT_ID } from "./session-store";

export type ManualDraft = {
  evidenceId?: string;
  conceptId: string;
  question: string;
  response: string;
  teacherMark: string;
  locator: string;
  sourceDescription: string;
};

export function saveManualDraft(db: Database.Database, input: ManualDraft): string {
  if (input.question.trim().length < 1 || input.question.length > 1000 || input.response.length > 2000 || input.locator.trim().length < 1 || input.locator.length > 200 || input.teacherMark.length > 100 || input.sourceDescription.length > 200) throw new Error("Complete the question, response and source location using short text");
  const concept = db.prepare("SELECT id FROM concepts WHERE id = ? AND pack_id = 'demo:snc1w-circuits' AND pack_version = '0.1.0'").get(input.conceptId);
  if (!concept) throw new Error("Unknown concept");
  const id = input.evidenceId || randomUUID();
  db.transaction(() => {
    const now = new Date().toISOString();
    const previous = input.evidenceId ? db.prepare("SELECT status FROM evidence WHERE id = ? AND student_id = ?").get(id, DEMO_STUDENT_ID) as { status: string } | undefined : undefined;
    if (input.evidenceId && (!previous || !["draft", "needs_review"].includes(previous.status))) throw new Error("Draft is no longer editable");
    if (!input.evidenceId) db.prepare("INSERT INTO evidence (id, student_id, source_type, status, created_at, source_description) VALUES (?, ?, 'manual', 'draft', ?, ?)").run(id, DEMO_STUDENT_ID, now, input.sourceDescription.trim());
    const next = (db.prepare("SELECT COALESCE(MAX(revision_number), 0) + 1 AS n FROM evidence_revisions WHERE evidence_id = ?").get(id) as { n: number }).n;
    const revisionId = randomUUID();
    db.prepare(`INSERT INTO evidence_revisions (id, evidence_id, revision_number, concept_id, response, mark, mark_origin, assistance_status, source_locator, reviewer, review_status, created_at, question_text, teacher_mark)
      VALUES (?, ?, ?, ?, ?, NULL, 'none', 'unknown', ?, NULL, 'draft', ?, ?, ?)`)
      .run(revisionId, id, next, input.conceptId, input.response.trim(), input.locator.trim(), now, input.question.trim(), input.teacherMark.trim() || null);
    db.prepare("UPDATE evidence SET current_revision_id = ?, source_description = ?, status = 'draft' WHERE id = ?")
      .run(revisionId, input.sourceDescription.trim(), id);
  }).immediate();
  return id;
}

export function publishManualEvidence(db: Database.Database, evidenceId: string, result: "correct" | "incorrect" | "unclear") {
  const record = db.prepare(`SELECT e.id, e.student_id, e.status, r.id AS revision_id, r.concept_id, r.question_text, r.response, r.source_locator
    FROM evidence e JOIN evidence_revisions r ON r.id = e.current_revision_id WHERE e.id = ? AND e.student_id = ?`)
    .get(evidenceId, DEMO_STUDENT_ID) as { id: string; student_id: string; status: string; revision_id: string; concept_id: string; question_text: string | null; response: string; source_locator: string | null } | undefined;
  if (!record || record.status !== "draft" || !record.question_text || !record.response || !record.source_locator) throw new Error("Review a complete current draft first");
  db.transaction(() => {
    db.prepare("UPDATE evidence_revisions SET mark = ?, mark_origin = 'local_demo_user_review', reviewer = 'local_demo_user_unverified', review_status = 'reviewed' WHERE id = ?")
      .run(result === "unclear" ? null : result, record.revision_id);
    db.prepare("UPDATE evidence SET status = 'reviewed' WHERE id = ?").run(evidenceId);
    rebuildSummary(db, DEMO_STUDENT_ID, record.concept_id);
  }).immediate();
}

export function correctManualEvidence(db: Database.Database, evidenceId: string, expectedRevisionId: string, input: ManualDraft, result: "correct" | "incorrect" | "unclear", reason: string): string {
  if (reason.trim().length < 5 || reason.length > 300) throw new Error("Explain why this reviewed observation changed");
  if (!input.question.trim() || !input.response.trim() || !input.locator.trim()) throw new Error("Complete the corrected question, response and locator");
  if (input.question.length > 1000 || input.response.length > 2000 || input.locator.length > 200 || input.teacherMark.length > 100 || input.sourceDescription.length > 200) throw new Error("Correction text is too long");
  if (!db.prepare("SELECT id FROM concepts WHERE id = ? AND pack_id = 'demo:snc1w-circuits' AND pack_version = '0.1.0'").get(input.conceptId)) throw new Error("Unknown concept");
  return db.transaction(() => {
    const current = db.prepare(`SELECT e.status, e.current_revision_id, r.revision_number, r.concept_id
      FROM evidence e JOIN evidence_revisions r ON r.id = e.current_revision_id
      WHERE e.id = ? AND e.student_id = ?`).get(evidenceId, DEMO_STUDENT_ID) as { status: string; current_revision_id: string; revision_number: number; concept_id: string } | undefined;
    if (!current || current.status !== "reviewed" || current.current_revision_id !== expectedRevisionId) throw new Error("This evidence changed; reload before correcting it");
    const revisionId = randomUUID();
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO evidence_revisions (id, evidence_id, revision_number, concept_id, response, mark, mark_origin, assistance_status, source_locator, reviewer, review_status, created_at, question_text, teacher_mark, supersedes_revision_id, correction_reason)
      VALUES (?, ?, ?, ?, ?, ?, 'local_demo_user_review', 'unknown', ?, 'local_demo_user_unverified', 'reviewed', ?, ?, ?, ?, ?)`)
      .run(revisionId, evidenceId, current.revision_number + 1, input.conceptId, input.response.trim(), result === "unclear" ? null : result, input.locator.trim(), now, input.question.trim(), input.teacherMark.trim() || null, expectedRevisionId, reason.trim());
    const changed = db.prepare("UPDATE evidence SET current_revision_id = ?, source_description = ? WHERE id = ? AND current_revision_id = ?")
      .run(revisionId, input.sourceDescription.trim(), evidenceId, expectedRevisionId);
    if (changed.changes !== 1) throw new Error("Correction conflicted with another update");
    db.prepare("UPDATE study_plans SET status = 'stale' WHERE student_id = ? AND concept_id IN (?, ?) AND status = 'started'")
      .run(DEMO_STUDENT_ID, current.concept_id, input.conceptId);
    rebuildSummary(db, DEMO_STUDENT_ID, current.concept_id);
    if (input.conceptId !== current.concept_id) rebuildSummary(db, DEMO_STUDENT_ID, input.conceptId);
    return revisionId;
  }).immediate();
}
