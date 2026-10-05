# U07 · Vincent's separate reasoning area (conditional)

Status: design-ready, learner-facing implementation **waiting on O07**. This task is not a release of CCAT preparation. Read [CCAT considerations](../../../docs/ccat-considerations.md), [decisions](../decisions.md) and [BUILD_STATE](../BUILD_STATE.md) before implementing. The nine sections below reflect the user's purchased-book table of contents and the publisher's public task descriptions; no book pages or official test items have been supplied or copied.

## Release gate

Obtain the administering board, exact test/version and its current written preparation rule. If a no-preparation rule applies before screening, do not expose this area, its examples, a word bank framed as test study, or a test-like quiz to Vincent. Keep ordinary Grade 3 Math, English, French and everyday pattern play separate. Do not use the purchased book until its title, edition and permitted handling are known. A parent request alone does not establish that a school-run screening permits preparation. If the board allows practice, record the source and date of that determination in `decisions.md` before enabling the area.

## Proposed learner experience after the gate

1. Add a fourth Vincent-only subject card, **Reasoning**, separate from Math, English and French. Alex does not see it. A short intro says these are original thinking activities, not official CCAT questions, IQ measurements, score predictions or gifted-eligibility assessments.
2. Show three groups: Words and meaning, Number relationships, and Visual patterns. Within them, display the nine named topics below. Each topic has a plain-language strategy, a worked demonstration with a visible explanation, two short original practice items and one distinct reserved later check. Start without a timer or percentile display.
3. Before each question, show the strategy and an optional speaker replay. After an answer, explain the actual rule and why the chosen option does or does not fit. Offer a fresh example. Record hint, solution reveal and outside help through the existing assistance path. A watched explanation or repeated item does not count as independent understanding.
4. Use the existing per-learner topic summaries and encouragement points without turning nine item results into a global ability label. Label support as support. Keep the area optional, brief and easy to pause.

| Group | Topic | Strategy to teach and check in the worked example |
| --- | --- | --- |
| Words and meaning | Verbal analogies | Name the relationship in the first pair, then apply the same relationship to the next word; check that both pairs match in the same direction. |
| Words and meaning | Sentence completion | Read the whole sentence, identify context clues and grammar, try a word mentally, then reread with the chosen option. |
| Words and meaning | Verbal classification | State what the given words share; test each option against that one category rather than relying on a loose association. |
| Number relationships | Number analogies | Describe the operation between the first two numbers, verify it on another shown pair, then apply it to the missing pair. |
| Number relationships | Number puzzles | Translate the pictured or written equality into a small equation; keep both sides equal and check the result by substitution. |
| Number relationships | Number series | Compare consecutive terms; check for addition, subtraction, grouping or alternating rules; verify the rule across every visible step. |
| Visual patterns | Figure matrices | Compare across rows and down columns. Ask what stays the same and what changes: shape, count, size, shading, rotation or position. Use both directions to test a candidate. |
| Visual patterns | Paper folding | Track each fold and hole in order, then mentally unfold in reverse. A fold creates reflected copies; check position and count after each reversal. |
| Visual patterns | Figure classification | Name the shared feature of the examples, then choose the option with that feature even if other features differ. |

## Content and implementation contracts

- Author fresh examples and explanations; do not transcribe the purchased workbook or imitate an official item. Keep a versioned reference pack. Tag all examples `original_demo` and `synthetic_automated_checked` until an appropriate human content review. An app-visible word bank should use useful, age-appropriate everyday relationship words with definitions and example sentences; it must not claim to be the official or most predictive CCAT vocabulary list.
- Use the existing `SubjectKey`/catalogue grouping and `DemoPack` importer for distinct Vincent-only concepts and item IDs. Import idempotently under a new pack ID/version; preserve previous attempts and pack versions. Do not move the existing rule-finding Math concepts or relabel their past evidence.
- Visual questions need an original code-native SVG or structured shape renderer, not ambiguous emoji or scanned pages. Store a text description and an equivalent rule explanation alongside the figure so it can be read and replayed. The question and choices must remain usable by keyboard and at a phone width. For folding, validate the diagram's fold sequence and final hole locations before publication.
- Keep the answer key server-side until the defined reveal or grading point. Each topic needs two checked practice examples plus a separate later-check item. If no unseen item remains, say so and do not claim an independent check. Keep incorrect feedback specific and kind; do not infer general reasoning ability from a few responses.
- No live model call is needed. Do not import book images into Git or a static path. If a later feature accepts private pages, use B16/B24–B27 attachment, rights and recovery controls first.

## Acceptance evidence required after the gate

- Confirm the board rule in `decisions.md`, document whether the practice is allowed at the time of use, and verify Vincent-only visibility. If prohibited, mark U07 `waiting_external` and do not ship learner-facing CCAT content.
- Validate all nine category guides and every original answer/figure by an independent content review; test importer idempotency and restart, learner isolation, support-aware scoring, reserved later checks and no global ability claim.
- Browser-check each visual interaction and its text/speaker equivalent at desktop and phone widths; confirm that hidden solutions stay hidden until reveal. Record actual commands and results in `BUILD_STATE.md`.
