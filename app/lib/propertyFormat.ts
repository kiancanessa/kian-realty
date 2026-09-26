// Pure formatting shared by the server (ownProperties.ts, easybroker.ts) and
// by client components — chiefly the admin PropertyEditor, whose live preview
// must format a price exactly the way the public card will. Kept free of any
// server import so the browser bundle never pulls in the database client.
import type { OperationType } from "./easybroker";

export const PLACEHOLDER_IMAGE = "/images/properties/placeholder.svg";

/** Price as it appears on the card: "$400,000 USD", or "…/mo" for rentals. */
export function formatOwnPrice(
  price: number | null,
  currency: string,
  operation: OperationType,
): string | null {
  if (price === null) return null;
  const amount = price.toLocaleString("en-US");
  return operation === "rental" ? `$${amount} ${currency}/mo` : `$${amount} ${currency}`;
}

/** Form inputs arrive as strings; empty means "not specified", not zero. */
export function numOrNull(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
