import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The admin allowlist — who can get into /admin.
 *
 * Two sources, either one counts:
 * - public.admin_users (Supabase) — managed from the /admin/admins
 *   page in the portal itself, takes effect straight away.
 * - ADMIN_EMAILS (Vercel env var) — the original list, kept as a
 *   fallback so the admins already allowed keep working even before
 *   the admin_users migration runs, and if the table is ever empty.
 *
 * The database check goes through the SECURITY DEFINER function
 * public.is_admin_email(email), so the table needs no public policy
 * and the admin list is not enumerable. This module imports nothing
 * from next/headers, so the proxy (edge) can use it too.
 */

/** The env-var allowlist, lower-cased and trimmed. Empty when unset. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

function inEnvAllowlist(email: string | undefined | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/**
 * Is this email allowed into /admin? Checks the admin_users table
 * first (via the is_admin_email function); any database error —
 * the migration has not run yet, the function is missing — falls
 * back to the ADMIN_EMAILS env var instead of failing open or
 * locking everyone out.
 */
export async function isAllowedEmail(
  supabase: SupabaseClient,
  email: string | undefined | null,
): Promise<boolean> {
  if (!email) return false;
  try {
    const { data, error } = await supabase.rpc("is_admin_email", {
      p_email: email,
    });
    if (!error && data === true) return true;
  } catch {
    // Fall through to the env allowlist below.
  }
  return inEnvAllowlist(email);
}
