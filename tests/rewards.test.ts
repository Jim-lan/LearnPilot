import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { openDatabase } from "../src/server/db";
import { migrations } from "../src/server/migrations";
import { importDemoPack } from "../src/server/content-import";
import { advanceSession, createSession, recordAssistance, submitAttempt } from "../src/server/session-store";
import { awardCorrectAnswer, attemptReward, rewardTotals } from "../src/server/rewards";

const student = "demo:student:local";

test("points survive restart, deduplicate submissions, include supported success and exclude wrong answers", () => {
  const dir = mkdtempSync(join(tmpdir(), "learnpilot-rewards-"));
  const file = join(dir, "data.sqlite");
  let db = openDatabase(file);
  try {
    importDemoPack(db);
    db.prepare("INSERT INTO students (id, display_name, environment, created_at, updated_at) VALUES (?, 'Demo', 'synthetic_demo', '2026-10-05', '2026-10-05')").run(student);
    const session = createSession(db, "demo:student:local", "demo:units", "practice", "Reward check")!;
    recordAssistance(db, "demo:student:local", session, "hint");
    const id = submitAttempt(db, "demo:student:local", session, "500 mA", "reward-1");
    awardCorrectAnswer(db, id);
    assert.equal(submitAttempt(db, "demo:student:local", session, "500 mA", "reward-1"), id);
    assert.equal(submitAttempt(db, "demo:student:local", session, "500 mA", "another-device-submit"), id);
    assert.equal(attemptReward(db, id), 10);
    assert.deepEqual(rewardTotals(db, student), { points: 10, correctAnswers: 1 });
    assert.equal((db.prepare("SELECT assistance_status FROM attempts WHERE id = ?").get(id) as { assistance_status: string }).assistance_status, "recorded_assisted");
    advanceSession(db, "demo:student:local", session, "demo:item:u01");
    assert.throws(() => submitAttempt(db, "demo:student:local", session, "500 mA", "stale-tab", "demo:item:u01"), /moved/);
    assert.throws(() => recordAssistance(db, "demo:student:local", session, "hint", "demo:item:u01"), /moved/);
    assert.throws(() => advanceSession(db, "demo:student:local", session, "demo:item:u01"), /moved/);
    assert.equal(rewardTotals(db, student).points, 10);
    const wrongSession = createSession(db, "demo:student:local", "demo:units", "practice", "Wrong answer")!;
    const wrong = submitAttempt(db, "demo:student:local", wrongSession, "999 A", "reward-wrong");
    assert.equal(attemptReward(db, wrong), 0);
    assert.deepEqual(rewardTotals(db, "different-student"), { points: 0, correctAnswers: 0 });
    db.close(); db = openDatabase(file);
    assert.deepEqual(rewardTotals(db, student), { points: 10, correctAnswers: 1 });
    // A withdrawn score must not continue contributing rewards.
    db.prepare("UPDATE attempts SET score_status = 'pending' WHERE id = ?").run(id);
    assert.equal(rewardTotals(db, student).points, 0);
    db.prepare("DELETE FROM attempts WHERE id = ?").run(id);
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM reward_awards").get() as { n: number }).n, 0);
  } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
});

test("schema 7 upgrades give existing checked correct answers one reward without rewriting observations", () => {
  const dir = mkdtempSync(join(tmpdir(), "learnpilot-reward-migration-"));
  const file = join(dir, "data.sqlite");
  let db = new Database(file);
  try {
    db.exec("CREATE TABLE schema_migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL) STRICT");
    for (const migration of migrations.filter(m => m.version < 8)) {
      db.exec(migration.sql);
      db.prepare("INSERT INTO schema_migrations VALUES (?, ?, '2026-10-02')").run(migration.version, migration.name);
    }
    importDemoPack(db);
    db.prepare("INSERT INTO students (id, display_name, environment, created_at, updated_at) VALUES (?, 'Demo', 'synthetic_demo', '2026-10-02', '2026-10-02')").run(student);
    db.prepare(`INSERT INTO attempts (id, student_id, item_id, item_version, answer, score_status, score_source, assistance_status, prior_exposure, idempotency_key, submitted_at)
      VALUES (?, ?, 'demo:item:u01', 1, '500 mA', 'correct', 'deterministic-v0.1', 'known_none', 0, ?, '2026-10-02')`).run('old-1', student, 'old-1');
    db.prepare("INSERT INTO attempts SELECT 'old-2', student_id, session_id, item_id, item_version, answer, score_status, score_value, assistance_status, prior_exposure, 'old-2', submitted_at, feedback_text, score_source FROM attempts WHERE id = 'old-1'").run();
    db.close(); db = openDatabase(file);
    assert.equal(rewardTotals(db, student).points, 10);
    db.close(); db = openDatabase(file);
    assert.equal(rewardTotals(db, student).points, 10);
    assert.equal((db.prepare("SELECT answer FROM attempts WHERE id = 'old-1'").get() as { answer: string }).answer, "500 mA");
  } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
});
