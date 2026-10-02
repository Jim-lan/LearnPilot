# M3 — Optional, bounded AI assistance

Read [worker instructions](../README.md), [contracts](../contracts.md), [decisions](../decisions.md) and [build state](../BUILD_STATE.md). The [project backlog](../../../docs/task-backlog.md) defines M3 as optional to the working manual app. Start after the relevant M2 dependencies. Fake/offline operation remains the default.

The Codex model writing this app and the model called by the finished app are separate choices. Never hardcode Astra/Sol or assume the user's subscription supplies runtime API access. Implement the adapter and mock checks without keys. Record live-provider verification as pending when unavailable, then continue dependency-ready work in M4/M5; do not create permission or credential loops.

## B20 — One provider adapter and validated operation lifecycle

**Purpose:** Isolate optional external AI behind a small, testable boundary without making it responsible for durable learning state.

**Dependencies:** B05; A16/A18 contracts. Real student transmission additionally needs the recorded real-data/provider policy; synthetic mock implementation does not.

**Steps:**

1. Extend the typed adapter with only enabled operations: extraction/mapping first, explanation later. Inputs declare operation ID, input revision IDs, selected source locators, allowed catalogue IDs, prompt/schema version and size/output bounds. Use the same validator for fake and live results.
2. Implement one configured provider using its current official SDK/API documentation, consulted when coding. Pin dependency versions and record the selected runtime model in server configuration. Keep secrets out of the browser, repository, analytics, prompts and logs.
3. Keep external access off by default and require configured provider, explicit enablement and permitted data classification before dispatch. Code cannot infer authorization from the presence of an API key. Use synthetic requests for an optional authorized live smoke check.
4. Persist an operation record before dispatch: unique action key, input fingerprint/revisions, status, attempts and bounded metadata. Commit this transaction, call the provider outside it, validate the response, then commit the resulting draft using revision checks. Never hold a DB transaction while waiting on a network request.
5. Bound input bytes/pages, output length, concurrency and time. Choose documented provisional limits such as one request at a time, 45-second timeout and at most one retry for eligible transient errors. Avoid retries for invalid requests/output, authentication failure or refused content; expose a manual fallback.
6. Validate shape, enums, string/array limits, known concept IDs and every source/evidence reference. Reject invented catalogue identifiers or out-of-range locators. Uploaded text is data, including any instruction-like text; it cannot change the operation's instructions, tools, URLs or privileges.
7. Define states such as queued, running, succeeded, failed, interrupted, cancelled and stale. Catch an unavailable provider as a recoverable operation error, not a failed save of the original student work. Do not persist raw provider payloads/private prompt bodies for debugging by default.
8. Keep adapter results incapable of directly writing accepted observations, scores or learning summaries. All consequential mutation goes through reviewed application services and their existing idempotency/revision contracts.

**Meaningful verification:** Mock valid output, malformed JSON/schema, invented IDs, oversized response, timeout, throttling, authentication failure and prompt-injection text inside a fixture. Assert bounded attempts, intact source records, no leaked key/payload and no open database transaction during a delayed call.

**Done when:** Fake and mocked-provider contract tests pass and the app remains usable with no key. Report implementation verification separately from the named provider/model/date of any actual live smoke check; never claim a live integration was verified by mocks alone.

**Non-goals:** Multiple providers, autonomous tools, model-selected URLs, provider fine-tuning, unrestricted chat or live real-student processing before its explicit policy is resolved.

## B21 — Draft extraction and proposed mappings

**Purpose:** Reduce review typing while retaining human control over evidence quality and interpretation.

**Dependencies:** B17, B20; B18 revision protection must be available before accepting asynchronous results.

**Steps:**

1. Add a review-screen action selecting an existing private source and bounded pages/regions. Show the selected content and expected destination under B23's transmission control; do not send the entire student history by default.
2. Build a bounded extraction request from the selected source revision. Prefer the minimum text/image content needed for the operation and only approved relevant curriculum/concept identifiers. Do not upload arbitrary public documents or fetch a model-proposed URL.
3. Return draft question/response/visible-mark fields, source locators, uncertainty flags and proposed known concept/expectation IDs. Separate transcribed marks from AI interpretation. Missing, ambiguous and unreadable fields remain unknown; numeric model confidence is not a validated probability.
4. Store validated draft results linked to operation and source revisions. Display source beside draft with original/extracted text distinctions. Permit per-observation edits, acceptance and rejection using B17; do not accept a whole document because parsing succeeded.
5. Publish only explicit reviewer acceptance through existing evidence services, then recompute by B18. Deduplicate publication by source observation/revision and acceptance key. Re-running extraction creates another draft candidate rather than a second attempt or an overwritten review.
6. If source/evidence changes, is deleted or becomes ineligible during the call, discard/invalidate the late result before publication. Preserve reviewed work when the provider fails or returns less useful output; offer manual completion.

**Meaningful verification:** Use synthetic clear print, handwriting ambiguity, unreadable circuit, missing answer, teacher-mark conflict, invented expectation ID and text saying “ignore previous instructions.” Compare against hand-labelled expected fields. Prove uncertainty stays visible, nothing updates state before review, repeated acceptance creates one observation and a late result cannot undo a manual correction.

**Done when:** Valid drafts help complete the same manual workflow with traceable locators and explicit review. Record extraction errors and reviewer correction burden; do not claim diagram understanding from a successful prose extraction.

**Non-goals:** Automatic assessment grading, automatic independent-learning judgments, generated item banks, new document formats or guaranteed handwriting recognition.

## B22 — Grounded explanations and tentative error interpretations

**Purpose:** Offer a short alternative explanation and constructive feedback when reviewed content leaves a clear instructional need.

**Dependencies:** B11, B14, B20; B07 approved resources and B18 invalidation. This feature is optional; record an explicit deferred decision if the pilot can proceed without it.

**Steps:**

1. Scope two small actions: explain one selected concept at the pilot level, or propose a tentative reason for one reviewed error. Use approved original/reference excerpts and selected evidence only; label the second action as an interpretation, not a diagnosis.
2. Require output to include the specific supported explanation, known source/evidence IDs, uncertainty and a bounded next step. Resolve citations in the app to retained records or approved external resource entries. A syntactically valid citation is insufficient if the response does not support its claim.
3. Keep short, age-appropriate output and a format choice such as worked example or simpler explanation. Offer the reviewed text/resource alternative. Do not generate assessed questions or answer keys through this operation.
4. Label generated assistance and its sources. Show a correction/report action. Withhold invalid or unsupported output and fall back to reviewed content; do not invent curriculum claims, causes of mistakes, praise or new external links.
5. Keep feedback tied to observable work: acknowledge correct method, identify a unit check or offer a smaller step. Any displayed hint/solution relevant to an active item must update assistance/exposure before the next answer can be counted as independent.
6. Store only necessary structured results with operation, prompt/model and evidence/content revision metadata. Mark explanations stale after source corrections and exclude stale content from new sessions. No model output modifies learning status, reviewer scores or coverage directly.

**Meaningful verification:** Evaluate reference cases for wrong units, correct method with arithmetic error, ambiguous response, partial success, frustration and unsupported material. Check source support as a separate content review, not just schema validation. Confirm a shown solution changes assistance eligibility and generated praise never asserts unobserved progress.

**Done when:** The enabled action improves the reviewed flow in a small documented comparison and passes groundedness/feedback checks, or is explicitly deferred with the manual alternative and reason recorded. A deferred B22 is not falsely marked implemented.

**Non-goals:** Open-ended tutoring, psychological diagnosis, automated mastery assessment, motivational scoring, claims of proven learning gains or unrestricted internet retrieval.

## B23 — Offline mode, transmission choice, budgets and recovery

**Purpose:** Make external processing optional, visible and bounded while preserving committed student work through interruptions.

**Dependencies:** B20 and each enabled B21/B22 operation. Implement the dispatch controls before enabling any live call; this task's numeric ordering is not permission to postpone them.

**Steps:**

1. Add settings for disabled/fake/live provider mode. Fake mode visibly identifies synthetic results; disabled mode retains source review, reviewed resources, practice, scoring and progress. Never silently substitute a live provider when fake/offline execution fails.
2. Before external dispatch, show provider/destination and selected data categories/pages, plus a clear choice to continue manually. Apply the recorded policy/choice at its declared scope; avoid repeat confirmations for unchanged authorized scope. Renew the choice when destination or transmitted scope materially changes.
3. Implement per-operation input/output/time/retry limits and a configurable session/day request or token budget. Track returned usage; distinguish reported usage from estimates and unknown usage after timeout. Mark prices as configuration with a verification date, not a guessed subscription entitlement.
4. Track cancellation/interruption durably. On startup, detect abandoned running operations and mark interrupted; offer inspect/retry instead of unlimited automatic replay. Cancellation after transmission cannot promise provider-side cancellation or zero billing.
5. Retry using the same logical action identity and current revision checks. Use provider idempotency if supported, but assume a request with unknown outcome may have been charged. Explain that uncertainty and cap retries; local idempotency still guarantees one effective accepted evidence publication.
6. Reject responses for deleted sources, changed revisions, cancelled operations or revoked processing scope. Dispose of temporary payloads under retention rules. A disable action prevents new dispatch and makes in-flight outcome visible without accepting stale results.
7. Keep a small private operation log of IDs, times, states, usage and sanitized error codes. Do not log assessment content, secrets or full prompts. Expose enough detail for retry/manual recovery without adding an analytics service.

**Meaningful verification:** Run the complete manual cycle with network unavailable and model disabled. Test budget exhaustion, unknown usage after timeout, process restart mid-call, double-click dispatch, response arriving after source deletion/correction and cancellation. Verify no hidden replay, duplicate publication or leaked request body, and that student answers persist throughout.

**Done when:** M3 can be switched off without breaking core learning; enabled operations obey declared transmission limits and recover visibly. Record mock coverage, remaining live-provider checks and any unresolved real-data policy separately in [build state](../BUILD_STATE.md), then continue ready M4/M5 tasks.

**Non-goals:** Automatic credit purchases, changes to Codex subscription/model settings, promises that Plus covers API costs, unbounded background retries or blocking all development while credentials are missing.
