// Who we are in the shared-listing pool, who we read from, and who may read
// from us.
//
// Tokens live one per partner and per direction, never one shared secret:
// revoking one agency's access must not touch the others. `IN_*` is what a
// partner must send us; `OUT_*` is what we send that partner.
import type { BolsaAgency } from "./contract";

export const SITE_URL = "https://elcasarosaritogroup.com";

export const SELF: BolsaAgency = {
  slug: "ecr",
  name: "El Casa Rosarito",
  site: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
};

export type Partner = {
  slug: string;
  name: string;
  site: string;
  /** Base of the partner's bolsa API, without a trailing slash. */
  api: string;
  /** Env var holding the token this partner expects from us. */
  tokenEnv: string;
  /** Env var holding the token we expect from this partner. */
  incomingTokenEnv: string;
};

export const PARTNERS: Partner[] = [
  {
    slug: "jarames",
    name: "Jarames Group",
    site: "https://www.jaramesgroup.com",
    api: "https://www.jaramesgroup.com/api/bolsa/v1",
    tokenEnv: "BOLSA_OUT_JARAMES",
    incomingTokenEnv: "BOLSA_IN_JARAMES",
  },
  {
    slug: "lemus",
    name: "Grupo Lemus Realty",
    site: "https://lemusrealty.com",
    api: "https://lemusrealty.com/api/bolsa/v1",
    tokenEnv: "BOLSA_OUT_LEMUS",
    incomingTokenEnv: "BOLSA_IN_LEMUS",
  },
];

/** The partner's API base, overridable per environment (a preview deploy or
 *  a local server) with BOLSA_API_<SLUG>. */
export function apiBase(partner: Partner): string {
  return process.env[`BOLSA_API_${partner.slug.toUpperCase()}`] ?? partner.api;
}

export function partnerBySlug(slug: string): Partner | undefined {
  return PARTNERS.find(p => p.slug === slug);
}

/** A single switch to stop publishing and consuming without a deploy. */
export function bolsaEnabled(): boolean {
  return process.env.BOLSA_ENABLED !== "false";
}
