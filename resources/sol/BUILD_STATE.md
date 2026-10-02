# LearnPilot build state

Last updated: 2026-10-02 by the architecture/documentation task.

This is the single implementation status record. Instructions and task cards are prepared; no application code, dependencies, database or runtime tests exist yet. Preparing a task guide does not complete that task.

## Resume checkpoint

- Current phase: ready for implementation with documented provisional synthetic defaults.
- Current task: none in progress.
- Next task: B01 in [M0 foundation](tasks/M0-foundation.md).
- Exact next action: inspect the repository, read decisions.md and contracts C01–C04, choose and pin compatible runtime/framework/package-manager versions, and begin B01. Record the chosen commands here only after they exist.
- Default authorized-build interpretation: follow the active user's implementation request; the current completed request only prepared resources. For a later continuous-build request, use the sequence in README.md.
- Current owner: none. Claim only an actual task you are working on.
- Uncommitted/partial implementation: none created by this preparation task; inspect current files before relying on that fact in a later session.
- Next engineering milestone: M0.
- Real-data pilot: not ready; O01–O06 remain unresolved as applicable.

## Command registry

| Capability | Actual command | Last result |
| --- | --- | --- |
| Install | Not selected | Not run |
| Development start | Not implemented | Not run |
| Production build/start | Not implemented | Not run |
| Lint/typecheck | Not implemented | Not run |
| Unit/integration tests | Not implemented | Not run |
| Browser tests | Not implemented | Not run |
| Database migrate | Not implemented | Not run |
| Demo seed | Not implemented | Not run |
| Backup/restore | Not implemented | Not run |

Replace placeholders with actual commands and dates. Keep command results factual. Never put a provider key or private student content in this file.

## Task queue

Statuses and the distinction between engineering completion and pilot readiness are defined in [README.md](README.md). In the Evidence column, link a test/run note or concrete artifact when work completes. If existing evidence becomes stale after a change, invalidate it explicitly.

| Task | Milestone | Status | Engineering evidence or next step |
| --- | --- | --- | --- |
| B01 | M0 | pending | Scaffold and command choices not started |
| B02 | M0 | pending | Runtime paths/config not implemented |
| B03 | M0 | pending | Schema and migrations not implemented |
| B04 | M0 | pending | UI shell and request protections not implemented |
| B05 | M0 | pending | Fake model and contracts not implemented |
| B06 | M1 | pending | Content pack and import not implemented; genuine source review remains separate |
| B07 | M1 | pending | Catalogue/fallback not implemented; candidate links are not approved |
| B08 | M1 | pending | Original items and validation not created |
| B09 | M1 | pending | Setup and context not implemented |
| B10 | M1 | pending | Manual evidence and review not implemented |
| B11 | M1 | pending | Learning policy not implemented |
| B12 | M1 | pending | Target/resource selection not implemented |
| B13 | M1 | pending | Session and attempts not implemented |
| B14 | M1 | pending | Scoring/feedback not implemented |
| B15 | M1 | pending | Reassessment/progress not implemented |
| B16 | M2 | pending | Attachment ingestion not implemented |
| B17 | M2 | pending | Source review not implemented |
| B18 | M2 | pending | Corrections/recomputation not implemented |
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

- No known blocker to starting synthetic M0.
- Real deployment/data decisions: [O01–O06](decisions.md).
- Live model verification: no provider choice, credentials or spend authorization recorded for the application; implement mock-tested code without live calls.
- Content review: existing source inventory is research, not a completed approved teaching catalogue.
- Real pilot B31: pending actual inputs and participation. Do not reset it to done after a simulated session.

## Validation history

No application validation has run. Documentation preparation checked task coverage and local references; that does not satisfy application gates.

For each completed task append a short entry: date, task, changed files, exact commands and exit/result, manual observations, unresolved limits. Link longer reports only when needed; keep the current checkpoint brief enough to read at every session start.

## Next-session handoff template

Before ending an implementation turn, replace the checkpoint above and add: last working behavior; in-progress changes; failing test and suspected cause if any; whether processes are still running; data/migration effects; exact next action; next ready task. Do not leave only “continue development.”
