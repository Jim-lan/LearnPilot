import type { LearnerKey } from "./family-catalog";

// Spoken words choose a profile; the sound of a voice is never used as identity proof.
export function learnerNamedIn(text: string): LearnerKey | null {
  const alex = /\balex\b/i.test(text);
  const vincent = /\bvincent\b/i.test(text);
  if (alex === vincent) return null;
  return alex ? "alex" : "vincent";
}
