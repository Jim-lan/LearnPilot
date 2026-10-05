import { createHash } from "node:crypto";
import type Database from "better-sqlite3";
import { demoPack, type DemoPack } from "@/domain/demo-content";
import { familyPack } from "@/domain/family-catalog";
import { rulePack } from "@/domain/rule-content";

type Pack = DemoPack;

export function validateDemoPack(pack: Pack): void {
  if (!pack.id.startsWith("demo:") || !/^\d+\.\d+\.\d+$/.test(pack.version)) throw new Error("Invalid demo pack identity");
  const conceptIds = new Set(pack.concepts.map(concept => concept.id));
  const refCodes = new Set(pack.expectations);
  if (conceptIds.size !== pack.concepts.length || new Set(pack.items.map(item => item.id)).size !== pack.items.length) throw new Error("Duplicate content ID");
  for (const concept of pack.concepts) {
    if (!concept.id.startsWith("demo:") || (concept.expectation && !refCodes.has(concept.expectation)) || concept.prerequisites.some(id => !conceptIds.has(id))) throw new Error(`Broken concept reference: ${concept.id}`);
  }
  for (const resource of pack.resources) {
    if (!conceptIds.has(resource.conceptId) || (resource.url && !resource.url.startsWith("https://"))) throw new Error(`Broken resource: ${resource.id}`);
  }
  for (const item of pack.items) {
    if (!conceptIds.has(item.conceptId) || (item.answer.kind === "number"
      ? !Number.isFinite(item.answer.value) || item.answer.tolerance < 0 || !item.answer.unit
      : !item.answer.display || item.answer.accepted.length < 1 || item.answer.accepted.some(value => !value.trim())
        || (item.answer.choices && (item.answer.choices.length < 2 || !item.answer.choices.includes(item.answer.display) || new Set(item.answer.choices).size !== item.answer.choices.length)))) throw new Error(`Broken item: ${item.id}`);
  }
}

export function importDemoPack(db: Database.Database, pack: Pack = demoPack): "imported" | "already_present" {
  validateDemoPack(pack);
  const digest = createHash("sha256").update(JSON.stringify(pack)).digest("hex");
  return db.transaction(() => {
    const existing = db.prepare("SELECT digest FROM content_packs WHERE id = ? AND version = ?").get(pack.id, pack.version) as { digest: string | null } | undefined;
    if (existing) {
      if (existing.digest !== digest) throw new Error("Content pack version conflict; publish a new version");
      return "already_present";
    }
    const now = new Date().toISOString();
    db.prepare("INSERT INTO content_packs (id, version, title, jurisdiction, course_code, curriculum_version, rights_status, review_status, source_url, imported_at, digest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(pack.id, pack.version, pack.title, pack.jurisdiction, pack.courseCode, pack.curriculumVersion, "original_and_link_only", "synthetic_automated_checked", pack.sourceUrl, now, digest);
    const refInsert = db.prepare("INSERT INTO expectation_refs (id, pack_id, pack_version, jurisdiction, course_code, curriculum_version, expectation_code, source_url, source_locator, wording_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const code of pack.expectations) refInsert.run(`demo:ref:${code}`, pack.id, pack.version, pack.jurisdiction, pack.courseCode, pack.curriculumVersion, code, pack.sourceUrl, `Expectation ${code}; wording not stored`, "metadata_candidate");
    const conceptInsert = db.prepare("INSERT INTO concepts (id, pack_id, pack_version, title, original_explanation, prerequisite_ids, mapping_status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    const mappingInsert = db.prepare("INSERT INTO concept_mappings (concept_id, expectation_id, pack_id, pack_version, review_status, review_method) VALUES (?, ?, ?, ?, ?, ?)");
    for (const concept of pack.concepts) {
      conceptInsert.run(concept.id, pack.id, pack.version, concept.title, concept.explanation, JSON.stringify(concept.prerequisites), concept.expectation ? "candidate" : "unmapped_demo");
      if (concept.expectation) mappingInsert.run(concept.id, `demo:ref:${concept.expectation}`, pack.id, pack.version, "candidate", "research inventory; not classroom reviewed");
    }
    const resourceInsert = db.prepare("INSERT INTO resources (id, pack_id, pack_version, concept_id, provider, url, purpose, review_status, availability, fallback_text, format, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const resource of pack.resources) resourceInsert.run(resource.id, pack.id, pack.version, resource.conceptId, resource.provider, resource.url, resource.purpose, resource.reviewStatus, resource.availability, resource.fallback, resource.format, resource.conceptId.includes("french") ? "fr-CA" : "en");
    const itemInsert = db.prepare("INSERT INTO items (id, version, pack_id, pack_version, concept_id, prompt, answer_kind, answer_json, rubric, mode, review_status, hint, validation_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const item of pack.items) itemInsert.run(item.id, 1, pack.id, pack.version, item.conceptId, item.prompt, item.answer.kind, JSON.stringify(item.answer), item.rubric, item.mode, "synthetic_automated_checked", item.hint, item.answer.kind === "number" ? "Original item; arithmetic key manually checked against prompt; no educator review" : "Original exact-response example; accepted forms are limited; no educator review");
    return "imported";
  }).immediate();
}

export function ensureStarterPacks(db: Database.Database): void {
  importDemoPack(db, demoPack);
  importDemoPack(db, familyPack);
  importDemoPack(db, rulePack);
}
