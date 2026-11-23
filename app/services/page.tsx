import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceAccordion from "@/components/ServiceAccordion";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Explore Amity Music Group's music services, including recorded music, artist development, music publishing, distribution, management, international music, and live music.",
};

const process = [
  {
    title: "Understand",
    description:
      "Identify the artist, project, objectives, and opportunities before defining a direction.",
  },
  {
    title: "Develop",
    description:
      "Establish a practical strategy that aligns creative goals with business priorities.",
  },
  {
    title: "Coordinate",
    description:
      "Connect the relevant people, resources, and activities around the project.",
  },
  {
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
    <main className="min-h-screen bg-white text-[#111111]">
      {/* Page hero */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 pb-28 pt-36 sm:pt-44 lg:px-8">
          <p className="text-lg text-neutral-500">Services</p>

          <h1 className="mt-5 max-w-5xl text-[56px] font-light leading-[1.05] tracking-tight sm:text-7xl">
            More than music. A connected industry.
          </h1>

          <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
            <p className="max-w-2xl text-lg leading-8 text-neutral-600">
              Amity Music Group brings together specialized areas of the music
              business to support artists, recorded music, songwriting,
              distribution, management, creative projects, and live
              opportunities.
            </p>

            <div className="border-l-2 border-black pl-5">
              <p className="text-sm text-neutral-500">Our philosophy</p>
              <p className="mt-3 text-xl font-light leading-relaxed text-black">
                Independent culture.
                <br />
                Major sound.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            <a
              href="#services"
              className="inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Explore our services <span aria-hidden="true">↓</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Discuss an opportunity <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services — UMG-style accordion rows, not cards. */}
      <section
        id="services"
        className="scroll-mt-28 border-b border-black/10 py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-36 lg:self-start">
              <p className="text-lg text-neutral-500">Our capabilities</p>
              <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
                Areas of expertise.
              </h2>
            </div>

            <p className="max-w-md text-base leading-7 text-neutral-600 lg:pt-24">
              Explore the areas that make up the Amity Music Group ecosystem.
              The scope of any specific service depends on the company,
              project, and applicable agreement.
            </p>
          </div>

          <div className="mt-14">
            <ServiceAccordion services={services} />
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="border-b border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">How we work</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Strategy meets execution.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-neutral-600">
              Every artist and project has different needs. Our approach
              begins with understanding the opportunity and identifying the
              right next steps.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {process.map((step) => (
              <article key={step.title} className="border-t border-black/10 pt-7">
                <h3 className="text-2xl font-light text-black">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-neutral-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem banner */}
      <section className="border-b border-black/10 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">
              One connected ecosystem
            </p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Discover the companies behind the vision.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-neutral-600">
              Learn how the companies and divisions within the group
              contribute to its broader music and creative objectives.
            </p>
            <Link
              href="/labels"
              className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Explore companies <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">Start a conversation</p>
            <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Have a project in mind?{" "}
              <span className="text-neutral-400">Let&apos;s connect.</span>
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-neutral-600">
              Reach out to discuss a business inquiry, artist opportunity,
              partnership, or music-related project.
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

      <Footer />
    </main>
  );
}
