import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Companies", href: "/companies" },
  { label: "Artists", href: "/artists" },
];

const exploreLinks = [
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Home", href: "/" },
];

/** Shared public footer — black, UMG-style: wordmark, subscribe,
    link columns, tiny legal line. */
export default function Footer({
  footerText = "A music-focused organization and connected music ecosystem.",
  tagline = "Independent Culture. Major Sound.",
}: {
  footerText?: string;
  tagline?: string;
}) {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20 lg:px-8">
        <div className="grid gap-14 border-b border-white/10 pb-14 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-6xl font-light leading-none tracking-tight sm:text-7xl lg:text-8xl">
              Amity
            </p>
            <p className="mt-2 text-3xl font-light leading-none tracking-tight text-white/50 sm:text-4xl">
              Music Group
            </p>
            <p className="mt-8 max-w-sm text-sm leading-7 text-white/60">
              {footerText}
            </p>
            <p className="mt-3 text-sm text-white/60">{tagline}</p>
          </div>

          <div className="w-full max-w-md">
            <NewsletterSignup />
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2">
          <div>
            <p className="text-base text-white">Company</p>
            <nav
              aria-label="Footer company links"
              className="mt-4 flex flex-col items-start gap-3 text-sm text-white/60"
            >
              {companyLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-base text-white">Explore</p>
            <nav
              aria-label="Footer explore links"
              className="mt-4 flex flex-col items-start gap-3 text-sm text-white/60"
            >
              {exploreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Amity Music Group. All rights reserved.</p>
          <p>{tagline}</p>
        </div>
      </div>
    </footer>
  );
}
