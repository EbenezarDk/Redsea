/**
 * Documented RSI geographic project experience.
 * Source: RSI Corporate Overview presentation (region lists).
 * This is historical project experience — not a current-office map.
 * Territories without Natural Earth country polygons are kept for labels
 * but may not render as filled shapes.
 */

export type FootprintRegionId =
  | "all"
  | "middle-east"
  | "africa"
  | "asia"
  | "europe"
  | "americas"
  | "oceania";

export type FootprintCountry = {
  /** ISO 3166-1 alpha-2 where available */
  iso2: string;
  /** ISO 3166-1 numeric (string) — matches world-atlas / Natural Earth ids */
  isoNumeric: string;
  name: string;
  region: Exclude<FootprintRegionId, "all">;
};

export type RegionFilterOption = {
  id: FootprintRegionId;
  label: string;
};

export const regionFilters: readonly RegionFilterOption[] = [
  { id: "all", label: "All Regions" },
  { id: "middle-east", label: "Middle East" },
  { id: "africa", label: "Africa" },
  { id: "asia", label: "Asia" },
  { id: "europe", label: "Europe" },
  { id: "americas", label: "Americas" },
  { id: "oceania", label: "Oceania" },
] as const;

/** Named markets documented in the corporate overview region lists. */
export const footprintCountries: readonly FootprintCountry[] = [
  // Middle East
  { iso2: "SA", isoNumeric: "682", name: "Saudi Arabia", region: "middle-east" },
  { iso2: "AE", isoNumeric: "784", name: "United Arab Emirates", region: "middle-east" },
  { iso2: "QA", isoNumeric: "634", name: "Qatar", region: "middle-east" },
  { iso2: "OM", isoNumeric: "512", name: "Oman", region: "middle-east" },
  { iso2: "BH", isoNumeric: "048", name: "Bahrain", region: "middle-east" },
  { iso2: "KW", isoNumeric: "414", name: "Kuwait", region: "middle-east" },
  { iso2: "JO", isoNumeric: "400", name: "Jordan", region: "middle-east" },
  { iso2: "YE", isoNumeric: "887", name: "Yemen", region: "middle-east" },
  // Asia
  { iso2: "IN", isoNumeric: "356", name: "India", region: "asia" },
  { iso2: "MY", isoNumeric: "458", name: "Malaysia", region: "asia" },
  { iso2: "SG", isoNumeric: "702", name: "Singapore", region: "asia" },
  { iso2: "PH", isoNumeric: "608", name: "Philippines", region: "asia" },
  { iso2: "PK", isoNumeric: "586", name: "Pakistan", region: "asia" },
  // Africa
  { iso2: "GH", isoNumeric: "288", name: "Ghana", region: "africa" },
  { iso2: "DZ", isoNumeric: "012", name: "Algeria", region: "africa" },
  { iso2: "NG", isoNumeric: "566", name: "Nigeria", region: "africa" },
  { iso2: "EG", isoNumeric: "818", name: "Egypt", region: "africa" },
  { iso2: "KE", isoNumeric: "404", name: "Kenya", region: "africa" },
  { iso2: "MZ", isoNumeric: "508", name: "Mozambique", region: "africa" },
  // Europe
  { iso2: "AL", isoNumeric: "008", name: "Albania", region: "europe" },
  { iso2: "GR", isoNumeric: "300", name: "Greece", region: "europe" },
  { iso2: "RU", isoNumeric: "643", name: "Russia", region: "europe" },
  // Americas (North America / Caribbean + South America)
  { iso2: "PA", isoNumeric: "591", name: "Panama", region: "americas" },
  { iso2: "DO", isoNumeric: "214", name: "Dominican Republic", region: "americas" },
  { iso2: "AW", isoNumeric: "533", name: "Aruba", region: "americas" },
  { iso2: "CW", isoNumeric: "531", name: "Curaçao", region: "americas" },
  { iso2: "CL", isoNumeric: "152", name: "Chile", region: "americas" },
  { iso2: "VE", isoNumeric: "862", name: "Venezuela", region: "americas" },
  // Oceania / Pacific
  { iso2: "AU", isoNumeric: "036", name: "Australia", region: "oceania" },
  { iso2: "PG", isoNumeric: "598", name: "Papua New Guinea", region: "oceania" },
] as const;

export const footprintByNumericId = new Map(
  footprintCountries.map((country) => [String(Number(country.isoNumeric)), country]),
);

export function countriesForRegion(region: FootprintRegionId) {
  if (region === "all") return footprintCountries;
  return footprintCountries.filter((country) => country.region === region);
}
