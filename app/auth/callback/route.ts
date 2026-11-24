import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseServerClient,
  getSupabaseUser,
  isAdminEmail,
  signOutServer,
} from "@/lib/supabase-auth";

/**
 * GET /auth/callback — finishes a Supabase Auth sign-in (email link
 * or Google). Swaps the code for a session, then:
 * - allowlisted email (ADMIN_EMAILS) → the page they were going to
 * - anyone else → signed straight back out, to /admin/login with an
 *   explanation. Being able to sign in to Supabase is not enough;
 *   only approved emails can reach /admin.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/admin";
  const safeNext = next.startsWith("/") ? next : "/admin";

  const loginUrl = new URL("/admin/login", request.url);
  if (safeNext !== "/admin") {
    loginUrl.searchParams.set("next", safeNext);
  }

  if (!code) {
    loginUrl.searchParams.set("error", "missing-code");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    loginUrl.searchParams.set("error", "bad-code");
    return NextResponse.redirect(loginUrl);
  }

  const user = await getSupabaseUser();
  if (!user || !isAdminEmail(user.email)) {
    // Not on the allowlist — drop the session entirely.
    await signOutServer();
    loginUrl.searchParams.set("error", "not-allowed");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(safeNext, request.url));
}
