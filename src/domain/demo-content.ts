export type AnswerKey = { kind: "number"; value: number; unit: string; tolerance: number }
  | { kind: "text"; accepted: string[]; display: string; caseSensitive?: boolean };
export type DemoItem = {
  id: string;
  conceptId: string;
  prompt: string;
  answer: AnswerKey;
  hint: string;
  mode: "practice" | "reassessment";
  rubric: string;
};
export type DemoPack = {
  id: string; version: string; title: string; jurisdiction: string; courseCode: string; curriculumVersion: string; sourceUrl: string;
  expectations: string[];
  concepts: { id: string; title: string; explanation: string; prerequisites: string[]; expectation?: string }[];
  resources: { id: string; conceptId: string; provider: string; format: string; url: string | null; purpose: string; reviewStatus: string; availability: string; fallback: string }[];
  items: DemoItem[];
};

const item = (id: string, conceptId: string, prompt: string, value: number, unit: string, hint: string, mode: DemoItem["mode"] = "practice"): DemoItem => ({
  id: `demo:item:${id}`,
  conceptId: `demo:${conceptId}`,
  prompt,
  answer: { kind: "number", value, unit, tolerance: 0.001 },
  hint,
  mode,
  rubric: `Correct numerical value with ${unit}; equivalent units may be accepted after conversion.`,
});

export const demoPack: DemoPack = {
  id: "demo:snc1w-circuits",
  version: "0.1.0",
  title: "Original circuits practice — synthetic Grade 9 prototype",
  jurisdiction: "Ontario",
  courseCode: "SNC1W",
  curriculumVersion: "2022",
  sourceUrl: "https://assets-us-01.kc-usercontent.com/fbd574c4-da36-0066-a0c5-849ffb2de96e/a393c5f1-4619-4c34-877a-c22321d01e18/The%20Ontario%20Curriculum%20-%20Science_Grade%209_De-streamed%20Course_2022.pdf",
  expectations: ["D2.3", "D2.4", "D2.5", "D2.6"],
  concepts: [
    { id: "demo:units", title: "Circuit units", explanation: "Current is measured in amperes (A); resistance in ohms (Ω). A milliampere is one thousandth of an ampere, and a kilo-ohm is one thousand ohms.", prerequisites: [], expectation: "D2.3" },
    { id: "demo:ohms-law", title: "Voltage, current, and resistance", explanation: "For a simple resistive circuit, voltage equals current multiplied by resistance: V = I × R. Hold two values known and solve for the third, then check the unit.", prerequisites: ["demo:units"], expectation: "D2.4" },
    { id: "demo:series", title: "Series circuits", explanation: "A series path has no branch. The same current passes through each component. Resistances add, while component voltage drops add to the source voltage.", prerequisites: ["demo:ohms-law"], expectation: "D2.6" },
    { id: "demo:parallel", title: "Parallel circuits", explanation: "Parallel branches share the source voltage. Branch currents add at a junction. For two identical resistors in parallel, their equivalent resistance is half of either one.", prerequisites: ["demo:ohms-law"], expectation: "D2.6" },
  ],
  resources: [
    { id: "demo:resource:units", conceptId: "demo:units", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Look at the unit first: A and mA measure current; Ω and kΩ measure resistance. Multiply by 1000 when converting from the larger unit to the smaller one." },
    { id: "demo:resource:ohms", conceptId: "demo:ohms-law", provider: "LearnPilot", format: "text", url: null, purpose: "worked_example", reviewStatus: "automated_checked", availability: "available", fallback: "If a 6 V supply pushes 2 A through a resistor, divide 6 by 2 to get 3 Ω. Write the relationship and unit before checking your arithmetic." },
    { id: "demo:resource:series", conceptId: "demo:series", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Sketch one loop with two resistors. Follow the path with a finger: there is no split, so the current has one route. Add the two resistances." },
    { id: "demo:resource:parallel", conceptId: "demo:parallel", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Sketch a junction splitting into two branches. Each branch connects across the source, so each sees the same voltage. Add branch currents at the junction." },
    { id: "demo:resource:khan", conceptId: "demo:ohms-law", provider: "Khan Academy", format: "video", url: "https://www.khanacademy.org/science/in-in-class10th-physics/in-in-electricity/in-in-circuits-ohms-law-resistance/v/circuits-part-1", purpose: "alternative_explanation", reviewStatus: "candidate", availability: "unchecked", fallback: "Use the original LearnPilot voltage/current/resistance explanation if this link is unavailable." },
    { id: "demo:resource:phet", conceptId: "demo:parallel", provider: "PhET", format: "simulation", url: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc?locale=en", purpose: "exploration", reviewStatus: "candidate", availability: "unchecked", fallback: "Draw two branches and compare their voltage and current on paper if the simulation is unavailable." },
  ],
  items: [
    item("u01", "units", "Convert 0.5 A to milliamperes.", 500, "mA", "Multiply amperes by 1000."),
    item("u02", "units", "Convert 250 mA to amperes.", 0.25, "A", "Divide milliamperes by 1000."),
    item("u03", "units", "Convert 3 kΩ to ohms.", 3000, "Ω", "A kilo-ohm is 1000 ohms."),
    item("u04", "units", "Convert 1500 Ω to kilo-ohms.", 1.5, "kΩ", "Divide ohms by 1000."),
    item("u05", "units", "Convert 0.08 A to milliamperes.", 80, "mA", "Multiply amperes by 1000.", "reassessment"),
    item("u06", "units", "Convert 4.7 kΩ to ohms.", 4700, "Ω", "A kilo-ohm is 1000 ohms.", "reassessment"),
    item("o01", "ohms-law", "A 6 V supply is across a 3 Ω resistor. What current flows?", 2, "A", "Use I = V ÷ R."),
    item("o02", "ohms-law", "A 12 V supply is across a 4 Ω resistor. What current flows?", 3, "A", "Divide voltage by resistance."),
    item("o03", "ohms-law", "A 9 V supply produces 0.5 A. What is the resistance?", 18, "Ω", "Use R = V ÷ I."),
    item("o04", "ohms-law", "A 0.2 A current flows through 20 Ω. What is the voltage?", 4, "V", "Use V = I × R."),
    item("o05", "ohms-law", "A 15 V supply is across a 5 Ω resistor. What current flows?", 3, "A", "Use I = V ÷ R.", "reassessment"),
    item("o06", "ohms-law", "A 24 V supply produces 2 A. What resistance is present?", 12, "Ω", "Use R = V ÷ I.", "reassessment"),
    item("s01", "series", "Two series resistors are 2 Ω and 3 Ω. Find total resistance.", 5, "Ω", "Add series resistances."),
    item("s02", "series", "Two series resistors are 5 Ω and 7 Ω. Find total resistance.", 12, "Ω", "There is one path; add both values."),
    item("s03", "series", "A 9 V source drives a series circuit with total resistance 3 Ω. Find current.", 3, "A", "Use total resistance in I = V ÷ R."),
    item("s04", "series", "Series components drop 3 V and 5 V. What source voltage balances them?", 8, "V", "Add the voltage drops."),
    item("s05", "series", "Two series resistors are 4 Ω and 6 Ω. Find total resistance.", 10, "Ω", "Add the resistances.", "reassessment"),
    item("s06", "series", "A 12 V source is across a series circuit with total resistance 4 Ω. Find current.", 3, "A", "Use I = V ÷ R.", "reassessment"),
    item("p01", "parallel", "Two identical 6 Ω resistors are in parallel. Find equivalent resistance.", 3, "Ω", "Two equal parallel resistors have half the resistance of one."),
    item("p02", "parallel", "Two identical 10 Ω resistors are in parallel. Find equivalent resistance.", 5, "Ω", "Halve one resistor value."),
    item("p03", "parallel", "Parallel branch currents are 0.4 A and 0.6 A. Find source current.", 1, "A", "Add branch currents."),
    item("p04", "parallel", "A 9 V source feeds two parallel branches. What voltage is across each branch?", 9, "V", "Parallel branches share the source voltage."),
    item("p05", "parallel", "Two identical 8 Ω resistors are in parallel. Find equivalent resistance.", 4, "Ω", "Halve one resistor value.", "reassessment"),
    item("p06", "parallel", "Parallel branch currents are 1.5 A and 0.5 A. Find source current.", 2, "A", "Add branch currents.", "reassessment"),
  ] satisfies DemoItem[],
};
