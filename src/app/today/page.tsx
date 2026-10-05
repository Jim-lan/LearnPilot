import Link from "next/link";
import { redirect } from "next/navigation";
import { frenchExamples, packForConcept, subjectNames, subjectsFor } from "@/domain/family-catalog";
import { summarizeLearning } from "@/domain/learning";
import { getDb } from "@/server/db";
import { selectedLearner } from "@/server/learner";
import { loadObservations } from "@/server/learning-store";
import { rewardTotals } from "@/server/rewards";
import { startSession } from "./actions";
import { RewardSummary } from "../components/reward-summary";
import { SpeakFrench } from "../components/speak-french";
import { ensureStarterPacks } from "@/server/content-import";

export const dynamic = "force-dynamic";

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ subject?: string; concept?: string; notice?: string }> }) {
  const query = await searchParams;
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const group = subjectsFor(learner.key).find(g => g.subject === query.subject);
  if (!group) redirect("/subjects");
  const db = getDb();
  ensureStarterPacks(db);
  const summaries = group.concepts.map(concept => ({ concept, summary: summarizeLearning(loadObservations(db, learner.id, concept.id)) }));
  const selected = summaries.find(entry => entry.concept.id === query.concept) ?? summaries.find(entry => entry.summary.reviewDue) ?? summaries[0];
  const pack = packForConcept(selected.concept.id);
  const resource = pack?.resources.find(r => r.conceptId === selected.concept.id && r.provider === "LearnPilot");
  const candidate = pack?.resources.filter(r => r.conceptId === selected.concept.id && r.reviewStatus === "candidate") ?? [];
  const resumable = db.prepare(`SELECT s.id FROM sessions s JOIN study_plans p ON p.id = s.plan_id
    WHERE s.student_id = ? AND p.concept_id = ? AND s.ended_at IS NULL AND p.status = 'started'
    ORDER BY s.started_at DESC, s.rowid DESC LIMIT 1`).get(learner.id, selected.concept.id) as { id: string } | undefined;
  const french = frenchExamples[selected.concept.id];
  return <div className="page"><p className="eyebrow">{learner.name} · Grade {learner.grade} · {subjectNames[group.subject]}</p><h1>Choose one useful step.</h1><p className="lead">{selected.summary.explanation}</p>
    <RewardSummary {...rewardTotals(db, learner.id)} />
    <p><Link className="text-link" href="/subjects">← All subjects</Link></p>
    {resumable && <div className="notice">A saved session for this topic is ready. <Link className="text-link" href={`/session?id=${encodeURIComponent(resumable.id)}`}>Resume it →</Link></div>}
    {query.notice === "no-fresh-item" && <div className="notice">No fresh checked item remains in this topic and mode. Choose another topic; repeated questions will not be called independent reassessment.</div>}
    {query.notice === "not-due" && <div className="notice">A later check is not due yet. Practice is available now.</div>}
    <div className="topic-tabs" aria-label="Choose a topic">{group.concepts.map(concept => <Link key={concept.id} aria-current={concept.id === selected.concept.id ? "page" : undefined} href={`/today?subject=${group.subject}&concept=${encodeURIComponent(concept.id)}`}>{concept.title}</Link>)}</div>
    <article className="feature-card"><span className="tag">Original starter practice · synthetic</span><h2>{selected.concept.title}</h2><p>{selected.concept.explanation}</p><p>{resource?.fallback}</p>
      {french && <div className="audio-card"><h3>Listen and say it</h3><SpeakFrench label="Hear a word" value={french.word} /><SpeakFrench label="Hear a sentence" value={french.sentence} /><p className="muted">You can repeat aloud. We do not record or grade pronunciation.</p></div>}
      <form action={startSession}><input type="hidden" name="conceptId" value={selected.concept.id} /><input type="hidden" name="mode" value="practice" /><button className="button" type="submit">Start practice</button></form>
      {selected.summary.reviewDue && <form action={startSession}><input type="hidden" name="conceptId" value={selected.concept.id} /><input type="hidden" name="mode" value="reassessment" /><button className="secondary-button" type="submit">Try a fresh later check</button></form>}
    </article>
    {candidate.length > 0 && <details className="candidate-box"><summary>External resources awaiting review</summary><p className="muted">These exact links have not yet been reviewed for learner suitability or accessibility.</p>{candidate.map(r => <p key={r.id}><a href={r.url!} target="_blank" rel="noopener noreferrer">{r.provider} {r.format} ↗</a> · candidate</p>)}</details>}
  </div>;
}
