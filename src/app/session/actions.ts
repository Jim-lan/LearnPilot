"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/server/db";
import { advanceSession, recordAssistance, submitAttempt } from "@/server/session-store";

export async function useHint(form: FormData) {
  const id = String(form.get("sessionId") ?? "");
  recordAssistance(getDb(), id, "hint");
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function revealSolution(form: FormData) {
  const id = String(form.get("sessionId") ?? "");
  recordAssistance(getDb(), id, "solution");
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function submitAnswer(form: FormData) {
  const id = String(form.get("sessionId") ?? "");
  const answer = String(form.get("answer") ?? "");
  const externalHelp = String(form.get("externalHelp") ?? "unsure");
  if (!["none", "yes", "unsure"].includes(externalHelp)) throw new Error("Choose whether outside help was used");
  submitAttempt(getDb(), id, answer, externalHelp as "none" | "yes" | "unsure", String(form.get("submissionKey") ?? ""));
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function nextQuestion(form: FormData) {
  const id = String(form.get("sessionId") ?? "");
  const result = advanceSession(getDb(), id);
  if (result === "exhausted") redirect("/progress?notice=bank-exhausted");
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function pauseSession(form: FormData) {
  const id = String(form.get("sessionId") ?? "");
  const db = getDb();
  if (!db.prepare("SELECT id FROM sessions WHERE id = ? AND student_id = 'demo:student:local' AND ended_at IS NULL").get(id)) throw new Error("Active session not found");
  redirect("/today");
}
