import Footer from "@/components/Footer";
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
  // UMG's Labels page leads with it. With only one company in the
  // database, that one logo repeats until more companies are added
  // in /admin; no logos are invented. Each half of the marquee holds
  // at least ten items so it is always wider than the viewport and
  // the loop stays seamless.
  const repeatsPerHalf =
    companies.length === 0
      ? 0
      : Math.max(6, Math.ceil(10 / companies.length));
  const stripHalf = Array.from({ length: repeatsPerHalf }).flatMap(
    () => companies,
  );

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      {/* Header — UMG's Labels page layout: eyebrow, headline, thin
          rule, intro line, then the moving strip of logos. */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-36 lg:px-8 lg:pb-20 lg:pt-44">
          <p className="text-lg text-neutral-500">Amity Music Group</p>
          <h1 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
            Our companies
          </h1>
          <div className="mt-8 h-px w-24 bg-black" />
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
            Amity Music Group brings together specialized companies and
            organizations across recorded music, publishing, distribution,
            management, international music, and live music.
          </p>
        </div>
        {companies.length > 0 ? (
          <div
            aria-hidden="true"
            className="overflow-hidden border-t border-black/10 py-5"
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

      {/* Company tiles — UMG's Labels grid: a light-grey rounded tile
          with the logo centered and contained (never cropped), name in
          small black sans beneath the tile, whole tile linking out. */}
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
        {companies.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
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
                  <div className="mt-3 flex items-center justify-center gap-2 text-center">
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
          <p className="text-lg text-neutral-500">
            No companies published yet.
          </p>
        )}
      </div>

      {/* Global Territories — modeled on UMG's Labels page section:
          region pills with their places listed beneath. Hidden entirely
          until at least one visible territory is saved in /admin;
          nothing here is invented. */}
      {regions.length > 0 ? (
        <section className="border-t border-black/10 py-28 sm:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-lg text-neutral-500">Where we work</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Global territories
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              The places Amity Music Group works.
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              {regions.map((region) => (
                <span
                  key={region.name}
                  className="rounded-full bg-[#eee] px-5 py-2 text-sm text-black"
                >
                  {region.name}
                </span>
              ))}
            </div>

            <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((region) => (
                <div key={region.name}>
                  <h3 className="text-sm text-neutral-500">{region.name}</h3>
                  <ul className="mt-5 space-y-3">
                    {region.items.map((territory) =>
                      territory.website ? (
                        <li key={territory.slug}>
                          <a
                            href={territory.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-base font-medium text-black transition hover:text-neutral-500"
                          >
                            {territory.name} ↗
                          </a>
                        </li>
                      ) : (
                        <li key={territory.slug} className="text-base text-black">
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
