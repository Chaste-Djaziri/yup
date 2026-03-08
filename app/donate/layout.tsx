import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.donate);

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
