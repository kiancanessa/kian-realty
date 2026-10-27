"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackContactClick, trackLead, trackPageView, trackPropertyView, type LeadMethod } from "../lib/analytics";

const LEAD_BY_SOURCE: Record<string, LeadMethod> = {
  contact: "contact_form",
  property: "property_inquiry",
  quiz: "quiz",
  guide: "guide",
};

/** Where on the page a direct-contact link sits, so the report can say which one works. */
function placement(a: Element): string {
  // A section can name itself (data-placement), e.g. the legal advisor's contact.
  const named = a.closest("[data-placement]")?.getAttribute("data-placement");
  if (named) return named;
  if (a.closest(".social-float")) return "floating";
  if (a.closest(".pcb")) return "property_bar";
  if (a.closest("#team")) return "team";
  if (a.closest("#contact")) return "contact";
  if (a.closest("footer")) return "footer";
  return "page";
}

/** Reports what visitors do to Analytics / the Pixel, in one place, so no
 *  form or button has to know about either. Each helper is a no-op until the
 *  tools are configured and the visitor has accepted. */
export default function Tracker() {
  const pathname = usePathname();
  const firstRoute = useRef(true);

  // Page changes. The first page view is sent by the tools themselves.
  useEffect(() => {
    const property = pathname.match(/^\/propiedades\/([^/]+)$/);
    if (property) trackPropertyView(decodeURIComponent(property[1]));
    if (!firstRoute.current) trackPageView();
    firstRoute.current = false;
  }, [pathname]);

  // WhatsApp, phone and email links, wherever they are.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const href = a?.getAttribute("href") ?? "";
      if (!a) return;
      const where = { placement: placement(a), page_path: location.pathname };
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackContactClick("whatsapp", where);
      else if (href.startsWith("tel:")) trackContactClick("phone", where);
      else if (href.startsWith("mailto:")) trackContactClick("email", where);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Forms that save a lead. Watching the request, rather than each form, means
  // a new form is counted as soon as it posts to the same endpoint. The
  // original response is returned untouched.
  useEffect(() => {
    const original = window.fetch;
    const observed: typeof window.fetch = function (this: unknown, input, init) {
      const request = original.call(window, input, init);
      try {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
        if (method === "POST" && (url.includes("/api/inquiries") || url.includes("/api/property-interest") || url.includes("/api/alerts"))) {
          const body = typeof init?.body === "string" ? init.body : "";
          request.then(res => {
            if (!res.ok) return;
            if (url.includes("/api/property-interest")) return trackLead("interest");
            if (url.includes("/api/alerts")) return trackLead("alert");
            const source = (JSON.parse(body) as { source?: string }).source ?? "";
            trackLead(LEAD_BY_SOURCE[source] ?? "contact_form");
          }).catch(() => {});
        }
      } catch { /* measuring must never break a form */ }
      return request;
    };
    window.fetch = observed;
    return () => { if (window.fetch === observed) window.fetch = original; };
  }, []);

  return null;
}
