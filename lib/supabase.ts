import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Artist,
  Company,
  Release,
  ServiceItem,
  SiteSettings,
  Territory,
} from "@/lib/types";

/**
 * Supabase access for Amity Music Group.
 *
 * Two keys, two very different jobs:
 *
 * - The ANON key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is safe to expose. It
 *   can only SELECT the five public content tables, because Row Level
 *   Security has a "Public read" policy for anon on those tables and
 *   no policy at all on the rest (see
 *   supabase/amity-admin-migration.sql). The public site reads
 *   through this key.
 * - The SERVICE-ROLE key (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS and
 *   can write. It lives ONLY on the server, is used ONLY by the
 *   /admin save routes and the contact/newsletter API routes, and must
 *   never be prefixed NEXT_PUBLIC_.
 *
 * The Supabase project does not exist yet — until the URL and keys are
 * set in Vercel, every getter below returns its static fallback and
 * the site behaves exactly as it does today.
 */

export function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function publicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Read-only client (anon key). Safe to use in server components and
 * pages. Returns null when Supabase is not configured.
 */
export function getSupabasePublic(): SupabaseClient | null {
  return publicClient();
}

/**
 * Write client (service-role key). SERVER ONLY — never call this from
 * a client component. Throws when the key is missing so the caller can
 * answer 503 instead of failing silently.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin must only run on the server.");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured on the server (missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ---------------------------------------------------------------------------
// Row mapping: Supabase rows (snake_case) <-> app types (camelCase)
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function optStr(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function num(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

export function artistFromRow(row: Row): Artist {
  return {
    id: str(row.id),
    slug: str(row.slug),
    name: str(row.name),
    genre: str(row.genre),
    status: str(row.status),
    location: str(row.location),
    image: str(row.image),
    description: str(row.description),
    bio: str(row.bio),
    website: optStr(row.website),
    instagram: optStr(row.instagram),
    spotify: optStr(row.spotify),
    youtube: optStr(row.youtube),
    visible: bool(row.visible, true),
    sortOrder: num(row.sort_order),
  };
}

export function artistToRow(artist: Artist, sortOrder: number): Row {
  return {
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    genre: artist.genre,
    status: artist.status,
    location: artist.location,
    image: artist.image,
    description: artist.description,
    bio: artist.bio,
    website: artist.website ?? null,
    instagram: artist.instagram ?? null,
    spotify: artist.spotify ?? null,
    youtube: artist.youtube ?? null,
    visible: artist.visible,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function companyFromRow(row: Row): Company {
  return {
    id: str(row.id),
    slug: str(row.slug),
    name: str(row.name),
    tagline: str(row.tagline),
    category: str(row.category),
    description: str(row.description),
    website: optStr(row.website),
    image: optStr(row.image),
    foundedYear:
      typeof row.founded_year === "number" ? row.founded_year : null,
    location: str(row.location),
    instagram: optStr(row.instagram),
    facebook: optStr(row.facebook),
    tiktok: optStr(row.tiktok),
    youtube: optStr(row.youtube),
    visible: bool(row.visible, true),
    sortOrder: num(row.sort_order),
  };
}

export function companyToRow(company: Company, sortOrder: number): Row {
  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    tagline: company.tagline,
    category: company.category,
    description: company.description,
    website: company.website ?? null,
    image: company.image ?? null,
    founded_year: company.foundedYear ?? null,
    location: company.location,
    instagram: company.instagram ?? null,
    facebook: company.facebook ?? null,
    tiktok: company.tiktok ?? null,
    youtube: company.youtube ?? null,
    visible: company.visible,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function releaseFromRow(row: Row): Release {
  return {
    id: str(row.id),
    artistId: str(row.artist_id),
    title: str(row.title),
    type: str(row.type),
    releaseDate: str(row.release_date),
    link: str(row.link),
    visible: bool(row.visible, true),
    sortOrder: num(row.sort_order),
  };
}

export function releaseToRow(release: Release, sortOrder: number): Row {
  return {
    id: release.id,
    artist_id: release.artistId,
    title: release.title,
    type: release.type,
    release_date: release.releaseDate === "" ? null : release.releaseDate,
    link: release.link === "" ? null : release.link,
    visible: release.visible,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function serviceFromRow(row: Row): ServiceItem {
  return {
    id: str(row.id),
    slug: str(row.slug),
    number: str(row.number),
    title: str(row.title),
    subtitle: str(row.subtitle),
    description: str(row.description),
    offerings: strArray(row.offerings),
    visible: bool(row.visible, true),
    sortOrder: num(row.sort_order),
  };
}

export function serviceToRow(service: ServiceItem, sortOrder: number): Row {
  return {
    id: service.id,
    slug: service.slug,
    number: service.number,
    title: service.title,
    subtitle: service.subtitle,
    description: service.description,
    offerings: service.offerings,
    visible: service.visible,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function territoryFromRow(row: Row): Territory {
  return {
    id: str(row.id),
    slug: str(row.slug),
    name: str(row.name),
    region: str(row.region),
    website: optStr(row.website),
    visible: bool(row.visible, true),
    sortOrder: num(row.sort_order),
  };
}

export function territoryToRow(territory: Territory, sortOrder: number): Row {
  return {
    id: territory.id,
    slug: territory.slug,
    name: territory.name,
    region: territory.region,
    website: territory.website ?? null,
    visible: territory.visible,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function siteFromRow(row: Row): SiteSettings {
  return {
    tagline: str(row.tagline),
    heroImage: str(row.hero_image),
    heroSubcopy: str(row.hero_subcopy),
    aboutIntro: str(row.about_intro),
    aboutBody: str(row.about_body),
    aboutPageIntro: str(row.about_page_intro),
    aboutPageBody: str(row.about_page_body),
    missionTitle: str(row.mission_title),
    missionBody: str(row.mission_body),
    contactIntro: str(row.contact_intro),
    footerText: str(row.footer_text),
    emailGeneral: str(row.email_general),
    instagram: str(row.instagram),
    facebook: str(row.facebook),
    tiktok: str(row.tiktok),
    youtube: str(row.youtube),
    seoTitle: str(row.seo_title),
    seoDescription: str(row.seo_description),
  };
}

export function siteToRow(site: SiteSettings): Row {
  return {
    id: 1,
    tagline: site.tagline,
    hero_image: site.heroImage,
    hero_subcopy: site.heroSubcopy,
    about_intro: site.aboutIntro,
    about_body: site.aboutBody,
    about_page_intro: site.aboutPageIntro,
    about_page_body: site.aboutPageBody,
    mission_title: site.missionTitle,
    mission_body: site.missionBody,
    contact_intro: site.contactIntro,
    footer_text: site.footerText,
    email_general: site.emailGeneral,
    instagram: site.instagram,
    facebook: site.facebook,
    tiktok: site.tiktok,
    youtube: site.youtube,
    seo_title: site.seoTitle,
    seo_description: site.seoDescription,
    updated_at: new Date().toISOString(),
  };
}
