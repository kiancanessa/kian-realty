"use client";
import Link from "next/link";
import { MapPin, ArrowRight, Star } from "lucide-react";
import type { PropertyCard } from "../lib/easybroker";
import { useLang } from "../lib/LangContext";
import type { ReviewStats } from "../lib/useReviewStats";
import FavoriteButton from "./FavoriteButton";

export default function PropertyCardTile({ p, inquireLabel, stats }: { p: PropertyCard; inquireLabel: string; stats?: ReviewStats }) {
  const { t } = useLang();
  const operationLabel = p.operation === "rental" ? t.property.forRent : t.property.forSale;
  const specs: string[] = [];
  if (p.bedrooms) specs.push(`${p.bedrooms} ${t.property.beds}`);
  if (p.bathrooms) specs.push(`${p.bathrooms} ${t.property.baths}`);
  if (p.constructionSize) specs.push(`${p.constructionSize} ${t.property.builtArea}`);
  if (p.lotSize) specs.push(`${p.lotSize} ${t.property.lotArea}`);

  return (
    <Link href={`/propiedades/${p.id}`} className="property-card" style={{ display: "flex", flexDirection: "column", height: "100%", border: "1px solid rgba(var(--accent),0.1)", overflow: "hidden", transition: "border-color 0.4s", textDecoration: "none" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--accent),0.35)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--accent),0.1)"}>
      {/* Image */}
      <div style={{ position: "relative", height: 288, flexShrink: 0, background: "linear-gradient(to bottom, rgba(var(--accent),0.15), rgb(var(--surface)))", overflow: "hidden" }}>
        <img src={p.image} alt={p.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, transition: "opacity 0.5s, transform 0.7s" }}
          onError={e => (e.currentTarget.style.display = "none")}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.75), transparent 55%)" }} />
        <div style={{ position: "absolute", top: 16, left: 16, padding: "4px 12px", background: "rgb(var(--accent))", color: "#FAF6EE", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {operationLabel}
        </div>
        <FavoriteButton propertyId={p.id} propertyTitle={p.title} propertyImage={p.image} size={16} style={{ position: "absolute", top: 12, right: 12 }} />
        <div style={{ position: "absolute", bottom: 16, right: 16, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#FAF6EE" }}>
          {p.price ?? t.property.priceOnRequest}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: 28, background: "rgb(var(--surface))", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "rgb(var(--ink))", fontWeight: 400 }}>
            {p.title}
          </h3>
          {stats && stats.count > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginTop: 6 }}>
              <Star size={13} color="rgb(var(--accent))" fill="rgb(var(--accent))" />
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgb(var(--ink))" }}>{stats.avg.toFixed(1)}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.4)" }}>({stats.count})</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
          <MapPin size={11} color="rgba(var(--accent),0.6)" />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(var(--ink),0.38)", letterSpacing: "0.06em" }}>{p.location}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", padding: "12px 0", borderTop: "1px solid rgba(var(--accent),0.1)", marginBottom: 16 }}>
          {specs.map((s, i) => (
            <span key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(var(--ink),0.45)" }}>{s}</span>
          ))}
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 8, color: "rgb(var(--accent))", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "auto" }}>
          {inquireLabel} <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}
