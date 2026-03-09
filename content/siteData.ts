export type NavItem = {
  label: string;
  href: string;
};

export type Program = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  outcomes: string[];
  category: string;
  image: string;
  ctaLabel: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  socials: {
    instagram?: string;
    gmail?: string;
    linkedin?: string;
    phone?: string;
  };
};

export const siteData = {
  organization: {
    name: "Youth Uplift Initiative",
    shortName: "YUP",
    mission:
      "Youth Uplift Initiative (YUP) empowers young people in Rwanda through education, community development, and sustainable programs that create lasting change.",
    vision:
      "A Rwanda where all youth have access to quality education and opportunities to reach their full potential.",
    email: "contact.yupinitiative@gmail.com",
    phone: "+250 788 749 709",
    location: "Norrsken House, Kigali, Rwanda",
    socials: [
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Events", href: "/events" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Partner", href: "/partner-with-us" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],
  footerColumns: [
    {
      heading: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Programs", href: "/programs" },
        { label: "Events", href: "/events" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      heading: "Get Involved",
      links: [
        { label: "Volunteer", href: "/volunteer" },
        { label: "Partner With Us", href: "/partner-with-us" },
        { label: "Donate", href: "/donate" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Programs",
      links: [
        { label: "Browse Programs", href: "/programs" },
        { label: "Volunteer", href: "/volunteer" },
        { label: "Donate", href: "/donate" },
      ],
    },
  ],
  values: [
    {
      title: "Compassion",
      description: "We treat everyone with dignity, respect, and understanding.",
    },
    {
      title: "Community",
      description: "We work with local communities to build sustainable solutions.",
    },
    {
      title: "Action",
      description: "We take meaningful steps that create real impact in youth lives.",
    },
  ],
  impactStats: [
    { label: "Students Supported", value: "1,200+" },
    { label: "Communities Served", value: "15+" },
    { label: "Active Volunteers", value: "300+" },
    { label: "Community Projects", value: "45+" },
  ],
  teamMembers: [
    {
      name: "Axel Karambizi",
      role: "Founder and Head of Partnerships",
      image: "/yup-assets/people/axel.jpeg",
      socials: {
        gmail: "mailto:ganzaxcelo@gmail.com",
        linkedin: "https://www.linkedin.com/in/axel-karambizi-1633922a7/",
      },
    },
    {
      name: "Maniragaba Elissa",
      role: "Chief Advisor",
      image: "/yup-assets/people/boston.jfif",
      socials: {
        gmail: "mailto:bostonbravo56@gmail.com",
        phone: "tel:+250793095297",
      },
    },
    {
      name: "Ngabonziza Danny",
      role: "Co-Founder",
      image: "/yup-assets/people/danny.jpeg",
      socials: { instagram: "#", gmail: "mailto:placeholder@yupinitiative.com", linkedin: "#" },
    },
    {
      name: "Rukundo Joseph",
      role: "Co-Founder",
      image: "/yup-assets/people/joe.jpeg",
      socials: {
        gmail: "mailto:rukundojosephtuyishime@gmail.com",
        linkedin: "https://www.linkedin.com/in/tuyishime-rukundo-joseph-96017b288/",
      },
    },
    {
      name: "GISUBIZO KELLY",
      role: "Advisor and Operation manager",
      image: "/yup-assets/people/kelly.jpeg",
      socials: {
        gmail: "mailto:kellydigitalmarketing2@gmail.com",
        linkedin: "https://www.linkedin.com/me?trk=p_mwlite_profile_view-secondary_nav",
      },
    },
    {
      name: "TETA NELLY AURORE",
      role: "Community Manager",
      image: "/yup-assets/people/aurore.jpeg",
      socials: {
        gmail: "mailto:tnaceo101@gmail.com",
        linkedin: "https://www.linkedin.com/in/t-na-8b6998384?trk=contact-info",
      },
    },
    {
      name: "Chaste Djaziri",
      role: "Software Developer",
      image: "/yup-assets/people/chaste.JPG",
      socials: {
        instagram: "https://www.instagram.com/chaste_djaziri/",
        gmail: "mailto:habimanahirwa@gmail.com",
        linkedin: "https://rw.linkedin.com/in/chaste-djaziri",
      },
    },
  ] as TeamMember[],
  programs: [
    {
      slug: "education-scholarships",
      title: "Education Scholarships",
      summary:
        "Comprehensive scholarships for talented students from disadvantaged backgrounds.",
      description:
        "We cover tuition, books, uniforms, and mentorship so students can stay focused on learning and long-term growth.",
      outcomes: [
        "Increased school retention and completion",
        "Reduced financial barriers to education",
        "Mentorship support for academic success",
      ],
      category: "Education",
      image: "/yup-assets/programs/scholarship.jpg",
      ctaLabel: "Support Scholarships",
    },
    {
      slug: "after-school-programs",
      title: "After-School Programs",
      summary:
        "Tutoring, arts, sports, and leadership activities beyond classroom hours.",
      description:
        "Our after-school sessions keep youth engaged in safe spaces while strengthening learning outcomes and social development.",
      outcomes: [
        "Improved academic support",
        "Safe structured learning time",
        "Leadership and teamwork development",
      ],
      category: "Youth Development",
      image: "/yup-assets/programs/after-school.jpg",
      ctaLabel: "Join After-School Program",
    },
    {
      slug: "digital-literacy",
      title: "Digital Literacy",
      summary:
        "Computer skills, coding exposure, and digital entrepreneurship foundations for young people.",
      description:
        "We equip youth with practical technology skills through structured training, labs, and guided projects.",
      outcomes: [
        "Stronger technology confidence",
        "Increased access to digital opportunities",
        "Career-ready foundational ICT skills",
      ],
      category: "Technology",
      image: "/yup-assets/programs/digital-literacy.jpg",
      ctaLabel: "Back Digital Literacy",
    },
    {
      slug: "community-development",
      title: "Community Development",
      summary:
        "Local development projects focused on infrastructure, water access, and community resilience.",
      description:
        "We collaborate with local stakeholders on practical projects that improve quality of life and build shared ownership.",
      outcomes: [
        "Improved local infrastructure",
        "Community-led project planning",
        "Sustainable long-term impact",
      ],
      category: "Community",
      image: "/yup-assets/programs/community-dev.jpg",
      ctaLabel: "Support Community Projects",
    },
    {
      slug: "youth-leadership",
      title: "Youth Leadership",
      summary:
        "Leadership workshops and mentoring for emerging youth changemakers.",
      description:
        "This program identifies and nurtures young leaders through practical service, coaching, and accountability.",
      outcomes: [
        "Youth-led initiatives in communities",
        "Leadership and facilitation skills",
        "Higher civic participation",
      ],
      category: "Leadership",
      image: "/yup-assets/programs/young-leaders.jpg",
      ctaLabel: "Join Leadership Track",
    },
    {
      slug: "vocational-training",
      title: "Vocational Training",
      summary:
        "Hands-on training in practical trades for employment and entrepreneurship.",
      description:
        "We provide market-relevant vocational learning that helps youth build income pathways and workplace readiness.",
      outcomes: [
        "Job-ready trade skills",
        "Entrepreneurship readiness",
        "Improved employability",
      ],
      category: "Skills Training",
      image: "/yup-assets/programs/vocational-education.jpg",
      ctaLabel: "Support Vocational Training",
    },
  ] as Program[],
  volunteerBenefits: [
    "Make a tangible difference in the lives of young people",
    "Gain valuable experience in international development",
    "Develop new skills and strengthen existing ones",
    "Connect with a community of committed changemakers",
    "Receive training and support throughout your volunteer journey",
  ],
  volunteerOpportunities: [
    "Youth Mentor",
    "Digital Literacy Trainer",
    "Health & Hygiene Educator",
    "Community Outreach Volunteer",
    "Creative Arts Facilitator",
    "Media & Content Assistant",
    "Fundraising Support Volunteer",
    "Youth Club Facilitator",
  ],
  faqs: {
    volunteer: [
      {
        question: "Do I need to speak Kinyarwanda to volunteer?",
        answer:
          "Not for every role. English works for many opportunities, and translation support is available when needed.",
      },
      {
        question: "Is there a minimum time commitment?",
        answer:
          "Most volunteer roles ask for at least a 3-month commitment to support continuity in youth programs.",
      },
      {
        question: "Can I volunteer remotely?",
        answer:
          "Yes. We offer remote roles in communication, fundraising support, and strategy-related activities.",
      },
    ],
    contact: [
      {
        question: "How can I donate to YUP?",
        answer:
          "You can donate via the Donate page. We currently present donation options as static UI while payment integration is being finalized.",
      },
      {
        question: "How can my organization partner with YUP?",
        answer: "Send your collaboration details through the contact form and our team will follow up.",
      },
      {
        question: "How can I stay updated?",
        answer: "Subscribe to our newsletter and follow event updates on the Events page.",
      },
    ],
    donate: [
      {
        question: "Is my donation secure?",
        answer:
          "The current form is a non-processing prototype. Live secure payment gateways will be connected in the next integration phase.",
      },
      {
        question: "Do I receive a donation receipt?",
        answer: "A receipt workflow will be enabled once live payments are connected.",
      },
      {
        question: "Can I support without donating money?",
        answer: "Yes. You can volunteer, share our mission, sponsor events, or provide in-kind support.",
      },
    ],
  },
  ctas: {
    donate: {
      title: "Make a Difference Today",
      description: "Your contribution helps us expand youth-centered programs across Rwanda.",
      buttonLabel: "Donate Now",
      href: "/donate",
    },
    join: {
      title: "Join Our Community",
      description: "Volunteer, partner, or contribute to support meaningful youth development.",
      buttonLabel: "Get Involved",
      href: "/volunteer",
    },
  },
  sdgAlignment: [
    "SDG 3: Good Health and Well-Being",
    "SDG 4: Quality Education",
    "SDG 8: Decent Work and Economic Growth",
    "SDG 10: Reduced Inequalities",
    "SDG 17: Partnerships for the Goals",
  ],
  galleryCategories: ["all", "events", "programs", "community"] as const,
  galleryItems: [
    { id: "1", title: "Weekend Learning Session", category: "events", image: "/yup-assets/gallery/IMG_3467_jpg.jpeg" },
    { id: "2", title: "Classroom Activity", category: "events", image: "/yup-assets/gallery/IMG_3482_jpg.jpeg" },
    { id: "3", title: "Program Day", category: "programs", image: "/yup-assets/gallery/IMG_3496_jpg.jpeg" },
    { id: "4", title: "Youth Group Workshop", category: "programs", image: "/yup-assets/gallery/IMG_3544.jpeg" },
    { id: "5", title: "Community Engagement", category: "community", image: "/yup-assets/gallery/IMG_3578.jpeg" },
    { id: "6", title: "Training Session", category: "programs", image: "/yup-assets/gallery/IMG_3642.jpeg" },
    { id: "7", title: "Volunteer Activity", category: "community", image: "/yup-assets/gallery/IMG_3667.jpeg" },
    { id: "8", title: "Team Moment", category: "events", image: "/yup-assets/gallery/IMG_3709.jpeg" },
    { id: "9", title: "Youth Gathering", category: "events", image: "/yup-assets/gallery/IMG_3862.jpeg" },
  ],
  donateImpacts: [
    { amount: "$25", description: "Provides school supplies for one student for a semester." },
    { amount: "$50", description: "Funds a month of after-school tutoring support." },
    { amount: "$100", description: "Sponsors school fees for a student for one term." },
    { amount: "$250", description: "Supports a local community development project." },
    { amount: "$500", description: "Helps build clean water infrastructure." },
    { amount: "$1,000", description: "Funds a full scholarship for one student for one year." },
  ],
};
