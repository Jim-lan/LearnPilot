# LearnPilot as an interactive guide

The app should feel like a friendly learning game: a robot greets the learner, asks whether they are Alex or Vincent, opens the chosen profile, invites a subject choice, and guides practice with encouragement. This presentation does not change the distinction between quiz results and demonstrated understanding.

## Implemented first slice

- An original SVG robot appears with a written greeting. Alex and Vincent have visible selection buttons. No microphone or speech recognition is used.
- The greeting, subject invitation, concept text, question, session guidance, hint, revealed solution, and saved answer feedback remain on the page as readable scripts. A labelled speaker button replays each eligible text after a tap. French example words and sentences use French browser speech output and show the same text beside the control.
- A replay stops any previous app speech first so the learner does not hear overlapping instructions. If a browser cannot speak, the printed script remains available and the control reports that audio is unavailable. Speech output is presentation only; it does not change attempts, scores, assistance records or learning status.

## Next interaction slices

1. Expand the session conversation to a smaller step after difficulty and a clearer pause/return choice. Keep the actual item, answer key and assistance record in the existing versioned data path.
2. Add a deterministic path from specific observed errors to approved explanation and practice material. A wrong answer can trigger a worked example and then a fresh item. Do not assert a cause that the answer alone cannot show, and do not treat repeated exposure as independent evidence.
3. If optional AI explanations are built under B20/B22/B23, ground them in approved sources, label them as generated, and retain the reviewed fallback. The model may explain a selected concept or suggest a tentative error interpretation; it must not silently change scores, learning status or published questions.

Keep text available without audio. Browser voice availability and pronunciation quality require checks on the devices the family will use; no real learner audio is needed for synthetic engineering.
