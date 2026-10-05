"use server";

import { redirect } from "next/navigation";
import { findLearnerConcept } from "@/domain/family-catalog";
import { createSession } from "@/server/session-store";
import { getDb } from "@/server/db";
import { summarizeLearning } from "@/domain/learning";
import { loadObservations } from "@/server/learning-store";
import { selectedLearner } from "@/server/learner";

export async function startSession(form: FormData) {
  const conceptId = String(form.get("conceptId") ?? "");
  const mode = String(form.get("mode") ?? "practice");
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const entry = findLearnerConcept(learner.key, conceptId);
  if (!entry || !["practice", "reassessment"].includes(mode)) throw new Error("Invalid session choice");
  const db = getDb();
  const student = db.prepare("SELECT id FROM students WHERE id = ?").get(learner.id);
  if (!student) redirect("/setup");
  if (mode === "reassessment" && !summarizeLearning(loadObservations(db, learner.id, conceptId)).reviewDue) {
    redirect(`/today?subject=${entry.subject}&concept=${encodeURIComponent(conceptId)}&notice=not-due`);
  }
  const id = createSession(db, learner.id, conceptId, mode as "practice" | "reassessment", mode === "reassessment" ? "A later check is due" : "A short focused practice step");
  if (!id) redirect(`/today?subject=${entry.subject}&concept=${encodeURIComponent(conceptId)}&notice=no-fresh-item`);
  redirect(`/session?id=${encodeURIComponent(id)}`);
}
