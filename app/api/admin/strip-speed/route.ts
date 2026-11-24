import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/supabase-auth";
import { logAdminAction } from "@/lib/activity";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/admin/strip-speed — save only the /labels logo strip
 * speed, in px per second.
 *
 * Body: { speedPxPerSec: number } (clamped to 20–150).
 *
 * A dedicated route, not the settings route: the settings route
 * upserts the whole site_settings row from the posted object, so
 * posting only a speed from the strip editor would blank every
 * other setting. This route updates just the one column. Admin
 * session required. If the strip migration has not run yet, the
 * route answers 503 and names the file instead of crashing.
 */
export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const speed = (body as Record<string, unknown> | null)?.speedPxPerSec;
  if (typeof speed !== "number" || !Number.isFinite(speed)) {
    return NextResponse.json(
      { error: "Speed must be a number of pixels per second." },
      { status: 400 },
    );
  }
  const clamped = Math.max(20, Math.min(150, Math.round(speed)));

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
    .from("site_settings")
    .update({ strip_speed_px_per_sec: clamped })
    .eq("id", 1)
    .select("id");
  if (error) {
    if (
      error.message.includes("PGRST205") ||
      error.message.includes("does not exist") ||
      error.message.includes("Could not find the column")
    ) {
      return NextResponse.json(
        {
          error:
            "The strip speed setting does not exist yet. Run supabase/amity-strip-migration.sql in the Supabase SQL Editor, then try again.",
        },
        { status: 503 },
      );
    }
    console.warn("[admin/strip-speed] save failed:", error.message);
    return NextResponse.json(
      { error: "Could not save. Please try again." },
      { status: 500 },
    );
  }
  if (!data || data.length === 0) {
    const { error: insertError } = await client
      .from("site_settings")
      .insert({ id: 1, strip_speed_px_per_sec: clamped });
    if (insertError) {
      console.warn("[admin/strip-speed] insert failed:", insertError.message);
      return NextResponse.json(
        { error: "Could not save. Please try again." },
        { status: 500 },
      );
    }
  }

  await logAdminAction(
    "save",
    "site_settings",
    "",
    `Logo strip speed set to ${clamped} px/s`,
  );
  return NextResponse.json({ ok: true, speedPxPerSec: clamped });
}
