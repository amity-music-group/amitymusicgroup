import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/supabase-auth";
import { logAdminAction } from "@/lib/activity";
import { sendBlast } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/admin/newsletter — admin newsletter actions.
 *
 * { action: "send", subject, message } — blast to all subscribed
 * addresses via Resend, logged to email_log.
 * { action: "delete", id } — remove a subscriber.
 *
 * Admin session required.
 */
export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const record = (body ?? {}) as Record<string, unknown>;

  if (record.action === "send") {
    const subject =
      typeof record.subject === "string" ? record.subject.trim() : "";
    const message =
      typeof record.message === "string" ? record.message.trim() : "";
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 },
      );
    }
    const result = await sendBlast({ subject, message });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }
    await logAdminAction(
      "send",
      "email_log",
      "",
      `Blast "${subject}" sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}`,
    );
    return NextResponse.json({
      ok: true,
      sent: result.sent,
      failed: result.failed,
    });
  }

  if (record.action === "delete") {
    const id = typeof record.id === "string" ? record.id : "";
    if (!id) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    let client;
    try {
      client = getSupabaseAdmin();
    } catch {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 503 },
      );
    }
    const { error } = await client
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);
    if (error) {
      console.warn("[admin/newsletter] delete failed:", error.message);
      return NextResponse.json(
        { error: "Could not delete. Please try again." },
        { status: 500 },
      );
    }
    await logAdminAction(
      "delete",
      "newsletter_subscribers",
      id,
      "Removed a newsletter subscriber",
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
