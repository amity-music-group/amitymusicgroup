import Link from "next/link";
import Footer from "@/components/Footer";
import { getArtists, getHomeFocus, getSiteSettings } from "@/lib/content";

const principles = [
  {
    title: "Artist First",
    description:
      "Artists and their music remain at the center of everything we build.",
  },
  {
    title: "Long-Term Thinking",
    description:
      "We focus on sustainable careers, catalogs, relationships, and businesses.",
  },
  {
    title: "Connected",
    description:
      "Different areas of the music industry work together to create opportunities.",
  },
  {
    title: "Built to Grow",
    description:
      "We continue developing with the music industry, technology, and audiences.",
  },
];

const focusLabels = ["Our focus", "Our model", "Our vision"];
const focusTexts = [
  "Artist and catalog development",
  "A connected music ecosystem",
  "Building for the future of music",
];

function isImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (clean.includes("/storage/v1/object/public/")) return true;
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)$/.test(clean);
}

export default async function Home() {
  // Content comes from Supabase when configured; the static copy in
  // lib/content.ts is the fallback (the site's current words).
  const [site, focusAreas, artists] = await Promise.all([
    getSiteSettings(),
    getHomeFocus(),
    getArtists(),
  ]);

  // Artist portrait cascade, UMG-style: a rolling strip of square
  // portrait cards. Only real artists from Supabase are shown — with
  // no artists published, this section renders nothing at all.
  const cascadeHalf =
    artists.length === 0
      ? []
      : Array.from({ length: Math.max(4, Math.ceil(10 / artists.length)) }).flatMap(
          () => artists,
        );

  return (
    <main id="top" className="min-h-screen bg-white text-[#111111]">
      {/* Hero — light typographic hero on white. A hero image set in
          /admin is shown below the text as a rounded image on white,
          never as a dark full-bleed photo with an overlay. */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-28 sm:pb-24 sm:pt-40 lg:px-8">
          <p className="text-lg text-neutral-500">Amity Music Group</p>
          <h1 className="mt-5 max-w-4xl text-[40px] font-light leading-[1.05] tracking-tight sm:text-7xl">
            The music group behind the music.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-600">
            {site.heroSubcopy}
          </p>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-base font-medium transition hover:text-neutral-500"
            >
              Discover Amity <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/labels"
              className="inline-flex items-center gap-2 text-base font-medium transition hover:text-neutral-500"
            >
              Explore our companies <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-20 grid gap-6 border-t border-black/10 pt-8 sm:grid-cols-3">
            {focusLabels.map((label, index) => (
              <div key={label}>
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="mt-2 text-base text-black">{focusTexts[index]}</p>
              </div>
            ))}
          </div>

          {site.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.heroImage}
              alt=""
              aria-hidden="true"
              className="mt-16 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          ) : null}
        </div>
      </section>

      {/* Artist cascade — only when real artists exist. */}
      {cascadeHalf.length > 0 ? (
        <section className="border-t border-black/10 py-28 sm:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-lg text-neutral-500">Artists</p>
              <h2 className="mt-5 text-[40px] font-light sm:text-[56px] leading-[1.05] tracking-tight">
                Artists from across the Amity ecosystem.
              </h2>
              <Link
                href="/artists"
                className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
              >
                Explore artists <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="mt-14 overflow-hidden">
            <div
              className="hero-marquee flex w-max items-center gap-4"
              style={{ animationDuration: `${cascadeHalf.length * 13}s` }}
            >
              {[0, 1].map((half) => (
                <div key={half} className="flex items-center gap-4">
                  {cascadeHalf.map((artist, index) => (
                    <div
                      key={`${artist.slug}-${index}`}
                      className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eee] sm:h-44 sm:w-44"
                    >
                      {isImageUrl(artist.image) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={artist.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="p-4 text-center text-lg font-light leading-snug text-black">
                          {artist.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* About preview — UMG sticky-heading pattern. */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">About</p>
            <h2 className="mt-5 text-[40px] font-light sm:text-[56px] leading-[1.05] tracking-tight">
              Music is the center.
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-2xl font-light leading-relaxed sm:text-3xl">
              {site.aboutIntro}
            </p>
            {site.aboutBody.split("\n\n").map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`text-base leading-8 text-neutral-600 ${
                  index === 0 ? "mt-7" : "mt-5"
                }`}
              >
                {paragraph}
              </p>
            ))}

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              More about Amity <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* What we do preview */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">What we do</p>
            <h2 className="mt-5 text-[40px] font-light sm:text-[56px] leading-[1.05] tracking-tight">
              Everything music.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-neutral-600">
              Amity Music Group operates across the key areas that make up the
              modern music business.
            </p>
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <Link
                  key={area.number}
                  href="/services"
                  className="group block rounded-xl bg-[#eee] p-8 transition hover:bg-[#e4e4e4] sm:p-9"
                >
                  <h3 className="text-2xl font-light text-black">
                    {area.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-neutral-600">
                    {area.description}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition group-hover:text-neutral-500">
                    Explore services <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/services"
              className="mt-10 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Explore all services <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Company ecosystem */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">The Amity ecosystem</p>
            <h2 className="mt-5 text-[40px] font-light sm:text-[56px] leading-[1.05] tracking-tight">
              Different companies. One music ecosystem.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-neutral-600">
              Amity Music Group brings together specialized companies and
              organizations across recorded music, publishing, distribution,
              management, international music, and live music.
            </p>
            <Link
              href="/labels"
              className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Explore our companies <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Our approach preview */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">Our approach</p>
            <h2 className="mt-5 text-[40px] font-light sm:text-[56px] leading-[1.05] tracking-tight">
              Built for what&apos;s next.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-neutral-600">
              The music industry continues to evolve. Our approach is built
              around adapting with it while keeping artists and music at the
              center.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Discover our approach <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="rounded-xl bg-[#eee] p-8 sm:p-9"
              >
                <h3 className="text-2xl font-light text-black">
                  {principle.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-neutral-600">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Brand statement — centred, UMG-style. */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="mx-auto max-w-6xl text-4xl font-light leading-[1.15] tracking-tight text-black sm:text-5xl lg:text-6xl">
            We build around music.{" "}
            <span className="text-neutral-400">
              We develop the infrastructure, businesses, and relationships that
              help it move further.
            </span>
          </p>
        </div>
      </section>

      {/* Contact preview */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">Contact</p>
            <h2 className="mt-5 text-[40px] font-light sm:text-[56px] leading-[1.05] tracking-tight">
              Let&apos;s talk music.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-neutral-600">
              {site.contactIntro}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Contact Amity <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer footerText={site.footerText} tagline={site.tagline} />
    </main>
  );
}
