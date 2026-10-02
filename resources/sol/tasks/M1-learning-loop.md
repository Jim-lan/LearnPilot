# M1 — Reviewed content and a complete manual learning cycle

This milestone proves the flow with manual evidence and original practice before OCR or live AI. Read [contracts](../contracts.md), [build state](../BUILD_STATE.md), [personalized learning](../../../docs/personalized-learning.md), and [the backlog](../../../docs/task-backlog.md).

Engineering can proceed with clearly labelled synthetic fixtures. Never fabricate a teacher, expert reviewer, learner, observation, or approval. Keep factual verification, content review, curriculum alignment review, and rights clearance distinct. Synthetic fixtures may simulate review states for testing, but those states are not approval for real student use. Pending pilot content reviews belong in build state and must not stop unrelated implementation.

For each card, implement a narrow working slice, run the meaningful checks listed, and update [build state](../BUILD_STATE.md) before continuing to the next unblocked card. Preserve IDs and provenance across cards. Do not add live model calls, file extraction, or automatic question generation in M1.

## B06 — Import a small versioned curriculum and concept pack

- **Purpose:** Ground the pilot in stable references without building a public-content mirror.
- **Dependencies:** B03; A02/A09 use provisional SNC1W circuits for synthetic development, with actual classroom scope pending.
- **Implementation:**
  1. Define a small validated pack with course/version, selected expectation IDs, original concepts/prerequisites, mappings, source URLs/locators, attribution, rights/review status, and pack version.
  2. Separate official wording from original annotations. If storage rights or source verification is unresolved, include permitted metadata and label the unresolved field; do not invent official text or alignment.
  3. Import transactionally with stable namespaced IDs and explicit duplicate/conflict handling. Preserve previous referenced versions instead of silently replacing them.
  4. Supply clearly synthetic content where needed for the runnable demo. Keep synthetic versus real-source provenance visible in catalogue inspection.
- **Verification:** Import twice without duplicate concepts; reject broken references and incompatible duplicate versions; verify pinned source/version metadata; preserve an existing evidence reference when another pack version is added.
- **Done:** The app can resolve the pilot's selected concepts and versioned references offline. Outstanding alignment/rights review is recorded accurately and does not masquerade as approval.
- **Exclusions:** Whole-curriculum scraping, full textbooks, broad subject coverage, semantic search, and curriculum APIs that have not been verified.

## B07 — Curate supporting resources and text fallbacks

- **Purpose:** Offer a useful explanation in the learner's chosen format while remaining usable when a link is unsuitable or unavailable.
- **Dependencies:** B06 and A14 resource-selection policy.
- **Implementation:**
  1. Register a small set of exact Khan Academy, YouTube, TVO, or PhET candidates from [research sources](../../../docs/research-sources.md). Inspect destinations and record only facts actually verified.
  2. Store purpose, concept/depth, prerequisites, format/language/accessibility, canonical URL, review/availability dates, limitations, and fallback. Unknown duration/captions remain unknown.
  3. Distinguish candidate, reviewed, unavailable, and retired states. Present only genuinely reviewed resources as approved recommendations; a separate synthetic/reviewer preview may show clearly labelled candidates.
  4. Author short original text/activity fallbacks for the demo and record their authoring/check status. Keep link opening separate from self-reported completion and helpfulness.
- **Verification:** A candidate cannot leak into an approved recommendation; an unavailable video yields a usable text/activity path; metadata does not claim unperformed review; no outgoing URL contains student identifiers or marks.
- **Done:** The synthetic flow has usable labelled support and the catalogue supports actual review. If external content approval remains pending, record that pilot gate and continue engineering using the fallback.
- **Exclusions:** Downloaded videos/transcripts, embedding, autoplay, unrestricted student search, analytics from provider accounts, and invented timestamps.

## B08 — Author and validate the original item bank

- **Purpose:** Provide enough controlled practice and unseen checks to exercise the complete learning cycle.
- **Dependencies:** B06 and A13 item/rubric contract; actual teacher depth remains a pilot gate.
- **Implementation:**
  1. Create roughly 20–30 original circuit/prerequisite items with an explicit blueprint across introduction, practice, and reserved reassessment. Start with a few vertical-slice items, then complete the bank before marking this card done.
  2. Store stable item identity, version, concept/expectation mappings, prompt, answer/key, acceptable units/forms, numerical tolerance where relevant, explanation rubric, hints, purpose, and review/check status.
  3. Independently work numerical solutions and check unit conversions. Keep automatic arithmetic checks distinct from educational/expert review; record both honestly.
  4. Mark synthetic prototype items visibly. Real learner delivery requires applicable content approval; fixture-only review outcomes cannot satisfy it. Do not put reserved answers into learner-visible payloads before needed.
- **Verification:** Recalculate keys through meaningful independent checks; test wrong units, boundary tolerances, malformed answers, and equivalent valid forms. Verify the reassessment reserve and that unchecked non-synthetic content is excluded from approved delivery.
- **Done:** The demo has the stated item inventory and known expected results, with content status visible. Pending human/classroom checks are listed as pilot readiness work.
- **Exclusions:** Generated infinite variants, imported copyrighted question banks, automatic diagram grading, and unsupported equivalent-resistance depth.

## B09 — Implement minimal setup and classroom context

- **Purpose:** Personalize from explicit choices without inventing a permanent learner profile.
- **Dependencies:** B04 and B06.
- **Implementation:**
  1. Capture a minimal display identifier, active course/unit, chosen goal, available session time, optional format/language/accessibility choices, and relevant assessment date.
  2. Record classroom coverage independently as unknown, not yet taught, current, or taught using the central contract. Never derive understanding from a coverage flag.
  3. Support changing preferences and starting without past assessments. Keep synthetic initialization explicit and provide useful validation/empty states.
- **Verification:** Complete setup with only required fields; reopen saved choices; change a preference; represent unknown coverage; confirm setup creates no assessed weakness or mastery claim.
- **Done:** Setup produces sufficient context for both assessment-based targeting and an explicit topic-introduction session.
- **Exclusions:** Birth dates, school identity, diagnostic labels, fixed learning styles, multiple-account onboarding, and broad calendars.

## B10 — Add manual evidence entry and review

- **Purpose:** Make a complete evidence route available before uploads or extraction exist.
- **Dependencies:** B03, B06, and A11 manual-source contract.
- **Implementation:**
  1. Enter a synthetic assessment's question, response, supplied marks/rubric if any, source/origin description, question locator, and proposed concept mapping. Label manual provenance explicitly.
  2. Distinguish a transcribed teacher mark from an application/reviewer outcome; neither may silently overwrite the other.
  3. Save drafts, allow edits, and publish a reviewed evidence revision only through an explicit review action. Preserve stable identity and revision metadata for later correction work.
  4. Display missing/unreadable information, unknown assistance, and incomplete mapping as unknown. Provide a review queue and source/evidence detail view.
- **Verification:** Draft/unreviewed records do not affect conclusions; reviewed records resolve to their manual source/locator; conflicting marks stay distinguishable; interrupted editing preserves the last committed draft.
- **Done:** A reviewer can inspect and publish synthetic evidence with traceable provenance. Real reviewer identity/status is never fabricated.
- **Exclusions:** Attachments, OCR, auto-publishing model output, source deletion, and the full dependent-correction workflow reserved for M2.

## B11 — Implement descriptive evidence summaries

- **Purpose:** Turn eligible observations into limited, explainable conclusions instead of unsupported mastery scores.
- **Dependencies:** B08–B10 and A12; document the first rule-policy version.
- **Implementation:**
  1. Implement domain functions over versioned reviewed evidence; keep coverage, observed performance, evidence sufficiency, assistance, and recency separate.
  2. Treat missing answers, unknown assistance, unreviewed work, and insufficient evidence conservatively. A correct unseen independent response supports a claim about that item, not automatic broad mastery.
  3. Preserve contradictory observations and show that review is needed. Suggest a prerequisite check only when evidence supports the question; do not diagnose a science misconception from arithmetic alone.
  4. Save/derive summaries with supporting revision IDs and policy version; expose the evidence behind consequential claims.
- **Verification:** Table-driven cases cover unknown, supported correct, independent correct, wrong unit, repeated/exposed item, contradictory later answer, missing work, and unrelated prerequisite speculation. Recompute the same inputs reproducibly.
- **Done:** Every consequential result has an explanation and eligible evidence references; no unsupported percentage or fixed learner trait appears.
- **Exclusions:** Psychometric mastery thresholds, predictive grades, ranking, and AI deciding eligibility rules.

## B12 — Select a target and a short study plan

- **Purpose:** Convert context and evidence into one achievable next action.
- **Dependencies:** B07 and B11.
- **Implementation:**
  1. Support assessment-follow-up and explicit introduction paths. Select one or two targets using goal, current unit/coverage, prerequisites, available time, and evidence sufficiency.
  2. Choose one primary support resource and at most two alternatives from eligible catalogue entries; allow original fallback support in synthetic mode with its status visible.
  3. Explain why the target/resource fits, include an attention prompt and follow-up check, and let the student change format, choose a smaller step, skip, or pause.
  4. Save the plan's content/evidence versions and selection reason. Handle insufficient eligible items/resources without inventing them.
- **Verification:** Exercise cold start, introduction to an untaught concept, current-unit difficulty, insufficient time, prerequisite uncertainty, unavailable resource, and empty catalogue. Candidate content must not become an approved recommendation.
- **Done:** Today can start a bounded useful session and show the reason for selection without compulsory deficit messaging.
- **Exclusions:** Weekly multi-subject optimization, free-form tutor chat, live web search, and inferred learning-style classifications.

## B13 — Run sessions and preserve attempts

- **Purpose:** Capture what the learner actually did under known conditions, even after refresh or repeated clicks.
- **Dependencies:** B08 and B12.
- **Implementation:**
  1. Display the saved activity/item version and collect numerical answers with units or a short explanation. Persist the answer and conditions before evaluating it.
  2. Record hint use, revealed answers, retries, prior item exposure, practice/reassessment mode, and explicit external assistance when known. Persist exposure when it happens, including across refresh.
  3. Use a stable submission key with database enforcement so repeated submissions have one effect. Resume committed sessions after restart and distinguish unsaved edits from committed answers.
  4. Keep resource offered/opened/self-reported completed/helpful as separate engagement events; none directly update learning state.
- **Verification:** Refresh after a hint, reveal then answer, double-submit, retry a failed save, and restart after commit. Confirm one effective attempt and retained assistance/exposure; no success UI appears before persistence succeeds.
- **Done:** A learner can pause/resume without losing committed work, and later scoring receives the exact answer/item/assistance record.
- **Exclusions:** Video watch tracking, provider analytics, hidden time-based effort inference, and background AI assessment.

## B14 — Score checked answers and give truthful feedback

- **Purpose:** Provide specific encouragement tied to observable work while keeping assessment uncertainty visible.
- **Dependencies:** B11 and B13.
- **Implementation:**
  1. Apply the item's checked numerical key, unit rules, equivalent forms, and tolerance. Validate syntax without executing learner input; preserve the original response.
  2. For explanations, use the declared rubric and explicit reviewer confirmation. Until confirmed, show pending review and an achievable next step, not a guessed score.
  3. Store score source, item/rubric version, and review status separately from feedback. Use bounded templates grounded in recorded correctness, method, help, or correction evidence.
  4. Offer a smaller step after repeated difficulty. Correct-after-hint feedback acknowledges assistance; independent claims require the corresponding eligible conditions.
- **Verification:** Check correct, arithmetic-error-with-observed-method, wrong-unit, partially correct, hinted, exposed, independently correct, ambiguous explanation, and frustrated/paused cases. Verify feedback never invents effort, progress, or correctness.
- **Done:** Outcomes and feedback are traceable, appropriate to the evidence, and useful even when a human rubric decision is pending.
- **Exclusions:** Automatic free-text grading, personality labels, shame, streak penalties, peer comparisons, and unlimited generated feedback.

## B15 — Add later reassessment and progress

- **Purpose:** Close the loop with fresh evidence and an understandable account of change.
- **Dependencies:** B13 and B14.
- **Implementation:**
  1. Schedule a later check using an explicit simple policy and clock abstraction. Show due review on Today; elapsed time alone never declares learning lost.
  2. Select reserved eligible unseen items at the intended depth. Check all recorded exposure; changing an item's version does not automatically make the same question unseen.
  3. When eligible items are exhausted, state that a fresh checked item is needed and offer ordinary practice with the correct label. Do not relabel repeated practice as independent reassessment.
  4. Run the same save/scoring/evidence pipeline, update summaries with reasons, and show evidenced achievements, uncertainty, and one next step. Keep engagement and demonstrated learning visibly distinct.
- **Verification:** Advance a fake clock; check due-date boundaries; exercise unseen, previously exposed, hinted, and exhausted-bank cases. Complete the synthetic assessment → support → practice → later check → explained-progress flow and inspect its provenance.
- **Done:** The complete manual cycle is runnable, resumable, and auditable with no model credentials. Record G01/G02/G04/G05/G07/G08 evidence achieved so far and remaining gates; do not claim full pilot readiness.
- **Exclusions:** Automatic forgetting diagnoses, causal learning-effect claims, a comprehensive weekly planner, and real student participation without the later readiness gates.

On completion, update [build state](../BUILD_STATE.md) with the working demo, validation results, content-review gaps, and next task. Continue to M2 through the central roadmap; do not stop merely because this file ends.
