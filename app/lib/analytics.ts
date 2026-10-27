// Measurement for the lead funnel: Google Analytics 4 and the Meta Pixel.
//
// Nothing loads until an ID is set in the environment, and nothing is stored
// on a visitor's device until they accept: both tools start in "denied"
// consent mode and are switched on by the banner (ConsentBanner.tsx).
//
// Events are named after what the team cares about, not after the tools:
//   lead            a form or quiz was sent, or a property was marked as of interest
//   whatsapp_click / phone_click / email_click   a visitor reached for us directly
//   view_item       a property page was opened

const GA = process.env.NEXT_PUBLIC_GA_ID ?? "";
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
// The IDs end up inside inline <script>s, so only their exact shapes are let through.
export const GA_ID = /^G-[A-Z0-9]{4,20}$/.test(GA) ? GA : "";
export const META_PIXEL_ID = /^\d{6,20}$/.test(PIXEL) ? PIXEL : "";
export const trackingConfigured = Boolean(GA_ID || META_PIXEL_ID);

export const CONSENT_KEY = "ecr-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, string | number | undefined>;

/** Runs `send` once the tool's own script has set itself up. That script loads
 *  after the page hydrates, so a visit that lands straight on a property would
 *  otherwise report before anything is listening. Does nothing, and does not
 *  wait, for a tool that is not configured. */
function whenReady(tool: "gtag" | "fbq", send: (fn: (...args: unknown[]) => void) => void): void {
  if (tool === "gtag" ? !GA_ID : !META_PIXEL_ID) return;
  let tries = 0;
  const attempt = () => {
    const fn = window[tool];
    if (fn) send(fn);
    else if (++tries < 50) setTimeout(attempt, 100);
  };
  attempt();
}

export function storedConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(granted: boolean): void {
  try { localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied"); } catch { /* the choice just is not remembered */ }
  const v = granted ? "granted" : "denied";
  whenReady("gtag", gtag => gtag("consent", "update", { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v }));
  whenReady("fbq", fbq => fbq("consent", granted ? "grant" : "revoke"));
}

export type LeadMethod = "contact_form" | "property_inquiry" | "quiz" | "interest";

export function trackLead(method: LeadMethod, params: Params = {}): void {
  whenReady("gtag", gtag => gtag("event", "generate_lead", { method, ...params }));
  whenReady("fbq", fbq => fbq("track", "Lead", { content_category: method }));
}

export function trackContactClick(channel: "whatsapp" | "phone" | "email", params: Params = {}): void {
  whenReady("gtag", gtag => gtag("event", `${channel}_click`, params));
  whenReady("fbq", fbq => fbq("track", "Contact", { content_category: channel }));
}

export function trackPropertyView(id: string): void {
  whenReady("gtag", gtag => gtag("event", "view_item", { items: [{ item_id: id }] }));
  whenReady("fbq", fbq => fbq("track", "ViewContent", { content_ids: [id], content_type: "product" }));
}

/** A soft navigation: the Pixel does not notice it on its own. */
export function trackPageView(): void {
  whenReady("fbq", fbq => fbq("track", "PageView"));
}
