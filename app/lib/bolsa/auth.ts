// Who is allowed to read our feed.
import "server-only";
import { timingSafeEqual } from "node:crypto";
import { PARTNERS, bolsaEnabled } from "./partners";

/** Constant-time compare, so a wrong token can't be guessed by timing how
 *  long the answer takes. */
function sameToken(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** The partner behind an Authorization header, or null. Tokens that are not
 *  configured never match, so an empty env var cannot open the door. */
export function partnerFromRequest(request: Request): string | null {
  if (!bolsaEnabled()) return null;

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  for (const partner of PARTNERS) {
    const expected = process.env[partner.incomingTokenEnv];
    if (expected && sameToken(token, expected)) return partner.slug;
  }
  return null;
}

export function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

/** Feeds are per-partner data behind a token: never store them in a shared
 *  cache, and never let a browser or CDN hold on to them. */
export const NO_STORE = { "Cache-Control": "private, no-store" };
