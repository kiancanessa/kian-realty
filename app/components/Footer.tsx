"use client";
import { useLang } from "../lib/LangContext";
import Logo from "./Logo";
import { SOCIAL_LINKS } from "../lib/social";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "rgb(var(--bg-alt))", borderTop: "1px solid rgba(var(--accent),0.1)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "rgb(var(--ink))", marginBottom: 4 }}>El Casa Rosarito</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>{t.nav.tagline}</div>
          </div>
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgba(var(--ink),0.2)", textAlign: "center" }}>{t.footer.tagline}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {SOCIAL_LINKS.map(({ name, href, Icon, color, hoverColor }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                style={{ width: 28, height: 28, borderRadius: "50%", background: color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = hoverColor}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = color}>
                <Icon size={13} />
              </a>
            ))}
          </div>
          <a href="#" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(var(--ink),0.2)", textDecoration: "none" }}>{t.footer.privacy}</a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.2)" }}>© {year} · {t.footer.rights}</span>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "24px auto 0", paddingTop: 20, borderTop: "1px solid rgba(var(--accent),0.08)", textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.05em", color: "rgba(var(--ink),0.25)" }}>
          Sitio web desarrollado por{" "}
          <a href="https://portafolio-kian-rho.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(var(--accent),0.7)", textDecoration: "none" }}>Kian Canessa</a>
        </span>
      </div>
    </footer>
  );
}
