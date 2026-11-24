"use client";

import { useState } from "react";
import type { StripItem } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { Field, Toggle, inputClass, newId, slugify } from "./ui";

function blankStripItem(): StripItem {
  return {
    id: newId(),
    slug: "",
    name: "",
    image: "",
    heightPx: 90,
    visible: true,
    sortOrder: 0,
  };
}

const MIN_SPEED = 20;
const MAX_SPEED = 150;

/**
 * Turn a logo picture into the flat black logo the strip uses —
 * black artwork on a transparent background, like UMG's strip.
 * Runs in the browser with a canvas, the same way the five
 * approved logos were made: the artwork's brightness becomes the
 * transparency, everything else becomes black.
 *
 * - "Light on dark" (Melted Mindz, Dial): bright pixels are the
 *   artwork, so the brightest channel becomes the alpha.
 * - "Dark on light" (Iron Stage, Arden Row): dark pixels are the
 *   artwork, so the darkest channel, inverted, becomes the alpha.
 * Faint noise is cleaned out and empty transparent margins are
 * trimmed, then the result is uploaded as a PNG.
 */
async function makeBlackLogo(
  imageUrl: string,
  darkOnLight: boolean,
): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error("Could not load that picture to convert it."));
    image.src = imageUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser could not convert the picture.");
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = data.data;
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    let alpha = darkOnLight
      ? 255 - Math.min(r, g, b)
      : Math.max(r, g, b);
    if (alpha < 14) alpha = 0;
    px[i] = 0;
    px[i + 1] = 0;
    px[i + 2] = 0;
    px[i + 3] = alpha;
    if (alpha > 0) {
      const p = i / 4;
      const x = p % canvas.width;
      const y = Math.floor(p / canvas.width);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  ctx.putImageData(data, 0, 0);
  if (maxX < 0) throw new Error("Nothing was found in that picture to keep.");
  const trimmed = document.createElement("canvas");
  trimmed.width = maxX - minX + 1;
  trimmed.height = maxY - minY + 1;
  const trimmedCtx = trimmed.getContext("2d");
  if (!trimmedCtx) throw new Error("This browser could not convert the picture.");
  trimmedCtx.drawImage(canvas, -minX, -minY);
  const blob = await new Promise<Blob | null>((resolve) =>
    trimmed.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Could not make the black logo picture.");
  return blob;
}

export default function StripEditor({
  initial,
  initialSpeed,
}: {
  initial: StripItem[];
  initialSpeed: number;
}) {
  const [rows, setRows] = useState<StripItem[]>(initial);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [converting, setConverting] = useState<string | null>(null);
  const [convertError, setConvertError] = useState("");

  function update(id: string, patch: Partial<StripItem>) {
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

  async function convert(id: string, darkOnLight: boolean) {
    const row = rows.find((r) => r.id === id);
    if (!row || !row.image) return;
    setConverting(id);
    setConvertError("");
    try {
      const blob = await makeBlackLogo(row.image, darkOnLight);
      const form = new FormData();
      form.append("file", blob, `${row.slug || "logo"}.png`);
      form.append("kind", "strip");
      form.append("slug", row.slug || "logo");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || typeof body?.url !== "string") {
        throw new Error(
          typeof body?.error === "string"
            ? body.error
            : "Upload failed. Please try again.",
        );
      }
      update(id, { image: body.url });
    } catch (e) {
      setConvertError(
        e instanceof Error ? e.message : "Could not make the black logo.",
      );
    } finally {
      setConverting(null);
    }
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const itemsResponse = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "strip_items", rows }),
      });
      const itemsBody = await itemsResponse.json().catch(() => ({}));
      if (!itemsResponse.ok) {
        setError(
          typeof itemsBody?.error === "string"
            ? itemsBody.error
            : "Save failed.",
        );
        setStatus("error");
        return;
      }
      const speedResponse = await fetch("/api/admin/strip-speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speedPxPerSec: speed }),
      });
      const speedBody = await speedResponse.json().catch(() => ({}));
      if (!speedResponse.ok) {
        setError(
          typeof speedBody?.error === "string"
            ? speedBody.error
            : "The logos saved, but the speed did not. Please try again.",
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
      <section className="rounded-lg border border-black/15 bg-white p-5">
        <h2 className="text-base font-bold">Speed</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">
          How fast the logos move across the page, in pixels per second.
          It is {speed} px/s now — UMG&apos;s strip runs at about 44 px/s.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Slower
          </span>
          <input
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={1}
            value={speed}
            aria-label="Logo strip speed in pixels per second"
            onChange={(e) => {
              setSpeed(Number(e.target.value));
              setStatus("idle");
            }}
            className="min-w-0 flex-1 accent-black"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Faster
          </span>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="number"
              min={MIN_SPEED}
              max={MAX_SPEED}
              value={speed}
              aria-label="Logo strip speed, pixels per second"
              onChange={(e) => {
                setSpeed(
                  Math.max(
                    MIN_SPEED,
                    Math.min(MAX_SPEED, Number(e.target.value) || MIN_SPEED),
                  ),
                );
                setStatus("idle");
              }}
              className={`${inputClass} w-24`}
            />
            px/s
          </label>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold">Logos in the strip</h2>
        <button
          type="button"
          onClick={() => {
            setRows((current) => [...current, blankStripItem()]);
            setStatus("idle");
          }}
          className="rounded-full bg-[#111111] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-black"
        >
          Add a logo
        </button>
      </div>
      <p className="mt-1 text-sm leading-6 text-neutral-600">
        The logos run in this order, left to right, and repeat until they
        fill the page. Hide one to take it out of the strip without
        deleting it. Logos should be black artwork on a transparent
        background — use “Make black version” below to turn any uploaded
        picture into one.
      </p>

      {convertError ? (
        <p role="alert" className="mt-4 text-sm text-[#111111]">
          {convertError}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {rows.map((row, index) => (
          <article
            key={row.id}
            className="rounded-lg border border-black/15 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold">
                {row.name || `Logo ${index + 1}`}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(row.id, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${row.name || "logo"} earlier`}
                  className="rounded-md border border-black/15 px-3 py-2 text-xs font-bold disabled:opacity-40"
                >
                  ↑ Earlier
                </button>
                <button
                  type="button"
                  onClick={() => move(row.id, 1)}
                  disabled={index === rows.length - 1}
                  aria-label={`Move ${row.name || "logo"} later`}
                  className="rounded-md border border-black/15 px-3 py-2 text-xs font-bold disabled:opacity-40"
                >
                  Later ↓
                </button>
                <div className="flex items-center gap-2 pl-2">
                  <Toggle
                    checked={row.visible}
                    onChange={(value) => update(row.id, { visible: value })}
                    label={`Show ${row.name || "logo"} in the strip`}
                  />
                  <span className="text-xs text-neutral-600">
                    {row.visible ? "Showing" : "Hidden"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    update(row.id, {
                      name,
                      slug: row.slug || slugify(name),
                    });
                  }}
                  placeholder="e.g. Iron Stage Touring"
                  className={inputClass}
                />
              </Field>
              <Field
                label="Height (px)"
                hint="How tall the logo is on a computer — about 71% of this on a phone. 90 is the tallest, 60 suits wide wordmarks."
              >
                <input
                  type="number"
                  min={40}
                  max={120}
                  value={row.heightPx}
                  onChange={(e) =>
                    update(row.id, {
                      heightPx: Math.max(
                        40,
                        Math.min(120, Number(e.target.value) || 90),
                      ),
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Logo picture">
                <ImageUpload
                  value={row.image}
                  onChange={(url) => update(row.id, { image: url })}
                  kind="strip"
                  slug={row.slug || slugify(row.name) || "logo"}
                />
              </Field>
              {row.image ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-600">
                    Make a black version of this picture:
                  </span>
                  <button
                    type="button"
                    disabled={converting === row.id}
                    onClick={() => convert(row.id, false)}
                    className="rounded-full border border-black/60 px-3 py-2 text-xs font-bold transition hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    {converting === row.id
                      ? "Making…"
                      : "Light artwork on dark"}
                  </button>
                  <button
                    type="button"
                    disabled={converting === row.id}
                    onClick={() => convert(row.id, true)}
                    className="rounded-full border border-black/60 px-3 py-2 text-xs font-bold transition hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    {converting === row.id
                      ? "Making…"
                      : "Dark artwork on light"}
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setRows((current) =>
                    current.filter((r) => r.id !== row.id),
                  );
                  setStatus("idle");
                }}
                className="text-xs font-bold text-[#111111] underline underline-offset-4"
              >
                Remove this logo
              </button>
            </div>
          </article>
        ))}
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-black/20 p-5 text-sm text-neutral-600">
            No logos yet — add one above. If the strip is empty, the page
            shows the five approved logos instead.
          </p>
        ) : null}
      </div>

      <div className="sticky bottom-20 mt-8 flex flex-wrap items-center gap-3 md:bottom-6">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save strip"}
        </button>
        {status === "saved" ? (
          <span className="text-sm font-bold">Saved — live on /labels.</span>
        ) : null}
        {status === "error" && error ? (
          <span role="alert" className="text-sm text-[#111111]">
            {error}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-neutral-400">
        Saving the logos or the speed shows on the live site within
        seconds — no redeploy. Before the first save here, run
        supabase/amity-strip-migration.sql in the Supabase SQL Editor.
      </p>
    </div>
  );
}
