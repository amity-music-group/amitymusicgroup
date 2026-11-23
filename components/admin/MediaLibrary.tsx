"use client";

import { useState } from "react";
import type { MediaFile } from "@/lib/types";
import { inputClass } from "./ui";

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export default function MediaLibrary({
  initial,
}: {
  initial: MediaFile[];
}) {
  const [files, setFiles] = useState<MediaFile[]>(initial);
  const [query, setQuery] = useState("");
  const [copiedPath, setCopiedPath] = useState("");
  const [confirmPath, setConfirmPath] = useState("");
  const [deletingPath, setDeletingPath] = useState("");
  const [error, setError] = useState("");

  const needle = query.trim().toLowerCase();
  const visible = files.filter(
    (file) =>
      needle === "" ||
      file.name.toLowerCase().includes(needle) ||
      file.path.toLowerCase().includes(needle),
  );

  async function copyUrl(file: MediaFile) {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopiedPath(file.path);
      window.setTimeout(() => {
        setCopiedPath((current) =>
          current === file.path ? "" : current,
        );
      }, 2000);
    } catch {
      setError("Could not copy the URL. Copy it from the address bar instead.");
    }
  }

  async function handleDelete(file: MediaFile) {
    if (confirmPath !== file.path) {
      setConfirmPath(file.path);
      setError("");
      return;
    }
    setConfirmPath("");
    setDeletingPath(file.path);
    setError("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: file.path }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string"
            ? body.error
            : "Could not delete the file.",
        );
        return;
      }
      setFiles((current) =>
        current.filter((entry) => entry.path !== file.path),
      );
    } catch {
      setError("Could not delete the file. Please try again.");
    } finally {
      setDeletingPath("");
    }
  }

  return (
    <div>
      <input
        className={inputClass}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by file name or path…"
        aria-label="Search media files"
      />

      {error ? (
        <p role="alert" className="mt-4 text-sm text-[#111111]">
          {error}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <p className="mt-6 rounded-xl border border-black/10 bg-[#f5f5f5] p-6 text-sm leading-7 text-neutral-600">
          {files.length === 0
            ? "No images uploaded yet. Uploads happen inside the artist, company and settings editors."
            : "No files match that search."}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((file) => (
            <article
              key={file.path}
              className="overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f5]"
            >
              <div className="flex h-40 items-center justify-center bg-[#eeeeee]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4">
                <p className="break-all text-sm font-bold text-[#111111]">
                  {file.name}
                </p>
                <p className="mt-1 break-all text-xs text-neutral-500">
                  {file.path}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  {formatSize(file.size)} · {formatDate(file.updatedAt)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(file)}
                    className="rounded-md border border-black/20 px-3 py-1.5 text-xs font-bold text-[#111111] transition hover:border-black hover:text-black"
                  >
                    {copiedPath === file.path ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(file)}
                    disabled={deletingPath === file.path}
                    className={`rounded-md border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                      confirmPath === file.path
                        ? "border-black bg-[#111111] text-white"
                        : "border-black/60 text-[#111111] hover:bg-black hover:text-[#111111]"
                    }`}
                  >
                    {deletingPath === file.path
                      ? "Deleting…"
                      : confirmPath === file.path
                        ? "Confirm delete?"
                        : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
