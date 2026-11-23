"use client";

import { useState } from "react";
import type { Artist, Release } from "@/lib/types";
import ImageUpload from "./ImageUpload";
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

function blankRelease(artistId: string): Release {
  return {
    id: newId(),
    artistId,
    title: "",
    type: "",
    releaseDate: "",
    link: "",
    visible: true,
    sortOrder: 0,
  };
}

export default function ArtistsEditor({
  initial,
  initialReleases,
}: {
  initial: Artist[];
  initialReleases: Record<string, Release[]>;
}) {
  const [rows, setRows] = useState<Artist[]>(initial);
  const [releasesByArtist, setReleasesByArtist] =
    useState<Record<string, Release[]>>(initialReleases);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"all" | "visible" | "hidden">(
    "all",
  );
  const [sort, setSort] = useState<"manual" | "name">("manual");

  // View-only: search / filter / sort never change the saved order.
  const needle = query.trim().toLowerCase();
  const viewRows = rows
    .filter((artist) => {
      if (visibility === "visible" && !artist.visible) return false;
      if (visibility === "hidden" && artist.visible) return false;
      if (needle === "") return true;
      return [artist.name, artist.genre, artist.location]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : 0,
    );

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

  function updateRelease(
    artistId: string,
    releaseId: string,
    patch: Partial<Release>,
  ) {
    setReleasesByArtist((current) => ({
      ...current,
      [artistId]: (current[artistId] ?? []).map((release) =>
        release.id === releaseId ? { ...release, ...patch } : release,
      ),
    }));
    setStatus("idle");
  }

  function addRelease(artistId: string) {
    setReleasesByArtist((current) => ({
      ...current,
      [artistId]: [...(current[artistId] ?? []), blankRelease(artistId)],
    }));
    setStatus("idle");
  }

  function deleteRelease(artistId: string, releaseId: string) {
    setReleasesByArtist((current) => ({
      ...current,
      [artistId]: (current[artistId] ?? []).filter(
        (release) => release.id !== releaseId,
      ),
    }));
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

      // Artists saved. Now save each artist's releases. Rows with no
      // title yet are not releases — the API rejects them — so they
      // are left out rather than failing the whole save.
      const savedIds = new Set(rows.map((row) => row.id));
      for (const artistId of Object.keys(releasesByArtist)) {
        const artist = rows.find((row) => row.id === artistId);
        // A deleted artist is not in rows — post an empty list so its
        // releases are cleared instead of orphaned in the table. The
        // releases API accepts an empty list for a missing artist.
        const releases = !savedIds.has(artistId)
          ? []
          : (releasesByArtist[artistId] ?? [])
          .filter((release) => release.title.trim() !== "")
          .map((release) => ({
            id: release.id,
            title: release.title,
            type: release.type,
            releaseDate: release.releaseDate,
            link: release.link,
            visible: release.visible,
          }));
        const releasesResponse = await fetch("/api/admin/releases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artist_id: artistId, releases }),
        });
        if (!releasesResponse.ok) {
          setError(
            `The artists were saved, but the releases for ${
              artist?.name || "that artist"
            } could not be saved. Please try again.`,
          );
          setStatus("error");
          return;
        }
      }
      setStatus("saved");
    } catch {
      setError("Save failed. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/15 bg-[#241443] p-4">
        <input
          className={`${inputClass} sm:max-w-xs`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists…"
          aria-label="Search artists"
        />
        <select
          className={`${inputClass} w-auto`}
          value={visibility}
          onChange={(e) =>
            setVisibility(e.target.value as "all" | "visible" | "hidden")
          }
          aria-label="Filter by visibility"
        >
          <option value="all">All</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
        <select
          className={`${inputClass} w-auto`}
          value={sort}
          onChange={(e) => setSort(e.target.value as "manual" | "name")}
          aria-label="Sort artists"
        >
          <option value="manual">Manual order</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-white/15 bg-[#241443] p-6 text-sm leading-7 text-white/65">
          No artists yet. Add the first one below — it will appear on the
          Artists &amp; Releases page as soon as you save.
        </p>
      ) : null}
      {viewRows.length === 0 && rows.length > 0 ? (
        <p className="rounded-xl border border-white/15 bg-[#241443] p-6 text-sm leading-7 text-white/65">
          No artists match that search or filter.
        </p>
      ) : null}

      <div className="space-y-4">
        {viewRows.map((artist) => {
          const index = rows.findIndex((row) => row.id === artist.id);
          const releases = releasesByArtist[artist.id] ?? [];
          return (
          <section
            key={artist.id}
            className="rounded-xl border border-white/15 bg-[#241443] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                {artist.name || "New artist"}
              </h2>
              <div className="flex items-center gap-2">
                {sort === "manual" ? (
                  <>
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
                  </>
                ) : null}
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
              <div>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                  Upload photo
                </span>
                <ImageUpload
                  value={artist.image}
                  onChange={(image) => update(artist.id, { image })}
                  kind="artists"
                  slug={artist.slug || slugify(artist.name)}
                />
              </div>
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

            <div className="mt-6 border-t border-white/10 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/70">
                Releases
              </h3>
              {releases.length === 0 ? (
                <p className="mt-3 text-sm text-white/55">
                  No releases yet. Add one below — releases are admin-side
                  detail for now and are not shown on the public site.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {releases.map((release) => (
                    <div
                      key={release.id}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Title">
                          <input
                            className={inputClass}
                            value={release.title}
                            onChange={(e) =>
                              updateRelease(artist.id, release.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Release title"
                          />
                        </Field>
                        <Field label="Type">
                          <input
                            className={inputClass}
                            value={release.type}
                            onChange={(e) =>
                              updateRelease(artist.id, release.id, {
                                type: e.target.value,
                              })
                            }
                            placeholder="Single, EP, Album…"
                          />
                        </Field>
                        <Field label="Release date">
                          <input
                            className={inputClass}
                            type="date"
                            value={release.releaseDate}
                            onChange={(e) =>
                              updateRelease(artist.id, release.id, {
                                releaseDate: e.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Link">
                          <input
                            className={inputClass}
                            value={release.link}
                            onChange={(e) =>
                              updateRelease(artist.id, release.id, {
                                link: e.target.value,
                              })
                            }
                            placeholder="https://…"
                          />
                        </Field>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Toggle
                          checked={release.visible}
                          onChange={(visible) =>
                            updateRelease(artist.id, release.id, { visible })
                          }
                          label="Release visible"
                        />
                        <span className="text-sm text-white/70">
                          {release.visible ? "Visible" : "Hidden"}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteRelease(artist.id, release.id)}
                          className="ml-auto rounded-md border border-[#F32991]/60 px-3 py-1.5 text-xs font-bold text-[#F32991] transition hover:bg-[#F32991] hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => addRelease(artist.id)}
                className="mt-4 rounded-md border border-white/25 px-4 py-2 text-xs font-bold text-white transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
              >
                + Add release
              </button>
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
          );
        })}
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
