import { requireAdmin } from "@/lib/admin-session";
import { getAllArtists } from "@/lib/content";
import ArtistsEditor from "@/components/admin/ArtistsEditor";

export const metadata = {
  title: "Artists | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminArtistsPage() {
  await requireAdmin("/admin/artists");
  const artists = await getAllArtists();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">
        Artists &amp; Releases
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
        Artists listed on the public Artists page. Hidden artists stay here
        so they can be edited or shown again — hiding never deletes.
      </p>
      <div className="mt-8">
        <ArtistsEditor initial={artists} />
      </div>
    </div>
  );
}
