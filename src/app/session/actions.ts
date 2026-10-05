"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/server/db";
import { advanceSession, enableOutsideHelp, recordAssistance, submitAttempt } from "@/server/session-store";
import { selectedLearner } from "@/server/learner";

function expectedItem(form: FormData): string {
  const item = String(form.get("itemId") ?? "");
  if (!item || item.length > 150) throw new Error("Refresh this question before continuing");
  return item;
}

export async function useHint(form: FormData) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const id = String(form.get("sessionId") ?? "");
  recordAssistance(getDb(), learner.id, id, "hint", expectedItem(form));
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function revealSolution(form: FormData) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const id = String(form.get("sessionId") ?? "");
  recordAssistance(getDb(), learner.id, id, "solution", expectedItem(form));
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function useOutsideHelp(form: FormData) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const id = String(form.get("sessionId") ?? "");
  enableOutsideHelp(getDb(), learner.id, id, expectedItem(form));
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function submitAnswer(form: FormData) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const id = String(form.get("sessionId") ?? "");
  const answer = String(form.get("answer") ?? "");
  const attemptId = submitAttempt(getDb(), learner.id, id, answer, String(form.get("submissionKey") ?? ""), expectedItem(form));
  redirect(`/session?id=${encodeURIComponent(id)}&celebrate=${encodeURIComponent(attemptId)}`);
}

export async function nextQuestion(form: FormData) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const id = String(form.get("sessionId") ?? "");
  const result = advanceSession(getDb(), learner.id, id, expectedItem(form));
  if (result === "exhausted") redirect("/progress?notice=bank-exhausted");
  redirect(`/session?id=${encodeURIComponent(id)}`);
}

export async function pauseSession(form: FormData) {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const id = String(form.get("sessionId") ?? "");
  const db = getDb();
  const session = db.prepare("SELECT p.concept_id FROM sessions s JOIN study_plans p ON p.id = s.plan_id WHERE s.id = ? AND s.student_id = ? AND s.ended_at IS NULL").get(id, learner.id) as { concept_id: string } | undefined;
  if (!session) throw new Error("Active session not found");
  redirect("/subjects");
}
