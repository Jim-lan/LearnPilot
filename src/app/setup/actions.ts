"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { demoPack } from "@/domain/demo-content";
import { familyPack } from "@/domain/family-catalog";
import { importDemoPack } from "@/server/content-import";
import { getDb } from "@/server/db";
import { LEARNER_COOKIE, lookupLearner } from "@/server/learner";

export async function chooseLearner(form: FormData) {
  const key = String(form.get("learner") ?? "");
  const learner = lookupLearner(key);
  if (!learner) throw new Error("Choose Alex or Vincent");
  const db = getDb();
  importDemoPack(db, demoPack);
  importDemoPack(db, familyPack);
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO students (id, display_name, environment, course_id, unit_id, goal, minutes_available, preferred_format, created_at, updated_at)
    VALUES (?, ?, 'synthetic_demo', ?, 'family_starters', 'practice', 15, 'read', ?, ?)
    ON CONFLICT(id) DO NOTHING`)
    .run(learner.id, learner.name, learner.grade === 3 ? "Grade 3" : "Grade 9", now, now);
  (await cookies()).set(LEARNER_COOKIE, key, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  redirect("/subjects");
}
