// The addresses of the pages that exist in both languages, and how to get from
// one to its twin. Only addresses live here (no copy), so the language switch
// can use it without pulling every page's text into the browser.
//
// Layout: English stays at "/" (it is the x-default); Spanish home is "/es";
// the search pages are /es/<slug> and /en/<slug>.

export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];

export const isLang = (v: string): v is Lang => v === "es" || v === "en";

/** key → address segment in each language. */
export const PAGE_SLUGS = {
  // What people search for
  casas: { es: "casas-en-venta-rosarito", en: "rosarito-homes-for-sale" },
  condominios: { es: "condominios-y-departamentos-en-venta-rosarito", en: "rosarito-condos-for-sale" },
  terrenos: { es: "terrenos-en-venta-rosarito", en: "land-for-sale-in-rosarito" },
  "frente-al-mar": { es: "propiedades-frente-al-mar-rosarito", en: "rosarito-oceanfront-property" },
  rentas: { es: "casas-y-departamentos-en-renta-rosarito", en: "rosarito-rentals" },
  // Where they search
  "punta-azul": { es: "propiedades-en-punta-azul-rosarito", en: "punta-azul-rosarito-real-estate" },
  "el-morro": { es: "propiedades-en-el-morro-rosarito", en: "el-morro-rosarito-real-estate" },
  "plaza-del-mar": { es: "propiedades-en-plaza-del-mar-rosarito", en: "plaza-del-mar-rosarito-real-estate" },
  "mar-de-calafia": { es: "propiedades-en-mar-de-calafia-rosarito", en: "mar-de-calafia-real-estate" },
  "terrazas-del-mar": { es: "propiedades-en-terrazas-del-mar-rosarito", en: "terrazas-del-mar-rosarito-real-estate" },
  // The guide that answers the question every foreign buyer has
  guia: { es: "guia-comprar-propiedad-en-mexico-extranjeros", en: "buying-property-in-mexico-foreigners-guide" },
  // The service behind the guide
  "asesoria-legal": { es: "asesoria-legal-inmobiliaria-rosarito", en: "real-estate-legal-advice-rosarito" },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof PAGE_SLUGS;

export const pageKeys = Object.keys(PAGE_SLUGS) as PageKey[];

export const pagePath = (key: PageKey, lang: Lang) => `/${lang}/${PAGE_SLUGS[key][lang]}`;

export function keyFromSlug(lang: Lang, slug: string): PageKey | null {
  return pageKeys.find(k => PAGE_SLUGS[k][lang] === slug) ?? null;
}

/** The address of the same page in the other language, or null when the
 *  current page is not one of the twin pages (then the language just changes
 *  in place, as it always has). */
export function twinPath(pathname: string, to: Lang): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return to === "es" ? "/es" : null;
  if (parts.length === 1 && isLang(parts[0])) return parts[0] === to ? null : to === "en" ? "/" : "/es";
  if (parts.length === 2 && isLang(parts[0])) {
    if (parts[0] === to) return null;
    const key = keyFromSlug(parts[0], parts[1]);
    return key ? pagePath(key, to) : null;
  }
  return null;
}

/** For the pathname the visitor is on: which language it dictates, if any. */
export function langOfPath(pathname: string): Lang | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLang(first) ? first : null;
}

/** Short link text, for the footer and "related pages" lists. */
export const LINK_LABELS: Record<PageKey, Record<Lang, string>> = {
  casas: { es: "Casas en venta", en: "Homes for sale" },
  condominios: { es: "Condominios y departamentos", en: "Condos and apartments" },
  terrenos: { es: "Terrenos en venta", en: "Land for sale" },
  "frente-al-mar": { es: "Frente al mar", en: "Oceanfront" },
  rentas: { es: "Rentas", en: "Rentals" },
  "punta-azul": { es: "Punta Azul", en: "Punta Azul" },
  "el-morro": { es: "El Morro", en: "El Morro" },
  "plaza-del-mar": { es: "Plaza del Mar", en: "Plaza del Mar" },
  "mar-de-calafia": { es: "Mar de Calafia", en: "Mar de Calafia" },
  "terrazas-del-mar": { es: "Terrazas del Mar", en: "Terrazas del Mar" },
  guia: { es: "Guía para comprar en México", en: "Buying in Mexico: guide" },
  "asesoria-legal": { es: "Asesoría legal", en: "Legal advisory" },
};
