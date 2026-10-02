import Link from "next/link";
import { demoPack } from "@/domain/demo-content";
import { summarizeLearning } from "@/domain/learning";
import { getDb } from "@/server/db";
import { loadObservations } from "@/server/learning-store";
import { DEMO_STUDENT_ID } from "@/server/session-store";
import { startSession } from "./actions";

export const dynamic = "force-dynamic";

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ concept?: string; notice?: string }> }) {
  const query = await searchParams;
  const db = getDb();
  const student = db.prepare("SELECT display_name AS name, goal FROM students WHERE id = ?").get(DEMO_STUDENT_ID) as { name: string; goal: string } | undefined;
  if (!student) return <div className="page"><p className="eyebrow">Synthetic prototype</p><h1>Start with a goal.</h1><p className="lead">Choose a nickname, study time and topic before today’s plan appears.</p><Link className="button" href="/setup">Set up LearnPilot</Link></div>;
  const resumable = db.prepare("SELECT s.id FROM sessions s LEFT JOIN study_plans p ON p.id = s.plan_id WHERE s.student_id = ? AND s.ended_at IS NULL AND (p.id IS NULL OR p.status = 'started') ORDER BY s.started_at DESC, s.rowid DESC LIMIT 1").get(DEMO_STUDENT_ID) as { id: string } | undefined;
  const summaries = demoPack.concepts.map(concept => ({ concept, summary: summarizeLearning(loadObservations(db, DEMO_STUDENT_ID, concept.id)) }));
  const due = summaries.find(entry => entry.summary.reviewDue);
  const selected = summaries.find(entry => entry.concept.id === query.concept)
    ?? (student.goal === "review" ? due : undefined)
    ?? (student.goal === "practice" ? summaries.find(entry => entry.summary.observedResult === "error_item" || entry.summary.observedResult === "mixed") : undefined)
    ?? summaries[0];
  const resource = demoPack.resources.find(r => r.conceptId === selected.concept.id && r.provider === "LearnPilot")!;
  const candidate = demoPack.resources.filter(r => r.conceptId === selected.concept.id && r.reviewStatus === "candidate");
  return <div className="page"><p className="eyebrow">Today · Synthetic practice</p><h1>One useful step, {student.name}.</h1><p className="lead">{selected.summary.explanation}</p>
    {resumable && <div className="notice">A saved session is ready. <Link className="text-link" href={`/session?id=${encodeURIComponent(resumable.id)}`}>Resume it →</Link></div>}
    {query.notice === "no-fresh-item" && <div className="notice">No fresh checked item remains in this topic and mode. Choose another topic or return to ordinary practice; repeated questions will not be called independent reassessment.</div>}
    {query.notice === "not-due" && <div className="notice">A later check is not due yet. Practice is available now; time alone will not change the observed result.</div>}
    <div className="topic-tabs" aria-label="Choose a topic">{demoPack.concepts.map(concept => <Link key={concept.id} aria-current={concept.id === selected.concept.id ? "page" : undefined} href={`/today?concept=${encodeURIComponent(concept.id)}`}>{concept.title}</Link>)}</div>
    <article className="feature-card"><span className="tag">Original text support · synthetic</span><h2>{selected.concept.title}</h2><p>{selected.concept.explanation}</p><p>{resource.fallback}</p><p className="muted">Focus: notice the relationship, then include the unit in your answer.</p>
      <form action={startSession}><input type="hidden" name="conceptId" value={selected.concept.id} /><input type="hidden" name="mode" value="practice" /><button className="button" type="submit">Start a short practice</button></form>
      {selected.summary.reviewDue && <form action={startSession}><input type="hidden" name="conceptId" value={selected.concept.id} /><input type="hidden" name="mode" value="reassessment" /><button className="secondary-button" type="submit">Try a fresh later check</button></form>}
    </article>
    {candidate.length > 0 && <details className="candidate-box"><summary>External resource candidates for reviewer preview</summary><p className="muted">These exact links are not yet reviewed for Grade 9 suitability or accessibility. The original text above remains the supported demo route.</p>{candidate.map(r => <p key={r.id}><a href={r.url!} target="_blank" rel="noopener noreferrer">{r.provider} {r.format} ↗</a> · candidate, availability unchecked</p>)}</details>}
  </div>;
}
