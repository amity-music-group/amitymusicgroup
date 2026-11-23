import { requireAdmin } from "@/lib/admin-session";
import { getAllCompanies } from "@/lib/content";
import CompaniesEditor from "@/components/admin/CompaniesEditor";

export const metadata = {
  title: "Companies | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminCompaniesPage() {
  await requireAdmin("/admin/companies");
  const companies = await getAllCompanies();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Companies</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
        The companies of the Amity ecosystem, shown on the public Companies
        page. Hidden companies stay here so they can be edited or shown
        again — hiding never deletes.
      </p>
      <div className="mt-8">
        <CompaniesEditor initial={companies} />
      </div>
    </div>
  );
}
