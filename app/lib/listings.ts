// Single place where the two listing sources are merged: properties synced
// from EasyBroker and properties the agency publishes from the admin panel.
// Everything public (home grid, /propiedades, the quiz matcher) reads through
// here so the two sources can never drift apart.
import {
  getAllProperties, toCard, orderProperties, primaryOperation,
  type PropertyCard,
} from "./easybroker";
import { getPublishedOwnProperties, ownToCard } from "./ownProperties";

/** A card plus the numeric sale/rent amount, which PropertyCard itself does
 *  not carry (its `price` is a formatted display string and can't be compared). */
export type Listing = { card: PropertyCard; amount: number | null };

export async function getAllListings(): Promise<Listing[]> {
  const [ebItems, ownRows] = await Promise.all([getAllProperties(), getPublishedOwnProperties()]);

  const own: Listing[] = ownRows.map(row => {
    const n = Number(row.price);
    return { card: ownToCard(row), amount: Number.isFinite(n) ? n : null };
  });
  const eb: Listing[] = ebItems.map(item => ({
    card: toCard(item),
    amount: primaryOperation(item.operations)?.amount ?? null,
  }));

  // Own listings are placed ahead of EasyBroker ones, but orderProperties still
  // runs after: its hand-picked ids keep the top slots the agency explicitly
  // asked for, and because the sort is stable, the agency's own exclusive
  // listings then land ahead of the remaining EasyBroker inventory.
  return [...own, ...eb];
}

export async function getOrderedPropertyCards(): Promise<PropertyCard[]> {
  const listings = await getAllListings();
  return orderProperties(listings.map(l => l.card));
}
