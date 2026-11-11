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
    alt: "Sunset modular cityscape with illuminated interiors, construction cranes, and stacked modular units.",
    intendedSrc: "/images/rsi/sunset-modular-cityscape.png",
    intended:
      "Hero banner: sunset modular cityscape supplied for the RSI site redesign.",
  },
  aboutFactory: {
    id: "aboutFactory",
    variant: "factory",
    src: null,
    alt: "Abstract factory-elevation study standing in for approved RSI manufacturing photography.",
    intendedSrc: "/images/rsi/placeholder-about-factory.jpg",
    intended: "Approved RSI factory photography from the corporate presentation.",
  },
  aboutSite: {
    id: "aboutSite",
    variant: "workers",
    src: null,
    alt: "Abstract site-bay study standing in for approved RSI workplace photography.",
    intendedSrc: "/images/rsi/placeholder-about-site.jpg",
    intended: "Approved RSI factory or workers-site photography.",
  },
  design: {
    id: "design",
    variant: "design",
    src: null,
    alt: "Abstract modular production study for the Design and Manufacture capability.",
    intendedSrc: "/images/rsi/placeholder-design.jpg",
    intended: "Approved modular production photography.",
  },
  build: {
    id: "build",
    variant: "build",
    src: null,
    alt: "Abstract delivery study for the Build and Deliver capability.",
    intendedSrc: "/images/rsi/placeholder-build.jpg",
    intended: "Approved installation or project-delivery photography.",
  },
  operate: {
    id: "operate",
    variant: "operate",
    src: null,
    alt: "Abstract operations drawing for the Operate and Maintain capability.",
    intendedSrc: "/images/rsi/placeholder-operate.jpg",
    intended: "Approved technical operations or facilities photography.",
  },
  partner: {
    id: "partner",
    variant: "partner",
    src: null,
    alt: "Abstract paired-frame study for the Partner and Invest capability.",
    intendedSrc: "/images/rsi/placeholder-partner.jpg",
    intended: "Approved partnership imagery, or keep an abstract modular pattern.",
  },
  housing: {
    id: "housing",
    variant: "housing",
    src: null,
    alt: "Abstract modular camp study for Red Sea Housing Services.",
    intendedSrc: "/images/rsi/placeholder-housing.jpg",
    intended: "Approved Red Sea Housing Services photography.",
  },
  facilities: {
    id: "facilities",
    variant: "facilities",
    src: null,
    alt: "Abstract facility-plan study for RSI Facilities Management.",
    intendedSrc: "/images/rsi/placeholder-facilities.jpg",
    intended: "Approved facilities management photography.",
  },
  mep: {
    id: "mep",
    variant: "mep",
    src: null,
    alt: "Abstract services drawing for First Fix MEP contracting.",
    intendedSrc: "/images/rsi/placeholder-mep.jpg",
    intended: "Approved MEP or infrastructure photography.",
  },
  realEstate: {
    id: "realEstate",
    variant: "real-estate",
    src: null,
    alt: "Abstract massing study for Real Estate Development.",
    intendedSrc: "/images/rsi/placeholder-real-estate.jpg",
    intended: "Approved hospitality, residential, or commercial development photography.",
  },
  investment: {
    id: "investment",
    variant: "investment",
    src: null,
    alt: "Abstract linked-frame study for Specialized Investment.",
    intendedSrc: "/images/rsi/placeholder-investment.jpg",
    intended: "Approved investment imagery, or keep an abstract pattern.",
  },
  trojena: {
    id: "trojena",
    variant: "trojena",
    src: null,
    alt: "Abstract modular study for the Webuild — Trojena reference. Approved project photography is pending.",
    intendedSrc: "/images/rsi/placeholder-trojena.jpg",
    intended: "Approved imagery from the RSI IFM document, pages 11–12.",
  },
  turaif: {
    id: "turaif",
    variant: "turaif",
    src: null,
    alt: "Abstract modular study for the Ma’aden — Turaif reference. Approved project photography is pending.",
    intendedSrc: "/images/rsi/placeholder-turaif.jpg",
    intended: "Approved imagery from the RSI IFM document, page 13.",
  },
  rig: {
    id: "rig",
    variant: "rig",
    src: null,
    alt: "Abstract modular study for the Baker Hughes — Rig Camps reference. Approved project photography is pending.",
    intendedSrc: "/images/rsi/placeholder-rig.jpg",
    intended: "Approved imagery from the RSI IFM document, page 14.",
  },
  village: {
    id: "village",
    variant: "village",
    src: null,
    alt: "Abstract modular study for the Red Sea Global — Construction Village reference. Approved project photography is pending.",
    intendedSrc: "/images/rsi/placeholder-village.jpg",
    intended: "Approved imagery from the RSI IFM document, page 15.",
  },
};
