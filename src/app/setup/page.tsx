import { demoPack } from "@/domain/demo-content";
import { getDb } from "@/server/db";
import { saveSetup } from "./actions";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  const db = getDb();
  const student = db.prepare("SELECT display_name AS name, goal, minutes_available AS minutes, preferred_format AS format, assessment_date AS date FROM students WHERE id = 'demo:student:local'").get() as { name: string; goal: string; minutes: number; format: string; date: string | null } | undefined;
  const observations = db.prepare("SELECT concept_id, state FROM coverage_observations WHERE student_id = 'demo:student:local' ORDER BY observed_at DESC, rowid DESC").all() as { concept_id: string; state: string }[];
  const coverage = new Map(observations.reverse().map(row => [row.concept_id, row.state]));
  return <div className="page"><p className="eyebrow">Synthetic prototype · Step 1</p><h1>Make this space yours.</h1><p className="lead">Use a nickname and choose what you want to work on. This demo is for fictional practice only; do not enter real student information.</p>
    <form action={saveSetup} className="form-card">
      <label>Display name<input name="displayName" maxLength={60} required defaultValue={student?.name ?? "Demo learner"} /></label>
      <div className="form-row"><label>What is your goal?<select name="goal" defaultValue={student?.goal ?? "introduce"}><option value="introduce">Understand a new topic</option><option value="practice">Practise a topic</option><option value="review">Review for a check</option></select></label><label>Minutes available<select name="minutes" defaultValue={String(student?.minutes ?? 15)}>{[5,10,15,20,30,45,60].map(n => <option key={n} value={n}>{n} minutes</option>)}</select></label></div>
      <div className="form-row"><label>Preferred support<select name="preferredFormat" defaultValue={student?.format ?? "read"}><option value="read">Read a short explanation</option><option value="watch">Watch a video when reviewed</option><option value="explore">Explore an activity when reviewed</option></select></label><label>Optional assessment date<input name="assessmentDate" type="date" defaultValue={student?.date ?? ""} /></label></div>
      <h2>Classroom coverage</h2><p className="muted">This records what has been taught, not what you understand.</p>
      {demoPack.concepts.map(concept => <label key={concept.id}>{concept.title}<select name={`coverage:${concept.id}`} defaultValue={coverage.get(concept.id) ?? "unknown"}><option value="unknown">I’m not sure</option><option value="not_yet">Not taught yet</option><option value="in_progress">Learning now</option><option value="covered">Already taught</option></select></label>)}
      <button className="button" type="submit">Save and see today</button>
    </form></div>;
}
