# LearnPilot as an interactive guide

The user wants the app to feel like a friendly learning game: a robot greets the learner, asks whether they are Alex or Vincent, opens that profile, invites a subject choice, and guides practice with timely encouragement. This is an interaction direction for the existing evidence-aware app, not a change to the distinction between quiz results and demonstrated understanding.

## Implemented first slice

- The entry page shows an original SVG LearnPilot robot and an immediate written greeting. A tap can speak the greeting through the browser's speech-synthesis facility; browsers may restrict automatic audio.
- A learner can say a name after tapping the microphone. Only an unambiguous “Alex” or “Vincent” in the recognized words selects the profile; voice characteristics are not used as authentication. The transcript is temporary browser UI state, not saved to the database or sent to LearnPilot's server.
- Recognition is attempted only when the browser explicitly supports `processLocally` and reports an on-device English language pack. A user can choose to install that browser pack. There is no remote recognition fallback. Microphone permission is requested only by the browser when the learner taps to listen.
- Name buttons remain visible and usable without audio or permission. The subject page shows the robot again with a short spoken-on-tap invitation. In a session, the robot gives a short prompt and can read the saved answer feedback aloud after submission. Existing practice records, points and help rules are unchanged.

## Next interaction slices

1. Expand the session conversation beyond the initial prompt/feedback to a smaller step after difficulty and a clearer pause/return choice. Keep the actual item, answer key and assistance record in the existing versioned data path; animations and speech are presentation only.
2. Add a deterministic path from specific observed errors to approved explanation/practice material. A wrong answer can trigger a worked example and then a fresh item. Do not assert a cause that the answer alone cannot show, and do not turn repeated exposure into independent evidence.
3. If optional AI explanations are built under B20/B22/B23, ground them in approved source records, label them as generated, and retain the reviewed fallback. The model may explain a selected concept or suggest a tentative error interpretation; it must not silently change scores, learning status, or published questions.
4. For voice on phones and tablets over home Wi-Fi, add a trusted HTTPS origin while keeping the LAN peer/Host/Origin protections. Test real browsers and microphone permissions on each device class. The current plain-HTTP private IP does not meet browser microphone requirements.

Do not infer identity from voice, continuously listen, retain audio, send student audio to a provider, or claim that a playful interaction proves learning. Keep the app useful when speech output/input is unavailable. Synthetic engineering can proceed without real learner voice recordings.

Browser capability references: the [Web Speech API specification](https://webaudio.github.io/web-speech-api/) defines local-only recognition and explicit input consent; [Secure Contexts](https://www.w3.org/TR/secure-contexts/) limits trustworthy HTTP origins to loopback/localhost rather than ordinary private IP addresses.
