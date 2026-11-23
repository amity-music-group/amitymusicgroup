"use client";

import { FormEvent, useState } from "react";
import type { EmailLogEntry, Subscriber } from "@/lib/types";
import { Field, inputClass } from "./ui";

export default function NewsletterPanel({
  initialSubscribers,
  initialLog,
}: {
  initialSubscribers: Subscriber[];
  initialLog: EmailLogEntry[];
}) {
  const [subscribers, setSubscribers] =
    useState<Subscriber[]>(initialSubscribers);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sendStatus, setSendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [sendResult, setSendResult] = useState("");
  const [error, setError] = useState("");

  const subscribed = subscribers.filter((s) => s.status === "subscribed");

  async function sendBlast(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setSendStatus("sending");
    setSendResult("");
    setError("");
    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", subject, message }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof body?.error === "string" ? body.error : "Send failed.",
        );
        setSendStatus("error");
        return;
      }
      setSendResult(
        `Sent to ${body.sent ?? 0} subscriber${(body.sent ?? 0) === 1 ? "" : "s"}${body.failed ? ` — ${body.failed} failed.` : "."}`,
      );
      setSendStatus("sent");
      setSubject("");
      setMessage("");
      setConfirming(false);
    } catch {
      setError("Send failed. Please try again.");
      setSendStatus("error");
    }
  }

  async function removeSubscriber(id: string) {
    setError("");
    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(
          typeof body?.error === "string" ? body.error : "That didn't work.",
        );
        return;
      }
      setSubscribers((current) => current.filter((s) => s.id !== id));
    } catch {
      setError("That didn't work. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <h2 className="text-lg font-bold">Send a blast</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Sends to {subscribed.length} subscribed{" "}
          {subscribed.length === 1 ? "person" : "people"}. Every email
          includes an unsubscribe link.
        </p>
        <form onSubmit={sendBlast} className="mt-5 grid gap-4">
          <Field label="Subject">
            <input
              className={inputClass}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
            />
          </Field>
          <Field
            label="Message"
            hint="Plain text. Blank line between paragraphs."
          >
            <textarea
              className={`${inputClass} min-h-40 resize-y`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the email…"
              required
            />
          </Field>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={sendStatus === "sending" || subscribed.length === 0}
              className="rounded-md bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black hover:text-white disabled:opacity-50"
            >
              {sendStatus === "sending"
                ? "Sending…"
                : confirming
                  ? `Send to ${subscribed.length} — click again to confirm`
                  : "Send blast"}
            </button>
            {confirming ? (
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-sm font-bold text-neutral-600 hover:text-[#111111]"
              >
                Cancel
              </button>
            ) : null}
            {sendStatus === "sent" ? (
              <p className="text-sm font-bold text-[#111111]">{sendResult}</p>
            ) : null}
            {sendStatus === "error" ? (
              <p role="alert" className="text-sm text-[#111111]">
                {error}
              </p>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <h2 className="text-lg font-bold">
          Subscribers ({subscribed.length} subscribed, {subscribers.length}{" "}
          total)
        </h2>
        {subscribers.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No signups yet. The signup form in the site footer adds people
            here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {subscribers.map((subscriber) => (
              <li
                key={subscriber.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <span>
                  <span className="text-[#111111]">{subscriber.email}</span>{" "}
                  <span
                    className={
                      subscriber.status === "subscribed"
                        ? "text-[#111111]"
                        : "text-[#111111]/45"
                    }
                  >
                    · {subscriber.status}
                  </span>{" "}
                  <span className="text-neutral-400">
                    · {new Date(subscriber.createdAt).toLocaleDateString()}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => removeSubscriber(subscriber.id)}
                  className="rounded-md border border-black/60 px-3 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-black hover:text-[#111111]"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <h2 className="text-lg font-bold">Recent sends</h2>
        {initialLog.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">No emails sent yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {initialLog.map((entry) => (
              <li key={entry.id} className="py-3 text-sm">
                <p className="font-bold text-[#111111]">{entry.subject}</p>
                <p className="mt-1 text-neutral-500">
                  {entry.kind} · {entry.recipientCount} recipients ·{" "}
                  {entry.status} ·{" "}
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
