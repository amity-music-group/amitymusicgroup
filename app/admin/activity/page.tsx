import { requireAdmin } from "@/lib/admin-session";
import { getActivityLog } from "@/lib/admin-data";

export const metadata = {
  title: "Activity | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default async function AdminActivityPage() {
  await requireAdmin("/admin/activity");
  const entries = await getActivityLog(100);

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Activity</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
        A record of saves, sends and deletes made in the admin portal.
      </p>

      {entries.length === 0 ? (
        <p className="mt-8 rounded-xl border border-white/15 bg-[#241443] p-6 text-sm leading-7 text-white/65">
          No admin activity recorded yet — saves, sends and deletes will
          appear here once the beefy-admin migration has run.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/15 bg-[#241443]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Action</th>
                <th className="px-5 py-4">Record type</th>
                <th className="px-5 py-4">Detail</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-white/10 text-white/80 last:border-0"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-5 py-4">{entry.action || "—"}</td>
                  <td className="px-5 py-4">{entry.recordType || "—"}</td>
                  <td className="px-5 py-4 text-white">
                    {entry.detail || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
