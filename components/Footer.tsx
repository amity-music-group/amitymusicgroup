import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Artists", href: "/artists" },
  { label: "Companies", href: "/companies" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Shared public footer — logo, wordmark, tagline, nav, newsletter, legal. */
export default function Footer({
  footerText = "A music-focused organization and connected music ecosystem.",
  tagline = "Independent Culture. Major Sound.",
}: {
  footerText?: string;
  tagline?: string;
}) {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-8">
        {/* Giant outlined wordmark */}
        <div
          aria-hidden="true"
          className="select-none overflow-hidden border-b border-white/10 pb-10"
        >
          <p className="font-display text-[22vw] uppercase leading-[0.85] tracking-[0.01em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)] sm:text-[15vw] lg:text-[11rem]">
            Amity
          </p>
          <p className="font-display text-[11vw] uppercase leading-[0.9] tracking-[0.01em] text-white sm:text-[7.5vw] lg:text-[5.5rem]">
            Music Group
          </p>
        </div>

        <div className="grid gap-12 py-12 md:grid-cols-[1.2fr_0.8fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/amity-logo.jpg"
                alt="Amity Music Group logo"
                className="h-10 w-10 object-cover"
              />
              <span className="font-display text-sm uppercase tracking-[0.2em]">
                Amity Music Group
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
              {footerText}
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
              {tagline}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-col items-start gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60"
          >
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[#D7FF38]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div>
            <NewsletterSignup />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Amity Music Group. All rights reserved.</p>
          <p className="flex items-center gap-2 uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 bg-[#F32991]" />
            Independent Culture. Major Sound.
          </p>
        </div>
      </div>
    </footer>
  );
}
