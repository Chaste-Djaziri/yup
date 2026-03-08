import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.events);

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
