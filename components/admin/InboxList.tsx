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
      <p className="rounded-xl border border-white/15 bg-[#241443] p-6 text-sm leading-7 text-white/65">
        No messages yet. Contact form submissions will appear here as soon
        as someone writes in.
      </p>
    );
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-4 text-sm text-[#F32991]">
          {error}
        </p>
      ) : null}
      <div className="space-y-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-xl border p-6 ${
              message.read
                ? "border-white/15 bg-[#241443]"
                : "border-[#D7FF38]/50 bg-[#241443]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  {message.subject}{" "}
                  {!message.read ? (
                    <span className="ml-2 rounded-full bg-[#D7FF38] px-2 py-0.5 text-[10px] font-bold text-[#160D2C]">
                      NEW
                    </span>
                  ) : null}
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  {message.name} ·{" "}
                  <a
                    href={`mailto:${message.email}`}
                    className="text-[#D7FF38] hover:underline"
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
                  className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
                >
                  {message.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  type="button"
                  onClick={() => act(message.id, "delete")}
                  className="rounded-md border border-[#F32991]/60 px-3 py-1.5 text-xs font-bold text-[#F32991] transition hover:bg-[#F32991] hover:text-white"
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
