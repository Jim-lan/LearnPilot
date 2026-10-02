# LearnPilot build state

Last updated: 2026-10-02 by the first application build task.

This is the single implementation status record. M0 is implemented; a synthetic M1 learning path is runnable. The app is not ready for real student information.

## Resume checkpoint

- Current phase: M1 synthetic learning-loop implementation.
- Current task: M1 vertical slice verified; B07–B08 and B11–B15 remain incomplete against their full cards. A partial B18 correction path is also implemented.
- Next task: finish B07/B08 resource review and item rubric scope, then B11–B15 acceptance cases before M2 attachment work.
- Exact next action: inspect the current Git state, then add a controlled resource-review path, explanation-item review behavior, and a later-check browser fixture. Preserve the working synthetic loop and the seven numbered migrations.
- Default authorized-build interpretation: this user request started the app; future continuation should follow the active request scope and the sequence in README.md.
- Current owner: current build task until handoff.
- Working implementation: synthetic setup, Today, practice with assistance provenance, Progress, and manual evidence revision/correction work through a production browser run. Inspect `git status` before changing files; the first application build is being committed and published at this checkpoint.
- Running process: a local production smoke server may still be serving `127.0.0.1:3000` with private synthetic data under `/private/tmp/learnpilot-ui-smoke-codex`; check whether it is running before reusing that port. No real student data was used.
- Data/migration effects: schema 7 is current and upgraded the existing synthetic smoke database on restart; migration tests passed. New runs create a private SQLite database outside source.
- Next engineering milestone: finish M1, then M2.
- Real-data pilot: not ready; O01–O06 remain unresolved as applicable.

## Command registry

| Capability | Actual command | Last result |
| --- | --- | --- |
| Install | `npm ci` | Passed in workspace and a separate temporary clean copy on 2026-10-02 |
| Development start | `npm run dev` | Command configured; not separately smoke-tested |
| Production build/start | `npm run build`; `LEARNPILOT_DATA_DIR=/private/tmp/learnpilot-ui-smoke-codex npm run start` | Build passed; loopback server and browser flow passed 2026-10-02 |
| Lint/typecheck | `npm run lint`; `npm run typecheck` | Passed 2026-10-02 |
| Unit/integration tests | `npm test` | 12 tests passed through migration 7 on 2026-10-02 |
| Browser tests | Manual in-app browser against `http://127.0.0.1:3000` | Setup → Today → hinted practice → fresh answer → Progress → manual evidence review → correction/history passed 2026-10-02 |
| Database migrate | Automatic numbered migrations on first database open | Restart/idempotency/foreign-key/rollback tests passed through schema 7 |
| Demo seed | Save synthetic setup in `/setup` (calls idempotent pack importer) | Passed in browser; 24 item bank loaded |
| Backup/restore | Not implemented | Not run |

Replace placeholders with actual commands and dates. Keep command results factual. Never put a provider key or private student content in this file.

## Task queue

Statuses and the distinction between engineering completion and pilot readiness are defined in [README.md](README.md). In the Evidence column, link a test/run note or concrete artifact when work completes. If existing evidence becomes stale after a change, invalidate it explicitly.

| Task | Milestone | Status | Engineering evidence or next step |
| --- | --- | --- | --- |
| B01 | M0 | done | Pinned Next.js 16.3.8/React 19.3.0; full clean `npm ci`, tests, lint, typecheck, build pass; production loopback HTTP 200 |
| B02 | M0 | done | Private configured root outside source, subdirectories and rejection tests; .env.example and ignore rules |
| B03 | M0 | done | Numbered SQLite migrations 1–7; restart/foreign-key/rollback tests; health endpoint reports schema version |
| B04 | M0 | done | Six-section shell, error/loading states, loopback bind, Host/Origin guard and no-store headers tested by curl |
| B05 | M0 | done | Fake/disabled adapter, bounded draft validation and failure-state tests; no provider credentials needed |
| B06 | M1 | done | Synthetic 0.1.0 pack, four concepts and candidate Ontario IDs; idempotent/version-conflict tests. Actual alignment review pending |
| B07 | M1 | in_progress | Original text works and candidate Khan/PhET links stay in reviewer preview; item-level external review/availability workflow remains |
| B08 | M1 | in_progress | 24 original numeric items, eight reserved, key/unit tests pass; explanation rubric and human content review remain |
| B09 | M1 | done | Synthetic setup saved/reopened in browser; preferences and separate coverage persist; no weakness inferred from coverage |
| B10 | M1 | done | Manual draft/edit/review UI passed synthetic browser check; teacher mark and local result remain separate |
| B11 | M1 | in_progress | Descriptive policy/store and mixed-evidence browser flow work; full edge-case matrix and correction/recompute failure cases remain |
| B12 | M1 | in_progress | Today selects a topic and original support, saves plan evidence/content versions; time/preference alternatives and empty-catalogue cases remain |
| B13 | M1 | in_progress | Presented/hint/reveal/answer events persist; idempotent attempt integration test; resume and resource engagement event checks remain |
| B14 | M1 | in_progress | Numeric/unit scoring and truthful supported/independent feedback pass; short-explanation review path remains |
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
| B27 | M4 | pending | Local technical controls unverified; real-data policy pending |
| B28 | M4 | pending | Diagnostics/recovery not implemented |
| B29 | M5 | pending | Reference suite and extension demonstration not run |
| B30 | M5 | pending | Browser/accessibility validation not run |
| B31 | M5 | waiting_external | Real student/reviewer/policy/elapsed-time evidence unavailable; does not block synthetic B32 |
| B32 | M5 | pending | Synthetic release notes can follow B29/B30; real-pilot findings remain pending |

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

For each completed task append a short entry: date, task, changed files, exact commands and exit/result, manual observations, unresolved limits. Link longer reports only when needed; keep the current checkpoint brief enough to read at every session start.

## Next-session handoff template

Before ending an implementation turn, replace the checkpoint above and add: last working behavior; in-progress changes; failing test and suspected cause if any; whether processes are still running; data/migration effects; exact next action; next ready task. Do not leave only “continue development.”
