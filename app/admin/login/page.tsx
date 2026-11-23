"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string"
            ? body.error
            : "Could not sign in.",
        );
        return;
      }
      // The proxy passes the original destination as ?next=… — read it
      // from the URL at submit time (no useSearchParams, so this page
      // never needs a Suspense boundary).
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/admin";
      router.push(next.startsWith("/") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#111111]">
        Amity Music Group
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight">Admin sign in</h1>
      <p className="mt-3 text-sm leading-7 text-neutral-600">
        Enter the admin password to manage the site.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-xl border border-black/10 bg-[#f5f5f5] p-6"
      >
        <label htmlFor="password" className="mb-2 block text-sm text-[#111111]/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-neutral-400 outline-none transition focus:border-black"
          placeholder="Admin password"
        />

        {error ? (
          <p role="alert" className="mt-4 text-sm text-[#111111]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-[#111111] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
