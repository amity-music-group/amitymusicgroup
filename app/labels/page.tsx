import Footer from "@/components/Footer";
import TerritoryAccordion from "@/components/TerritoryAccordion";
import {
  getCompanies,
  getSiteSettings,
  getStripItems,
  getTerritories,
} from "@/lib/content";
import type { Company, Territory } from "@/lib/types";

// The rolling strip is driven by the strip_items table, edited in
// /admin/strip — never the Supabase JPGs, which are white/silver
// artwork on solid black squares and would bring the black boxes
// back. When the table does not exist yet (migration not run) or is
// empty, lib/content falls back to the five real graphic logos
// Theodore approved (flat black on transparent, IS / AR / A-cross /
// Dial / Melted Mindz), at the heights the strip uses today.
function isImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (clean.includes("/storage/v1/object/public/")) return true;
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)$/.test(clean);
}

export default async function CompaniesPage() {
  const [companies, territories, stripItems, settings] = await Promise.all([
    getCompanies(),
    getTerritories(),
    getStripItems(),
    getSiteSettings(),
  ]);

  // Group visible companies by their category, in the order the
  // first company of each category appears. The category chosen in
  // /admin becomes the heading of its own section — a company
  // marked "Strategic Partner" goes under a "Strategic Partner"
  // heading, a "Record Label" under "Record Label", and so on.
  // Companies with no category yet go under "Other".
  const companyGroups: { category: string; items: Company[] }[] = [];
  for (const company of companies) {
    const category = company.category.trim() || "Other";
    const group = companyGroups.find((g) => g.category === category);
    if (group) group.items.push(company);
    else companyGroups.push({ category, items: [company] });
  }
  const regions: { name: string; items: Territory[] }[] = [];
  for (const territory of territories) {
    const region = territory.region || "Worldwide";
    const group = regions.find((g) => g.name === region);
    if (group) group.items.push(territory);
    else regions.push({ name: region, items: [territory] });
  }

  // The rolling logo strip is always present and always rolling —
  // UMG's Labels page leads with it. Its logos come from /admin/strip
  // (the strip_items table), and its speed from the same page, in px/s
  // (default 67, set in /admin/strip; UMG's measured speed is ~44).
  // Each half of the marquee holds at least ten items so it is always
  // wider than the viewport and the loop stays seamless. Speed is
  // leftward, continuous, with no pause on hover: each item's pitch is
  // roughly 268 px on average, so the seconds per item are ~268 /
  // speed. The duration below is per duplicated half, which is what
  // the -50% translate in app/globals.css moves across.
  const speedPxPerSec = Math.max(
    20,
    Math.min(150, settings.stripSpeedPxPerSec || 67),
  );
  const secondsPerItem = 268 / speedPxPerSec;
  const repeatsPerHalf = Math.max(
    2,
    Math.ceil(10 / Math.max(1, stripItems.length)),
  );
  const stripHalf = Array.from({ length: repeatsPerHalf }).flatMap(
    () => stripItems,
  );

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      {/* Hero — UMG's Labels layout: eyebrow, headline, large
          statement line, then the rolling logo strip, then the
          thin black rule below the strip. The strip uses the real
          graphic logos on transparent backgrounds (public/logos),
          like UMG's black wordmarks on white — never the Supabase
          JPGs, which are artwork on solid black squares. */}
      <section>
        <div className="mx-auto max-w-7xl px-6 pt-28 sm:pt-36 lg:px-8 lg:pt-44">
          <p className="text-lg text-neutral-500">Amity Music Group</p>
          <h1 className="mt-5 text-[40px] font-light sm:text-[56px] leading-[1.05] tracking-tight">
            Our companies
          </h1>
          <p className="mt-8 max-w-4xl text-[26px] font-light sm:text-[32px] leading-[1.3] tracking-tight text-black">
            Amity Music Group brings together specialized companies and
            organizations across recorded music, publishing, distribution,
            management, international music, and live music.
          </p>
        </div>
        <div aria-hidden="true" className="mt-12 overflow-hidden py-6 sm:mt-24">
          <div
            className="hero-marquee flex w-max items-center"
            style={{ animationDuration: `${stripHalf.length * secondsPerItem}s` }}
          >
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center">
                {stripHalf.map((item, index) => (
                  <span
                    key={`${item.slug}-${index}`}
                    className="mx-20 flex shrink-0 items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="strip-logo"
                      style={
                        {
                          "--strip-h": `${item.heightPx}px`,
                        } as React.CSSProperties
                      }
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl sm:mt-32 px-6 lg:px-8">
          <div className="h-px w-full bg-black" />
        </div>
      </section>

      {/* Company tiles — UMG's Labels grid under a second heading:
          light-grey rounded tiles, logo centered, name in small black
          text below the tile, left-aligned, diagonal arrow on linked
          tiles. Companies are grouped by the category chosen in
          /admin, each group under its category as a heading. */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-28 lg:px-8">
        <h2 className="text-[40px] font-light leading-tight tracking-tight">
          Our companies
        </h2>
        {companyGroups.length > 0 ? (
          companyGroups.map((group) => (
            <section key={group.category} className="mt-12 sm:mt-16">
              <h3 className="text-[26px] font-light leading-tight tracking-tight sm:text-[32px]">
                {group.category}
              </h3>
              <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {group.items.map((company) => {
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
            </section>
          ))
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
