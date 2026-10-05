import Link from "next/link";
import { randomUUID } from "node:crypto";
import { getDb } from "@/server/db";
import { DEMO_STUDENT_ID } from "@/server/session-store";
import { nextQuestion, pauseSession, revealSolution, submitAnswer, useHint } from "./actions";
import { attemptReward, rewardTotals } from "@/server/rewards";
import { RewardSummary } from "../components/reward-summary";
import { AnswerCelebration } from "../components/answer-celebration";

export const dynamic = "force-dynamic";

export default async function SessionPage({ searchParams }: { searchParams: Promise<{ id?: string; celebrate?: string }> }) {
  const { id, celebrate } = await searchParams;
  if (!id) return <div className="page"><h1>No session yet.</h1><p className="lead">Choose one short activity from Today.</p><Link className="button" href="/today">Go to Today</Link></div>;
  const db = getDb();
  const session = db.prepare("SELECT s.mode, s.ended_at, p.status AS plan_status FROM sessions s LEFT JOIN study_plans p ON p.id = s.plan_id WHERE s.id = ? AND s.student_id = ?").get(id, DEMO_STUDENT_ID) as { mode: string; ended_at: string | null; plan_status: string | null } | undefined;
  if (!session) return <div className="page"><h1>Session not found.</h1><Link className="button" href="/today">Go to Today</Link></div>;
  const item = db.prepare(`SELECT i.id, i.version, i.prompt, i.hint, i.concept_id, c.title AS concept_title
    FROM assistance_events e JOIN items i ON i.id = e.item_id AND i.version = e.item_version
    JOIN concepts c ON c.id = i.concept_id AND c.pack_id = i.pack_id AND c.pack_version = i.pack_version
    WHERE e.session_id = ? AND e.kind = 'presented' ORDER BY e.happened_at DESC, e.rowid DESC LIMIT 1`).get(id) as { id: string; version: number; prompt: string; hint: string; concept_id: string; concept_title: string } | undefined;
  if (!item) return <div className="page"><h1>Session has no question.</h1><Link href="/today">Go to Today</Link></div>;
  const events = db.prepare("SELECT kind FROM assistance_events WHERE session_id = ? AND item_id = ?").all(id, item.id) as { kind: string }[];
  const hinted = events.some(e => e.kind === "hint");
  const revealed = events.some(e => e.kind === "solution");
  const attempt = db.prepare("SELECT id, answer, score_status, feedback_text, assistance_status, prior_exposure FROM attempts WHERE session_id = ? AND item_id = ? ORDER BY submitted_at DESC LIMIT 1").get(id, item.id) as { id: string; answer: string; score_status: string; feedback_text: string | null; assistance_status: string; prior_exposure: number } | undefined;
  const points = attempt ? attemptReward(db, attempt.id) : 0;
  const solution = revealed || attempt ? JSON.parse((db.prepare("SELECT answer_json FROM items WHERE id = ? AND version = ?").get(item.id, item.version) as { answer_json: string }).answer_json) as { value: number; unit: string } : null;
  return <div className="page"><p className="eyebrow">{session.mode === "reassessment" ? "Fresh later check" : "Focused practice"} · synthetic</p><h1>{item.concept_title}</h1><p className="lead">{item.prompt}</p>
    <RewardSummary {...rewardTotals(db, DEMO_STUDENT_ID)} />
    {attempt && points > 0 && <AnswerCelebration key={attempt.id} attemptId={attempt.id} points={points} animate={celebrate === attempt.id} />}
    {session.ended_at && <div className="notice">This session is closed. Your committed answer remains below.</div>}
    {session.plan_status === "stale" && <div className="notice">The reviewed evidence behind this plan changed. Saved answers remain, but choose a refreshed next step before submitting more work.</div>}
    {hinted && <div className="notice"><strong>Hint:</strong> {item.hint}</div>}
    {revealed && solution && <div className="notice"><strong>Solution:</strong> {solution.value} {solution.unit}. A revealed answer cannot count as independent evidence.</div>}
    {attempt ? <article className="feature-card"><span className="tag">Saved answer · {attempt.score_status}</span><h2>{attempt.answer}</h2><p>{attempt.feedback_text ?? "Your answer was saved; scoring is pending."}</p><p className="muted">{attempt.assistance_status === "known_none" && !attempt.prior_exposure ? "No support was recorded for this fresh item." : "Support, uncertainty, or prior exposure is recorded; this is not an independent check."}</p>{solution && <p>Checked answer: {solution.value} {solution.unit}</p>}{!session.ended_at && session.plan_status !== "stale" && <form action={nextQuestion}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button className="button" type="submit">Try the next question</button></form>}</article>
    : session.ended_at || session.plan_status === "stale" ? <div className="feature-card"><p>This question cannot be submitted in the current session.</p><Link className="button" href="/today">Choose a refreshed session</Link></div>
    : <div className="feature-card"><span className="tag">Answer with a number and unit</span><form action={submitAnswer} className="answer-form"><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><input type="hidden" name="submissionKey" value={randomUUID()} /><label>Your answer<input name="answer" required maxLength={80} placeholder="For example: 2 A" autoComplete="off" /></label><fieldset><legend>Outside help for this answer</legend><label><input type="radio" name="externalHelp" value="none" required /> No outside help</label><label><input type="radio" name="externalHelp" value="yes" /> I used help</label><label><input type="radio" name="externalHelp" value="unsure" /> Not sure</label></fieldset><button className="button" type="submit">Save answer</button></form>
      <div className="inline-actions"><form action={useHint}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button type="submit" className="text-button">Show hint</button></form><form action={revealSolution}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button type="submit" className="text-button">Reveal solution</button></form><form action={pauseSession}><input type="hidden" name="sessionId" value={id} /><input type="hidden" name="itemId" value={item.id} /><button type="submit" className="text-button">Pause</button></form></div>
    </div>}
    <p className="muted">A hint or revealed solution is saved before it appears. You can return to this session after a refresh.</p>
  </div>;
}
