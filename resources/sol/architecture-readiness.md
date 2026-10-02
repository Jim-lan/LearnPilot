# Architecture tasks and readiness instructions

This file expands A01–A21 from the design backlog into instructions for the implementation worker. Complete the relevant design work alongside its first dependent feature. Do not postpone the entire synthetic prototype until every real-world question is answered. Existing recommendations and contracts are the starting point, not a reason to repeat all research.

Record actual choices in [decisions.md](decisions.md), concrete contracts in code/schema with focused notes where needed, and implementation evidence in [BUILD_STATE.md](BUILD_STATE.md). A full architecture redesign belongs in a bounded review request describing the observed problem.

## A01 Reconcile requirements

Read the section-by-section review in ../../docs/architecture-review.md and the latest user direction. Preserve the small scope and positive-feedback/resource-support requirements. Identify any newer conflict, record the superseding decision, and update only affected tasks. Done when the selected milestone has a clear goal and exclusions; do not rewrite every document.

## A02 Define pilot boundary

For engineering, use D03 synthetic circuits, a fictional student, one unit and a fictional marked assessment. Record actual course/teacher coverage/reviewer/material availability as O02/O03 when known. Do not invent real inputs. Done for prototype readiness when the fictional scenario is reproducible; real-pilot readiness remains pending until actual inputs are confirmed.

## A03 Choose use cases

Use the recommended assessment → targeted activity → reassessment flow, plus topic-introduction cold start. Make one reproducible happy-path script for each and an explicit exclusion for multi-subject weekly planning. Verify both traverse the same session infrastructure. Do not create independent products for each use case.

## A04 Define success measures

Translate G01–G12 into observable checks using B29's fixtures. Collect review time, failed imports, resource helpfulness and unseen-item results as separate measures. Leave real educational targets and comparison periods pending O06. Done when the synthetic check has an expected outcome; do not invent numerical learning-effect claims.

## A05 Select implementation options

Start from D01/D02 and the recorded alternatives. Choose compatible runtime/package versions and one dependency-management strategy during B01. Record why any necessary change preserves the lightweight single-app design. A package-install error alone is not justification for adding another runtime or service.

## A06 Define deployment boundary

Implement loopback and a trusted local OS session for the demo, documenting startup and shutdown. Separate internet requirements for provider calls and external media from local practice. Keep O01 unresolved for actual multi-device use. Do not expose the service to the home network as an incidental convenience.

## A07 Establish module boundaries

Create only folders/modules needed by the next task using C01. Document one dependency rule: UI/application orchestration calls domain rules and adapters; domain rules do not import UI, SQL driver or provider SDK. Verify by reviewing actual imports. Avoid empty interfaces for hypothetical future services.

## A08 Establish data contracts

Translate C02/C03 into the initial schema and typed records in B03/B05. Include foreign keys, stable IDs, immutable version references, origin/review fields and separate coverage/evidence axes. Use representative fixtures to show an attempt resolving to item/version and a correction resolving to source/revision. No destructive reset as a migration strategy.

## A09 Prepare public reference policy

Define the content-pack manifest and namespace, rights and review fields. Use original synthetic content when official wording rights or review are not established. Follow existing source links for actual verification when needed; label the method honestly. Done for engineering when import/versioning is tested, not when a catalogue is declared expert-reviewed without evidence.

## A10 Define private-data lifecycle

Draw a small dependency list from source → evidence → interpretation → summary/plan and from student → attempts/sessions. Use it to implement corrections, deletion and restore. For demo deletion, remove affected app-managed backups rather than preserving hidden personal history. Keep external-copy limitations and real retention choice explicit. Test this behavior with synthetic records.

## A11 Specify ingestion

Implement manual entry first, then PDF/PNG/JPEG. At B16 choose and document input byte/page/pixel limits appropriate to the parser, supported PDF variants, timeout and cleanup. Reject unsupported/encrypted/unreadable cases with a manual fallback. Define source locator format and draft/reviewed publication boundary before adding extraction.

## A12 Specify evidence policy

Implement C06/C07 as deterministic functions. Prepare paired cases where the same correct answer is unseen/unassisted versus hinted/repeated, plus missing, superseded and contradictory evidence. Each case must differ for a reason the UI can explain. No permanent learner labels or probability numbers without a separately evaluated policy.

## A13 Specify items and feedback

Define numerical units/tolerances and short-answer rubrics, review provenance, item versions, practice/reassessment allocation and answer exposure. Original AI-authored items begin as drafts/automated-checked; real reviewer approval is separately recorded. Create truthful feedback examples for all required outcomes. Use C04 demo fixtures when testing approval behavior.

## A14 Specify resource recommendation

Define metadata and eligibility using C04/C08; keep candidate links out of approved student recommendations. Use a local original text fallback, and store offered/opened/helpful independently from learning evidence. Test no match, broken link, wrong depth and requested text format. Do not require live search or video hosting.

## A15 Define screens and failure flows

Before B04/B09–B17, sketch Setup, Today, Evidence, Session, Progress and Data settings in a short markdown flow or wireframe. Include save pending/failed, unknown evidence, hints, alternative explanation, source correction and empty states. Build a coherent simple UI with keyboard support. Add only screens needed for the current task.

## A16 Specify model operations

Implement fake/disabled adapters first using C09. Define bounded extract/map and optional explain outputs and shared validation. Choose a real provider/model only when implementing B20 with current official documentation. Keep operation and schema versions visible in private diagnostics; do not leak private content into debug logs.

## A17 Specify reliability

Identify transaction boundaries, idempotency keys, interrupted import/model state and current-revision checks. Use consistent DB-plus-file snapshots and staged restore in M4. Simulate errors and restart; demonstrate absence of duplicate attempts or lost committed work. A backup button without a tested restore does not complete this task.

## A18 Specify privacy and access

For the demo, enforce local host/origin/file/secret boundaries and no live sending by default. Identify exactly what an enabled provider operation sends. Keep family visibility, retention and real data processing pending O04/O05. Technical implementation can pass while G11 remains pending; avoid confusing a UI checkbox with real consent or secure role isolation.

## A19 Define evaluation cases

Implement the reference cases in the high-level backlog and map each to a contract/gate. Expected answers must be authored or independently checked, not copied from the system output under test. Record untested areas clearly. Include both educational-rule and recovery/security cases, then a complete browser journey.

## A20 Evaluate extension

During B29 add a small second synthetic pack, an updated curriculum version, and fake provider variant. Verify that old history resolves and core rules are unchanged. Document the changes required for a second student/remote access; do not implement hosted accounts or synchronization unless requested.

## A21 Maintain handoff

At each task boundary update BUILD_STATE and any decisions that changed. Check the next task's dependencies against actual code and tests, not just a checked box. Keep each task's done condition specific. A new implementation session should be able to resume from the checkpoint without the prior conversation.

## Prototype readiness gate

M0 can begin with D01–D12 and minimal A05–A08/A16/A18 contracts as documented. M1/M2 can run on labelled synthetic content. Before real student use, actual O01–O06 inputs as applicable and G11 must be settled. Continue independent engineering while those are pending; never claim them resolved by elapsed time.
