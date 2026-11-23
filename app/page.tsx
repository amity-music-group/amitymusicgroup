import Link from "next/link";
import Footer from "@/components/Footer";
import { getHomeFocus, getSiteSettings } from "@/lib/content";

const principles = [
  {
    number: "01",
    title: "Artist First",
    description:
      "Artists and their music remain at the center of everything we build.",
  },
  {
    number: "02",
    title: "Long-Term Thinking",
    description:
      "We focus on sustainable careers, catalogs, relationships, and businesses.",
  },
  {
    number: "03",
    title: "Connected",
    description:
      "Different areas of the music industry work together to create opportunities.",
  },
  {
    number: "04",
    title: "Built to Grow",
    description:
      "We continue developing with the music industry, technology, and audiences.",
  },
];

const LOGO = "/amity-logo.jpg";

export default async function Home() {
  // Content comes from Supabase when configured; the static copy in
  // lib/content.ts is the fallback (the site's current words).
  const [site, focusAreas] = await Promise.all([
    getSiteSettings(),
    getHomeFocus(),
  ]);

  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-61px)] items-center border-b border-white/10">
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
              className="absolute inset-0 bg-black/70"
            />
          </>
        ) : null}
        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                <span className="h-2 w-2 bg-[#F32991]" />
                Amity Music Group
              </p>

              <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-[0.01em] sm:text-8xl lg:text-9xl">
                THE MUSIC
                <br />
                <span className="text-[#D7FF38]">GROUP</span>
                <br />
                BEHIND
                <br />
                THE MUSIC.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
                {site.heroSubcopy}
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
                >
                  Discover Amity <span className="ml-3 text-base">↗</span>
                </Link>

                <Link
                  href="/companies"
                  className="inline-flex items-center justify-center border border-white/20 px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
                >
                  Explore our companies
                </Link>
              </div>
            </div>

            {/* Main brand logo */}
            <div className="mx-auto w-full max-w-md">
              <div className="relative border border-white/10 bg-[#111111] p-7 sm:p-10">
                <div className="absolute right-6 top-6 h-3 w-3 bg-[#F32991]" />

                <div className="relative flex flex-col items-center py-6 text-center">
                  <img
                    src={LOGO}
                    alt="Amity Music Group brand emblem"
                    className="aspect-square w-4/5 max-w-72 object-contain"
                  />

                  <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                    Independent Culture.
                  </p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white">
                    Major Sound.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Music · Culture · Creativity
                  </span>
                  <span className="h-[3px] w-8 bg-[#F32991]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                Our focus
              </p>
              <p className="mt-2 text-sm text-white/60">
                Artist and catalog development
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                Our model
              </p>
              <p className="mt-2 text-sm text-white/60">
                A connected music ecosystem
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                Our vision
              </p>
              <p className="mt-2 text-sm text-white/60">
                Building for the future of music
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="border-b border-white/10 bg-[#111111] py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F32991]">
              01 — About
            </p>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
              Music is the
              <br />
              <span className="text-[#D7FF38]">center.</span>
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
              {site.aboutIntro}
            </p>
            {site.aboutBody.split("\n\n").map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`text-base leading-8 text-white/60 ${
                  index === 0 ? "mt-7" : "mt-5"
                }`}
              >
                {paragraph}
              </p>
            ))}

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D7FF38] transition hover:text-white"
            >
              More about Amity <span aria-hidden="true">↗</span>
            </Link>

            <div className="mt-9 h-[3px] w-24 bg-[#D7FF38]" />
          </div>
        </div>
      </section>

      {/* What we do preview */}
      <section className="border-b border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
              02 — What We Do
            </p>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
              Everything
              <br />
              <span className="text-[#D7FF38]">music.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
              Amity Music Group operates across the key areas that make up the
              modern music business.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area) => (
              <Link
                key={area.number}
                href="/services"
                className="group relative block overflow-hidden border border-white/10 bg-[#111111] p-7 transition duration-300 hover:border-white/40 sm:p-9"
              >
                <div className="absolute right-0 top-0 h-[3px] w-16 bg-[#D7FF38] transition-all duration-300 group-hover:w-full" />
                <span className="text-xs font-bold tracking-[0.25em] text-[#D7FF38]">
                  {area.number}
                </span>
                <h3 className="mt-12 font-display text-2xl uppercase tracking-[0.01em] sm:text-3xl">
                  {area.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  {area.description}
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                    Explore services
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-[#D7FF38] transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-10 inline-flex items-center gap-3 bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
          >
            Explore all services <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* Company ecosystem */}
      <section className="border-b border-white/10 bg-[#111111] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F32991]">
                The Amity Ecosystem
              </p>
              <h2 className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
                Different companies.
                <br />
                <span className="text-[#D7FF38]">One music ecosystem.</span>
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">
                Amity Music Group brings together specialized companies and
                organizations across recorded music, publishing, distribution,
                management, international music, and live music.
              </p>
              <Link
                href="/companies"
                className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D7FF38] transition hover:text-white"
              >
                Explore our companies <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 translate-x-3 translate-y-3 border border-white/10" />
              <div className="relative border border-white/10 bg-[#050505] p-8 sm:p-10">
                <img
                  src={LOGO}
                  alt="Amity Music Group logo"
                  className="mx-auto w-44 object-contain"
                />
                <div className="mt-7 text-center">
                  <p className="font-display text-sm uppercase tracking-[0.2em]">
                    Amity Music Group
                  </p>
                  <p className="mt-3 text-xs leading-6 text-white/60">
                    One connected vision.
                    <br />
                    Multiple areas of expertise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our approach preview */}
      <section className="border-b border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                03 — Our Approach
              </p>
              <h2 className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
                Built for
                <br />
                <span className="text-[#D7FF38]">what&apos;s next.</span>
              </h2>
              <p className="mt-7 max-w-md text-base leading-8 text-white/60">
                The music industry continues to evolve. Our approach is built
                around adapting with it while keeping artists and music at the
                center.
              </p>
              <Link
                href="/approach"
                className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D7FF38] transition hover:text-white"
              >
                Discover our approach <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {principles.map((principle) => (
                <article
                  key={principle.number}
                  className="border border-white/10 bg-[#111111] p-7 transition hover:border-white/40 sm:p-9"
                >
                  <span className="text-xs font-bold tracking-[0.25em] text-[#D7FF38]">
                    {principle.number}
                  </span>
                  <h3 className="mt-10 font-display text-2xl uppercase tracking-[0.01em]">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-b border-white/10 bg-[#111111] py-24 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="max-w-6xl font-display text-4xl uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            We build around music.
            <span className="text-white/40">
              {" "}
              We develop the infrastructure, businesses, and relationships that
              help it move further.
            </span>
          </p>
          <div className="mt-10 h-[3px] w-28 bg-[#F32991]" />
        </div>
      </section>

      {/* Contact preview */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden border border-white/10 bg-[#111111] p-8 sm:p-12 lg:p-16">
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                  04 — Contact
                </p>
                <h2 className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
                  Let&apos;s talk
                  <br />
                  <span className="text-[#D7FF38]">music.</span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
                  {site.contactIntro}
                </p>
              </div>

              <Link
                href="/contact"
                className="relative inline-flex items-center justify-center gap-3 bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
              >
                Contact Amity <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer footerText={site.footerText} tagline={site.tagline} />
    </main>
  );
}
