// components/image-gallery.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { memo } from "react";

type GalleryImage = {
  src: string
  alt: string
  category: string
}

export const ImageGallery = memo(function ImageGallery({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick?: (src: string | null) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([])
  const [page, setPage] = useState(1)
  const imagesPerPage = 8

  // Load images in batches
  useEffect(() => {
    setVisibleImages(images.slice(0, page * imagesPerPage))
  }, [images, page])

  // Intersection observer for infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Load more images when the last row comes into view
  useEffect(() => {
    if (inView && visibleImages.length < images.length) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [inView, visibleImages.length, images.length])

  const handleImageClick = (src: string) => {
    setSelectedImage(src)
    if (onImageClick) {
      onImageClick(src)
    }
  }

  const closeModal = () => {
    setSelectedImage(null)
    if (onImageClick) {
      onImageClick(null)
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleImages.map((image, index) => (
          <motion.div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index % 8) * 0.05 }}
            onClick={() => handleImageClick(image.src)}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQvhAAAAABJRU5ErkJggg=="
            />
          </motion.div>
        ))}
      </div>

      {/* Loading indicator */}
      {visibleImages.length < images.length && (
        <div ref={ref} className="flex justify-center mt-8 pb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Enlarged gallery image"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-auto mx-auto"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
});
