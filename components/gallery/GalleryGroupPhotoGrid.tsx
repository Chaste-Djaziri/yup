"use client";

import { useEffect, useState } from "react";
import type { DbGalleryGroupPhoto } from "@/types/backend";

type Props = {
  photos: DbGalleryGroupPhoto[];
  groupTitle: string;
};

export default function GalleryGroupPhotoGrid({ photos, groupTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activePhoto = activeIndex === null ? null : photos[activeIndex] || null;

  useEffect(() => {
    if (activePhoto === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((prev) => (prev === null ? 0 : Math.min(prev + 1, photos.length - 1)));
      if (event.key === "ArrowLeft") setActiveIndex((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activePhoto, photos.length]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => {
          const hasTitle = Boolean(photo.title && photo.title.trim());
          return (
            <article key={photo.id} className="overflow-hidden bg-card">
              <button type="button" onClick={() => setActiveIndex(index)} className="block w-full">
                <img src={photo.image_url} alt={photo.title || groupTitle} className="h-72 w-full object-cover" />
              </button>
              {hasTitle ? (
                <div className="p-4">
                  <h2 className="font-heading text-xl">{photo.title}</h2>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {activePhoto ? (
        <div className="fixed inset-0 z-[100] bg-black/95 p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 border border-white/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white"
          >
            Close
          </button>
          <div className="flex h-full w-full items-center justify-center">
            <img src={activePhoto.image_url} alt={activePhoto.title || groupTitle} className="max-h-full max-w-full object-contain" />
          </div>
          {activePhoto.title && activePhoto.title.trim() ? (
            <div className="absolute bottom-4 left-4 right-4 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-wider">{activePhoto.title}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
