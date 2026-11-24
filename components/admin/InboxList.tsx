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
      <p className="rounded-xl border border-white/10 bg-[#171717] p-6 text-sm leading-7 text-neutral-400">
        No messages yet. Contact form submissions will appear here as soon
        as someone writes in.
      </p>
    );
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-4 text-sm text-white">
          {error}
        </p>
      ) : null}
      <div className="space-y-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-xl border p-6 ${
              message.read
                ? "border-white/10 bg-[#171717]"
                : "border-white/30 bg-[#171717]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  {message.subject}{" "}
                  {!message.read ? (
                    <span className="ml-2 rounded-full bg-[#171717] px-2 py-0.5 text-[10px] font-bold text-black">
                      NEW
                    </span>
                  ) : null}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {message.name} ·{" "}
                  <a
                    href={`mailto:${message.email}`}
                    className="text-white hover:underline"
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
                  className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-white hover:text-white"
                >
                  {message.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  type="button"
                  onClick={() => act(message.id, "delete")}
                  className="rounded-md border border-white/60 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white hover:text-black"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/80">
              {message.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
