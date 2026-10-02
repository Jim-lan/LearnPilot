export type SetupChoice = { displayName: string; goal: "introduce" | "practice" | "review"; minutes: number; preferredFormat: "read" | "watch" | "explore"; assessmentDate: string | null };

export function parseSetup(form: FormData): SetupChoice {
  const displayName = String(form.get("displayName") ?? "").trim();
  const goal = String(form.get("goal") ?? "introduce");
  const minutes = Number(form.get("minutes") ?? 15);
  const preferredFormat = String(form.get("preferredFormat") ?? "read");
  const assessmentDate = String(form.get("assessmentDate") ?? "").trim() || null;
  if (displayName.length < 1 || displayName.length > 60) throw new Error("Choose a short display name");
  if (!["introduce", "practice", "review"].includes(goal)) throw new Error("Invalid goal");
  if (!Number.isInteger(minutes) || minutes < 5 || minutes > 60) throw new Error("Choose 5–60 minutes");
  if (!["read", "watch", "explore"].includes(preferredFormat)) throw new Error("Invalid format");
  if (assessmentDate && (!/^\d{4}-\d{2}-\d{2}$/.test(assessmentDate) || Number.isNaN(Date.parse(assessmentDate)))) throw new Error("Invalid assessment date");
  return { displayName, goal: goal as SetupChoice["goal"], minutes, preferredFormat: preferredFormat as SetupChoice["preferredFormat"], assessmentDate };
}
