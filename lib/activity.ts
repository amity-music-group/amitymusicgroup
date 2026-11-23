import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Admin activity log — a best-effort record of what changed in
 * /admin (saves, sends, deletes). The admin is a shared password,
 * so there is no per-person "who" — the log records the action, the
 * record type/id and a short human-readable detail, plus the time.
 *
 * Best-effort by design: logging must never fail a save. If
 * Supabase is not configured, or the admin_activity_log table does
 * not exist yet (the beefy-admin migration has not run), the insert
 * fails silently with a console warning and the caller proceeds.
 * Callers await this helper but never branch on its result.
 */
export async function logAdminAction(
  action: string,
  recordType: string,
  recordId: string,
  detail: string,
): Promise<void> {
  try {
    const client = getSupabaseAdmin();
    const { error } = await client.from("admin_activity_log").insert({
      action,
      record_type: recordType,
      record_id: recordId,
      detail,
    });
    if (error) {
      console.warn("[activity] log insert failed:", error.message);
    }
  } catch (e) {
    console.warn("[activity] log insert failed:", e);
  }
}
