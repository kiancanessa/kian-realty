// Alerts: "tell me when there are new properties like these, or when one drops
// in price".
//
// What a subscription watches is one of the search pages (casas, terrenos, a
// zone…): the same filter that page uses to list properties, so the alert and
// the page can never disagree.
//
// A subscriber is only mailed after confirming their address (double opt-in),
// every message carries an unsubscribe link, and the first message after
// confirming reports only what is new from then on.
import "server-only";
import { randomBytes } from "node:crypto";
import { getAllListings, type Listing } from "./listings";
import { getLanding, LANDINGS, type LandingKey } from "./landingPages";
import { pagePath, type Lang } from "./seoSlugs";

export const SITE = "https://elcasarosaritogroup.com";

export type AlertRow = {
  id: number; email: string; lang: Lang; page_key: LandingKey; status: "pending" | "active" | "unsubscribed";
  token: string; seen: Record<string, number | null>; created_at: string; confirmed_at: string | null; last_sent_at: string | null;
};

export const isAlertKey = (k: unknown): k is LandingKey => typeof k === "string" && LANDINGS.some(l => l.key === k);
export const newToken = () => randomBytes(24).toString("hex");
export const isEmail = (v: unknown): v is string =>
  typeof v === "string" && v.length <= 254 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(v);

/** The properties a subscription is watching right now. */
export async function watching(key: LandingKey): Promise<Listing[]> {
  const landing = getLanding(key);
  if (!landing) return [];
  return (await getAllListings()).filter(l => landing.matches(l.card));
}

/** Property → price, to compare against on the next run. */
export function snapshot(listings: Listing[]): Record<string, number | null> {
  return Object.fromEntries(listings.map(l => [l.card.id, l.amount]));
}

/** What changed since `seen`: properties that were not there, and ones whose price went down. */
export function changes(seen: Record<string, number | null>, now: Listing[]) {
  const fresh = now.filter(l => !(l.card.id in seen));
  const dropped = now.flatMap(l => {
    const was = seen[l.card.id];
    return typeof was === "number" && typeof l.amount === "number" && l.amount < was ? [{ listing: l, was }] : [];
  });
  return { fresh, dropped };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const T = {
  es: {
    confirmSubject: (label: string) => `Confirma tu aviso: ${label}`,
    confirmIntro: (label: string) => `Pediste que te avisemos de novedades en "${label}". Confirma tu correo para empezar a recibir los avisos.`,
    confirmButton: "Confirmar mi correo",
    confirmIgnore: "Si no fuiste tú, ignora este mensaje: no recibirás nada.",
    digestSubject: (label: string, n: number) => `${n === 1 ? "1 novedad" : `${n} novedades`} en ${label}`,
    fresh: "Propiedades nuevas", dropped: "Bajaron de precio", was: (p: string) => `antes ${p}`, view: "Ver propiedad",
    allPage: (label: string) => `Ver todas: ${label}`,
    unsubscribe: "Dejar de recibir estos avisos",
    footer: "El Casa Rosarito · Local 19 Módulo A, Quinta Plaza, Playas de Rosarito, B.C.",
  },
  en: {
    confirmSubject: (label: string) => `Confirm your alert: ${label}`,
    confirmIntro: (label: string) => `You asked us to let you know about news in "${label}". Confirm your email to start receiving them.`,
    confirmButton: "Confirm my email",
    confirmIgnore: "If this was not you, ignore this message: you will not receive anything.",
    digestSubject: (label: string, n: number) => `${n === 1 ? "1 update" : `${n} updates`} in ${label}`,
    fresh: "New properties", dropped: "Price drops", was: (p: string) => `was ${p}`, view: "View property",
    allPage: (label: string) => `See all: ${label}`,
    unsubscribe: "Stop receiving these alerts",
    footer: "El Casa Rosarito · Local 19 Módulo A, Quinta Plaza, Playas de Rosarito, B.C.",
  },
} as const;

const shell = (lang: Lang, inner: string, unsub?: string) => `<!doctype html><html lang="${lang}"><body style="margin:0;background:#F4ECDE;font-family:Arial,Helvetica,sans-serif;color:#1D2014;">
<div style="max-width:560px;margin:0 auto;padding:28px 20px;">
<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#47592B;margin-bottom:18px;">El Casa Rosarito</div>
${inner}
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #d9cdb6;font-size:11px;color:#6B6F5C;line-height:1.6;">${T[lang].footer}${unsub ? `<br><a href="${esc(unsub)}" style="color:#6B6F5C;">${T[lang].unsubscribe}</a>` : ""}</div>
</div></body></html>`;

export function confirmEmail(lang: Lang, label: string, url: string) {
  const t = T[lang];
  return {
    subject: t.confirmSubject(label),
    html: shell(lang, `<p style="font-size:16px;line-height:1.6;">${esc(t.confirmIntro(label))}</p>
<p style="margin:24px 0;"><a href="${esc(url)}" style="background:#6B8A42;color:#fff;text-decoration:none;padding:14px 26px;font-size:13px;letter-spacing:1px;text-transform:uppercase;">${t.confirmButton}</a></p>
<p style="font-size:13px;color:#6B6F5C;">${t.confirmIgnore}</p>`),
    text: `${t.confirmIntro(label)}\n\n${url}\n\n${t.confirmIgnore}`,
  };
}

function item(lang: Lang, l: Listing, was?: number) {
  const t = T[lang];
  const url = `${SITE}/propiedades/${l.card.id}`;
  const priceText = l.card.price ?? "";
  const wasText = was !== undefined ? ` (${t.was(`${was.toLocaleString("en-US")}`)})` : "";
  return {
    html: `<div style="padding:14px 0;border-top:1px solid #d9cdb6;"><div style="font-size:16px;font-weight:bold;">${esc(l.card.title)}</div>
<div style="font-size:13px;color:#6B6F5C;margin:2px 0 6px;">${esc(l.card.location)}</div>
<div style="font-size:15px;color:#47592B;">${esc(priceText)}${esc(wasText)}</div>
<a href="${esc(url)}" style="font-size:13px;color:#47592B;">${t.view} →</a></div>`,
    text: `- ${l.card.title} (${l.card.location}) ${priceText}${wasText}\n  ${url}`,
  };
}

export function digestEmail(
  lang: Lang, label: string, pageUrl: string, unsubscribeUrl: string,
  fresh: Listing[], dropped: { listing: Listing; was: number }[],
) {
  const t = T[lang];
  const MAX = 8;
  const f = fresh.slice(0, MAX).map(l => item(lang, l));
  const d = dropped.slice(0, MAX).map(x => item(lang, x.listing, x.was));
  const section = (title: string, rows: { html: string }[]) => rows.length ? `<h2 style="font-size:20px;font-weight:normal;margin:26px 0 4px;">${title}</h2>${rows.map(r => r.html).join("")}` : "";
  const textSection = (title: string, rows: { text: string }[]) => rows.length ? `${title}\n${rows.map(r => r.text).join("\n")}\n` : "";
  return {
    subject: t.digestSubject(label, fresh.length + dropped.length),
    html: shell(lang, `${section(t.fresh, f)}${section(t.dropped, d)}<p style="margin-top:26px;"><a href="${esc(pageUrl)}" style="color:#47592B;">${t.allPage(label)} →</a></p>`, unsubscribeUrl),
    text: `${textSection(t.fresh, f)}\n${textSection(t.dropped, d)}\n${t.allPage(label)}: ${pageUrl}\n\n${t.unsubscribe}: ${unsubscribeUrl}`,
  };
}

export const labelFor = (key: LandingKey, lang: Lang) => getLanding(key)?.copy[lang].h1 ?? key;
export const pageUrlFor = (key: LandingKey, lang: Lang) => `${SITE}${pagePath(key, lang)}`;
