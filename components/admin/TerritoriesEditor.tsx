"use client";

import { useState } from "react";
import type { Territory } from "@/lib/types";
import { Field, Toggle, inputClass, newId, slugify } from "./ui";

function blankTerritory(): Territory {
  return {
    id: newId(),
    slug: "",
    name: "",
    region: "",
    website: "",
    visible: true,
    sortOrder: 0,
  };
}

export default function TerritoriesEditor({
  initial,
}: {
  initial: Territory[];
}) {
  const [rows, setRows] = useState<Territory[]>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  function update(id: string, patch: Partial<Territory>) {
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
        body: JSON.stringify({ table: "territories", rows }),
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
          No territories yet. Add the first one below — the Global
          Territories section on the Companies page stays hidden until at
          least one visible territory is saved.
        </p>
      ) : null}

      <div className="space-y-4">
        {rows.map((territory, index) => (
          <section
            key={territory.id}
            className="rounded-xl border border-white/15 bg-[#241443] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                {territory.name || "New territory"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(territory.id, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-[#D7FF38] hover:text-[#D7FF38] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(territory.id, 1)}
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
                      current.filter((row) => row.id !== territory.id),
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
                  value={territory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    update(territory.id, {
                      name,
                      slug:
                        territory.slug === "" ||
                        territory.slug === slugify(territory.name)
                          ? slugify(name)
                          : territory.slug,
                    });
                  }}
                  placeholder="e.g. United States"
                />
              </Field>
              <Field label="Slug" hint="Lowercase, hyphens only.">
                <input
                  className={inputClass}
                  value={territory.slug}
                  onChange={(e) =>
                    update(territory.id, { slug: slugify(e.target.value) })
                  }
                  placeholder="e.g. united-states"
                />
              </Field>
              <Field label="Region">
                <input
                  className={inputClass}
                  value={territory.region}
                  onChange={(e) =>
                    update(territory.id, { region: e.target.value })
                  }
                  placeholder="e.g. North America"
                />
              </Field>
              <Field label="Website">
                <input
                  className={inputClass}
                  value={territory.website ?? ""}
                  onChange={(e) =>
                    update(territory.id, { website: e.target.value })
                  }
                  placeholder="https://… (leave blank for plain text)"
                />
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Toggle
                checked={territory.visible}
                onChange={(visible) => update(territory.id, { visible })}
                label="Visible on the public site"
              />
              <span className="text-sm text-white/70">
                {territory.visible
                  ? "Visible on the site"
                  : "Hidden from the site"}
              </span>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setRows((current) => [...current, blankTerritory()])}
          className="rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
        >
          + Add territory
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-[#D7FF38] px-6 py-3 text-sm font-bold text-[#160D2C] transition hover:bg-[#F32991] hover:text-white disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save all territories"}
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
