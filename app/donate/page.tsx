import type { Metadata } from "next"
import { DonateClient } from "@/components/donate-client"

export const metadata: Metadata = {
  title: "Make a Donation | Youth Uplift Initiative",
  description:
    "Your generosity helps us continue our mission of empowering youth in Rwanda through education and community development.",
}

export default function DonatePage() {
  return <DonateClient />
}

