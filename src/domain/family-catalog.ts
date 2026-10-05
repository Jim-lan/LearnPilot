import { demoPack, type DemoItem, type DemoPack } from "./demo-content";
import { rulePack } from "./rule-content";

export type LearnerKey = "alex" | "vincent";
export type SubjectKey = "science" | "math" | "english" | "french";
export const learnerProfiles = {
  alex: { key: "alex", id: "demo:student:alex", name: "Alex", grade: 9, note: "Grade 9 · explore one step at a time", subjects: ["science", "math", "english"] as SubjectKey[] },
  vincent: { key: "vincent", id: "demo:student:vincent", name: "Vincent", grade: 3, note: "Grade 3 · French immersion", subjects: ["math", "english", "french"] as SubjectKey[] },
} as const;

export const subjectNames: Record<SubjectKey, string> = { science: "Science", math: "Math", english: "English", french: "French" };

const concept = (id: string, title: string, explanation: string) => ({ id: `demo:${id}`, title, explanation, prerequisites: [] as string[] });
const textItem = (id: string, conceptId: string, prompt: string, display: string, hint: string, mode: DemoItem["mode"] = "practice", accepted: string[] = [display]): DemoItem => ({
  id: `demo:item:${id}`, conceptId: `demo:${conceptId}`, prompt,
  answer: { kind: "text", accepted: conceptId.startsWith("g3-french") && display.endsWith(".") ? [display, display.slice(0, -1)] : accepted, display, caseSensitive: conceptId === "g3-english" }, hint, mode,
  rubric: "Original checked response. Other valid phrasings need human review before use as assessment evidence.",
});

export const familyPack: DemoPack = {
  id: "demo:family-starters", version: "1.0.0", title: "Original Grade 3 and Grade 9 starter practice — synthetic",
  jurisdiction: "original_demo", courseCode: "HOME-DEMO", curriculumVersion: "unmapped", sourceUrl: "https://github.com/Jim-lan/LearnPilot",
  expectations: [],
  concepts: [
    concept("g3-addition", "Add within 100", "Break numbers into tens and ones. Add each part, then check the total."),
    concept("g3-multiplication", "Multiplication groups", "Multiplication counts equal groups. Four groups of three means 3 + 3 + 3 + 3."),
    concept("g3-english", "Build an English sentence", "A complete sentence begins with a capital letter and ends with punctuation. Read it aloud to hear if it makes sense."),
    concept("g3-french-words", "Useful French words", "A word can have more than one useful meaning. Listen to a short example, then try a fresh word."),
    concept("g3-french-sentences", "French everyday sentences", "Listen for familiar words, then build a short sentence with a subject and action."),
    concept("g9-linear", "Solve a linear equation", "Keep an equation balanced: undo addition first, then undo multiplication."),
    concept("g9-english", "Clear English sentences", "Join related ideas with a clear connection and check punctuation."),
  ],
  resources: [
    { id: "demo:resource:g3-addition", conceptId: "demo:g3-addition", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Try 24 + 13 as 20 + 10 and 4 + 3. Add the tens and ones to get 37." },
    { id: "demo:resource:g3-multiplication", conceptId: "demo:g3-multiplication", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Draw equal groups. Count each group once, then add the same number of objects in every group." },
    { id: "demo:resource:g3-english", conceptId: "demo:g3-english", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Example: The cat sleeps. The first word is capitalized and the idea ends with a period." },
    { id: "demo:resource:g3-french-words", conceptId: "demo:g3-french-words", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Listen to bonjour and say it back if you like. This is listening practice; it does not measure pronunciation." },
    { id: "demo:resource:g3-french-sentences", conceptId: "demo:g3-french-sentences", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Listen to Je parle français. Say the sentence aloud at your own pace; the app does not record your voice." },
    { id: "demo:resource:g9-linear", conceptId: "demo:g9-linear", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "For 2x + 4 = 10, subtract 4 to get 2x = 6, then divide by 2 to get x = 3." },
    { id: "demo:resource:g9-english", conceptId: "demo:g9-english", provider: "LearnPilot", format: "text", url: null, purpose: "introduction", reviewStatus: "automated_checked", availability: "available", fallback: "Two ideas can join with because when one explains the other: We went inside because it rained." },
  ],
  items: [
    textItem("g3-a01", "g3-addition", "What is 28 + 15? Write the number.", "43", "Add tens, then ones."),
    textItem("g3-a02", "g3-addition", "What is 46 + 27? Write the number.", "73", "46 + 20 is 66; add 7."),
    textItem("g3-a03", "g3-addition", "Later check: what is 39 + 24?", "63", "Add 20, then 4.", "reassessment"),
    textItem("g3-m01", "g3-multiplication", "What is 4 groups of 3? Write the number.", "12", "Add 3 four times."),
    textItem("g3-m02", "g3-multiplication", "What is 5 groups of 2? Write the number.", "10", "Count by twos five times."),
    textItem("g3-m03", "g3-multiplication", "Later check: what is 3 groups of 4?", "12", "Add 4 three times.", "reassessment"),
    textItem("g3-e01", "g3-english", "Write this as a sentence with a capital letter and period: the dog runs", "The dog runs.", "Start with a capital T and finish with a period."),
    textItem("g3-e02", "g3-english", "Write this as a sentence with a capital letter and period: we read books", "We read books.", "Start with a capital W and finish with a period."),
    textItem("g3-e03", "g3-english", "Later check: write this as a sentence: birds can fly", "Birds can fly.", "Capital at the start; period at the end.", "reassessment"),
    textItem("g3-fw01", "g3-french-words", "Write the French word for thank you.", "merci", "It starts with m."),
    textItem("g3-fw02", "g3-french-words", "Write the French words for goodbye.", "au revoir", "Two words; the second starts with r."),
    textItem("g3-fw03", "g3-french-words", "Later check: write the French word for yes.", "oui", "It has three letters.", "reassessment"),
    textItem("g3-fs01", "g3-french-sentences", "Write 'I am at home' in French.", "Je suis à la maison.", "Begin Je suis, then add à la maison."),
    textItem("g3-fs02", "g3-french-sentences", "Write 'I like school' in French.", "J'aime l'école.", "Begin J'aime, then add l'école."),
    textItem("g3-fs03", "g3-french-sentences", "Later check: write 'I speak French' in French.", "Je parle français.", "Begin Je parle.", "reassessment"),
    textItem("g9-l01", "g9-linear", "Solve 3x + 6 = 21. What is x?", "5", "Subtract 6, then divide by 3."),
    textItem("g9-l02", "g9-linear", "Solve 4x - 8 = 20. What is x?", "7", "Add 8, then divide by 4."),
    textItem("g9-l03", "g9-linear", "Later check: solve 5x + 10 = 35. What is x?", "5", "Subtract 10, then divide by 5.", "reassessment"),
    textItem("g9-e01", "g9-english", "Join with 'because': We went inside. It was raining.", "We went inside because it was raining.", "Use because to explain why."),
    textItem("g9-e02", "g9-english", "Join with 'because': I wore a coat. It was cold.", "I wore a coat because it was cold.", "Use because between the two ideas."),
    textItem("g9-e03", "g9-english", "Later check: join with 'because': I drank water. I was thirsty.", "I drank water because I was thirsty.", "Use because to show the reason.", "reassessment"),
  ],
};

export const frenchExamples: Partial<Record<string, { word: string; sentence: string }>> = {
  "demo:g3-french-words": { word: "bonjour", sentence: "Bonjour, comment ça va ?" },
  "demo:g3-french-sentences": { word: "école", sentence: "Je parle français." },
};

export function subjectsFor(learner: LearnerKey) {
  const concepts = learner === "alex" ? [
    { subject: "science" as SubjectKey, pack: demoPack, concepts: demoPack.concepts },
    { subject: "math" as SubjectKey, pack: familyPack, concepts: familyPack.concepts.filter(c => c.id === "demo:g9-linear") },
    { subject: "english" as SubjectKey, pack: familyPack, concepts: familyPack.concepts.filter(c => c.id === "demo:g9-english") },
  ] : [
    { subject: "math" as SubjectKey, pack: familyPack, concepts: [...familyPack.concepts.filter(c => ["demo:g3-addition", "demo:g3-multiplication"].includes(c.id)), ...rulePack.concepts] },
    { subject: "english" as SubjectKey, pack: familyPack, concepts: familyPack.concepts.filter(c => c.id === "demo:g3-english") },
    { subject: "french" as SubjectKey, pack: familyPack, concepts: familyPack.concepts.filter(c => c.id.startsWith("demo:g3-french")) },
  ];
  return concepts;
}

export function packForConcept(conceptId: string): DemoPack | null {
  return [demoPack, familyPack, rulePack].find(pack => pack.concepts.some(concept => concept.id === conceptId)) ?? null;
}

export function findLearnerConcept(learner: LearnerKey, conceptId: string) {
  for (const group of subjectsFor(learner)) {
    const concept = group.concepts.find(c => c.id === conceptId);
    if (concept) return { ...group, concept };
  }
  return null;
}
