# Sol development resource pack

Prepared 2026-10-02. This pack turns the LearnPilot design into a resumable development queue. It contains instructions, not implemented features. Application tasks are initially pending.

## Start here

1. Read [BUILD_STATE.md](BUILD_STATE.md) for the current task, blockers, completed evidence and exact next action.
2. On first entry, read [contracts.md](contracts.md) and [decisions.md](decisions.md). On later entries, read only changes and the contracts relevant to the task.
3. Read the current milestone file below; use its B task IDs as the implementation units.
4. Consult [architecture readiness](architecture-readiness.md) when a required contract or user fact is missing. Consult [the original architecture review](../../docs/architecture-review.md) for rationale rather than repeatedly redoing discovery.
5. Inspect the actual files and working changes before editing. A progress note may describe work that was interrupted before completion.

## Task files

| Milestone | Detailed instructions | Tasks | Intended result |
| --- | --- | --- | --- |
| M0 | [Foundation](tasks/M0-foundation.md) | B01–B05 | Running local application and durable data foundation |
| M1 | [Learning loop](tasks/M1-learning-loop.md) | B06–B15 | Complete manual learning session and later check |
| M2 | [Evidence files](tasks/M2-evidence-files.md) | B16–B19 | Private uploads, reviewed evidence and correction propagation |
| M3 | [AI assistance](tasks/M3-ai-assistance.md) | B20–B23 | Optional controlled model capabilities with fake/offline paths |
| M4 | [Recovery](tasks/M4-recovery.md) | B24–B28 | Backup, restore, deletion, diagnostics and verified local controls |
| M5 | [Validation](tasks/M5-validation.md) | B29–B32 | Tested synthetic release and, when authorized, real pilot |

All 21 A tasks have design instructions in [architecture-readiness.md](architecture-readiness.md). All 12 F expansion tasks have entry conditions and implementation outlines in [future-features.md](future-features.md). The 12 G acceptance gates are tracked in BUILD_STATE and defined by the [backlog](../../docs/task-backlog.md).

## Default development sequence

Complete M0 → M1 → M2 → M4 → M5 synthetic validation and release documentation. Then build M3's fake-tested integration if it remains in the user's authorized continuous-build scope, and rerun affected M4/M5 checks. This order delivers a durable useful app before optional provider work. M3 may be brought forward after M2 if the user specifically prioritizes AI. B22 is optional; B23 is required for any enabled AI path.

B31 requires actual participation and agreed policies; it is not required to publish local synthetic release notes in B32. Keep actual pilot findings pending and identify the release as a prototype until its gates pass. A lack of credentials must not block unrelated core work. Never claim a successful provider call from a fake response.

## Per-task working loop

1. Select the earliest dependency-ready task still in scope. Mark it `in_progress` with a short next action in BUILD_STATE. If another worker owns it, choose independent work or coordinate; do not overwrite their changes.
2. Read its inputs and acceptance conditions. Fill only the design gaps needed for this task using documented provisional defaults; record changes in decisions.md.
3. Implement a narrow complete behavior. Prefer existing modules and libraries over a new service. Add migrations instead of discarding persisted data.
4. Run the smallest meaningful verification, plus affected integration/build checks. Fix failures. For UI behavior, inspect it in a browser when tools permit; if inspection is unavailable record that gap explicitly.
5. Update the task row with status and links to evidence: changed files, actual command results, relevant tests, or a reproducible manual check. Do not paste secrets or student work into status notes.
6. Update the gate matrix, blockers and handoff checkpoint. Set the next task and continue during an authorized continuous run. Do not stop solely because one task or milestone is complete.

Stop dependent work for an explicit user pause, an actual unresolved permission/data decision, an unavailable essential tool, or exhausted execution capacity. Record a checkpoint before ending. Continue other in-scope ready tasks when one task is externally blocked. Do not repeatedly run a known blocked action or manufacture test evidence.

## Status vocabulary

- `pending`: not started.
- `in_progress`: actively being implemented; record the worker/session and exact next step.
- `blocked`: an engineering dependency or unresolved defect prevents completion; name it.
- `waiting_external`: requires a real reviewer, user policy decision, credential or pilot event; identify dependent scope.
- `done`: engineering acceptance passed with evidence and any live/pilot limitations separately recorded.
- `deferred`: optional or future scope not selected; do not treat as completed.

Maintain separate evidence about engineering and pilot readiness. A task may have a passing synthetic implementation and a pending real-world validation; do not make a `done` row imply expert approval, live-provider validation, or real student outcomes. G11 remains not passed until real-data prerequisites are actually satisfied.

## Verification discipline

Use the package manager and commands established in B01. Expected capabilities are lint, typecheck, unit/integration tests, production build, and later end-to-end checks; actual command names are recorded in BUILD_STATE, not assumed here. A command's existence is not a passing result.

Prioritize data integrity, meaningful learning-rule edge cases, correction behavior and recovery. Do not write tests that merely duplicate trivial presentation code. Run the full relevant release suite at milestone boundaries or when cross-cutting changes justify it; avoid redundant repeated runs with no change.

For a dependency or provider API, check its current official documentation before selecting exact versions or implementing unfamiliar behavior. Pin installed versions and keep one lockfile. Do not silently substitute a different framework when package installation fails; diagnose and record the real blocker.

## Copyable continuous-build request

> Build the LearnPilot lightweight prototype using AGENTS.md and resources/sol/README.md. Read BUILD_STATE.md and continue from the first dependency-ready unfinished task. Use the documented provisional defaults and synthetic data. Implement the core through local synthetic validation, including backup and restore, then the optional AI adapter and mock-tested operations if feasible. Keep live AI disabled unless configured and authorized; do not wait for a real student or API key to finish independent engineering. Verify each task, update the shared state and decisions, and keep moving across milestones within this request. Leave real-user pilot work and explicitly deferred features pending. If interrupted, save an exact resume checkpoint and report what actually works.

## Copyable continuation request

> Continue LearnPilot development from resources/sol/BUILD_STATE.md using resources/sol/README.md. Inspect existing code first, finish the current task, and continue through dependency-ready tasks in the selected build scope. Preserve existing data and changes; run relevant checks, fix failures, and update the checkpoint before ending.

These are prompts for a user to send to an implementation task. The files do not automatically start or schedule work. No paid service, external deployment, or communication to other people is required for the core prototype.
