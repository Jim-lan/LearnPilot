"use client";

import { useState } from "react";

export function SpeakFrench({ label, value }: { label: string; value: string }) {
  const [message, setMessage] = useState("");
  function speak() {
    if (!("speechSynthesis" in window)) {
      setMessage("Speech playback is not available in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = "fr-CA";
    utterance.rate = 0.82;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setMessage("");
  }
  return <span className="speak-control"><button type="button" className="secondary-button" onClick={speak}>🔊 {label}</button><span className="muted"> {value}</span>{message && <span role="status">{message}</span>}</span>;
}
