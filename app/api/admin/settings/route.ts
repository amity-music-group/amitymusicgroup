import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/activity";
import { getSupabaseAdmin, siteToRow } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/types";

/**
 * POST /api/admin/settings — upsert the single site_settings row
 * (id = 1). Admin session required.
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
  const settings = (body ?? {}) as Partial<SiteSettings>;
  if (typeof settings !== "object" || settings === null) {
    return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
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

  const full: SiteSettings = {
    tagline: typeof settings.tagline === "string" ? settings.tagline : "",
    heroImage:
      typeof settings.heroImage === "string" ? settings.heroImage : "",
    heroSubcopy:
      typeof settings.heroSubcopy === "string" ? settings.heroSubcopy : "",
    aboutIntro:
      typeof settings.aboutIntro === "string" ? settings.aboutIntro : "",
    aboutBody:
      typeof settings.aboutBody === "string" ? settings.aboutBody : "",
    aboutPageIntro:
      typeof settings.aboutPageIntro === "string"
        ? settings.aboutPageIntro
        : "",
    aboutPageBody:
      typeof settings.aboutPageBody === "string" ? settings.aboutPageBody : "",
    missionTitle:
      typeof settings.missionTitle === "string" ? settings.missionTitle : "",
    missionBody:
      typeof settings.missionBody === "string" ? settings.missionBody : "",
    contactIntro:
      typeof settings.contactIntro === "string" ? settings.contactIntro : "",
    footerText:
      typeof settings.footerText === "string" ? settings.footerText : "",
    emailGeneral:
      typeof settings.emailGeneral === "string" ? settings.emailGeneral : "",
    instagram:
      typeof settings.instagram === "string" ? settings.instagram : "",
    facebook:
      typeof settings.facebook === "string" ? settings.facebook : "",
    tiktok: typeof settings.tiktok === "string" ? settings.tiktok : "",
    youtube: typeof settings.youtube === "string" ? settings.youtube : "",
    seoTitle:
      typeof settings.seoTitle === "string" ? settings.seoTitle : "",
    seoDescription:
      typeof settings.seoDescription === "string"
        ? settings.seoDescription
        : "",
  };

  const { error } = await client
    .from("site_settings")
    .upsert(siteToRow(full), { onConflict: "id" });
  if (error) {
    if (
      error.message.includes("PGRST205") ||
      error.message.includes("does not exist")
    ) {
      return NextResponse.json(
        {
          error:
            "The admin tables do not exist yet. Run supabase/amity-admin-migration.sql in the Supabase SQL Editor, then try again.",
        },
        { status: 503 },
      );
    }
    console.warn("[admin/settings] save failed:", error.message);
    return NextResponse.json(
      { error: "Could not save. Please try again." },
      { status: 500 },
    );
  }

  await logAdminAction("save", "site_settings", "", "Site settings saved");
  return NextResponse.json({ ok: true });
}
