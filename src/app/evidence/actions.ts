"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/server/db";
import { correctManualEvidence, publishManualEvidence, saveManualDraft } from "@/server/evidence-store";
import { selectedLearner } from "@/server/learner";
import { findLearnerConcept } from "@/domain/family-catalog";

async function learnerForConcept(conceptId: string) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  if (!findLearnerConcept(learner.key, conceptId)) throw new Error("Topic does not belong to this learner");
  return learner;
}

export async function saveEvidence(form: FormData) {
  const learner = await learnerForConcept(String(form.get("conceptId") ?? ""));
  saveManualDraft(getDb(), {
    evidenceId: String(form.get("evidenceId") ?? "") || undefined,
    conceptId: String(form.get("conceptId") ?? ""),
    question: String(form.get("question") ?? ""),
    response: String(form.get("response") ?? ""),
    teacherMark: String(form.get("teacherMark") ?? ""),
    locator: String(form.get("locator") ?? ""),
    sourceDescription: String(form.get("sourceDescription") ?? ""),
  }, learner.id);
  redirect("/evidence");
}

export async function publishEvidence(form: FormData) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const result = String(form.get("result") ?? "unclear");
  if (!["correct", "incorrect", "unclear"].includes(result)) throw new Error("Invalid review result");
  publishManualEvidence(getDb(), String(form.get("evidenceId") ?? ""), result as "correct" | "incorrect" | "unclear", learner.id);
  redirect("/evidence");
}

export async function correctEvidence(form: FormData) {
  const learner = await learnerForConcept(String(form.get("conceptId") ?? ""));
  const result = String(form.get("result") ?? "unclear");
  if (!["correct", "incorrect", "unclear"].includes(result)) throw new Error("Invalid review result");
  correctManualEvidence(getDb(), String(form.get("evidenceId") ?? ""), String(form.get("expectedRevisionId") ?? ""), {
    conceptId: String(form.get("conceptId") ?? ""),
    question: String(form.get("question") ?? ""),
    response: String(form.get("response") ?? ""),
    teacherMark: String(form.get("teacherMark") ?? ""),
    locator: String(form.get("locator") ?? ""),
    sourceDescription: String(form.get("sourceDescription") ?? ""),
  }, result as "correct" | "incorrect" | "unclear", String(form.get("reason") ?? ""), learner.id);
  redirect("/evidence");
}
