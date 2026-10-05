# LearnPilot

LearnPilot is a personal learning companion that connects Ontario Grade 9 classroom work to curriculum expectations, targeted support, encouraging feedback, and later evidence of understanding.

The initial scope is one student, one subject, and one unit. Science SNC1W circuits is the leading candidate; mathematics MTH1W is a fallback if classroom science materials are unavailable. A local synthetic prototype is now under active development; it is not ready for real student data.

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

## Run the synthetic prototype

Install Node.js 22.13 or newer and run `npm ci`, then `npm run dev`. Open `http://127.0.0.1:3000`. For a production smoke run, use `npm run build` and `npm run start`. Stop the server with Ctrl+C. `npm test`, `npm run lint`, and `npm run typecheck` run local checks.

The app keeps its SQLite database and future attachments outside the repository, by default under the current macOS user's `Library/Application Support/LearnPilot` directory. Set `LEARNPILOT_DATA_DIR` to another **absolute, private path outside this repository** if needed; see [.env.example](.env.example). Do not place the live database in a cloud-synced folder.

The current prototype supports synthetic setup, a focused Today step, original circuit practice, saved hints and answers, manual evidence review/correction, and item-scoped progress. Candidate Khan Academy and PhET links appear only in a reviewer preview; their Grade 9 suitability is not approved. Backup, restore, file uploads, deletion, and real-data review remain open tasks. See [BUILD_STATE](resources/sol/BUILD_STATE.md) for exact implementation status and verified checks. Do not enter real student data during this prototype stage.

## Home Wi-Fi and encouragement

After `npm run build`, use `npm run lan:info` to find your Wi-Fi interface, then `LEARNPILOT_LAN_INTERFACE=en0 npm run start:lan` (replace `en0` if needed). Open the printed private address from your other devices. The laptop must stay awake. Optional Docker startup is `LEARNPILOT_LAN_INTERFACE=en0 npm run start:lan:docker`; its app stays behind the same host network gate. See [home-network setup and boundaries](docs/home-network.md) for storage, shutdown, firewall/router limitations and container details.

Correct checked quiz answers earn 10 learning points once per learner/item version, including supported answers. A 1.5-second star celebration follows submission and respects reduced-motion settings. Today, Session and Progress show the accumulated total. Refreshing does not award more points. Existing deterministic correct answers receive their points on schema-8 upgrade. Points are encouragement, separate from the evidence used to describe understanding; there are no streak penalties or competitive rankings.
