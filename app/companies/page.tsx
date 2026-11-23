import Footer from "@/components/Footer";
import TerritoryAccordion from "@/components/TerritoryAccordion";
import { getCompanies, getTerritories } from "@/lib/content";
import type { Territory } from "@/lib/types";

// A logo is only a logo when the image field holds an actual image URL.
// A website address is not a picture and is never rendered as one —
// those companies show their name as a text mark instead.
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

  // The rolling logos strip is always present and always rolling —
  // UMG's Labels page leads with it. With only two companies in the
  // database, the two logos repeat until more companies are added
  // in /admin; no logos are invented. Each half of the marquee holds
  // at least ten items so it is always wider than the viewport and
  // the loop stays seamless. The strip moves left at about 23 px/s:
  // each item is roughly 290 px of pitch, so the duration is 13 s
  // per item in a half.
  const repeatsPerHalf =
    companies.length === 0
      ? 0
      : Math.max(6, Math.ceil(10 / companies.length));
  const stripHalf = Array.from({ length: repeatsPerHalf }).flatMap(
    () => companies,
  );

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      {/* Hero — UMG's Labels layout: eyebrow, headline, large
          statement line, thin black rule, then the rolling logos
          strip at the bottom of the hero. */}
      <section>
        <div className="mx-auto max-w-7xl px-6 pt-36 lg:px-8 lg:pt-44">
          <p className="text-lg text-neutral-500">Amity Music Group</p>
          <h1 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
            Our companies
          </h1>
          <p className="mt-8 max-w-4xl text-[32px] font-light leading-[1.3] tracking-tight text-black">
            Amity Music Group brings together specialized companies and
            organizations across recorded music, publishing, distribution,
            management, international music, and live music.
          </p>
          <div className="mt-12 h-px w-full bg-black" />
        </div>
        {companies.length > 0 ? (
          <div aria-hidden="true" className="overflow-hidden py-6">
            <div
              className="hero-marquee flex w-max items-center"
              style={{ animationDuration: `${stripHalf.length * 13}s` }}
            >
              {[0, 1].map((half) => (
                <div key={half} className="flex items-center">
                  {stripHalf.map((company, index) => (
                    <span
                      key={`${company.slug}-${index}`}
                      className="mx-20 flex shrink-0 items-center"
                    >
                      {isImageUrl(company.image) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.image}
                          alt=""
                          className="h-[90px] w-auto max-w-[170px] object-contain"
                        />
                      ) : (
                        <span className="whitespace-nowrap text-2xl font-light tracking-tight text-neutral-600">
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

      {/* Company tiles — UMG's Labels grid under a second heading:
          light-grey rounded tiles, logo centered, name in small black
          text below the tile, left-aligned, diagonal arrow on linked
          tiles. */}
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
        <h2 className="text-[40px] font-light leading-tight tracking-tight">
          Our companies
        </h2>
        {companies.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {companies.map((company) => {
              const tile = (
                <>
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#eee] p-8">
                    {isImageUrl(company.image) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={company.image}
                        alt={`${company.name} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-center text-lg font-light leading-snug text-black">
                        {company.name}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-black">{company.name}</span>
                    {company.website ? (
                      <span aria-hidden="true" className="text-sm text-neutral-400">
                        ↗
                      </span>
                    ) : null}
                  </div>
                </>
              );

              return company.website ? (
                <a
                  key={company.slug}
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${company.name} — visit website`}
                  className="group block"
                >
                  {tile}
                </a>
              ) : (
                <article key={company.slug}>{tile}</article>
              );
            })}
          </div>
        ) : (
          <p className="mt-12 text-lg text-neutral-500">
            No companies published yet.
          </p>
        )}
      </div>

      {/* Global Territories — UMG's two-column accordion: large
          heading on the left, collapsed region rows on the right.
          Countries are revealed only on expand. Hidden entirely
          until at least one visible territory is saved in /admin;
          nothing here is invented. */}
      {regions.length > 0 ? (
        <section className="border-t border-black/10 py-28 sm:py-36">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
            <div className="lg:sticky lg:top-36 lg:self-start">
              <p className="text-lg text-neutral-500">Where we work</p>
              <h2 className="mt-5 text-[60px] font-light leading-[1.05] tracking-tight">
                Global
                <br />
                territories
              </h2>
            </div>
            <TerritoryAccordion regions={regions} />
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
