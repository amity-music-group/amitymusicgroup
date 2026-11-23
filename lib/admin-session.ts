import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  getAdminSession,
  type AdminSession,
} from "@/lib/auth";

/**
 * Server-side session gate for /admin pages. The proxy already blocks
 * unauthenticated visits; this is the second layer so a page never
 * renders without a valid session even if the proxy is bypassed.
 *
 * Kept in its own module (instead of lib/auth.ts) because it imports
 * next/headers — lib/auth.ts is also imported by proxy.ts, where
 * next/headers is not available.
 */
export async function requireAdmin(nextPath: string): Promise<AdminSession> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = getAdminSession(token);
  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}
