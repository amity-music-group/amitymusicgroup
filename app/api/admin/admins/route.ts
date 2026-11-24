import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/supabase-auth";
import { logAdminAction } from "@/lib/activity";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * /api/admin/admins — manage the admin allowlist (admin_users).
 *
 * GET: list every allowed email.
 * POST { email }: add an email. Takes effect straight away — the
 *   next request from that email passes the allowlist check.
 * DELETE { email }: remove an email. Refuses the last remaining
 *   admin and refuses removing your own email, so nobody can lock
 *   themself (or everyone) out by accident.
 *
 * Admin session required. If the admin_users migration has not run
 * yet, the route answers 503 and names the file instead of crashing.
 * The ADMIN_EMAILS env var still counts as well (see
 * lib/admin-allowlist.ts), so removing an email here does not block
 * it if it is also in the env var.
 */

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function missingTable(error: { message: string }): boolean {
  return (
    error.message.includes("PGRST205") ||
    error.message.includes("does not exist") ||
    error.message.includes("Could not find the table")
  );
}

const MIGRATION_ERROR =
  "The admin list does not exist yet. Run supabase/amity-admin-users-migration.sql in the Supabase SQL Editor, then try again.";

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const { data, error } = await client
    .from("admin_users")
    .select("id, email, created_at")
    .order("email", { ascending: true });
  if (error) {
    if (missingTable(error)) {
      return NextResponse.json({ error: MIGRATION_ERROR }, { status: 503 });
    }
    console.warn("[admin/admins] list failed:", error.message);
    return NextResponse.json(
      { error: "Could not load the admin list. Please try again." },
      { status: 500 },
    );
  }
  return NextResponse.json({ admins: data ?? [] });
}

export async function POST(request: NextRequest) {
  const session = await getAdminUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const raw = (body as Record<string, unknown> | null)?.email;
  if (typeof raw !== "string") {
    return NextResponse.json(
      { error: "Enter an email address." },
      { status: 400 },
    );
  }
  const email = raw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That does not look like an email address." },
      { status: 400 },
    );
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
  const { data, error } = await client
    .from("admin_users")
    .insert({ email })
    .select("id, email, created_at")
    .single();
  if (error) {
    if (missingTable(error)) {
      return NextResponse.json({ error: MIGRATION_ERROR }, { status: 503 });
    }
    if (error.code === "23505") {
      return NextResponse.json({
        ok: true,
        already: true,
        message: `${email} is already an admin.`,
      });
    }
    console.warn("[admin/admins] add failed:", error.message);
    return NextResponse.json(
      { error: "Could not add that admin. Please try again." },
      { status: 500 },
    );
  }

  await logAdminAction("save", "admin_users", "", `Admin added: ${email}`);
  return NextResponse.json({ ok: true, admin: data });
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const raw = (body as Record<string, unknown> | null)?.email;
  if (typeof raw !== "string") {
    return NextResponse.json(
      { error: "Enter an email address." },
      { status: 400 },
    );
  }
  const email = raw.trim().toLowerCase();
  if (email === session.email.toLowerCase()) {
    return NextResponse.json(
      { error: "You cannot remove your own email address." },
      { status: 400 },
    );
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
  const { count, error: countError } = await client
    .from("admin_users")
    .select("id", { count: "exact", head: true });
  if (countError) {
    if (missingTable(countError)) {
      return NextResponse.json({ error: MIGRATION_ERROR }, { status: 503 });
    }
    console.warn("[admin/admins] count failed:", countError.message);
    return NextResponse.json(
      { error: "Could not remove that admin. Please try again." },
      { status: 500 },
    );
  }
  if ((count ?? 0) <= 1) {
    return NextResponse.json(
      { error: "Cannot remove the last admin." },
      { status: 400 },
    );
  }

  const { error } = await client
    .from("admin_users")
    .delete()
    .eq("email", email);
  if (error) {
    if (missingTable(error)) {
      return NextResponse.json({ error: MIGRATION_ERROR }, { status: 503 });
    }
    console.warn("[admin/admins] remove failed:", error.message);
    return NextResponse.json(
      { error: "Could not remove that admin. Please try again." },
      { status: 500 },
    );
  }

  await logAdminAction("save", "admin_users", "", `Admin removed: ${email}`);
  return NextResponse.json({ ok: true });
}
