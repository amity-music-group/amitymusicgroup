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
    <header className="fixed inset-x-0 top-6 z-50">
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
                className={`shrink-0 rounded-full px-3 py-1.5 text-[15px] transition-colors hover:text-black ${
                  active ? "bg-white font-medium text-black" : "text-black/60"
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
