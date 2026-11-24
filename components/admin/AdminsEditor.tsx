"use client";

import { useState } from "react";
import type { AdminUserRow } from "@/lib/content";

/**
 * The admin allowlist editor — who can sign in to /admin.
 *
 * Add an email and they can sign in straight away; remove one and
 * their next request is turned away. No Vercel change, no redeploy.
 * The ADMIN_EMAILS env var still counts as well, so an address
 * listed there stays allowed even if it is removed here.
 */
export default function AdminsEditor({
  initial,
  currentEmail,
}: {
  initial: AdminUserRow[] | null;
  currentEmail: string;
}) {
  const [admins, setAdmins] = useState<AdminUserRow[]>(initial ?? []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  if (initial === null) {
    return (
      <div className="mt-8 rounded-xl border border-white/10 bg-[#171717] p-6">
        <p className="text-sm font-bold text-white">
          The admin list is not set up yet.
        </p>
        <p className="mt-2 text-sm leading-7 text-neutral-400">
          Run{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">
            supabase/amity-admin-users-migration.sql
          </code>{" "}
          in the Supabase SQL Editor, then come back here. Until then,
          the ADMIN_EMAILS env var still decides who can sign in.
        </p>
      </div>
    );
  }

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string"
            ? body.error
            : "Could not add that admin.",
        );
        return;
      }
      if (body?.already) {
        setInfo(
          typeof body?.message === "string"
            ? body.message
            : "That email is already an admin.",
        );
        setEmail("");
        return;
      }
      if (body?.admin) {
        setAdmins((prev) =>
          [...prev, body.admin].sort((a, b) =>
            a.email.localeCompare(b.email),
          ),
        );
      }
      setEmail("");
      setInfo(`${email.trim().toLowerCase()} can now sign in to /admin.`);
    } catch {
      setError("Could not add that admin. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(target: string) {
    if (confirming !== target) {
      setConfirming(target);
      return;
    }
    setConfirming(null);
    setError("");
    setInfo("");
    setRemoving(target);
    try {
      const response = await fetch("/api/admin/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string"
            ? body.error
            : "Could not remove that admin.",
        );
        return;
      }
      setAdmins((prev) => prev.filter((a) => a.email !== target));
      setInfo(`${target} can no longer sign in to /admin.`);
    } catch {
      setError("Could not remove that admin. Please try again.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="mt-8">
      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-white/10 bg-[#171717] p-6"
      >
        <label htmlFor="email" className="mb-2 block text-sm text-white/80">
          Add an admin
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full flex-1 rounded-md border border-white/15 bg-[#171717] px-4 py-3 text-sm text-white placeholder:text-neutral-400 outline-none transition focus:border-white"
            placeholder="name@example.com"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Adding…" : "Add admin"}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-4 text-sm text-white">
            {error}
          </p>
        ) : null}
        {info ? <p className="mt-4 text-sm text-white">{info}</p> : null}
      </form>

      <ul className="mt-6 overflow-hidden rounded-xl border border-white/10">
        {admins.length === 0 ? (
          <li className="bg-[#171717] px-5 py-4 text-sm text-neutral-400">
            No admins in the list yet. The ADMIN_EMAILS env var still
            decides who can sign in.
          </li>
        ) : (
          admins.map((admin) => {
            const isYou =
              admin.email.toLowerCase() === currentEmail.toLowerCase();
            const isConfirming = confirming === admin.email;
            return (
              <li
                key={admin.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#171717] px-5 py-4 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-bold text-white">
                    {admin.email}
                    {isYou ? (
                      <span className="ml-2 rounded-full bg-[#171717] px-2 py-0.5 text-[11px] font-bold text-black">
                        You
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Added{" "}
                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {isYou ? (
                  <span className="text-xs text-neutral-500">
                    You cannot remove yourself.
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemove(admin.email)}
                    disabled={removing === admin.email}
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isConfirming
                        ? "border-white bg-[#171717] text-black"
                        : "border-white/20 text-white hover:border-white"
                    }`}
                  >
                    {removing === admin.email
                      ? "Removing…"
                      : isConfirming
                        ? "Click again to remove"
                        : "Remove"}
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
