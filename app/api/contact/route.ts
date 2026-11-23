
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    const website = String(body.website ?? "").trim();

    // Honeypot: silently reject likely automated submissions.
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (
      !name ||
      !email ||
      !subject ||
      !message ||
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 150 ||
      message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please check your form details." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Amity Music Group Website <onboarding@resend.dev>",
      to: ["info@amitymusicgroup.com"],
      replyTo: email,
      subject: `Website Inquiry: ${subject}`,
      text: [
        "New inquiry from the Amity Music Group website",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Contact email delivery failed:", error);
      return NextResponse.json(
        { error: "Email delivery failed." },
        { status: 502 }
      );
    }

    // Store the message in the admin inbox. Best-effort only: the
    // email already sent, so a missing table or unconfigured Supabase
    // must never fail the submission.
    try {
      const admin = getSupabaseAdmin();
      await admin
        .from("contact_submissions")
        .insert({ name, email, subject, message });
    } catch (e) {
      console.warn("[contact] inbox insert skipped:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unable to process your message." },
      { status: 500 }
    );
  }
}