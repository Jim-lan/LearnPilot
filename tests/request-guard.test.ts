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

test("backend accepts only the explicitly configured LAN authority and matching mutation origin", () => {
  const host = "192.168.2.182:3000";
  assert.equal(checkLocalRequest("GET", host, null), "Unexpected host");
  assert.equal(checkLocalRequest("POST", host, `http://${host}`, host), null);
  assert.ok(checkLocalRequest("POST", host, "http://192.168.2.183:3000", host));
  assert.ok(checkLocalRequest("POST", host, `http://${host}/unexpected`, host));
  assert.ok(checkLocalRequest("GET", "8.8.8.8:3000", null, "8.8.8.8:3000"));
});
