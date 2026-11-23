import { connection } from "next/server";
import { getSupabaseAdmin, releaseFromRow, supabaseUrl } from "@/lib/supabase";
import type {
  ActivityLogEntry,
  AdminStats,
  ContactSubmission,
  EmailLogEntry,
  MediaFile,
  RecentActivityItem,
  Release,
  Subscriber,
} from "@/lib/types";

/**
 * Admin-only reads (service-role key, server only). These tables have
 * no public policy, so the anon key can never read them — the /admin
 * inbox, subscriber list and email log come through here.
 *
 * Every read is best-effort: when Supabase is not configured (or the
 * migration has not run yet) the dashboard shows an empty list and a
 * "not configured" note instead of crashing.
 */

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function optStr(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

export async function getInbox(limit = 100): Promise<ContactSubmission[]> {
  await connection();
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("contact_submissions")
      .select("id, name, email, subject, message, read, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.warn("[admin-data] inbox read failed:", error.message);
      return [];
    }
    return (data ?? []).map((row) => ({
      id: str(row.id),
      name: str(row.name),
      email: str(row.email),
      subject: str(row.subject),
      message: str(row.message),
      read: row.read === true,
      createdAt: str(row.created_at),
    }));
  } catch (e) {
    console.warn("[admin-data] inbox read failed:", e);
    return [];
  }
}

export async function getSubscribers(
  limit = 500,
): Promise<Subscriber[]> {
  await connection();
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("newsletter_subscribers")
      .select("id, email, status, created_at, unsubscribed_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.warn("[admin-data] subscribers read failed:", error.message);
      return [];
    }
    return (data ?? []).map((row) => ({
      id: str(row.id),
      email: str(row.email),
      status: str(row.status),
      createdAt: str(row.created_at),
      unsubscribedAt: optStr(row.unsubscribed_at),
    }));
  } catch (e) {
    console.warn("[admin-data] subscribers read failed:", e);
    return [];
  }
}

export async function getEmailLog(limit = 20): Promise<EmailLogEntry[]> {
  await connection();
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("email_log")
      .select("id, kind, subject, recipient_count, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.warn("[admin-data] email log read failed:", error.message);
      return [];
    }
    return (data ?? []).map((row) => ({
      id: str(row.id),
      kind: str(row.kind),
      subject: str(row.subject),
      recipientCount: typeof row.recipient_count === "number" ? row.recipient_count : 0,
      status: str(row.status),
      createdAt: str(row.created_at),
    }));
  } catch (e) {
    console.warn("[admin-data] email log read failed:", e);
    return [];
  }
}

/**
 * Releases for one artist, in admin order. Returns [] when the
 * releases table does not exist yet (the beefy-admin migration has
 * not run) instead of crashing the artists editor.
 */
export async function getReleases(artistId: string): Promise<Release[]> {
  await connection();
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("releases")
      .select("*")
      .eq("artist_id", artistId)
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("[admin-data] releases read failed:", error.message);
      return [];
    }
    return (data ?? []).map((row) =>
      releaseFromRow(row as Record<string, unknown>),
    );
  } catch (e) {
    console.warn("[admin-data] releases read failed:", e);
    return [];
  }
}

/** Every release, grouped by artist id — for the artists editor. */
export async function getAllReleases(): Promise<Record<string, Release[]>> {
  await connection();
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("releases")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("[admin-data] releases read failed:", error.message);
      return {};
    }
    const byArtist: Record<string, Release[]> = {};
    for (const row of data ?? []) {
      const release = releaseFromRow(row as Record<string, unknown>);
      if (!byArtist[release.artistId]) byArtist[release.artistId] = [];
      byArtist[release.artistId].push(release);
    }
    return byArtist;
  } catch (e) {
    console.warn("[admin-data] releases read failed:", e);
    return {};
  }
}

/**
 * Admin activity log, newest first. Returns [] when the table does
 * not exist yet (the beefy-admin migration has not run).
 */
export async function getActivityLog(
  limit = 100,
): Promise<ActivityLogEntry[]> {
  await connection();
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("admin_activity_log")
      .select("id, action, record_type, record_id, detail, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.warn("[admin-data] activity log read failed:", error.message);
      return [];
    }
    return (data ?? []).map((row) => ({
      id: str(row.id),
      action: str(row.action),
      recordType: str(row.record_type),
      recordId: str(row.record_id),
      detail: str(row.detail),
      createdAt: str(row.created_at),
    }));
  } catch (e) {
    console.warn("[admin-data] activity log read failed:", e);
    return [];
  }
}

async function countRows(
  table: string,
  where?: { column: string; value: unknown },
): Promise<number> {
  try {
    const admin = getSupabaseAdmin();
    let query = admin.from(table).select("id", { count: "exact", head: true });
    if (where) query = query.eq(where.column, where.value);
    const { count, error } = await query;
    if (error) {
      console.warn(`[admin-data] count failed (${table}):`, error.message);
      return 0;
    }
    return count ?? 0;
  } catch (e) {
    console.warn(`[admin-data] count failed (${table}):`, e);
    return 0;
  }
}

/** Live counts for the dashboard stat cards. All best-effort. */
export async function getAdminStats(): Promise<AdminStats> {
  await connection();
  const [artists, companies, services, territories, releases, subscribers, unreadMessages, emailSends] =
    await Promise.all([
      countRows("artists"),
      countRows("companies"),
      countRows("services"),
      countRows("territories"),
      countRows("releases"),
      countRows("newsletter_subscribers", { column: "status", value: "subscribed" }),
      countRows("contact_submissions", { column: "read", value: false }),
      countRows("email_log"),
    ]);
  return {
    artists,
    companies,
    services,
    territories,
    releases,
    subscribers,
    unreadMessages,
    emailSends,
  };
}

/**
 * Recent activity feed for the dashboard: the newest admin actions
 * (saves, sends, deletes) plus the latest contact submissions and
 * new subscribers, merged and sorted newest first. Empty when
 * nothing has happened yet — never invented.
 */
export async function getRecentActivity(
  limit = 10,
): Promise<RecentActivityItem[]> {
  const [log, inbox, subscribers] = await Promise.all([
    getActivityLog(10),
    getInbox(10),
    getSubscribers(10),
  ]);
  const items: RecentActivityItem[] = [
    ...log.map((entry) => ({
      id: `log-${entry.id}`,
      kind: "edit" as const,
      label: entry.detail || `${entry.action} ${entry.recordType}`,
      detail: entry.recordType,
      createdAt: entry.createdAt,
    })),
    ...inbox.map((message) => ({
      id: `msg-${message.id}`,
      kind: "message" as const,
      label: message.subject || "(no subject)",
      detail: `${message.name} · ${message.email}`,
      createdAt: message.createdAt,
    })),
    ...subscribers.map((subscriber) => ({
      id: `sub-${subscriber.id}`,
      kind: "subscriber" as const,
      label: subscriber.email,
      detail: "New newsletter subscriber",
      createdAt: subscriber.createdAt,
    })),
  ];
  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return items.slice(0, limit);
}

const MEDIA_BUCKET = "site-images";
const MEDIA_PREFIXES = ["", "artists", "companies", "site"];

/**
 * Every file in the public `site-images` Storage bucket, across the
 * artists / companies / site folders. Returns [] when the bucket is
 * empty or unreadable — never crashes the media library page.
 */
export async function getMediaFiles(): Promise<MediaFile[]> {
  await connection();
  try {
    const admin = getSupabaseAdmin();
    const base = supabaseUrl();
    const files: MediaFile[] = [];
    for (const prefix of MEDIA_PREFIXES) {
      const { data, error } = await admin.storage
        .from(MEDIA_BUCKET)
        .list(prefix === "" ? undefined : prefix, {
          limit: 100,
          sortBy: { column: "updated_at", order: "desc" },
        });
      if (error) {
        console.warn(
          `[admin-data] media list failed (${prefix || "root"}):`,
          error.message,
        );
        continue;
      }
      for (const entry of data ?? []) {
        const size =
          entry.metadata && typeof entry.metadata.size === "number"
            ? entry.metadata.size
            : 0;
        // Folders have no metadata/size — only real files are listed.
        if (size === 0 && !entry.metadata) continue;
        const path = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
        files.push({
          name: entry.name,
          path,
          size,
          updatedAt: str(entry.updated_at),
          url: `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`,
        });
      }
    }
    files.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    return files;
  } catch (e) {
    console.warn("[admin-data] media list failed:", e);
    return [];
  }
}
