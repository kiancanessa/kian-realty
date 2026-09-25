// The shared-listing contract ("bolsa") between the allied agencies.
//
// Each agency publishes its own published listings at
//   GET /api/bolsa/v1/listings        → the cards
//   GET /api/bolsa/v1/listings/{id}   → one listing in full
// and reads its partners' feeds. Read-only by design: there is no write
// endpoint, so a partner can never touch this agency's inventory — which is
// exactly what sharing an EasyBroker API key does allow.
//
// This file is copied verbatim into every allied site. It has no imports on
// purpose, so a change here can be pasted across repos without dragging
// anything else along. Anything site-specific goes in publish.ts / consume.ts.

export const BOLSA_VERSION = 1;

export type BolsaOperation = "sale" | "rental";
export type BolsaType = "house" | "apartment" | "land" | "commercial" | "building" | "ranch";
/** What the amount means: a total, a price per m², or a monthly/nightly rent. */
export type BolsaPriceUnit = "total" | "per_m2" | "monthly" | "nightly";

export type BolsaText = { es: string; en?: string | null };

export type BolsaAgency = {
  slug: string;
  name: string;
  site: string;
  /** Absolute URL of a small square logo, for the origin badge. */
  logo?: string | null;
};

export type BolsaListing = {
  /** Stable and prefixed by agency, e.g. "ecr-EB-QL9176". */
  id: string;
  /** EasyBroker public id when the listing comes from there — two agencies
   *  sharing the same EasyBroker listing send the same value, which is how
   *  duplicates are caught. */
  externalId?: string | null;
  /** The listing's page on its owner's site. */
  url: string;
  operation: BolsaOperation;
  type: BolsaType;
  title: BolsaText;
  summary?: BolsaText | null;
  price: { amount: number | null; currency: "USD" | "MXN"; unit: BolsaPriceUnit };
  location: { zone?: string | null; city?: string | null; address?: string | null; lat: number | null; lng: number | null };
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  /** m² built. */
  construction: number | null;
  /** m² of land. */
  lot: number | null;
  /** Absolute https URLs, hosted by the owner. The list carries the cover; the
   *  detail endpoint carries all of them. */
  photos: string[];
  updatedAt?: string | null;
};

export type BolsaDetail = BolsaListing & {
  description?: { es: string[]; en?: string[] | null } | null;
  features?: { es: string[]; en?: string[] | null } | null;
};

export type BolsaFeed = {
  version: number;
  agency: BolsaAgency;
  generatedAt: string;
  listings: BolsaListing[];
};

// ---------------------------------------------------------------- validation
//
// A partner's feed is data from another codebase, so nothing is trusted: every
// field is checked, and a listing that does not pass is dropped on its own
// rather than taking the whole feed down with it.

const OPERATIONS: BolsaOperation[] = ["sale", "rental"];
const TYPES: BolsaType[] = ["house", "apartment", "land", "commercial", "building", "ranch"];
const UNITS: BolsaPriceUnit[] = ["total", "per_m2", "monthly", "nightly"];

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v : null;
}
function numOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
/** Only absolute https URLs: an http or relative one would either break the
 *  page over TLS or resolve against the consuming site by mistake. */
function httpsUrl(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  try {
    return new URL(s).protocol === "https:" ? s : null;
  } catch {
    return null;
  }
}
function text(v: unknown): BolsaText | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const es = str(o.es) ?? str(o.en);
  return es ? { es, en: str(o.en) } : null;
}
function paragraphs(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const out = v.map(str).filter((s): s is string => s !== null);
  return out.length ? out : null;
}

export function parseListing(raw: unknown): BolsaListing | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const id = str(o.id);
  const url = httpsUrl(o.url);
  const title = text(o.title);
  if (!id || !url || !title) return null;

  const operation = OPERATIONS.includes(o.operation as BolsaOperation) ? (o.operation as BolsaOperation) : null;
  const type = TYPES.includes(o.type as BolsaType) ? (o.type as BolsaType) : "house";
  if (!operation) return null;

  const priceRaw = (o.price ?? {}) as Record<string, unknown>;
  const locationRaw = (o.location ?? {}) as Record<string, unknown>;

  return {
    id,
    externalId: str(o.externalId),
    url,
    operation,
    type,
    title,
    summary: text(o.summary),
    price: {
      amount: numOrNull(priceRaw.amount),
      currency: priceRaw.currency === "MXN" ? "MXN" : "USD",
      unit: UNITS.includes(priceRaw.unit as BolsaPriceUnit) ? (priceRaw.unit as BolsaPriceUnit) : "total",
    },
    location: {
      zone: str(locationRaw.zone),
      city: str(locationRaw.city),
      address: str(locationRaw.address),
      lat: numOrNull(locationRaw.lat),
      lng: numOrNull(locationRaw.lng),
    },
    bedrooms: numOrNull(o.bedrooms),
    bathrooms: numOrNull(o.bathrooms),
    parking: numOrNull(o.parking),
    construction: numOrNull(o.construction),
    lot: numOrNull(o.lot),
    photos: Array.isArray(o.photos) ? o.photos.map(httpsUrl).filter((u): u is string => u !== null) : [],
    updatedAt: str(o.updatedAt),
  };
}

export function parseDetail(raw: unknown): BolsaDetail | null {
  const base = parseListing(raw);
  if (!base) return null;
  const o = raw as Record<string, unknown>;
  const description = (o.description ?? null) as Record<string, unknown> | null;
  const features = (o.features ?? null) as Record<string, unknown> | null;

  return {
    ...base,
    description: description ? { es: paragraphs(description.es) ?? [], en: paragraphs(description.en) } : null,
    features: features ? { es: paragraphs(features.es) ?? [], en: paragraphs(features.en) } : null,
  };
}

export function parseFeed(raw: unknown): BolsaFeed | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const agencyRaw = (o.agency ?? {}) as Record<string, unknown>;
  const slug = str(agencyRaw.slug);
  const name = str(agencyRaw.name);
  const site = httpsUrl(agencyRaw.site);
  if (!slug || !name || !site) return null;
  if (!Array.isArray(o.listings)) return null;

  return {
    version: numOrNull(o.version) ?? BOLSA_VERSION,
    agency: { slug, name, site, logo: httpsUrl(agencyRaw.logo) },
    generatedAt: str(o.generatedAt) ?? new Date().toISOString(),
    listings: o.listings.map(parseListing).filter((l): l is BolsaListing => l !== null),
  };
}

/** Same house published by two agencies. Matched by the EasyBroker id when
 *  there is one, and otherwise by what would have to coincide for two
 *  different properties to be confused: place, operation, price and bedrooms. */
export function fingerprint(l: Pick<BolsaListing, "externalId" | "location" | "operation" | "price" | "bedrooms">): string {
  if (l.externalId) return `eb:${l.externalId.toLowerCase()}`;
  const place = (l.location.zone ?? l.location.city ?? "").toLowerCase().trim();
  return ["p", place, l.operation, l.price.amount ?? "-", l.price.currency, l.bedrooms ?? "-"].join("|");
}
