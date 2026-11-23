"use client";

import { useState } from "react";
import type { ServiceItem } from "@/lib/types";
import { Field, Toggle, inputClass, newId, slugify } from "./ui";

function blankService(order: number): ServiceItem {
  return {
    id: newId(),
    slug: "",
    number: String(order + 1).padStart(2, "0"),
    title: "",
    subtitle: "",
    description: "",
    offerings: [],
    visible: true,
    sortOrder: order,
  };
}

export default function ServicesEditor({
  initial,
}: {
  initial: ServiceItem[];
}) {
  const [rows, setRows] = useState<ServiceItem[]>(initial);
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
    .filter((service) => {
      if (visibility === "visible" && !service.visible) return false;
      if (visibility === "hidden" && service.visible) return false;
      if (needle === "") return true;
      return [service.title, service.subtitle]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .sort((a, b) =>
      sort === "name" ? a.title.localeCompare(b.title) : 0,
    );

  function update(id: string, patch: Partial<ServiceItem>) {
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
        body: JSON.stringify({ table: "services", rows }),
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
      <p className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6 text-sm leading-7 text-neutral-600">
        These are the service cards on the Services page. The homepage
        shows the first six visible services as its focus areas.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-[#f5f5f5] p-4">
        <input
          className={`${inputClass} sm:max-w-xs`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          aria-label="Search services"
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
          aria-label="Sort services"
        >
          <option value="manual">Manual order</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {viewRows.length === 0 && rows.length > 0 ? (
        <p className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6 text-sm leading-7 text-neutral-600">
          No services match that search or filter.
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {viewRows.map((service) => {
          const index = rows.findIndex((row) => row.id === service.id);
          return (
          <section
            key={service.id}
            className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                {service.number ? `${service.number} — ` : ""}
                {service.title || "New service"}
              </h2>
              <div className="flex items-center gap-2">
                {sort === "manual" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => move(service.id, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-bold text-[#111111]/70 transition hover:border-black hover:text-black disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(service.id, 1)}
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
                      current.filter((row) => row.id !== service.id),
                    )
                  }
                  className="rounded-md border border-black/60 px-3 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-black hover:text-[#111111]"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Number" hint="Shown on the card, e.g. 01.">
                <input
                  className={inputClass}
                  value={service.number}
                  onChange={(e) => update(service.id, { number: e.target.value })}
                  placeholder="01"
                />
              </Field>
              <Field label="Slug" hint="Lowercase, hyphens only.">
                <input
                  className={inputClass}
                  value={service.slug}
                  onChange={(e) => update(service.id, { slug: slugify(e.target.value) })}
                  placeholder="service-slug"
                />
              </Field>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={service.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    update(service.id, {
                      title,
                      slug:
                        service.slug === "" ||
                        service.slug === slugify(service.title)
                          ? slugify(title)
                          : service.slug,
                    });
                  }}
                  placeholder="Service title"
                />
              </Field>
              <Field label="Subtitle" hint="Small caps label, e.g. RECORDS & RELEASES.">
                <input
                  className={inputClass}
                  value={service.subtitle}
                  onChange={(e) => update(service.id, { subtitle: e.target.value })}
                  placeholder="SUBTITLE"
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4">
              <Field label="Description">
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  value={service.description}
                  onChange={(e) => update(service.id, { description: e.target.value })}
                  placeholder="What this service covers."
                />
              </Field>
              <Field
                label="Areas of focus"
                hint="One per line — each line becomes a bullet on the card."
              >
                <textarea
                  className={`${inputClass} min-h-24 resize-y`}
                  value={service.offerings.join("\n")}
                  onChange={(e) =>
                    update(service.id, {
                      offerings: e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter((line) => line !== ""),
                    })
                  }
                  placeholder={"First area of focus\nSecond area of focus"}
                />
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Toggle
                checked={service.visible}
                onChange={(visible) => update(service.id, { visible })}
                label="Visible on the public site"
              />
              <span className="text-sm text-[#111111]/70">
                {service.visible ? "Visible on the site" : "Hidden from the site"}
              </span>
            </div>
          </section>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() =>
            setRows((current) => [...current, blankService(current.length)])
          }
          className="rounded-md border border-black/20 px-5 py-3 text-sm font-bold text-[#111111] transition hover:border-black hover:text-black"
        >
          + Add service
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black hover:text-white disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save all services"}
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
