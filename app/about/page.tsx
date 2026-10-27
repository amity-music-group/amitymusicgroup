
import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Companies", href: "/companies" },
  { label: "Artists", href: "/artists" },
  { label: "Contact", href: "/contact" },
];

const values = [
  {
    number: "01",
    title: "Artist First",
    description:
      "We believe that the artist's identity, creative vision, and long-term development should remain central to the work we do.",
    color: "#D7FF38",
  },
  {
    number: "02",
    title: "Independent Culture",
    description:
      "We champion individuality, independent thinking, and the creative communities that move music and culture forward.",
    color: "#F32991",
  },
  {
    number: "03",
    title: "Built for Growth",
    description:
      "We bring creative ideas, strategic thinking, and connected music-industry capabilities together to support sustainable progress.",
    color: "#A997FF",
  },
  {
    number: "04",
    title: "Creative Collaboration",
    description:
      "We believe meaningful work happens when artists, creators, and industry professionals can work together toward a shared vision.",
    color: "#D7FF38",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#160D2C] text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#160D2C]/95 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10"
        >
          <Link
            href="/"
            aria-label="Amity Music Group home"
            className="flex shrink-0 items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4922EB] text-lg font-black text-white">
              A
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.16em] sm:text-base">
              AMITY <span className="text-[#D7FF38]">MUSIC GROUP</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.href === "/about" ? "page" : undefined}
                className={`text-sm transition-colors hover:text-[#D7FF38] ${
                  item.href === "/about"
                    ? "font-semibold text-[#D7FF38]"
                    : "text-white/75"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-[#D7FF38] px-4 py-2.5 text-xs font-bold text-[#160D2C] transition hover:bg-white sm:px-5 sm:text-sm"
          >
            Get in Touch <span aria-hidden="true">↗</span>
          </Link>
        </nav>

        <div className="flex gap-5 overflow-x-auto border-t border-white/5 px-6 py-3 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === "/about" ? "page" : undefined}
              className={`shrink-0 text-xs ${
                item.href === "/about"
                  ? "font-bold text-[#D7FF38]"
                  : "text-white/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_15%,rgba(73,34,235,0.5),transparent_45%),radial-gradient(ellipse_at_5%_90%,rgba(243,41,145,0.13),transparent_35%)]"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-36">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D7FF38]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                About Amity
              </p>
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
              Independent
              <br />
              culture.
              <br />
              <span className="text-[#D7FF38]">Major sound.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
              Amity Music Group is a music-focused creative organization built
              around artistry, collaboration, and the opportunities that emerge
              when music and business move in the same direction.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/companies"
                className="rounded-full bg-[#4922EB] px-6 py-3.5 text-sm font-semibold transition hover:bg-[#6042F5]"
              >
                Explore Our Companies <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
              >
                What We Do
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#4922EB]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#21153D] p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                  Our Philosophy
                </span>
                <span className="h-3 w-3 rounded-full bg-[#D7FF38]" />
              </div>

              <div className="my-12">
                <p className="text-3xl font-semibold leading-snug tracking-tight sm:text-4xl">
                  Different voices.
                  <br />
                  <span className="text-[#F32991]">Shared ambition.</span>
                  <br />
                  One creative future.
                </p>
              </div>

              <div className="h-px bg-white/15" />

              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="max-w-xs text-sm leading-6 text-white/60">
                  A connected approach to music, creativity, and building what
                  comes next.
                </p>
                <span className="text-4xl font-black text-[#D7FF38]">A.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:py-28 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F32991]">
            Who We Are
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            More than a name.
            <br />
            <span className="text-white/45">A bigger picture.</span>
          </h2>
        </div>

        <div className="space-y-6 text-base leading-8 text-white/70 sm:text-lg">
          <p>
            Amity Music Group brings together a broader vision for music and
            creative business. We see potential in connecting artistic
            development with thoughtful strategy, effective operations, and
            opportunities for collaboration.
          </p>
          <p>
            Our approach is designed to recognize that every artist, project,
            and creative business has its own identity. We aim to create an
            environment where those identities can develop while benefiting
            from a connected creative ecosystem.
          </p>
          <p>
            Our guiding idea is straightforward: protect what makes the work
            original, build the right foundations around it, and keep moving
            forward with purpose.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#4922EB]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-2 lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF38]">
              Our Mission
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Give creativity room to become something greater.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/85">
              We aim to connect music, creative thinking, and business strategy
              in ways that help artists and creative ventures pursue their
              ambitions with clarity, individuality, and long-term purpose.
            </p>
            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#D7FF38] transition hover:text-white"
            >
              Discover our approach <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF38]">
            What Guides Us
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Principles over promises.
          </h2>
          <p className="mt-5 leading-7 text-white/60">
            The ideas that shape how we approach creativity, relationships, and
            the work ahead.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          {values.map((value) => (
            <article
              key={value.number}
              className="bg-[#1C1033] p-7 transition-colors hover:bg-[#241443] sm:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/40">
                  {value.number}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: value.color }}
                />
              </div>
              <h3 className="mt-9 text-2xl font-semibold">{value.title}</h3>
              <p className="mt-4 leading-7 text-white/65">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Ecosystem CTA */}
      <section className="px-6 pb-20 md:pb-28 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#241443] px-7 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#4922EB]/50 blur-3xl"
          />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F32991]">
                The Amity Ecosystem
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Discover what we're building.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-white/65">
                Explore the companies, capabilities, and creative directions
                that make up the Amity vision.
              </p>
            </div>
            <Link
              href="/companies"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#D7FF38] px-6 py-4 text-sm font-bold text-[#160D2C] transition hover:bg-white"
            >
              Explore Our Companies <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <Link href="/" className="text-sm font-bold tracking-[0.16em]">
              AMITY <span className="text-[#D7FF38]">MUSIC GROUP</span>
            </Link>

            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/55 transition hover:text-[#D7FF38]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
            <p>Independent Culture. Major Sound.</p>
            <p>© {new Date().getFullYear()} Amity Music Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}