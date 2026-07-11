"use client";
import { useState } from "react";
import { useLang } from "../lib/LangContext";
import type { PropertyCard } from "../lib/easybroker";
import PropertyCardTile from "./PropertyCardTile";

type TypeFilter = "all" | "house" | "apartment" | "land";
type OpFilter = "all" | "sale" | "rental";

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{
        padding: "9px 20px", borderRadius: 999, cursor: "pointer",
        border: `1px solid ${active ? "#6B8A42" : "rgba(107,138,66,0.25)"}`,
        background: active ? "#6B8A42" : "transparent",
        color: active ? "#FAF6EE" : "rgba(35,34,30,0.6)",
        fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: active ? 600 : 400,
        transition: "all 0.3s",
      }}>
      {children}
    </button>
  );
}

export default function PropertyGrid({ properties }: { properties: PropertyCard[] }) {
  const { t } = useLang();
  const [type, setType] = useState<TypeFilter>("all");
  const [op, setOp] = useState<OpFilter>("all");

  const typeFilters: TypeFilter[] = ["all", "house", "apartment", "land"];
  const opFilters: OpFilter[] = ["all", "sale", "rental"];

  const visible = properties
    .filter(p => type === "all" || p.type === type)
    .filter(p => op === "all" || p.operation === op);

  if (properties.length === 0) {
    return (
      <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.45)", fontSize: "0.9rem" }}>
        {t.featured.empty}
      </p>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {typeFilters.map(f => (
          <FilterButton key={f} active={type === f} onClick={() => setType(f)}>{t.featured.filters[f]}</FilterButton>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
        {opFilters.map(f => (
          <FilterButton key={f} active={op === f} onClick={() => setOp(f)}>{t.property.opFilters[f]}</FilterButton>
        ))}
      </div>

      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(35,34,30,0.4)", marginBottom: 24, letterSpacing: "0.05em" }}>
        {visible.length} {visible.length === 1 ? t.property.countSingular : t.property.countPlural}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {visible.map(p => <PropertyCardTile key={p.id} p={p} inquireLabel={t.featured.inquire} />)}
      </div>
    </div>
  );
}
