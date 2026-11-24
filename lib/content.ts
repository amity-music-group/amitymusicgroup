import { cache } from "react";
import { connection } from "next/server";
import type {
  Artist,
  Company,
  ServiceItem,
  SiteSettings,
  StripItem,
  Territory,
} from "@/lib/types";
import {
  artistFromRow,
  companyFromRow,
  getSupabaseAdmin,
  getSupabasePublic,
  isSupabaseConfigured,
  serviceFromRow,
  siteFromRow,
  stripFromRow,
  territoryFromRow,
} from "@/lib/supabase";

/**
 * The site's content layer — the single place public pages and /admin
 * read content from.
 *
 * - When Supabase is configured (NEXT_PUBLIC_SUPABASE_URL +
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY), content comes from Supabase.
 * - When Supabase is not configured, or a read fails, or a table comes
 *   back empty, the static data below is used instead. The site never
 *   breaks because the database is missing or down. An empty table is
 *   treated exactly like a missing one: deleting the last row of a
 *   table in /admin must not silently blank the sections that read it.
 *
 * CORE REQUIREMENT — saves go live with no redeploy: every getter
 * calls connection() unconditionally, so any route that reads content
 * waits for an incoming request and is rendered dynamically at
 * REQUEST time, never prerendered at build time. That is what makes
 * an /admin save show up on the live site within seconds, with no
 * GitHub push and no Vercel redeploy — even if Supabase is only
 * configured after the site was first deployed (at build time the env
 * vars may be absent, so a build-time decision would have frozen the
 * static fallback in place).
 *
 * Getters are wrapped in React cache() so a page that reads the same
 * content in several components only hits Supabase once per request.
 */

export { isSupabaseConfigured };

export interface SupabaseStatus {
  /** Env vars are present. */
  configured: boolean;
  /** A live read against Supabase just succeeded. */
  connected: boolean;
  /** Human-readable reason when configured but not connected. */
  error?: string;
}

/**
 * Best-effort connectivity probe for the /admin status pill. Times out
 * after 4 seconds so a down database never hangs the dashboard.
 */
export async function getSupabaseStatus(): Promise<SupabaseStatus> {
  if (!isSupabaseConfigured()) {
    return { configured: false, connected: false };
  }
  const probe = (async (): Promise<SupabaseStatus> => {
    const client = getSupabasePublic();
    if (!client) return { configured: true, connected: false };
    const { error } = await client.from("artists").select("id").limit(1);
    if (error) {
      return {
        configured: true,
        connected: false,
        error: error.message,
      };
    }
    return { configured: true, connected: true };
  })();
  const timeout = new Promise<SupabaseStatus>((resolve) =>
    setTimeout(
      () =>
        resolve({
          configured: true,
          connected: false,
          error: "Timed out reaching Supabase.",
        }),
      4000,
    ),
  );
  return Promise.race([probe, timeout]);
}

// ---------------------------------------------------------------------------
// Static fallbacks — the copy the site ships with today. These are the
// site's real current words, copied from the pages; nothing invented.
// ---------------------------------------------------------------------------

export const staticSiteSettings: SiteSettings = {
  tagline: "Independent Culture. Major Sound.",
  heroImage: "",
  heroSubcopy:
    "A connected music organization built around artists, recorded music, publishing, distribution, management, and the future of the music industry.",
  aboutIntro:
    "Amity Music Group exists to build and support businesses around music while creating opportunities for artists and creators.",
  aboutBody: [
    "The group brings together different areas of the music industry, allowing each part of the ecosystem to focus on its own expertise while contributing to a larger music organization.",
    "From music creation and release to publishing, distribution, management, international operations, and live music, Amity is focused on building an ecosystem designed for the people who make music possible.",
  ].join("\n\n"),
  aboutPageIntro:
    "Amity Music Group is a music-focused creative organization built around artistry, collaboration, and the opportunities that emerge when music and business move in the same direction.",
  aboutPageBody: [
    "Amity Music Group brings together a broader vision for music and creative business. We see potential in connecting artistic development with thoughtful strategy, effective operations, and opportunities for collaboration.",
    "Our approach is designed to recognize that every artist, project, and creative business has its own identity. We aim to create an environment where those identities can develop while benefiting from a connected creative ecosystem.",
    "Our guiding idea is straightforward: protect what makes the work original, build the right foundations around it, and keep moving forward with purpose.",
  ].join("\n\n"),
  missionTitle: "Give creativity room to become something greater.",
  missionBody:
    "We aim to connect music, creative thinking, and business strategy in ways that help artists and creative ventures pursue their ambitions with clarity, individuality, and long-term purpose.",
  contactIntro:
    "For business inquiries, music opportunities, publishing, distribution, management, partnerships, or other music-related matters, contact Amity Music Group.",
  footerText: "A music-focused organization and connected music ecosystem.",
  emailGeneral: "info@amitymusicgroup.com",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  seoTitle: "",
  seoDescription: "",
  stripSpeedPxPerSec: 67,
};

export const staticServices: ServiceItem[] = [
  {
    id: "static-recorded-music",
    slug: "recorded-music",
    number: "01",
    title: "Recorded Music",
    subtitle: "RECORDS & RELEASES",
    description:
      "Supporting the development, release, and long-term growth of recorded music projects. Our recorded-music focus brings artists, releases, and catalog development into a connected music ecosystem.",
    offerings: [
      "Recorded music releases",
      "Artist and project development",
      "Release planning and coordination",
      "Catalog development",
    ],
    visible: true,
    sortOrder: 0,
  },
  {
    id: "static-artist-development",
    slug: "artist-development",
    number: "02",
    title: "Artist Development",
    subtitle: "BUILDING ARTIST CAREERS",
    description:
      "Helping artists develop their identity, direction, and long-term career strategy. We focus on building a foundation that connects creative vision with practical business planning.",
    offerings: [
      "Artist identity and positioning",
      "Career planning",
      "Creative direction",
      "Long-term development strategy",
    ],
    visible: true,
    sortOrder: 1,
  },
  {
    id: "static-music-publishing",
    slug: "music-publishing",
    number: "03",
    title: "Music Publishing",
    subtitle: "SONGWRITERS & COPYRIGHTS",
    description:
      "Focused on the business of compositions, songwriting, and music copyrights. Publishing operations can support the organization and development of musical works and songwriter opportunities.",
    offerings: [
      "Songwriter and composition development",
      "Music catalog organization",
      "Copyright-focused administration planning",
      "Publishing opportunities",
    ],
    visible: true,
    sortOrder: 2,
  },
  {
    id: "static-music-distribution",
    slug: "music-distribution",
    number: "04",
    title: "Music Distribution",
    subtitle: "REACHING DIGITAL AUDIENCES",
    description:
      "Supporting the delivery and release coordination of music to digital platforms. Distribution planning is part of helping music reach listeners and supporting organized release operations.",
    offerings: [
      "Digital release planning",
      "Distribution coordination",
      "Release metadata preparation",
      "Catalog delivery workflows",
    ],
    visible: true,
    sortOrder: 3,
  },
  {
    id: "static-artist-management",
    slug: "artist-management",
    number: "05",
    title: "Artist Management",
    subtitle: "STRATEGY & CAREER SUPPORT",
    description:
      "Connecting creative priorities with professional planning, communication, and business development. Management needs are shaped around each artist's circumstances and agreed working relationship.",
    offerings: [
      "Career and business strategy",
      "Professional opportunity planning",
      "Team and project coordination",
      "Artist brand development",
    ],
    visible: true,
    sortOrder: 4,
  },
  {
    id: "static-international-music",
    slug: "international-music",
    number: "06",
    title: "International Music",
    subtitle: "CROSS-MARKET OPPORTUNITIES",
    description:
      "Exploring relationships and opportunities across music markets. International initiatives are intended to help connect creative projects with broader audiences and industry networks.",
    offerings: [
      "International relationship development",
      "Cross-market strategy",
      "Global audience opportunities",
      "International project coordination",
    ],
    visible: true,
    sortOrder: 5,
  },
  {
    id: "static-live-music",
    slug: "live-music",
    number: "07",
    title: "Live Music",
    subtitle: "TOURING & LIVE EXPERIENCES",
    description:
      "Supporting the business and coordination around live music, performances, and touring opportunities through a connected approach to artists, events, and industry relationships.",
    offerings: [
      "Touring and live-event planning",
      "Booking-related opportunities",
      "Live music project coordination",
      "Artist and event partnerships",
    ],
    visible: true,
    sortOrder: 6,
  },
  {
    id: "static-creative-media",
    slug: "creative-media",
    number: "08",
    title: "Creative & Media",
    subtitle: "CONTENT, CULTURE & BRAND",
    description:
      "Connecting music with the wider creative world through content, storytelling, brand development, and media initiatives that help artists and projects communicate with their audiences.",
    offerings: [
      "Creative campaign planning",
      "Content and media strategy",
      "Artist storytelling",
      "Brand and partnership concepts",
    ],
    visible: true,
    sortOrder: 7,
  },
];

/** The six focus areas on the homepage — the site's current words. */
export const staticHomeFocus: { number: string; title: string; description: string }[] = [
  {
    number: "01",
    title: "Recorded Music",
    description:
      "Developing artists, releasing music, and building catalogs for the long term.",
  },
  {
    number: "02",
    title: "Music Publishing",
    description:
      "Supporting songwriters, compositions, copyrights, and music catalogs.",
  },
  {
    number: "03",
    title: "Distribution",
    description:
      "Connecting music with digital platforms and audiences around the world.",
  },
  {
    number: "04",
    title: "Artist Management",
    description:
      "Helping artists develop sustainable careers through strategy and representation.",
  },
  {
    number: "05",
    title: "International Music",
    description:
      "Building relationships and opportunities across international music markets.",
  },
  {
    number: "06",
    title: "Live Music",
    description:
      "Supporting touring, booking, talent, and live performance opportunities.",
  },
];

/** No artists or companies are published on the site today, so the
 * fallback is an empty list — never invented rows. */
export const staticArtists: Artist[] = [];
export const staticCompanies: Company[] = [];

/**
 * The /labels logo strip's fallback — the five real graphic logos
 * Theodore approved, at the heights the strip uses today. Used when
 * the strip_items table does not exist yet (migration not run) or is
 * empty, so the strip never disappears.
 */
export const staticStripItems: StripItem[] = [
  {
    id: "static-is",
    slug: "iron-stage-touring",
    name: "Iron Stage Touring",
    image: "/logos/is-logo.png",
    heightPx: 90,
    visible: true,
    sortOrder: 0,
  },
  {
    id: "static-ar",
    slug: "arden-row",
    name: "Arden Row",
    image: "/logos/ar-logo.png",
    heightPx: 70,
    visible: true,
    sortOrder: 1,
  },
  {
    id: "static-a-cross",
    slug: "amity-christian-music-group",
    name: "Amity Christian Music Group",
    image: "/logos/a-cross-logo.png",
    heightPx: 90,
    visible: true,
    sortOrder: 2,
  },
  {
    id: "static-dial",
    slug: "dial-recordings-america",
    name: "Dial Recordings America",
    image: "/logos/dial-recordings-america.png",
    heightPx: 60,
    visible: true,
    sortOrder: 3,
  },
  {
    id: "static-melted",
    slug: "melted-mindz-records",
    name: "Melted Mindz Records",
    image: "/logos/melted-mindz-records.png",
    heightPx: 90,
    visible: true,
    sortOrder: 4,
  },
];

/** No territories are recorded yet, so the fallback is an empty list
 * — never invented rows. The Global Territories section stays hidden
 * until the first territory is added in /admin. */
export const staticTerritories: Territory[] = [];

// ---------------------------------------------------------------------------
// Getters
// ---------------------------------------------------------------------------

async function readTable<T>(
  table: string,
  map: (row: Record<string, unknown>) => T,
  fallback: T[],
): Promise<T[]> {
  // Unconditional — see the header comment. Every content read opts
  // the route out of static prerendering, Supabase or not.
  await connection();
  const client = getSupabasePublic();
  if (!client) return fallback;
  try {
    const { data, error } = await client
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn(`[content] Supabase read failed (${table}):`, error.message);
      return fallback;
    }
    // An empty table falls back to the static data, same as a failed
    // read. Without this, emptying a table in /admin blanks every
    // section that reads it.
    if (!data || data.length === 0) return fallback;
    return data.map((row) => map(row as Record<string, unknown>));
  } catch (e) {
    console.warn(`[content] Supabase read failed (${table}):`, e);
    return fallback;
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  // Unconditional — see the header comment.
  await connection();
  const client = getSupabasePublic();
  if (!client) return staticSiteSettings;
  try {
    const { data, error } = await client
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.warn("[content] Supabase read failed (site_settings):", error.message);
      return staticSiteSettings;
    }
    // No row yet (not saved in /admin) — fall back to the static copy.
    if (!data) return staticSiteSettings;
    return siteFromRow(data as Record<string, unknown>);
  } catch (e) {
    console.warn("[content] Supabase read failed (site_settings):", e);
    return staticSiteSettings;
  }
});

export const getArtists = cache(async (): Promise<Artist[]> =>
  (await getAllArtists()).filter((a) => a.visible),
);

/**
 * Every artist, hidden ones included — for /admin only. The dashboard
 * loads its initial state from this getter, so a hidden artist stays
 * in the editor (and in the next save, which replaces the table with
 * the dashboard's set) instead of vanishing the moment it is hidden.
 * Public pages must use getArtists() above, never this.
 */
export const getAllArtists = cache(async (): Promise<Artist[]> =>
  readTable("artists", artistFromRow, staticArtists),
);

export const getCompanies = cache(async (): Promise<Company[]> =>
  (await getAllCompanies()).filter((c) => c.visible),
);

export const getAllCompanies = cache(async (): Promise<Company[]> =>
  readTable("companies", companyFromRow, staticCompanies),
);

export const getServices = cache(async (): Promise<ServiceItem[]> =>
  (await getAllServices()).filter((s) => s.visible),
);

export const getAllServices = cache(async (): Promise<ServiceItem[]> =>
  readTable("services", serviceFromRow, staticServices),
);

export const getTerritories = cache(async (): Promise<Territory[]> =>
  (await getAllTerritories()).filter((t) => t.visible),
);

export const getAllTerritories = cache(async (): Promise<Territory[]> =>
  readTable("territories", territoryFromRow, staticTerritories),
);

export const getStripItems = cache(async (): Promise<StripItem[]> =>
  (await getAllStripItems()).filter((s) => s.visible),
);

/**
 * Every strip logo, hidden ones included — for /admin only, same
 * reason as getAllCompanies: a hidden logo must stay in the editor
 * instead of vanishing the moment it is hidden.
 */
export const getAllStripItems = cache(async (): Promise<StripItem[]> =>
  readTable("strip_items", stripFromRow, staticStripItems),
);

export interface AdminUserRow {
  id: string;
  email: string;
  createdAt: string;
}

/**
 * Every email on the admin allowlist — for /admin/admins only.
 * Reads with the service-role key: the admin_users table has no
 * public policy by design, so the anon client cannot read it.
 * Returns null when Supabase is not configured or the table does
 * not exist yet (the migration has not run), so the page can say
 * so instead of showing an empty list.
 */
export const getAdminUsers = cache(async (): Promise<AdminUserRow[] | null> => {
  await connection();
  let client;
  try {
    client = getSupabaseAdmin();
  } catch {
    return null;
  }
  try {
    const { data, error } = await client
      .from("admin_users")
      .select("id, email, created_at")
      .order("email", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: String(row.id),
      email: String(row.email),
      createdAt: String(row.created_at),
    }));
  } catch {
    return null;
  }
});

/** Homepage focus areas: the first six visible services when the
 * services table has rows, otherwise the site's current six. This
 * reads the table directly instead of going through getServices(),
 * because getServices() falls back to the static services list when
 * the table is empty — and the homepage's six focus areas have their
 * own shorter copy, which must stay exactly as it is until the admin
 * adds real services. */
export const getHomeFocus = cache(async (): Promise<
  { number: string; title: string; description: string }[]
> => {
  await connection();
  const client = getSupabasePublic();
  if (!client) return staticHomeFocus;
  try {
    const { data, error } = await client
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticHomeFocus;
    const services = (data as Record<string, unknown>[])
      .map((row) => serviceFromRow(row))
      .filter((s) => s.visible);
    if (services.length === 0) return staticHomeFocus;
    return services.slice(0, 6).map((s) => ({
      number: s.number,
      title: s.title,
      description: s.description,
    }));
  } catch (e) {
    console.warn("[content] Supabase read failed (services/home):", e);
    return staticHomeFocus;
  }
});
