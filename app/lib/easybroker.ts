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
  "Departamento": "apartment",
  "Casa en condominio": "apartment",
  "Terreno": "land",
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
  price: string;
  operation: OperationType;
  type: PropertyCategory;
  specs: string[];
  image: string;
};

const PLACEHOLDER_IMAGE = "/images/properties/placeholder.jpg";

export function toCard(item: EBPropertyListItem): PropertyCard {
  const op = primaryOperation(item.operations);
  const specs: string[] = [];
  if (item.bedrooms) specs.push(`${item.bedrooms} Rec.`);
  if (item.bathrooms) specs.push(`${item.bathrooms} Baños`);
  if (item.construction_size) specs.push(`${item.construction_size} m² const.`);
  if (item.lot_size) specs.push(`${item.lot_size} m² terreno`);

  return {
    id: item.public_id,
    title: item.title,
    location: item.location,
    price: op?.formatted_amount ?? "Precio a consultar",
    operation: op?.type ?? "sale",
    type: categoryFor(item.property_type),
    specs,
    image: item.title_image_full ?? PLACEHOLDER_IMAGE,
  };
}
