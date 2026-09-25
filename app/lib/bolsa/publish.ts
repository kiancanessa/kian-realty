// Our side of the pool: this agency's published listings, in the shared shape.
//
// Server-only. It reads the same two sources the public site reads (EasyBroker
// and the admin panel's own listings), so a listing can never be in the pool
// without being on our own site first.
import "server-only";
import {
  getAllProperties, getProperty, primaryOperation, categoryFor,
  type EBPropertyListItem, type EBPropertyDetail,
} from "../easybroker";
import { getPublishedOwnProperties, getOwnProperty, ownToDetail, isOwnPropertyId } from "../ownProperties";
import { SELF, SITE_URL } from "./partners";
import type { BolsaDetail, BolsaFeed, BolsaListing, BolsaType } from "./contract";
import { BOLSA_VERSION } from "./contract";

// EasyBroker's own Spanish type names, mapped to the pool's vocabulary. What
// is missing falls back to the site's own three-way category, which every
// listing has.
const TYPE_BY_NAME: Record<string, BolsaType> = {
  "Casa": "house",
  "Casa con uso de suelo": "house",
  "Casa en condominio": "apartment",
  "Departamento": "apartment",
  "Terreno": "land",
  "Terreno comercial": "commercial",
  "Local comercial": "commercial",
  "Oficina": "commercial",
  "Bodega": "commercial",
  "Edificio": "building",
  "Rancho": "ranch",
};

function bolsaType(propertyType: string): BolsaType {
  const named = TYPE_BY_NAME[propertyType];
  if (named) return named;
  const category = categoryFor(propertyType);
  return category === "land" ? "land" : category === "apartment" ? "apartment" : "house";
}

/** "Col. El Morro, Playas de Rosarito, Baja California" → city = the middle. */
function placeOf(location: string): { city: string | null; address: string } {
  const parts = location.split(",").map(s => s.trim()).filter(Boolean);
  return { city: parts.length > 1 ? parts[parts.length - 2] : null, address: location };
}

function listingFromEB(item: EBPropertyListItem): BolsaListing | null {
  const op = primaryOperation(item.operations);
  if (!op) return null;
  const { city, address } = placeOf(item.location);

  return {
    id: `${SELF.slug}-${item.public_id}`,
    externalId: item.public_id,
    url: `${SITE_URL}/propiedades/${item.public_id}`,
    operation: op.type,
    type: bolsaType(item.property_type),
    title: { es: item.title },
    summary: { es: address },
    price: {
      amount: op.amount,
      currency: op.currency === "MXN" ? "MXN" : "USD",
      unit: op.type === "rental" ? "monthly" : "total",
    },
    location: { zone: null, city, address, lat: null, lng: null },
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    parking: item.parking_spaces,
    construction: item.construction_size,
    lot: item.lot_size,
    photos: item.title_image_full ? [item.title_image_full] : [],
    updatedAt: null,
  };
}

/** The detail shape is shared by both sources (own listings are mapped into
 *  EasyBroker's), so one function covers them. */
function detailFrom(d: EBPropertyDetail): BolsaDetail | null {
  const op = primaryOperation(d.operations);
  if (!op) return null;
  const { city, address } = placeOf(d.location);
  const paragraphs = d.description.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  return {
    id: `${SELF.slug}-${d.public_id}`,
    externalId: isOwnPropertyId(d.public_id) ? null : d.public_id,
    url: `${SITE_URL}/propiedades/${d.public_id}`,
    operation: op.type,
    type: bolsaType(d.property_type),
    title: { es: d.title },
    summary: paragraphs[0] ? { es: paragraphs[0].slice(0, 180) } : { es: address },
    price: {
      amount: op.amount,
      currency: op.currency === "MXN" ? "MXN" : "USD",
      unit: op.type === "rental" ? "monthly" : "total",
    },
    location: {
      zone: null,
      city,
      address,
      lat: d.location_detail.latitude,
      lng: d.location_detail.longitude,
    },
    bedrooms: d.bedrooms,
    bathrooms: d.bathrooms,
    parking: d.parking_spaces,
    construction: d.construction_size,
    lot: d.lot_size,
    photos: d.property_images.map(img => img.url),
    updatedAt: null,
    description: { es: paragraphs },
    features: null,
  };
}

export async function buildFeed(): Promise<BolsaFeed> {
  const [ebItems, ownRows] = await Promise.all([getAllProperties(), getPublishedOwnProperties()]);

  const listings = [
    ...ownRows.map(row => detailFrom(ownToDetail(row))).map(d => d && stripDetail(d)),
    ...ebItems.map(listingFromEB),
  ].filter((l): l is BolsaListing => l !== null && l !== undefined);

  return { version: BOLSA_VERSION, agency: SELF, generatedAt: new Date().toISOString(), listings };
}

/** The list carries cards, not full text: the detail endpoint has the rest. */
function stripDetail(d: BolsaDetail): BolsaListing {
  const { description: _description, features: _features, ...listing } = d;
  return { ...listing, photos: listing.photos.slice(0, 1) };
}

/** One listing in full. `id` arrives with our agency prefix. */
export async function buildDetail(bolsaId: string): Promise<BolsaDetail | null> {
  const prefix = `${SELF.slug}-`;
  if (!bolsaId.startsWith(prefix)) return null;
  // Both id families are uppercase here ("EB-QL9176", "ECR-12"); a partner
  // that lower-cased the id on its side still finds the listing.
  const publicId = bolsaId.slice(prefix.length).toUpperCase();

  if (isOwnPropertyId(publicId)) {
    const row = await getOwnProperty(publicId);
    return row ? detailFrom(ownToDetail(row)) : null;
  }
  const property = await getProperty(publicId);
  return property ? detailFrom(property) : null;
}
