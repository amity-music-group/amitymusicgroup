"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/strip", label: "Logo Strip" },
  { href: "/admin/territories", label: "Territories" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/email-history", label: "Email History" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/admins", label: "Admins" },
];

/**
 * Admin navigation — two different layouts by screen size, by
 * design, not a shrunk desktop bar.
 *
 * Desktop (md and up): two rows. Row one is the wordmark on the
 * left and View site / account / Sign out on the right. Row two is
 * a horizontal pill nav — the current section is a black pill with
 * white text, the rest grey text on white.
 *
 * Phone: a compact top bar (brand + log out only) and a fixed
 * bottom navigation bar — thumb-reachable, horizontally
 * scrollable, every link at least 56px tall. The page shell
 * (app/admin/layout.tsx) adds bottom padding on phones so the
 * bottom bar never covers content or the save buttons.
 */
export default function AdminNav({ sessionName }: { sessionName: string }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop header — two rows */}
      <header className="hidden border-b border-black/10 bg-white md:block">
        <div className="mx-auto max-w-6xl px-6 pt-5 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/admin"
              className="text-sm font-bold tracking-[0.2em] text-[#111111]"
            >
              AMITY MUSIC GROUP{" "}
              <span className="text-neutral-500">ADMIN</span>
            </Link>

            <div className="flex flex-wrap items-center gap-5 text-sm">
              <Link
                href="/"
                className="text-neutral-600 transition hover:text-black"
              >
                View site ↗
              </Link>
              <span className="text-xs text-neutral-500">{sessionName}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-11 rounded-full border border-black/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:border-black"
              >
                Sign out
              </button>
            </div>
          </div>

          <nav
            aria-label="Admin navigation"
            className="mt-4 flex flex-wrap gap-2"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive(link.href)
                    ? "bg-[#111111] font-bold text-white"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Phone top bar — brand and log out only */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white md:hidden">
        <div className="flex min-h-14 items-center justify-between gap-4 px-4">
          <Link
            href="/admin"
            className="text-sm font-bold tracking-[0.2em] text-[#111111]"
          >
            AMITY MUSIC GROUP{" "}
            <span className="text-neutral-500">ADMIN</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="max-w-32 truncate text-xs text-neutral-500">
              {sessionName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-11 items-center rounded-full border border-black/20 px-4 text-xs font-bold uppercase tracking-wider text-[#111111]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Phone bottom navigation */}
      <nav
        aria-label="Admin navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white md:hidden"
      >
        <div className="flex overflow-x-auto">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex min-h-14 shrink-0 items-center border-t-2 px-4 text-sm whitespace-nowrap ${
                isActive(link.href)
                  ? "border-black font-bold text-black"
                  : "border-transparent text-neutral-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
