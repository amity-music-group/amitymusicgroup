import Footer from "@/components/Footer";
import { getArtists } from "@/lib/content";

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
          Amity Music Group
        </p>
        <h1 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">
          Artists &amp; Releases
        </h1>
        <div className="mt-8 h-[3px] w-24 bg-[#F32991]" />
        <p className="mt-6 text-lg text-white/60">
          Independent Culture. Major Sound.
        </p>

        {artists.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <article
                key={artist.slug}
                className="group relative overflow-hidden border border-white/10 bg-[#111111] transition duration-300 hover:border-white/40"
              >
                <div className="absolute left-0 top-0 z-10 h-[3px] w-16 bg-[#D7FF38] transition-all duration-300 group-hover:w-full" />
                {artist.image ? (
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D7FF38]">
                    {artist.genre || "Artist"}
                  </p>
                  <h2 className="mt-3 font-display text-2xl uppercase tracking-[0.01em]">
                    {artist.name}
                  </h2>
                  {artist.location ? (
                    <p className="mt-1 text-sm text-white/50">{artist.location}</p>
                  ) : null}
                  {artist.description ? (
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      {artist.description}
                    </p>
                  ) : null}
                  {artist.bio ? (
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      {artist.bio}
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.16em]">
                    {artist.website ? (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white transition hover:text-[#D7FF38]"
                      >
                        Website ↗
                      </a>
                    ) : null}
                    {artist.instagram ? (
                      <a
                        href={artist.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white transition hover:text-[#D7FF38]"
                      >
                        Instagram ↗
                      </a>
                    ) : null}
                    {artist.spotify ? (
                      <a
                        href={artist.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white transition hover:text-[#D7FF38]"
                      >
                        Spotify ↗
                      </a>
                    ) : null}
                    {artist.youtube ? (
                      <a
                        href={artist.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white transition hover:text-[#D7FF38]"
                      >
                        YouTube ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <Footer />
    </main>
  );
}
