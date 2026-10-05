import type Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { scoreNumber } from "@/domain/scoring";
import type { AnswerKey } from "@/domain/demo-content";
import { rebuildSummary } from "./learning-store";
import { awardCorrectAnswer } from "./rewards";

export const DEMO_STUDENT_ID = "demo:student:local";

export function chooseItem(db: Database.Database, conceptId: string, mode: "practice" | "reassessment") {
  return db.prepare(`SELECT i.id, i.version, i.prompt, i.hint, i.concept_id
    FROM items i WHERE i.concept_id = ? AND i.mode = ? AND i.review_status = 'synthetic_automated_checked'
    AND NOT EXISTS (SELECT 1 FROM assistance_events e WHERE e.student_id = ? AND e.item_id = i.id AND e.kind = 'presented')
    ORDER BY i.id LIMIT 1`).get(conceptId, mode, DEMO_STUDENT_ID) as { id: string; version: number; prompt: string; hint: string; concept_id: string } | undefined;
}

export function createSession(db: Database.Database, conceptId: string, mode: "practice" | "reassessment", reason: string): string | null {
  const item = chooseItem(db, conceptId, mode);
  if (!item) return null;
  const sessionId = randomUUID();
  const planId = randomUUID();
  const now = new Date().toISOString();
  const summary = db.prepare("SELECT evidence_refs_json, policy_version FROM learning_summaries WHERE student_id = ? AND concept_id = ? AND dirty = 0").get(DEMO_STUDENT_ID, conceptId) as { evidence_refs_json: string; policy_version: string } | undefined;
  const resource = db.prepare("SELECT id FROM resources WHERE concept_id = ? AND review_status = 'automated_checked' AND availability = 'available' ORDER BY id LIMIT 1").get(conceptId) as { id: string } | undefined;
  db.transaction(() => {
    db.prepare("INSERT INTO study_plans (id, student_id, concept_id, pack_id, pack_version, reason, attention_prompt, created_at, status, evidence_refs_json, policy_version, resource_id) VALUES (?, ?, ?, 'demo:snc1w-circuits', '0.1.0', ?, 'Notice the relationship and include the unit.', ?, 'started', ?, ?, ?)")
      .run(planId, DEMO_STUDENT_ID, conceptId, reason, now, summary?.evidence_refs_json ?? "[]", summary?.policy_version ?? "descriptive-0.1", resource?.id ?? null);
    db.prepare("INSERT INTO sessions (id, student_id, mode, started_at, plan_id) VALUES (?, ?, ?, ?, ?)").run(sessionId, DEMO_STUDENT_ID, mode, now, planId);
    db.prepare("INSERT INTO assistance_events (id, student_id, item_id, item_version, session_id, kind, happened_at) VALUES (?, ?, ?, ?, ?, 'presented', ?)")
      .run(randomUUID(), DEMO_STUDENT_ID, item.id, item.version, sessionId, now);
  }).immediate();
  return sessionId;
}

export function recordAssistance(db: Database.Database, sessionId: string, kind: "hint" | "solution", expectedItemId?: string) {
  const current = db.prepare(`SELECT e.item_id, e.item_version FROM assistance_events e JOIN sessions s ON s.id = e.session_id
    LEFT JOIN study_plans p ON p.id = s.plan_id
    WHERE e.session_id = ? AND s.student_id = ? AND e.kind = 'presented' AND (p.id IS NULL OR p.status = 'started') ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`)
    .get(sessionId, DEMO_STUDENT_ID) as { item_id: string; item_version: number } | undefined;
  if (!current) throw new Error("Session not found");
  if (expectedItemId && current.item_id !== expectedItemId) throw new Error("This session moved to another question. Refresh before continuing.");
  const attempted = db.prepare("SELECT id FROM attempts WHERE session_id = ? AND item_id = ?").get(sessionId, current.item_id);
  if (attempted) throw new Error("This item has already been submitted");
  const existing = db.prepare("SELECT id FROM assistance_events WHERE session_id = ? AND item_id = ? AND kind = ?").get(sessionId, current.item_id, kind);
  if (!existing) db.prepare("INSERT INTO assistance_events (id, student_id, item_id, item_version, session_id, kind, happened_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(randomUUID(), DEMO_STUDENT_ID, current.item_id, current.item_version, sessionId, kind, new Date().toISOString());
}

export function submitAttempt(db: Database.Database, sessionId: string, answer: string, externalHelp: "none" | "yes" | "unsure", idempotencyKey: string, expectedItemId?: string): string {
  if (!idempotencyKey || idempotencyKey.length > 100 || answer.length > 80 || !answer.trim()) throw new Error("Enter one short answer with a unit");
  const existingKey = db.prepare("SELECT id, session_id FROM attempts WHERE student_id = ? AND idempotency_key = ?").get(DEMO_STUDENT_ID, idempotencyKey) as { id: string; session_id: string } | undefined;
  if (existingKey) {
    if (existingKey.session_id !== sessionId) throw new Error("Submission belongs to another session");
    return existingKey.id;
  }
  const current = db.prepare(`SELECT e.item_id, e.item_version, i.concept_id, i.answer_json
    FROM assistance_events e JOIN sessions s ON s.id = e.session_id
    LEFT JOIN study_plans p ON p.id = s.plan_id
    JOIN items i ON i.id = e.item_id AND i.version = e.item_version
    WHERE e.session_id = ? AND s.student_id = ? AND e.kind = 'presented' AND s.ended_at IS NULL AND (p.id IS NULL OR p.status = 'started')
    ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`).get(sessionId, DEMO_STUDENT_ID) as { item_id: string; item_version: number; concept_id: string; answer_json: string } | undefined;
  if (!current) throw new Error("Active session not found");
  if (expectedItemId && current.item_id !== expectedItemId) throw new Error("This session moved to another question. Refresh before answering.");
  const existingItem = db.prepare("SELECT id FROM attempts WHERE session_id = ? AND item_id = ?").get(sessionId, current.item_id) as { id: string } | undefined;
  if (existingItem) return existingItem.id;
  const priorPresentations = (db.prepare("SELECT COUNT(*) AS n FROM assistance_events WHERE student_id = ? AND item_id = ? AND kind = 'presented'").get(DEMO_STUDENT_ID, current.item_id) as { n: number }).n;
  const hintOrReveal = (db.prepare("SELECT COUNT(*) AS n FROM assistance_events WHERE session_id = ? AND item_id = ? AND kind IN ('hint','solution')").get(sessionId, current.item_id) as { n: number }).n > 0;
  const assistance = hintOrReveal || externalHelp === "yes" ? "recorded_assisted" : externalHelp === "none" ? "known_none" : "unknown";
  const attemptId = randomUUID();
  db.prepare("INSERT INTO attempts (id, student_id, session_id, item_id, item_version, answer, score_status, assistance_status, prior_exposure, idempotency_key, submitted_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)")
    .run(attemptId, DEMO_STUDENT_ID, sessionId, current.item_id, current.item_version, answer.trim(), assistance, priorPresentations > 1 ? 1 : 0, idempotencyKey, new Date().toISOString());
  const score = scoreNumber(answer, JSON.parse(current.answer_json) as AnswerKey, assistance !== "known_none" || priorPresentations > 1);
  db.transaction(() => {
    db.prepare("UPDATE attempts SET score_status = ?, score_value = ?, feedback_text = ?, score_source = 'deterministic-v0.1' WHERE id = ?")
      .run(score.status, score.value, score.feedback, attemptId);
    awardCorrectAnswer(db, attemptId);
    rebuildSummary(db, DEMO_STUDENT_ID, current.concept_id);
  }).immediate();
  return attemptId;
}

export function advanceSession(db: Database.Database, sessionId: string, expectedItemId?: string): "advanced" | "exhausted" {
  const session = db.prepare("SELECT s.mode FROM sessions s LEFT JOIN study_plans p ON p.id = s.plan_id WHERE s.id = ? AND s.student_id = ? AND s.ended_at IS NULL AND (p.id IS NULL OR p.status = 'started')").get(sessionId, DEMO_STUDENT_ID) as { mode: "practice" | "reassessment" } | undefined;
  if (!session) throw new Error("Active session not found");
  const current = db.prepare(`SELECT e.item_id, i.concept_id FROM assistance_events e JOIN items i ON i.id = e.item_id AND i.version = e.item_version
    WHERE e.session_id = ? AND e.kind = 'presented' ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`).get(sessionId) as { item_id: string; concept_id: string } | undefined;
  if (!current) throw new Error("Session has no item");
  if (expectedItemId && current.item_id !== expectedItemId) throw new Error("This session already moved on. Refresh to see the current question.");
  if (!db.prepare("SELECT id FROM attempts WHERE session_id = ? AND item_id = ?").get(sessionId, current.item_id)) throw new Error("Submit or pause before moving on");
  const next = chooseItem(db, current.concept_id, session.mode);
  if (!next) {
    db.prepare("UPDATE sessions SET ended_at = ? WHERE id = ?").run(new Date().toISOString(), sessionId);
    return "exhausted";
  }
  db.prepare("INSERT INTO assistance_events (id, student_id, item_id, item_version, session_id, kind, happened_at) VALUES (?, ?, ?, ?, ?, 'presented', ?)")
    .run(randomUUID(), DEMO_STUDENT_ID, next.id, next.version, sessionId, new Date().toISOString());
  return "advanced";
}
