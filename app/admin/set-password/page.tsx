import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase-auth";
import SetPasswordForm from "@/components/admin/SetPasswordForm";

export const metadata = {
  title: "Set password | Amity Music Group",
  robots: { index: false, follow: false },
};

/**
 * Set (or change) your admin password. Reached from the password
 * reset email, which signs you in first, or from the "Change
 * password" link in the admin header.
 */
export default async function SetPasswordPage() {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login?next=/admin/set-password");
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#111111]">
        Amity Music Group <span className="text-neutral-500">Admin</span>
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight">
        Set your password
      </h1>
      <p className="mt-3 text-sm leading-7 text-neutral-600">
        Signed in as {user.email}. Choose a new password of at least 8
        characters.
      </p>

      <div className="mt-8 rounded-xl border border-black/10 bg-[#f5f5f5] p-6">
        <SetPasswordForm />
      </div>
    </div>
  );
}
