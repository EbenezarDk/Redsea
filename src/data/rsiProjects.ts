import type { AssetId } from "@/data/assets";

export type RsiProject = {
  id: string;
  number: string;
  name: string;
  description: string;
  asset: AssetId;
  details: string[];
};

export const projectProofCopy = {
  eyebrow: "Featured references",
  title: "Experience Where It Matters",
  body: "Our teams support major clients in oil and gas, mining, construction, infrastructure, government and remote-site operations. We combine facilities, services and operational knowledge to help clients mobilize efficiently and maintain dependable site performance.",
  exploreLabel: "Explore Project",
} as const;

export const rsiProjects: RsiProject[] = [
  {
    id: "webuild-trojena",
    number: "01",
    name: "Webuild — Trojena",
    description:
      "Workforce accommodation and support services, including catering, housekeeping, laundry, security, recreation and facilities maintenance.",
    asset: "trojena",
    details: [
      "Workforce accommodation and support services",
      "Catering, housekeeping and laundry",
      "Security, recreation and facilities maintenance",
    ],
  },
  {
    id: "maaden-turaif",
    number: "02",
    name: "Ma’aden — Turaif",
    description:
      "Accommodation operations supporting employees and contractors, including housekeeping, maintenance, landscaping and site services.",
    asset: "turaif",
    details: [
      "Accommodation operations for employees and contractors",
      "Housekeeping and maintenance",
      "Landscaping and site services",
    ],
  },
  {
    id: "baker-hughes-rig-camps",
    number: "03",
    name: "Baker Hughes — Rig Camps",
    description:
      "Modular rig camp facilities and operational support for drilling-related activities across Saudi Arabia.",
    asset: "rig",
    details: [
      "Modular rig camp facilities",
      "Operational support for drilling-related activities",
      "Delivery across Saudi Arabia",
    ],
  },
  {
    id: "red-sea-global-construction-village",
    number: "04",
    name: "Red Sea Global — Construction Village",
    description:
      "Integrated workforce accommodation and operations, including housekeeping, laundry, maintenance and site support services.",
    asset: "village",
    details: [
      "Integrated workforce accommodation and operations",
      "Housekeeping and laundry",
      "Maintenance and site support services",
    ],
  },
];
