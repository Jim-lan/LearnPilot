import { cookies } from "next/headers";
import { learnerProfiles, type LearnerKey } from "@/domain/family-catalog";

export const LEARNER_COOKIE = "learnpilot_learner";

export function lookupLearner(value: string | undefined) {
  return value === "alex" || value === "vincent" ? learnerProfiles[value as LearnerKey] : null;
}

export async function selectedLearner() {
  return lookupLearner((await cookies()).get(LEARNER_COOKIE)?.value);
}
