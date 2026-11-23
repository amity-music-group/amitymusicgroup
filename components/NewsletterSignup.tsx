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
      <p className="text-[28px] font-light leading-tight text-white">
        Subscribe to Amity
      </p>
      <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
        News from Amity Music Group, our artists and our companies.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 flex max-w-sm items-center gap-3">
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
          className="w-full rounded-full bg-white px-5 py-3 text-sm text-black placeholder:text-black/40 outline-none transition focus:ring-2 focus:ring-white/60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lg text-black transition hover:bg-white/85 disabled:opacity-50"
        >
          {status === "loading" ? "…" : "→"}
        </button>
      </form>
      <div aria-live="polite" role="status">
        {status === "success" ? (
          <p className="mt-3 text-sm text-white/80">
            Thanks — you&apos;re signed up.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-3 text-sm text-red-300">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
