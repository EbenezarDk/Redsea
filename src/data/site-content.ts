import type { AssetId } from "@/data/assets";

/** Verified from the official site navigation: https://redseaintl.com/contact-us */
export const officialSite = "https://redseaintl.com/";
export const officialContactUrl = "https://redseaintl.com/contact-us";

export const seo = {
  home: {
    title: "Red Sea International | Modular Buildings & Integrated Services",
    description:
      "Explore Red Sea International’s modular construction, workforce accommodation, facilities management and integrated service capabilities.",
  },
  businesses: {
    title: "Our Businesses | Red Sea International",
    description:
      "Discover RSI’s business divisions across modular housing, facilities management, MEP, real estate development and specialized investment.",
  },
} as const;

export const brandStatement =
  "From modular buildings and workforce accommodation to integrated facilities management, catering and infrastructure services, Red Sea International brings together complementary capabilities to deliver and operate the places where people live and work.";

export const nav = [
  { href: "/#about", label: "About RSI" },
  { href: "/businesses", label: "Our Businesses" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
] as const;

export const hero = {
  eyebrow: "RED SEA INTERNATIONAL",
  title: ["Built for Progress.", "Designed for People."],
  body: brandStatement,
  primary: { label: "Explore Our Businesses", href: "/businesses" },
  secondary: { label: "View Our Experience", href: "/#projects" },
} as const;

export const about = {
  eyebrow: "The Group",
  title: "One Group. Integrated Capabilities.",
  body: "Established in 1967 and listed on the Saudi Exchange since 2006, Red Sea International (RSI) is a Saudi company delivering modular building solutions, workforce accommodation, integrated facility management and associated services. The Group supports clients across energy, mining, infrastructure, construction and other demanding environments, bringing together manufacturing, project delivery and ongoing operations.",
  support:
    "Our experience extends across more than 65 countries, with a track record in temporary and permanent facilities for diverse industries.",
  cta: { label: "Discover RSI", href: "/#capabilities" },
  stats: [
    { figure: "1967", label: "Established", full: "1967 — Established" },
    {
      figure: "2006",
      label: "Listed on Saudi Exchange",
      full: "2006 — Listed on Saudi Exchange",
    },
    {
      figure: "65+",
      label: "Countries of experience",
      full: "65+ — Countries of experience",
    },
  ],
  images: ["aboutFactory", "aboutSite"] as const satisfies readonly AssetId[],
} as const;

export const capabilities = {
  /** Editorial display heading. Facts live in the four pillars. */
  eyebrow: "Capabilities",
  title: "Connected Capabilities. One Delivery Vision.",
  editorial: true,
  pillars: [
    {
      title: "Design & Manufacture",
      body: "Factory-produced modular solutions for accommodation, offices, hospitality and other facilities.",
      asset: "design" as AssetId,
    },
    {
      title: "Build & Deliver",
      body: "Integrated planning, installation and project delivery for temporary and permanent infrastructure.",
      asset: "build" as AssetId,
    },
    {
      title: "Operate & Maintain",
      body: "Hard and soft FM, accommodation operations, catering, hospitality and life-support services.",
      asset: "operate" as AssetId,
    },
    {
      title: "Partner & Invest",
      body: "Collaboration and investment opportunities that support long-term client and market needs.",
      asset: "partner" as AssetId,
    },
  ],
} as const;

export const businessPreview = {
  /** Editorial display heading. */
  eyebrow: "Businesses",
  title: "Five Businesses. One Connected Group.",
  editorial: true,
  intro: "Five specialist business areas work together to respond to diverse project requirements.",
} as const;

export const businesses = [
  {
    id: "housing",
    number: "01",
    title: "Red Sea Housing Services",
    preview: "Modular construction, temporary facilities and permanent building solutions.",
    body: "We design and manufacture modular building systems for workforce accommodation, offices, hospitality and a range of temporary and permanent uses.",
    tags: [
      "Modular construction",
      "Workforce accommodation",
      "Temporary facilities",
      "Permanent buildings",
    ],
    asset: "housing" as AssetId,
    serviceAnchor: "service-modular",
  },
  {
    id: "facilities",
    number: "02",
    title: "RSI Facilities Management",
    preview: "Hard and soft FM, catering, hospitality and camp operations.",
    body: "We support daily facility performance and occupant wellbeing through technical maintenance, soft services, catering, hospitality and integrated camp management.",
    tags: ["Hard FM", "Soft FM", "Catering", "Camp management", "Life support"],
    asset: "facilities" as AssetId,
    serviceAnchor: "service-facilities",
  },
  {
    id: "first-fix",
    number: "03",
    title: "First Fix | MEP Contracting",
    preview: "Mechanical, electrical, plumbing and infrastructure delivery.",
    body: "Our MEP and infrastructure capabilities support complex building systems and integrated project delivery.",
    tags: [
      "Mechanical works",
      "Electrical works",
      "Plumbing",
      "Infrastructure",
      "Turnkey projects",
    ],
    asset: "mep" as AssetId,
    serviceAnchor: "service-mep",
  },
  {
    id: "real-estate",
    number: "04",
    title: "Real Estate Development",
    preview: "Hospitality, residential and commercial development opportunities.",
    body: "Our development activities focus on opportunities in hospitality, residential and commercial facilities.",
    tags: ["Hospitality", "Residential", "Commercial"],
    asset: "realEstate" as AssetId,
    serviceAnchor: "service-real-estate",
  },
  {
    id: "investment",
    number: "05",
    title: "Specialized Investment",
    preview: "Strategic investments, acquisitions and partnerships.",
    body: "We evaluate investment and partnership opportunities aligned with the Group’s capabilities and long-term direction.",
    tags: ["Investments", "M&A", "Strategic partnerships"],
    asset: "investment" as AssetId,
    serviceAnchor: "service-investment",
  },
] as const;

export const projectsSection = {
  eyebrow: "Featured references",
  title: "Experience Where It Matters",
  body: "Our teams support major clients in oil and gas, mining, construction, infrastructure, government and remote-site operations. We combine facilities, services and operational knowledge to help clients mobilize efficiently and maintain dependable site performance.",
  items: [
    {
      title: "Webuild — Trojena",
      description: "Workforce accommodation and support services.",
      asset: "trojena" as AssetId,
    },
    {
      title: "Ma’aden — Turaif",
      description: "Camp operations.",
      asset: "turaif" as AssetId,
    },
    {
      title: "Baker Hughes — Rig Camps",
      description: "Rig camp supply and operations.",
      asset: "rig" as AssetId,
    },
    {
      title: "Red Sea Global — Construction Village",
      description: "Integrated accommodation and operations.",
      asset: "village" as AssetId,
    },
  ],
} as const;

export const sectorsSection = {
  /** Editorial display heading. Sectors are from the homepage source. */
  eyebrow: "Sectors",
  title: "Built for Demanding Environments.",
  editorial: true,
  items: [
    "Oil & Gas",
    "Mining",
    "Construction",
    "Infrastructure",
    "Government",
    "Remote-Site Operations",
  ],
} as const;

export const contact = {
  title: "Let’s Build the Right Solution",
  /** Editorial proposal — identify it in the UI. */
  support: "Connect with Red Sea International to discuss your project requirements.",
  supportNote: "Editorial proposal",
  handoff:
    "Inquiries are handled on the official Red Sea International contact page. This prototype does not submit a form.",
  homeLabel: "Contact RSI",
  discussLabel: "Discuss Your Project",
  teamLabel: "Contact Our Team",
} as const;

export const businessesPage = {
  eyebrow: "OUR BUSINESSES",
  title: ["Five Businesses.", "One Integrated Approach."],
  body: "Red Sea International combines specialized businesses across modular construction, facilities management, MEP contracting, real estate and investment. Our integrated model enables clients to access complementary solutions throughout the facility lifecycle—from early planning and manufacturing to operation, maintenance and long-term development.",
  exploreLabel: "Explore This Business",
  services: {
    /** Editorial display heading. Labels are the supplied division tags. */
    eyebrow: "Services",
    title: "Specialist Services. Connected Expertise.",
    editorial: true,
    groups: [
      {
        id: "modular",
        anchor: "service-modular",
        title: "Modular & Building Solutions",
        asset: "housing" as AssetId,
      },
      {
        id: "facilities-ops",
        anchor: "service-facilities",
        title: "Facilities & Operations",
        asset: "facilities" as AssetId,
      },
      {
        id: "mep",
        anchor: "service-mep",
        title: "MEP & Infrastructure",
        asset: "mep" as AssetId,
      },
      {
        id: "real-estate-dev",
        anchor: "service-real-estate",
        title: "Real Estate Development",
        asset: "realEstate" as AssetId,
      },
      {
        id: "investment-partnerships",
        anchor: "service-investment",
        title: "Investment & Partnerships",
        asset: "investment" as AssetId,
      },
    ],
  },
  delivery: {
    title: "Connected Expertise Across the Facility Lifecycle",
    body: "From modular manufacturing and project construction to catering, maintenance and site operations, RSI’s business areas can collaborate to address requirements that span multiple disciplines. Engagement models are tailored to each client, location and scope.",
    phases: ["Design", "Build", "Operate", "Maintain"],
    metaphor:
      "Visual metaphor only. It does not indicate that RSI supplies every phase on every contract.",
  },
} as const;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Red Sea International",
  alternateName: "RSI",
  url: officialSite,
  foundingDate: "1967",
  description: about.body,
} as const;
