/**
 * Media map for the RSI prototype.
 * `src` is set when a file exists under /public.
 * Remaining null entries still render original modular studies
 * (abstract drawings, not photographs of named RSI projects).
 */

export type StudyVariant =
  | "hero"
  | "factory"
  | "workers"
  | "design"
  | "build"
  | "operate"
  | "partner"
  | "housing"
  | "facilities"
  | "mep"
  | "real-estate"
  | "investment"
  | "trojena"
  | "turaif"
  | "rig"
  | "village";

export type AssetId =
  | "hero"
  | "aboutFactory"
  | "aboutSite"
  | "design"
  | "build"
  | "operate"
  | "partner"
  | "housing"
  | "facilities"
  | "mep"
  | "realEstate"
  | "investment"
  | "trojena"
  | "turaif"
  | "rig"
  | "village";

export type AssetRecord = {
  id: AssetId;
  variant: StudyVariant;
  /** Set when an approved file exists in /public. */
  src: string | null;
  alt: string;
  /** APPROVAL_REQUIRED drop path for the real asset. */
  intendedSrc: string;
  intended: string;
};

export const assets: Record<AssetId, AssetRecord> = {
  hero: {
    id: "hero",
    variant: "hero",
    src: "/images/rsi/sunset-modular-cityscape.png",
    alt: "Camera approaching a glass skyscraper — scroll-scrubbed cinematic hero for Red Sea International.",
    intendedSrc: "/images/rsi/sunset-modular-cityscape.png",
    intended:
      "Hero uses scroll-scrubbed muted video at /videos/hero-approach.mp4; still used as poster fallback.",
  },
  aboutFactory: {
    id: "aboutFactory",
    variant: "factory",
    src: "/images/rsi/about-factory.jpg",
    alt: "Modular building units under assembly on the Red Sea International factory floor.",
    intendedSrc: "/images/rsi/about-factory.jpg",
    intended: "Approved RSI factory photography.",
  },
  aboutSite: {
    id: "aboutSite",
    variant: "workers",
    src: "/images/rsi/about-site.jpg",
    alt: "Aerial view of a Red Sea International modular workforce accommodation camp.",
    intendedSrc: "/images/rsi/about-site.jpg",
    intended: "Approved RSI workforce accommodation site photography.",
  },
  design: {
    id: "design",
    variant: "design",
    src: "/images/rsi/capability-design-01.png",
    alt: "Modular factory in the desert — units under assembly for Design and Manufacture.",
    intendedSrc: "/images/rsi/capability-design-01.png",
    intended: "Approved modular production photography.",
  },
  build: {
    id: "build",
    variant: "build",
    src: "/images/rsi/capability-build.png",
    alt: "Modular unit being placed on site for the Build and Deliver capability.",
    intendedSrc: "/images/rsi/capability-build.png",
    intended: "Approved installation or project-delivery photography.",
  },
  operate: {
    id: "operate",
    variant: "operate",
    src: "/images/rsi/capability-operate.png",
    alt: "Camp accommodation village with dining, housekeeping and maintenance services for Operate and Maintain.",
    intendedSrc: "/images/rsi/capability-operate.png",
    intended: "Approved technical operations or facilities photography.",
  },
  partner: {
    id: "partner",
    variant: "partner",
    src: "/images/rsi/capability-partner.png",
    alt: "Partnership meeting in Riyadh for the Partner and Invest capability.",
    intendedSrc: "/images/rsi/capability-partner.png",
    intended: "Approved partnership imagery.",
  },
  housing: {
    id: "housing",
    variant: "housing",
    src: "/images/rsi/business-housing.jpg",
    alt: "Aerial view of a Red Sea Housing Services modular accommodation camp.",
    intendedSrc: "/images/rsi/business-housing.jpg",
    intended: "Approved Red Sea Housing Services photography.",
  },
  facilities: {
    id: "facilities",
    variant: "facilities",
    src: "/images/rsi/business-facilities.jpg",
    alt: "Aerial view of an RSI Facilities Management workforce village and recreation areas.",
    intendedSrc: "/images/rsi/business-facilities.jpg",
    intended: "Approved facilities management photography.",
  },
  mep: {
    id: "mep",
    variant: "mep",
    src: "/images/rsi/business-mep.jpg",
    alt: "Mechanical and plumbing installation for First Fix MEP Contracting.",
    intendedSrc: "/images/rsi/business-mep.jpg",
    intended: "Approved MEP or infrastructure photography.",
  },
  realEstate: {
    id: "realEstate",
    variant: "real-estate",
    src: "/images/rsi/business-real-estate.jpg",
    alt: "Modern mixed-use development for Real Estate Development.",
    intendedSrc: "/images/rsi/business-real-estate.jpg",
    intended: "Approved hospitality, residential, or commercial development photography.",
  },
  investment: {
    id: "investment",
    variant: "investment",
    src: "/images/rsi/luxury-glass-office-sunset.png",
    alt: "Glass-walled corporate workspace at sunset for Specialized Investment.",
    intendedSrc: "/images/rsi/luxury-glass-office-sunset.png",
    intended: "Stand-in investment imagery pending an approved asset.",
  },
  trojena: {
    id: "trojena",
    variant: "trojena",
    src: "/images/rsi/project-trojena.jpg",
    alt: "Evening view of a mixed-use real estate development for the Webuild — Trojena reference.",
    intendedSrc: "/images/rsi/project-trojena.jpg",
    intended: "Approved project photography for Webuild — Trojena.",
  },
  turaif: {
    id: "turaif",
    variant: "turaif",
    src: "/images/rsi/project-turaif.jpg",
    alt: "Aerial view of a modular facilities and accommodation campus for the Ma’aden — Turaif reference.",
    intendedSrc: "/images/rsi/project-turaif.jpg",
    intended: "Approved project photography for Ma’aden — Turaif.",
  },
  rig: {
    id: "rig",
    variant: "rig",
    src: "/images/rsi/project-rig.jpg",
    alt: "MEP and infrastructure installation for the Baker Hughes — Rig Camps reference.",
    intendedSrc: "/images/rsi/project-rig.jpg",
    intended: "Approved project photography for Baker Hughes — Rig Camps.",
  },
  village: {
    id: "village",
    variant: "village",
    src: "/images/rsi/project-village.png",
    alt: "Strategic project discussion overlooking industrial development for the Red Sea Global — Construction Village reference.",
    intendedSrc: "/images/rsi/project-village.png",
    intended: "Approved project photography for Red Sea Global — Construction Village.",
  },
};
