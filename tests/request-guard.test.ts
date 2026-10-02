import { test } from "node:test";
import assert from "node:assert/strict";
import { checkLocalRequest } from "../src/server/request-guard";

test("local requests allow loopback and same-origin changes", () => {
  assert.equal(checkLocalRequest("GET", "127.0.0.1:3000", null), null);
  assert.equal(checkLocalRequest("POST", "127.0.0.1:3000", "http://127.0.0.1:3000"), null);
});

test("host and origin checks refuse off-device and cross-site mutations", () => {
  assert.match(checkLocalRequest("GET", "learnpilot.example", null)!, /host/);
  assert.match(checkLocalRequest("POST", "127.0.0.1:3000", "https://evil.example")!, /origin/);
  assert.match(checkLocalRequest("POST", "127.0.0.1:3000", null)!, /Origin/);
  assert.match(checkLocalRequest("POST", "127.0.0.1:3000", "http://localhost:3000")!, /origin/);
  assert.match(checkLocalRequest("GET", "127.0.0.1:99999", null)!, /port/);
});
