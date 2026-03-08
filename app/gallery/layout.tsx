import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.gallery);

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
