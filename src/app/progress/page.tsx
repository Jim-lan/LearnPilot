import Link from "next/link";
import { demoPack } from "@/domain/demo-content";
import { summarizeLearning } from "@/domain/learning";
import { getDb } from "@/server/db";
import { loadObservations } from "@/server/learning-store";
import { DEMO_STUDENT_ID } from "@/server/session-store";
import { rewardTotals } from "@/server/rewards";
import { RewardSummary } from "../components/reward-summary";

export const dynamic = "force-dynamic";

export default async function ProgressPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const db = getDb();
  if (!db.prepare("SELECT id FROM students WHERE id = ?").get(DEMO_STUDENT_ID)) return <div className="page"><h1>Progress starts with a goal.</h1><Link className="button" href="/setup">Open setup</Link></div>;
  const cards = demoPack.concepts.map(concept => {
    const observations = loadObservations(db, DEMO_STUDENT_ID, concept.id);
    const summary = summarizeLearning(observations);
    const coverage = db.prepare("SELECT state FROM coverage_observations WHERE student_id = ? AND concept_id = ? ORDER BY observed_at DESC, rowid DESC LIMIT 1").get(DEMO_STUDENT_ID, concept.id) as { state: string } | undefined;
    return { concept, observations, summary, coverage: coverage?.state ?? "unknown" };
  });
  return <div className="page"><p className="eyebrow">Progress · Evidence, not percentages</p><h1>What the work shows so far.</h1><p className="lead">Each note is limited to the recorded items. Classroom coverage, assistance, and later review remain separate.</p>
    <RewardSummary {...rewardTotals(db, DEMO_STUDENT_ID)} />
    {notice === "bank-exhausted" && <div className="notice">No fresh checked question remains in that session. The existing answers stay saved; choose another topic or wait for new reviewed items.</div>}
    <div className="evidence-list">{cards.map(({ concept, observations, summary, coverage }) => <article className="feature-card" key={concept.id}><span className="tag">Classroom coverage: {coverage.replaceAll("_", " ")}</span><h2>{concept.title}</h2><p>{summary.explanation}</p><p className="muted">{observations.length} recorded observation{observations.length === 1 ? "" : "s"} · assistance: {summary.assistance.replaceAll("_", " ")} · evidence: {summary.sufficiency.replaceAll("_", " ")}</p>{summary.reviewDue && <p><strong>A later check is due.</strong> Time alone has not changed the observed result.</p>}
      {summary.evidenceRefs.length > 0 && <details><summary>Evidence references</summary><ul>{summary.evidenceRefs.map(id => <li key={id}><code>{id}</code></li>)}</ul></details>}
      <Link className="text-link" href={`/today?concept=${encodeURIComponent(concept.id)}`}>Choose a next step →</Link>
    </article>)}</div><p className="muted">This is a synthetic prototype. The original questions and candidate curriculum mappings still need appropriate human review before a real student pilot.</p></div>;
}
