import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/activity";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/admin/inbox — mark a contact submission read/unread, or
 * delete it. Body: { id, action: "read" | "unread" | "delete" }.
 * Admin session required.
 */
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
  const id = typeof record.id === "string" ? record.id : "";
  const action = record.action;
  if (!id || !["read", "unread", "delete"].includes(String(action))) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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

  if (action === "delete") {
    const { error } = await client
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (error) {
      console.warn("[admin/inbox] delete failed:", error.message);
      return NextResponse.json(
        { error: "Could not delete. Please try again." },
        { status: 500 },
      );
    }
    await logAdminAction(
      "delete",
      "contact_submissions",
      id,
      "Deleted a contact message",
    );
    return NextResponse.json({ ok: true });
  }

  const { error } = await client
    .from("contact_submissions")
    .update({ read: action === "read" })
    .eq("id", id);
  if (error) {
    console.warn("[admin/inbox] update failed:", error.message);
    return NextResponse.json(
      { error: "Could not update. Please try again." },
      { status: 500 },
    );
  }
  await logAdminAction(
    "update",
    "contact_submissions",
    id,
    `Marked a contact message ${action === "read" ? "read" : "unread"}`,
  );
  return NextResponse.json({ ok: true });
}
