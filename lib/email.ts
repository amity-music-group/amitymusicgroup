import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Email helpers for Amity Music Group (Resend).
 *
 * - Contact mail keeps the site's existing sender
 *   (onboarding@resend.dev) — see app/api/contact/route.ts.
 * - Admin mail (welcome + blasts) sends from
 *   "Amity Music Group <info@amitymusicgroup.com>", matching the
 *   existing /api/send-email route. That sender only delivers once
 *   amitymusicgroup.com is a verified domain in the Resend account;
 *   until then Resend rejects the send and the helpers below log and
 *   return { ok: false } instead of throwing.
 * - Every send is best-effort: a failed send never fails the signup
 *   or the blast request itself.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://amitymusicgroup.com";

const FROM = "Amity Music Group <info@amitymusicgroup.com>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY is not set; email skipped.");
    return { ok: false, error: "Email service is not configured." };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [options.to],
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      ...(options.html ? { html: options.html } : {}),
    });
    if (error) {
      console.warn("[email] Resend send failed:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (e) {
    console.warn("[email] Resend send failed:", e);
    return { ok: false, error: "Email send failed." };
  }
}

// ---------------------------------------------------------------------------
// Unsubscribe tokens (signed, stateless)
// ---------------------------------------------------------------------------

function unsubscribeSecret(): string {
  // A dedicated secret when set; otherwise the admin password signs
  // the tokens. Either way the secret never appears in the URL — only
  // the HMAC does.
  return process.env.UNSUBSCRIBE_SECRET || process.env.ADMIN_PASSWORD || "amity";
}

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", unsubscribeSecret())
    .update(email.toLowerCase())
    .digest("base64url");
}

export function verifyUnsubscribeToken(
  email: string,
  token: string,
): boolean {
  const expected = unsubscribeToken(email);
  return token.length === expected.length && token === expected;
}

export function unsubscribeUrl(email: string): string {
  const params = new URLSearchParams({
    email,
    token: unsubscribeToken(email),
  });
  return `${SITE_URL}/api/newsletter/unsubscribe?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Welcome email (new subscriber)
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(email: string): Promise<SendResult> {
  const text = [
    "Welcome to Amity Music Group.",
    "",
    "Thanks for signing up — you'll hear from us when there's news",
    "from the group, our artists, and our companies.",
    "",
    "Independent Culture. Major Sound.",
    "",
    `To stop receiving these emails: ${unsubscribeUrl(email)}`,
  ].join("\n");
  return sendEmail({
    to: email,
    subject: "Welcome to Amity Music Group",
    text,
  });
}

// ---------------------------------------------------------------------------
// Blast (admin newsletter)
// ---------------------------------------------------------------------------

export interface BlastResult {
  sent: number;
  failed: number;
  error?: string;
}

const BLAST_BATCH_SIZE = 25;

export async function sendBlast(options: {
  subject: string;
  message: string;
}): Promise<BlastResult> {
  const resend = getResend();
  if (!resend) {
    return { sent: 0, failed: 0, error: "RESEND_API_KEY is not set." };
  }

  let recipients: string[] = [];
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("newsletter_subscribers")
      .select("email")
      .eq("status", "subscribed");
    if (error) {
      console.warn("[email] blast recipient read failed:", error.message);
      return { sent: 0, failed: 0, error: "Could not load subscribers." };
    }
    recipients = (data ?? []).map((row) => String(row.email));
  } catch (e) {
    console.warn("[email] blast recipient read failed:", e);
    return { sent: 0, failed: 0, error: "Subscribers are unavailable." };
  }

  if (recipients.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const html = [
    `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #160D2C;">`,
    `<p style="font-size: 11px; font-weight: bold; letter-spacing: 0.25em; color: #4922EB;">AMITY MUSIC GROUP</p>`,
    ...options.message
      .split(/\n{2,}/)
      .map((p) => `<p style="font-size: 15px; line-height: 1.7;">${escapeHtml(p).replace(/\n/g, "<br />")}</p>`),
    `<p style="font-size: 12px; color: #666;">Independent Culture. Major Sound.</p>`,
    `</div>`,
  ].join("\n");

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < recipients.length; i += BLAST_BATCH_SIZE) {
    const batch = recipients.slice(i, i + BLAST_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((email) =>
        resend.emails.send({
          from: FROM,
          to: [email],
          subject: options.subject,
          text: `${options.message}\n\nTo stop receiving these emails: ${unsubscribeUrl(email)}`,
          html: html.replace(
            "</div>",
            `<p style="font-size: 11px; color: #999;"><a href="${unsubscribeUrl(email)}">Unsubscribe</a></p></div>`,
          ),
        }),
      ),
    );
    for (const result of results) {
      if (result.status === "fulfilled" && !result.value.error) sent += 1;
      else failed += 1;
    }
  }

  try {
    const admin = getSupabaseAdmin();
    await admin.from("email_log").insert({
      kind: "blast",
      subject: options.subject,
      recipient_count: sent,
      status: failed > 0 ? "partial" : "sent",
    });
  } catch {
    // Logging must never fail the blast.
  }

  return { sent, failed };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
