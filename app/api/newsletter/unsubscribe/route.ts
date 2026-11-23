import { NextResponse, type NextRequest } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/newsletter/unsubscribe?email=…&token=… — one-click
 * unsubscribe from the footer link in admin blasts and the welcome
 * email. The token is an HMAC of the email (see lib/email.ts), so the
 * link cannot unsubscribe anyone else's address. Always redirects to
 * /unsubscribed; an invalid link lands there with ok=0.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const email = (params.get("email") ?? "").trim().toLowerCase();
  const token = params.get("token") ?? "";
  const base = new URL("/unsubscribed", request.url);

  if (!email || !verifyUnsubscribeToken(email, token)) {
    base.searchParams.set("ok", "0");
    return NextResponse.redirect(base);
  }

  try {
    const admin = getSupabaseAdmin();
    await admin
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", email);
  } catch {
    // A missing table/config still redirects to the confirmation
    // page — the link itself was valid.
  }

  base.searchParams.set("ok", "1");
  return NextResponse.redirect(base);
}
