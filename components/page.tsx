
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Our Approach", href: "/approach" },
  { label: "Companies", href: "/companies" },
  { label: "Artists", href: "/artists" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#4922EB]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link
          href="/"
          aria-label="Amity Music Group home"
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src="/amity-logo.jpg"
            alt="Amity Music Group logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="text-sm font-bold tracking-[0.2em]">
            AMITY
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex w-full flex-wrap items-center gap-x-5 gap-y-3 md:w-auto md:gap-6"
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
                className={`text-sm transition hover:text-[#D7FF38] ${
                  active
                    ? "font-semibold text-[#D7FF38]"
                    : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/contact"
            className="bg-[#D7FF38] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </header>
  );
}
