import { NextRequest } from "next/server";
import { getAllProperties, toCard, categoryFor, primaryOperation, orderProperties, type PropertyCategory, type OperationType } from "../../../lib/easybroker";

// Server-only route: keeps EASYBROKER_API_KEY off the client while letting the
// quiz ask "what matches?" without shipping the whole catalog to the browser.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const operation = params.get("operation") as OperationType | null;
  const type = params.get("type") as PropertyCategory | "any" | null;
  const budgetMax = params.get("budgetMax");
  const budgetMaxNum = budgetMax ? Number(budgetMax) : null;

  const raw = await getAllProperties();

  // Filter on the raw EasyBroker items (which still carry the numeric
  // operation amount) rather than PropertyCard, whose `price` is already a
  // formatted display string ("$400,000 USD") and can't be compared.
  const matchesFilters = (strict: boolean) =>
    raw.filter(item => {
      const op = primaryOperation(item.operations);
      if (operation && op?.type !== operation) return false;
      if (strict && type && type !== "any" && categoryFor(item.property_type) !== type) return false;
      if (strict && budgetMaxNum && op && op.amount > budgetMaxNum) return false;
      return true;
    });

  // Graceful degradation: an exact match on type+budget can easily be empty
  // for a small catalog, and an empty "here's what matches" screen is worse
  // than a slightly broader one. Relax type/budget before giving up.
  let filtered = matchesFilters(true);
  if (filtered.length === 0) filtered = matchesFilters(false);
  if (filtered.length === 0) filtered = raw;

  const cards = orderProperties(filtered.map(toCard)).slice(0, 3);
  return Response.json({ properties: cards });
}
