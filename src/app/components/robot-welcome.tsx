"use client";

import { chooseLearner } from "../setup/actions";
import { RobotFace } from "./robot-face";
import { SpeakButton } from "./speak-button";

const greeting = "Hi! I'm LearnPilot. Are you Alex or Vincent? Choose your name to start learning.";

export function RobotWelcome() {
  return <div className="robot-welcome">
    <div className="robot-stage"><RobotFace /><span className="robot-orbit robot-orbit-one" /><span className="robot-orbit robot-orbit-two" /></div>
    <div className="robot-conversation">
      <p className="eyebrow">Meet your learning guide</p>
      <h1>Hi! I’m LearnPilot.</h1>
      <p className="robot-bubble">Are you Alex or Vincent?</p>
      <p className="lead">Choose your name to start learning.</p>
      <p className="muted">You can read my words or tap the speaker to hear them again.</p>
      <div className="robot-controls"><SpeakButton text={greeting} label="Hear greeting" /></div>
      <div className="robot-profile-choices" aria-label="Choose a learner">
        <form action={chooseLearner}><input type="hidden" name="learner" value="vincent" /><button className="profile-choice" type="submit"><strong>Vincent</strong><span>Grade 3 · Math, English, French</span></button></form>
        <form action={chooseLearner}><input type="hidden" name="learner" value="alex" /><button className="profile-choice" type="submit"><strong>Alex</strong><span>Grade 9 · Science, Math, English</span></button></form>
      </div>
      <p className="muted robot-privacy">Your choice selects a profile; it does not verify identity. Use fictional practice data in this prototype.</p>
    </div>
  </div>;
}
