import Footer from "@/components/Footer";
import TerritoryAccordion from "@/components/TerritoryAccordion";
import { getCompanies, getTerritories } from "@/lib/content";
import type { Territory } from "@/lib/types";

// The rolling strip is a fixed list of real graphic logos on
// transparent backgrounds, like UMG's /labels strip — never the
// Supabase JPGs, which are white/silver artwork on solid black
// squares and would bring the black boxes back. Each transparent
// PNG in public/logos was made from that logo's real artwork
// (luminance as alpha over black, trimmed, flat black):
// - Melted Mindz Records: black "MM" mark with star.
// - Dial Recordings America: black "DIAL RECORDINGS" with play
//   triangle. Both from their real uploaded Supabase artwork.
// - IS = Iron Stage Touring, AR = Arden Row, and A-cross =
//   Amity Christian Music Group: supplied by Theodore as JPGs on
//   2026-11-23, converted the same way. They have no tiles below
//   yet — only Melted and Dial are companies in Supabase so far.
// The files in public/logos are the SMALL versions the user
// approved (100 px tall, Dial 70 px tall), as used in the strip.
const STRIP_ITEMS: { src: string; alt: string; className: string }[] = [
  {
    src: "/logos/is-logo.png",
    alt: "Iron Stage Touring",
    // "IS" in a thin circle, ~90px tall.
    className: "h-[90px] w-auto max-w-[180px] object-contain",
  },
  {
    src: "/logos/ar-logo.png",
    alt: "Arden Row",
    // "AR" with a black underline bar, ~70px tall.
    className: "h-[70px] w-auto max-w-[180px] object-contain",
  },
  {
    src: "/logos/a-cross-logo.png",
    alt: "Amity Christian Music Group",
    // "A" with a cross and swoosh, ~90px tall.
    className: "h-[90px] w-auto max-w-[180px] object-contain",
  },
  {
    src: "/logos/dial-recordings-america.png",
    alt: "Dial Recordings America",
    // Wide, short wordmark, ~60px tall.
    className: "h-[60px] w-auto max-w-[180px] object-contain",
  },
  {
    src: "/logos/melted-mindz-records.png",
    alt: "Melted Mindz Records",
    // Square mark, ~90px tall like UMG's tallest logos.
    className: "h-[90px] w-auto max-w-[180px] object-contain",
  },
];
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

  // The rolling logo strip is always present and always rolling —
  // UMG's Labels page leads with it. It is a fixed list of five
  // logos (STRIP_ITEMS above), not driven by the companies table,
  // exactly like UMG's fixed set of label logos. Each half of the
  // marquee holds at least ten items so it is always wider than
  // the viewport and the loop stays seamless. Speed is set to
  // match UMG's measured 44–45 px/s, leftward, continuous, with
  // no pause on hover: each item's pitch is roughly 268 px on
  // average (logo widths at their strip heights — IS ~90 px,
  // AR ~70 px, A-cross ~123 px, Dial ~159 px, Melted ~95 px —
  // plus 160 px of mx-20 gap), so 6 s per item gives
  // ~268 / 6 ≈ 44.6 px/s. The duration below is per duplicated
  // half, which is what the -50% translate in app/globals.css
  // moves across.
  const repeatsPerHalf = Math.max(
    2,
    Math.ceil(10 / STRIP_ITEMS.length),
  );
  const stripHalf = Array.from({ length: repeatsPerHalf }).flatMap(
    () => STRIP_ITEMS,
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
        </div>
        <div aria-hidden="true" className="mt-24 overflow-hidden py-6">
          <div
            className="hero-marquee flex w-max items-center"
            style={{ animationDuration: `${stripHalf.length * 6}s` }}
          >
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center">
                {stripHalf.map((item, index) => (
                  <span
                    key={`${item.src}-${index}`}
                    className="mx-20 flex shrink-0 items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      className={item.className}
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
          <div className="h-px w-full bg-black" />
        </div>
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
