import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";

const images = [
  "/yup-assets/gallery/IMG_3467_jpg.jpeg",
  "/yup-assets/gallery/IMG_3482_jpg.jpeg",
  "/yup-assets/gallery/IMG_3496_jpg.jpeg",
  "/yup-assets/gallery/IMG_3544.jpeg",
  "/yup-assets/gallery/IMG_3578.jpeg",
  "/yup-assets/gallery/IMG_3642.jpeg",
  "/yup-assets/gallery/IMG_3667.jpeg",
  "/yup-assets/gallery/IMG_3709.jpeg",
  "/yup-assets/gallery/IMG_3862.jpeg",
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Gallery" subtitle="Moments from our programs, events, and community activities." image="/yup-assets/gallery-header.jpg" />
      <section className="bg-background py-16"><div className="container mx-auto px-4 lg:px-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((src) => (<img key={src} src={src} alt="YUP activity" className="h-64 w-full object-cover" />))}</div></div></section>
      <Footer />
    </div>
  );
}
