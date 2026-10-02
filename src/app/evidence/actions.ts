"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/server/db";
import { correctManualEvidence, publishManualEvidence, saveManualDraft } from "@/server/evidence-store";

export async function saveEvidence(form: FormData) {
  saveManualDraft(getDb(), {
    evidenceId: String(form.get("evidenceId") ?? "") || undefined,
    conceptId: String(form.get("conceptId") ?? ""),
    question: String(form.get("question") ?? ""),
    response: String(form.get("response") ?? ""),
    teacherMark: String(form.get("teacherMark") ?? ""),
    locator: String(form.get("locator") ?? ""),
    sourceDescription: String(form.get("sourceDescription") ?? ""),
  });
  redirect("/evidence");
}

export async function publishEvidence(form: FormData) {
  const result = String(form.get("result") ?? "unclear");
  if (!["correct", "incorrect", "unclear"].includes(result)) throw new Error("Invalid review result");
  publishManualEvidence(getDb(), String(form.get("evidenceId") ?? ""), result as "correct" | "incorrect" | "unclear");
  redirect("/evidence");
}

export async function correctEvidence(form: FormData) {
  const result = String(form.get("result") ?? "unclear");
  if (!["correct", "incorrect", "unclear"].includes(result)) throw new Error("Invalid review result");
  correctManualEvidence(getDb(), String(form.get("evidenceId") ?? ""), String(form.get("expectedRevisionId") ?? ""), {
    conceptId: String(form.get("conceptId") ?? ""),
    question: String(form.get("question") ?? ""),
    response: String(form.get("response") ?? ""),
    teacherMark: String(form.get("teacherMark") ?? ""),
    locator: String(form.get("locator") ?? ""),
    sourceDescription: String(form.get("sourceDescription") ?? ""),
  }, result as "correct" | "incorrect" | "unclear", String(form.get("reason") ?? ""));
  redirect("/evidence");
}
