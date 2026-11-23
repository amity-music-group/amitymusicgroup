import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
import {
  getAllArtists,
  getAllCompanies,
  getAllServices,
  getSiteSettings,
  getSupabaseStatus,
} from "@/lib/content";
import { getEmailLog, getInbox, getSubscribers } from "@/lib/admin-data";

export const metadata = {
  title: "Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

/**
 * Staff-only dashboard. The proxy already blocks unauthenticated
 * visits; this server check is a second layer so the page never
 * renders without a valid session, even if the proxy is bypassed.
 */
export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = getAdminSession(token);
  if (!session) {
    redirect("/admin/login?next=/admin");
  }

  const [site, artists, companies, services, supabase, inbox, subscribers, emailLog] =
    await Promise.all([
      getSiteSettings(),
      getAllArtists(),
      getAllCompanies(),
      getAllServices(),
      getSupabaseStatus(),
      getInbox(5),
      getSubscribers(),
      getEmailLog(5),
    ]);

  const unread = inbox.filter((m) => !m.read).length;
  const subscribedCount = subscribers.filter(
    (s) => s.status === "subscribed",
  ).length;

  const cards = [
    { label: "Artists", count: artists.length, href: "/admin/artists" },
    { label: "Companies", count: companies.length, href: "/admin/companies" },
    { label: "Services", count: services.length, href: "/admin/services" },
    { label: "Unread messages", count: unread, href: "/admin/inbox" },
    { label: "Subscribers", count: subscribedCount, href: "/admin/newsletter" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
            Amity Music Group
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Admin dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
            Edit the artists, companies, services and site copy. Saves go
            live on the site within seconds — no redeploy.
          </p>
        </div>

        <div
          className={`rounded-full border px-4 py-2 text-xs font-bold ${
            supabase.connected
              ? "border-[#D7FF38]/50 text-[#D7FF38]"
              : "border-white/25 text-white/60"
          }`}
        >
          {supabase.connected
            ? "Supabase connected"
            : supabase.configured
              ? `Supabase not connected${supabase.error ? ` — ${supabase.error}` : ""}`
              : "Supabase not configured — showing static copy"}
        </div>
      </div>

      {!supabase.configured ? (
        <div className="mt-8 rounded-xl border border-[#F32991]/50 bg-[#F32991]/10 p-6 text-sm leading-7 text-white/85">
          <p className="font-bold text-white">
            Finish the setup: set the Supabase keys in Vercel.
          </p>
          <p className="mt-2">
            The admin saves to Supabase, and the public pages read from it.
            Until NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and
            SUPABASE_SERVICE_ROLE_KEY are set (and the migration in
            supabase/amity-admin-migration.sql has run), the site keeps
            showing its static copy and admin saves will fail. See the
            README for the exact steps.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-white/15 bg-[#241443] p-5 transition hover:border-[#D7FF38]/70"
          >
            <p className="text-3xl font-black text-white">{card.count}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-white/15 bg-[#241443] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Latest messages</h2>
            <Link
              href="/admin/inbox"
              className="text-xs font-bold uppercase tracking-wider text-[#D7FF38] hover:text-[#F32991]"
            >
              Open inbox →
            </Link>
          </div>
          {inbox.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">
              No messages yet. Contact form submissions will appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {inbox.map((message) => (
                <li
                  key={message.id}
                  className="border-b border-white/10 pb-3 text-sm last:border-0"
                >
                  <p className="font-bold text-white">
                    {message.subject}{" "}
                    {!message.read ? (
                      <span className="ml-2 rounded-full bg-[#D7FF38] px-2 py-0.5 text-[10px] font-bold text-[#160D2C]">
                        NEW
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-white/55">
                    {message.name} · {message.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-white/15 bg-[#241443] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent email sends</h2>
            <Link
              href="/admin/newsletter"
              className="text-xs font-bold uppercase tracking-wider text-[#D7FF38] hover:text-[#F32991]"
            >
              Newsletter →
            </Link>
          </div>
          {emailLog.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">
              No emails sent yet. Blasts sent from the newsletter section
              are logged here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {emailLog.map((entry) => (
                <li
                  key={entry.id}
                  className="border-b border-white/10 pb-3 text-sm last:border-0"
                >
                  <p className="font-bold text-white">{entry.subject}</p>
                  <p className="mt-1 text-white/55">
                    {entry.kind} · {entry.recipientCount} recipients ·{" "}
                    {entry.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-white/15 bg-[#241443] p-6">
        <h2 className="text-lg font-bold">Site settings</h2>
        <p className="mt-2 text-sm leading-7 text-white/65">
          Tagline: <span className="text-white">{site.tagline}</span>
          <br />
          Contact email: <span className="text-white">{site.emailGeneral}</span>
        </p>
        <Link
          href="/admin/settings"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D7FF38] hover:text-[#F32991]"
        >
          Edit site settings →
        </Link>
      </section>
    </div>
  );
}
