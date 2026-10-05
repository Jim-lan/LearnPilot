export function RobotFace({ speaking = false }: { speaking?: boolean }) {
  return <svg className={`robot-face${speaking ? " robot-face--speaking" : ""}`} viewBox="0 0 240 240" role="img" aria-label="LearnPilot robot waving hello">
    <circle cx="120" cy="120" r="110" fill="#e7f3e5" />
    <path d="M119 37v20" stroke="#285d51" strokeWidth="8" strokeLinecap="round" />
    <circle cx="119" cy="31" r="10" fill="#e7ad4b" />
    <rect x="49" y="61" width="142" height="133" rx="37" fill="#327560" stroke="#1d5147" strokeWidth="6" />
    <rect x="64" y="79" width="112" height="81" rx="24" fill="#f7fbf0" />
    <circle cx="92" cy="111" r="12" fill="#1e4840" />
    <circle cx="148" cy="111" r="12" fill="#1e4840" />
    <circle cx="96" cy="107" r="4" fill="white" />
    <circle cx="152" cy="107" r="4" fill="white" />
    <path className="robot-mouth" d="M101 137q19 14 38 0" fill="none" stroke="#1e4840" strokeWidth="6" strokeLinecap="round" />
    <rect x="93" y="171" width="54" height="9" rx="4.5" fill="#b9e0c4" />
    <path d="M44 177q-23-14-24-32m176 32q23-14 24-32" fill="none" stroke="#285d51" strokeWidth="8" strokeLinecap="round" />
    <circle cx="20" cy="143" r="11" fill="#e7ad4b" />
    <circle cx="220" cy="143" r="11" fill="#e7ad4b" />
  </svg>;
}
