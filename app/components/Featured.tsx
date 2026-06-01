"use client";
import { useRef, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";

const PROPERTIES = [
  { id: 1, title: "Oceanfront Villa", location: "Rosarito Beach", price: "$485,000", beds: 4, baths: 3, sqft: 280, image: "/images/prop1.jpg", tag: "New", bg: "#1a2a1a" },
  { id: 2, title: "Modern Condo", location: "Playas de Tijuana", price: "$1,800/mo", beds: 2, baths: 2, sqft: 110, image: "/images/prop2.jpg", tag: "Available", bg: "#1a1a2a" },
  { id: 3, title: "Beachfront Getaway", location: "El Sauzal, Ensenada", price: "$320,000", beds: 3, baths: 2, sqft: 200, image: "/images/prop3.jpg", tag: "Hot Deal", bg: "#2a1a10" },
];

export default function Featured() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 150));
      });
    }, { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="featured" ref={sectionRef} style={{ padding: "112px 24px", background: "#141414" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div className="gold-line" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C" }}>Portfolio</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#F5F0E8", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em" }}>
              {t.featured.title}
            </h2>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(245,240,232,0.38)", fontSize: "0.83rem", maxWidth: 260, lineHeight: 1.7 }}>
            {t.featured.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {PROPERTIES.map((p) => (
            <div key={p.id} className="reveal property-card" style={{ border: "1px solid rgba(201,168,76,0.1)", overflow: "hidden", transition: "border-color 0.4s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.35)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.1)"}>
              {/* Image */}
              <div style={{ position: "relative", height: 256, background: `linear-gradient(to bottom, ${p.bg}, #1E1E1E)`, overflow: "hidden" }}>
                <img src={p.image} alt={p.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, transition: "opacity 0.5s, transform 0.7s" }}
                  onError={e => (e.currentTarget.style.display = "none")}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                />
                {/* Placeholder */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.25)" }}>Add Photo</span>
                </div>
                {/* Tag */}
                <div style={{ position: "absolute", top: 16, left: 16, padding: "4px 12px", background: "#C9A84C", color: "#0A0A0A", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {p.tag}
                </div>
                {/* Price */}
                <div style={{ position: "absolute", bottom: 16, right: 16, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#F5F0E8" }}>
                  {p.price}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 24, background: "#1E1E1E" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#F5F0E8", fontWeight: 400, marginBottom: 6 }}>
                  {p.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                  <MapPin size={11} color="rgba(201,168,76,0.6)" />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(245,240,232,0.38)", letterSpacing: "0.06em" }}>{p.location}</span>
                </div>
                {/* Specs */}
                <div style={{ display: "flex", gap: 16, padding: "12px 0", borderTop: "1px solid rgba(201,168,76,0.1)", marginBottom: 16 }}>
                  {[{ icon: Bed, val: `${p.beds} ${t.featured.beds}` }, { icon: Bath, val: `${p.baths} ${t.featured.baths}` }, { icon: Square, val: `${p.sqft} ${t.featured.sqft}` }].map(({ icon: Icon, val }, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon size={12} color="rgba(201,168,76,0.5)" />
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(245,240,232,0.45)" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" style={{ display: "flex", alignItems: "center", gap: 8, color: "#C9A84C", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "gap 0.3s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = "16px"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = "8px"}>
                  {t.featured.inquire} <ArrowRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
          <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 40px", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C"; (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.05)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            {t.featured.viewAll} <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
