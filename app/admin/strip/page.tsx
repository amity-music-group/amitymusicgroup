import { requireAdmin } from "@/lib/admin-session";
import { getAllStripItems, getSiteSettings } from "@/lib/content";
import StripEditor from "@/components/admin/StripEditor";

export const metadata = {
  title: "Logo Strip | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminStripPage() {
  await requireAdmin("/admin/strip");
  const [items, settings] = await Promise.all([
    getAllStripItems(),
    getSiteSettings(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Logo strip</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
        The moving logos at the top of the public /labels page. Add a
        logo, change one, hide one, reorder them, and set how fast they
        move. Hidden logos stay here so they can be shown again — hiding
        never deletes.
      </p>
      <div className="mt-8">
        <StripEditor
          initial={items}
          initialSpeed={settings.stripSpeedPxPerSec}
        />
      </div>
    </div>
  );
}
