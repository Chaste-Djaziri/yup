"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import EmptyStatePanel from "@/components/EmptyStatePanel";
import { CardGridSkeleton } from "@/components/skeletons/content-loading";
import type { DbGalleryGroup } from "@/types/backend";

export default function GalleryPage() {
  const [groups, setGroups] = useState<DbGalleryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/functions/gallery-groups-list")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load gallery groups");
        return data.groups as DbGalleryGroup[];
      })
      .then((items) => {
        if (!active) return;
        setGroups(items || []);
      })
      .catch(() => {
        if (!active) return;
        setGroups([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Gallery" subtitle="Browse our photo groups and explore each gallery in detail." image="/yup-assets/gallery/IMG_3467_jpg.jpeg" />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CardGridSkeleton count={6} imageHeightClass="h-56" />
            </div>
          )}

          {!loading && groups.length === 0 && (
            <EmptyStatePanel
              title="No Gallery Groups Yet"
              description="No visible gallery groups are available right now. Groups will appear here once admins publish them."
              actionLabel="Go To Contact"
              actionHref="/contact"
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <article key={group.id} className="overflow-hidden bg-card">
                <img src={group.cover_image_url} alt={group.title} className="h-56 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-heading text-2xl">{group.title}</h3>
                  <p className="mt-2 text-sm text-foreground/80">{group.description || "No description available."}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-foreground/70">{(group.photo_count || 0).toString()} photos</p>
                  <Link href={`/gallery/${group.slug}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">View Group</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
