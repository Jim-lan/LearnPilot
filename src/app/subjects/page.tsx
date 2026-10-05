import Link from "next/link";
import { redirect } from "next/navigation";
import { subjectNames, subjectsFor } from "@/domain/family-catalog";
import { summarizeLearning } from "@/domain/learning";
import { getDb } from "@/server/db";
import { selectedLearner } from "@/server/learner";
import { loadObservations } from "@/server/learning-store";
import { rewardTotals } from "@/server/rewards";
import { RewardSummary } from "../components/reward-summary";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const learner = await selectedLearner();
  if (!learner) redirect("/setup");
  const db = getDb();
  const groups = subjectsFor(learner.key);
  return <div className="page"><p className="eyebrow">{learner.note}</p><h1>Where would you like to begin, {learner.name}?</h1><p className="lead">Choose a subject, then a topic. Your saved work stays in your own profile.</p>
    <RewardSummary {...rewardTotals(db, learner.id)} />
    <div className="card-grid">{groups.map(group => {
      const started = group.concepts.filter(c => loadObservations(db, learner.id, c.id).length > 0).length;
      const due = group.concepts.filter(c => summarizeLearning(loadObservations(db, learner.id, c.id)).reviewDue).length;
      return <article className="feature-card" key={group.subject}><span className="tag">Grade {learner.grade}</span><h2>{subjectNames[group.subject]}</h2><p>{group.concepts.length} topics · {started} started{due ? ` · ${due} ready for a later check` : ""}</p><Link className="button" href={`/today?subject=${group.subject}`}>Explore {subjectNames[group.subject]} →</Link></article>;
    })}</div>
  </div>;
}
