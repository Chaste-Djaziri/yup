"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import { ImageGallery } from "@/components/image-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GalleryPage() {
  const { language } = useLanguage()
  const t = dictionaries[language]
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader title={t.gallery.title} description={t.gallery.description} backgroundImage="/gallery-header.jpg" />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">{t.gallery.categories.all}</TabsTrigger>
              <TabsTrigger value="events">{t.gallery.categories.events}</TabsTrigger>
              <TabsTrigger value="programs">{t.gallery.categories.programs}</TabsTrigger>
              <TabsTrigger value="community">{t.gallery.categories.community}</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ImageGallery images={t.gallery.images} onImageClick={setSelectedImage} />
            </TabsContent>

            <TabsContent value="events">
              <ImageGallery
                images={t.gallery.images.filter((img) => img.category === "events")}
                onImageClick={setSelectedImage}
              />
            </TabsContent>

            <TabsContent value="programs">
              <ImageGallery
                images={t.gallery.images.filter((img) => img.category === "programs")}
                onImageClick={setSelectedImage}
              />
            </TabsContent>

            <TabsContent value="community">
              <ImageGallery
                images={t.gallery.images.filter((img) => img.category === "community")}
                onImageClick={setSelectedImage}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.gallery.share.title}</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.gallery.share.description}
              </p>
            </div>
            <div className="flex flex-col w-full max-w-sm gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={t.gallery.share.placeholder}
                  className="px-4 py-2 border rounded-md flex-1"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                  {t.gallery.share.button}
                </button>
              </div>
              <p className="text-xs text-gray-500">{t.gallery.share.note}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

