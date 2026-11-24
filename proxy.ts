import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowedEmail } from "@/lib/admin-allowlist";

/**
 * Staff-only gate for the Amity admin portal (Next.js 16 "proxy",
 * formerly middleware).
 *
 * Sign-in is Supabase Auth (SSO): a magic link by email, or Google.
 * Only the email addresses on the allowlist can get in — the
 * admin_users table (managed from /admin/admins) or the ADMIN_EMAILS
 * env var as a fallback; see lib/admin-allowlist.ts. The proxy
 * validates the session with Supabase and checks the allowlist on
 * every admin request.
 *
 * /admin and /api/admin/* require a signed-in, allowlisted admin.
 * The login page, the /auth/callback route that finishes sign-in,
 * and the logout route are open; everything else requires the
 * session. The admin pages re-check the session server-side as a
 * second layer, so a page never renders without a valid session
 * even if the proxy is bypassed.
 *
 * Public pages and public API routes (contact form, newsletter
 * signup, unsubscribe) need no session. The admin gate below only
 * applies to /admin and /api/admin — the matcher runs this proxy on
 * every request, so without the early return every public page
 * would redirect to the admin login.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAuthCallback = pathname === "/auth/callback";
  const isLogoutApi = pathname === "/api/admin/logout";
  if (isLoginPage || isAuthCallback || isLogoutApi) {
    return NextResponse.next();
  }

  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdmin && !isAdminApi) {
    return NextResponse.next();
  }

  // Supabase is not configured — nobody can sign in, so nobody
  // gets into /admin. Fail closed rather than falling back to a
  // password.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anonKey) {
    return adminDenied(request, pathname);
  }

  // The response the refreshed session cookies are written to.
  const response = NextResponse.next();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.email && (await isAllowedEmail(supabase, user.email))) {
    return response;
  }

  return adminDenied(request, pathname);
}

function adminDenied(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
