import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/activity";
import {
  artistToRow,
  companyToRow,
  getSupabaseAdmin,
  serviceToRow,
  stripToRow,
  territoryToRow,
} from "@/lib/supabase";
import type {
  Artist,
  Company,
  ServiceItem,
  StripItem,
  Territory,
} from "@/lib/types";

/**
 * POST /api/admin/content — bulk-replace one content table.
 *
 * Body: { table: "artists" | "companies" | "services" | "territories" | "strip_items", rows: [...] }
 * The editor sends the table's full set; the route deletes every row
 * and inserts the new set, in order. An empty rows array empties the
 * table — the public pages then fall back to their static copy, so
 * the site can never be blanked by accident.
 *
 * Admin session required. Writes go through the service-role key.
 * If the migration (supabase/amity-admin-migration.sql) has not run
 * yet, the route answers 503 and names the file instead of crashing.
 */

const TABLES = [
  "artists",
  "companies",
  "services",
  "territories",
  "strip_items",
] as const;
type TableName = (typeof TABLES)[number];

function migrationError(table: string): string {
  if (table === "strip_items") {
    return "The logo strip table does not exist yet. Run supabase/amity-strip-migration.sql in the Supabase SQL Editor, then try again.";
  }
  if (table === "territories") {
    return "The territories table does not exist yet. Run supabase/amity-territories-migration.sql in the Supabase SQL Editor, then try again.";
  }
  return "The admin tables do not exist yet. Run supabase/amity-admin-migration.sql in the Supabase SQL Editor, then try again.";
}

function missingTableError(message: string): boolean {
  return (
    message.includes("PGRST205") ||
    message.includes("does not exist") ||
    message.includes("Could not find the table")
  );
}

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!getAdminSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const record = (body ?? {}) as Record<string, unknown>;
  const table = record.table;
  const rows = record.rows;
  if (typeof table !== "string" || !TABLES.includes(table as TableName)) {
    return NextResponse.json({ error: "Unknown table." }, { status: 400 });
  }
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: "Rows must be an array." }, { status: 400 });
  }

  let client;
  try {
    client = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Supabase is not configured on the server." },
      { status: 503 },
    );
  }

  // Map + validate rows before touching the table, so a bad row never
  // leaves the table half-replaced.
  const mapped: Record<string, unknown>[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as Record<string, unknown>;
    if (typeof row !== "object" || row === null) {
      return NextResponse.json(
        { error: `Row ${i + 1} is not valid.` },
        { status: 400 },
      );
    }
    const slug = typeof row.slug === "string" ? row.slug.trim() : "";
    if (!slug) {
      return NextResponse.json(
        { error: `Row ${i + 1} needs a slug.` },
        { status: 400 },
      );
    }
    if (table === "artists") {
      const artist = row as unknown as Artist;
      if (!artist.name) {
        return NextResponse.json(
          { error: `Row ${i + 1} needs a name.` },
          { status: 400 },
        );
      }
      mapped.push(artistToRow(artist, i));
    } else if (table === "companies") {
      const company = row as unknown as Company;
      if (!company.name) {
        return NextResponse.json(
          { error: `Row ${i + 1} needs a name.` },
          { status: 400 },
        );
      }
      mapped.push(companyToRow(company, i));
    } else if (table === "territories") {
      const territory = row as unknown as Territory;
      if (!territory.name) {
        return NextResponse.json(
          { error: `Row ${i + 1} needs a name.` },
          { status: 400 },
        );
      }
      mapped.push(territoryToRow(territory, i));
    } else if (table === "strip_items") {
      const item = row as unknown as StripItem;
      if (!item.name) {
        return NextResponse.json(
          { error: `Row ${i + 1} needs a name.` },
          { status: 400 },
        );
      }
      if (!item.image) {
        return NextResponse.json(
          { error: `Row ${i + 1} needs a logo image.` },
          { status: 400 },
        );
      }
      mapped.push(stripToRow(item, i));
    } else {
      const service = row as unknown as ServiceItem;
      if (!service.title) {
        return NextResponse.json(
          { error: `Row ${i + 1} needs a title.` },
          { status: 400 },
        );
      }
      mapped.push(serviceToRow(service, i));
    }
  }

  // PostgREST requires a filter on delete; "not the zero UUID"
  // matches every real row, so this deletes the whole table.
  const { error: deleteError } = await client
    .from(table)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) {
    if (missingTableError(deleteError.message)) {
      return NextResponse.json(
        { error: migrationError(table) },
        { status: 503 },
      );
    }
    console.warn("[admin/content] delete failed:", deleteError.message);
    return NextResponse.json(
      { error: "Could not save. Please try again." },
      { status: 500 },
    );
  }

  if (mapped.length > 0) {
    const { error: insertError } = await client.from(table).insert(mapped);
    if (insertError) {
      console.warn("[admin/content] insert failed:", insertError.message);
      return NextResponse.json(
        { error: "Could not save. Please try again." },
        { status: 500 },
      );
    }
  }

  await logAdminAction(
    "save",
    table,
    "",
    `${mapped.length} ${table} saved`,
  );
  return NextResponse.json({ ok: true, count: mapped.length });
}
