import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

/**
 * Admin shell. The navigation only renders when a valid session
 * exists — the login page (no session yet) renders without it.
 * Each admin page also checks the session itself and redirects to
 * /admin/login, so the shell never grants access on its own.
 */
export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = getAdminSession(token);

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      {session ? <AdminNav sessionName={session.name} /> : null}
      {/* Phone bottom nav is fixed, so the page needs bottom
          padding on phones (none on desktop) so it never covers
          content or the save buttons. */}
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 md:px-6 md:py-10 md:pb-10">
        {children}
      </main>
    </div>
  );
}
