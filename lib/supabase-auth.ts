import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

/**
 * Admin sign-in with Supabase Auth (SSO) — replaces the old shared
 * password. Anyone can request a sign-in link, but only the email
 * addresses in ADMIN_EMAILS can actually get into /admin.
 *
 * How it works:
 * - The login page (/admin/login) sends a magic link by email, or
 *   signs in with Google (once the Google provider is switched on
 *   in the Supabase dashboard). Both land on /auth/callback, which
 *   swaps the code for a session stored in Supabase Auth cookies.
 * - Every admin page and API route calls getAdminUser() below. It
 *   validates the session with Supabase (getUser) and checks the
 *   email against ADMIN_EMAILS. Anything else is turned away.
 * - No Supabase Auth session, no ADMIN_EMAILS set, or an email that
 *   is not on the list: no admin access. Fail closed, always.
 *
 * Env vars (already set for the site's content, except ADMIN_EMAILS):
 * - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - ADMIN_EMAILS — comma-separated, e.g.
 *   "theodore@amitymusicgroup.com, manager@amitymusicgroup.com"
 */

export interface AdminUser {
  email: string;
  name: string;
}

/** The allowlist, lower-cased and trimmed. Empty when unset. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/** Server client for Server Components and Route Handlers. */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  // Next 16: cookies() is async — await the store first, then hand
  // its sync getAll/setAll to the Supabase client.
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Route Handlers can set cookies; Server Components cannot,
        // so a failed set is swallowed there — the session is still
        // read fine, it just is not refreshed on that request.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore — see above.
        }
      },
    },
  });
}

/**
 * The signed-in admin, or null. Validates the session with Supabase
 * (never trusts the cookie alone) and enforces the allowlist.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return { email: user.email ?? "", name: user.email ?? "" };
}

/** The raw Supabase user, allowlist not applied — for /auth/callback. */
export async function getSupabaseUser(): Promise<User | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Sign the current user out (server side). */
export async function signOutServer(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

export { isAdminEmail };
