import { getArtists } from "@/lib/content";

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <main className="min-h-screen bg-[#160D2C] px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#D7FF38]">
          Amity Music Group
        </p>
        <h1 className="text-4xl font-bold md:text-6xl">Artists & Releases</h1>
        <div className="mt-8 h-1 w-24 bg-[#F32991]" />
        <p className="mt-6 text-lg text-white/70">
          Independent Culture. Major Sound.
        </p>

        {artists.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <article
                key={artist.slug}
                className="group relative overflow-hidden border border-white/15 bg-[#4922EB]/20 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D7FF38]/70"
              >
                {artist.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="mb-6 aspect-square w-full rounded-xl object-cover"
                  />
                ) : null}
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF38]">
                  {artist.genre || "Artist"}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight">
                  {artist.name}
                </h2>
                {artist.location ? (
                  <p className="mt-1 text-sm text-white/50">{artist.location}</p>
                ) : null}
                {artist.description ? (
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {artist.description}
                  </p>
                ) : null}
                {artist.bio ? (
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {artist.bio}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.16em]">
                  {artist.website ? (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D7FF38] transition hover:text-[#F32991]"
                    >
                      Website ↗
                    </a>
                  ) : null}
                  {artist.instagram ? (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D7FF38] transition hover:text-[#F32991]"
                    >
                      Instagram ↗
                    </a>
                  ) : null}
                  {artist.spotify ? (
                    <a
                      href={artist.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D7FF38] transition hover:text-[#F32991]"
                    >
                      Spotify ↗
                    </a>
                  ) : null}
                  {artist.youtube ? (
                    <a
                      href={artist.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D7FF38] transition hover:text-[#F32991]"
                    >
                      YouTube ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
