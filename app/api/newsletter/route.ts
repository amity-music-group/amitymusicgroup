import { NextResponse, type NextRequest } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/newsletter — public signup for the Amity newsletter.
 * No auth: anyone can sign up.
 *
 * - Email is required and must look like an email address. Emails
 *   are lowercased and upserted on email, so signing up twice updates
 *   the row instead of erroring, and a previously unsubscribed
 *   address re-subscribes.
 * - Writes go through the service-role key (server-side only). The
 *   table needs the migration in supabase/amity-admin-migration.sql
 *   — until it runs, signups answer 503 instead of crashing.
 * - After a successful signup, the subscriber gets a welcome email
 *   via Resend. Best-effort only: a failed send never fails the
 *   signup.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const record = (body ?? {}) as Record<string, unknown>;
  const email =
    typeof record.email === "string" ? record.email.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  let client;
  try {
    client = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Signups are unavailable right now — please try again later." },
      { status: 503 },
    );
  }

  const { error } = await client.from("newsletter_subscribers").upsert(
    { email, status: "subscribed", unsubscribed_at: null },
    { onConflict: "email" },
  );

  if (error) {
    console.warn("[newsletter] signup failed:", error.message);
    return NextResponse.json(
      { error: "Signups are unavailable right now — please try again later." },
      { status: 503 },
    );
  }

  // Welcome email to the subscriber. Best-effort only: the send is
  // awaited so it isn't lost when the function suspends, but a failed
  // send never fails the signup.
  await sendWelcomeEmail(email);

  return NextResponse.json({ ok: true }, { status: 201 });
}
