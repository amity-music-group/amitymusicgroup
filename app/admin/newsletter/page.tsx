import { requireAdmin } from "@/lib/admin-session";
import { getEmailLog, getSubscribers } from "@/lib/admin-data";
import NewsletterPanel from "@/components/admin/NewsletterPanel";

export const metadata = {
  title: "Newsletter | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  await requireAdmin("/admin/newsletter");
  const [subscribers, emailLog] = await Promise.all([
    getSubscribers(),
    getEmailLog(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Newsletter</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
        People who signed up in the site footer, and the email blasts sent
        to them. Blasts send from Amity Music Group via Resend.
      </p>
      <div className="mt-8">
        <NewsletterPanel
          initialSubscribers={subscribers}
          initialLog={emailLog}
        />
      </div>
    </div>
  );
}
