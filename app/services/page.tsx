import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Explore Amity Music Group's music services, including recorded music, artist development, music publishing, distribution, management, international music, and live music.",
};

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

export default async function ServicesPage() {
  // Services come from Supabase when configured; the static list in
  // lib/content.ts is the fallback (the site's current copy).
  const services = await getServices();
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Page hero */}
      <section className="relative border-b border-white/10">
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
            <span className="h-2 w-2 bg-[#F32991]" />
            Amity Music Group / Services
          </p>

          <h1 className="mt-8 max-w-5xl font-display text-6xl uppercase leading-[0.9] tracking-[0.01em] sm:text-7xl lg:text-8xl">
            MORE THAN
            <br />
            <span className="text-[#D7FF38]">MUSIC.</span>
            <br />
            A CONNECTED
            <br />
            INDUSTRY.
          </h1>

          <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
            <p className="max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Amity Music Group brings together specialized areas of the music
              business to support artists, recorded music, songwriting,
              distribution, management, creative projects, and live
              opportunities.
            </p>

            <div className="border-l-2 border-[#F32991] pl-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                Our philosophy
              </p>
              <p className="mt-3 font-display text-xl uppercase leading-relaxed tracking-[0.01em]">
                Independent Culture.
                <br />
                <span className="text-[#D7FF38]">Major Sound.</span>
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="#services"
              className="inline-flex items-center justify-center bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
            >
              Explore our services <span className="ml-3">↓</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/20 px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
            >
              Discuss an opportunity <span className="ml-3">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section
        id="services"
        className="scroll-mt-28 border-b border-white/10 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                Our capabilities
              </p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
                Areas of
                <br />
                <span className="text-white/40">expertise.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/60">
              Explore the areas that make up the Amity Music Group ecosystem.
              The scope of any specific service depends on the company,
              project, and applicable agreement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.number}
                className="group relative overflow-hidden border border-white/10 bg-[#111111] p-7 transition duration-300 hover:border-white/40 sm:p-9"
              >
                <div className="absolute left-0 top-0 h-[3px] w-16 bg-[#D7FF38] transition-all duration-300 group-hover:w-full" />

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.25em] text-[#D7FF38]">
                    {service.number}
                  </span>
                  <span className="text-right text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 sm:text-[10px]">
                    {service.subtitle}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-2xl uppercase tracking-[0.01em] sm:text-3xl">
                  {service.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  {service.description}
                </p>

                <div className="mt-7 border-t border-white/10 pt-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
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
                  className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:text-[#D7FF38]"
                >
                  Make an inquiry <span>↗</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="border-b border-white/10 bg-[#111111] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F32991]">
              How we work
            </p>
            <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
              Strategy meets
              <br />
              <span className="text-[#D7FF38]">execution.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
              Every artist and project has different needs. Our approach
              begins with understanding the opportunity and identifying the
              right next steps.
            </p>
          </div>

          <div className="mt-14 grid gap-0 border-y border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <article
                key={step.number}
                className={`py-8 sm:px-6 sm:py-10 ${
                  index > 0 ? "border-t border-white/10 sm:border-l" : ""
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
                <h3 className="mt-7 font-display text-2xl uppercase tracking-[0.01em]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem banner */}
      <section className="border-b border-white/10 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 border border-white/10 bg-[#111111] p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center lg:p-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F32991]">
                One connected ecosystem
              </p>
              <h2 className="mt-5 font-display text-3xl uppercase leading-[0.95] sm:text-5xl">
                Discover the companies
                <br />
                <span className="text-[#D7FF38]">behind the vision.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60">
                Learn how the companies and divisions within the group
                contribute to its broader music and creative objectives.
              </p>
            </div>

            <Link
              href="/companies"
              className="inline-flex items-center justify-center gap-3 bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
            >
              Explore companies <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
            Start a conversation
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-4xl font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
                Have a project in mind?
                <br />
                <span className="text-white/40">Let&apos;s connect.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
                Reach out to discuss a business inquiry, artist opportunity,
                partnership, or music-related project.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white px-8 py-5 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
            >
              Contact Amity <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
