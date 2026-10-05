# LearnPilot build state

Last updated: 2026-10-05 after the two-profile, subject, French listening, and quiz-wide help update.

This is the single implementation status record. M0 is implemented; a synthetic M1 learning path is runnable. The app is not ready for real student information.

## Resume checkpoint

- Current phase: M1 synthetic learning-loop implementation; home-network, reward, and two-profile extension implemented.
- Current task: U03 two-profile/subject/French/quiz-wide help extension verified in synthetic engineering and loopback browser checks. B07–B08, B09, and B11–B15 remain incomplete against their full cards; B18 remains partial.
- Next task: finish B07/B08 resource review and item rubric scope, then B11–B15 acceptance cases before M2 attachment work.
- Exact next action: inspect the current Git state, then add a controlled resource-review path, explanation-item review behavior, and a later-check browser fixture. Preserve the working synthetic loop, LAN boundary, rewards policy and nine numbered migrations. Review docs/home-network.md before changing deployment.
- Default authorized-build interpretation: this user request started the app; future continuation should follow the active request scope and the sequence in README.md.
- Current owner: current build task until handoff.
- Working implementation: Alex/Vincent profile chooser, subject/topic selector, synthetic Today/practice, topic-wide outside help, French browser speech examples, per-learner Progress, manual evidence correction, LAN sharing and encouragement points. Initial build was published as 3885064; the current extension is recorded in the following Git commit. Inspect `git status` and `git log` before resuming.
- Running process: native LAN launcher on interface en0, port 3000, with backend 127.0.0.1:3100 and synthetic data at `/private/tmp/learnpilot-lan-rewards-oct5`; restarted after U03 and returned health/schema 9. A separate loopback U03 browser preview is running on port 3004 and `/private/tmp/learnpilot-family-smoke-oct5`. Check current address with `npm run lan:info`. Optional container test was stopped gracefully; its synthetic named volume is retained. A previous computer-only server may still own 127.0.0.1:3000; inspect before stopping or replacing any process.
- Data/migration effects: schema 9 adds a durable outside-help flag to sessions. The original schema-8 reward ledger remains. Alex and Vincent use new durable learner IDs; historical `demo:student:local` records are preserved separately and are not automatically reclassified. Migration/restart/isolation tests pass. Native and Docker storage are separate by default; no records were transferred. No real student data was used by the development tests.
- Next engineering milestone: finish M1, then M2.
- Real-data pilot: not ready; O01–O06 remain unresolved as applicable.

## Command registry

| Capability | Actual command | Last result |
| --- | --- | --- |
| Install | `npm ci` | Passed in workspace and a separate temporary clean copy on 2026-10-02 |
| Development start | `npm run dev` | Command configured; not separately smoke-tested |
| Production build/start | `npm run build`; `LEARNPILOT_DATA_DIR=/private/tmp/learnpilot-family-smoke-oct5 npm run start -- -p 3004` | Build and U03 loopback browser flow passed 2026-10-05 |
| Lint/typecheck | `npm run lint`; `npm run typecheck` | Passed 2026-10-05 |
| Unit/integration tests | `npm test` | 19 tests passed through migration 9 on 2026-10-05, including network policy, rewards and stale forms |
| Browser tests | Manual in-app browser against `http://127.0.0.1:3004` | Vincent → French → help once → two supported correct answers → Alex with zero points passed 2026-10-05; earlier manual evidence flow passed 2026-10-02 |
| Database migrate | Automatic numbered migrations on first database open | Restart/idempotency/foreign-key/rollback tests passed through schema 9 |
| Demo seed | Choose Alex or Vincent in `/setup` (calls idempotent pack importers) | Passed in browser; original science and family starter banks loaded |
| LAN native | `LEARNPILOT_LAN_INTERFACE=en0 npm run start:lan` | Production build, LAN browser mutations, points and header/peer rejection passed 2026-10-05 |
| LAN Docker | `LEARNPILOT_LAN_INTERFACE=en0 npm run start:lan:docker` | Built, healthy, non-root, loopback-only publishing, profile persistence after restart/recreation and graceful shutdown passed 2026-10-05 (test ports 3001/3200) |
| Backup/restore | Not implemented | Not run |

Replace placeholders with actual commands and dates. Keep command results factual. Never put a provider key or private student content in this file.

## Task queue

Statuses and the distinction between engineering completion and pilot readiness are defined in [README.md](README.md). In the Evidence column, link a test/run note or concrete artifact when work completes. If existing evidence becomes stale after a change, invalidate it explicitly.

| Task | Milestone | Status | Engineering evidence or next step |
| --- | --- | --- | --- |
| B01 | M0 | done | Pinned Next.js 16.3.8/React 19.3.0; full clean `npm ci`, tests, lint, typecheck, build pass; production loopback HTTP 200 |
| B02 | M0 | done | Private configured root outside source, subdirectories and rejection tests; .env.example and ignore rules |
| B03 | M0 | done | Numbered SQLite migrations 1–9; restart/foreign-key/rollback tests; health endpoint reports schema version |
| B04 | M0 | done | Six-section shell and default loopback mode; authorized U01 LAN gateway/peer restriction, Host/Origin guard and no-store headers verified |
| B05 | M0 | done | Fake/disabled adapter, bounded draft validation and failure-state tests; no provider credentials needed |
| B06 | M1 | done | Synthetic 0.1.0 science pack and 1.0.0 original family starter pack import idempotently; science Ontario IDs are candidates and new subject packs are unmapped. Actual alignment review pending |
| B07 | M1 | in_progress | Original text works and candidate Khan/PhET links stay in reviewer preview; item-level external review/availability workflow remains |
| B08 | M1 | in_progress | 24 science numeric items and 21 exact-response family starter items, with reserved reassessments; scorer tests pass. Open-response rubric and human content review remain |
| B09 | M1 | in_progress | Alex/Vincent selection and per-learner persistence verified. Prior editable goals/time/coverage form was replaced at the user’s request; future profile-context editing remains |
| B10 | M1 | done | Manual draft/edit/review UI passed synthetic browser check; teacher mark and local result remain separate |
| B11 | M1 | in_progress | Descriptive policy/store and mixed-evidence browser flow work; full edge-case matrix and correction/recompute failure cases remain |
| B12 | M1 | in_progress | Today selects a topic and original support, saves plan evidence/content versions; time/preference alternatives and empty-catalogue cases remain |
| B13 | M1 | in_progress | Presented/hint/reveal/answer events persist; idempotent attempt integration test; resume and resource engagement event checks remain |
| B14 | M1 | in_progress | Numeric/unit and exact-text scoring, with supported/independent feedback, pass; alternative correct phrasings and short-explanation review path remain |
| B15 | M1 | in_progress | Review-due policy, reserved unseen items and Progress view exist; full later-cycle and exhausted-bank UI verification remain |
| B16 | M2 | pending | Attachment ingestion not implemented |
| B17 | M2 | pending | Source review not implemented |
| B18 | M2 | in_progress | Manual reviewed correction creates immutable revision, rejects stale tab, repairs summary and invalidates plans; attachment/model dependencies remain |
| B19 | M2 | pending | Reference updates/history not implemented |
| B20 | M3 | pending | Optional provider adapter; fake tests can run without credentials |
| B21 | M3 | pending | Optional extraction/mapping drafts not implemented |
| B22 | M3 | deferred | Optional explanations; select only if included in build scope/useful |
| B23 | M3 | pending | Required controls before enabling any M3 live calls |
| B24 | M4 | pending | Export/backup not implemented |
| B25 | M4 | pending | Restore not implemented/tested |
| B26 | M4 | pending | Deletion/cleanup not implemented |
| B27 | M4 | in_progress | U01 network engineering checks passed; attachment controls, complete privacy checks and real-data policy remain open |
| B28 | M4 | pending | Diagnostics/recovery not implemented |
| B29 | M5 | pending | Reference suite and extension demonstration not run |
| B30 | M5 | pending | Browser/accessibility validation not run |
| B31 | M5 | waiting_external | Real student/reviewer/policy/elapsed-time evidence unavailable; does not block synthetic B32 |
| B32 | M5 | pending | Synthetic release notes can follow B29/B30; real-pilot findings remain pending |
| U01 | Requested extension | done | Host LAN gateway, native/Docker launch and shutdown, exact Host/Origin and peer tests pass; second physical device, router configuration and WAN checks not independently verified |
| U02 | Requested extension | done | 10-point durable awards, 1.5-second celebration, reduced-motion CSS, totals in Subjects/Session/Progress; duplicates, assistance, wrong answers, migration, restart and stale-form tests pass |
| U03 | Requested extension | done | Alex/Vincent chooser, grade-specific subjects, separate topic summaries/points, persisted quiz-wide outside help, French word/sentence speech controls and exact-response starter items. 19 tests and loopback browser flow pass; real curriculum mapping, spoken quality and real-data access control remain pending |

## Gate evidence

| Gate | Engineering validation | Real-world limitation |
| --- | --- | --- |
| G01 Complete cycle | not_run | No real student cycle |
| G02 Traceability | not_run | Official references and actual evidence not reviewed |
| G03 Correction | not_run | None tested |
| G04 Honest uncertainty | not_run | None tested |
| G05 Independent evidence | not_run | No real learner observations |
| G06 Useful resources | not_run | Candidate links need item-level review |
| G07 Honest encouragement | not_run | Student response to feedback unknown |
| G08 Safe interruption | not_run | None tested |
| G09 Recovery/deletion | not_run | Retention choice unresolved |
| G10 Provider independence | not_run | No live provider validated |
| G11 Real-data boundary | not_passed | O01–O06 as applicable must be resolved; simulated consent cannot satisfy this gate |
| G12 Extension | not_run | Synthetic extension test not implemented |

Use `passed`, `failed`, `not_run` or `not_applicable` for actual engineering checks, with a reason for not_applicable. Real-world limitations remain separate. Passing synthetic checks is not evidence of student learning improvement.

## Blockers and external inputs

- LAN acceptance: user was asked to test another physical device. No reply is recorded yet. Router forwarding/VPN routes and outside-Wi-Fi reachability are not independently verified. This is a trusted home-subnet synthetic deployment, not authenticated or encrypted multi-user hosting.
- Dependency audit on 2026-10-05: runtime container prune/audit reported zero production advisories. Full `npm audit` reported five high entries in the dev-only Next ESLint → fast-glob → micromatch → braces chain (GHSA-vfj7-8cjw-p6xm). No blind major downgrade was applied; resolve upstream compatibility during dependency maintenance. This is not a completed B27 security assessment.

- No known blocker to continuing synthetic M1. M2 attachments and M4 backup/restore remain unimplemented, so real data is prohibited.
- Real deployment/data decisions: [O01–O06](decisions.md).
- Live model verification: no provider choice, credentials or spend authorization recorded for the application; implement mock-tested code without live calls.
- Content review: existing source inventory is research, not a completed approved teaching catalogue.
- Real pilot B31: pending actual inputs and participation. Do not reset it to done after a simulated session.

## Validation history

2026-10-02 B01: Added package.json, package-lock.json, TypeScript/ESLint/Next config and the six-section synthetic shell. `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build` passed. `npm run start` bound 127.0.0.1:3000 and `curl` returned 200 for `/` and `/setup`. The sandbox required an approved escalation to bind loopback.

2026-10-02 M0: `npm test` passed path, migration, request-guard and fake-adapter tests. With a temporary private data root, `/api/health` returned schema 1 before later migrations; hostile Host and Origin returned 403, valid same-origin POST reached 405. A clean temporary copy later ran full `npm ci`, 12 tests, lint, typecheck and build successfully. Migrations advanced through version 7 in later work. No real data or live provider was used.

2026-10-02 M1 progress: `importDemoPack` imports four concepts, four candidate expectation references, six resources and 24 items; tests verify repeat import, new version and conflict/broken-reference rejection. The pack is explicitly synthetic. Candidate external resources and mappings are not approved for real recommendations.

2026-10-02 browser integration: In an isolated synthetic data root, saved setup, started practice, used a hint, submitted a supported correct answer, advanced to a fresh item, submitted an independent correct answer, and inspected item-scoped Progress. Entered a fictional manual draft, published an incorrect local review, and saw Progress change to mixed evidence. `tests/flow.test.ts` additionally covers duplicate submission, restart persistence, correction from incorrect to correct, retained old revision, stale-tab rejection, and stale-plan submission refusal. No actual learner, teacher, or pilot outcome was observed.

2026-10-02 correction/browser and final checks: Restarted the production server on the existing synthetic smoke database after migration 7; health reported schema 7, and Progress and Evidence returned 200. Corrected the fictional reviewed evidence through the browser, observed revision 2 and retained history. `npm test` passed 12/12, and `npm run lint`, `npm run typecheck`, and `npm run build` all passed after these changes. Backup, restore, deletion, uploads and real-data controls remain incomplete.

2026-10-05 U01/U02: Added scripts/lan-policy.mjs, lan-gateway.mjs and start-lan.mjs, a pinned Node 22 Dockerfile/Compose setup, exact configured LAN Host allowance, migration 8 reward ledger, reward UI and stale-question form guards. `npm test` passed 18/18; lint, typecheck and production build passed. Native LAN health returned 200/schema 8. Spoofed Host, cross-site POST and a loopback/out-of-subnet peer claiming an allowed forwarded IP returned 403. Browser setup and two correct answers (one hinted) produced 10 then 20 points; the active animation reported 1.5s and became inactive, and refresh/restart preserved totals without replay. A 390px viewport had no document overflow. Unit tests also cover wrong-answer exclusion, duplicate awards, old-schema backfill and deleted/withdrawn attempts. Reduced-motion CSS is implemented; OS reduced-motion emulation was not exercised.

2026-10-05 Docker verification: `docker compose build` passed using the pinned official Node image; `start:lan:docker` on test ports 3001/3200 became healthy. Docker inspect confirmed user `node` and only `127.0.0.1:3200` publishing. A fictional profile saved through the LAN browser persisted after container restart and final-image recreation. A bounded launcher smoke sent SIGTERM; exit 0 confirmed graceful gateway/container shutdown. The named test volume remains. No external/cloud deployment, router changes, student data or live AI calls were performed. Both screenshot/browser checks and network tests were run from this laptop; do not report physical phone/WAN validation without the user's evidence.

For each completed task append a short entry: date, task, changed files, exact commands and exit/result, manual observations, unresolved limits. Link longer reports only when needed; keep the current checkpoint brief enough to read at every session start.

2026-10-05 U03: Added a second versioned original synthetic starter pack, Alex/Vincent profile IDs and cookie selection, Grade 3/9 subjects/topics, per-learner page/action scoping, schema-9 quiz-wide outside-help flag, exact-response text scoring, and browser French speech examples. `npm run typecheck`, `npm test` (19/19), and `npm run build` passed; lint initially found two unused-import warnings, which were removed. Loopback browser smoke on port 3004 selected Vincent, opened French, activated outside help once, answered two questions, observed 10 then 20 points and assisted status, switched to Alex, and saw 0 points. Speech controls were clicked without a page error, but audio quality was not measured. The native LAN launcher was restarted with the existing synthetic data root; `curl --fail --silent --show-error http://192.168.2.182:3000/api/health` returned schema 9. No real students, teacher review or official Grade 3/9 mapping was used. The old local demo learner remains preserved separately.

## Next-session handoff template

Before ending an implementation turn, replace the checkpoint above and add: last working behavior; in-progress changes; failing test and suspected cause if any; whether processes are still running; data/migration effects; exact next action; next ready task. Do not leave only “continue development.”
