import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/activity";
import { getSupabaseAdmin, releaseToRow } from "@/lib/supabase";
import type { Release } from "@/lib/types";

/**
 * POST /api/admin/releases — bulk-replace one artist's releases.
 *
 * Body: { artist_id, releases: [{ title, type, release_date, link,
 * visible }] } — the releases are saved in the order given. An empty
 * releases array clears the artist's releases (used when the artist
 * is deleted from the artists editor).
 *
 * The artist must exist first: the artists editor saves the artist
 * rows (which creates the row with its id) before posting releases.
 * Releases are admin-side detail for now — the public Artists page
 * does not render them.
 *
 * Admin session required. Writes go through the service-role key.
 * If the releases table does not exist yet, the route answers 503
 * and names the beefy-admin migration instead of crashing.
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
  const artistId = typeof record.artist_id === "string" ? record.artist_id : "";
  const releases = record.releases;
  if (!artistId) {
    return NextResponse.json({ error: "artist_id is required." }, { status: 400 });
  }
  if (!Array.isArray(releases)) {
    return NextResponse.json(
      { error: "Releases must be an array." },
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

  // An empty releases array clears the artist's releases. That is
  // how the artists editor cleans up after deleting an artist, so it
  // must work even when the artist row is already gone — no
  // artist-existence check in this branch.
  if (releases.length === 0) {
    const { error: deleteError } = await client
      .from("releases")
      .delete()
      .eq("artist_id", artistId);
    if (deleteError) {
      if (
        deleteError.message.includes("PGRST205") ||
        deleteError.message.includes("does not exist")
      ) {
        return NextResponse.json(
          {
            error:
              "The releases table does not exist yet. Run supabase/amity-admin-beefy-migration.sql in the Supabase SQL Editor, then try again.",
          },
          { status: 503 },
        );
      }
      console.warn("[admin/releases] delete failed:", deleteError.message);
      return NextResponse.json(
        { error: "Could not save. Please try again." },
        { status: 500 },
      );
    }
    await logAdminAction(
      "save",
      "releases",
      artistId,
      "Releases cleared for a removed artist",
    );
    return NextResponse.json({ ok: true, count: 0 });
  }

  // The artist must exist — releases never dangle off a missing id.
  const { data: artist, error: artistError } = await client
    .from("artists")
    .select("id, name")
    .eq("id", artistId)
    .maybeSingle();
  if (artistError) {
    if (
      artistError.message.includes("PGRST205") ||
      artistError.message.includes("does not exist")
    ) {
      return NextResponse.json(
        {
          error:
            "The admin tables do not exist yet. Run supabase/amity-admin-beefy-migration.sql in the Supabase SQL Editor, then try again.",
        },
        { status: 503 },
      );
    }
    console.warn("[admin/releases] artist lookup failed:", artistError.message);
    return NextResponse.json(
      { error: "Could not save. Please try again." },
      { status: 500 },
    );
  }
  if (!artist) {
    return NextResponse.json(
      { error: "That artist does not exist — save the artist first." },
      { status: 400 },
    );
  }

  // Map + validate before touching the table, so a bad release never
  // leaves the artist's releases half-replaced.
  const mapped: Record<string, unknown>[] = [];
  for (let i = 0; i < releases.length; i++) {
    const row = releases[i] as Record<string, unknown>;
    if (typeof row !== "object" || row === null) {
      return NextResponse.json(
        { error: `Release ${i + 1} is not valid.` },
        { status: 400 },
      );
    }
    const release = row as unknown as Release;
    const title = typeof release.title === "string" ? release.title.trim() : "";
    if (!title) {
      return NextResponse.json(
        { error: `Release ${i + 1} needs a title.` },
        { status: 400 },
      );
    }
    mapped.push(
      releaseToRow(
        {
          ...release,
          id:
            typeof release.id === "string" && release.id !== ""
              ? release.id
              : crypto.randomUUID(),
          artistId,
          title,
          type: typeof release.type === "string" ? release.type : "",
          releaseDate:
            typeof release.releaseDate === "string" ? release.releaseDate : "",
          link: typeof release.link === "string" ? release.link : "",
          visible: release.visible !== false,
        },
        i,
      ),
    );
  }

  const { error: deleteError } = await client
    .from("releases")
    .delete()
    .eq("artist_id", artistId);
  if (deleteError) {
    if (
      deleteError.message.includes("PGRST205") ||
      deleteError.message.includes("does not exist")
    ) {
      return NextResponse.json(
        {
          error:
            "The releases table does not exist yet. Run supabase/amity-admin-beefy-migration.sql in the Supabase SQL Editor, then try again.",
        },
        { status: 503 },
      );
    }
    console.warn("[admin/releases] delete failed:", deleteError.message);
    return NextResponse.json(
      { error: "Could not save. Please try again." },
      { status: 500 },
    );
  }

  if (mapped.length > 0) {
    const { error: insertError } = await client.from("releases").insert(mapped);
    if (insertError) {
      console.warn("[admin/releases] insert failed:", insertError.message);
      return NextResponse.json(
        { error: "Could not save. Please try again." },
        { status: 500 },
      );
    }
  }

  const artistName =
    typeof (artist as Record<string, unknown>).name === "string"
      ? String((artist as Record<string, unknown>).name)
      : "artist";
  await logAdminAction(
    "save",
    "releases",
    artistId,
    `${mapped.length} release${mapped.length === 1 ? "" : "s"} saved for ${artistName}`,
  );

  return NextResponse.json({ ok: true, count: mapped.length });
}
