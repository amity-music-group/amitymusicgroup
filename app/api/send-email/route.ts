import { Resend } from "resend";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  try {
    const { to, subject, message } = await request.json();

    if (
      typeof to !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !to.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Recipient, subject, and message are required." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "Amity Music Group <info@amitymusicgroup.com>",
      to: [to],
      subject,
      text: message,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Email could not be sent." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Email route error:", error);
    return NextResponse.json(
      { error: "Invalid request or email service failure." },
      { status: 500 }
    );
  }
}