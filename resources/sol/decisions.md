# Implementation decisions and open facts

Prepared 2026-10-02. The user has requested the implementation instructions. The following defaults allow a synthetic build to start without another architecture discussion. They are provisional engineering choices, not confirmation of family preferences or authorization for external data processing.

## Defaults for the synthetic prototype

| ID | Decision | Reason and boundary |
| --- | --- | --- |
| D01 | One computer, browser UI, loopback application server by default | Home LAN option authorized 2026-10-05; D15 supersedes the loopback-only restriction for that mode. |
| D02 | One TypeScript/Next.js codebase, SQLite and private attachment files | One runtime and no separate database service. Select compatible supported versions at B01. |
| D03 | Ontario Grade 9 SNC1W circuits as demo scenario | Existing design direction; actual student's classroom unit remains unknown. |
| D04 | Versioned small reference packs and external teaching links | Stable grounding without mirroring content libraries. |
| D05 | Manual evidence route first, then bounded PDF/PNG/JPEG attachment support | Complete learning flow before extraction complexity. |
| D06 | Synthetic data and fake/disabled model by default | No student data or provider account required to engineer/test the core. |
| D07 | Descriptive item-scoped evidence summaries | No unvalidated mastery percentages or permanent ability labels. |
| D08 | Original checked practice and unseen reassessment items | Generated drafts do not become approved assessed content automatically. |
| D09 | Explicit demo mode and review provenance | Fixture approvals simulate states; they are never presented as real expert verification. |
| D10 | Single trusted local installation | UI modes do not imply separate parent/student authorization. |
| D11 | Continuous build uses the task queue within the active user's scope | Routine milestone completion is not a reason to ask permission again. |
| D12 | One current implementation status file | BUILD_STATE.md is canonical; older overview docs link to it instead of maintaining competing checklists. |

## Questions that do not block synthetic implementation

| ID | Missing fact | Safe engineering path | Needed before |
| --- | --- | --- | --- |
| O01 | Laptop server with browsers on the same home Wi-Fi, native or Docker (user, 2026-10-05) | D15 covers a shared synthetic profile; per-user access and real-data controls remain open | Real student LAN use |
| O02 | Student's current course/unit and teacher materials | Clearly labelled fictional circuit assessment and original practice | Personalized claims about real classroom coverage |
| O03 | Who reviews curriculum, resources, items and student work | Review workflow and synthetic fixtures; record actual source checks honestly | Reviewed real-pilot catalogue and disputed real assessment |
| O04 | Retention and parent/student visibility policy | Implement configurable controls and synthetic deletion/restore tests | Real student records |
| O05 | Provider choice, credentials, transmission permission and operating budget | Fake adapter and disabled live switch | Any live provider validation; additional real-data permission before real student input |
| O06 | Acceptable review burden and outcome targets | Measure timings and provide observation forms without invented thresholds | Evaluation of real pilot success |

When the user supplies an answer, date the decision, record its source and affected tasks, and update only the relevant assumptions. Do not ask again for a choice already made in the conversation or decisions file.

## Change log template

For substantive decisions append: date; decision ID; requirement or observed problem; chosen behavior; alternatives; data migration/privacy impact; affected task IDs; verification needed; status (`provisional`, `confirmed_by_user`, `superseded`). Preserve the previous decision's meaning and link to its replacement. Routine component naming does not require an architecture decision record.

2026-10-02 · D13 (provisional implementation): Use pinned Next.js 16.3.8, React 19.3.0, TypeScript 5.9.3, better-sqlite3 13.0.3 and npm lockfile for the one-server local prototype. Node.js 22.13+ is required by the combined package set; verification here used Node.js 25.4.0. ESLint 9.39.2 remains pinned because upgrading to 10.12.0 failed in the current Next React rule (`contextOrFilename.getFilename`); revisit after dependency compatibility changes. No data migration impact. Affected B01–B05; verify clean install/build and future dependency upgrades.

2026-10-02 · D14 (provisional implementation): Keep synthetic curriculum metadata and original learning content in the app with no copied official expectation wording. Map original concepts to SNC1W expectation codes as `candidate` until actual alignment review. Candidate external video/simulation links appear only in reviewer preview; original text remains the supported route. Affected B06–B08, B12; review each item and rights before a real-data pilot.

2026-10-05 · D15 (confirmed_by_user scope; implementation defaults): User requests access from other devices on home Wi-Fi, with the app hosted on the laptop or in Docker and no outside-network access. Add an explicit production LAN launcher and a small host-side HTTP gateway: bind one private interface, check direct socket peer against its subnet, require exact Host/same Origin, strip forwarding headers, and shut down on interface change. Keep the Next backend on host loopback; Docker publishes only to loopback and persists a separate named volume. A host gateway is chosen because Docker Desktop may obscure original client addresses. Existing loopback commands remain available. This supersedes loopback-only wording in D01/C01/B27 for the selected mode, not the real-data gate. IP checks do not prove Wi-Fi membership; no router forwarding, tunnel or VPN route is allowed to extend access. All home devices share one synthetic profile; no accounts or HTTPS yet. Affected B04/B27, documentation and deployment; verify request rejection, browser mutations, native/Docker startup and device reachability separately.

2026-10-05 · D16 (confirmed_by_user feature; provisional reward amount): User requests positive feedback, a small image or 1–2-second celebration, and accumulated points for correct quiz answers. Implement 10 points per learner/item version, including supported success, with a 1.5-second original SVG/CSS star. Points never enter learning inference. Schema 8 adds an attempt-linked reward ledger and backfills existing deterministic correct responses. Unique awards, atomic scoring/award commits, persisted totals, reduced-motion handling and stale-device-form checks protect predictable behavior. Incorrect answers incur no subtraction; manual reviewed work does not award quiz points. Affected B13/B14/B15; tests cover duplicates, assistance, wrong answers, restart, migration, deletion and stale forms. Human effectiveness/pilot validation remains pending.
