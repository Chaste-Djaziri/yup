import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = {
  ...buildMetadata(seoByRoute.faq),
  keywords: [
    "faq",
    "youth uplift initiative",
    "rwanda youth programs",
    "volunteer faq",
    "donation faq",
    "partnership faq",
  ],
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
