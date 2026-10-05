"use client";

import { RobotFace } from "./robot-face";

export function RobotGuide({ line }: { line: string }) {
  function speak() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = "en-CA";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }
  return <div className="robot-subject-guide"><RobotFace /><div><p className="eyebrow">LearnPilot says</p><p>{line}</p><button type="button" className="text-button" onClick={speak}>🔊 Hear me</button></div></div>;
}
