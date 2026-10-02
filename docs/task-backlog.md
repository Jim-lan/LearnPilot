# Architecture and build task backlog

Prepared 2026-10-02. This is the task inventory for the initial product level, followed by explicitly deferred expansion. Current implementation status is tracked in [BUILD_STATE](../resources/sol/BUILD_STATE.md). IDs, dependencies and acceptance conditions are intended to make work practical for Sol after the design is reviewed.

## Status and sequencing

Architecture status meanings: **Documented** means this review supplies a proposed answer; **Partial** means the policy exists but a concrete contract or fixture is still needed; **Open** means an essential user/workflow fact is not yet known. Documented does not mean approved or tested.

The main design is [architecture-review.md](architecture-review.md). Existing student experience requirements remain in [personalized-learning.md](personalized-learning.md). The original brief is reconciled by section in the architecture review.

Complete architecture work A01–A21 to the depth needed for the selected milestone. Do not turn the checklist into a prolonged design project: a short decision record, a concrete example and an acceptance check are normally sufficient. Keep unresolved real-data and deployment facts out of the synthetic prototype's critical path where possible.

## Architecture tasks for deep review

| ID | Task and required output | Status | Dependency |
| --- | --- | --- | --- |
| A01 | Reconcile original brief and later requirements; distinguish retained goals, superseded roadmap/stack hypotheses, and exclusions. | Documented in architecture review | None |
| A02 | Confirm pilot course/unit, classroom scope, reviewer, student goal, and available sanitized material. | Open; SNC1W circuits is proposed | A01 |
| A03 | Compare three initial use cases and choose a primary complete flow plus cold-start path. | Documented; assessment-to-practice recommended | A01 |
| A04 | Define baseline, learning outcomes, effort/cost tolerances, and pilot evaluation criteria; distinguish product checks from causal claims. | Partial; functional gates below, user outcome thresholds open | A02, A03 |
| A05 | Compare local reference strategies and application stacks; record choices and rejected complexity. | Documented | A01 |
| A06 | Decide device/access pattern, startup and installation approach, offline boundary, and local versus hosted deployment. | Open; one-computer assumption | A02, A05 |
| A07 | Define one application's module responsibilities and dependency direction. | Documented | A05, A06 |
| A08 | Produce a compact logical schema with IDs, relationships, provenance, revisions, ownership and separate coverage/evidence axes. | Partial; contracts in review, concrete schema needed | A07 |
| A09 | Define the pilot curriculum pack, versions, attribution, rights, original concept mappings, and update procedure. | Partial; policy documented, actual content unreviewed | A02, A08 |
| A10 | Define private data retention, corrections, recomputation, export, deletion and backup expiry, including deletion after restore. | Partial; retention choices open | A06, A08 |
| A11 | Specify supported upload and response formats, review states, source locators, duplicate import behavior and manual fallback. | Partial; initial boundary below | A02, A08 |
| A12 | Define evidence eligibility, assistance/exposure, uncertainty, contradiction, prerequisite and reassessment rules with examples. | Partial; descriptive policy proposed | A04, A08 |
| A13 | Define approved item/rubric contracts, numerical scoring rules, feedback examples, and practice/reassessment separation. | Partial; actual checked items needed | A02, A12 |
| A14 | Define resource matching, reviewed metadata, availability checks, fallback, and student helpfulness feedback. | Documented policy; catalogue review outstanding | A09, A13 |
| A15 | Sketch onboarding, Today, evidence review, study session, progress and data settings; cover all failure and correction paths. | Partial; flow described, wireframes needed | A03, A11–A14 |
| A16 | Specify bounded model operations, output validation, provider configuration, prompt/version metadata, error behavior and fake adapter. | Partial; interface details needed | A07, A11–A13 |
| A17 | Specify transaction boundaries, idempotency, interrupted work, migrations, backup/restore and private diagnostics. | Documented requirements; implementation contracts needed | A08, A10, A16 |
| A18 | Resolve actual local access, secrets, file boundaries, outgoing data, consent/visibility and real-data processing policy. | Partial; deployment and family choices open | A06, A10, A16 |
| A19 | Prepare sanitized reference cases with expected extraction, evidence and feedback outcomes; map tests to gates G01–G12. | Partial; scenario inventory below | A04, A11–A18 |
| A20 | Evaluate adding another unit, curriculum version, model and student; identify concrete migration triggers. | Documented | A07–A18 |
| A21 | Review this backlog and the Sol handoff against accepted decisions; freeze the next milestone's small scope. | Draft supplied | A01–A20 as relevant to milestone |

## Proposed initial input and user experience boundary

Support typed/manual evidence as a complete first route. Then add PDF, PNG and JPEG as private evidence attachments with preview and manual question/answer entry. Automated extraction is a later milestone in this first-release backlog; mixed handwriting and circuit diagrams always have a review/manual path. DOCX, HEIC, spreadsheets, LMS feeds and arbitrary URL imports are deferred unless the actual pilot cannot work without one of them.

Allow numerical answers with units and short explanations initially. Treat diagrams as reviewable attachments; do not promise automatic circuit-diagram understanding. Student explanations and practical evidence use checked rubrics and reviewer confirmation. Pick upload limits and supported PDF behavior during B16 based on the selected parser and fixtures; reject unsupported input explicitly.

Six UI areas are enough: Setup, Today, Evidence, Session, Progress, and Data settings. Reviewer actions can be in the same trusted installation during the pilot. If private parent/student accounts are required, A06 and A18 change before a real-data release.

## Implementation tasks

All B tasks are **not started**. The core sequence is M0 → M1 → M2, followed by M4 and M5. M3 adds optional AI assistance after M2; only explicitly conditional checks in M4/M5 depend on it. Tasks within a milestone may run independently only when their listed inputs exist. Each task must leave runnable work and a short validation result; design documents alone do not satisfy a build task.

### M0 Project and persistence foundation

M0 depends on recorded provisional A05–A08 choices plus the minimal fake-model and local-access contracts from A16/A18. It can use synthetic data while real-data and family-specific policy remains open.

| ID | Task | Depends on | Acceptance |
| --- | --- | --- | --- |
| B01 | Set up the chosen single-runtime application, lockfile, lint/typecheck and run instructions. | A05–A07 | A clean install starts the app; production build/check command is documented; no unnecessary second service. |
| B02 | Establish runtime data/config paths, ignore rules, synthetic fixture separation and server-side secret handling. | B01 | No student files, database, keys or private logs are tracked or served as static assets. |
| B03 | Implement initial schema, migrations, foreign-key enforcement and transaction helpers. | B02, A08 | A new DB initializes; invalid relationships fail; a migration preserves a representative older fixture. |
| B04 | Create the browser shell, accessible navigation, error states and local request protections. | B01, A06, A18 | Loopback-only startup by default; unexpected origins/hosts cannot perform mutations; no personal response enters a shared cache. |
| B05 | Add deterministic fake model and typed module contracts with operation identifiers. | B03, A16 | Tests and demos run without credentials; invalid fake output is rejected just like provider output. |

### M1 Reviewed content and a complete manual learning cycle

M1 proves product usefulness without depending on OCR or live AI. Content creation is part of the build effort, not an assumed free input.

| ID | Task | Depends on | Acceptance |
| --- | --- | --- | --- |
| B06 | Create and import the small pilot curriculum/concept pack with provenance and rights status. | B03, A02, A09 | Exact selected version is pinned; official wording and original annotations are distinct; duplicate imports do not create duplicate concepts. |
| B07 | Review and register a small resource catalogue and original text fallbacks. | B06, A14 | Every student-facing link is item-reviewed and mapped; candidate links stay hidden; unavailable video has a useful alternative. |
| B08 | Author and check roughly 20–30 original items, including independent checks, keys, units and rubrics. | B06, A13 | Each item has version/review metadata; enough unseen checks remain for reassessment; no unchecked generated item is served. |
| B09 | Implement setup for a minimal student, current unit, classroom coverage, goals, time and preferences. | B04, B06 | Coverage and understanding remain separate; preferences can change; unknown coverage is representable. |
| B10 | Implement manual evidence entry and review using a sanitized marked assessment. | B03, B06, A11 | Source origin, mark origin, item location and review status are stored; unreviewed evidence cannot affect current conclusions. |
| B11 | Implement descriptive evidence summary rules and prerequisite flags. | B08–B10, A12 | Unknown stays unknown; assistance is distinguished; links show supporting evidence; conclusions state the scope actually demonstrated. |
| B12 | Implement target selection and a short plan with one resource and bounded alternatives. | B07, B11 | Selection fits goal, taught scope or explicit introduction, prerequisites and time; user sees the reason and can choose an alternative. |
| B13 | Implement the session runner with answer save, hints, exposure and duplicate-submit protection. | B08, B12 | A saved attempt survives refresh; duplicate clicks produce one effective attempt; answer exposure is retained. |
| B14 | Implement checked numerical scoring, reviewer-confirmed rubric outcomes and positive feedback. | B11, B13 | Wrong/partial/hinted/independent cases get truthful specific feedback; score source and review state are visible. |
| B15 | Implement later reassessment, Today review-due list and progress summary. | B13, B14 | Uses unseen eligible items; elapsed time only marks review due; new evidence updates the summary with a reason. |

### M2 Evidence files and corrections

| ID | Task | Depends on | Acceptance |
| --- | --- | --- | --- |
| B16 | Add bounded PDF/PNG/JPEG upload staging, private storage and safe preview. | B02, B10, A11 | Invalid/oversized files fail clearly; attachment paths cannot escape storage; incomplete imports are recoverable or cleaned up. |
| B17 | Add side-by-side source and evidence review with question/page/region locators. | B16 | Reviewer can correct unreadable text and marks; every imported observation resolves to its retained source or clearly labelled manual entry. |
| B18 | Implement evidence revisions and dependent-state invalidation/recomputation. | B11, B17 | A corrected answer cannot leave an old contradictory claim silently current; stale recommendations are labelled or replaced. |
| B19 | Add curriculum/resource update handling and historical references. | B06, B07, B18 | Updating a pack does not remap old evidence silently; retired resources disappear from new recommendations but history remains understandable. |

### M3 Optional AI assistance with a controlled first integration

M3 is part of the AI-enabled pilot, but the M1–M2 app remains usable without it. Start with one provider and extraction/mapping, then add explanations if they improve the workflow.

| ID | Task | Depends on | Acceptance |
| --- | --- | --- | --- |
| B20 | Add one provider adapter, bounded requests, output validation, timeouts, retry cap and model/prompt version metadata. | B05, A16, A18 | No provider call holds a DB transaction; invalid output and timeouts preserve student work; credentials stay server-side. |
| B21 | Add AI draft extraction and proposed expectation/concept mappings. | B17, B20 | Model references must resolve to known IDs; a reviewer accepts/corrects drafts before evidence changes. |
| B22 | Optionally add bounded topic explanations and tentative error interpretations with source/evidence references, if the pilot benefits. | B11, B14, B20 | Unsupported claims are withheld; generated content is labelled; raw model output cannot change learning state. |
| B23 | Add model-disabled mode, transmission notice/choice, cost counters and interrupted-operation recovery. | B20 and whichever AI operations are enabled | Core practice continues with AI unavailable; interrupted operations are visible; retry cannot create duplicate evidence or hidden unlimited calls. |

### M4 Recovery and data control before real student use

Foundations appear in M0; complete these checks before real data regardless of whether M3 is enabled.

| ID | Task | Depends on | Acceptance |
| --- | --- | --- | --- |
| B24 | Implement versioned export and consistent DB-plus-attachment backup with hashes/manifest. | B03, B16, A10, A17 | Backup identifies exact schema and content versions and contains every referenced retained artifact. |
| B25 | Implement safe restore with validation and a clean-instance recovery drill. | B24 | Pilot data, history and attachments recover; a corrupt or incompatible backup fails without overwriting a working installation. |
| B26 | Implement deletion and bounded cleanup for sources, student records, derivatives, temporary output and app-controlled backups. | B18, B24, A10 | No deleted evidence remains in a current recommendation or search; external backup limitations are disclosed; restore respects the agreed deletion policy. |
| B27 | Verify agreed privacy/access boundary and dependency/file/secret handling. | B04, B16, B23 if AI enabled, A18 | Local and outgoing data behavior matches the UI; no role-security promise is made from a view toggle; real-data settings are documented. |
| B28 | Add minimal diagnostics, failed-save recovery, disk-full behavior and startup/upgrade recovery instructions. | B03, B18, B25 | Errors are actionable without logging private work; no save success is shown for failed persistence; migration recovery is demonstrated. |

### M5 Validate and prepare the pilot handoff

| ID | Task | Depends on | Acceptance |
| --- | --- | --- | --- |
| B29 | Build and run the reference-case suite against review, learning rules, feedback, resource selection and optional AI; demonstrate a second small synthetic pack and curriculum revision. | B15, B18, B19, B23 if enabled, A19 | Expected results and discrepancies are recorded; G12 extension checks pass; confirmed serious false claims or wrong keys block pilot use. |
| B30 | Run browser workflow and accessibility checks on the selected device. | B17, B19, B26–B29 | Full loop works using keyboard; diagrams/equations are readable; refresh, broken link and offline cases have a usable path. |
| B31 | Run a supervised pilot baseline/session/reassessment and measure reviewer burden and student feedback. | B29, B30, resolved A02/A04/A06/A10/A18 | User-authorized pilot completes; observations distinguish independent learning from engagement and other help. |
| B32 | Produce synthetic release notes, known limitations, recovery guide and next backlog; document the tested content-extension example from B29. | B25, B29, B30 | Another person can run/restore the app; the extension example and its verified limitations are documented. Real-pilot findings from B31 remain pending until available. |

## Acceptance gates

| Gate | Required evidence |
| --- | --- |
| G01 Complete cycle | Sanitized assessment → reviewed observation → targeted activity → specific feedback → unseen later check → explained update. |
| G02 Traceability | Every consequential claim resolves to eligible evidence and exact item/curriculum versions. |
| G03 Correction | Changing an extracted answer invalidates/recomputes dependent results and records the change. |
| G04 Honest uncertainty | Missing, blurry, unreviewed or contradictory work produces an appropriately qualified result, not a confident gap. |
| G05 Independent evidence | Hints, answer exposure, repeated items and resource clicks cannot count as independent demonstration. |
| G06 Useful resources | Approved links and original fallbacks fit the intended depth; incorrect or retired resources are not selected. |
| G07 Honest encouragement | Feedback cases cover mistakes, partial success, supported success, independent progress and frustration without invented praise. |
| G08 Safe interruption | Refresh, duplicate submit, model timeout, failed save and process restart preserve committed work without duplication. |
| G09 Recovery and deletion | Restore a coherent backup in a clean instance; delete data and inspect dependencies and backup policy. |
| G10 Provider independence | Fake/offline paths keep core workflows usable and a different adapter can satisfy the same validated contract. |
| G11 Real-data boundary | Reviewer, device/access, source rights, retention, visibility and any external AI processing are settled. |
| G12 Extension | A new pack and curriculum revision work without changing the core learning loop or silently rewriting history. |

Mandatory gates are pass/fail safety and correctness checks. Learning gain, time saved, resource helpfulness and repeat use are pilot observations with agreed targets, not invented universal success thresholds.

## Reference cases to prepare

At minimum cover a correct unseen numerical answer; wrong arithmetic with correct method; wrong unit; hinted correct answer; answer revealed before response; repeated item; missing answer; unreadable circuit diagram; model-invented expectation ID; a teacher mark that conflicts with the visible work; correction of an earlier score; contradictory later evidence; broken video link; insufficient review items; disabled/failed model; duplicate submission; interrupted import; disk-full save; curriculum version change; and backup restore followed by deletion-policy checks.

The reviewer labels the expected outcome and allowed uncertainty for each case. Keep synthetic fixtures in the repository and real student data outside it. Implement meaningful regression checks for data integrity and learning rules rather than snapshots that merely repeat implementation output.

## Deferred feature tasks and their triggers

| ID | Feature | Reconsider when |
| --- | --- | --- |
| F01 | More units and subjects | The first cycle is useful and new content can be reviewed. |
| F02 | Multiple students and distinct parent accounts | A real second user needs access; build authorization and isolation first. |
| F03 | Hosted access or home-network access | Required devices cannot use the trusted local installation; revise A06/A18 before enabling exposure. |
| F04 | School/LMS/calendar integrations | Manual entry burden is measured and authorized integration access exists. |
| F05 | Rich conversational tutor | Evidence and content boundaries work reliably and conversation solves an observed need. |
| F06 | Automatic practice generation | Item correctness, rubric validation and review capacity are established. |
| F07 | Additional formats and advanced handwriting/diagram extraction | Actual input failures justify the extra parser and evaluation work. |
| F08 | Live resource discovery, video embedding or transcript ingestion | Curated links demonstrably fail to cover needs and permissions are resolved. |
| F09 | Full-text/semantic retrieval | A larger permitted collection exceeds structured lookup effectiveness. |
| F10 | Background workers, multiple servers or PostgreSQL | Measured workloads or hosting constraints require them. |
| F11 | Multi-device offline sync/native packaging | Required usage patterns justify conflict resolution and distribution complexity. |
| F12 | Advanced mastery models, gamification, commercial plans and broad parent dashboards | Evidence of product value and appropriate evaluation exists; assess each separately. |

## Ready for Sol

The implementation handoff should include the accepted architecture decisions, milestone ID, exact task IDs, supporting fixtures and acceptance gates. First ask Sol to complete M0 and demonstrate persistence with synthetic data, then M1's complete manual loop. Do not ask it to build all F tasks or switch deployment assumptions implicitly. See [Sol handoff](sol-build-handoff.md).
