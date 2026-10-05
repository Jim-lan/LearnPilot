import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase } from "../src/server/db";

test("migrations survive restart, enforce references, and roll back failed work", () => {
  const dir = mkdtempSync(join(tmpdir(), "learnpilot-db-"));
  const file = join(dir, "test.sqlite");
  try {
    let db = openDatabase(file);
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM schema_migrations").get() as { n: number }).n, 9);
    assert.throws(() => db.prepare("INSERT INTO attempts (id, student_id, item_id, item_version, answer, score_status, assistance_status, prior_exposure, idempotency_key, submitted_at) VALUES ('a', 'missing', 'missing', 1, '1', 'pending', 'unknown', 0, 'k', '2026-01-01')").run(), /FOREIGN KEY/);
    const now = new Date().toISOString();
    db.prepare("INSERT INTO students (id, display_name, environment, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run("student-1", "Demo", "synthetic_demo", now, now);
    assert.throws(() => db.transaction(() => {
      db.prepare("INSERT INTO students (id, display_name, environment, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run("student-2", "Demo 2", "synthetic_demo", now, now);
      throw new Error("interrupt");
    })(), /interrupt/);
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM students").get() as { n: number }).n, 1);
    db.close();
    db = openDatabase(file);
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM students").get() as { n: number }).n, 1);
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM schema_migrations").get() as { n: number }).n, 9);
    assert.equal((db.pragma("foreign_keys", { simple: true }) as number), 1);
    db.close();
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
