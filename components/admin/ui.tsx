/**
 * Shared form controls for the /admin editors. Amity brand: dark
 * purple surfaces, lime primary actions, pink for danger.
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
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-white/60">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs leading-5 text-white/40">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-white/20 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#D7FF38]";

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
        checked ? "bg-[#D7FF38]" : "bg-white/20"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
          checked ? "left-[22px]" : "left-0.5"
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
