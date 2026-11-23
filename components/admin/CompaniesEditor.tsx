"use client";

import { useState } from "react";
import type { Company } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { Field, Toggle, inputClass, newId, slugify } from "./ui";

function blankCompany(): Company {
  return {
    id: newId(),
    slug: "",
    name: "",
    tagline: "",
    category: "",
    description: "",
    website: "",
    image: "",
    foundedYear: null,
    location: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    visible: true,
    sortOrder: 0,
  };
}

export default function CompaniesEditor({
  initial,
}: {
  initial: Company[];
}) {
  const [rows, setRows] = useState<Company[]>(initial);
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
    .filter((company) => {
      if (visibility === "visible" && !company.visible) return false;
      if (visibility === "hidden" && company.visible) return false;
      if (needle === "") return true;
      return [company.name, company.category, company.tagline, company.location]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : 0,
    );

  function update(id: string, patch: Partial<Company>) {
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
        body: JSON.stringify({ table: "companies", rows }),
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
        <p className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6 text-sm leading-7 text-neutral-600">
          No companies yet. Add the first one below — it will appear on the
          Companies page as soon as you save.
        </p>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-[#f5f5f5] p-4">
        <input
          className={`${inputClass} sm:max-w-xs`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies…"
          aria-label="Search companies"
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
          aria-label="Sort companies"
        >
          <option value="manual">Manual order</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {viewRows.length === 0 && rows.length > 0 ? (
        <p className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6 text-sm leading-7 text-neutral-600">
          No companies match that search or filter.
        </p>
      ) : null}

      <div className="space-y-4">
        {viewRows.map((company) => {
          const index = rows.findIndex((row) => row.id === company.id);
          return (
          <section
            key={company.id}
            className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                {company.name || "New company"}
              </h2>
              <div className="flex items-center gap-2">
                {sort === "manual" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => move(company.id, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-bold text-[#111111]/70 transition hover:border-black hover:text-black disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(company.id, 1)}
                      disabled={index === rows.length - 1}
                      aria-label="Move down"
                      className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-bold text-[#111111]/70 transition hover:border-black hover:text-black disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() =>
                    setRows((current) =>
                      current.filter((row) => row.id !== company.id),
                    )
                  }
                  className="rounded-md border border-black/60 px-3 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-black hover:text-[#111111]"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  className={inputClass}
                  value={company.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    update(company.id, {
                      name,
                      slug:
                        company.slug === "" ||
                        company.slug === slugify(company.name)
                          ? slugify(name)
                          : company.slug,
                    });
                  }}
                  placeholder="Company name"
                />
              </Field>
              <Field label="Slug" hint="Lowercase, hyphens only.">
                <input
                  className={inputClass}
                  value={company.slug}
                  onChange={(e) => update(company.id, { slug: slugify(e.target.value) })}
                  placeholder="company-slug"
                />
              </Field>
              <Field label="Tagline">
                <input
                  className={inputClass}
                  value={company.tagline}
                  onChange={(e) => update(company.id, { tagline: e.target.value })}
                  placeholder="One-line tagline"
                />
              </Field>
              <Field label="Category">
                <input
                  className={inputClass}
                  value={company.category}
                  onChange={(e) => update(company.id, { category: e.target.value })}
                  placeholder="e.g. Recorded Music, Publishing"
                />
              </Field>
              <Field label="Website">
                <input
                  className={inputClass}
                  value={company.website ?? ""}
                  onChange={(e) => update(company.id, { website: e.target.value })}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Image URL">
                <input
                  className={inputClass}
                  value={company.image ?? ""}
                  onChange={(e) => update(company.id, { image: e.target.value })}
                  placeholder="https://… (leave blank for no image)"
                />
              </Field>
              <div>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
                  Upload logo
                </span>
                <ImageUpload
                  value={company.image ?? ""}
                  onChange={(image) => update(company.id, { image })}
                  kind="companies"
                  slug={company.slug || slugify(company.name)}
                />
              </div>
              <Field label="Founded year">
                <input
                  className={inputClass}
                  type="number"
                  value={company.foundedYear ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const parsed =
                      raw === "" ? null : Number.parseInt(raw, 10);
                    update(company.id, {
                      foundedYear:
                        parsed === null || Number.isNaN(parsed)
                          ? null
                          : parsed,
                    });
                  }}
                  placeholder="e.g. 2018"
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  value={company.location}
                  onChange={(e) => update(company.id, { location: e.target.value })}
                  placeholder="City, State"
                />
              </Field>
              <Field label="Instagram">
                <input
                  className={inputClass}
                  type="url"
                  value={company.instagram ?? ""}
                  onChange={(e) => update(company.id, { instagram: e.target.value })}
                  placeholder="https://instagram.com/…"
                />
              </Field>
              <Field label="Facebook">
                <input
                  className={inputClass}
                  type="url"
                  value={company.facebook ?? ""}
                  onChange={(e) => update(company.id, { facebook: e.target.value })}
                  placeholder="https://facebook.com/…"
                />
              </Field>
              <Field label="TikTok">
                <input
                  className={inputClass}
                  type="url"
                  value={company.tiktok ?? ""}
                  onChange={(e) => update(company.id, { tiktok: e.target.value })}
                  placeholder="https://tiktok.com/…"
                />
              </Field>
              <Field label="YouTube">
                <input
                  className={inputClass}
                  type="url"
                  value={company.youtube ?? ""}
                  onChange={(e) => update(company.id, { youtube: e.target.value })}
                  placeholder="https://youtube.com/…"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Description">
                <textarea
                  className={`${inputClass} min-h-24 resize-y`}
                  value={company.description}
                  onChange={(e) => update(company.id, { description: e.target.value })}
                  placeholder="What this company does within the group."
                />
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Toggle
                checked={company.visible}
                onChange={(visible) => update(company.id, { visible })}
                label="Visible on the public site"
              />
              <span className="text-sm text-[#111111]/70">
                {company.visible ? "Visible on the site" : "Hidden from the site"}
              </span>
            </div>
          </section>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setRows((current) => [...current, blankCompany()])}
          className="rounded-md border border-black/20 px-5 py-3 text-sm font-bold text-[#111111] transition hover:border-black hover:text-black"
        >
          + Add company
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black hover:text-white disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save all companies"}
        </button>
        {status === "saved" ? (
          <p className="text-sm font-bold text-[#111111]">
            Saved — live on the site now.
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="text-sm text-[#111111]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
