import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.faq);

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
