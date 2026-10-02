# M0 — Project and persistence foundation

Implementation instructions for the future build. This document does not mean these tasks are implemented.

Read [the working contract](../contracts.md), [build state](../BUILD_STATE.md), [architecture review](../../../docs/architecture-review.md), and [task backlog](../../../docs/task-backlog.md) before starting. The provisional synthetic prototype is one Next.js/TypeScript application, SQLite, private local files, and a disabled live model. Select supported compatible dependency versions when building, pin them with the lockfile, and record the choice. Do not add a second service.

Use the repository's actual state rather than assuming files already exist. Preserve unrelated work. After every card, update the central build state with changed files, commands/results, remaining limitations, and the next unblocked task. Continue to that task without asking for routine completion approval. Unresolved real-family choices do not block a clearly labelled synthetic prototype; they do block claims of pilot readiness.

## B01 — Establish the single application

- **Purpose:** Give every subsequent task a reproducible runnable application with one installation and startup path.
- **Dependencies:** Provisional A05–A07 choices recorded in the central decision log; no application assumed.
- **Implementation:**
  1. Inspect the repository and any instructions; initialize the smallest supported Next.js/TypeScript application that meets the contracts. Avoid overwriting existing documentation or work.
  2. Select one package manager and compatible runtime/framework versions using official documentation at build time. Commit the resulting lockfile and document the required runtime.
  3. Add development, build, production start, lint, typecheck, and relevant test commands. Render a basic synthetic-prototype page without student data.
  4. Document clean installation, local startup, stopping, and where configuration will live. Record decisions and any environment limitations.
- **Verification:** Install from the lockfile in a clean temporary checkout/directory; run typecheck, lint, production build, and a local startup smoke check. If a platform restriction prevents a check, report the exact unverified command rather than claiming success.
- **Done:** A new developer can start the same application using documented commands and the required checks pass. If a platform restriction prevents verification, leave B01 blocked or pending verification with the exact unverified command recorded. No global package installation is required.
- **Exclusions:** Deployment, hosted databases, native wrappers, Docker orchestration, design systems, and production marketing pages.

## B02 — Separate runtime data, fixtures, and secrets

- **Purpose:** Prevent synthetic examples, private records, and configuration from being mixed or exposed.
- **Dependencies:** B01.
- **Implementation:**
  1. Define one configurable absolute application-data root with distinct database, attachments, temporary work, and diagnostic locations. Choose a user-private default outside source control and static assets; tests use temporary directories.
  2. Validate configuration on startup. Produce a useful error for an unwritable or invalid root and avoid quietly switching to an unexpected storage location.
  3. Add appropriate ignore rules and a placeholder-only environment example. Load any future credentials only in server code; no browser-exposed environment variable may contain secrets.
  4. Keep committed fixtures visibly synthetic in their own directory. Document that app data must not be placed in a live shared/synchronized database folder.
- **Verification:** Exercise a temporary custom root and an unwritable root. Confirm fixture import does not write into tracked directories, runtime artifacts are ignored, and a sentinel secret is absent from delivered browser assets/responses.
- **Done:** Runtime paths are explicit and inspectable; keys, private logs, databases, and uploaded artifacts cannot be accidentally served from the public directory or committed by normal operation.
- **Exclusions:** Secret vault services, custom encryption, cloud storage, and real student-data import.

## B03 — Implement persistence and migrations

- **Purpose:** Establish durable records and relationships before screens start inventing independent state.
- **Dependencies:** B02 and the logical data contract for A08. Contracts describe responsibilities, not a requirement for one table per noun.
- **Implementation:**
  1. Choose a maintained SQLite access approach compatible with the selected runtime. Keep SQL/persistence inside small server-side storage functions.
  2. Introduce numbered migrations and migration history. Implement the initial stable IDs, versions, private ownership, and relationships needed by M1; add later tables through migrations when needed.
  3. Enable and verify foreign-key enforcement on every connection. Provide short transaction helpers and explicit failure behavior; external/model calls cannot run inside a transaction.
  4. Represent evidence lineage using a stable record ID and distinct revision identity. Keep classroom coverage, evidence/review status, and assistance fields separate. Derived summaries must retain the policy and evidence versions used.
  5. Provide a safe development reset restricted to the selected synthetic/test data root. Never drop a populated user database during normal startup or migration failure.
- **Verification:** Initialize an empty database; rerun migrations without duplication; reject an invalid reference; roll back a deliberately failed multi-record operation; upgrade a populated baseline through the current migrations without losing IDs/relationships. Preserve that baseline case for future migrations.
- **Done:** Schema and migration commands are documented; persistence survives process restart; tests demonstrate referential integrity and transaction rollback. Record any future migration gate still awaiting a real schema change.
- **Exclusions:** Multiple database engines, an ORM-independent framework, an event-sourcing platform, database sync, and production data seeding.

## B04 — Build the shell and protect local requests

- **Purpose:** Create the six application areas and establish the actual single-computer boundary.
- **Dependencies:** B01; provisional A06/A18 default to one trusted OS session with loopback access. Use B02 configuration when present.
- **Implementation:**
  1. Add accessible navigation for Setup, Today, Evidence, Session, Progress, and Data settings. Include empty, loading, failed-save, and not-found states with clear next actions.
  2. Bind the documented startup path to loopback by default. Implement allowlisted Host/Origin handling and same-origin/token protections for mutations using the selected framework's supported mechanisms; explicitly handle absent headers.
  3. Mark student pages/responses private and non-cacheable. Keep personal data out of framework shared caches and static generation.
  4. Show a visible synthetic-mode indicator and a concise statement of local storage/model-disabled behavior. A reviewer/student view selector, if useful, must not claim separate account security.
- **Verification:** Navigate the shell by keyboard with visible focus and useful page titles. Test a permitted mutation and hostile Host/Origin mutation requests. Inspect response/cache behavior and confirm a second browser context does not receive a shared cached personal response.
- **Done:** Navigation and error paths work; local startup and request protection behavior are demonstrated, not merely described. No remote exposure is enabled.
- **Exclusions:** Authentication, distinct parent accounts, LAN access, hosted access, polished visual branding, and unrelated settings.

## B05 — Define model boundaries and a deterministic fake

- **Purpose:** Let application development and failure testing proceed with no credentials, cost, or network dependency.
- **Dependencies:** B03 and A16 contract. The live model remains disabled.
- **Implementation:**
  1. Define typed, bounded inputs/outputs only for operations actually needed later, such as draft extraction/mapping and a short explanation. Use operation IDs and explicit success, unavailable, invalid-output, and interrupted/error results.
  2. Implement one deterministic fake adapter using synthetic fixtures, plus disabled behavior. Do not call a real provider or automatically fall back to one.
  3. Validate outputs at the same application boundary a future provider will use. Check structure, permitted values, lengths, and referenced known IDs; reject invented concepts, sources, or URLs.
  4. Record adapter/prompt/schema identifiers in relevant draft results. Model output cannot publish reviewed evidence or directly mutate learning summaries.
- **Verification:** Test valid output, malformed output, unknown references, timeout/unavailable simulation, and repeated operation handling. Run the demo with all API keys absent and network unavailable.
- **Done:** Consumer code depends on the typed boundary, the fake is repeatable, failure states remain usable, and no model credential is needed for M1.
- **Exclusions:** Real-provider SDKs, automatic prompt tuning, multi-provider routing, token dashboards, background queues, and AI-generated assessment content.

At M0 completion, record the exact commands and verified boundaries in [build state](../BUILD_STATE.md), then continue to [M1](M1-learning-loop.md). A scaffold is not a completed learning application.
