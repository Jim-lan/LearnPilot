import type Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { scoreAnswer } from "@/domain/scoring";
import type { AnswerKey } from "@/domain/demo-content";
import { rebuildSummary } from "./learning-store";
import { awardCorrectAnswer } from "./rewards";

export const DEMO_STUDENT_ID = "demo:student:local"; // Historical fixture only.
type Mode = "practice" | "reassessment";

export function chooseItem(db: Database.Database, studentId: string, conceptId: string, mode: Mode) {
  return db.prepare(`SELECT i.id, i.version, i.prompt, i.hint, i.concept_id, i.pack_id, i.pack_version
    FROM items i WHERE i.concept_id = ? AND i.mode = ? AND i.review_status = 'synthetic_automated_checked'
    AND NOT EXISTS (SELECT 1 FROM assistance_events e WHERE e.student_id = ? AND e.item_id = i.id AND e.kind = 'presented')
    ORDER BY i.id LIMIT 1`).get(conceptId, mode, studentId) as { id: string; version: number; prompt: string; hint: string; concept_id: string; pack_id: string; pack_version: string } | undefined;
}

export function createSession(db: Database.Database, studentId: string, conceptId: string, mode: Mode, reason: string): string | null {
  if (!db.prepare("SELECT id FROM students WHERE id = ?").get(studentId)) throw new Error("Learner not found");
  const item = chooseItem(db, studentId, conceptId, mode);
  if (!item) return null;
  const sessionId = randomUUID();
  const planId = randomUUID();
  const now = new Date().toISOString();
  const summary = db.prepare("SELECT evidence_refs_json, policy_version FROM learning_summaries WHERE student_id = ? AND concept_id = ? AND dirty = 0").get(studentId, conceptId) as { evidence_refs_json: string; policy_version: string } | undefined;
  const resource = db.prepare("SELECT id FROM resources WHERE concept_id = ? AND review_status = 'automated_checked' AND availability = 'available' ORDER BY id LIMIT 1").get(conceptId) as { id: string } | undefined;
  db.transaction(() => {
    db.prepare("INSERT INTO study_plans (id, student_id, concept_id, pack_id, pack_version, reason, attention_prompt, created_at, status, evidence_refs_json, policy_version, resource_id) VALUES (?, ?, ?, ?, ?, ?, 'Read the explanation, then try one question.', ?, 'started', ?, ?, ?)")
      .run(planId, studentId, conceptId, item.pack_id, item.pack_version, reason, now, summary?.evidence_refs_json ?? "[]", summary?.policy_version ?? "descriptive-0.1", resource?.id ?? null);
    db.prepare("INSERT INTO sessions (id, student_id, mode, started_at, plan_id) VALUES (?, ?, ?, ?, ?)").run(sessionId, studentId, mode, now, planId);
    db.prepare("INSERT INTO assistance_events (id, student_id, item_id, item_version, session_id, kind, happened_at) VALUES (?, ?, ?, ?, ?, 'presented', ?)")
      .run(randomUUID(), studentId, item.id, item.version, sessionId, now);
  }).immediate();
  return sessionId;
}

function currentItem(db: Database.Database, studentId: string, sessionId: string) {
  return db.prepare(`SELECT e.item_id, e.item_version FROM assistance_events e JOIN sessions s ON s.id = e.session_id
    LEFT JOIN study_plans p ON p.id = s.plan_id
    WHERE e.session_id = ? AND s.student_id = ? AND s.ended_at IS NULL AND e.kind = 'presented' AND (p.id IS NULL OR p.status = 'started')
    ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`).get(sessionId, studentId) as { item_id: string; item_version: number } | undefined;
}

export function recordAssistance(db: Database.Database, studentId: string, sessionId: string, kind: "hint" | "solution", expectedItemId?: string) {
  const current = currentItem(db, studentId, sessionId);
  if (!current) throw new Error("Session not found");
  if (expectedItemId && current.item_id !== expectedItemId) throw new Error("This session moved to another question. Refresh before continuing.");
  if (db.prepare("SELECT id FROM attempts WHERE session_id = ? AND item_id = ?").get(sessionId, current.item_id)) throw new Error("This item has already been submitted");
  const existing = db.prepare("SELECT id FROM assistance_events WHERE session_id = ? AND item_id = ? AND kind = ?").get(sessionId, current.item_id, kind);
  if (!existing) db.prepare("INSERT INTO assistance_events (id, student_id, item_id, item_version, session_id, kind, happened_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(randomUUID(), studentId, current.item_id, current.item_version, sessionId, kind, new Date().toISOString());
}

export function enableOutsideHelp(db: Database.Database, studentId: string, sessionId: string, expectedItemId?: string) {
  const current = currentItem(db, studentId, sessionId);
  if (!current) throw new Error("Session not found");
  if (expectedItemId && current.item_id !== expectedItemId) throw new Error("This session moved to another question. Refresh before continuing.");
  if (db.prepare("SELECT id FROM attempts WHERE session_id = ? AND item_id = ?").get(sessionId, current.item_id)) throw new Error("This item has already been submitted; move to the next question first.");
  db.transaction(() => {
    const session = db.prepare("SELECT outside_help_active FROM sessions WHERE id = ? AND student_id = ?").get(sessionId, studentId) as { outside_help_active: number };
    if (session.outside_help_active) return;
    db.prepare("UPDATE sessions SET outside_help_active = 1 WHERE id = ? AND student_id = ?").run(sessionId, studentId);
    db.prepare("INSERT INTO assistance_events (id, student_id, item_id, item_version, session_id, kind, happened_at) VALUES (?, ?, ?, ?, ?, 'reported_external', ?)")
      .run(randomUUID(), studentId, current.item_id, current.item_version, sessionId, new Date().toISOString());
  }).immediate();
}

export function submitAttempt(db: Database.Database, studentId: string, sessionId: string, answer: string, idempotencyKey: string, expectedItemId?: string): string {
  if (!idempotencyKey || idempotencyKey.length > 100 || answer.length > 80 || !answer.trim()) throw new Error("Enter one short answer");
  const existingKey = db.prepare("SELECT id, session_id FROM attempts WHERE student_id = ? AND idempotency_key = ?").get(studentId, idempotencyKey) as { id: string; session_id: string } | undefined;
  if (existingKey) {
    if (existingKey.session_id !== sessionId) throw new Error("Submission belongs to another session");
    return existingKey.id;
  }
  const current = db.prepare(`SELECT e.item_id, e.item_version, i.concept_id, i.answer_json, s.outside_help_active
    FROM assistance_events e JOIN sessions s ON s.id = e.session_id
    LEFT JOIN study_plans p ON p.id = s.plan_id
    JOIN items i ON i.id = e.item_id AND i.version = e.item_version
    WHERE e.session_id = ? AND s.student_id = ? AND e.kind = 'presented' AND s.ended_at IS NULL AND (p.id IS NULL OR p.status = 'started')
    ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`).get(sessionId, studentId) as { item_id: string; item_version: number; concept_id: string; answer_json: string; outside_help_active: number } | undefined;
  if (!current) throw new Error("Active session not found");
  if (expectedItemId && current.item_id !== expectedItemId) throw new Error("This session moved to another question. Refresh before answering.");
  const existingItem = db.prepare("SELECT id FROM attempts WHERE session_id = ? AND item_id = ?").get(sessionId, current.item_id) as { id: string } | undefined;
  if (existingItem) return existingItem.id;
  const priorPresentations = (db.prepare("SELECT COUNT(*) AS n FROM assistance_events WHERE student_id = ? AND item_id = ? AND kind = 'presented'").get(studentId, current.item_id) as { n: number }).n;
  const hintOrReveal = (db.prepare("SELECT COUNT(*) AS n FROM assistance_events WHERE session_id = ? AND item_id = ? AND kind IN ('hint','solution')").get(sessionId, current.item_id) as { n: number }).n > 0;
  const assistance = hintOrReveal || current.outside_help_active ? "recorded_assisted" : "known_none";
  const attemptId = randomUUID();
  db.prepare("INSERT INTO attempts (id, student_id, session_id, item_id, item_version, answer, score_status, assistance_status, prior_exposure, idempotency_key, submitted_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)")
    .run(attemptId, studentId, sessionId, current.item_id, current.item_version, answer.trim(), assistance, priorPresentations > 1 ? 1 : 0, idempotencyKey, new Date().toISOString());
  const score = scoreAnswer(answer, JSON.parse(current.answer_json) as AnswerKey, assistance !== "known_none" || priorPresentations > 1);
  db.transaction(() => {
    db.prepare("UPDATE attempts SET score_status = ?, score_value = ?, feedback_text = ?, score_source = 'deterministic-v0.1' WHERE id = ?")
      .run(score.status, score.value, score.feedback, attemptId);
    awardCorrectAnswer(db, attemptId);
    rebuildSummary(db, studentId, current.concept_id);
  }).immediate();
  return attemptId;
}

export function advanceSession(db: Database.Database, studentId: string, sessionId: string, expectedItemId?: string): "advanced" | "exhausted" {
  const session = db.prepare("SELECT s.mode FROM sessions s LEFT JOIN study_plans p ON p.id = s.plan_id WHERE s.id = ? AND s.student_id = ? AND s.ended_at IS NULL AND (p.id IS NULL OR p.status = 'started')").get(sessionId, studentId) as { mode: Mode } | undefined;
  if (!session) throw new Error("Active session not found");
  const current = db.prepare(`SELECT e.item_id, i.concept_id FROM assistance_events e JOIN items i ON i.id = e.item_id AND i.version = e.item_version
    WHERE e.session_id = ? AND e.kind = 'presented' ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`).get(sessionId) as { item_id: string; concept_id: string } | undefined;
  if (!current) throw new Error("Session has no item");
  if (expectedItemId && current.item_id !== expectedItemId) throw new Error("This session already moved on. Refresh to see the current question.");
  if (!db.prepare("SELECT id FROM attempts WHERE session_id = ? AND item_id = ?").get(sessionId, current.item_id)) throw new Error("Submit or pause before moving on");
  const next = chooseItem(db, studentId, current.concept_id, session.mode);
  if (!next) {
    db.prepare("UPDATE sessions SET ended_at = ? WHERE id = ? AND student_id = ?").run(new Date().toISOString(), sessionId, studentId);
    return "exhausted";
  }
  db.prepare("INSERT INTO assistance_events (id, student_id, item_id, item_version, session_id, kind, happened_at) VALUES (?, ?, ?, ?, ?, 'presented', ?)")
    .run(randomUUID(), studentId, next.id, next.version, sessionId, new Date().toISOString());
  return "advanced";
}
