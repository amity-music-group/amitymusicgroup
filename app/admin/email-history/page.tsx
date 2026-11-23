import { requireAdmin } from "@/lib/admin-session";
import { getEmailLog } from "@/lib/admin-data";

export const metadata = {
  title: "Email history | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default async function AdminEmailHistoryPage() {
  await requireAdmin("/admin/email-history");
  const entries = await getEmailLog(100);

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Email history</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
        Every email sent from the admin — newsletter blasts and welcome
        emails.
      </p>

      {entries.length === 0 ? (
        <p className="mt-8 rounded-xl border border-black/10 bg-[#f5f5f5] p-6 text-sm leading-7 text-neutral-600">
          No emails sent yet. Blasts sent from the newsletter section are
          logged here.
        </p>
      ) : (
        <>
          {/* Phone: stacked cards, one per entry — no sideways scroll. */}
          <ul className="mt-8 space-y-3 md:hidden">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-black/10 bg-[#f5f5f5] p-4 text-sm"
              >
                <p className="font-bold text-[#111111]">
                  {entry.subject || "(no subject)"}
                </p>
                <p className="mt-1 text-neutral-600">
                  {entry.kind} · {entry.recipientCount} recipients ·{" "}
                  {entry.status}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {formatDate(entry.createdAt)}
                </p>
              </li>
            ))}
          </ul>
          {/* Desktop: table. */}
          <div className="mt-8 hidden overflow-x-auto rounded-xl border border-black/10 bg-[#f5f5f5] md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Recipients</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-black/10 text-[#111111]/80 last:border-0"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-5 py-4">{entry.kind || "—"}</td>
                  <td className="px-5 py-4 font-bold text-[#111111]">
                    {entry.subject || "—"}
                  </td>
                  <td className="px-5 py-4">{entry.recipientCount}</td>
                  <td className="px-5 py-4">{entry.status || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
}
