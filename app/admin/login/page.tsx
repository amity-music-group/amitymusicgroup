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
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
        Amity Music Group
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight">Admin sign in</h1>
      <p className="mt-3 text-sm leading-7 text-white/60">
        Enter the admin password to manage the site.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-xl border border-white/15 bg-[#241443] p-6"
      >
        <label htmlFor="password" className="mb-2 block text-sm text-white/80">
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
          className="w-full rounded-md border border-white/20 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#D7FF38]"
          placeholder="Admin password"
        />

        {error ? (
          <p role="alert" className="mt-4 text-sm text-[#F32991]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-[#D7FF38] px-6 py-3.5 text-sm font-bold text-[#160D2C] transition hover:bg-[#F32991] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
