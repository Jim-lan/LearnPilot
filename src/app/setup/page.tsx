import { chooseLearner } from "./actions";

export default function SetupPage() {
  return <div className="page"><p className="eyebrow">Your learning space</p><h1>Who’s learning today?</h1>
    <p className="lead">Choose your profile. Your subjects, topic progress, and encouragement will stay with it on this laptop.</p>
    <div className="card-grid learner-grid">
      <form action={chooseLearner} className="feature-card learner-card"><input type="hidden" name="learner" value="vincent" /><span className="tag">Grade 3 · French immersion</span><h2>Vincent</h2><p>Math, English, and French words and sentences.</p><button className="button" type="submit">I’m Vincent →</button></form>
      <form action={chooseLearner} className="feature-card learner-card"><input type="hidden" name="learner" value="alex" /><span className="tag">Grade 9</span><h2>Alex</h2><p>Science, Math, and English.</p><button className="button" type="submit">I’m Alex →</button></form>
    </div>
    <p className="muted">This is a local synthetic prototype. These buttons select a learner; they are not password protection. Please use fictional practice data until the real-data safeguards are reviewed.</p>
  </div>;
}
