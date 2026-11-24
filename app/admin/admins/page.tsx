import { requireAdmin } from "@/lib/admin-session";
import { getAdminUsers } from "@/lib/content";
import AdminsEditor from "@/components/admin/AdminsEditor";

export const metadata = {
  title: "Admins | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminAdminsPage() {
  const session = await requireAdmin("/admin/admins");
  const admins = await getAdminUsers();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Admins</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
        The email addresses that can sign in to this admin portal. Add
        someone and they can sign in straight away; remove someone and
        their next visit is turned away. The ADMIN_EMAILS env var still
        counts as well, so an address listed there stays allowed even
        if it is removed here.
      </p>
      <AdminsEditor initial={admins} currentEmail={session.email} />
    </div>
  );
}
