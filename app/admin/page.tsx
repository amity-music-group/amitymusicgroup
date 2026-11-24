import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase-auth";
import { getSiteSettings, getSupabaseStatus } from "@/lib/content";
import {
  getAdminStats,
  getEmailLog,
  getInbox,
  getRecentActivity,
} from "@/lib/admin-data";

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
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login?next=/admin");
  }

  const [site, supabase, stats, inbox, emailLog, activity] =
    await Promise.all([
      getSiteSettings(),
      getSupabaseStatus(),
      getAdminStats(),
      getInbox(5),
      getEmailLog(5),
      getRecentActivity(10),
    ]);

  const cards = [
    {
      label: "Artists",
      count: stats.artists,
      href: "/admin/artists",
      description: "The roster on the Artists page.",
    },
    {
      label: "Companies",
      count: stats.companies,
      href: "/admin/companies",
      description: "The companies on the /labels page.",
    },
    {
      label: "Services",
      count: stats.services,
      href: "/admin/services",
      description: "The service cards on the Services page.",
    },
    {
      label: "Territories",
      count: stats.territories,
      href: "/admin/territories",
      description: "The places in the Global Territories section.",
    },
    {
      label: "Releases",
      count: stats.releases,
      href: "/admin/artists",
      description: "Releases listed under each artist.",
    },
    {
      label: "Subscribers",
      count: stats.subscribers,
      href: "/admin/newsletter",
      description: "People signed up in the site footer.",
    },
    {
      label: "Unread messages",
      count: stats.unreadMessages,
      href: "/admin/inbox",
      description: "Contact form messages waiting to be read.",
    },
    {
      label: "Email sends",
      count: stats.emailSends,
      href: "/admin/email-history",
      description: "Newsletter blasts and welcome emails sent.",
    },
  ];

  const quickLinks = [
    { label: "Add an artist", href: "/admin/artists" },
    { label: "Add a company", href: "/admin/companies" },
    { label: "Upload media", href: "/admin/media" },
    { label: "Send a blast", href: "/admin/newsletter" },
    { label: "Edit site settings", href: "/admin/settings" },
    { label: "Manage admins", href: "/admin/admins" },
  ];

  const kindLabels: Record<string, string> = {
    edit: "Edit",
    message: "Message",
    subscriber: "Subscriber",
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white">
            Amity Music Group <span className="text-neutral-500">Admin</span>
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Admin dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
            Signed in as {user.email}. Changes go live on
            amitymusicgroup.com as soon as you save.
          </p>
        </div>

        <div
          className={`rounded-full border px-4 py-2 text-xs font-bold ${
            supabase.connected
              ? "border-white/30 text-white"
              : "border-white/20 text-neutral-400"
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
        <div className="mt-8 rounded-xl border border-white/30 bg-[#171717] p-6 text-sm leading-7 text-white/85">
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

      <section className="mt-10">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          Quick links
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          On the site
        </h2>
        {/* Phone: stacked single-column cards. Desktop: 2, then 4 across. */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 transition hover:border-white/40"
            >
              <p className="text-3xl font-black text-white">{card.count}</p>
              <p className="mt-2 text-sm font-bold text-white">
                {card.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-white/10 bg-[#171717] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            Recent changes
          </h2>
          <Link
            href="/admin/activity"
            className="text-xs font-bold uppercase tracking-wider text-white hover:text-neutral-300"
          >
            See all →
          </Link>
        </div>
        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-400">
            No activity yet — saves, sends and new signups will show up here.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activity.map((item) => (
              <li
                key={item.id}
                className="border-b border-white/10 pb-3 text-sm last:border-0"
              >
                <p className="font-bold text-white">
                  <span className="mr-2 rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {kindLabels[item.kind] ?? item.kind}
                  </span>
                  {item.label}
                </p>
                <p className="mt-1 text-neutral-400">
                  {item.detail}
                  {item.createdAt ? (
                    <> · {new Date(item.createdAt).toLocaleString()}</>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-[#171717] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Latest messages</h2>
            <Link
              href="/admin/inbox"
              className="text-xs font-bold uppercase tracking-wider text-white hover:text-neutral-300"
            >
              Open inbox →
            </Link>
          </div>
          {inbox.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">
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
                      <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black">
                        NEW
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-neutral-400">
                    {message.name} · {message.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#171717] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Recent email sends
            </h2>
            <Link
              href="/admin/newsletter"
              className="text-xs font-bold uppercase tracking-wider text-white hover:text-neutral-300"
            >
              Newsletter →
            </Link>
          </div>
          {emailLog.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">
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
                  <p className="mt-1 text-neutral-400">
                    {entry.kind} · {entry.recipientCount} recipients ·{" "}
                    {entry.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-white/10 bg-[#171717] p-6">
        <h2 className="text-lg font-bold text-white">Site settings</h2>
        <p className="mt-2 text-sm leading-7 text-neutral-400">
          Tagline: <span className="text-white">{site.tagline}</span>
          <br />
          Contact email:{" "}
          <span className="text-white">{site.emailGeneral}</span>
        </p>
        <Link
          href="/admin/settings"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-neutral-300"
        >
          Edit site settings →
        </Link>
      </section>
    </div>
  );
}
