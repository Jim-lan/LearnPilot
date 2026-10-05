import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findLearnerConcept } from "../src/domain/family-catalog";
import { rulePack } from "../src/domain/rule-content";
import { scoreAnswer } from "../src/domain/scoring";
import { importDemoPack } from "../src/server/content-import";
import { openDatabase } from "../src/server/db";
import { loadObservations } from "../src/server/learning-store";
import { rewardTotals } from "../src/server/rewards";
import { advanceSession, chooseItem, createSession, submitAttempt } from "../src/server/session-store";

test("Vincent can try an original rule, learn from feedback, and keep a separate later check", () => {
  const dir = mkdtempSync(join(tmpdir(), "learnpilot-rules-"));
  const file = join(dir, "data.sqlite");
  let db = openDatabase(file);
  const vincent = "demo:student:vincent";
  const alex = "demo:student:alex";
  try {
    assert.equal(importDemoPack(db, rulePack), "imported");
    assert.equal(importDemoPack(db, rulePack), "already_present");
    assert.equal(findLearnerConcept("vincent", "demo:rule-repeating")?.subject, "math");
    assert.equal(findLearnerConcept("alex", "demo:rule-repeating"), null);
    for (const [id, name] of [[vincent, "Vincent"], [alex, "Alex"]]) {
      db.prepare("INSERT INTO students (id, display_name, environment, created_at, updated_at) VALUES (?, ?, 'synthetic_demo', '2026-10-05', '2026-10-05')").run(id, name);
    }
    const session = createSession(db, vincent, "demo:rule-repeating", "practice", "Find a repeating rule")!;
    const first = chooseItem(db, vincent, "demo:rule-repeating", "practice")!;
    assert.equal(first.id, "demo:item:rule-repeat-2");
    const firstItem = rulePack.items.find(item => item.id === "demo:item:rule-repeat-1")!;
    assert.equal(scoreAnswer("Red–red", firstItem.answer, false).status, "wrong_value");
    const wrong = submitAttempt(db, vincent, session, "Red–red", "rule-wrong", firstItem.id);
    const feedback = db.prepare("SELECT score_status, feedback_text FROM attempts WHERE id = ?").get(wrong) as { score_status: string; feedback_text: string };
    assert.equal(feedback.score_status, "wrong_value");
    assert.match(feedback.feedback_text, /red–blue repeats/);
    assert.equal(rewardTotals(db, vincent).points, 0);
    assert.equal(advanceSession(db, vincent, session, firstItem.id), "advanced");
    const secondItem = rulePack.items.find(item => item.id === "demo:item:rule-repeat-2")!;
    const right = submitAttempt(db, vincent, session, "Clap", "rule-right", secondItem.id);
    assert.equal((db.prepare("SELECT score_status FROM attempts WHERE id = ?").get(right) as { score_status: string }).score_status, "correct");
    assert.equal(rewardTotals(db, vincent).points, 10);
    assert.equal(rewardTotals(db, alex).points, 0);
    assert.equal(loadObservations(db, vincent, "demo:rule-repeating").length, 2);
    assert.equal(loadObservations(db, alex, "demo:rule-repeating").length, 0);
    assert.equal(advanceSession(db, vincent, session, secondItem.id), "exhausted");
    assert.equal(chooseItem(db, vincent, "demo:rule-repeating", "reassessment")?.id, "demo:item:rule-repeat-check");
    db.close();
    db = openDatabase(file);
    assert.equal(loadObservations(db, vincent, "demo:rule-repeating").length, 2);
    assert.equal(rewardTotals(db, vincent).points, 10);
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
