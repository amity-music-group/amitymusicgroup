"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

/** New-password form for a signed-in admin. */
export default function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
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
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      setDone(true);
    } catch {
      setError("Could not save your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div>
        <p className="text-sm leading-7 text-[#111111]">
          Your password is saved. You can sign in with it from now on.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-md bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
        >
          Go to the admin dashboard →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="password" className="mb-2 block text-sm text-[#111111]">
        New password
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-4 py-3 pr-16 text-sm text-[#111111] placeholder:text-neutral-400 outline-none transition focus:border-black"
          placeholder="At least 8 characters"
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-neutral-600 hover:text-black"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <label
        htmlFor="confirm"
        className="mt-4 mb-2 block text-sm text-[#111111]"
      >
        Confirm new password
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

      {error ? (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-[#111111] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
