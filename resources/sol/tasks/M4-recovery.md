# M4 — Recovery and data controls

Build these tasks against synthetic data on one trusted local computer. Read [contracts](../contracts.md), the architecture review, and [BUILD_STATE](../BUILD_STATE.md) first. M3 is optional; apply AI checks only to enabled operations. Record completed checks, failures, and the next ready task in BUILD_STATE. A missing family policy blocks real-data readiness, not independent synthetic implementation.

## B24 Versioned export and coherent backup

**Purpose:** Preserve the evidence, history, and files needed to recover the application.
**Dependencies:** B03, B16; the synthetic retention and backup contract from A10/A17.

**Bounded steps**
1. Define a versioned manifest containing application/schema versions, content-pack versions, creation time, relative file paths, sizes, and hashes. Distinguish a readable/exportable data representation from a complete restorable backup.
2. Include private records, referenced retained attachments, and the reference-pack versions needed to interpret history. Exclude credentials, diagnostic logs, transient model output, and unrelated files.
3. Use a supported SQLite snapshot operation; briefly pause writes and file deletion while taking the snapshot and copying its referenced attachments. Release the pause on success or failure.
4. Write to a temporary destination, validate the assembled bundle, and publish it only after completion. Partial output must not appear as a valid backup.
5. Use the documented app-owned private backup directory for synthetic runs; application exports use an explicitly selected local destination. Document that bundles contain sensitive data and record app-managed backup metadata. Do not invent an encryption format.

**Verification:** Back up a fixture containing an attachment, correction history, attempts, and two curriculum versions. Check manifest hashes and references. Simulate a missing file and failed destination write; neither may report success or corrupt live data. Demonstrate that concurrent application changes cannot produce mismatched database/file generations.

**Done:** A validated export and complete backup exist; commands or UI steps and evidence are recorded. Restore verification belongs to B25.
**Exclusions:** Cloud backup, synchronization, remote storage accounts, scheduled backup infrastructure, and unrequested private-data export.

## B25 Safe restore and recovery drill

**Purpose:** Prove that the backup recovers a usable application without destroying an existing installation.
**Dependencies:** B24.

**Bounded steps**
1. Restore into a new empty private directory by default. Keep the source backup and any working application data unchanged.
2. Validate manifest/schema compatibility, declared files, sizes, hashes, and the archive structure before activation. Reject absolute paths, parent traversal, unsafe links, oversized expansion, and unsupported future versions.
3. Validate the staged SQLite database, foreign-key relationships, attachment references, and required content versions. Hash matching checks integrity; it does not establish that an untrusted backup is safe.
4. If an older supported schema needs migration, migrate the staged copy with the normal migration path. Do not edit the source archive or live database during validation.
5. Start an isolated instance using the restored directory, inspect evidence and history, and run one new synthetic attempt. Document switching to restored data and returning to the original directory without a blind overwrite.

**Verification:** Restore the B24 fixture into a clean instance and compare logical records, revisions, attachments, and a recomputed summary. Reject a bad hash, missing attachment, malicious archive path, and unsupported schema. Confirm the original installation still works after every rejected restore.

**Done:** The clean-instance recovery drill is repeatable, and failures leave both original data and the backup intact. Add the B26 deletion-policy restore check once B26 is ready.
**Exclusions:** In-place destructive overwrite, merging installations, automatic downgrade, and cross-device synchronization.

## B26 Deletion and bounded cleanup

**Purpose:** Remove selected private information and its effects without leaving misleading current conclusions.
**Dependencies:** B18, B24; use B25 to verify restoration behavior. A10 family retention choices may remain pending for synthetic work.

**Bounded steps**
1. Define and show deletion scope for a source and for a whole student: retained files, reviewed observations, attempts where applicable, interpretations, recommendations, derived state, and temporary output. Preserve unrelated public reference packs and unrelated evidence.
2. Use transactions for database changes and durable cleanup records for file removal. If file removal fails, show cleanup pending and retry safely; do not claim full deletion.
3. Invalidate affected summaries and plans immediately, then recompute from eligible remaining evidence. Remove deleted content from application views, lookup results, and app-controlled caches.
4. For the synthetic baseline, invalidate and remove affected app-managed backups that could restore deleted records; keep this registry outside a restored database. A failed removal remains visible. Document the limitation of user-created or externally copied archives.
5. Give new temporary files an explicit bounded lifetime and clean abandoned staging artifacts safely. Never traverse outside app-owned paths or delete unrelated user files.
6. Record provisional retention assumptions separately from accepted family policy. Restoring an external old copy can reintroduce data; disclose this and require the selected restore policy to handle it explicitly before real use.

**Verification:** Delete one source among several and check related claims disappear while unrelated records survive. Delete a synthetic student, retry cleanup after a simulated file failure, and reject an invalidated managed backup. Inspect a restored current backup for the expected remaining records.

**Done:** Application deletion, pending cleanup, managed-backup invalidation, and limitations are demonstrated. Do not claim secure physical erasure or automatic control over external copies.
**Exclusions:** Remote deletion services, cryptographic erasure guarantees, and an invented real-family retention period.

## B27 Local privacy controls and real-data boundary

**Purpose:** Verify the actual local access and transmission behavior, while keeping family signoff distinct from technical checks.
**Dependencies:** B04, B16; B23 if AI is enabled; the provisional local A18 contract.

**Bounded steps**
1. Verify loopback startup and host/origin/mutation protection. For the home-network mode explicitly authorized on 2026-10-05, additionally verify D15's bound interface, direct peer subnet check, header stripping and loopback-only backend publishing. LAN tests use synthetic data; public hosting remains outside scope. See docs/home-network.md.
2. Check attachment access, path handling, private/no-store responses, browser/shared caches, ignored runtime paths, and server-side secret loading. Use synthetic canary values to inspect logs and exported bundles.
3. Inspect installed dependencies and the selected upload parser for relevant findings; fix or record concrete unresolved risks. Do not add an enterprise security platform.
4. With a fake provider, inspect exactly which fields each enabled operation sends. Confirm disabled mode makes no provider request and that transmission notices match behavior.
5. Document the trusted OS-session boundary. A reviewer/student view switch does not establish confidential account separation.
6. Record two separate outcomes: technical controls for the synthetic demo, and G11 real-data readiness. The latter requires actual device, reviewer, rights, retention, visibility, and permitted AI-processing decisions.

**Verification:** Attempt disallowed origins and attachment paths; inspect no-store behavior and synthetic logs. Capture fake-provider payloads and disabled-mode call counts. Record checks that could not be performed rather than claiming a security certification.

**Done:** Required technical checks pass; unresolved control defects keep that work incomplete. B27 synthetic work may finish with G11 still pending; missing consent or policy must never be inferred from silence or prior prototype authorization.
**Exclusions:** Real student uploads, live-provider transmission of private work, hosted accounts, penetration-test claims, and legal signoff invented by the agent.

## B28 Diagnostics and failed-save recovery

**Purpose:** Make local failures understandable without losing committed work or exposing student content.
**Dependencies:** B03, B18, B25.

**Bounded steps**
1. Record minimal operation IDs, error categories, and bounded diagnostic context. Exclude answers, source contents, credentials, and raw model prompts.
2. Acknowledge saves only after commit. Preserve the user's unsaved input visibly where possible; avoid placing private drafts in an undocumented browser-persistence store.
3. Handle read-only storage, unavailable paths, insufficient disk space, and interrupted imports without false success or duplicate records. Retry the same logical operation safely.
4. Detect pending cleanup, interrupted operations, and failed upgrades at startup. Offer an actionable recovery path using documented data directories and B25 restoration.
5. Write startup, data-location, backup, upgrade, and recovery instructions using commands verified in the built app. Keep logs bounded and document their cleanup.

**Verification:** Inject storage failures through the storage boundary; do not fill the user's disk. Interrupt a staged import and a synthetic migration, restart, and verify committed evidence remains available. Inspect captured diagnostics for synthetic sensitive canaries.

**Done:** Failure messages, persistence behavior, restart recovery, and recovery instructions have executable evidence in BUILD_STATE. A failed save never appears as a completed learning action.
**Exclusions:** Centralized telemetry, tracing clusters, automatic repair by resetting the database, and destructive fault injection on user data.
