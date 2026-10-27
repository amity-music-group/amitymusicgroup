
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Message could not be sent.");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-md border border-white/20 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white focus:ring-1 focus:ring-white";

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-10 sm:pt-24 lg:px-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <span aria-hidden="true">←</span> Back to Home
        </Link>

        <div className="mt-16 grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Amity Music Group
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
              Let&apos;s talk.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/60">
              For general inquiries, business opportunities, partnerships, and
              other company-related matters, send our team a message.
            </p>

            <div className="mt-12 border-t border-white/15 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Email
              </p>
              <a
                href="mailto:info@amitymusicgroup.com"
                className="mt-3 inline-block text-lg transition hover:text-white/65"
              >
                info@amitymusicgroup.com
              </a>
            </div>

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Company
              </p>
              <p className="mt-3 text-sm text-white/70">
                Amity Music Group
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/[0.025] p-6 sm:p-9">
            <h2 className="text-xl font-medium">Send an inquiry</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Complete the form below. All fields are required.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-white/80">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  required
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-white/80">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm text-white/80">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  maxLength={150}
                  required
                  className={inputClass}
                  placeholder="What is your inquiry about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm text-white/80">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  maxLength={5000}
                  required
                  className={`${inputClass} resize-y`}
                  placeholder="Tell us how we can help."
                />
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center rounded-md bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              <div aria-live="polite" role="status">
                {status === "success" && (
                  <p className="text-sm text-white/80">
                    Your message has been sent successfully. Thank you for
                    contacting Amity Music Group.
                  </p>
                )}

                {status === "error" && (
                  <p className="text-sm text-red-400">
                    We couldn&apos;t send your message. Please try again or
                    email info@amitymusicgroup.com directly.
                  </p>
                )}
              </div>

              <p className="text-xs leading-5 text-white/40">
                Please do not include passwords, payment details, or other
                sensitive information in your message.
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Amity Music Group. All rights reserved.</p>
          <Link href="/" className="transition hover:text-white">
            Amity Music Group
          </Link>
        </div>
      </footer>
    </main>
  );
}