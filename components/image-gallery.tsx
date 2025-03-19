"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  src: string
  alt: string
  category: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  onImageClick: (src: string) => void
}

export function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const handleImageClick = (src: string) => {
    setLightboxImage(src)
    onImageClick(src)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="aspect-square relative rounded-md overflow-hidden cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleImageClick(image.src)}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:bg-white/10"
            onClick={closeLightbox}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Close</span>
          </Button>
          <img
            src={lightboxImage || "/placeholder.svg"}
            alt="Enlarged gallery image"
            className="max-w-full max-h-[80vh] sm:max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  )
}

