"use server";

import { redirect } from "next/navigation";
import { demoPack } from "@/domain/demo-content";
import { createSession } from "@/server/session-store";
import { getDb } from "@/server/db";
import { summarizeLearning } from "@/domain/learning";
import { loadObservations } from "@/server/learning-store";

export async function startSession(form: FormData) {
  const conceptId = String(form.get("conceptId") ?? "");
  const mode = String(form.get("mode") ?? "practice");
  if (!demoPack.concepts.some(concept => concept.id === conceptId) || !["practice", "reassessment"].includes(mode)) throw new Error("Invalid session choice");
  const db = getDb();
  const student = db.prepare("SELECT id FROM students WHERE id = 'demo:student:local'").get();
  if (!student) redirect("/setup");
  if (mode === "reassessment" && !summarizeLearning(loadObservations(db, "demo:student:local", conceptId)).reviewDue) {
    redirect(`/today?concept=${encodeURIComponent(conceptId)}&notice=not-due`);
  }
  const id = createSession(db, conceptId, mode as "practice" | "reassessment", mode === "reassessment" ? "A later check is due" : "A short focused practice step");
  if (!id) redirect(`/today?concept=${encodeURIComponent(conceptId)}&notice=no-fresh-item`);
  redirect(`/session?id=${encodeURIComponent(id)}`);
}
