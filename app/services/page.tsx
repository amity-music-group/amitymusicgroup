
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Explore Amity Music Group's music services, including recorded music, artist development, music publishing, distribution, management, international music, and live music.",
};

const services = [
  {
    number: "01",
    title: "Recorded Music",
    subtitle: "RECORDS & RELEASES",
    description:
      "Supporting the development, release, and long-term growth of recorded music projects. Our recorded-music focus brings artists, releases, and catalog development into a connected music ecosystem.",
    offerings: [
      "Recorded music releases",
      "Artist and project development",
      "Release planning and coordination",
      "Catalog development",
    ],
  },
  {
    number: "02",
    title: "Artist Development",
    subtitle: "BUILDING ARTIST CAREERS",
    description:
      "Helping artists develop their identity, direction, and long-term career strategy. We focus on building a foundation that connects creative vision with practical business planning.",
    offerings: [
      "Artist identity and positioning",
      "Career planning",
      "Creative direction",
      "Long-term development strategy",
    ],
  },
  {
    number: "03",
    title: "Music Publishing",
    subtitle: "SONGWRITERS & COPYRIGHTS",
    description:
      "Focused on the business of compositions, songwriting, and music copyrights. Publishing operations can support the organization and development of musical works and songwriter opportunities.",
    offerings: [
      "Songwriter and composition development",
      "Music catalog organization",
      "Copyright-focused administration planning",
      "Publishing opportunities",
    ],
  },
  {
    number: "04",
    title: "Music Distribution",
    subtitle: "REACHING DIGITAL AUDIENCES",
    description:
      "Supporting the delivery and release coordination of music to digital platforms. Distribution planning is part of helping music reach listeners and supporting organized release operations.",
    offerings: [
      "Digital release planning",
      "Distribution coordination",
      "Release metadata preparation",
      "Catalog delivery workflows",
    ],
  },
  {
    number: "05",
    title: "Artist Management",
    subtitle: "STRATEGY & CAREER SUPPORT",
    description:
      "Connecting creative priorities with professional planning, communication, and business development. Management needs are shaped around each artist's circumstances and agreed working relationship.",
    offerings: [
      "Career and business strategy",
      "Professional opportunity planning",
      "Team and project coordination",
      "Artist brand development",
    ],
  },
  {
    number: "06",
    title: "International Music",
    subtitle: "CROSS-MARKET OPPORTUNITIES",
    description:
      "Exploring relationships and opportunities across music markets. International initiatives are intended to help connect creative projects with broader audiences and industry networks.",
    offerings: [
      "International relationship development",
      "Cross-market strategy",
      "Global audience opportunities",
      "International project coordination",
    ],
  },
  {
    number: "07",
    title: "Live Music",
    subtitle: "TOURING & LIVE EXPERIENCES",
    description:
      "Supporting the business and coordination around live music, performances, and touring opportunities through a connected approach to artists, events, and industry relationships.",
    offerings: [
      "Touring and live-event planning",
      "Booking-related opportunities",
      "Live music project coordination",
      "Artist and event partnerships",
    ],
  },
  {
    number: "08",
    title: "Creative & Media",
    subtitle: "CONTENT, CULTURE & BRAND",
    description:
      "Connecting music with the wider creative world through content, storytelling, brand development, and media initiatives that help artists and projects communicate with their audiences.",
    offerings: [
      "Creative campaign planning",
      "Content and media strategy",
      "Artist storytelling",
      "Brand and partnership concepts",
    ],
  },
];

const process = [
  {
    number: "01",
    title: "Understand",
    description:
      "Identify the artist, project, objectives, and opportunities before defining a direction.",
  },
  {
    number: "02",
    title: "Develop",
    description:
      "Establish a practical strategy that aligns creative goals with business priorities.",
  },
  {
    number: "03",
    title: "Coordinate",
    description:
      "Connect the relevant people, resources, and activities around the project.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "Focus on sustainable progress, stronger relationships, and long-term development.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#4922EB] text-white">
      {/* Page hero */}
      <section className="relative border-b border-white/15">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-[#F32991]/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[#D7FF38]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-[#D7FF38]">
            <span className="h-2 w-2 rounded-full bg-[#F32991]" />
            Amity Music Group / Services
          </p>

          <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            MORE THAN
            <br />
            <span className="text-[#D7FF38]">MUSIC.</span>
            <br />
            A CONNECTED
            <br />
            INDUSTRY.
          </h1>

          <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
            <p className="max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Amity Music Group brings together specialized areas of the music
              business to support artists, recorded music, songwriting,
              distribution, management, creative projects, and live
              opportunities.
            </p>

            <div className="border-l-2 border-[#F32991] pl-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                Our philosophy
              </p>
              <p className="mt-3 text-xl font-bold leading-relaxed">
                Independent Culture.
                <br />
                <span className="text-[#D7FF38]">Major Sound.</span>
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="#services"
              className="inline-flex items-center justify-center bg-[#D7FF38] px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
            >
              Explore our services <span className="ml-3">↓</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/40 px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
            >
              Discuss an opportunity <span className="ml-3">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section
        id="services"
        className="scroll-mt-28 border-b border-white/15 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D7FF38]">
                Our capabilities
              </p>
              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
                Areas of
                <br />
                <span className="text-white/50">expertise.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/70">
              Explore the areas that make up the Amity Music Group ecosystem.
              The scope of any specific service depends on the company,
              project, and applicable agreement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, index) => (
              <article
                key={service.number}
                className="group relative overflow-hidden border border-white/15 bg-[#160D2C] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D7FF38]/70 sm:p-9"
              >
                <div
                  className={`absolute left-0 top-0 h-1 transition-all duration-300 group-hover:w-full ${
                    index % 2 === 0
                      ? "w-16 bg-[#D7FF38]"
                      : "w-16 bg-[#F32991]"
                  }`}
                />

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.25em] text-[#D7FF38]">
                    {service.number}
                  </span>
                  <span className="text-right text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">
                    {service.subtitle}
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-black tracking-tight sm:text-3xl">
                  {service.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/70">
                  {service.description}
                </p>

                <div className="mt-7 border-t border-white/10 pt-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Areas of focus
                  </p>

                  <ul className="mt-4 space-y-3">
                    {service.offerings.map((offering) => (
                      <li
                        key={offering}
                        className="flex items-start gap-3 text-sm text-white/85"
                      >
                        <span className="mt-1 text-[#D7FF38]">↗</span>
                        <span>{offering}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#D7FF38] transition hover:text-[#F32991]"
                >
                  Make an inquiry <span>↗</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="border-b border-white/15 bg-[#160D2C] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F32991]">
              How we work
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              Strategy meets
              <br />
              <span className="text-[#D7FF38]">execution.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              Every artist and project has different needs. Our approach
              begins with understanding the opportunity and identifying the
              right next steps.
            </p>
          </div>

          <div className="mt-14 grid gap-0 border-y border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <article
                key={step.number}
                className={`py-8 sm:px-6 sm:py-10 ${
                  index > 0 ? "border-t border-white/15 sm:border-l" : ""
                } ${
                  index === 2
                    ? "lg:border-l"
                    : index === 3
                      ? "lg:border-l"
                      : ""
                }`}
              >
                <p className="text-xs font-bold tracking-[0.25em] text-[#D7FF38]">
                  STEP {step.number}
                </p>
                <h3 className="mt-7 text-2xl font-bold">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem banner */}
      <section className="border-b border-white/15 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 border border-white/20 bg-[#160D2C] p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center lg:p-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F32991]">
                One connected ecosystem
              </p>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                Discover the companies
                <br />
                <span className="text-[#D7FF38]">behind the vision.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
                Learn how the companies and divisions within the group
                contribute to its broader music and creative objectives.
              </p>
            </div>

            <Link
              href="/companies"
              className="inline-flex items-center justify-center gap-3 bg-[#D7FF38] px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
            >
              Explore companies <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D7FF38]">
            Start a conversation
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                Have a project in mind?
                <br />
                <span className="text-white/50">Let&apos;s connect.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">
                Reach out to discuss a business inquiry, artist opportunity,
                partnership, or music-related project.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-[#D7FF38] px-8 py-5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#160D2C] transition hover:bg-[#F32991] hover:text-white"
            >
              Contact Amity <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-[#160D2C]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/amity-logo.jpg"
                alt="Amity Music Group logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-sm font-bold tracking-[0.2em]">
                AMITY MUSIC GROUP
              </span>
            </Link>
            <p className="mt-3 text-xs text-white/50">
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
            <Link href="/services" className="text-[#D7FF38]">
              Services
            </Link>
            <Link href="/approach" className="transition hover:text-[#D7FF38]">
              Our Approach
            </Link>
            <Link href="/companies" className="transition hover:text-[#D7FF38]">
              Companies
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
          <p className="text-xs text-white/40">
            © 2026 Amity Music Group. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
