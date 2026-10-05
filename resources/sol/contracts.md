# Shared implementation contracts

Version 0.1, 2026-10-02. These contracts make the task cards consistent. They guide a small implementation; they are not a demand for one table, service or class per concept. Refine exact SQL and TypeScript types in B03/B05 and record material changes in decisions.md.

## C01 Application and file boundaries

One browser UI and one application server own all persistence. Domain modules must not import UI code or a provider SDK. The provider adapter does not write student state. Use simple services/functions for catalogue, evidence, learning/session, model and storage concerns.

Suggested code locations are `src/app/` for UI/routes, `src/domain/` for learning rules, `src/server/` for orchestration/storage/model adapters, `content/` for redistributable original/reference packs, and `tests/fixtures/` for synthetic cases. Adapt names to the selected framework once, rather than maintaining duplicate architectures.

Keep runtime files under a configured private data directory: database, attachments, staging, app-managed backups and temporary output. It must be outside static asset directories and ignored by Git. Browser responses never contain local filesystem paths or API keys. Browser storage can hold ephemeral UI preferences, not the sole copy of evidence. Do not put a live SQLite file in a cloud-sync or network-shared folder.

Default startup listens on loopback. The user's 2026-10-05 request additionally authorizes home-network sharing through the host LAN gateway, bound to one selected private IPv4 interface and checking the real socket peer's subnet. The Next backend stays loopback-only on the host (also for Docker publishing). Reject unexpected Host/Origin and protect mutation requests, including uploads. Use framework-supported protections and explicit local routes, not an exposed filesystem browser. Private pages/API responses must not be shared-cacheable. LAN mode trusts devices on the selected home subnet. Alex and Vincent have separate synthetic learner IDs and progress, but the profile picker is not authentication or role separation; any reachable device can switch profiles. Router forwarding, VPN routing and public tunnels must not extend that boundary; see docs/home-network.md and D15.

## C02 Identity and versions

Give durable objects stable application-generated IDs. Display names and URLs are attributes, not primary keys. Every student-dependent record has a student reference. The current two-profile cookie selects a student ID for page reads and all mutations, but is not an authorization boundary. Future real-data use needs actual access control.

Reference records have pack ID/version, course/version, expectation code where applicable, and source metadata. The unique key for an official expectation includes jurisdiction, course, curriculum version and code. Codes such as D2.3 cannot be globally unique. User-facing original concept names map to expectations through explicit reviewed mapping records.

Practice items have an immutable content version. Attempts reference that exact version. Content edits create a new version; mark old content retired for new sessions without breaking retained history. Changes to authoritative text, answer keys, mappings and scoring policy cannot silently rewrite old results.

Persist dates in a consistent machine format and display in the configured user timezone. Use an injectable clock for scheduled checks in tests. Do not sleep for days to simulate reassessment or claim a synthetic future-time test is a real delayed learning outcome.

## C03 Minimum record groups

| Group | Required information |
| --- | --- |
| Catalogue | Pack/version; course/expectations; source provenance; original concepts and prerequisite edges; mapping-review status; rights status |
| Resources | Canonical URL or original local text; provider; concept/purpose/depth; accessibility facts; review/version/availability; fallback |
| Student context | Pseudonymous display name; course/unit; goal/time/preferences; separate coverage observations; upcoming assessment date if entered |
| Evidence | Source/manual origin; question/version; response; teacher/user/model mark origin; rubric; exact locator; review status; immutable revision lineage |
| Practice | Session/mode; item/version; submitted answer; assistance/exposure history; score source; review status; timestamps; idempotency key |
| Interpretations | Type; structured claim; evidence revision IDs; uncertainty; mapping/policy/model/prompt versions; draft/reviewed/superseded status |
| Learning summary | Student/concept; eligible evidence references; coverage; observed result; assistance; sufficiency; contradiction flag; review due; policy version |
| Operations | Import/model/recompute job ID and bounded status; input version references; last error code; retry count; provider request reference if available |

Use relational columns for identity, ownership, statuses and joins. Small validated JSON fields are acceptable for structured answer content or provider drafts; do not put the entire domain into one opaque JSON blob. Enforce foreign keys per connection, uniqueness and explicit transactions.

## C04 Content review and demo mode

Keep these statuses independent:

- Rights: `unknown`, `link_only`, or a recorded permission/licence for the specific intended use.
- Mapping review: `candidate`, `verified`, `rejected`, with actual reviewer/method/date.
- Content validation: `draft`, `automated_checked`, `reviewer_approved`, `retired`.
- Availability: `unchecked`, `available`, `unavailable`, with check date and method.
- Data environment: `synthetic_demo` or `real`; never infer this from a student's name alone.

A reachable URL is not a content-quality review. A model's self-check is not expert approval. Do not fabricate reviewer identities, permissions, durations, captions, timestamps or curriculum wording. Resource and mapping checks performed during development must describe their actual method and limitations.

Engineering can proceed with fictional students, assessments and original demo items. Fixture records may simulate approved states only inside isolated demo/test data, with an explicit simulated-review marker. Synthetic curriculum records use a `demo:` namespace and must not impersonate official expectations. If genuine expectation IDs are used as candidates, their text and mapping flags must reflect actual verification.

For the real-pilot catalogue, only appropriately reviewed content is eligible. In demo mode, clearly labelled original automated-checked items and fixture mappings can demonstrate the flow; no screen or completion report may call that a validated Ontario curriculum package. Keep candidate external links in reviewer preview, not as approved recommendations. An original text explanation is the no-network fallback.

## C05 Evidence review and correction

Imported evidence moves through staged/draft, needs_review, reviewed, or rejected states. Source type and reviewer are retained. Typed evidence is legitimate when labelled manual and reviewed through the same publication path. A numerical teacher mark and an app-generated score are separate observations with different origins; neither should erase the other.

Draft extraction or classification cannot alter current learning summaries. Review validates required fields, known concept/expectation IDs, answer/mark origin and locators. Commit the accepted revision and its current pointer transactionally.

Corrections create a new revision and retain superseded history subject to deletion policy. Track dependencies sufficiently to mark affected interpretations, summaries and active plans stale. Recompute synchronously for small local changes; if interrupted, leave an explicit dirty marker and suppress stale claims until recomputed. Use a source/evidence generation check to reject a late model result for a superseded or deleted revision.

Source files and database transactions are not a single atomic system. Stage and validate files privately, move them to their final private path, and publish database references only when the file exists. Recover/clean orphaned staged files on restart. Do not expose half-imported evidence as reviewed. Reference files by opaque IDs and safe locators, never trust a client-supplied path.

## C06 Attempts and evidence eligibility

Save submitted answers before optional model evaluation. Use a server-enforced idempotency key for retries of the same submission. A genuinely new answer attempt gets a new ID and remains in history. Refreshing the page or repeating the same HTTP request must not create another effective attempt.

Record hints, solution reveal, prior item exposure and reported assistance with event time. Persist a hint/reveal event before serving that content so reconnecting cannot hide assistance. Never send a hidden answer key to the client before the defined reveal/grading point. A session mode is `practice` or `reassessment`; both can record assistance, but assistance disqualifies an independent-evidence label.

For the two-profile synthetic flow, the learner may tap one outside-help button during a topic quiz. Schema 9 stores an active flag on the session and logs the first report. All answers submitted after activation in that session are assisted, including later questions; earlier saved attempts keep their original status. The button is not shown after an answer has been submitted until the next question. Item hints and solution reveals remain item-specific. No per-question help radio is required. Choosing a new session resets the topic-wide flag.

Eligibility requires an accepted observation, known item version, appropriate review/scoring provenance, and no superseded/deleted dependency. The first presentation for the current attempt does not itself disqualify an unseen item; prior presentation, prior attempt, hint or reveal does. Track assistance as known-none, recorded-assisted or unknown. Only a fresh item with known-none assistance supports an item-scoped independent demonstration; imported work with unknown assistance does not. Even known-none does not prove no help occurred outside the application. Phrase claims according to what was observed, and allow the student to report external help.

Do not treat resource openings, self-reported completion, study time, smiles or session completion as evidence of understanding. Store offered/opened/reported-complete/helpful events separately.

## C07 Learning state policy version 0

Use a conservative descriptive summary, with separate fields for classroom coverage (`unknown`, `not_yet`, `in_progress`, `covered`), evidence sufficiency, observed results, assistance and review validity. Domain tests must include an untaught topic with successful prior evidence.

For a first policy:

1. No eligible evidence → say there is insufficient evidence; offer an introduction or diagnostic.
2. Reviewed error → describe the error on that item; an error cause remains a hypothesis unless more evidence supports it.
3. Correct supported response → acknowledge success with the recorded support.
4. Correct eligible unseen response with known-none assistance → say the student demonstrated this skill on this item; name the evidence.
5. Mixed later results → show mixed evidence and recommend a check, preserving earlier successes.
6. Elapsed time → make review due, without automatically changing understanding to weak.

Do not output a global mastery percentage or claim broad proficiency from a single item. Policy changes require a version, regression cases and recomputation semantics. A material expansion of inference rules is an architecture decision, not a prompt-only change.

## C08 Selection, practice and positive feedback

Use deterministic filtering for known concept, teacher scope or explicit introduction goal, prerequisite need, review status, available time and requested format. Prefer one useful action; offer at most two alternatives. If evidence is weak, ask a small diagnostic rather than inventing a priority. An upcoming date can prioritize an eligible topic but must not invent coverage.

Each resource recommendation contains the exact catalogue version, a reason, an attention prompt and an original follow-up check. Link to canonical reviewed destinations without student data in URL parameters. No arbitrary URL fetching, live student search or provider analytics is required. If a resource fails, offer the original text/practice route.

Items define answer type, accepted units/equivalent forms, numerical tolerance where needed, rubric and intended concept. Do not use eval or execute user-entered expressions. Short explanations/diagrams need rubric review; a model assessment stays tentative. Keep reassessment items withheld from practice and record exposure when displayed. If no unseen items remain, disclose that limitation and avoid an independent-reassessment claim.

Feedback describes an actual observed success or strategy, addresses an error kindly, and gives one attainable next step. Do not infer effort from time, praise wrong answers as correct, invent improvement, label permanent ability, or penalize breaks. Refer to [feedback examples](../../docs/personalized-learning.md).

The user requested points and brief correct-answer celebrations on 2026-10-05. Reward policy `correct-answer-v1` grants 10 points once per learner/item version after a deterministic correct score commits, regardless of recorded help. Keep awards durable, idempotent and separate from understanding. Incorrect/pending answers and manual teacher-mark entries do not award points. Schema 8 backfills existing checked correct attempts once. An ineligible/withdrawn score cannot contribute to the current total, and deleting an attempt cascades its award. The 1.5-second visual respects reduced motion; static feedback remains. Old device forms must not submit or expose hints for a different current item. No leaderboards, streak loss, or penalties for breaks are introduced.

## C09 Model operations

Implement one small adapter contract with fake and later one real implementation. Explain/interpret inputs are bounded selections of reviewed reference/evidence records. Extract/map drafts may consume bounded staged, unreviewed source pages, clearly labelled as untrusted input; their outputs cannot become reviewed evidence without human review. Outputs are structured results validated for schema, known IDs, locators and evidence references. Do not expose a generic model-controlled database mutation tool.

Record operation ID, exact input record revisions, prompt/schema/model version, response status, usage if supplied, and bounded error information. Raw reasoning or unlimited conversation history is not required. Missing usage numbers remain unknown. Do not log secrets or raw private prompts by default.

Operations transition through pending, running, succeeded, needs_review, failed, interrupted or cancelled states as appropriate. Reconcile running operations on restart to interrupted; do not automatically replay an uncertain paid request forever. A repeat may cost money even when local writes are idempotent. Bound retries/timeouts/output, show the state, and verify the evidence revision is still current before applying a result.

No remote call occurs inside a DB transaction. No key means fake/disabled mode, not an error that prevents ordinary practice. Live mode requires configured credentials, current provider documentation and explicit enabled settings; real student content additionally requires the real-data policy. The model used by the development worker is unrelated to the model selected for the application's runtime.

## C10 Recovery, export and deletion

Define a manifest with schema/export version, timestamp, content-pack versions, included DB/attachment names and hashes. Use a consistent supported SQLite snapshot and coordinate attachment writes/deletions for the snapshot. Validate restores in a staging directory before replacing any working installation; preserve a recovery copy until replacement passes.

Archive extraction must reject path traversal, absolute paths, symlinks and unreasonable expanded sizes. Open restored DBs through a controlled validation/migration path, not as trusted executable configuration. Never import credentials from an archive. Export intended for portability includes documented data and provenance, not secrets or full debug logs.

Deletion removes current private sources and all affected evidence, attempts, interpretations, summaries and app-controlled caches according to the selected scope. Invalidate pending operations referencing deleted input. Audit retention is not an exception to promised private-data deletion. For the synthetic baseline, invalidate and remove affected app-managed backups, keeping a minimal invalidation registry outside the restored database; a failed removal stays visible and its backup cannot be restored by the app. Disclose that manually copied/exported files cannot be recalled. Define the real-family backup policy before a pilot.

A restore screen must identify that an older external backup can reintroduce deleted data. Do not automatically restore it during normal startup or call restored historical data current without reconciliation. Synthetic tests exercise these paths; the real family retention and backup policy remains a separate pending choice.

## C11 Validation and release boundaries

Acceptance gates G01–G12 are behavioral checks, not a claim of educational efficacy. Store synthetic engineering results separately from external review and live-pilot evidence. Enabling the real-data pilot requires the real-world prerequisites in G11. An engineering release can be a useful local synthetic prototype with G11 explicitly pending.

For each meaningful failure test assert the result and the absence of unintended writes or false learning claims. Verify after restart where durability matters. Restore testing must inspect actual restored attachments and relationships, not just archive file existence. A second synthetic pack demonstrates extensibility without authorizing broad subject expansion.

Record the exact commands and outcomes in BUILD_STATE. Changes to dependencies, schema, policies, provider or deployment require rerunning the affected checks and invalidating stale evidence. Routine documentation edits do not require an application test suite.
