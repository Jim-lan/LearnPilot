# M2 — Evidence files, review and corrections

Read [worker instructions](../README.md), [contracts](../contracts.md), [decisions](../decisions.md) and [build state](../BUILD_STATE.md) first. Implement against the existing manual learning cycle; preserve its offline route. Task IDs and dependencies come from the [project backlog](../../../docs/task-backlog.md). This file specifies work to do, not work already completed.

Use synthetic PDF/PNG/JPEG fixtures only until the real-data gate is satisfied. One TypeScript application owns SQLite and private attachment storage. Make bounded implementation choices within these contracts and record them; do not request routine approval or introduce another service.

## B16 — Bounded uploads, private storage and safe preview

**Purpose:** Retain the source behind an observation without exposing private work or trusting arbitrary uploaded content.

**Dependencies:** B02, B10; A11 input boundary. Existing manual evidence remains functional.

**Steps:**

1. Define upload limits in server configuration and UI. Start with one file/request, 10 MiB/file, 10 PDF pages and 20 megapixels/image unless the chosen parser requires tighter bounds. Bound decoded/rendered size, parse time and concurrent parsing; record actual supported limits.
2. Accept only PDF, PNG and JPEG. Check file signature and parser validation independently of extension/browser MIME. Reject malformed, encrypted/password-protected, oversized and unsupported documents with actionable messages. Do not accept SVG, HTML, archives or arbitrary URLs.
3. Allocate an opaque attachment ID and stable import key before work. Store the original filename as display metadata only; derive storage paths from application IDs inside the private root. Reject traversal, symlink escape and caller-supplied absolute paths.
4. Stage the file privately and record digest, measured type, size and import state. Finalize by atomic rename on the same filesystem, then commit its available state; recognize that filesystem and SQLite changes are not one transaction. Define recovery for each interruption point, including orphaned staged/final files and metadata whose file is missing. Never expose a half-imported attachment as complete.
5. Detect retries using the import key. A repeated request resolves to the same import; a matching content hash prompts reuse of the existing source instead of silently creating another assessment. Hash equality does not merge different students or independent assessment events.
6. Render preview through a maintained, pinned parser with script/actions/external retrieval disabled. Prefer bounded raster/canvas pages; expose no active PDF attachments, embedded HTML or document links. Decode/re-encode image previews and remove unnecessary metadata. Do not use shell interpolation or execute uploaded files.
7. Serve previews through the protected server/file-store boundary, with private/no-store, correct MIME and nosniff behavior. Originals, if downloadable, use attachment disposition. Keep originals, previews and temporary files outside public/static directories.
8. Add import states and UI for validating, ready, failed and interrupted, plus retry/remove actions. Expire abandoned staging files within a documented bound without removing committed sources. Retain manual entry when a file cannot be processed.

**Meaningful verification:** Use a valid multipage assessment, malformed PDF, extension/MIME mismatch, password-protected PDF, oversized image/file, traversal filename and a document containing active actions or external references. Prove preview processing executes no document action or external request. Interrupt before/after rename and database commit, restart, then verify repair/cleanup and exactly one logical import on retry.

**Done when:** Valid sources remain private and readable after restart; all limits are enforced server-side; rejected files cannot become evidence; failures have a manual/retry path. Record fixture results and configured limits in [build state](../BUILD_STATE.md).

**Non-goals:** OCR, DOCX/HEIC, cloud object storage, public URL import, arbitrary PDF feature support or virus-scanning claims that have not been implemented and verified.

## B17 — Source and evidence review

**Purpose:** Let the reviewer compare each observation with its source, repair uncertainty and make provenance visible.

**Dependencies:** B16; reuse B10 manual entry, B06 concepts and the existing review contract.

**Steps:**

1. Build a two-pane review screen: safe source preview and editable draft observations. Keep an accessible stacked layout for small screens. Preserve zoom/page context while editing a question.
2. Store a question label, page number and optional normalized rectangular region with the source revision. Validate page/region bounds; keep manual entries explicitly labelled with their origin rather than manufacturing file locators.
3. Capture question text, student response, visible mark, mark origin, optional reviewer rubric outcome, proposed concepts, extraction uncertainty and reviewer notes as separate fields. Preserve “missing,” “unreadable” and “unknown” instead of replacing them with zero/wrong.
4. Provide save-draft, accept-reviewed and reject actions. Acceptance requires valid source location or labelled manual origin, declared assistance/exposure where known, and resolvable concept/item references. Unknown assistance cannot be silently promoted to independent evidence.
5. Save edits before showing success and protect against refresh loss. Use expected record revision on writes; a second tab with an outdated revision gets a reconcile/reload message rather than overwriting later work.
6. Require explicit reviewer resolution for a teacher mark conflicting with visible work. Keep the original mark and reviewed interpretation distinguishable; only accepted observations become eligible inputs to B11.
7. Make “show source” work from current evidence, interpretation and progress views. If retention later removes a source, show that state and its effect on traceability rather than a broken preview or invented locator.

**Meaningful verification:** Review a synthetic page with an unreadable circuit diagram, an omitted answer and an inconsistent teacher mark. Correct text and marks, navigate away/reload, and accept only selected observations. Confirm drafts do not change learning state, accepted observations resolve to the correct page/region, and concurrent stale saves cannot overwrite the accepted version.

**Done when:** A reviewer can create, inspect, correct and publish an observation using keyboard controls; every published observation resolves to a retained source or labelled manual origin. Existing manual entry needs no upload.

**Non-goals:** Automatic handwriting/diagram understanding, separate parent/student accounts or approval of a whole document merely because upload succeeded.

## B18 — Evidence revisions and dependent-state repair

**Purpose:** Ensure that correcting an observation also corrects conclusions and plans that used it.

**Dependencies:** B11, B17; provenance, version and mutation contracts in [contracts](../contracts.md).

**Steps:**

1. Introduce immutable accepted evidence revisions with stable logical observation ID, revision ID, superseded revision and reason. Keep editable drafts separate. Retain prior revisions subject to deletion policy; do not turn the entire app into an event-sourced system.
2. Make acceptance/correction idempotent using a stable action key and expected current revision. A transaction supersedes the prior revision, stores the new one and invalidates affected derived records. A duplicate click/retry returns the committed result.
3. Identify affected interpretations, concept summaries, target selections and uncompleted plans by their recorded evidence references. Recompute using current eligible evidence and rule version. No AI request occurs inside this transaction.
4. If recomputation cannot finish with the write, commit an explicit stale/pending state and finish deterministically on next read/recovery. Do not display an invalidated claim as current while repair is pending.
5. Preserve completed sessions and the historical reason they used, visibly linking to corrected/superseded evidence. For an active session, preserve already-saved attempts, notify the user of the changed recommendation and prevent starting an invalid remaining recommendation until refreshed.
6. Reject late asynchronous extraction/explanation results if their input revision no longer matches current source/evidence/content revisions. Allow inspection of an obsolete draft only with clear labelling and retention limits; never publish it automatically.
7. Cover corrections from correct to wrong, wrong to correct, hinted to independent and the reverse, concept remapping, observation rejection and contradictory newer evidence. Reuse one invalidation path for later deletion work in B26.

**Meaningful verification:** Start with an accepted wrong answer and its plan, correct it, and assert the current conclusion/plan changes while the history remains understandable. Repeat the request and force failure between invalidation and recomputation; restart and verify no stale claim appears current. Deliver a model result produced against the old revision and verify it cannot overwrite the correction.

**Done when:** Every consequential derived record carries dependency revisions and a current/stale/superseded distinction. Corrections repair the affected scope reproducibly, preserve committed attempts and satisfy G03/G08 without duplicating evidence.

**Non-goals:** Global rebuild after every edit, full event sourcing, distributed jobs or deletion/backup implementation already assigned to M4.

## B19 — Curriculum and resource versions without rewritten history

**Purpose:** Update reference material while preserving what earlier evidence and sessions actually used.

**Dependencies:** B06, B07, B18; versioned catalogue contracts.

**Steps:**

1. Import a new pack/version beside its predecessor using stable conceptual identity plus exact version IDs. Validate references, provenance, review/rights states and schema before activation. Make repeated import of the same pack digest idempotent.
2. Provide an explicit active-version selection for future sessions. Do not overwrite old official wording, concept mappings, item keys or resource metadata that historical records reference. A proposed cross-version mapping requires review.
3. Record resource revisions, reviewed availability and retirement separately from historical snapshots. Retired/unreviewed links must disappear from new selections; prior sessions retain title/version/context and show an unavailable notice with an approved alternative.
4. Keep a current session pinned to its saved versions unless the reviewer explicitly refreshes it. If a reference is found materially incorrect, invalidate affected active recommendations via B18 and record the reason; do not silently rewrite old attempts or scores.
5. Use local reviewed metadata for availability changes. This task does not add a background crawler, URL importer, video downloader or automatic transcript ingestion. If a proposed pack lacks rights/mapping review, keep it inactive and continue using the existing pack.

**Meaningful verification:** Import a synthetic second pack version with one changed expectation mapping and a retired video. Confirm old evidence still resolves to the old version, new recommendations select only approved active material, duplicate import adds nothing, and a rejected update leaves the active pack usable. Verify an offline original text alternative works.

**Done when:** A curriculum/resource update can be applied and explained without rewriting history or changing the core learning loop. Record this fixture for B29's G12 extension checks.

**Non-goals:** All-province curriculum ingestion, automatic equivalence between versions, routine fetching from public websites or a general content-management system.
