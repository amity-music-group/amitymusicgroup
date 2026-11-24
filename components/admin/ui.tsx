/**
 * Shared form controls for the /admin editors. Dark admin, Amity
 * monochrome: near-black surfaces, white text, muted grey
 * secondary text, hairline white borders — no colour accents.
 * Inputs are at least 48px tall so they are comfortable touch
 * targets on phones.
 */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs leading-5 text-neutral-400">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-white/15 bg-[#0a0a0a] px-3 py-3 text-base text-white placeholder:text-neutral-500 outline-none transition focus:border-white sm:text-sm";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-white" : "bg-white/20"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
          checked ? "left-[22px] bg-black" : "left-0.5 bg-white"
        }`}
      />
    </button>
  );
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function newId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
