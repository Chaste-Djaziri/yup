export const SEO_BASE_URL = "https://yupinitiative.com";
export const SEO_SITE_NAME = "Youth Uplift Initiative";
export const SEO_DEFAULT_IMAGE = `${SEO_BASE_URL}/yup-assets/about-header.jpg`;

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export const seoByRoute = {
  home: {
    title: "Youth Uplift Initiative | Empowering Youth in Rwanda",
    description:
      "Youth Uplift Initiative (YUP) empowers young people in Rwanda through education, community development, and sustainable programs.",
    path: "/",
  },
  about: {
    title: "About Us | Youth Uplift Initiative",
    description:
      "Learn about Youth Uplift Initiative, our mission, vision, values, and the team working to uplift youth in Rwanda.",
    path: "/about",
  },
  programs: {
    title: "Our Programs | Youth Uplift Initiative",
    description:
      "Explore YUP programs in scholarships, after-school learning, digital literacy, leadership, and community development.",
    path: "/programs",
  },
  events: {
    title: "Events & Activities | Youth Uplift Initiative",
    description:
      "Join upcoming YUP events and activities, including weekly skills sessions and youth fellowship gatherings.",
    path: "/events",
  },
  volunteer: {
    title: "Volunteer With Us | Youth Uplift Initiative",
    description:
      "Apply to volunteer with Youth Uplift Initiative and help deliver impactful youth programs across Rwanda.",
    path: "/volunteer",
  },
  gallery: {
    title: "Gallery | Youth Uplift Initiative",
    description:
      "Browse photos from Youth Uplift Initiative programs, events, and community activities.",
    path: "/gallery",
  },
  contact: {
    title: "Contact Us | Youth Uplift Initiative",
    description:
      "Get in touch with Youth Uplift Initiative for partnerships, questions, volunteering, and support opportunities.",
    path: "/contact",
  },
  donate: {
    title: "Make a Donation | Youth Uplift Initiative",
    description:
      "Support Youth Uplift Initiative through donations that expand education and community opportunities for youth in Rwanda.",
    path: "/donate",
  },
} satisfies Record<string, SeoConfig>;
