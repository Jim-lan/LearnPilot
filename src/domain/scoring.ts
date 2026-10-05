import type { AnswerKey } from "./demo-content";

export type Score = { status: "correct" | "wrong_value" | "wrong_unit" | "missing_unit" | "invalid"; value: 0 | 1; feedback: string };

const units: Record<string, { dimension: string; factor: number }> = {
  A: { dimension: "current", factor: 1 },
  mA: { dimension: "current", factor: 0.001 },
  V: { dimension: "voltage", factor: 1 },
  mV: { dimension: "voltage", factor: 0.001 },
  "Ω": { dimension: "resistance", factor: 1 },
  ohm: { dimension: "resistance", factor: 1 },
  ohms: { dimension: "resistance", factor: 1 },
  "kΩ": { dimension: "resistance", factor: 1000 },
  kohm: { dimension: "resistance", factor: 1000 },
  kohms: { dimension: "resistance", factor: 1000 },
};

export function scoreNumber(answer: string, key: Extract<AnswerKey, { kind: "number" }>, assisted: boolean): Score {
  const cleaned = answer.trim().replace(/Ω/g, "Ω");
  const parsed = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*)([A-Za-zΩ]+)?$/.exec(cleaned);
  if (!parsed) return { status: "invalid", value: 0, feedback: "I could not read that as one number and unit. Try a form such as 2 A." };
  if (!parsed[2]) return { status: "missing_unit", value: 0, feedback: "You entered a number. Add the unit so the answer says what was measured." };
  const entered = units[parsed[2]];
  const expected = units[key.unit];
  if (!entered || !expected || entered.dimension !== expected.dimension) return { status: "wrong_unit", value: 0, feedback: `Check the unit. This question asks for ${key.unit}; revisit what the quantity measures.` };
  const actualBase = Number(parsed[1]) * entered.factor;
  const expectedBase = key.value * expected.factor;
  if (!Number.isFinite(actualBase) || Math.abs(actualBase - expectedBase) > key.tolerance * expected.factor) {
    return { status: "wrong_value", value: 0, feedback: "The unit matches, but the value does not match this checked example. Revisit the relationship and calculate one step at a time." };
  }
  return {
    status: "correct", value: 1,
    feedback: assisted
      ? "Your value and unit match this example with support. Try a fresh question without the hint to check your own understanding."
      : "Your value and unit match this example. That is evidence for this question; a later fresh check can tell us more.",
  };
}

export function scoreAnswer(answer: string, key: AnswerKey, assisted: boolean): Score {
  if (key.kind === "number") return scoreNumber(answer, key, assisted);
  const normalize = (value: string) => value.normalize("NFKC").trim().replace(/\s+/g, " ");
  const given = normalize(answer);
  const correct = key.accepted.some(accepted => {
    const expected = normalize(accepted);
    return key.caseSensitive ? given === expected : given.toLocaleLowerCase() === expected.toLocaleLowerCase();
  });
  return correct
    ? { status: "correct", value: 1, feedback: assisted ? "That matches this checked example with support. Try a fresh question to check what you can do on your own." : "That matches this checked example. Nice work; a fresh later check can tell us more." }
    : { status: "wrong_value", value: 0, feedback: "That does not match this checked example yet. Check the words and punctuation, then try another question. Other valid wording may need review." };
}
