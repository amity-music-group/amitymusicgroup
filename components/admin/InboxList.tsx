"use client";

import { useState } from "react";
import type { ContactSubmission } from "@/lib/types";

export default function InboxList({
  initial,
}: {
  initial: ContactSubmission[];
}) {
  const [messages, setMessages] = useState<ContactSubmission[]>(initial);
  const [error, setError] = useState("");

  async function act(
    id: string,
    action: "read" | "unread" | "delete",
  ) {
    setError("");
    try {
      const response = await fetch("/api/admin/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(
          typeof body?.error === "string" ? body.error : "That didn't work.",
        );
        return;
      }
      setMessages((current) =>
        action === "delete"
          ? current.filter((m) => m.id !== id)
          : current.map((m) =>
              m.id === id ? { ...m, read: action === "read" } : m,
            ),
      );
    } catch {
      setError("That didn't work. Please try again.");
    }
  }

  if (messages.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6 text-sm leading-7 text-neutral-600">
        No messages yet. Contact form submissions will appear here as soon
        as someone writes in.
      </p>
    );
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-4 text-sm text-[#111111]">
          {error}
        </p>
      ) : null}
      <div className="space-y-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-xl border p-6 ${
              message.read
                ? "border-black/10 bg-[#f5f5f5]"
                : "border-black/30 bg-[#f5f5f5]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  {message.subject}{" "}
                  {!message.read ? (
                    <span className="ml-2 rounded-full bg-[#111111] px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  ) : null}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {message.name} ·{" "}
                  <a
                    href={`mailto:${message.email}`}
                    className="text-[#111111] hover:underline"
                  >
                    {message.email}
                  </a>{" "}
                  · {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => act(message.id, message.read ? "unread" : "read")}
                  className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-bold text-[#111111]/70 transition hover:border-black hover:text-black"
                >
                  {message.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  type="button"
                  onClick={() => act(message.id, "delete")}
                  className="rounded-md border border-black/60 px-3 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-black hover:text-[#111111]"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#111111]/80">
              {message.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
