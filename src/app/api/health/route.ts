import { getDb } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    const db = getDb();
    const row = db.prepare("SELECT MAX(version) AS version FROM schema_migrations").get() as { version: number };
    return Response.json({ status: "ok", mode: "synthetic_demo", model: "disabled", schemaVersion: row.version }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ status: "storage_unavailable" }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}
