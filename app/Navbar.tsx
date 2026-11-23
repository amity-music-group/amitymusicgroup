"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Artists", href: "/artists" },
  { label: "Companies", href: "/companies" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  // The admin portal has its own navigation — the public menu never
  // renders there.
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/85 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
        <Link
          href="/"
          aria-label="Amity Music Group home"
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src="/amity-logo.jpg"
            alt="Amity Music Group logo"
            className="h-9 w-9 object-cover"
          />
          <span className="whitespace-nowrap font-display text-sm uppercase tracking-[0.18em]">
            Amity Music Group
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex items-center gap-5 overflow-x-auto whitespace-nowrap lg:gap-7"
        >
          {navLinks.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-white ${
                  active ? "text-[#D7FF38]" : "text-white/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
