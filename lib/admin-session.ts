import { redirect } from "next/navigation";
import {
  getAdminUser,
  type AdminUser,
} from "@/lib/supabase-auth";

/**
 * Server-side session gate for /admin pages. The proxy already blocks
 * unauthenticated visits; this is the second layer so a page never
 * renders without a valid session even if the proxy is bypassed.
 *
 * Sign-in is Supabase Auth (SSO) with the ADMIN_EMAILS allowlist —
 * see lib/supabase-auth.ts.
 */
export async function requireAdmin(nextPath: string): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
