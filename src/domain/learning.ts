export const LEARNING_POLICY_VERSION = "descriptive-0.1";

export type Observation = {
  id: string;
  result: "correct" | "incorrect" | "unknown";
  assistance: "known_none" | "recorded_assisted" | "unknown";
  unseen: boolean;
  observedAt: string;
};

export type LearningSummary = {
  observedResult: "insufficient" | "correct_item" | "supported_correct" | "error_item" | "mixed";
  sufficiency: "none" | "item_only" | "mixed";
  assistance: "none_recorded" | "assisted" | "unknown";
  explanation: string;
  evidenceRefs: string[];
  reviewDueAt: string | null;
  reviewDue: boolean;
};

export function summarizeLearning(observations: Observation[], now = new Date()): LearningSummary {
  const eligible = observations.filter(o => o.result !== "unknown").sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  if (!eligible.length) return { observedResult: "insufficient", sufficiency: "none", assistance: "unknown", explanation: "There is not enough reviewed work yet. Start with a short introduction or check.", evidenceRefs: [], reviewDueAt: null, reviewDue: false };
  const hasCorrect = eligible.some(o => o.result === "correct");
  const hasError = eligible.some(o => o.result === "incorrect");
  const latest = eligible.at(-1)!;
  const independent = eligible.filter(o => o.result === "correct" && o.assistance === "known_none" && o.unseen);
  const latestIndependent = independent.at(-1);
  const reviewDueAt = latestIndependent ? new Date(Date.parse(latestIndependent.observedAt) + 2 * 24 * 60 * 60 * 1000).toISOString() : null;
  const reviewDue = !!reviewDueAt && now.getTime() >= Date.parse(reviewDueAt);
  let observedResult: LearningSummary["observedResult"];
  let explanation: string;
  if (hasCorrect && hasError) {
    observedResult = "mixed";
    explanation = "The reviewed answers are mixed. A correct response is recorded alongside an error; another fresh check can clarify the current picture.";
  } else if (latest.result === "incorrect") {
    observedResult = "error_item";
    explanation = "This reviewed answer did not match the item. The reason is not known from this result alone.";
  } else if (latest.assistance === "recorded_assisted") {
    observedResult = "supported_correct";
    explanation = "A reviewed answer was correct with recorded support. Try a new item independently when ready.";
  } else if (independent.length) {
    observedResult = "correct_item";
    explanation = "A new item was answered correctly without recorded support. This shows success on that item, not broad mastery.";
  } else {
    observedResult = "correct_item";
    explanation = "A reviewed answer was correct. Assistance or freshness is uncertain, so independence is not established.";
  }
  return {
    observedResult,
    sufficiency: hasCorrect && hasError ? "mixed" : "item_only",
    assistance: eligible.some(o => o.assistance === "recorded_assisted") ? "assisted" : eligible.every(o => o.assistance === "known_none") ? "none_recorded" : "unknown",
    explanation,
    evidenceRefs: eligible.map(o => o.id),
    reviewDueAt,
    reviewDue,
  };
}
