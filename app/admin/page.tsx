import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
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
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = getAdminSession(token);
  if (!session) {
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
    { label: "Artists", count: stats.artists, href: "/admin/artists" },
    { label: "Companies", count: stats.companies, href: "/admin/companies" },
    { label: "Services", count: stats.services, href: "/admin/services" },
    { label: "Territories", count: stats.territories, href: "/admin/territories" },
    { label: "Releases", count: stats.releases, href: "/admin/artists" },
    { label: "Subscribers", count: stats.subscribers, href: "/admin/newsletter" },
    { label: "Unread messages", count: stats.unreadMessages, href: "/admin/inbox" },
    { label: "Email sends", count: stats.emailSends, href: "/admin/email-history" },
  ];

  const quickActions = [
    { label: "Artists", href: "/admin/artists" },
    { label: "Companies", href: "/admin/companies" },
    { label: "Media library", href: "/admin/media" },
    { label: "Send a blast", href: "/admin/newsletter" },
    { label: "Inbox", href: "/admin/inbox" },
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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#111111]">
            Amity Music Group
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Admin dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
            Edit the artists, companies, services and site copy. Saves go
            live on the site within seconds — no redeploy.
          </p>
        </div>

        <div
          className={`rounded-full border px-4 py-2 text-xs font-bold ${
            supabase.connected
              ? "border-black/30 text-[#111111]"
              : "border-black/20 text-neutral-600"
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
        <div className="mt-8 rounded-xl border border-black/30 bg-[#f5f5f5] p-6 text-sm leading-7 text-[#111111]/85">
          <p className="font-bold text-[#111111]">
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

      {/* Phone: stacked single-column cards. Desktop: 2, then 4 across. */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex min-h-20 items-center justify-between rounded-xl border border-black/10 bg-[#f5f5f5] p-5 transition hover:border-black/40 sm:block"
          >
            <p className="text-3xl font-black text-[#111111]">{card.count}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-600">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent activity</h2>
          <Link
            href="/admin/activity"
            className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-black"
          >
            Full activity log →
          </Link>
        </div>
        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No activity yet — saves, sends and new signups will show up here.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activity.map((item) => (
              <li
                key={item.id}
                className="border-b border-black/10 pb-3 text-sm last:border-0"
              >
                <p className="font-bold text-[#111111]">
                  <span className="mr-2 rounded-full border border-black/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    {kindLabels[item.kind] ?? item.kind}
                  </span>
                  {item.label}
                </p>
                <p className="mt-1 text-neutral-500">
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

      <section className="mt-8 rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <h2 className="text-lg font-bold">Quick actions</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex min-h-12 items-center justify-center rounded-md border border-black/20 px-5 py-2.5 text-sm font-bold text-[#111111] transition hover:border-black hover:text-black sm:w-auto"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Latest messages</h2>
            <Link
              href="/admin/inbox"
              className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-black"
            >
              Open inbox →
            </Link>
          </div>
          {inbox.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              No messages yet. Contact form submissions will appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {inbox.map((message) => (
                <li
                  key={message.id}
                  className="border-b border-black/10 pb-3 text-sm last:border-0"
                >
                  <p className="font-bold text-[#111111]">
                    {message.subject}{" "}
                    {!message.read ? (
                      <span className="ml-2 rounded-full bg-[#111111] px-2 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-neutral-500">
                    {message.name} · {message.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent email sends</h2>
            <Link
              href="/admin/newsletter"
              className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-black"
            >
              Newsletter →
            </Link>
          </div>
          {emailLog.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              No emails sent yet. Blasts sent from the newsletter section
              are logged here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {emailLog.map((entry) => (
                <li
                  key={entry.id}
                  className="border-b border-black/10 pb-3 text-sm last:border-0"
                >
                  <p className="font-bold text-[#111111]">{entry.subject}</p>
                  <p className="mt-1 text-neutral-500">
                    {entry.kind} · {entry.recipientCount} recipients ·{" "}
                    {entry.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <h2 className="text-lg font-bold">Site settings</h2>
        <p className="mt-2 text-sm leading-7 text-neutral-600">
          Tagline: <span className="text-[#111111]">{site.tagline}</span>
          <br />
          Contact email: <span className="text-[#111111]">{site.emailGeneral}</span>
        </p>
        <Link
          href="/admin/settings"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-black"
        >
          Edit site settings →
        </Link>
      </section>
    </div>
  );
}
