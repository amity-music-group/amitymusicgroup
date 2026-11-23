import { requireAdmin } from "@/lib/admin-session";
import { getMediaFiles } from "@/lib/admin-data";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const metadata = {
  title: "Media library | Admin | Amity Music Group",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  await requireAdmin("/admin/media");
  const files = await getMediaFiles();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Media library</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
        Every image uploaded to the site-images bucket. Deleting a file does
        not rewrite any record that references its URL — an artist or
        company still pointing at a deleted image shows no image until its
        own image field is changed in its editor.
      </p>
      <div className="mt-8">
        <MediaLibrary initial={files} />
      </div>
    </div>
  );
}
