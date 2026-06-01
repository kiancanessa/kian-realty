"use client";
import { useLang } from "../lib/LangContext";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#141414", borderTop: "1px solid rgba(201,168,76,0.1)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "#F5F0E8", marginBottom: 4 }}>Kian Saavedra Canessa</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>Baja California · Real Estate</div>
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgba(245,240,232,0.2)", textAlign: "center" }}>{t.footer.tagline}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(245,240,232,0.2)", textDecoration: "none" }}>{t.footer.privacy}</a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(245,240,232,0.2)" }}>© {year} · {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
