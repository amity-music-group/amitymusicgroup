import Link from "next/link";
import Footer from "@/components/Footer";

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const params = await searchParams;
  const ok = params.ok !== "0";

  return (
    <main className="flex min-h-screen flex-col bg-[#050505] text-white">
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-md text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
            Amity Music Group
          </p>
          <h1 className="mt-6 font-display text-5xl uppercase leading-[0.9] tracking-[0.01em]">
            {ok ? "You're unsubscribed." : "That link didn't work."}
          </h1>
          <p className="mt-5 text-base leading-8 text-white/60">
            {ok
              ? "You won't receive further emails from Amity Music Group. You can sign up again anytime from the footer of our site."
              : "The unsubscribe link was invalid or expired. If you keep receiving emails, reply to one and ask to be removed."}
          </p>
          <Link
            href="/"
            className="mt-9 inline-flex items-center justify-center bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
          >
            Back to the site
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
