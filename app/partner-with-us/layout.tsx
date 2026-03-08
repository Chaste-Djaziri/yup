import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.partnerWithUs);

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
