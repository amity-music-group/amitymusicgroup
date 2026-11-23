import { getCompanies } from "@/lib/content";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <main className="min-h-screen bg-[#160D2C] px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#D7FF38]">
          Amity Music Group
        </p>
        <h1 className="text-4xl font-bold md:text-6xl">Our Companies</h1>
        <div className="mt-8 h-1 w-24 bg-[#F32991]" />
        <p className="mt-6 text-lg text-white/70">
          Independent Culture. Major Sound.
        </p>

        {companies.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {companies.map((company) => (
              <article
                key={company.slug}
                className="group relative overflow-hidden border border-white/15 bg-[#4922EB]/20 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D7FF38]/70 sm:p-9"
              >
                {company.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.image}
                    alt={company.name}
                    className="mb-6 h-40 w-full rounded-xl object-cover"
                  />
                ) : null}
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF38]">
                  {company.category || "Amity Music Group"}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {company.name}
                </h2>
                {company.tagline ? (
                  <p className="mt-2 text-sm font-semibold text-white/85">
                    {company.tagline}
                  </p>
                ) : null}
                {company.description ? (
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {company.description}
                  </p>
                ) : null}
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#D7FF38] transition hover:text-[#F32991]"
                  >
                    Visit website ↗
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
