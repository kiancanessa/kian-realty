"use client";
import { useLang } from "../lib/LangContext";
import { useReviewStats } from "../lib/useReviewStats";
import type { PropertyCard } from "../lib/easybroker";
import PropertyCardTile from "./PropertyCardTile";

/** The listings of a search page: the same cards as the rest of the site. */
export default function LandingGrid({ properties }: { properties: PropertyCard[] }) {
  const { t } = useLang();
  const stats = useReviewStats();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
      {properties.map(p => <PropertyCardTile key={p.id} p={p} inquireLabel={t.featured.inquire} stats={stats[p.id]} />)}
    </div>
  );
}
