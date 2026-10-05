import { test } from "node:test";
import assert from "node:assert/strict";
import { learnerNamedIn } from "../src/domain/voice-choice";

test("spoken profile selection needs one unambiguous name", () => {
  assert.equal(learnerNamedIn("Hi, I am Vincent."), "vincent");
  assert.equal(learnerNamedIn("My name is Alex"), "alex");
  assert.equal(learnerNamedIn("Alex and Vincent"), null);
  assert.equal(learnerNamedIn("I am Alexander"), null);
  assert.equal(learnerNamedIn("I don't know"), null);
});
