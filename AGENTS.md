# LearnPilot working instructions

For application implementation or continuation requests, read `resources/sol/README.md`, then `resources/sol/BUILD_STATE.md`, then the relevant task card. Read `resources/sol/contracts.md` and `resources/sol/decisions.md` when changing domain behavior, persistence, deployment, or AI integration. For a review-only or documentation-only request, do that requested work without starting application implementation.

The user intends Astra for substantial architecture evaluation and Sol for development. This file does not select a model or authorize another task, scheduler, provider charge, or deployment. Follow the active user's requested scope.

During an authorized continuous build, implement dependency-ready tasks, verify them, update `resources/sol/BUILD_STATE.md`, and continue to the next ready task without asking for approval at every milestone. An explicit narrower user request limits this behavior. Do not implement deferred expansion tasks just because they exist.

Use the documented defaults for a synthetic single-computer prototype: one TypeScript/Next.js application, SQLite, private attachments, versioned small reference packs, external resource links, and no live model calls by default. Do not block synthetic engineering on an unavailable real student, teacher reviewer or provider key. Record those limitations; never invent approvals, external test results, or pilot outcomes.

Preserve these invariants:

- Facts, source evidence, AI interpretations and derived learning state remain distinguishable and versioned.
- Classroom coverage is separate from demonstrated understanding and assistance.
- Save an attempt before AI assessment; remote calls never run inside a database transaction.
- Candidate or unchecked generated content does not silently become approved material.
- Watching a video or using hints does not establish independent understanding.
- Corrections invalidate affected claims; current state is rebuildable from eligible evidence.
- Keep runtime data/secrets out of source control, static serving, routine logs and shared caches.
- Follow the local access, backup, restore and deletion contracts before real-data use.

`resources/sol/BUILD_STATE.md` is the single implementation status record. Its task states and test evidence override stale status prose in older design documents, but do not override their product requirements. Do not declare completion without the task's acceptance evidence. Resume from verified repository state if a previous run was interrupted.

Make routine choices within the agreed boundaries and record meaningful deviations. For a real architecture conflict, describe the concrete requirement and alternatives, record the issue, and continue independent work. Obtain missing authorization only for dependent actions that actually require it.
