"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import type { DbGalleryImage } from "@/types/backend";
import { useEffect } from "react";

export default function GalleryPage() {
  const [images, setImages] = useState<DbGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<"all" | "events" | "programs" | "community">("all");

  useEffect(() => {
    let active = true;

    fetch("/api/functions/gallery-list")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load gallery images");
        return data.images as DbGalleryImage[];
      })
      .then((items) => {
        if (!active) return;
        setImages(items || []);
      })
      .catch(() => {
        if (!active) return;
        setImages([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredImages = useMemo(() => {
    if (category === "all") return images;
    return images.filter((image) => image.category === category);
  }, [images, category]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Gallery" subtitle="Moments from our programs, events, and community activities." image="/yup-assets/gallery/IMG_3467_jpg.jpeg" />
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {(["all", "events", "programs", "community"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={[
                  "px-4 py-2 text-xs font-bold uppercase tracking-wider",
                  category === item ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>

          {loading && <p className="text-sm text-foreground/70">Loading gallery...</p>}
          {!loading && filteredImages.length === 0 && (
            <p className="text-sm text-foreground/70">No gallery images available yet.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((image) => (
              <article key={image.id} className="overflow-hidden bg-card">
                <img src={image.image_url} alt={image.title} className="h-64 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-heading text-xl">{image.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-foreground/70">{image.category}</p>
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
