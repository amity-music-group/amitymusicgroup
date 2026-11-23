import Footer from "@/components/Footer";
import { getCompanies } from "@/lib/content";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
          Amity Music Group
        </p>
        <h1 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">
          Our Companies
        </h1>
        <div className="mt-8 h-[3px] w-24 bg-[#F32991]" />
        <p className="mt-6 text-lg text-white/60">
          Independent Culture. Major Sound.
        </p>

        {companies.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {companies.map((company) => (
              <article
                key={company.slug}
                className="group relative overflow-hidden border border-white/10 bg-[#111111] transition duration-300 hover:border-white/40"
              >
                <div className="absolute left-0 top-0 z-10 h-[3px] w-16 bg-[#D7FF38] transition-all duration-300 group-hover:w-full" />
                {company.image ? (
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={company.image}
                      alt={company.name}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-7 sm:p-9">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                    {company.category || "Amity Music Group"}
                  </p>
                  <h2 className="mt-3 font-display text-2xl uppercase tracking-[0.01em] sm:text-3xl">
                    {company.name}
                  </h2>
                  {company.tagline ? (
                    <p className="mt-2 text-sm font-semibold text-white/85">
                      {company.tagline}
                    </p>
                  ) : null}
                  {company.description ? (
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      {company.description}
                    </p>
                  ) : null}
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:text-[#D7FF38]"
                    >
                      Visit website ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <Footer />
    </main>
  );
}
