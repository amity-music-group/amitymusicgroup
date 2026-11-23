"use client";

import { FormEvent, useState } from "react";

/** Small newsletter signup form for the site footers. */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string"
            ? body.error
            : "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }
      setEmail("");
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D7FF38]">
        Stay connected
      </p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">
        News from Amity Music Group, our artists and our companies.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex max-w-sm gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-white/20 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#D7FF38]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-md bg-[#D7FF38] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#160D2C] transition hover:bg-[#F32991] hover:text-white disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Sign up"}
        </button>
      </form>
      <div aria-live="polite" role="status">
        {status === "success" ? (
          <p className="mt-3 text-sm text-[#D7FF38]">
            Thanks — you&apos;re signed up.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-3 text-sm text-[#F32991]">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
