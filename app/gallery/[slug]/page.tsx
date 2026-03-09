import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EmptyStatePanel from "@/components/EmptyStatePanel";
import GalleryGroupPhotoGrid from "@/components/gallery/GalleryGroupPhotoGrid";
import { getServiceClient } from "@/lib/supabase-server";
import type { DbGalleryGroup, DbGalleryGroupPhoto } from "@/types/backend";
import { SEO_SITE_NAME, absoluteUrl } from "@/seo/meta";

type Params = { slug: string };

async function getGroupBySlug(slug: string): Promise<{ group: DbGalleryGroup | null; photos: DbGalleryGroupPhoto[] }> {
  const supabase = getServiceClient();

  const { data: group, error: groupError } = await supabase
    .from("gallery_groups")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();

  if (groupError) throw groupError;
  if (!group) return { group: null, photos: [] };

  const { data: photos, error: photosError } = await supabase
    .from("gallery_group_photos")
    .select("*")
    .eq("group_id", group.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (photosError) throw photosError;

  return {
    group: { ...group, photo_count: photos?.length || 0 },
    photos: photos || [],
  };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { group } = await getGroupBySlug(slug);

  if (!group) {
    return {
      title: `Gallery | ${SEO_SITE_NAME}`,
      description: "Explore YUP gallery photo groups.",
      alternates: { canonical: "/gallery" },
    };
  }

  const title = `${group.title} | Gallery | ${SEO_SITE_NAME}`;
  const description = group.description || `Explore photos from ${group.title}.`;
  const path = `/gallery/${group.slug}`;
  const image = group.cover_image_url.startsWith("http") ? group.cover_image_url : absoluteUrl(group.cover_image_url);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(path),
      siteName: SEO_SITE_NAME,
      images: [{ url: image, alt: group.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function GalleryGroupPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { group, photos } = await getGroupBySlug(slug);

  if (!group) notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <section
        className="relative flex min-h-[360px] items-end bg-black pt-20"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35)), url(${group.cover_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container relative z-10 mx-auto px-4 py-16 lg:px-8">
          <h1 className="font-heading text-5xl text-white md:text-6xl">{group.title}</h1>
          {group.description ? <p className="mt-4 max-w-3xl text-white/90">{group.description}</p> : null}
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {photos.length === 0 ? (
            <EmptyStatePanel
              title="No Photos In This Group Yet"
              description="This gallery group is visible, but no photos have been added yet."
              actionLabel="Back to Gallery"
              actionHref="/gallery"
            />
          ) : (
            <GalleryGroupPhotoGrid photos={photos} groupTitle={group.title} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
