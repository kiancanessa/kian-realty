"use client";
import { useState, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { locale, setLocale, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#featured", label: t.nav.properties },
    { href: "#about", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all 0.5s ease",
      background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
      padding: scrolled ? "12px 0" : "24px 0",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, letterSpacing: "0.08em", color: "#F5F0E8" }}>
            Kian Canessa
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.28em", color: "#C9A84C", textTransform: "uppercase" }}>
            Baja · Real Estate
          </span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hide-mobile">
          {links.map((l, i) => (
            <a key={i} href={l.href} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.55)", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.55)")}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }} className="hide-mobile">
          <div style={{ display: "flex", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 999, padding: 4, gap: 2 }}>
            {(["en", "es"] as const).map((lang) => (
              <button key={lang} onClick={() => setLocale(lang)}
                style={{ padding: "4px 14px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "all 0.3s",
                  background: locale === lang ? "#C9A84C" : "transparent",
                  color: locale === lang ? "#0A0A0A" : "rgba(245,240,232,0.4)",
                  fontWeight: locale === lang ? 600 : 400,
                }}>
                {lang}
              </button>
            ))}
          </div>
          <a href="#contact" style={{ padding: "10px 22px", border: "1px solid #C9A84C", color: "#C9A84C", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#C9A84C"; (e.currentTarget as HTMLElement).style.color = "#0A0A0A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#C9A84C"; }}>
            {t.nav.cta}
          </a>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,240,232,0.7)", display: "none" }} className="show-mobile">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "rgba(10,10,10,0.98)", borderTop: "1px solid rgba(201,168,76,0.1)", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {links.map((l, i) => (
            <a key={i} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            {(["en", "es"] as const).map((lang) => (
              <button key={lang} onClick={() => setLocale(lang)}
                style={{ padding: "6px 16px", border: `1px solid ${locale === lang ? "#C9A84C" : "#333"}`, background: "none", color: locale === lang ? "#C9A84C" : "#666", borderRadius: 999, fontFamily: "'Jost',sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
