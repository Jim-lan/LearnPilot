# M5 — Validation and pilot preparation

Read [contracts](../contracts.md), [BUILD_STATE](../BUILD_STATE.md), and the acceptance gates in `docs/task-backlog.md`. Run these tasks using synthetic fixtures unless the actual real-data conditions are settled. Record observed evidence, not assumed results. When B31 waits for the student or later reassessment, continue B32 and any other ready documentation or defect work.

## B29 Reference cases and extension validation

**Purpose:** Verify that the learning rules, evidence history, and approved content produce defensible behavior.
**Dependencies:** B15, B18, B19; B23 only for enabled AI; A19 expected outcomes.

**Bounded steps**
1. Turn the reference-case inventory into small synthetic fixtures with independently stated expected outcomes and permitted uncertainty. Do not derive expected results from the implementation being tested.
2. Cover correct unseen work, arithmetic/unit errors, hinted/revealed/repeated items, missing or unreadable answers, a conflicting teacher mark, and an unsupported curriculum ID.
3. Cover corrected evidence, contradictory later work, insufficient unseen items, broken resources, and model-disabled/malformed/timeout paths when applicable. Confirm resource engagement cannot promote understanding.
4. Exercise duplicate submission and interrupted persistence using existing task checks. Reuse their fixtures and evidence rather than building a second test framework.
5. Add a second tiny synthetic unit pack and a new curriculum version. Prove that new content is usable without changing learning rules and that earlier evidence retains its original version.
6. Map results to G01–G10 and G12 where applicable; retain G11 as a separate real-data decision gate. Fix serious false claims, wrong keys, stale conclusions, and data corruption before readiness is declared.

**Verification:** Run the reference suite from a clean synthetic setup. Inspect at least one complete provenance chain and correction chain, including the extension example. Use an injected test clock for due dates; label simulated delayed checks as software tests, never student retention results.

**Done:** Expected/actual outcomes, commands, fixture versions, and unresolved discrepancies are recorded. Optional AI omissions are explicit; a fake adapter test is not a live-provider quality claim.
**Exclusions:** Broad benchmark projects, psychometric validation, claims of causal learning benefit, and expanding the production curriculum to prove extensibility.

## B30 Browser workflow and accessibility checks

**Purpose:** Verify that the selected local browser can complete and recover the actual learning flow.
**Dependencies:** B17, B19, B26–B29 and their required recovery/privacy tasks.

**Bounded steps**
1. Run a clean synthetic journey: setup → manual/imported evidence review → target/resource → practice → feedback → later check → progress. Also run the cold-start introduction route.
2. Complete the primary flow using keyboard navigation. Inspect labels, focus order, visible focus, errors, contrast, readable equations, and text alternatives for diagrams or video activities.
3. Refresh during an attempt, submit twice, dispute a conclusion, and revisit history after correction. Confirm UI success agrees with saved records.
4. Disable internet access for the test environment, then use reviewed original text and practice. Test a deliberately unavailable external resource; do not require a live provider or working video to finish the core flow.
5. Exercise save failure, unavailable AI, empty history, and insufficient unseen checks. Verify the student gets an honest smaller step or clear pending state.
6. Record tested browser/device and observed limitations. Repair consequential flow and accessibility defects and rerun only affected checks plus the main path.

**Verification:** Retain concise test evidence and screenshots only with synthetic data. Combine appropriate automation with manual keyboard inspection; a clean automated scan alone does not establish accessibility.

**Done:** The complete browser flow and material recovery paths pass on the selected device, with known limits documented. No claim is made for untested browsers, assistive technologies, or deployment modes.
**Exclusions:** Cross-platform certification, mobile hosting, public deployment, and UI redesign unrelated to a demonstrated defect.

## B31 Supervised real-student pilot

**Purpose:** Observe practical usefulness, review effort, and later performance with the actual student.
**Dependencies:** B29/B30; resolved A02/A04/A06/A10/A18; G11 and relevant technical gates passed; actual user authorization and available participant/materials.

**Bounded steps**
1. Prepare a short pilot worksheet: selected goal/unit, approved material, baseline, reviewed activities, unseen reassessment, assistance log, reviewer time, and optional student feedback.
2. Check recorded user decisions and real-data authorization. Synthetic prototype permission is not authorization to upload a child's work or send it to a provider.
3. If the student, reviewer, materials, authorization, or later reassessment is unavailable, set B31 to `waiting_external` in BUILD_STATE with the exact missing input. Preserve completed preparation and continue B32 or other ready work.
4. When conditions are actually met, record the baseline and session as observed, including hints, prior item exposure, other instruction, and uncertainty. Avoid unnecessary identifying information.
5. Conduct the agreed delayed reassessment only when it occurs. Record student helpfulness feedback separately from independent performance; allow stopping without penalty.
6. Summarize observed outcomes, reviewer effort, defects, and changes proposed for the next small iteration. One student and one session do not establish causality.

**Verification:** Check that observations have actual dates, source records, assistance conditions, and reviewer confirmation. Do not simulate a participant, invent consent, advance the clock to claim retention, or fabricate satisfaction scores.

**Done:** The authorized baseline/session/later reassessment and honest report exist. Until then, B31 remains `waiting_external`; preparation alone is not completion. An interrupted pilot is reported as partial.
**Exclusions:** Autonomous contact with the family or teacher, invented pilot outcomes, generalized efficacy claims, and forcing the development work to idle while external input is pending.

## B32 Synthetic release documentation and next work

**Purpose:** Make the tested local app runnable and recoverable by another person, even before a real pilot is available.
**Dependencies:** B29/B30 and the B24–B28 recovery evidence. B31 is not a dependency for the synthetic release; its later findings become an addendum.

**Bounded steps**
1. Write release notes covering implemented behavior, task IDs, verified environment, optional AI status, and known limitations. Label the release synthetic/demo where G11 or B31 is pending.
2. Provide verified install/start/stop instructions, data/config locations, model-disabled operation, and recovery steps. Include the backup/restore/deletion limitations, especially external old copies.
3. Document the B29 second-pack and curriculum-version example with its exact tested boundary. Do not imply arbitrary subjects or formats have been validated.
4. Create a concise next-work list from defects and observed friction; keep deferred features deferred unless the user or evidence changes their priority.
5. Update BUILD_STATE with task/gate status, check evidence, unresolved decisions, B31's external dependency if any, and the next executable task. Keep synthetic results separate from future pilot findings.
6. Validate the documented startup and restore path in a disposable clean instance. Ensure examples, screenshots, and repository fixtures contain only synthetic data and no credentials.

**Verification:** Follow the guide rather than relying on remembered commands. Check that documented features actually work, relative document links resolve, and missing real-pilot results are conspicuous and accurate.

**Done:** The synthetic release guide, limitations, recovery guide, tested extension example, and continuation record are complete. B32 can be done while B31 and G11 remain pending; this is not a real-student release approval.
**Exclusions:** Packaging a commercial release, public hosting, declaring the whole project complete while B31 is pending, and writing an invented pilot-results section.
