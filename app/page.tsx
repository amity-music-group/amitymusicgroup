import Link from "next/link";
import Footer from "@/components/Footer";
import { getHomeFocus, getSiteSettings } from "@/lib/content";

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

export default async function Home() {
  // Content comes from Supabase when configured; the static copy in
  // lib/content.ts is the fallback (the site's current words).
  const [site, focusAreas] = await Promise.all([
    getSiteSettings(),
    getHomeFocus(),
  ]);

  return (
    <main id="top" className="min-h-screen bg-white text-[#111111]">
      {/* Hero — a full-viewport photo when the admin has set a hero
          image, otherwise a clean typographic hero. */}
      <section className="relative flex min-h-screen items-end overflow-hidden">
        {site.heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.heroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            />
          </>
        ) : null}
        <div
          className={`relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-8 ${
            site.heroImage ? "text-white" : ""
          }`}
        >
          <p
            className={`text-lg ${
              site.heroImage ? "text-white/80" : "text-neutral-500"
            }`}
          >
            Amity Music Group
          </p>
          <h1 className="mt-5 max-w-4xl text-[56px] font-light leading-[1.05] tracking-tight sm:text-7xl">
            The music group behind the music.
          </h1>
          <p
            className={`mt-7 max-w-xl text-lg leading-8 ${
              site.heroImage ? "text-white/80" : "text-neutral-600"
            }`}
          >
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
              href="/companies"
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
        </div>
      </section>

      {/* About preview */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div>
            <p className="text-lg text-neutral-500">About</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-lg text-neutral-500">What we do</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Everything music.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Amity Music Group operates across the key areas that make up the
              modern music business.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>

      {/* Company ecosystem */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-lg text-neutral-500">The Amity ecosystem</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Different companies. One music ecosystem.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600">
              Amity Music Group brings together specialized companies and
              organizations across recorded music, publishing, distribution,
              management, international music, and live music.
            </p>
            <Link
              href="/companies"
              className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Explore our companies <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Our approach preview */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-lg text-neutral-500">Our approach</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Built for what&apos;s next.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600">
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

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
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

      {/* Brand statement */}
      <section className="border-t border-black/10 py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="max-w-6xl text-4xl font-light leading-[1.15] tracking-tight text-black sm:text-5xl lg:text-6xl">
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-lg text-neutral-500">Contact</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Let&apos;s talk music.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600">
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
