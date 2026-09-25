// The other side of the pool: our partners' listings, shown on our site.
//
// Three rules keep a partner's problems from becoming ours:
//   1. Nothing is trusted — every listing is validated (see contract.ts).
//   2. The last good feed is kept in our own database, so a partner being
//      down does not empty our catalogue.
//   3. That copy expires in 24 h. Showing houses that may already be sold is
//      worse than showing fewer houses.
import "server-only";
import { sql } from "../db";
import type { PropertyCard, EBPropertyDetail, OperationType, PropertyCategory } from "../easybroker";
import { PLACEHOLDER_IMAGE } from "../propertyFormat";
import { PARTNERS, apiBase, bolsaEnabled, type Partner } from "./partners";
import { parseFeed, parseDetail, type BolsaFeed, type BolsaListing, type BolsaDetail, type BolsaType } from "./contract";

export const BOLSA_ID_PREFIX = "BOLSA-";

/** How long a listing stays up after we last managed to reach its owner. */
const MAX_STALE_MS = 24 * 60 * 60 * 1000;
/** How often the feed is re-fetched, and how often the copy is refreshed. */
const FEED_REVALIDATE_S = 900;
const SNAPSHOT_MIN_GAP_MS = 10 * 60 * 1000;
const TIMEOUT_MS = 8000;

export type PartnerInfo = { slug: string; name: string; site: string; logo: string | null };

export function isBolsaId(id: string): boolean {
  return id.startsWith(BOLSA_ID_PREFIX);
}

// ------------------------------------------------------------- fetch + cache

async function fetchFeed(partner: Partner): Promise<BolsaFeed | null> {
  const token = process.env[partner.tokenEnv];
  if (!token) return null;
  try {
    const res = await fetch(`${apiBase(partner)}/listings`, {
      headers: { authorization: `Bearer ${token}`, accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: FEED_REVALIDATE_S, tags: [`bolsa-${partner.slug}`] },
    });
    if (!res.ok) return null;
    return parseFeed(await res.json());
  } catch {
    return null;
  }
}

// One write per instance every ten minutes at most: the copy is a safety net,
// not a log.
const lastSaved = new Map<string, number>();

async function saveSnapshot(partner: Partner, feed: BolsaFeed): Promise<void> {
  const last = lastSaved.get(partner.slug) ?? 0;
  if (Date.now() - last < SNAPSHOT_MIN_GAP_MS) return;
  lastSaved.set(partner.slug, Date.now());
  try {
    await sql`
      INSERT INTO bolsa_cache (partner, payload, fetched_at)
      VALUES (${partner.slug}, ${JSON.stringify(feed)}::jsonb, now())
      ON CONFLICT (partner) DO UPDATE SET payload = EXCLUDED.payload, fetched_at = now()
    `;
  } catch {
    // A feed we could read is worth showing even if we could not file it away.
  }
}

async function readSnapshot(partner: Partner): Promise<BolsaFeed | null> {
  try {
    const rows = await sql`SELECT payload, fetched_at FROM bolsa_cache WHERE partner = ${partner.slug}` as
      { payload: unknown; fetched_at: string }[];
    const row = rows[0];
    if (!row) return null;
    if (Date.now() - new Date(row.fetched_at).getTime() > MAX_STALE_MS) return null;
    return parseFeed(row.payload);
  } catch {
    return null;
  }
}

async function feedFor(partner: Partner): Promise<BolsaFeed | null> {
  const live = await fetchFeed(partner);
  if (live) {
    void saveSnapshot(partner, live);
    return live;
  }
  return readSnapshot(partner);
}

// ------------------------------------------------------------------- mapping

const CATEGORY_BY_TYPE: Record<BolsaType, PropertyCategory> = {
  house: "house",
  apartment: "apartment",
  land: "land",
  commercial: "land",
  building: "house",
  ranch: "land",
};

const PROPERTY_TYPE_LABEL: Record<BolsaType, string> = {
  house: "Casa",
  apartment: "Departamento",
  land: "Terreno",
  commercial: "Local comercial",
  building: "Edificio",
  ranch: "Rancho",
};

function formatPrice(listing: BolsaListing): string | null {
  const { amount, currency, unit } = listing.price;
  if (amount === null) return null;
  const money = `$${amount.toLocaleString("en-US")} ${currency}`;
  if (unit === "monthly") return `${money}/mo`;
  if (unit === "nightly") return `${money}/night`;
  if (unit === "per_m2") return `${money}/m²`;
  return money;
}

function localId(listing: BolsaListing): string {
  return `${BOLSA_ID_PREFIX}${listing.id}`;
}

export function partnerToCard(listing: BolsaListing, partner: PartnerInfo): PropertyCard {
  return {
    id: localId(listing),
    title: listing.title.es,
    location: listing.location.address ?? listing.location.city ?? "",
    price: formatPrice(listing),
    operation: listing.operation as OperationType,
    type: CATEGORY_BY_TYPE[listing.type],
    propertyType: PROPERTY_TYPE_LABEL[listing.type],
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    parkingSpaces: listing.parking,
    constructionSize: listing.construction,
    lotSize: listing.lot,
    image: listing.photos[0] ?? PLACEHOLDER_IMAGE,
    partner,
  };
}

/** Partner listings are mapped into EasyBroker's detail shape, exactly like
 *  our own ones, so the detail page renders them with no branching. */
function partnerToDetail(detail: BolsaDetail): EBPropertyDetail {
  const price = formatPrice(detail);
  return {
    public_id: localId(detail),
    title: detail.title.es,
    title_image_full: detail.photos[0] ?? null,
    title_image_thumb: detail.photos[0] ?? null,
    description: (detail.description?.es ?? []).join("\n\n"),
    location: detail.location.address ?? detail.location.city ?? "",
    location_detail: {
      name: detail.location.address ?? detail.location.city ?? "",
      latitude: detail.location.lat,
      longitude: detail.location.lng,
    },
    property_images: detail.photos.map(url => ({ title: null, url })),
    operations: detail.price.amount === null ? [] : [{
      type: detail.operation as OperationType,
      amount: detail.price.amount,
      currency: detail.price.currency,
      formatted_amount: price ?? "",
    }],
    bedrooms: detail.bedrooms,
    bathrooms: detail.bathrooms,
    parking_spaces: detail.parking,
    property_type: PROPERTY_TYPE_LABEL[detail.type],
    lot_size: detail.lot,
    construction_size: detail.construction,
    // The visitor can always open the listing on its owner's site.
    public_url: detail.url,
  };
}

// --------------------------------------------------------------- public API

export type PartnerListing = { card: PropertyCard; amount: number | null; fingerprintKey: string };

/** Every partner's listings, ready for the grid. Partners are read in
 *  parallel: one slow site must not hold up the others. */
export async function getPartnerListings(): Promise<PartnerListing[]> {
  if (!bolsaEnabled()) return [];

  const feeds = await Promise.all(PARTNERS.map(feedFor));
  const out: PartnerListing[] = [];

  feeds.forEach((feed, i) => {
    if (!feed) return;
    const partner = PARTNERS[i];
    const info: PartnerInfo = {
      slug: partner.slug,
      name: feed.agency.name || partner.name,
      site: feed.agency.site || partner.site,
      logo: feed.agency.logo ?? null,
    };
    for (const listing of feed.listings) {
      out.push({
        card: partnerToCard(listing, info),
        amount: listing.price.amount,
        fingerprintKey: listing.externalId ? `eb:${listing.externalId.toLowerCase()}` : `id:${listing.id}`,
      });
    }
  });

  return out;
}

/** One partner listing in full, asked for only when a visitor opens it. */
export async function getPartnerProperty(id: string): Promise<{ property: EBPropertyDetail; partner: PartnerInfo } | null> {
  if (!bolsaEnabled() || !isBolsaId(id)) return null;

  const listingId = id.slice(BOLSA_ID_PREFIX.length);
  const partner = PARTNERS.find(p => listingId.startsWith(`${p.slug}-`));
  if (!partner) return null;

  const token = process.env[partner.tokenEnv];
  if (!token) return null;

  try {
    const res = await fetch(`${apiBase(partner)}/listings/${encodeURIComponent(listingId)}`, {
      headers: { authorization: `Bearer ${token}`, accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: FEED_REVALIDATE_S, tags: [`bolsa-${partner.slug}`] },
    });
    if (!res.ok) return null;
    const detail = parseDetail(await res.json());
    if (!detail) return null;
    return {
      property: partnerToDetail(detail),
      partner: { slug: partner.slug, name: partner.name, site: partner.site, logo: null },
    };
  } catch {
    return null;
  }
}
