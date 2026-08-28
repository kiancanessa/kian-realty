"use client";
import { SOCIAL_LINKS, WhatsAppIcon } from "../lib/social";

// Jorge's personal WhatsApp — the site's main point of contact.
const JORGE_WHATSAPP = "18186175047";

export default function SocialFloat() {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40, display: "flex", flexDirection: "column", gap: 10 }}>
      {SOCIAL_LINKS.map(({ name, href, Icon, color, hoverColor }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
          style={{
            width: 46, height: 46, borderRadius: "50%", background: color, color: "#FFFFFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(35,34,30,0.3)", transition: "all 0.3s", textDecoration: "none",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hoverColor; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = color; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
          <Icon size={18} />
        </a>
      ))}
      <a href={`https://wa.me/${JORGE_WHATSAPP}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        style={{
          width: 50, height: 50, borderRadius: "50%", background: "#25D366", color: "#FFFFFF",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(35,34,30,0.35)", transition: "all 0.3s", textDecoration: "none",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1EBE5A"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#25D366"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
        <WhatsAppIcon size={22} />
      </a>
    </div>
  );
}
