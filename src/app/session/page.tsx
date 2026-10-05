import Link from "next/link";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import type { AnswerKey } from "@/domain/demo-content";
import { findLearnerConcept, frenchExamples } from "@/domain/family-catalog";
import { getDb } from "@/server/db";
import { selectedLearner } from "@/server/learner";
import { nextQuestion, pauseSession, revealSolution, submitAnswer, useHint, useOutsideHelp } from "./actions";
import { attemptReward, rewardTotals } from "@/server/rewards";
import { RewardSummary } from "../components/reward-summary";
import { AnswerCelebration } from "../components/answer-celebration";
import { SpeakFrench } from "../components/speak-french";

export const dynamic = "force-dynamic";

function displayAnswer(key: AnswerKey) {
  return key.kind === "text" ? key.display : `${key.value} ${key.unit}`;
}

export default async function SessionPage({ searchParams }: { searchParams: Promise<{ id?: string; celebrate?: string }> }) {
  const { id, celebrate } = await searchParams;
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  if (!id) return <div className="page"><h1>No session yet.</h1><Link className="button" href="/subjects">Choose a subject</Link></div>;
  const db = getDb();
  const session = db.prepare("SELECT s.mode, s.ended_at, s.outside_help_active, p.status AS plan_status FROM sessions s LEFT JOIN study_plans p ON p.id = s.plan_id WHERE s.id = ? AND s.student_id = ?").get(id, learner.id) as { mode: string; ended_at: string | null; outside_help_active: number; plan_status: string | null } | undefined;
  if (!session) return <div className="page"><h1>Session not found in {learner.name}’s profile.</h1><Link className="button" href="/subjects">Choose a subject</Link></div>;
  const item = db.prepare(`SELECT i.id, i.version, i.prompt, i.hint, i.concept_id, i.answer_json, c.title AS concept_title
    FROM assistance_events e JOIN items i ON i.id = e.item_id AND i.version = e.item_version
    JOIN concepts c ON c.id = i.concept_id AND c.pack_id = i.pack_id AND c.pack_version = i.pack_version
    WHERE e.session_id = ? AND e.kind = 'presented' ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`).get(id) as { id: string; version: number; prompt: string; hint: string; concept_id: string; concept_title: string; answer_json: string } | undefined;
  if (!item) return <div className="page"><h1>Session has no question.</h1><Link href="/subjects">Choose a subject</Link></div>;
  const group = findLearnerConcept(learner.key, item.concept_id);
  if (!group) return <div className="page"><h1>Topic is not available in this profile.</h1><Link href="/subjects">Choose a subject</Link></div>;
  const back = `/today?subject=${group.subject}&concept=${encodeURIComponent(item.concept_id)}`;
  const events = db.prepare("SELECT kind FROM assistance_events WHERE session_id = ? AND item_id = ?").all(id, item.id) as { kind: string }[];
  const hinted = events.some(e => e.kind === "hint");
  const revealed = events.some(e => e.kind === "solution");
  const attempt = db.prepare("SELECT id, answer, score_status, feedback_text, assistance_status, prior_exposure FROM attempts WHERE session_id = ? AND item_id = ? ORDER BY submitted_at DESC LIMIT 1").get(id, item.id) as { id: string; answer: string; score_status: string; feedback_text: string | null; assistance_status: string; prior_exposure: number } | undefined;
  const points = attempt ? attemptReward(db, attempt.id) : 0;
  const answerKey = JSON.parse(item.answer_json) as AnswerKey;
  const french = frenchExamples[item.concept_id];
  return <div className="page"><p className="eyebrow">{learner.name} · {session.mode === "reassessment" ? "Fresh later check" : "Focused practice"}</p><h1>{item.concept_title}</h1><p className="lead">{item.prompt}</p>
    <RewardSummary {...rewardTotals(db, learner.id)} />
    {attempt && points > 0 && <AnswerCelebration key={attempt.id} attemptId={attempt.id} points={points} animate={celebrate === attempt.id} />}
    <p><Link className="text-link" href={back}>← Topic</Link></p>
    {session.outside_help_active ? <div className="notice"><strong>Outside help is on for this quiz.</strong> Answers submitted after it was turned on are recorded as assisted. Your points still count.</div> : !session.ended_at && session.plan_status !== "stale" && !attempt && <form action={useOutsideHelp} className="help-once"><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button className="secondary-button" type="submit">I’m using outside help for this quiz</button><p className="muted">Tap once if you use a person, video, website, or other help. It stays on for the rest of this quiz.</p></form>}
    {french && <div className="audio-card"><SpeakFrench label="Hear a word" value={french.word} /><SpeakFrench label="Hear a sentence" value={french.sentence} /><p className="muted">Listening is support; this app does not score pronunciation.</p></div>}
    {session.ended_at && <div className="notice">This session is closed. Your saved answer remains below.</div>}
    {session.plan_status === "stale" && <div className="notice">The evidence behind this plan changed. Choose a refreshed next step before submitting more work.</div>}
    {hinted && <div className="notice"><strong>Hint:</strong> {item.hint}</div>}
    {revealed && <div className="notice"><strong>Solution:</strong> {displayAnswer(answerKey)}. A revealed answer cannot count as independent evidence.</div>}
    {attempt ? <article className="feature-card"><span className="tag">Saved answer · {attempt.score_status}</span><h2>{attempt.answer}</h2><p>{attempt.feedback_text ?? "Your answer was saved; scoring is pending."}</p><p className="muted">{attempt.assistance_status === "known_none" && !attempt.prior_exposure ? "No support was recorded for this fresh item." : "Support or prior exposure is recorded; this is not an independent check."}</p><p>Checked answer: {displayAnswer(answerKey)}</p>{!session.ended_at && session.plan_status !== "stale" && <form action={nextQuestion}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button className="button" type="submit">Try the next question</button></form>}</article>
    : session.ended_at || session.plan_status === "stale" ? <div className="feature-card"><p>This question cannot be submitted in the current session.</p><Link className="button" href={back}>Choose a refreshed session</Link></div>
    : <div className="feature-card"><span className="tag">{answerKey.kind === "number" ? "Answer with a number and unit" : "Write a short answer"}</span><form action={submitAnswer} className="answer-form"><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><input type="hidden" name="submissionKey" value={randomUUID()} /><label>Your answer<input name="answer" required maxLength={80} placeholder={answerKey.kind === "number" ? "For example: 2 A" : "Type your answer"} autoComplete="off" /></label><button className="button" type="submit">Save answer</button></form>
      <div className="inline-actions"><form action={useHint}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button type="submit" className="text-button">Show hint</button></form><form action={revealSolution}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button type="submit" className="text-button">Reveal solution</button></form><form action={pauseSession}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button type="submit" className="text-button">Pause</button></form></div>
    </div>}
    <p className="muted">Hints, solution views, and outside-help choices are saved with this quiz.</p>
  </div>;
}
