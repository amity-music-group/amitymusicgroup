"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

/**
 * Admin sign in with Supabase Auth — email and password. Each
 * admin signs in with their own email address and a password they
 * set themselves:
 * - Sign in: email + password.
 * - Create a password: first time, pick a password for an
 *   allowlisted email. Supabase emails a confirmation link;
 *   clicking it finishes the setup and signs them in.
 * - Forgot password: Supabase emails a link to set a new one.
 * Only the email addresses on the allowlist can get into /admin —
 * anyone else is turned away after signing in.
 */
type Mode = "signin" | "create" | "forgot";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // A sign-in failure lands back here as ?error=… — read it once,
  // as the initial error, rather than setting state in an effect.
  const [error, setError] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "not-allowed") {
      return "That email address is not approved for the admin portal.";
    }
    return params.get("error")
      ? "That sign-in did not work. Please try again."
      : "";
  });
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

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

  function callbackUrl(next: string): string {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  }

  function nextParam(): string {
    if (typeof window === "undefined") return "/admin";
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/admin";
    return next.startsWith("/") ? next : "/admin";
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setInfo("");
    setPassword("");
    setConfirm("");
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("invalid login")) {
          setError(
            "Incorrect email or password. If you have not set a password yet, use “Create a password” below.",
          );
        } else {
          setError(error.message);
        }
        return;
      }
      router.push(nextParam());
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 8) {
      setError("Choose a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callbackUrl("/admin") },
      });
      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setError(
            "That email already has a password. Sign in, or use “Forgot password?” if you have forgotten it.",
          );
        } else {
          setError(error.message);
        }
        return;
      }
      setInfo(
        `Check ${email} for a confirmation link. Clicking it finishes setting up your password and signs you in.`,
      );
    } catch {
      setError("Could not create your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl("/admin/set-password"),
      });
      if (error) {
        setError(error.message);
        return;
      }
      setInfo(`Check ${email} for a link to set a new password.`);
    } catch {
      setError("Could not send the reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const titles: Record<Mode, { heading: string; intro: string; submit: string }> = {
    signin: {
      heading: "Admin sign in",
      intro:
        "Welcome back. Sign in with your email and password to manage the site. Only approved email addresses can get in.",
      submit: "Sign in",
    },
    create: {
      heading: "Create a password",
      intro:
        "First time signing in? Pick a password for your approved email address. We will email you a confirmation link to finish setting it up.",
      submit: "Create password",
    },
    forgot: {
      heading: "Forgot your password?",
      intro:
        "Enter your email and we will send you a link to set a new password.",
      submit: "Email me a reset link",
    },
  };
  const title = titles[mode];

  return (
    <div className="mx-auto max-w-md py-16">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#111111]">
        Amity Music Group <span className="text-neutral-500">Admin</span>
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight">
        {title.heading}
      </h1>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{title.intro}</p>

      <div className="mt-8 rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <form
          onSubmit={
            mode === "signin"
              ? handleSignIn
              : mode === "create"
                ? handleCreate
                : handleForgot
          }
        >
          <label htmlFor="email" className="mb-2 block text-sm text-[#111111]">
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
            className="w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-neutral-400 outline-none transition focus:border-black"
            placeholder="you@amitymusicgroup.com"
          />

          {mode !== "forgot" ? (
            <>
              <label
                htmlFor="password"
                className="mt-4 mb-2 block text-sm text-[#111111]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-md border border-black/15 bg-white px-4 py-3 pr-16 text-sm text-[#111111] placeholder:text-neutral-400 outline-none transition focus:border-black"
                  placeholder={
                    mode === "signin"
                      ? "Your password"
                      : "At least 8 characters"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-neutral-600 hover:text-black"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </>
          ) : null}

          {mode === "create" ? (
            <>
              <label
                htmlFor="confirm"
                className="mt-4 mb-2 block text-sm text-[#111111]"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className="w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-neutral-400 outline-none transition focus:border-black"
                placeholder="Repeat your password"
              />
            </>
          ) : null}

          {error ? (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          ) : null}
          {info ? <p className="mt-4 text-sm text-[#111111]">{info}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-[#111111] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Please wait…" : title.submit}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm">
          {mode !== "signin" ? (
            <p>
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="font-bold text-[#111111] hover:text-black"
              >
                Back to sign in
              </button>
            </p>
          ) : null}
          {mode === "signin" ? (
            <>
              <p>
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-neutral-600 hover:text-black"
                >
                  Forgot password?
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => switchMode("create")}
                  className="text-neutral-600 hover:text-black"
                >
                  Create a password
                </button>
              </p>
            </>
          ) : null}
        </div>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="text-neutral-600 transition hover:text-black">
          Back to Amity Music Group ↗
        </Link>
      </p>
    </div>
  );
}
