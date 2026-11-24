"use client";

import { useRef, useState } from "react";

/**
 * Shared admin image-upload control. Picks a file, uploads it to
 * /api/admin/upload (admin session only, images ≤ 5 MB), and hands
 * the returned public URL back through onChange — the caller keeps
 * it in its own field and saves it with its normal Save button.
 * Shows a thumbnail of the current image and a Remove button that
 * clears the URL. The caller keeps its own URL text field alongside
 * this control, so pasting a URL still works.
 */
export default function ImageUpload({
  value,
  onChange,
  kind,
  slug,
}: {
  value: string;
  onChange: (url: string) => void;
  kind: "artists" | "companies" | "site" | "strip";
  slug: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image file first.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", kind);
      form.append("slug", slug || "image");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string"
            ? body.error
            : "Upload failed. Please try again.",
        );
        return;
      }
      if (typeof body?.url !== "string" || !body.url) {
        setError("Upload failed. Please try again.");
        return;
      }
      onChange(body.url);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="mb-3 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Current image preview"
            className="h-20 w-20 shrink-0 rounded-md border border-black/15 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-md border border-black/60 px-3 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-black hover:text-[#111111]"
          >
            Remove image
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={() => setError("")}
          className="min-w-0 flex-1 rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-[#111111]/80 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#111111]"
        />
        <button
          type="button"
          onClick={upload}
          disabled={uploading}
          className="shrink-0 rounded-md bg-[#111111] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-black hover:text-white disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      <p className="mt-1 text-xs leading-5 text-neutral-400">
        JPEG, PNG, WebP, GIF or AVIF, 5 MB max. Uploading fills the image
        URL — remember to save.
      </p>
      {error ? (
        <p role="alert" className="mt-1 text-xs text-[#111111]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
