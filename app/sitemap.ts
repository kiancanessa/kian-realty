import type { MetadataRoute } from "next";

const BASE_URL = "https://elcasarosaritogroup.com";

const PROPERTY_SLUGS = [
  "oceanfront-villa",
  "modern-condo",
  "beachfront-getaway",
  "k38-ocean-apartment",
  "rosarito-ocean-lot",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...PROPERTY_SLUGS.map(slug => ({
      url: `${BASE_URL}/properties/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
