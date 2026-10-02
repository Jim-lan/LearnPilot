import { test } from "node:test";
import assert from "node:assert/strict";
import { demoPack } from "../src/domain/demo-content";
import { scoreNumber } from "../src/domain/scoring";

test("all 24 checked demo keys score as correct and eight remain reserved", () => {
  assert.equal(demoPack.items.length, 24);
  assert.equal(demoPack.items.filter(item => item.mode === "reassessment").length, 8);
  for (const item of demoPack.items) assert.equal(scoreNumber(`${item.answer.value} ${item.answer.unit}`, item.answer, false).status, "correct", item.id);
});

test("scoring handles equivalent units, wrong units, invalid input and support honestly", () => {
  const current = { kind: "number" as const, value: 2, unit: "A", tolerance: 0.001 };
  assert.equal(scoreNumber("2000 mA", current, false).status, "correct");
  assert.equal(scoreNumber("2 V", current, false).status, "wrong_unit");
  assert.equal(scoreNumber("2", current, false).status, "missing_unit");
  assert.equal(scoreNumber("1+1 A", current, false).status, "invalid");
  assert.equal(scoreNumber("2.002 A", current, false).status, "wrong_value");
  assert.match(scoreNumber("2 A", current, true).feedback, /with support/);
  assert.doesNotMatch(scoreNumber("2 A", current, false).feedback, /mastered|expert/i);
});
