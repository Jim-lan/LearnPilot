import { test } from "node:test";
import assert from "node:assert/strict";
import { DisabledModelAdapter, FakeModelAdapter, runModelOperation, type ModelAdapter, type ModelInput } from "../src/server/model";

const input: ModelInput = { operationId: "op-1", category: "explain_draft", text: "Synthetic example", allowedConceptIds: ["demo:circuits"], allowedSourceIds: ["source-1"] };

test("fake adapter is repeatable and returns only draft references", async () => {
  const adapter = new FakeModelAdapter();
  const first = await runModelOperation(adapter, input);
  const second = await runModelOperation(adapter, input);
  assert.deepEqual(first, second);
  assert.equal(first.status, "succeeded");
  if (first.status === "succeeded") {
    assert.equal(first.draft.reviewStatus, "draft");
    assert.deepEqual(first.draft.conceptIds, ["demo:circuits"]);
  }
});

test("disabled, malformed, invented-reference and interrupted operations stay explicit", async () => {
  assert.equal((await runModelOperation(new DisabledModelAdapter(), input)).status, "unavailable");
  const malformed: ModelAdapter = { version: "bad", async generate() { return { text: 123 }; } };
  assert.equal((await runModelOperation(malformed, input)).status, "invalid_output");
  const invented: ModelAdapter = { version: "bad", async generate() { return { schemaVersion: "0.1", adapterVersion: "bad", text: "guess", conceptIds: ["invented"], sourceIds: [], reviewStatus: "draft" }; } };
  assert.equal((await runModelOperation(invented, input)).status, "invalid_output");
  const controller = new AbortController(); controller.abort();
  assert.equal((await runModelOperation(new FakeModelAdapter(), input, controller.signal)).status, "interrupted");
  assert.equal((await runModelOperation(new FakeModelAdapter(), input)).operationId, "op-1");
});
