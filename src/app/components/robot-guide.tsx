"use client";

import { RobotFace } from "./robot-face";
import { SpeakButton } from "./speak-button";

export function RobotGuide({ line, speakLabel = "Hear me" }: { line: string; speakLabel?: string }) {
  return <div className="robot-subject-guide"><RobotFace /><div><p className="eyebrow">LearnPilot says</p><p>{line}</p><SpeakButton text={line} label={speakLabel} /></div></div>;
}
