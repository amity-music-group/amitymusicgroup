import Footer from "@/components/Footer";
import { getCompanies, getTerritories } from "@/lib/content";
import type { Territory } from "@/lib/types";

// A logo is only a logo when the image field holds an actual image URL.
// A website address (the Melted Mindz Records row currently holds its
// website in the image field) is not a picture and is never rendered as
// one — those companies show their name as a text mark instead.
function isImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (clean.includes("/storage/v1/object/public/")) return true;
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)$/.test(clean);
}

export default async function CompaniesPage() {
  const [companies, territories] = await Promise.all([
    getCompanies(),
    getTerritories(),
  ]);

  // Group visible territories by region, keeping sort order. Regions
  // appear in the order their first territory is listed.
  const regions: { name: string; items: Territory[] }[] = [];
  for (const territory of territories) {
    const region = territory.region || "Worldwide";
    const group = regions.find((g) => g.name === region);
    if (group) group.items.push(territory);
    else regions.push({ name: region, items: [territory] });
  }

  // The moving logos strip repeats the company set so one half of the
  // loop always fills the strip, even with a single company.
  const stripHalf = [
    ...companies,
    ...companies,
    ...companies,
    ...companies,
    ...companies,
    ...companies,
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header — UMG's Labels page layout: heading + intro line, then
          the moving strip of logos directly underneath. UMG's page has
          no big hero image; the moving thing is the logos strip itself,
          so the Ken Burns hero and wordmark marquee are gone. */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-8 lg:pb-20 lg:pt-32">
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
        </div>
        {companies.length > 0 ? (
          <div
            aria-hidden="true"
            className="overflow-hidden border-t border-white/10 py-5"
          >
            <div className="hero-marquee flex w-max items-center">
              {[0, 1].map((half) => (
                <div key={half} className="flex items-center">
                  {stripHalf.map((company, index) => (
                    <span
                      key={`${company.slug}-${index}`}
                      className="mx-8 flex shrink-0 items-center"
                    >
                      {isImageUrl(company.image) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.image}
                          alt=""
                          className="h-14 w-auto object-contain"
                        />
                      ) : (
                        <span className="whitespace-nowrap font-display text-2xl uppercase tracking-[0.08em] text-white/70">
                          {company.name}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Company tiles — UMG's Labels grid: logo centered and contained
          in the tile (never cropped), name + diagonal-arrow mark below,
          whole tile linking out. */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {companies.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company) => {
              const tile = (
                <>
                  <div className="absolute left-0 top-0 z-10 h-[3px] w-16 bg-[#D7FF38] transition-all duration-300 group-hover:w-full" />
                  {isImageUrl(company.image) ? (
                    <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#0a0a0a] p-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={company.image}
                        alt={`${company.name} logo`}
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div
                    className={`flex items-center justify-between gap-4 p-6 ${
                      isImageUrl(company.image) ? "" : "min-h-32"
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

      {/* Global Territories — modeled on UMG's Labels page section:
          region groups with their places as links. Hidden entirely
          until at least one visible territory is saved in /admin;
          nothing here is invented. */}
      {regions.length > 0 ? (
        <section className="border-t border-white/10 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
              Where we work
            </p>
            <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] sm:text-6xl">
              Global Territories
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
              The places Amity Music Group works.
            </p>

            <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((region) => (
                <div key={region.name}>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
                    {region.name}
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                    {region.items.map((territory) =>
                      territory.website ? (
                        <li key={territory.slug}>
                          <a
                            href={territory.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-white/70 transition hover:text-[#D7FF38]"
                          >
                            {territory.name} ↗
                          </a>
                        </li>
                      ) : (
                        <li
                          key={territory.slug}
                          className="text-sm font-semibold text-white/70"
                        >
                          {territory.name}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
