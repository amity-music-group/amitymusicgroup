"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default function AdminNav({ sessionName }: { sessionName: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-white/10 bg-[#160D2C]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/admin"
          className="text-sm font-bold tracking-[0.2em] text-white"
        >
          AMITY <span className="text-[#D7FF38]">ADMIN</span>
        </Link>

        <nav
          aria-label="Admin navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/70 transition hover:text-[#D7FF38]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/50">{sessionName}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:border-[#F32991] hover:text-[#F32991]"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
