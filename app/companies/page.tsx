import Footer from "@/components/Footer";
import { getCompanies, getSiteSettings, getTerritories } from "@/lib/content";
import type { Territory } from "@/lib/types";

const MARQUEE =
  "AMITY MUSIC GROUP • INDEPENDENT CULTURE. MAJOR SOUND. • ";

export default async function CompaniesPage() {
  const [companies, territories, site] = await Promise.all([
    getCompanies(),
    getTerritories(),
    getSiteSettings(),
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

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Moving hero — an animated hero in the spirit of UMG's Labels
          page: the site's hero image (set in /admin) drifts slowly in
          a Ken Burns pan, or drifting brand-color glows when no image
          is set, with a scrolling wordmark marquee along the bottom.
          Amity branding and imagery only; nothing copied from UMG. */}
      <section className="relative overflow-hidden border-b border-white/10">
        {site.heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.heroImage}
              alt=""
              aria-hidden="true"
              className="hero-kenburns absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/70"
            />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0">
            <div className="hero-drift absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#D7FF38]/15 blur-3xl" />
            <div className="hero-drift absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#F32991]/15 blur-3xl" />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-8 lg:pb-20 lg:pt-32">
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
        <div
          aria-hidden="true"
          className="relative overflow-hidden border-t border-white/10 py-4"
        >
          <div className="hero-marquee flex w-max whitespace-nowrap">
            <span className="pr-2 font-display text-sm uppercase tracking-[0.3em] text-white/40">
              {MARQUEE.repeat(6)}
            </span>
            <span className="pr-2 font-display text-sm uppercase tracking-[0.3em] text-white/40">
              {MARQUEE.repeat(6)}
            </span>
          </div>
        </div>
      </section>

      {/* Company tiles — unchanged from the PR #2 restyle: logo image
          + name + diagonal-arrow mark, whole tile linking out. */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {companies.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
