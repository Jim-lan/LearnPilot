"use client";

import { useEffect, useState } from "react";

export function SpeakButton({ text, label, lang = "en-CA", rate = 0.92 }: { text: string; label: string; lang?: string; rate?: number }) {
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  function speak() {
    if (!("speechSynthesis" in window)) {
      setMessage("Audio is unavailable in this browser. The words are shown on the page.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = (event) => {
      setPlaying(false);
      if (event.error !== "canceled" && event.error !== "interrupted") setMessage("Audio could not play. The words are shown on the page.");
    };
    window.speechSynthesis.speak(utterance);
    setMessage("");
  }

  return <span className="speak-control"><button type="button" className="secondary-button speak-button" onClick={speak} aria-label={label} title={label}><span aria-hidden="true">🔊</span> {playing ? "Playing… tap to replay" : label}</button>{message && <span className="muted" role="status">{message}</span>}</span>;
}
