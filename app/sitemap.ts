import type { MetadataRoute } from "next";
import { getAllProperties } from "./lib/easybroker";
import { pageKeys, pagePath } from "./lib/seoSlugs";

const BASE_URL = "https://elcasarosaritogroup.com";
// Pages whose content does not follow the inventory.
const STABLE = new Set<string>(["guia", "asesoria-legal", "calculadora-rentabilidad"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getAllProperties();

  return [
    // The two language versions of the home page point at each other.
    {
      url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1,
      alternates: { languages: { en: BASE_URL, es: `${BASE_URL}/es` } },
    },
    {
      url: `${BASE_URL}/es`, lastModified: new Date(), changeFrequency: "weekly", priority: 1,
      alternates: { languages: { en: BASE_URL, es: `${BASE_URL}/es` } },
    },
    { url: `${BASE_URL}/propiedades`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    // The search pages and the guide: each language lists the other as its twin.
    ...pageKeys.flatMap(key =>
      (["es", "en"] as const).map(lang => ({
        url: `${BASE_URL}${pagePath(key, lang)}`,
        lastModified: new Date(),
        changeFrequency: (STABLE.has(key) ? "monthly" : "daily") as "monthly" | "daily",
        priority: STABLE.has(key) ? 0.7 : 0.8,
        alternates: { languages: { es: `${BASE_URL}${pagePath(key, "es")}`, en: `${BASE_URL}${pagePath(key, "en")}` } },
      })),
    ),
    { url: `${BASE_URL}/ventas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/desarrollo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    ...properties.map(p => ({
      url: `${BASE_URL}/propiedades/${p.public_id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
