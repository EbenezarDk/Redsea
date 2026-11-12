import type { MetadataRoute } from "next";
import { officialSite } from "@/data/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = officialSite.replace(/\/$/, "");
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/businesses`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
