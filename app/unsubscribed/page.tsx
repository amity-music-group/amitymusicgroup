import Link from "next/link";

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const params = await searchParams;
  const ok = params.ok !== "0";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#160D2C] px-6 py-24 text-white">
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
          Amity Music Group
        </p>
        <h1 className="mt-6 text-4xl font-black tracking-tight">
          {ok ? "You're unsubscribed." : "That link didn't work."}
        </h1>
        <p className="mt-5 text-base leading-8 text-white/70">
          {ok
            ? "You won't receive further emails from Amity Music Group. You can sign up again anytime from the footer of our site."
            : "The unsubscribe link was invalid or expired. If you keep receiving emails, reply to one and ask to be removed."}
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex items-center justify-center bg-[#D7FF38] px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
        >
          Back to the site
        </Link>
      </div>
    </main>
  );
}
