# Personalized learning with supporting resources

Updated 2026-10-01. Accepted product direction: tailor the learning experience to the individual student and provide positive, truthful feedback. External resources supply additional ways to introduce, explain, visualize, or practise a concept.

## Personalization inputs

Use the current unit, curriculum expectations, teacher coverage, recent evidence, prerequisite needs, upcoming assessments, available time, preferred language, accessibility needs, and the student's chosen goal. Offer format choices such as watch, read, or experiment. Treat preferences as adjustable choices, not permanent learning-style diagnoses.

When evidence is missing, ask one or two diagnostic questions rather than declaring a weakness. Distinguish a topic introduction from remediation: a student encountering a topic for the first time should not receive gap-oriented messaging.

## Resource selection

Start with a small human-reviewed catalogue mapped to the pilot's concepts. Use simple metadata filtering before considering semantic search or live discovery. An LLM may propose a candidate, but it must not invent a title, URL, duration, timestamp, or curriculum alignment.

1. Filter by concept, current classroom depth, prerequisite demands, language, accessibility, availability, and allowed use.
2. Match the purpose: introduction, alternative explanation, worked example, interactive exploration, practice, or review.
3. Prefer a direct relevant resource from its original provider. A provider's reputation does not replace reviewing the particular item.
4. Show one primary recommendation and at most two alternatives. Explain why it fits the student's current task.
5. Pair it with an attention prompt and a short independent check afterward.
6. Ask whether it was useful, too fast, too hard, too easy, or unavailable; adapt the next choice.

Useful supplier roles include Khan Academy for concept explanations and worked examples, selected original-publisher YouTube videos for alternative demonstrations, TVO Learn for Ontario course context, PhET for interactive science, and appropriately licensed reading resources. These are support providers, not interchangeable authorities on Ontario curriculum.

## Resource card and catalogue fields

Each student-facing card shows the title, provider, format, learning purpose, reason for selection, verified duration or estimated activity time clearly distinguished, relevant prerequisites, available captions/language, external-site label, and a direct link. Add a verified timestamp only after reviewing that segment. End with a specific task such as explaining a relationship or solving a new example.

Catalogue fields include resource ID, canonical URL, publisher/channel, format, language, concept IDs, proposed expectation mappings, prerequisite concepts, intended depth, purpose, duration and verification status, captions/accessibility notes, reviewer/date, availability check/date, rights record, limitations, fallback resource, and status (candidate, reviewed, unavailable, retired).

Search and provider links can help reviewers discover content but do not count as reviewed lesson recommendations. Keep recommendation rationale and model metadata separately from verified resource facts. Do not put student names, marks, or learning profiles in outgoing URLs or external search queries.

## Linking and external-site behavior

Use direct external links in the first pilot. Linking does not authorize downloading videos, copying transcripts, building a content corpus, or generating derivatives. Evaluate these uses separately if later needed.

For YouTube, select an exact video and verify its publisher and content. Do not send the student to an unrestricted search-results page as the learning activity. Avoid autoplay or endless resource feeds within LearnPilot. Clearly indicate that external-site advertising, recommendations, availability, and access restrictions are outside LearnPilot's control; offer a reviewed text or activity fallback.

Embedding is a later decision subject to provider terms and applicable child-directed-service requirements. YouTube's privacy-enhanced player is not a guarantee of a distraction-free or tracking-free experience. Its official guidance is linked in the research inventory.

## Positive feedback rules

The tone should be warm, respectful, age-appropriate, and specific. Feedback acknowledges something observable, explains what the answer shows, and offers one manageable next action. Recognize a useful strategy, asking for help, noticing a mistake, or improving independence when the evidence supports it.

| Situation | Example intended feedback |
| --- | --- |
| Correct method, arithmetic error | “You chose the right relationship. Check the division in the last step, then add the unit.” |
| Misconception | “You noticed that the circuit changed. Let's look at whether this branch gives current another path.” |
| Correct after a hint | “That hint helped you rearrange the equation. Try a new example on your own to check the method.” |
| Independent progress | “You solved this new example without a hint and included the correct unit. That gives us stronger evidence for this skill.” |
| Repeated difficulty | “Let's make the next step smaller. Would a diagram or a worked example help?” |
| Unclear uploaded work | “I can't read this part clearly enough to assess it. You can correct the text or add a clearer photo.” |

Examples are templates for situations where the stated observations are true. Never praise an incorrect answer as correct, invent improvement, infer effort from time spent, or use fixed ability labels. Avoid peer rankings, shame, lost-streak penalties, excessive praise, and pressure to continue. Celebrate a completed achievable goal while allowing a pause or break.

Keep encouragement separate from assessment: “You stayed with a difficult step” and “You have demonstrated this skill independently” require different evidence. Parent summaries should communicate strengths and next steps without turning the student experience into surveillance.

## Example Grade 9 circuit session

This is a proposed flow, not an assessment of a real student.

1. Student selects “understand current and resistance” and a 15-minute session.
2. Two short checks distinguish an unfamiliar concept from trouble with equation rearrangement.
3. LearnPilot offers a reviewed introductory Khan Academy clip or a short original text explanation, with “Watch for what changes when resistance increases.” Candidate links are in the research inventory and still require full review.
4. Student predicts what happens to current at fixed voltage, then explores a linked PhET activity or an equivalent diagram exercise.
5. Student answers an original calculation and explains the relationship. Feedback recognizes correct reasoning and addresses a specific error if present.
6. Student can choose a hint; that assistance is recorded. A fresh independent item follows when appropriate.
7. The session closes with one evidenced achievement and one next step. A later unseen check tests retention.

Store “resource offered,” “opened,” “student reports completed,” and “student reports helpful” as separate events. External link clicks do not establish viewing duration, comprehension, or learning gain. Do not assume access to provider analytics or the student's account.

## Pilot checks

Review example sessions covering cold start, wrong answers, repeated frustration, hinted success, independent success, unavailable resources, inaccessible video, and disputed interpretations. Verify that each path leads to a useful alternative or a smaller next step. Ask the student whether the feedback felt clear, encouraging, and honest; measure outcomes separately from those ratings.
