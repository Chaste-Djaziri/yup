import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.contact);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
