import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/activity";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * DELETE /api/admin/media — remove one file from the public
 * `site-images` Storage bucket. Body: { path }.
 *
 * The path must live under one of the bucket's known folders
 * (artists/, companies/, site/) so a stray path can never delete
 * outside the media library. Deleting a file does NOT rewrite any
 * record that references its URL — a company or artist still
 * pointing at a deleted image shows no image until its own image
 * field is changed in its editor.
 *
 * Admin session required. Writes go through the service-role key.
 */

const BUCKET = "site-images";
const ALLOWED_PREFIXES = ["artists/", "companies/", "site/"];

export async function DELETE(request: NextRequest) {
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
  const path = typeof record.path === "string" ? record.path : "";
  if (
    !path ||
    path.includes("..") ||
    !ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))
  ) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
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

  const { error } = await client.storage.from(BUCKET).remove([path]);
  if (error) {
    console.warn("[admin/media] delete failed:", error.message);
    return NextResponse.json(
      { error: "Could not delete the file. Please try again." },
      { status: 500 },
    );
  }

  await logAdminAction("delete", "media", path, `Deleted image ${path}`);
  return NextResponse.json({ ok: true });
}
