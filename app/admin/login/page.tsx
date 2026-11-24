"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

/**
 * Admin sign in with Supabase Auth (SSO). Two ways in:
 * - an email link (works straight away — Supabase sends it), or
 * - Google, once the Google provider is switched on in the
 *   Supabase dashboard.
 * Only the email addresses in ADMIN_EMAILS can get into /admin —
 * anyone else is turned away after signing in.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  // A sign-in failure lands back here as ?error=… — read it once,
  // as the initial error, rather than setting state in an effect.
  const [error, setError] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "not-allowed") {
      return "That email address is not approved for the admin portal.";
    }
    return params.get("error")
      ? "That sign-in link did not work. Please try again."
      : "";
  });
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Already signed in? Go straight to the admin.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || "/admin";
        router.push(next.startsWith("/") ? next : "/admin");
      }
    });
  }, [router]);

  function callbackUrl(): string {
    // The proxy passes the original destination as ?next=… — read it
    // from the URL at submit time (no useSearchParams, so this page
    // never needs a Suspense boundary).
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/admin";
    const safeNext = next.startsWith("/") ? next : "/admin";
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
  }

  async function handleEmailLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callbackUrl() },
      });
      if (error) {
        setError(error.message);
        return;
      }
      setInfo(`Check ${email} for your sign-in link.`);
    } catch {
      setError("Could not send the sign-in link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setInfo("");
    setGoogleLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl() },
      });
      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
      // No error: the browser leaves for Google.
    } catch {
      setError("Could not start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-white">
        Amity Music Group <span className="text-neutral-500">Admin</span>
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
        Admin sign in
      </h1>
      <p className="mt-3 text-sm leading-7 text-neutral-400">
        Welcome back. Sign in with your work email to manage the site.
        Only approved email addresses can get in.
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-[#171717] p-6">
        <form onSubmit={handleEmailLink}>
          <label htmlFor="email" className="mb-2 block text-sm text-white/80">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-white/15 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-white"
            placeholder="you@amitymusicgroup.com"
          />

          {error ? (
            <p role="alert" className="mt-4 text-sm text-white">
              {error}
            </p>
          ) : null}
          {info ? <p className="mt-4 text-sm text-white">{info}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-white px-6 py-3.5 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-neutral-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full rounded-md border border-white/20 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition hover:border-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="text-neutral-400 transition hover:text-white">
          Back to Amity Music Group ↗
        </Link>
      </p>
    </div>
  );
}
