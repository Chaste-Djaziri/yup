import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Youth Uplift Initiative",
  description: "Admin dashboard for Youth Uplift Initiative content and submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
