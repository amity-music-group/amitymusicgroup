import { requireAdmin } from "@/lib/admin-session";
import { getAllServices } from "@/lib/content";
import ServicesEditor from "@/components/admin/ServicesEditor";

export const metadata = {
  title: "Services | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  await requireAdmin("/admin/services");
  const services = await getAllServices();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Services</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
        The service cards on the public Services page. The homepage shows
        the first six visible services as its focus areas.
      </p>
      <div className="mt-8">
        <ServicesEditor initial={services} />
      </div>
    </div>
  );
}
