import Link from "next/link";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";

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
    color: "#D7FF38",
  },
  {
    number: "04",
    title: "Creative Collaboration",
    description:
      "We believe meaningful work happens when artists, creators, and industry professionals can work together toward a shared vision.",
    color: "#F32991",
  },
];

export default async function AboutPage() {
  // Copy comes from Supabase when configured; the static copy in
  // lib/content.ts is the fallback (the site's current words).
  const site = await getSiteSettings();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Hero */}
      <section className="relative isolate border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-36">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D7FF38]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                About Amity
              </p>
            </div>

            <h1 className="max-w-4xl font-display text-6xl uppercase leading-[0.9] tracking-[0.01em] sm:text-7xl lg:text-8xl">
              Independent
              <br />
              culture.
              <br />
              <span className="text-[#D7FF38]">Major sound.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
              {site.aboutPageIntro}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/companies"
                className="inline-flex items-center justify-center bg-white px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
              >
                Explore Our Companies <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-[#D7FF38] hover:text-[#D7FF38]"
              >
                What We Do
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative overflow-hidden border border-white/10 bg-[#111111] p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                  Our Philosophy
                </span>
                <span className="h-2.5 w-2.5 bg-[#D7FF38]" />
              </div>

              <div className="my-12">
                <p className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] sm:text-4xl">
                  Different voices.
                  <br />
                  <span className="text-[#F32991]">Shared ambition.</span>
                  <br />
                  One creative future.
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="max-w-xs text-sm leading-6 text-white/60">
                  A connected approach to music, creativity, and building what
                  comes next.
                </p>
                <span className="font-display text-4xl text-[#D7FF38]">A.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:py-28 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:px-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F32991]">
            Who We Are
          </p>
          <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] sm:text-6xl">
            More than a name.
            <br />
            <span className="text-white/40">A bigger picture.</span>
          </h2>
        </div>

        <div className="space-y-6 text-base leading-8 text-white/60 sm:text-lg">
          {site.aboutPageBody.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-white/10 bg-[#111111]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-2 lg:items-center lg:px-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
              Our Mission
            </p>
            <h2 className="mt-5 max-w-xl font-display text-4xl uppercase leading-[0.95] tracking-[0.01em] sm:text-6xl">
              {site.missionTitle}
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/60">
              {site.missionBody}
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
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
            What Guides Us
          </p>
          <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">
            Principles over promises.
          </h2>
          <p className="mt-5 leading-7 text-white/60">
            The ideas that shape how we approach creativity, relationships, and
            the work ahead.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
          {values.map((value) => (
            <article
              key={value.number}
              className="bg-[#111111] p-7 transition-colors hover:bg-[#141414] sm:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/40">
                  {value.number}
                </span>
                <span
                  className="h-2.5 w-2.5"
                  style={{ backgroundColor: value.color }}
                />
              </div>
              <h3 className="mt-9 font-display text-2xl uppercase tracking-[0.01em]">
                {value.title}
              </h3>
              <p className="mt-4 leading-7 text-white/60">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Ecosystem CTA */}
      <section className="px-6 pb-20 md:pb-28 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden border border-white/10 bg-[#111111] px-7 py-12 sm:px-12 sm:py-16">
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F32991]">
                The Amity Ecosystem
              </p>
              <h2 className="mt-5 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
                Discover what we&apos;re building.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-white/60">
                Explore the companies, capabilities, and creative directions
                that make up the Amity vision.
              </p>
            </div>
            <Link
              href="/companies"
              className="inline-flex shrink-0 items-center justify-center gap-3 bg-white px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
            >
              Explore Our Companies <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer footerText={site.footerText} tagline={site.tagline} />
    </main>
  );
}
