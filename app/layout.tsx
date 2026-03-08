import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Youth Uplift Initiative | Empowering Youth in Rwanda",
    template: "%s | Youth Uplift Initiative",
  },
  description:
    "Youth Uplift Initiative (YUP) empowers young people in Rwanda through education, community development, and sustainable programs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
