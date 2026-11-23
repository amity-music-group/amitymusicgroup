"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Artists", href: "/artists" },
  { label: "Companies", href: "/labels" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Public navigation — two different layouts by screen size.
 *
 * Desktop (md and up): UMG's floating pale-grey pill nav, as
 * before, unchanged.
 *
 * Phone: a compact fixed top bar (wordmark + a Menu button) that
 * opens a full-screen menu with large stacked links — not the
 * desktop pill shrunk down. Every link is at least 56px tall.
 * The admin portal has its own navigation — the public menu never
 * renders there.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin" || pathname?.startsWith("/admin/")) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop floating pill nav */}
      <header className="fixed inset-x-0 top-6 z-50 hidden md:block">
        <div className="mx-auto flex w-[calc(100%-2rem)] max-w-7xl items-center justify-between gap-4 rounded-2xl bg-[#e8e8e8]/95 px-6 py-3 backdrop-blur lg:px-8">
          <Link
            href="/"
            aria-label="Amity Music Group home"
            className="shrink-0 text-base font-semibold tracking-tight text-black"
          >
            Amity Music Group
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-1 overflow-x-auto whitespace-nowrap lg:gap-2"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[15px] transition-colors hover:text-black ${
                  isActive(item.href)
                    ? "bg-white font-medium text-black"
                    : "text-black/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Phone top bar */}
      <header className="fixed inset-x-0 top-0 z-50 md:hidden">
        <div className="flex min-h-14 items-center justify-between bg-[#e8e8e8]/95 px-4 backdrop-blur">
          <Link
            href="/"
            aria-label="Amity Music Group home"
            className="text-base font-semibold tracking-tight text-black"
            onClick={() => setOpen(false)}
          >
            Amity Music Group
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-black"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Phone full-screen menu */}
      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-white pt-20 md:hidden"
        >
          <nav aria-label="Main navigation" className="px-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-14 items-center justify-between border-b border-black/10 text-2xl font-light tracking-tight ${
                  isActive(item.href) ? "font-medium text-black" : "text-black/70"
                }`}
              >
                {item.label}
                <span aria-hidden="true" className="text-neutral-400">
                  →
                </span>
              </Link>
            ))}
          </nav>
          <p className="mt-8 px-4 text-sm text-neutral-500">
            Independent Culture. Major Sound.
          </p>
        </div>
      ) : null}
    </>
  );
}
