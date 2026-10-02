"use server";

import { redirect } from "next/navigation";
import { demoPack } from "@/domain/demo-content";
import { parseSetup } from "@/domain/setup";
import { importDemoPack } from "@/server/content-import";
import { getDb } from "@/server/db";
import { rebuildSummary } from "@/server/learning-store";

export async function saveSetup(form: FormData) {
  const choice = parseSetup(form);
  const coverage = demoPack.concepts.map(concept => {
    const value = String(form.get(`coverage:${concept.id}`) ?? "unknown");
    if (!["unknown", "not_yet", "in_progress", "covered"].includes(value)) throw new Error("Invalid coverage choice");
    return { conceptId: concept.id, value };
  });
  const db = getDb();
  importDemoPack(db);
  db.transaction(() => {
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO students (id, display_name, environment, course_id, unit_id, goal, minutes_available, preferred_format, assessment_date, created_at, updated_at)
      VALUES ('demo:student:local', ?, 'synthetic_demo', 'SNC1W', 'circuits', ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET display_name=excluded.display_name, goal=excluded.goal, minutes_available=excluded.minutes_available, preferred_format=excluded.preferred_format, assessment_date=excluded.assessment_date, updated_at=excluded.updated_at`)
      .run(choice.displayName, choice.goal, choice.minutes, choice.preferredFormat, choice.assessmentDate, now, now);
    const latest = db.prepare("SELECT state FROM coverage_observations WHERE student_id = ? AND concept_id = ? ORDER BY observed_at DESC, rowid DESC LIMIT 1");
    const insert = db.prepare("INSERT INTO coverage_observations (id, student_id, concept_id, state, origin, observed_at) VALUES (?, ?, ?, ?, 'student_report', ?)");
    for (const entry of coverage) {
      const previous = latest.get("demo:student:local", entry.conceptId) as { state: string } | undefined;
      if (previous?.state !== entry.value) insert.run(crypto.randomUUID(), "demo:student:local", entry.conceptId, entry.value, now);
      rebuildSummary(db, "demo:student:local", entry.conceptId);
    }
  }).immediate();
  redirect("/today");
}
