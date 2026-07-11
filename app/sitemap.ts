import type { MetadataRoute } from "next";
import { getAllProperties } from "./lib/easybroker";

const BASE_URL = "https://elcasarosaritogroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getAllProperties();

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/propiedades`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/properties/k38-ocean-apartment`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...properties.map(p => ({
      url: `${BASE_URL}/propiedades/${p.public_id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
