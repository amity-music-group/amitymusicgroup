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
    <main className="flex min-h-screen flex-col bg-white text-[#111111]">
      <div className="flex flex-1 items-center justify-center px-6 py-36">
        <div className="w-full max-w-md text-center">
          <p className="text-lg text-neutral-500">Amity Music Group</p>
          <h1 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
            {ok ? "You're unsubscribed." : "That link didn't work."}
          </h1>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            {ok
              ? "You won't receive further emails from Amity Music Group. You can sign up again anytime from the footer of our site."
              : "The unsubscribe link was invalid or expired. If you keep receiving emails, reply to one and ask to be removed."}
          </p>
          <Link
            href="/"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Back to the site
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
