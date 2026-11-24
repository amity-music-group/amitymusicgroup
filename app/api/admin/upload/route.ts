import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/supabase-auth";
import { getSupabaseAdmin, supabaseUrl } from "@/lib/supabase";

/**
 * POST /api/admin/upload — upload one image to the public
 * `site-images` Storage bucket.
 *
 * Multipart form fields: file (the image), kind ("artists" |
 * "companies" | "site" | "strip"), slug (used in the storage path).
 *
 * Stored at <kind>/<slug>-<timestamp>.<ext>. Returns
 * { url } — the bucket's public URL — which the admin editor puts
 * into the row's image field. Saving still happens through the
 * editor's own Save button; this route only stores the file.
 *
 * Admin session required (401 otherwise). Images only
 * (jpeg/png/webp/gif/avif), max 5 MB — anything else is a 400.
 * The bucket already exists (created 2026-11-23, public); this
 * route never creates buckets.
 */

const BUCKET = "site-images";
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const KINDS = ["artists", "companies", "site", "strip"] as const;
type Kind = (typeof KINDS)[number];

function cleanSlug(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected a multipart form upload." },
      { status: 400 },
    );
  }

  const kindValue = form.get("kind");
  if (typeof kindValue !== "string" || !KINDS.includes(kindValue as Kind)) {
    return NextResponse.json(
      { error: "kind must be artists, companies, site or strip." },
      { status: 400 },
    );
  }
  const kind = kindValue as Kind;
  const slug = cleanSlug(form.get("slug")) || "image";

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "No image file was uploaded." },
      { status: 400 },
    );
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, GIF and AVIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const path = `${kind}/${slug}-${Date.now()}.${ext}`;

  let client;
  try {
    client = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Supabase is not configured on the server." },
      { status: 503 },
    );
  }

  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    console.warn("[admin/upload] upload failed:", error.message);
    return NextResponse.json(
      { error: "Could not upload the image. Please try again." },
      { status: 500 },
    );
  }

  const url = `${supabaseUrl()}/storage/v1/object/public/${BUCKET}/${path}`;
  return NextResponse.json({ url });
}
