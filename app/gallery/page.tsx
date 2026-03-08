import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";

const images = [
  "/yup-assets/gallery/IMG_3015_jpg.jpeg",
  "/yup-assets/gallery/IMG_3021_jpg.jpeg",
  "/yup-assets/gallery/IMG_3040_jpg.jpeg",
  "/yup-assets/gallery/IMG_3082_jpg.jpeg",
  "/yup-assets/gallery/IMG_3110_jpg.jpeg",
  "/yup-assets/gallery/IMG_3115_jpg.jpeg",
  "/yup-assets/gallery/IMG_3186_jpg.jpeg",
  "/yup-assets/gallery/IMG_3225_jpg.jpeg",
  "/yup-assets/gallery/IMG_3314_jpg.jpeg",
  "/yup-assets/gallery/IMG_3444_jpg.jpeg",
  "/yup-assets/gallery/IMG_3482_jpg.jpeg",
  "/yup-assets/gallery/IMG_3492_jpg.jpeg",
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
