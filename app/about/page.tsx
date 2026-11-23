import Link from "next/link";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";

const values = [
  {
    title: "Artist First",
    description:
      "We believe that the artist's identity, creative vision, and long-term development should remain central to the work we do.",
  },
  {
    title: "Independent Culture",
    description:
      "We champion individuality, independent thinking, and the creative communities that move music and culture forward.",
  },
  {
    title: "Built for Growth",
    description:
      "We bring creative ideas, strategic thinking, and connected music-industry capabilities together to support sustainable progress.",
  },
  {
    title: "Creative Collaboration",
    description:
      "We believe meaningful work happens when artists, creators, and industry professionals can work together toward a shared vision.",
  },
];

export default async function AboutPage() {
  // Copy comes from Supabase when configured; the static copy in
  // lib/content.ts is the fallback (the site's current words).
  const site = await getSiteSettings();

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      {/* Hero */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 pt-36 md:pb-36 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:pt-44">
          <div>
            <p className="text-lg text-neutral-500">About</p>

            <h1 className="mt-5 max-w-4xl text-[56px] font-light leading-[1.05] tracking-tight sm:text-7xl">
              Independent culture. Major sound.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
              {site.aboutPageIntro}
            </p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href="/labels"
                className="inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
              >
                Explore our companies <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
              >
                What we do <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg rounded-2xl bg-[#eee] p-8 sm:p-10">
            <p className="text-sm text-neutral-500">Our philosophy</p>
            <p className="mt-10 text-3xl font-light leading-[1.2] tracking-tight text-black sm:text-4xl">
              Different voices.
              <br />
              Shared ambition.
              <br />
              One creative future.
            </p>
            <div className="mt-10 border-t border-black/10 pt-6">
              <p className="max-w-xs text-base leading-7 text-neutral-600">
                A connected approach to music, creativity, and building what
                comes next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are — UMG sticky-heading pattern: heading stays on the
          left while the statement flows on the right. */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-28 sm:py-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <p className="text-lg text-neutral-500">Who we are</p>
          <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
            More than a name. <span className="text-neutral-400">A bigger picture.</span>
          </h2>
        </div>

        <div className="max-w-3xl space-y-6 text-xl font-light leading-9 text-neutral-600">
          {site.aboutPageBody.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-black/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:py-28 lg:grid-cols-2 lg:items-start lg:px-8">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">Our mission</p>
            <h2 className="mt-5 max-w-xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              {site.missionTitle}
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-neutral-600">
              {site.missionBody}
            </p>
            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
            >
              Discover our approach <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-28 sm:py-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <p className="text-lg text-neutral-500">What guides us</p>
          <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
            Principles over promises.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-neutral-600">
            The ideas that shape how we approach creativity, relationships, and
            the work ahead.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <article key={value.title} className="rounded-xl bg-[#eee] p-8 sm:p-9">
              <h3 className="text-2xl font-light text-black">
                {value.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-neutral-600">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Ecosystem CTA — the Global Territories call to action: the
          territories themselves live on /labels. */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 sm:pb-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <p className="text-lg text-neutral-500">The Amity ecosystem</p>
          <h2 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
            Discover what we&apos;re building.
          </h2>
        </div>
        <div className="max-w-2xl">
          <p className="text-lg leading-8 text-neutral-600">
            Explore the companies, capabilities, and creative directions
            that make up the Amity vision.
          </p>
          <Link
            href="/labels"
            className="mt-8 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
          >
            Explore our companies <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <Footer footerText={site.footerText} tagline={site.tagline} />
    </main>
  );
}
