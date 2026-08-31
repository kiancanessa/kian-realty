// Listings the agency publishes directly from the admin panel, alongside the
// ones synced from EasyBroker. They are deliberately mapped into the same
// shapes EasyBroker produces (PropertyCard / EBPropertyDetail) so every
// existing surface — the grid, the filters, the detail page, reviews,
// favorites, the quiz matcher — works on them with no branching.
import { sql } from "./db";
import type { PropertyCard, EBPropertyDetail, OperationType } from "./easybroker";
import { categoryFor } from "./easybroker";
import type { SessionUser } from "./auth";

/** Sales staff manage the agency's own listings — same access rule as the
 *  Contacts panel they already use. */
export function canManageProperties(user: SessionUser | null): boolean {
  return !!user && (user.is_developer || user.role === "vendedor");
}

// Public-facing id prefix. EasyBroker ids are "EB-XXXXXX", so this can never
// collide, and any id can be routed to the right source by prefix alone.
const OWN_ID_PREFIX = "ECR-";

export function isOwnPropertyId(id: string): boolean {
  return id.startsWith(OWN_ID_PREFIX);
}

function numericId(publicId: string): number | null {
  const n = Number(publicId.slice(OWN_ID_PREFIX.length));
  return Number.isInteger(n) && n > 0 ? n : null;
}

export type OwnPropertyRow = {
  id: number;
  published: boolean;
  title: string;
  description: string | null;
  location: string;
  operation: OperationType;
  property_type: string;
  price: string | number | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  lot_size: string | number | null;
  construction_size: string | number | null;
  images: string[];
  latitude: string | number | null;
  longitude: string | number | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

// Postgres NUMERIC comes back as a string through the driver; everything
// downstream expects real numbers.
function num(v: string | number | null): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatPrice(price: number | null, currency: string, operation: OperationType): string | null {
  if (price === null) return null;
  const amount = price.toLocaleString("en-US");
  return operation === "rental" ? `$${amount} ${currency}/mo` : `$${amount} ${currency}`;
}

export function ownToCard(row: OwnPropertyRow): PropertyCard {
  const price = num(row.price);
  return {
    id: `${OWN_ID_PREFIX}${row.id}`,
    title: row.title,
    location: row.location,
    price: formatPrice(price, row.currency, row.operation),
    operation: row.operation,
    type: categoryFor(row.property_type),
    propertyType: row.property_type,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parkingSpaces: row.parking_spaces,
    constructionSize: num(row.construction_size),
    lotSize: num(row.lot_size),
    image: row.images[0] ?? "/images/properties/placeholder.svg",
  };
}

/** Detail view, shaped exactly like an EasyBroker property so the existing
 *  detail component renders it untouched. `public_url` is empty on purpose —
 *  there is no external listing page, and the UI hides the link when blank. */
export function ownToDetail(row: OwnPropertyRow): EBPropertyDetail {
  const price = num(row.price);
  return {
    public_id: `${OWN_ID_PREFIX}${row.id}`,
    title: row.title,
    title_image_full: row.images[0] ?? null,
    title_image_thumb: row.images[0] ?? null,
    description: row.description ?? "",
    location: row.location,
    location_detail: { name: row.location, latitude: num(row.latitude), longitude: num(row.longitude) },
    property_images: row.images.map(url => ({ title: null, url })),
    operations: price === null ? [] : [{
      type: row.operation,
      amount: price,
      currency: row.currency,
      formatted_amount: formatPrice(price, row.currency, row.operation) ?? "",
    }],
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parking_spaces: row.parking_spaces,
    property_type: row.property_type,
    lot_size: num(row.lot_size),
    construction_size: num(row.construction_size),
    public_url: "",
  };
}

export type PropertyInput = {
  title: string;
  description: string | null;
  location: string;
  operation: OperationType;
  property_type: string;
  price: number | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  lot_size: number | null;
  construction_size: number | null;
  images: string[];
  latitude: number | null;
  longitude: number | null;
};

function optionalNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Validates admin-submitted listing data. Returns null when the required
 *  fields are missing or malformed, so routes can answer 400 uniformly. */
export function parsePropertyInput(body: Record<string, unknown>): PropertyInput | null {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const operation = body.operation === "rental" ? "rental" : body.operation === "sale" ? "sale" : null;
  const propertyType = typeof body.propertyType === "string" ? body.propertyType.trim() : "";

  if (!title || !location || !operation || !propertyType) return null;

  const images = Array.isArray(body.images)
    ? body.images.filter((s): s is string => typeof s === "string" && s.trim() !== "")
    : [];

  return {
    title,
    location,
    operation,
    property_type: propertyType,
    description: typeof body.description === "string" && body.description.trim() !== "" ? body.description.trim() : null,
    price: optionalNumber(body.price),
    currency: typeof body.currency === "string" && body.currency.trim() !== "" ? body.currency.trim().toUpperCase() : "USD",
    bedrooms: optionalNumber(body.bedrooms),
    bathrooms: optionalNumber(body.bathrooms),
    parking_spaces: optionalNumber(body.parkingSpaces),
    lot_size: optionalNumber(body.lotSize),
    construction_size: optionalNumber(body.constructionSize),
    images,
    latitude: optionalNumber(body.latitude),
    longitude: optionalNumber(body.longitude),
  };
}

export async function getPublishedOwnProperties(): Promise<OwnPropertyRow[]> {
  return await sql`
    SELECT * FROM properties WHERE published = true
    ORDER BY sort_order NULLS LAST, created_at DESC
  ` as OwnPropertyRow[];
}

export async function getOwnProperty(publicId: string): Promise<OwnPropertyRow | null> {
  const id = numericId(publicId);
  if (id === null) return null;
  const rows = await sql`SELECT * FROM properties WHERE id = ${id} AND published = true` as OwnPropertyRow[];
  return rows[0] ?? null;
}
