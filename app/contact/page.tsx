"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

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
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black placeholder:text-black/35 outline-none transition focus:border-black";

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <section className="mx-auto max-w-7xl px-6 pb-28 pt-36 sm:px-8 sm:pt-44 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base text-neutral-600 transition hover:text-black"
        >
          <span aria-hidden="true">←</span> Back to Home
        </Link>

        <div className="mt-16 grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">Contact</p>

            <h1 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Let&apos;s talk.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-neutral-600">
              For general inquiries, business opportunities, partnerships, and
              other company-related matters, send our team a message.
            </p>

            <div className="mt-12 border-t border-black/10 pt-6">
              <p className="text-sm text-neutral-500">Email</p>
              <a
                href="mailto:info@amitymusicgroup.com"
                className="mt-3 inline-block text-lg text-black transition hover:text-neutral-500"
              >
                info@amitymusicgroup.com
              </a>
            </div>

            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="text-sm text-neutral-500">Company</p>
              <p className="mt-3 text-base text-black">
                Amity Music Group
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-9">
            <h2 className="text-2xl font-light text-black">Send an inquiry</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Complete the form below. All fields are required.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-neutral-700">
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
                <label htmlFor="email" className="mb-2 block text-sm text-neutral-700">
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
                <label htmlFor="subject" className="mb-2 block text-sm text-neutral-700">
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
                <label htmlFor="message" className="mb-2 block text-sm text-neutral-700">
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
                className="flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              <div aria-live="polite" role="status">
                {status === "success" && (
                  <p className="text-sm text-neutral-700">
                    Your message has been sent successfully. Thank you for
                    contacting Amity Music Group.
                  </p>
                )}

                {status === "error" && (
                  <p className="text-sm text-red-600">
                    We couldn&apos;t send your message. Please try again or
                    email info@amitymusicgroup.com directly.
                  </p>
                )}
              </div>

              <p className="text-xs leading-5 text-neutral-500">
                Please do not include passwords, payment details, or other
                sensitive information in your message.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
