"use client";
import { useLang } from "../lib/LangContext";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#F0E7D8", borderTop: "1px solid rgba(107,138,66,0.1)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "#23221E", marginBottom: 4 }}>El Casa Rosarito</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B8A42" }}>{t.nav.tagline}</div>
          </div>
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgba(35,34,30,0.2)", textAlign: "center" }}>{t.footer.tagline}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(35,34,30,0.2)", textDecoration: "none" }}>{t.footer.privacy}</a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(35,34,30,0.2)" }}>© {year} · {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
