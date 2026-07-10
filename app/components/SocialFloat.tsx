"use client";
import { SOCIAL_LINKS } from "../lib/social";

export default function SocialFloat() {
  if (SOCIAL_LINKS.length === 0) return null;

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
    </div>
  );
}
