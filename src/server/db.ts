import Database from "better-sqlite3";
import { prepareDataRoot } from "./data-root";
import { migrations } from "./migrations";

export type LearnPilotDatabase = Database.Database;
let shared: LearnPilotDatabase | undefined;

export function openDatabase(file: string): LearnPilotDatabase {
  const db = new Database(file);
  try {
    db.pragma("foreign_keys = ON");
    db.pragma("journal_mode = WAL");
    db.exec("CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL) STRICT");
    const applied = new Set((db.prepare("SELECT version FROM schema_migrations").all() as { version: number }[]).map(row => row.version));
    const newestKnown = migrations.at(-1)?.version ?? 0;
    if ([...applied].some(version => version > newestKnown)) throw new Error("Database schema is newer than this application");
    for (const migration of migrations) {
      if (applied.has(migration.version)) continue;
      db.transaction(() => {
        db.exec(migration.sql);
        db.prepare("INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)")
          .run(migration.version, migration.name, new Date().toISOString());
      }).immediate();
    }
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

export function getDb(): LearnPilotDatabase {
  if (!shared) shared = openDatabase(prepareDataRoot().database);
  return shared;
}
