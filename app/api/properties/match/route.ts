import { NextRequest } from "next/server";
import { orderProperties, type PropertyCategory, type OperationType } from "../../../lib/easybroker";
import { getAllListings, type Listing } from "../../../lib/listings";

// Server-only route: keeps EASYBROKER_API_KEY off the client while letting the
// quiz ask "what matches?" without shipping the whole catalog to the browser.
// Reads through the merged listings layer, so the agency's own properties are
// matchable exactly like the EasyBroker ones.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const operation = params.get("operation") as OperationType | null;
  const type = params.get("type") as PropertyCategory | "any" | null;
  const budgetMax = params.get("budgetMax");
  const budgetMaxNum = budgetMax ? Number(budgetMax) : null;

  const listings = await getAllListings();

  const matchesFilters = (strict: boolean) =>
    listings.filter(({ card, amount }: Listing) => {
      if (operation && card.operation !== operation) return false;
      if (strict && type && type !== "any" && card.type !== type) return false;
      if (strict && budgetMaxNum && amount !== null && amount > budgetMaxNum) return false;
      return true;
    });

  // Graceful degradation: an exact match on type+budget can easily be empty
  // for a small catalog, and an empty "here's what matches" screen is worse
  // than a slightly broader one. Relax type/budget before giving up.
  let filtered = matchesFilters(true);
  if (filtered.length === 0) filtered = matchesFilters(false);
  if (filtered.length === 0) filtered = listings;

  const cards = orderProperties(filtered.map(l => l.card)).slice(0, 3);
  return Response.json({ properties: cards });
}
