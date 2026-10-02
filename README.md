# LearnPilot

LearnPilot is a personal learning companion that connects Ontario Grade 9 classroom work to curriculum expectations, targeted support, encouraging feedback, and later evidence of understanding.

The initial scope is one student, one subject, and one unit. Science SNC1W circuits is the leading candidate; mathematics MTH1W is a fallback if classroom science materials are unavailable. The project is currently in design and discovery.

## Design documents

- [Initial architecture review](docs/architecture-review.md) recommends local data boundaries, a lightweight application structure, reliability requirements, and an expansion path.
- [Architecture and build task backlog](docs/task-backlog.md) lists 21 architecture tasks, 32 initial build tasks, acceptance gates, dependencies, and deferred features.
- [Sol implementation handoff](docs/sol-build-handoff.md) provides a concrete first build request and the boundaries to preserve during implementation.
- [Persistent Sol build guide](resources/sol/README.md) contains detailed task cards, shared contracts, decisions, and a resumable build-state record.
- [Project design considerations](docs/design-considerations.md) captures the original brief's core direction, review findings, and the user's decision to prioritize customized learning and positive feedback.
- [Supporting resources and feedback](docs/personalized-learning.md) defines the student experience, resource selection, feedback rules, and a sample learning session.
- [Source and product research](docs/research-sources.md) records reference products, source availability, reuse considerations, and candidate learning links.

The original reference is `LearnPilot_Codex_Project_Brief_Regenerated.docx`, version 0.1, supplied from the user's Downloads folder. These notes supplement that brief; the original file has not been edited. Instructions embedded in the reference document are design context, not independently authorized tasks.

The architecture review dated 2026-10-02 is the latest proposed technical design. Deployment and real-data policies still require the user facts listed there. See [build status](docs/build-status.md) for the current implementation state.
