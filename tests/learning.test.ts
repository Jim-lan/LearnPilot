import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeLearning, type Observation } from "../src/domain/learning";

const at = "2026-01-01T12:00:00.000Z";
const observation = (patch: Partial<Observation> = {}): Observation => ({ id: "a1", result: "correct", assistance: "known_none", unseen: true, observedAt: at, ...patch });

test("summaries distinguish no work, independent item, support, mixed evidence, and review due", () => {
  assert.equal(summarizeLearning([]).observedResult, "insufficient");
  const fresh = summarizeLearning([observation()], new Date("2026-01-02T11:59:59Z"));
  assert.equal(fresh.observedResult, "correct_item");
  assert.equal(fresh.reviewDue, false);
  assert.equal(summarizeLearning([observation()], new Date("2026-01-03T12:00:00Z")).reviewDue, true);
  assert.equal(summarizeLearning([observation({ assistance: "recorded_assisted" })]).observedResult, "supported_correct");
  assert.equal(summarizeLearning([observation({ assistance: "unknown", unseen: false })]).assistance, "unknown");
  assert.equal(summarizeLearning([observation(), observation({ id: "a2", result: "incorrect", observedAt: "2026-01-04T12:00:00Z" })]).observedResult, "mixed");
  assert.equal(summarizeLearning([observation({ result: "unknown" })]).sufficiency, "none");
});
