import { getDb } from "@/server/db";

export const dynamic = "force-dynamic";

export default function DataPage() {
  const db = getDb();
  const schema = db.prepare("SELECT MAX(version) AS version FROM schema_migrations").get() as { version: number };
  const packs = db.prepare("SELECT id, version, title, review_status FROM content_packs ORDER BY imported_at DESC").all() as { id: string; version: string; title: string; review_status: string }[];
  return <div className="page"><p className="eyebrow">Data and boundaries</p><h1>Local, synthetic, inspectable.</h1><p className="lead">LearnPilot stores this prototype’s records in a private application directory outside the source tree. The web app listens on this computer’s loopback address. Live AI calls are disabled.</p>
    <div className="feature-card"><h2>Current state</h2><p>Database schema version: {schema.version}</p><p>Loaded content packs: {packs.length}</p>{packs.map(pack => <p key={`${pack.id}:${pack.version}`}><strong>{pack.title}</strong> · version {pack.version} · {pack.review_status.replaceAll("_", " ")}</p>)}<p className="muted">Curriculum mappings and external links in this pack are candidates, not approved Grade 9 recommendations.</p></div>
    <div className="notice"><strong>Prototype boundary:</strong> Backup, restore, deletion, private attachment review, and real-data policy checks are still in the task queue. Use fictional information only until those controls and reviews pass.</div>
  </div>;
}
