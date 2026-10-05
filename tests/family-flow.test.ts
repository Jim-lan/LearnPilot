import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { familyPack, findLearnerConcept, subjectsFor } from "../src/domain/family-catalog";
import { scoreAnswer } from "../src/domain/scoring";
import { importDemoPack } from "../src/server/content-import";
import { openDatabase } from "../src/server/db";
import { loadObservations } from "../src/server/learning-store";
import { rewardTotals } from "../src/server/rewards";
import { advanceSession, createSession, enableOutsideHelp, submitAttempt } from "../src/server/session-store";

test("family subjects, text keys, saved topic state and outside help stay with the chosen learner", () => {
  const dir = mkdtempSync(join(tmpdir(), "learnpilot-family-"));
  const file = join(dir, "data.sqlite");
  let db = openDatabase(file);
  try {
    assert.equal(importDemoPack(db, familyPack), "imported");
    assert.equal(importDemoPack(db, familyPack), "already_present");
    assert.deepEqual(subjectsFor("vincent").map(s => s.subject), ["math", "english", "french"]);
    assert.deepEqual(subjectsFor("alex").map(s => s.subject), ["science", "math", "english"]);
    assert.equal(findLearnerConcept("alex", "demo:g3-french-words"), null);
    for (const [id, name] of [["demo:student:vincent", "Vincent"], ["demo:student:alex", "Alex"]]) {
      db.prepare("INSERT INTO students (id, display_name, environment, created_at, updated_at) VALUES (?, ?, 'synthetic_demo', '2026-10-05', '2026-10-05')").run(id, name);
    }
    const vincent = "demo:student:vincent";
    const alex = "demo:student:alex";
    const first = createSession(db, vincent, "demo:g3-french-words", "practice", "French words")!;
    assert.throws(() => enableOutsideHelp(db, alex, first), /Session not found/);
    enableOutsideHelp(db, vincent, first);
    enableOutsideHelp(db, vincent, first);
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM assistance_events WHERE session_id = ? AND kind = 'reported_external'").get(first) as { n: number }).n, 1);
    const a1 = submitAttempt(db, vincent, first, "merci", "family-1");
    assert.throws(() => enableOutsideHelp(db, vincent, first), /already been submitted/);
    assert.equal((db.prepare("SELECT assistance_status FROM attempts WHERE id = ?").get(a1) as { assistance_status: string }).assistance_status, "recorded_assisted");
    assert.equal(advanceSession(db, vincent, first), "advanced");
    const a2 = submitAttempt(db, vincent, first, "au revoir", "family-2");
    assert.equal((db.prepare("SELECT assistance_status FROM attempts WHERE id = ?").get(a2) as { assistance_status: string }).assistance_status, "recorded_assisted");
    assert.equal(rewardTotals(db, vincent).points, 20);
    assert.equal(rewardTotals(db, alex).points, 0);
    assert.equal(loadObservations(db, vincent, "demo:g3-french-words").length, 2);
    assert.equal(loadObservations(db, alex, "demo:g3-french-words").length, 0);
    assert.equal((db.prepare("SELECT observed_result FROM learning_summaries WHERE student_id = ? AND concept_id = ?").get(vincent, "demo:g3-french-words") as { observed_result: string }).observed_result, "supported_correct");
    const alexSession = createSession(db, alex, "demo:g9-linear", "practice", "Equation")!;
    assert.throws(() => submitAttempt(db, vincent, alexSession, "5", "wrong-profile"), /Active session not found/);
    db.close();
    db = openDatabase(file);
    assert.equal((db.prepare("SELECT outside_help_active FROM sessions WHERE id = ?").get(first) as { outside_help_active: number }).outside_help_active, 1);
    assert.equal(rewardTotals(db, vincent).points, 20);
    assert.equal(loadObservations(db, vincent, "demo:g3-french-words").length, 2);
    const sentence = familyPack.items.find(item => item.id === "demo:item:g3-e01")!;
    assert.equal(scoreAnswer("The dog runs.", sentence.answer, false).status, "correct");
    assert.equal(scoreAnswer("the dog runs", sentence.answer, false).status, "wrong_value");
    const french = familyPack.items.find(item => item.id === "demo:item:g3-fs01")!;
    assert.equal(scoreAnswer("je suis à la maison", french.answer, false).status, "correct");
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
