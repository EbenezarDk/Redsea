export type StatKind = "quantity";

export type AtAGlanceStat = {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  /** Zero-pad display for quantity figures (e.g. 05). */
  pad?: number;
  /** Format large numbers with thousands separators (e.g. 12,500). */
  comma?: boolean;
  label: string;
  support: string;
  kind: StatKind;
  srLabel: string;
};

export const atAGlanceCopy = {
  eyebrow: "RSI At a Glance",
  title: "Built on Experience. Connected Worldwide.",
  body: "Established in 1967, Red Sea International brings together five specialized businesses with project experience extending across more than 65 countries.",
  mapCaption: "Geographical Project Experience",
} as const;

/** Homepage At a Glance figures as supplied for this section. */
export const atAGlanceStats: readonly AtAGlanceStat[] = [
  {
    id: "professionals",
    value: 12500,
    suffix: "+",
    comma: true,
    label: "Professionals",
    support: "Across the RSI workforce",
    kind: "quantity",
    srLabel: "12,500+ Professionals across the RSI workforce",
  },
  {
    id: "projects-value",
    value: 4,
    prefix: "SAR ",
    suffix: "B+",
    label: "Projects Delivered",
    support: "Over the last 2 years",
    kind: "quantity",
    srLabel: "SAR 4B+ Projects Delivered over the last 2 years",
  },
  {
    id: "countries",
    value: 65,
    suffix: "+",
    label: "Countries",
    support: "Global project experience",
    kind: "quantity",
    srLabel: "65+ Countries — global project experience",
  },
  {
    id: "experience",
    value: 45,
    suffix: "+",
    label: "Years of Experience",
    support: "Industry expertise",
    kind: "quantity",
    srLabel: "45+ Years of Experience — industry expertise",
  },
] as const;
