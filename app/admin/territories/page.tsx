import { requireAdmin } from "@/lib/admin-session";
import { getAllTerritories } from "@/lib/content";
import TerritoriesEditor from "@/components/admin/TerritoriesEditor";

export const metadata = {
  title: "Territories | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminTerritoriesPage() {
  await requireAdmin("/admin/territories");
  const territories = await getAllTerritories();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Territories</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
        The places Amity Music Group works, shown as the Global Territories
        section on the public Companies page, grouped by region. The
        section stays hidden on the site until at least one visible
        territory is saved — hidden territories stay here so they can be
        edited or shown again, and hiding never deletes.
      </p>
      <div className="mt-8">
        <TerritoriesEditor initial={territories} />
      </div>
    </div>
  );
}
