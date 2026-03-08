import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.volunteer);

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
