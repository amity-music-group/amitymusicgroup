import Footer from "@/components/Footer";
import { getCompanies } from "@/lib/content";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
          Amity Music Group
        </p>
        <h1 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">
          Our Companies
        </h1>
        <div className="mt-8 h-[3px] w-24 bg-[#F32991]" />
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          Amity Music Group brings together specialized companies and
          organizations across recorded music, publishing, distribution,
          management, international music, and live music.
        </p>

        {companies.length > 0 ? (
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => {
              const tile = (
                <>
                  <div className="absolute left-0 top-0 z-10 h-[3px] w-16 bg-[#D7FF38] transition-all duration-300 group-hover:w-full" />
                  {company.image ? (
                    <div className="overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={company.image}
                        alt={`${company.name} logo`}
                        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div
                    className={`flex items-center justify-between gap-4 p-6 ${
                      company.image ? "" : "min-h-32"
                    }`}
                  >
                    <h2 className="font-display text-2xl uppercase leading-none tracking-[0.01em]">
                      {company.name}
                    </h2>
                    {company.website ? (
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-xl text-white/50 transition group-hover:text-[#D7FF38]"
                      >
                        ↗
                      </span>
                    ) : null}
                  </div>
                </>
              );

              const tileClass =
                "group relative overflow-hidden border border-white/10 bg-[#111111] transition duration-300 hover:border-white/40";

              return company.website ? (
                <a
                  key={company.slug}
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${company.name} — visit website`}
                  className={`${tileClass} block`}
                >
                  {tile}
                </a>
              ) : (
                <article key={company.slug} className={tileClass}>
                  {tile}
                </article>
              );
            })}
          </div>
        ) : null}
      </div>

      <Footer />
    </main>
  );
}
