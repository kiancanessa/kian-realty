"use client";
import { usePathname } from "next/navigation";
import { SOCIAL_LINKS, WhatsAppIcon } from "../lib/social";
import { useLang } from "../lib/LangContext";
import { whatsappLink } from "../lib/sendInquiry";
// Jorge's personal WhatsApp — the site's main point of contact.
import { JORGE_WHATSAPP } from "../lib/contact";

// wa.me wants digits with Mexico's old mobile "1"; people read it without.
const WHATSAPP_DISPLAY = "+52 661 125 6107";

/** Floating social buttons, with the Jarames treatment: WhatsApp breathes
 *  with a pulse ring, and on hover or keyboard focus each button slides open
 *  to show where it goes. The accessible name is always there, visible or not.
 *  They pop in one by one once the opening curtain has lifted. */
export default function SocialFloat() {
  const pathname = usePathname();
  const { locale } = useLang();
  // Opens the chat already saying what the visitor was looking at, so the team
  // knows which property it is about from the first message.
  const property = pathname.match(/^\/propiedades\/([^/]+)$/)?.[1];
  const message = property
    ? (locale === "es"
      ? `Hola, me interesa la propiedad ${decodeURIComponent(property)}. ¿Me pueden dar más información?\nhttps://elcasarosaritogroup.com${pathname}`
      : `Hi, I'm interested in property ${decodeURIComponent(property)}. Could you send me more information?\nhttps://elcasarosaritogroup.com${pathname}`)
    : (locale === "es"
      ? "Hola, vi su sitio web y me gustaría información sobre propiedades en Rosarito."
      : "Hi, I saw your website and I'd like information about properties in Rosarito.");

  return (
    <div className="social-float">
      {SOCIAL_LINKS.map(({ name, href, Icon, color }, i) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
          className="social-fab" style={{ "--fab": color, "--i": i } as React.CSSProperties}>
          <span className="social-fab-icon"><Icon size={18} /></span>
          <span className="social-fab-label" aria-hidden>{name}</span>
        </a>
      ))}
      <a href={whatsappLink(JORGE_WHATSAPP, message)} target="_blank" rel="noopener noreferrer"
        aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
        className="social-fab social-fab-wa" style={{ "--fab": "#25D366", "--i": SOCIAL_LINKS.length } as React.CSSProperties}>
        <span className="social-fab-icon"><WhatsAppIcon size={22} /></span>
        <span className="social-fab-label" aria-hidden>{WHATSAPP_DISPLAY}</span>
      </a>
    </div>
  );
}
