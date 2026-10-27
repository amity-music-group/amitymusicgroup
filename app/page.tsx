
import Link from "next/link";

const focusAreas = [
  {
    number: "01",
    title: "Recorded Music",
    description:
      "Developing artists, releasing music, and building catalogs for the long term.",
    href: "/services",
  },
  {
    number: "02",
    title: "Music Publishing",
    description:
      "Supporting songwriters, compositions, copyrights, and music catalogs.",
    href: "/services",
  },
  {
    number: "03",
    title: "Distribution",
    description:
      "Connecting music with digital platforms and audiences around the world.",
    href: "/services",
  },
  {
    number: "04",
    title: "Artist Management",
    description:
      "Helping artists develop sustainable careers through strategy and representation.",
    href: "/services",
  },
  {
    number: "05",
    title: "International Music",
    description:
      "Building relationships and opportunities across international music markets.",
    href: "/services",
  },
  {
    number: "06",
    title: "Live Music",
    description:
      "Supporting touring, booking, talent, and live performance opportunities.",
    href: "/services",
  },
];

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

export default function Home() {
  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#4922EB] text-white"
    >
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-80px)] items-center border-b border-white/20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-28 h-96 w-96 rounded-full bg-[#D7FF38]/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#F32991]/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#160D2C]/30" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-[#D7FF38]">
                <span className="h-2 w-2 rounded-full bg-[#F32991]" />
                Amity Music Group
              </p>

              <h1 className="text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                THE MUSIC
                <br />
                <span className="text-[#D7FF38]">GROUP</span>
                <br />
                BEHIND
                <br />
                THE MUSIC.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                A connected music organization built around artists, recorded
                music, publishing, distribution, management, and the future of
                the music industry.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center bg-[#D7FF38] px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
                >
                  Discover Amity <span className="ml-3 text-base">↗</span>
                </Link>

                <Link
                  href="/companies"
                  className="inline-flex items-center justify-center border border-white/40 px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
                >
                  Explore our companies
                </Link>
              </div>
            </div>

            {/* Main brand logo */}
            <div className="mx-auto w-full max-w-md">
              <div className="relative rounded-[2rem] border border-white/15 bg-[#160D2C] p-7 shadow-2xl sm:p-10">
                <div className="absolute right-6 top-6 h-3 w-3 rounded-full bg-[#F32991]" />

                <div className="relative flex flex-col items-center py-6 text-center">
                  <img
                    src={LOGO}
                    alt="Amity Music Group brand emblem"
                    className="aspect-square w-4/5 max-w-72 rounded-3xl object-contain"
                  />

                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                    Independent Culture.
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-white">
                    Major Sound.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                    Music · Culture · Creativity
                  </span>
                  <span className="h-2 w-8 bg-[#F32991]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-4 border-t border-white/20 pt-7 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D7FF38]">
                Our focus
              </p>
              <p className="mt-2 text-sm text-white/80">
                Artist and catalog development
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D7FF38]">
                Our model
              </p>
              <p className="mt-2 text-sm text-white/80">
                A connected music ecosystem
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D7FF38]">
                Our vision
              </p>
              <p className="mt-2 text-sm text-white/80">
                Building for the future of music
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="border-b border-white/10 bg-[#160D2C] py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F32991]">
              01 — About
            </p>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Music is the
              <br />
              <span className="text-[#D7FF38]">center.</span>
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
              Amity Music Group exists to build and support businesses around
              music while creating opportunities for artists and creators.
            </p>
            <p className="mt-7 text-base leading-8 text-white/70">
              The group brings together different areas of the music industry,
              allowing each part of the ecosystem to focus on its own expertise
              while contributing to a larger music organization.
            </p>
            <p className="mt-5 text-base leading-8 text-white/70">
              From music creation and release to publishing, distribution,
              management, international operations, and live music, Amity is
              focused on building an ecosystem designed for the people who
              make music possible.
            </p>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D7FF38] transition hover:text-[#F32991]"
            >
              More about Amity <span aria-hidden="true">↗</span>
            </Link>

            <div className="mt-9 h-1 w-24 bg-[#D7FF38]" />
          </div>
        </div>
      </section>

      {/* What we do preview */}
      <section className="border-b border-white/15 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D7FF38]">
              02 — What We Do
            </p>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Everything
              <br />
              <span className="text-[#D7FF38]">music.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80">
              Amity Music Group operates across the key areas that make up the
              modern music business.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area, index) => (
              <Link
                key={area.number}
                href={area.href}
                className="group relative block overflow-hidden border border-white/15 bg-[#160D2C] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D7FF38]/70 sm:p-9"
              >
                <div
                  className={`absolute right-0 top-0 h-1 w-16 transition-all duration-300 group-hover:w-full ${
                    index % 2 === 0 ? "bg-[#D7FF38]" : "bg-[#F32991]"
                  }`}
                />
                <span className="text-xs font-bold tracking-[0.25em] text-[#D7FF38]">
                  {area.number}
                </span>
                <h3 className="mt-12 text-xl font-bold tracking-tight sm:text-2xl">
                  {area.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  {area.description}
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Explore services
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-[#D7FF38] transition group-hover:translate-x-1 group-hover:text-[#F32991]"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-10 inline-flex items-center gap-3 bg-[#D7FF38] px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
          >
            Explore all services <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* Company ecosystem */}
      <section className="border-b border-white/10 bg-[#160D2C] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F32991]">
                The Amity Ecosystem
              </p>
              <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
                Different companies.
                <br />
                <span className="text-[#D7FF38]">One music ecosystem.</span>
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/70">
                Amity Music Group brings together specialized companies and
                organizations across recorded music, publishing, distribution,
                management, international music, and live music.
              </p>
              <Link
                href="/companies"
                className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D7FF38] transition hover:text-[#F32991]"
              >
                Explore our companies <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 translate-x-3 translate-y-3 border border-[#F32991]/60" />
              <div className="relative border border-[#D7FF38]/40 bg-[#4922EB] p-8 sm:p-10">
                <img
                  src={LOGO}
                  alt="Amity Music Group logo"
                  className="mx-auto w-44 rounded-2xl object-contain"
                />
                <div className="mt-7 text-center">
                  <p className="text-sm font-black tracking-[0.2em]">
                    AMITY MUSIC GROUP
                  </p>
                  <p className="mt-3 text-xs leading-6 text-white/75">
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
      <section className="border-b border-white/15 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D7FF38]">
                03 — Our Approach
              </p>
              <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
                Built for
                <br />
                <span className="text-[#D7FF38]">what&apos;s next.</span>
              </h2>
              <p className="mt-7 max-w-md text-base leading-8 text-white/80">
                The music industry continues to evolve. Our approach is built
                around adapting with it while keeping artists and music at the
                center.
              </p>
              <Link
                href="/approach"
                className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D7FF38] transition hover:text-[#F32991]"
              >
                Discover our approach <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {principles.map((principle, index) => (
                <article
                  key={principle.number}
                  className="border border-white/15 bg-[#160D2C] p-7 transition hover:border-[#D7FF38]/70 sm:p-9"
                >
                  <span
                    className={`text-xs font-bold tracking-[0.25em] ${
                      index % 2 === 0
                        ? "text-[#D7FF38]"
                        : "text-[#F32991]"
                    }`}
                  >
                    {principle.number}
                  </span>
                  <h3 className="mt-10 text-xl font-bold">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-b border-white/15 bg-[#160D2C] py-24 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="max-w-6xl text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            We build around music.
            <span className="text-white/45">
              {" "}
              We develop the infrastructure, businesses, and relationships that
              help it move further.
            </span>
          </p>
          <div className="mt-10 h-1 w-28 bg-[#F32991]" />
        </div>
      </section>

      {/* Contact preview */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden border border-white/20 bg-[#160D2C] p-8 sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#4922EB]/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#F32991]/15 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D7FF38]">
                  04 — Contact
                </p>
                <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
                  Let&apos;s talk
                  <br />
                  <span className="text-[#D7FF38]">music.</span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
                  For business inquiries, music opportunities, publishing,
                  distribution, management, partnerships, or other
                  music-related matters, contact Amity Music Group.
                </p>
              </div>

              <Link
                href="/contact"
                className="relative inline-flex items-center justify-center gap-3 bg-[#D7FF38] px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
              >
                Contact Amity <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-[#160D2C]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img
                src={LOGO}
                alt="Amity Music Group logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-sm font-bold tracking-[0.2em]">
                AMITY MUSIC GROUP
              </span>
            </Link>
            <p className="mt-3 text-xs leading-6 text-white/55">
              A music-focused organization and connected music ecosystem.
            </p>
            <p className="mt-2 text-xs font-semibold text-[#D7FF38]">
              Independent Culture. Major Sound.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/65"
          >
            <Link href="/about" className="transition hover:text-[#D7FF38]">
              About
            </Link>
            <Link href="/services" className="transition hover:text-[#D7FF38]">
              What We Do
            </Link>
            <Link href="/companies" className="transition hover:text-[#D7FF38]">
              Companies
            </Link>
            <Link href="/approach" className="transition hover:text-[#D7FF38]">
              Our Approach
            </Link>
            <Link href="/artists" className="transition hover:text-[#D7FF38]">
              Artists
            </Link>
            <Link href="/contact" className="transition hover:text-[#D7FF38]">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
          <p className="text-xs text-white/45">
            © 2026 Amity Music Group. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
