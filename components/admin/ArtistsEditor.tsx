"use client";

import { useState } from "react";
import type { Artist } from "@/lib/types";
import { Field, Toggle, inputClass, newId, slugify } from "./ui";

function blankArtist(): Artist {
  return {
    id: newId(),
    slug: "",
    name: "",
    genre: "",
    status: "",
    location: "",
    image: "",
    description: "",
    bio: "",
    website: "",
    instagram: "",
    spotify: "",
    youtube: "",
    visible: true,
    sortOrder: 0,
  };
}

export default function ArtistsEditor({
  initial,
}: {
  initial: Artist[];
}) {
  const [rows, setRows] = useState<Artist[]>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  function update(id: string, patch: Partial<Artist>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
    setStatus("idle");
  }

  function move(id: string, direction: -1 | 1) {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "artists", rows }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string" ? body.error : "Save failed.",
        );
        setStatus("error");
        return;
      }
      setStatus("saved");
    } catch {
      setError("Save failed. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-white/15 bg-[#241443] p-6 text-sm leading-7 text-white/65">
          No artists yet. Add the first one below — it will appear on the
          Artists &amp; Releases page as soon as you save.
        </p>
      ) : null}

      <div className="space-y-4">
        {rows.map((artist, index) => (
          <section
            key={artist.id}
            className="rounded-xl border border-white/15 bg-[#241443] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                {artist.name || "New artist"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(artist.id, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-[#D7FF38] hover:text-[#D7FF38] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(artist.id, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="Move down"
                  className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-[#D7FF38] hover:text-[#D7FF38] disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRows((current) =>
                      current.filter((row) => row.id !== artist.id),
                    )
                  }
                  className="rounded-md border border-[#F32991]/60 px-3 py-1.5 text-xs font-bold text-[#F32991] transition hover:bg-[#F32991] hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  className={inputClass}
                  value={artist.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    update(artist.id, {
                      name,
                      slug:
                        artist.slug === "" ||
                        artist.slug === slugify(artist.name)
                          ? slugify(name)
                          : artist.slug,
                    });
                  }}
                  placeholder="Artist name"
                />
              </Field>
              <Field label="Slug" hint="Used in the artist URL. Lowercase, hyphens only.">
                <input
                  className={inputClass}
                  value={artist.slug}
                  onChange={(e) => update(artist.id, { slug: slugify(e.target.value) })}
                  placeholder="artist-slug"
                />
              </Field>
              <Field label="Genre">
                <input
                  className={inputClass}
                  value={artist.genre}
                  onChange={(e) => update(artist.id, { genre: e.target.value })}
                  placeholder="e.g. Hip-Hop, R&B"
                />
              </Field>
              <Field label="Status">
                <input
                  className={inputClass}
                  value={artist.status}
                  onChange={(e) => update(artist.id, { status: e.target.value })}
                  placeholder="e.g. Signed, Independent"
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  value={artist.location}
                  onChange={(e) => update(artist.id, { location: e.target.value })}
                  placeholder="City, State"
                />
              </Field>
              <Field label="Image URL">
                <input
                  className={inputClass}
                  value={artist.image}
                  onChange={(e) => update(artist.id, { image: e.target.value })}
                  placeholder="https://… (leave blank for no image)"
                />
              </Field>
              <Field label="Website">
                <input
                  className={inputClass}
                  value={artist.website ?? ""}
                  onChange={(e) => update(artist.id, { website: e.target.value })}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Instagram">
                <input
                  className={inputClass}
                  value={artist.instagram ?? ""}
                  onChange={(e) => update(artist.id, { instagram: e.target.value })}
                  placeholder="https://instagram.com/…"
                />
              </Field>
              <Field label="Spotify">
                <input
                  className={inputClass}
                  value={artist.spotify ?? ""}
                  onChange={(e) => update(artist.id, { spotify: e.target.value })}
                  placeholder="https://open.spotify.com/…"
                />
              </Field>
              <Field label="YouTube">
                <input
                  className={inputClass}
                  value={artist.youtube ?? ""}
                  onChange={(e) => update(artist.id, { youtube: e.target.value })}
                  placeholder="https://youtube.com/…"
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4">
              <Field label="Short description">
                <textarea
                  className={`${inputClass} min-h-20 resize-y`}
                  value={artist.description}
                  onChange={(e) => update(artist.id, { description: e.target.value })}
                  placeholder="One or two sentences shown on the artist card."
                />
              </Field>
              <Field label="Bio">
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={artist.bio}
                  onChange={(e) => update(artist.id, { bio: e.target.value })}
                  placeholder="Longer bio (shown on the artist page)."
                />
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Toggle
                checked={artist.visible}
                onChange={(visible) => update(artist.id, { visible })}
                label="Visible on the public site"
              />
              <span className="text-sm text-white/70">
                {artist.visible ? "Visible on the site" : "Hidden from the site"}
              </span>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setRows((current) => [...current, blankArtist()])}
          className="rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
        >
          + Add artist
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-[#D7FF38] px-6 py-3 text-sm font-bold text-[#160D2C] transition hover:bg-[#F32991] hover:text-white disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save all artists"}
        </button>
        {status === "saved" ? (
          <p className="text-sm font-bold text-[#D7FF38]">
            Saved — live on the site now.
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="text-sm text-[#F32991]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
