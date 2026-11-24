"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { Field, inputClass } from "./ui";

const GROUPS: {
  title: string;
  hint?: string;
  fields: {
    key: keyof SiteSettings;
    label: string;
    textarea?: boolean;
    hint?: string;
  }[];
}[] = [
  {
    title: "Brand",
    fields: [
      { key: "tagline", label: "Tagline" },
      { key: "footerText", label: "Footer text" },
    ],
  },
  {
    title: "Homepage",
    fields: [
      {
        key: "heroSubcopy",
        label: "Hero subcopy",
        textarea: true,
        hint: "The paragraph under the big headline on the homepage.",
      },
      {
        key: "aboutIntro",
        label: "About intro",
        textarea: true,
        hint: "The large statement in the homepage About section.",
      },
      {
        key: "aboutBody",
        label: "About body",
        textarea: true,
        hint: "Blank line between paragraphs — each paragraph shows separately.",
      },
    ],
  },
  {
    title: "About page",
    fields: [
      {
        key: "aboutPageIntro",
        label: "Intro",
        textarea: true,
        hint: "The paragraph under the About hero headline.",
      },
      {
        key: "aboutPageBody",
        label: "Who we are",
        textarea: true,
        hint: "Blank line between paragraphs.",
      },
      { key: "missionTitle", label: "Mission title" },
      {
        key: "missionBody",
        label: "Mission body",
        textarea: true,
      },
    ],
  },
  {
    title: "Contact",
    fields: [
      {
        key: "contactIntro",
        label: "Contact intro",
        textarea: true,
        hint: "Shown on the homepage contact section.",
      },
      { key: "emailGeneral", label: "General email" },
    ],
  },
  {
    title: "Social links",
    hint: "Leave blank to hide a link. Enter full URLs (https://…).",
    fields: [
      { key: "instagram", label: "Instagram" },
      { key: "facebook", label: "Facebook" },
      { key: "tiktok", label: "TikTok" },
      { key: "youtube", label: "YouTube" },
    ],
  },
  {
    title: "SEO",
    fields: [
      {
        key: "seoTitle",
        label: "SEO title",
        hint: "Browser tab title. Leave blank to use the site name.",
      },
      {
        key: "seoDescription",
        label: "SEO description",
        textarea: true,
        hint: "Shown in search results. Leave blank for the default.",
      },
    ],
  },
];

export default function SettingsEditor({
  initial,
}: {
  initial: SiteSettings;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  function update(key: keyof SiteSettings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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
      <div className="space-y-6">
        {GROUPS.map((group) => (
          <section
            key={group.title}
            className="rounded-xl border border-white/10 bg-[#171717] p-6"
          >
            <h2 className="text-lg font-bold">{group.title}</h2>
            {group.hint ? (
              <p className="mt-1 text-sm text-neutral-500">{group.hint}</p>
            ) : null}
            <div className="mt-5 grid gap-4">
              {group.fields.map((field) => (
                <Field key={field.key} label={field.label} hint={field.hint}>
                  {field.textarea ? (
                    <textarea
                      className={`${inputClass} min-h-24 resize-y`}
                      value={settings[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                    />
                  ) : (
                    <input
                      className={inputClass}
                      value={settings[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                    />
                  )}
                </Field>
              ))}
            </div>
            {group.title === "Homepage" ? (
              <div className="mt-4">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Homepage hero image
                </span>
                <ImageUpload
                  value={settings.heroImage}
                  onChange={(heroImage) => update("heroImage", heroImage)}
                  kind="site"
                  slug="hero"
                />
                <span className="mt-1 block text-xs leading-5 text-neutral-400">
                  Becomes the full-bleed homepage hero background. Leave
                  blank to keep the current hero.
                </span>
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-[#171717] px-6 py-3 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save settings"}
        </button>
        {status === "saved" ? (
          <p className="text-sm font-bold text-white">
            Saved — live on the site now.
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="text-sm text-white">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
