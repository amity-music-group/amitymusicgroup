import Footer from "@/components/Footer";
import { getArtists } from "@/lib/content";

// A photo is only a photo when the image field holds an actual image
// URL. A website address is not a picture and is never rendered as
// one — those artists show their name as a text mark instead.
function isImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (clean.includes("/storage/v1/object/public/")) return true;
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)$/.test(clean);
}

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-36 lg:px-8 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-lg text-neutral-500">Amity Music Group</p>
            <h1 className="mt-5 text-[56px] font-light leading-[1.05] tracking-tight">
              Artists &amp; releases
            </h1>
            <div className="mt-8 h-px w-24 bg-black" />
          </div>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600 lg:pt-24">
            Artists and releases from across the Amity ecosystem.
          </p>
        </div>

        {artists.length > 0 ? (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <article key={artist.slug} className="group">
                {isImageUrl(artist.image) ? (
                  <div className="overflow-hidden rounded-xl bg-[#eee]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-[#eee] p-8">
                    <span className="text-center text-2xl font-light leading-snug text-black">
                      {artist.name}
                    </span>
                  </div>
                )}
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">
                      {artist.genre || "Artist"}
                    </p>
                    <h2 className="mt-2 text-2xl font-light text-black">
                      {artist.name}
                    </h2>
                    {artist.location ? (
                      <p className="mt-1 text-sm text-neutral-500">{artist.location}</p>
                    ) : null}
                  </div>
                  {artist.website ? (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${artist.name} — visit website`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee] text-black transition hover:bg-black hover:text-white"
                    >
                      ↗
                    </a>
                  ) : null}
                </div>
                {artist.description ? (
                  <p className="mt-4 text-base leading-7 text-neutral-600">
                    {artist.description}
                  </p>
                ) : null}
                {artist.bio ? (
                  <p className="mt-4 text-base leading-7 text-neutral-600">
                    {artist.bio}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-base font-medium">
                  {artist.website ? (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black transition hover:text-neutral-500"
                    >
                      Website ↗
                    </a>
                  ) : null}
                  {artist.instagram ? (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black transition hover:text-neutral-500"
                    >
                      Instagram ↗
                    </a>
                  ) : null}
                  {artist.spotify ? (
                    <a
                      href={artist.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black transition hover:text-neutral-500"
                    >
                      Spotify ↗
                    </a>
                  ) : null}
                  {artist.youtube ? (
                    <a
                      href={artist.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black transition hover:text-neutral-500"
                    >
                      YouTube ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-14 text-lg text-neutral-500">
            No artists published yet.
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}
