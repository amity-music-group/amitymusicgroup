"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#4922EB] text-white border-b border-white/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Amity Music Group
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-opacity hover:opacity-75">
            Home
          </Link>

          <Link
            href="/companies"
            className="transition-opacity hover:opacity-75"
          >
            Companies
          </Link>

          <Link
            href="/about"
            className="transition-opacity hover:opacity-75"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition-opacity hover:opacity-75"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}