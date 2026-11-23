import { requireAdmin } from "@/lib/admin-session";
import { getSiteSettings } from "@/lib/content";
import SettingsEditor from "@/components/admin/SettingsEditor";

export const metadata = {
  title: "Site Settings | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  await requireAdmin("/admin/settings");
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Site settings</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
        The words on the homepage, About page and contact section, plus the
        contact email and social links. Leave a social link blank to hide
        it.
      </p>
      <div className="mt-8">
        <SettingsEditor initial={settings} />
      </div>
    </div>
  );
}
