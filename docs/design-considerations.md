# Project design considerations

Updated 2026-10-01. This design incorporates the supplied LearnPilot brief, the initial research review, and the user's direction to customize learning, provide positive feedback, and use external explanations as supporting resources. Requirements below describe intended behavior, not implemented features.

Architecture follow-up 2026-10-02: see [initial architecture review](architecture-review.md) and [task backlog](task-backlog.md) for the proposed local storage, deployment, contracts, and implementation sequence. These refine the conceptual requirements below.

## Product purpose

Help a student understand what to learn, recognize progress, resolve specific difficulties, and demonstrate understanding independently. Maintain persistent context about classroom coverage, evidence, goals, and useful interventions. Explanations may come from teacher materials, LearnPilot, or a carefully selected external resource.

The core cycle is: classroom and curriculum context → evidence → tentative learning need → personalized activity and support → constructive feedback → independent reassessment → updated learning state.

Success includes both learning progress and a student who feels supported and chooses to return. Video views, time spent, streaks, and generated explanations are not substitutes for learning evidence.

## Scope and priorities

Start with one Ontario Grade 9 student and one unit. SNC1W circuits is the preferred candidate when real classroom material is available. Check the teacher's scope before selecting the precise depth of circuit calculations. MTH1W mathematics is an alternative with a stronger public assessment reference set through EQAO.

Prioritize a complete, reviewed learning cycle over building a broad curriculum library first. Keep ordinary application workflows and structured storage; choose frameworks, retrieval methods, and model providers only when requirements justify them.

## Requirements carried forward from the review

| Area | Design requirement |
| --- | --- |
| Evidence sufficiency | Use separate axes for teaching coverage, evidence sufficiency, demonstrated performance, assistance and review validity. A concept can be untaught in class yet independently demonstrated. Missing work is not proof of a gap. |
| Answer conditions | Record hints, retries, prior answer exposure, assistance, and whether an item was previously seen. Keep observed facts separate from inferred error causes. |
| Extraction | Show original material beside extracted questions, diagrams, answers, and marks. Flag unclear content for review before it affects learning state. Support partial imports and a request for a clearer image. |
| Corrections | Allow a student or reviewer to dispute a conclusion. Preserve revisions and recompute affected interpretations; do not silently retain stale mastery claims. |
| Curriculum context | Version course and expectation records. Keep provincial requirements, teacher unit sequence, current coverage, and upcoming assessment scope separate. |
| Prerequisites | Link a small number of prerequisite concepts, including earlier-grade arithmetic, algebra, and unit conversion. Do not infer a science misconception solely from a calculation error. |
| Question quality | Store checked answers, rubrics, concept mappings, and review status. Validate numerical answers and units where possible. Separate practice from unseen reassessment items. |
| Scientific inquiry | Include predictions, observations, diagrams, and explanations. Written quiz performance alone cannot establish every practical science skill. Simulation evidence and physical construction evidence remain distinct. |
| Student agency | Let students choose a goal, session length, and an alternative explanation. Permit skipping, pausing, and challenging an interpretation without punishment. |
| Accessibility | Support clear language, readable equations, keyboard navigation, captions where available, and text alternatives. Record requested accommodations without collecting unnecessary diagnostic information. |
| Sustainable use | Make upload and review simple. Measure student/parent effort and time to a useful activity. Start with manual uploads and dates before school-system integration. |
| Resource support | Select a small number of relevant explanations or activities with a reason, learning target, and follow-up check. Use external links first. See the personalized learning specification. |
| Feedback | Give accurate, specific recognition of effort, strategy, correction, and demonstrated progress. Correct errors kindly and offer an achievable next step. |
| Privacy | Define student and parent visibility, consent, retention, export, and deletion. Deletion covers source files and derived evidence/inferences according to a documented policy. Minimize data sent to model services. |
| Security | Treat uploads and linked content as untrusted data, never executable instructions. Protect files and access, keep student data out of routine logs, and isolate development examples from real records. |
| Content rights | Record source versions, attribution, and permissions for linking, storage, transformation, embedding, and redistribution separately. A public page is not automatically an ingestible content library. |

## Learning state and domain model

Retain Student, Course, Unit, CurriculumExpectation, Concept, Material, Assessment, Question, Answer, Evidence, Recommendation, Intervention, and Reassessment from the brief. Add:

- CurriculumVersion and ClassroomCoverage to distinguish required, taught, and assessed content.
- SourceRecord with URL/file reference, version, retrieval date, rights status, and exact evidence location.
- Attempt with item version, answer, score/rubric result, assistance, hints, retries, and answer exposure.
- Interpretation with evidence IDs, alternative explanations, uncertainty, model/prompt version, and review status.
- LearningState with concept, current evidence summary, support level, last independent demonstration, and unresolved contradictions.
- Resource and ResourceReview for external explanation metadata and approval.
- ResourceRecommendation and StudentResourceFeedback for why a resource was selected and whether the student found it useful.
- FeedbackEvent, ReviewCorrection, and LearningSession for traceable feedback, corrections, and session outcomes.

Use simple relations initially; these entities do not require a graph database. Resource engagement events must not directly promote a concept to mastered. Avoid unsupported mastery percentages and uncalibrated model confidence scores. New contradictory evidence should qualify an earlier conclusion rather than imply a permanent student trait.

Structured records retain their origin and review status: a teacher mark, extracted mark and model-proposed mark have different authority. Group these conceptual records into a few modules rather than creating a service or class hierarchy for each entity. Current learning state is derived from retained reviewed evidence and must be recomputed when relevant evidence changes.

## First complete pilot

1. Collect one course outline, a few teacher resources, and one marked assessment with its rubric or key when available.
2. Review extraction and curriculum/concept mappings.
3. Select one or two plausible needs and confirm the student's goal and available time.
4. Offer a brief original explanation or a reviewed supporting resource, followed by practice and constructive feedback.
5. Reassess with unseen items after a delay; retain assistance conditions.
6. Show the student what improved, what remains uncertain, and one next step. Provide an agreed, concise parent summary.

An initial working target is 20–30 reviewed original items split between practice and reassessment. This is a planning estimate, not a validated sample size or proof threshold. Use sanitized examples before real student data.

## Evaluation and acceptance

- Every important gap claim links to reviewable evidence; weak evidence results in a question or abstention.
- Incorrect extraction can be corrected and affected learning conclusions updated.
- Every recommended resource has a reviewed learning purpose and verified destination; unreviewed candidates are not presented as approved.
- Opening a resource or completing a hinted item does not establish independent mastery.
- Feedback distinguishes correctness from effort and does not invent progress.
- Measure extraction/mapping errors, unsupported diagnoses, item defects, review effort, session completion, resource helpfulness, and willingness to return.
- Assess independent performance on unseen items and delayed retention, compared with a baseline. Record other instruction and assistance; one student's improvement does not establish causality.
- Measure cost, latency, failures, and recovery effort alongside educational quality.

Before pilot use, agree who reviews material, which classroom unit is current, parent/student access boundaries, retention periods, and acceptable review effort. Technology selection and numerical success thresholds remain open decisions.
