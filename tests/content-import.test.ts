import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { demoPack } from "../src/domain/demo-content";
import { importDemoPack } from "../src/server/content-import";
import { openDatabase } from "../src/server/db";

test("versioned demo content imports once and preserves referenced earlier version", () => {
  const dir = mkdtempSync(join(tmpdir(), "learnpilot-content-"));
  const db = openDatabase(join(dir, "db.sqlite"));
  try {
    assert.equal(importDemoPack(db), "imported");
    assert.equal(importDemoPack(db), "already_present");
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM items").get() as { n: number }).n, 24);
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM concepts").get() as { n: number }).n, 4);
    const now = new Date().toISOString();
    db.prepare("INSERT INTO students (id, display_name, environment, created_at, updated_at) VALUES ('s1', 'Demo', 'synthetic_demo', ?, ?)").run(now, now);
    db.prepare("INSERT INTO evidence (id, student_id, source_type, status, created_at) VALUES ('e1', 's1', 'manual', 'draft', ?)").run(now);
    db.prepare("INSERT INTO evidence_revisions (id, evidence_id, revision_number, concept_id, response, mark_origin, assistance_status, review_status, created_at) VALUES ('r1', 'e1', 1, 'demo:units', '500 mA', 'none', 'unknown', 'draft', ?)").run(now);
    const next = { ...demoPack, version: "0.2.0", resources: demoPack.resources.map(r => ({ ...r, id: `${r.id}:v2` })), items: demoPack.items.map(i => ({ ...i, id: `${i.id}:v2` })) };
    assert.equal(importDemoPack(db, next), "imported");
    assert.equal((db.prepare("SELECT COUNT(*) AS n FROM content_packs").get() as { n: number }).n, 2);
    assert.equal((db.prepare("SELECT response FROM evidence_revisions WHERE id = 'r1'").get() as { response: string }).response, "500 mA");
    assert.throws(() => importDemoPack(db, { ...demoPack, title: "Changed without version" }), /conflict/);
    assert.throws(() => importDemoPack(db, { ...demoPack, concepts: [{ ...demoPack.concepts[0], prerequisites: ["missing"] }, ...demoPack.concepts.slice(1)] }), /Broken concept/);
  } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
});
