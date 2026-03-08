export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = {
  slug: string;
  title: string;
  description: string;
  items: FaqItem[];
};

export const faqSections: FaqSection[] = [
  {
    slug: "about",
    title: "About Youth Uplift Initiative",
    description: "General information about who we are and what we do.",
    items: [
      {
        question: "What is Youth Uplift Initiative?",
        answer:
          "Youth Uplift Initiative (YUP) is a youth-focused organization in Rwanda that supports education, community development, and practical opportunities for young people.",
      },
      {
        question: "Where does YUP operate?",
        answer:
          "YUP primarily operates in Rwanda and collaborates with local communities, schools, and partners to deliver programs and events.",
      },
      {
        question: "Who can benefit from YUP programs?",
        answer:
          "Our programs are designed for young people, students, and community members who want access to learning opportunities, mentorship, and practical development support.",
      },
      {
        question: "How can I stay updated on your activities?",
        answer:
          "You can follow our updates through the Events page, Gallery, Instagram, and by subscribing to the newsletter.",
      },
    ],
  },
  {
    slug: "programs",
    title: "Programs",
    description: "Questions about program participation, availability, and updates.",
    items: [
      {
        question: "How do I view currently available programs?",
        answer:
          "Visit the Programs page. The list is managed from the admin dashboard and shows published programs only.",
      },
      {
        question: "Can programs be full or closed?",
        answer:
          "Yes. Program visibility and status are controlled by admins, so some programs may be unavailable at different times.",
      },
      {
        question: "Do programs include both learning and community activities?",
        answer:
          "Yes. Programs may include education support, leadership activities, community outreach, skills development, and event-based experiences.",
      },
      {
        question: "Can I suggest a new program idea?",
        answer:
          "Yes. Use the Contact page or Partner With Us page to share your proposal and our team will review it.",
      },
    ],
  },
  {
    slug: "volunteering",
    title: "Volunteering",
    description: "Everything related to volunteer applications and outcomes.",
    items: [
      {
        question: "How do I apply as a volunteer?",
        answer:
          "Go to the Volunteer page, complete the form, and select your preferred opportunity from currently published programs.",
      },
      {
        question: "What happens after I submit a volunteer form?",
        answer:
          "Your submission goes to the admin dashboard for review. The team can update status and respond to you by email.",
      },
      {
        question: "Will I receive an acceptance or rejection email?",
        answer:
          "Yes. When admins update your volunteer status, the system can send an acceptance or rejection email based on the decision.",
      },
      {
        question: "Is there a remote volunteering option?",
        answer:
          "Some roles can be supported remotely depending on current program needs. Include this preference in your volunteer message.",
      },
    ],
  },
  {
    slug: "events",
    title: "Events",
    description: "Questions about event publishing, registration, and details.",
    items: [
      {
        question: "Where can I see upcoming events?",
        answer:
          "Visit the Events page to view all currently published events with their details, dates, location, and cover images.",
      },
      {
        question: "Why can an event link change over time?",
        answer:
          "If an event slug is updated, old links are preserved through alias redirects to the latest canonical event URL.",
      },
      {
        question: "How are event details formatted?",
        answer:
          "Event details support rich text-style formatting including paragraphs and emphasized headings for clearer presentation.",
      },
      {
        question: "How can I collaborate on an event?",
        answer:
          "Use Partner With Us or Contact Us to share your event proposal, sponsorship intent, or collaboration request.",
      },
    ],
  },
  {
    slug: "donations",
    title: "Donations",
    description: "Questions about giving and payment channels.",
    items: [
      {
        question: "What donation method is currently available?",
        answer: "The current donation page supports MTN Mobile Money instructions only.",
      },
      {
        question: "What number should I use for MoMo donations?",
        answer: "Send your donation to +250 788 749 709 through MTN Mobile Money.",
      },
      {
        question: "What if I do not have MTN Mobile Money?",
        answer:
          "Contact us by email at contact.yupinitiative@gmail.com or submit your request via the Contact page form for alternatives.",
      },
      {
        question: "Can I support without donating money?",
        answer:
          "Yes. You can volunteer, partner with us, promote our work, contribute resources, or help organize community events.",
      },
    ],
  },
  {
    slug: "partnerships",
    title: "Partnerships",
    description: "For organizations, groups, and companies interested in collaboration.",
    items: [
      {
        question: "How do I request a partnership with YUP?",
        answer:
          "Use the Partner With Us page and submit the partnership form with your organization details and collaboration goals.",
      },
      {
        question: "Who can submit a partnership request?",
        answer:
          "Individuals, NGOs, schools, companies, community groups, and other institutions can all submit partnership inquiries.",
      },
      {
        question: "How are partnership submissions handled?",
        answer:
          "Submissions are reviewed in the admin dashboard where status can be updated and responses are sent to applicants.",
      },
      {
        question: "What types of partnerships do you accept?",
        answer:
          "We support funding partnerships, in-kind support, program co-delivery, event collaboration, mentorship, and strategic partnerships.",
      },
    ],
  },
  {
    slug: "newsletter-email",
    title: "Newsletter & Email",
    description: "Subscription, updates, and communication workflows.",
    items: [
      {
        question: "How do I subscribe to updates?",
        answer:
          "Use any newsletter form on the website. Subscriptions are stored and synced to the configured non-community segment when enabled.",
      },
      {
        question: "Will subscribing affect my volunteer application?",
        answer:
          "No. Newsletter signup and volunteer applications are separate, but accepted volunteers may also be enrolled in the community segment.",
      },
      {
        question: "Can I receive admin replies by email?",
        answer:
          "Yes. Admins can reply directly from the dashboard and responses are sent from support.yupinitiative.com email addresses.",
      },
      {
        question: "What if email delivery is temporarily unavailable?",
        answer:
          "Core form submissions still work and are stored in the database. Email operations are logged and can be retried by admins.",
      },
    ],
  },
  {
    slug: "contact-support",
    title: "Contact & Support",
    description: "How to reach us and when to expect a response.",
    items: [
      {
        question: "What is the fastest way to contact YUP?",
        answer:
          "Use the Contact page form for structured inquiries or email contact.yupinitiative@gmail.com for direct communication.",
      },
      {
        question: "What should I include in my message?",
        answer:
          "Include your full name, email, reason for contact, and a clear message so the team can respond quickly.",
      },
      {
        question: "Do you respond to international inquiries?",
        answer:
          "Yes. We review both local and international messages, including partnership and program collaboration requests.",
      },
      {
        question: "Can I visit your office directly?",
        answer:
          "Please contact the team first to coordinate. This helps us route you to the right program lead and schedule appropriately.",
      },
    ],
  },
];

export const findFaqSection = (slug: string) => faqSections.find((section) => section.slug === slug);
