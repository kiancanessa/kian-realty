"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "../lib/LangContext";
import { MapPin, ArrowRight } from "lucide-react";

const MEDIA: Record<string, { image: string; bg: string }> = {
  "oceanfront-villa": { image: "/images/properties/oceanfront-villa.jpg", bg: "#E3ECD9" },
  "modern-condo": { image: "/images/properties/modern-condo.jpg", bg: "#E0E3EC" },
  "beachfront-getaway": { image: "/images/properties/beachfront-getaway.jpg", bg: "#ECE3D9" },
  "k38-ocean-apartment": { image: "/images/k38-apartment/depa4.jpeg", bg: "#DCE3EC" },
  "rosarito-ocean-lot": { image: "/images/properties/land/1-beach.jpg", bg: "#E3E6D9" },
};

type FilterKey = "all" | "house" | "apartment" | "land";

export default function Featured() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 150));
      });
    }, { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filters: FilterKey[] = ["all", "house", "apartment", "land"];
  const visible = filter === "all" ? t.featured.properties : t.featured.properties.filter(p => p.type === filter);

  return (
    <section id="featured" ref={sectionRef} style={{ padding: "112px 24px", background: "#F0E7D8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div className="sage-line" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6B8A42" }}>{t.labels.portfolio}</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#23221E", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em" }}>
              {t.featured.title}
            </h2>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.38)", fontSize: "0.83rem", maxWidth: 260, lineHeight: 1.7 }}>
            {t.featured.subtitle}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "9px 20px", borderRadius: 999, cursor: "pointer",
                border: `1px solid ${filter === f ? "#6B8A42" : "rgba(107,138,66,0.25)"}`,
                background: filter === f ? "#6B8A42" : "transparent",
                color: filter === f ? "#FAF6EE" : "rgba(35,34,30,0.6)",
                fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: filter === f ? 600 : 400,
                transition: "all 0.3s",
              }}>
              {t.featured.filters[f]}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {visible.map((p) => (
            <Link key={p.slug} href={`/properties/${p.slug}`} className="property-card" style={{ display: "block", border: "1px solid rgba(107,138,66,0.1)", overflow: "hidden", transition: "border-color 0.4s", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.35)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.1)"}>
              {/* Image */}
              <div style={{ position: "relative", height: 256, background: `linear-gradient(to bottom, ${MEDIA[p.slug].bg}, #FFFFFF)`, overflow: "hidden" }}>
                <img src={MEDIA[p.slug].image} alt={p.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, transition: "opacity 0.5s, transform 0.7s" }}
                  onError={e => (e.currentTarget.style.display = "none")}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                />
                {/* Bottom fade for legibility */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.75), transparent 55%)" }} />
                {/* Tag */}
                <div style={{ position: "absolute", top: 16, left: 16, padding: "4px 12px", background: "#6B8A42", color: "#FAF6EE", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {p.tag}
                </div>
                {/* Price */}
                <div style={{ position: "absolute", bottom: 16, right: 16, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#FAF6EE" }}>
                  {p.price}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 24, background: "#FFFFFF" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#23221E", fontWeight: 400, marginBottom: 6 }}>
                  {p.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                  <MapPin size={11} color="rgba(107,138,66,0.6)" />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(35,34,30,0.38)", letterSpacing: "0.06em" }}>{p.location}</span>
                </div>
                {/* Specs */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", padding: "12px 0", borderTop: "1px solid rgba(107,138,66,0.1)", marginBottom: 16 }}>
                  {p.specs.map((s, i) => (
                    <span key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(35,34,30,0.45)" }}>{s}</span>
                  ))}
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B8A42", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {t.featured.inquire} <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
          <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 40px", border: "1px solid rgba(107,138,66,0.2)", color: "#6B8A42", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#6B8A42"; (e.currentTarget as HTMLElement).style.background = "rgba(107,138,66,0.05)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            {t.featured.viewAll} <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
