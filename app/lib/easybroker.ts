// Server-only: fetches live listings from the agency's EasyBroker account.
// Never import this from a "use client" component — EASYBROKER_API_KEY must
// stay off the client bundle.
const API_BASE = "https://api.easybroker.com/v1";
const PAGE_LIMIT = 20;

export type PropertyCategory = "house" | "apartment" | "land";
export type OperationType = "sale" | "rental";

const PROPERTY_TYPE_MAP: Record<string, PropertyCategory> = {
  "Casa": "house",
  "Casa con uso de suelo": "house",
  "Edificio": "house",
  "Departamento": "apartment",
  "Casa en condominio": "apartment",
  "Terreno": "land",
  "Terreno comercial": "land",
};

export function categoryFor(propertyType: string): PropertyCategory {
  return PROPERTY_TYPE_MAP[propertyType] ?? "house";
}

export type EBOperation = {
  type: OperationType;
  amount: number;
  currency: string;
  formatted_amount: string;
};

export type EBPropertyListItem = {
  public_id: string;
  title: string;
  title_image_full: string | null;
  title_image_thumb: string | null;
  location: string;
  operations: EBOperation[];
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  property_type: string;
  lot_size: number | null;
  construction_size: number | null;
};

export type EBLocationDetail = {
  name: string;
  latitude: number | null;
  longitude: number | null;
};

export type EBPropertyDetail = Omit<EBPropertyListItem, "location"> & {
  description: string;
  location: string;
  location_detail: EBLocationDetail;
  property_images: { title: string | null; url: string }[];
  public_url: string;
};

type EBRawDetail = Omit<EBPropertyListItem, "location"> & {
  description: string;
  location: EBLocationDetail;
  property_images: { title: string | null; url: string }[];
  public_url: string;
};

async function ebFetch<T>(path: string): Promise<T | null> {
  const apiKey = process.env.EASYBROKER_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "X-Authorization": apiKey, accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getAllProperties(): Promise<EBPropertyListItem[]> {
  const query = `limit=${PAGE_LIMIT}&search%5Bstatuses%5D%5B%5D=published`;
  const first = await ebFetch<{ pagination: { total: number }; content: EBPropertyListItem[] }>(
    `/properties?${query}&page=1`
  );
  if (!first) return [];

  const all = [...first.content];
  const totalPages = Math.ceil(first.pagination.total / PAGE_LIMIT);
  for (let page = 2; page <= totalPages; page++) {
    const next = await ebFetch<{ content: EBPropertyListItem[] }>(`/properties?${query}&page=${page}`);
    if (next) all.push(...next.content);
  }
  return all;
}

export async function getProperty(id: string): Promise<EBPropertyDetail | null> {
  const raw = await ebFetch<EBRawDetail>(`/properties/${id}`);
  if (!raw) return null;
  const { location, ...rest } = raw;
  return { ...rest, location: location.name, location_detail: location };
}

export function primaryOperation(operations: EBOperation[]): EBOperation | undefined {
  return operations.find(o => o.type === "sale") ?? operations[0];
}

export type PropertyCard = {
  id: string;
  title: string;
  location: string;
  price: string | null;
  operation: OperationType;
  type: PropertyCategory;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  constructionSize: number | null;
  lotSize: number | null;
  image: string;
};

const PLACEHOLDER_IMAGE = "/images/properties/placeholder.svg";

export function toCard(item: EBPropertyListItem): PropertyCard {
  const op = primaryOperation(item.operations);

  return {
    id: item.public_id,
    title: item.title,
    location: item.location,
    price: op?.formatted_amount ?? null,
    operation: op?.type ?? "sale",
    type: categoryFor(item.property_type),
    propertyType: item.property_type,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    parkingSpaces: item.parking_spaces,
    constructionSize: item.construction_size,
    lotSize: item.lot_size,
    image: item.title_image_full ?? PLACEHOLDER_IMAGE,
  };
}

// Hand-picked listings to always surface first. A single flat list works for
// both the unfiltered view and the per-category filters: within any category
// the pinned ids still rank ahead of every un-pinned one.
const FEATURED_HOUSE_IDS = [
  "EB-WP7422", "EB-VV4976", "EB-QT1711", "EB-UC4180", "EB-VY6690",
];
const FEATURED_LAND_IDS = [
  "EB-WR3158", "EB-WR3138", "EB-WR3121", "EB-UM2192", "EB-VX6734", "EB-WN5050",
];
const FEATURED_PROPERTY_IDS = [...FEATURED_HOUSE_IDS, ...FEATURED_LAND_IDS];

// Rentals rotate so the same few don't always sit at the top. The order is
// seeded by a time bucket rather than Math.random() so server and client agree
// (no hydration mismatch) while still changing on its own.
const RENTAL_ROTATION_MS = 30 * 60 * 1000;

/** Small deterministic PRNG — same seed always yields the same sequence. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pinned listings first, then everything else. Rentals that aren't pinned keep
 * their slots but rotate among themselves each `RENTAL_ROTATION_MS` window.
 */
export function orderProperties(cards: PropertyCard[], now: number = Date.now()): PropertyCard[] {
  const rank = new Map(FEATURED_PROPERTY_IDS.map((id, i) => [id, i]));
  const ordered = [...cards].sort(
    (a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity)
  );

  // Pinned entries keep their exact position, so only un-pinned rentals rotate.
  const slots: number[] = [];
  const rentals: PropertyCard[] = [];
  ordered.forEach((card, i) => {
    if (card.operation === "rental" && !rank.has(card.id)) {
      slots.push(i);
      rentals.push(card);
    }
  });
  if (rentals.length < 2) return ordered;

  const rnd = seededRandom(Math.floor(now / RENTAL_ROTATION_MS));
  for (let i = rentals.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [rentals[i], rentals[j]] = [rentals[j], rentals[i]];
  }
  slots.forEach((slot, k) => { ordered[slot] = rentals[k]; });
  return ordered;
}
