"use client";

import { useEffect, useRef, useState } from "react";
import { learnerNamedIn } from "@/domain/voice-choice";
import { chooseLearner } from "../setup/actions";
import { RobotFace } from "./robot-face";

type RecognitionResult = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type RecognitionError = { error: string };
type LocalRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  processLocally: boolean;
  onresult: ((event: RecognitionResult) => void) | null;
  onerror: ((event: RecognitionError) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
};
type RecognitionClass = {
  new(): LocalRecognition;
  available?: (options: { langs: string[]; processLocally: true }) => Promise<"available" | "downloadable" | "downloading" | "unavailable">;
  install?: (options: { langs: string[]; processLocally: true }) => Promise<boolean>;
};
type VoiceState = "checking" | "ready" | "listening" | "downloadable" | "downloading" | "unavailable" | "insecure";
const language = "en-US";
const voiceOptions = { langs: [language], processLocally: true as const };

function recognitionClass(): RecognitionClass | null {
  const browser = window as Window & { SpeechRecognition?: RecognitionClass };
  const Recognition = browser.SpeechRecognition;
  if (!Recognition?.available) return null;
  if (!("processLocally" in new Recognition())) return null;
  return Recognition;
}

export function RobotWelcome() {
  const vincentForm = useRef<HTMLFormElement>(null);
  const alexForm = useRef<HTMLFormElement>(null);
  const recognizer = useRef<LocalRecognition | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>("ready");
  const [message, setMessage] = useState("Say your name, or tap a choice below.");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      recognizer.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speakGreeting() {
    if (!("speechSynthesis" in window)) {
      setMessage("This browser cannot play a spoken greeting, but you can read it here.");
      return;
    }
    window.speechSynthesis.cancel();
    const greeting = new SpeechSynthesisUtterance("Hi! I'm LearnPilot. Are you Alex or Vincent?");
    greeting.lang = "en-CA";
    greeting.rate = 0.91;
    greeting.onstart = () => setSpeaking(true);
    greeting.onend = () => setSpeaking(false);
    greeting.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(greeting);
  }

  async function listen() {
    if (!window.isSecureContext) {
      setVoiceState("insecure");
      setMessage("Voice needs a secure connection on this device. You can still tap your name.");
      return;
    }
    const Recognition = recognitionClass();
    if (!Recognition?.available) {
      setVoiceState("unavailable");
      setMessage("On-device voice recognition is not available in this browser. Tap your name below.");
      return;
    }
    setVoiceState("checking");
    try {
      const availability = await Recognition.available(voiceOptions);
      if (availability !== "available") {
        setVoiceState(availability);
        setMessage(availability === "downloadable"
          ? "This browser needs an on-device English voice pack. Install it, or tap your name."
          : availability === "downloading"
            ? "The browser is downloading its on-device voice pack. Try again shortly."
            : "On-device voice recognition is unavailable here. Tap your name below.");
        return;
      }
      window.speechSynthesis?.cancel();
      const instance = new Recognition();
      instance.lang = language;
      instance.continuous = false;
      instance.interimResults = false;
      instance.maxAlternatives = 1;
      instance.processLocally = true;
      instance.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
        const learner = learnerNamedIn(transcript);
        if (!learner) {
          setMessage(transcript ? `I heard “${transcript}.” Please say just Alex or Vincent, or tap your name.` : "I did not catch a name. Please try again or tap your name.");
          return;
        }
        setMessage(`I heard ${learner === "alex" ? "Alex" : "Vincent"}. Opening your learning space…`);
        const form = learner === "alex" ? alexForm.current : vincentForm.current;
        form?.requestSubmit();
      };
      instance.onerror = (event) => {
        setVoiceState("ready");
        setMessage(event.error === "not-allowed" ? "Microphone access was not allowed. Tap your name below." : "I could not hear a name. Try again or tap your name.");
      };
      instance.onend = () => setVoiceState("ready");
      recognizer.current = instance;
      setVoiceState("listening");
      setMessage("Listening now. Say “Alex” or “Vincent.”");
      instance.start();
    } catch {
      setVoiceState("unavailable");
      setMessage("On-device voice recognition could not start. Tap your name below.");
    }
  }

  async function installVoice() {
    const Recognition = recognitionClass();
    if (!Recognition?.install) return;
    setVoiceState("downloading");
    setMessage("Installing the browser's on-device English voice pack…");
    try {
      const installed = await Recognition.install(voiceOptions);
      setVoiceState(installed ? "ready" : "unavailable");
      setMessage(installed ? "Voice is ready. Tap the microphone and say your name." : "Voice installation did not finish. You can tap your name below.");
    } catch {
      setVoiceState("unavailable");
      setMessage("Voice installation was unavailable. You can tap your name below.");
    }
  }

  return <div className="robot-welcome">
    <div className="robot-stage"><RobotFace speaking={speaking || voiceState === "listening"} /><span className="robot-orbit robot-orbit-one" /><span className="robot-orbit robot-orbit-two" /></div>
    <div className="robot-conversation">
      <p className="eyebrow">Meet your learning guide</p>
      <h1>Hi! I’m LearnPilot.</h1>
      <p className="robot-bubble">Are you Alex or Vincent?</p>
      <p className="lead">Tell me your name and we’ll find a good place to start.</p>
      <div className="robot-controls">
        <button type="button" className="secondary-button" onClick={speakGreeting}>🔊 Hear me</button>
        <button type="button" className="button" onClick={listen} disabled={voiceState === "insecure" || voiceState === "unavailable" || voiceState === "downloading" || voiceState === "listening"}>🎙️ {voiceState === "listening" ? "Listening…" : "Say my name"}</button>
        {voiceState === "downloadable" && <button type="button" className="secondary-button" onClick={installVoice}>Install on-device voice</button>}
      </div>
      <p className="robot-message" role="status" aria-live="polite">{message}</p>
      <div className="robot-profile-choices" aria-label="Choose a learner without voice">
        <form ref={vincentForm} action={chooseLearner}><input type="hidden" name="learner" value="vincent" /><button className="profile-choice" type="submit"><strong>Vincent</strong><span>Grade 3 · Math, English, French</span></button></form>
        <form ref={alexForm} action={chooseLearner}><input type="hidden" name="learner" value="alex" /><button className="profile-choice" type="submit"><strong>Alex</strong><span>Grade 9 · Science, Math, English</span></button></form>
      </div>
      <p className="muted robot-privacy">The microphone starts only when you tap it and on-device recognition is available. LearnPilot does not save your voice or transcript. Saying a name selects a profile; it does not verify identity. Use fictional practice data in this prototype.</p>
    </div>
  </div>;
}
