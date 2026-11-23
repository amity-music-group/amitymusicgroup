import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/auth";

/**
 * Staff-only gate for the Amity admin portal (Next.js 16 "proxy",
 * formerly middleware).
 *
 * /admin and /api/admin/* — the admin session cookie set by
 * POST /api/admin/login. The login page and login API route are open;
 * everything else requires the cookie.
 *
 * The admin pages re-check the session server-side as a second layer,
 * so a page never renders without a valid session even if the proxy
 * is bypassed.
 *
 * Public pages and public API routes (contact form, newsletter
 * signup, unsubscribe) need no session. The admin gate below only
 * applies to /admin and /api/admin — the matcher runs this proxy on
 * every request, so without the early return every public page would
 * redirect to the admin login.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdmin && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await isValidSession(token)) {
    return NextResponse.next();
  }

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
