"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "../lib/LangContext";
import { ArrowRight } from "lucide-react";
import type { PropertyCard } from "../lib/easybroker";
import { useReviewStats } from "../lib/useReviewStats";
import PropertyCardTile from "./PropertyCardTile";

type FilterKey = "all" | "house" | "apartment" | "land";

export default function Featured({ properties }: { properties: PropertyCard[] }) {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const reviewStats = useReviewStats();

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
  const visible = (filter === "all" ? properties : properties.filter(p => p.type === filter)).slice(0, 9);

  return (
    <section id="featured" ref={sectionRef} style={{ padding: "112px 24px", background: "rgb(var(--bg-alt))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div className="sage-line" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>{t.labels.portfolio}</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em" }}>
              {t.featured.title}
            </h2>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.38)", fontSize: "0.83rem", maxWidth: 260, lineHeight: 1.7 }}>
            {t.featured.subtitle}
          </p>
        </div>

        {properties.length === 0 ? (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)", fontSize: "0.9rem" }}>
            {t.featured.empty}
          </p>
        ) : (
          <>
            {/* Filter tabs */}
            <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{
                    padding: "9px 20px", borderRadius: 999, cursor: "pointer",
                    border: `1px solid ${filter === f ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`,
                    background: filter === f ? "rgb(var(--accent))" : "transparent",
                    color: filter === f ? "#FAF6EE" : "rgba(var(--ink),0.6)",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: filter === f ? 600 : 400,
                    transition: "all 0.3s",
                  }}>
                  {t.featured.filters[f]}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className="featured-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, maxWidth: 1200, margin: "0 auto" }}>
              {visible.map((p) => <PropertyCardTile key={p.id} p={p} inquireLabel={t.featured.inquire} stats={reviewStats[p.id]} />)}
            </div>
          </>
        )}

        {/* View all */}
        <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/propiedades" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 40px", border: "1px solid rgba(var(--accent),0.2)", color: "rgb(var(--accent))", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgb(var(--accent))"; (e.currentTarget as HTMLElement).style.background = "rgba(var(--accent),0.05)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--accent),0.2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            {t.featured.viewAll} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
