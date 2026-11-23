import { requireAdmin } from "@/lib/admin-session";
import { getInbox } from "@/lib/admin-data";
import InboxList from "@/components/admin/InboxList";

export const metadata = {
  title: "Inbox | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminInboxPage() {
  await requireAdmin("/admin/inbox");
  const messages = await getInbox();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Inbox</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
        Every message sent through the contact form. Messages are also
        emailed to the general contact address — this is the stored copy.
      </p>
      <div className="mt-8">
        <InboxList initial={messages} />
      </div>
    </div>
  );
}
