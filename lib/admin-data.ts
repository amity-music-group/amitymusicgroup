import { connection } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  ContactSubmission,
  EmailLogEntry,
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
