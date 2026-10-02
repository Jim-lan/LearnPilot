import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prepareDataRoot } from "../src/server/data-root";

test("private data uses a configured root outside source and creates required directories", () => {
  const temp = mkdtempSync(join(tmpdir(), "learnpilot-path-"));
  try {
    mkdirSync(join(temp, "source"));
    const paths = prepareDataRoot(join(temp, "private"), join(temp, "source"));
    assert.equal(paths.root, realpathSync(join(temp, "private")));
    assert.equal(paths.database, join(paths.root, "learnpilot.sqlite"));
    assert.match(paths.attachments, /attachments$/);
    assert.match(paths.backups, /backups$/);
  } finally { rmSync(temp, { recursive: true, force: true }); }
});

test("private data refuses relative, source-contained, and non-directory paths", () => {
  const temp = mkdtempSync(join(tmpdir(), "learnpilot-path-"));
  try {
    mkdirSync(join(temp, "source"));
    assert.throws(() => prepareDataRoot("relative/path", temp), /absolute/);
    assert.throws(() => prepareDataRoot(join(temp, "data"), temp), /inside the project/);
    const file = join(temp, "file");
    writeFileSync(file, "x");
    assert.throws(() => prepareDataRoot(file, join(temp, "source")));
  } finally { rmSync(temp, { recursive: true, force: true }); }
});
